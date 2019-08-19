/* Problem - Naci najveci poligon od ucitanih tacaka */
#include<cuda_runtime.h>
#include<stdio.h>
#include<stdlib.h>
#include<math.h>

#define TPB 16

__global__ void calculate(double *x, double *y, double *z, double *out, int n){
		int index=threadIdx.x+blockIdx.x*blockDim.x;
		__shared__ double temp[TPB];
		
		
		if (index+2<n){
			temp[threadIdx.x]=sqrt((x[index]-x[0]) * (x[index]-x[0])+ (y[index]-y[0])* (y[index]-y[0])+ (z[index]-z[0])* (z[index]-z[0]));
		}
	__syncthreads();
	if (threadIdx.x==0){
		double s=temp[0];
		int i ;
		for(i=1;i<TPB;i++){
			if (temp[i]>s) s=temp[i];
		}
		out[blockIdx.x]=s;
	}
}

int main(int argc, char **argv){
	
	double *x,*y,*z,*out,*d_x,*d_y,*d_z,*d_out;
	
	
	FILE *f=fopen("tacke.txt","r");
	int n;
	fscanf(f,"%d",&n);
	n++;	
	
	int size=sizeof(double)*n, outSize=sizeof(double)*(n-2+TPB-1)/TPB,i;

	cudaMalloc((void**)&d_x,size);
	cudaMalloc((void**)&d_y,size);
	cudaMalloc((void**)&d_z,size);
	cudaMalloc((void**)&d_out,outSize);

	x=(double*)malloc(size);
	y=(double*)malloc(size);
	z=(double*)malloc(size);
	out=(double*)malloc(outSize);
	
	fscanf(f,"%lf%lf%lf",&(x[0]),&(y[0]),&(z[0]));
	double minx=x[1],miny=y[1],minz=z[1];
	double maxx=x[1],maxy=y[1],maxz=z[1];

	for(i=2;i<n;i++){
		
		fscanf(f,"%lf%lf%lf",&(x[i]),&(y[i]),&(z[i]));
		x[0]+=x[i];
		if (x[i]<minx) minx=x[i];
		else maxx=x[i];
		y[0]+=y[i];
		if (y[i]<miny) miny=y[i];
		else maxy=y[i];
		z[0]+=z[i];
		if (z[i]<minz) minz=z[i];
		else maxz=z[i];
	}
	x[0]/=(n-1);
	y[0]/=(n-1);
	z[0]/=(n-1);

	

	cudaMemcpy(d_x,x,sizeof(double*)*n,cudaMemcpyHostToDevice);
	cudaMemcpy(d_y,y,sizeof(double*)*n,cudaMemcpyHostToDevice);
	cudaMemcpy(d_z,z,sizeof(double*)*n,cudaMemcpyHostToDevice);

	calculate<<<(n-2+TPB-1)/TPB,TPB>>>(d_x,d_y,d_z,d_out,n);
	
	cudaMemcpy(out,d_out,outSize,cudaMemcpyDeviceToHost);
	
	double max=-9999;
	for (i=0;i<(n-2+TPB-1)/TPB;i++){
		if (max<out[i]) max=out[i];
	}
	printf("Precnik sfere je : %lf \n x=%lf y=%lf z=%lf\n",max,x[0],y[0],z[0]);
	fclose(f);
	return 0;
}
