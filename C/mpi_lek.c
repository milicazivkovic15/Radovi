/* Problem - Paralelno programiranje */

#include<stdio.h>
#include<mpi.h>
#include<stdlib.h>
#include<time.h>



int main(int argc, char **argv){
	
	int id,numproc,i;
	MPI_Init(&argc,&argv);
	MPI_Comm_rank(MPI_COMM_WORLD,&id);
	MPI_Comm_size(MPI_COMM_WORLD,&numproc);
	
	int N,M,a,*udaljenosti,*poKoliko,*pocetneAdrese,po,pocetna;
	srand(time(NULL)*id);
	if(id==0){
		printf("Unesite N,M,a:\n");
		scanf("%d%d%d",&N,&M,&a);
		udaljenosti=(int*)malloc(sizeof(int)*N);
		poKoliko=(int*)malloc(sizeof(int)*N);
		pocetneAdrese=(int*)calloc(N,sizeof(int));
		for (i = 0; i < N; i++)
		{
			udaljenosti[i]=rand()%500+500;
		}
		poKoliko[0]=N/numproc;
		po=N/numproc;
		pocetneAdrese[0]=0;
		pocetna=0;
		for (i = 1; i < numproc; i++)
		{
			pocetneAdrese[i]+=poKoliko[i-1]+pocetneAdrese[i-1];
			if(N%numproc==0)
				poKoliko[i]=N/numproc;
			else{
				if (i<numproc-N%numproc)
					poKoliko[i]=N/numproc;
				else
					poKoliko[i]=N/numproc+1;
			}
			MPI_Send(&poKoliko[i],1,MPI_INT,i,10,MPI_COMM_WORLD);
			MPI_Send(&pocetneAdrese[i],1,MPI_INT,i,20,MPI_COMM_WORLD);
		}	
//		if(N%numproc==0)
//			poKoliko=N/numproc;
//		else{
//			poKoliko=N/numproc+1;
//		}
	}
	else{
		MPI_Recv(&po,1,MPI_INT,0,10,MPI_COMM_WORLD,NULL);
		MPI_Recv(&pocetna,1,MPI_INT,0,20,MPI_COMM_WORLD,NULL);
	}
	MPI_Bcast(&N,1,MPI_INT,0,MPI_COMM_WORLD);
	if(id>0)
		udaljenosti=(int*)malloc(sizeof(int)*N);
	MPI_Bcast(&a,1,MPI_INT,0,MPI_COMM_WORLD);
	MPI_Bcast(&M,1,MPI_INT,0,MPI_COMM_WORLD);
	MPI_Bcast(udaljenosti,N,MPI_INT,0,MPI_COMM_WORLD);
//	MPI_Bcast(&poKoliko,1,MPI_INT,0,MPI_COMM_WORLD);
//	MPI_Scatter(udaljenosti,poKoliko,MPI_INT,moje_udaljenosti,poKoliko,MPI_INT,0,MPI_COMM_WORLD);
	
	int alive=1;
	float m=0;
	while(alive){
		for (i = pocetna; i < pocetna+po; i++)
		{
			if (udaljenosti[i]<=50){
				//napad
				m+=(a/(udaljenosti[i]+1));
				udaljenosti[i]=10000;
			}
			if(udaljenosti[i]!=10000)
				udaljenosti[i]-=rand()%udaljenosti[i];
		}
		alive=0;
		for (i = pocetna; i < po+pocetna; i++)
		{
			if (udaljenosti[i]>50 && udaljenosti[i]!=10000) {
				alive=1;
				break;
			}
		}
	}
	float sum;
	MPI_Reduce(&m,&sum,1,MPI_FLOAT,MPI_SUM,0,MPI_COMM_WORLD);
	
	if (id==0){
		M-=sum;
		if (M<=0) printf("Lek je delovao\n");
		else printf("Lek nije delovao\n");
	}
	
	
	MPI_Finalize();
	return 0;
}
