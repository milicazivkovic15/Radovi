#include<stdio.h>
#include<mpi.h>
#include<stdlib.h>
#include<time.h>

typedef struct {
		int tip;
		int jacinaDejstva;
}Polje;

int main(int argc, char **argv){
	
	int id,numproc,i,j,x,y,*poKoliko,po,pocetna,*pocetneAdrese,jj;
	MPI_Init(&argc,&argv);
	MPI_Comm_rank(MPI_COMM_WORLD,&id);
	MPI_Comm_size(MPI_COMM_WORLD,&numproc);
	MPI_Datatype typepolje;
	
    MPI_Type_contiguous(2, MPI_INT, &typepolje);
    MPI_Type_commit(&typepolje);
	
	srand(time(NULL)*id);
	
	int m,n,B;
	Polje **matrica;
	B=10;
	if (id==0){
		printf("Unesite m i n:\n");
		scanf("%d%d",&m,&n);
	
		printf("Broj koraka B je : %d \n",B);
		
		pocetneAdrese=(int*)calloc(m,sizeof(int));
		poKoliko=(int*)malloc(m*sizeof(int));
		matrica=(Polje**)malloc(m*sizeof(Polje*));
		for (i = 0; i < m; i++)
		{
			matrica[i]=(Polje*)malloc(n*sizeof(Polje));	
		}
		
		
		int kor=(int)(2*m*n/100);
		int anti=(int)(18*m*n/100);
		int met=m*n-kor-anti;
		
		printf("Korozije ima:%d, Antikorozije ima: %d, metala ima : %d\n\n",kor,anti,met);
		
		for (i = 0; i < kor;)
		{
			x=rand()%m;
			y=rand()%n;
			
			if (matrica[x][y].tip==0) {
				matrica[x][y].tip=1;
				matrica[x][y].jacinaDejstva=rand()%100;
				i++;
			}
		}
		for (i = 0; i < anti;)
		{
			x=rand()%m;
			y=rand()%n;
			
			if (matrica[x][y].tip==0) {
				matrica[x][y].tip=2;
				matrica[x][y].jacinaDejstva=rand()%20+1;
				i++;
			}
		}
		for (i = 0; i < met;)
		{
			x=rand()%m;
			y=rand()%n;
			
			if (matrica[x][y].tip==0) {
				matrica[x][y].tip=3;
				matrica[x][y].jacinaDejstva=rand()%10000;
				i++;
			}
		}
		poKoliko[0]=m/numproc;
		po=m/numproc;
		pocetneAdrese[0]=0;
		pocetna=0;
		for (i = 1; i < numproc; i++)
		{
			pocetneAdrese[i]+=poKoliko[i-1]+pocetneAdrese[i-1];

			if (m%numproc==0) poKoliko[i]=m/numproc;
			else{
				if (i<numproc-m%numproc)
					poKoliko[i]=m/numproc;
				else
					poKoliko[i]=m/numproc+1;
			}	
			MPI_Send(&poKoliko[i],1,MPI_INT,i,10,MPI_COMM_WORLD);
			MPI_Send(&pocetneAdrese[i],1,MPI_INT,i,20,MPI_COMM_WORLD);

		}
	}
	else{
		MPI_Recv(&po,1,MPI_INT,0,10,MPI_COMM_WORLD,NULL);
		MPI_Recv(&pocetna,1,MPI_INT,0,20,MPI_COMM_WORLD,NULL);
	}
	MPI_Bcast(&m,1,MPI_INT,0,MPI_COMM_WORLD);
	MPI_Bcast(&n,1,MPI_INT,0,MPI_COMM_WORLD);
	if(id>0){
		matrica=(Polje**)malloc(m*sizeof(Polje*));
		for (i = 0; i < m; i++)
		{
			matrica[i]=(Polje*)malloc(n*sizeof(Polje));	
		}
	}
  	//ANTIKOROZIJA
	for(i=0; i<m; i++)
	{
		MPI_Bcast(matrica[i], n, typepolje, 0, MPI_COMM_WORLD);
	}
	while(B){
	MPI_Barrier(MPI_COMM_WORLD);
	for (i = pocetna; i < pocetna+po; i++)
	{
		for (j = 0; j < n; j++)
		{
			if (matrica[i][j].tip==2){
					for (jj = j-1; jj < j+2; jj++)
					{
						if(jj<n && j>0){
							if (i>0)
								if (matrica[i-1][jj].tip==1){
									matrica[i-1][jj].jacinaDejstva-=matrica[i][j].jacinaDejstva;
									if (matrica[i-1][jj].jacinaDejstva<=0){
										matrica[i-1][jj].jacinaDejstva=rand()%10000;
										matrica[i-1][jj].tip=3;
									}
								}
							if (i<pocetna+po-1)
								if (matrica[i+1][jj].tip==1){
									matrica[i+1][jj].jacinaDejstva-=matrica[i][j].jacinaDejstva;
									if (matrica[i+1][jj].jacinaDejstva<=0){
										matrica[i+1][jj].jacinaDejstva=rand()%10000;
										matrica[i+1][jj].tip=3;
									}
								}
						}
					}
					if (j>0 && matrica[i][j-1].tip==1){
						matrica[i][j-1].jacinaDejstva-=matrica[i][j].jacinaDejstva;
						if (matrica[i][j-1].jacinaDejstva<=0){
							matrica[i][j-1].jacinaDejstva=rand()%10000;
							matrica[i][j-1].tip=3;
						}
					}
					if (j<n && matrica[i][j+1].tip==1){
						matrica[i][j+1].jacinaDejstva-=matrica[i][j].jacinaDejstva;	
						matrica[i][j+1].jacinaDejstva-=matrica[i][j].jacinaDejstva;
						if (matrica[i][j+1].jacinaDejstva<=0){
							matrica[i][j+1].jacinaDejstva=rand()%10000;
							matrica[i][j+1].tip=3;
						}
					}		
				
			}
			
			
			
		}
		
	}
	MPI_Barrier(MPI_COMM_WORLD);
	
	//KOROZIJA
	for (i = pocetna; i < pocetna+po; i++)
	{
		for (j = 0; j < n; j++)
		{
			if (matrica[i][j].tip==1){
					for (jj = j-1; jj < j+2; jj++)
					{
						if(jj>0 && jj<n){
							if (i>0)
								if (matrica[i-1][jj].tip==3){
									matrica[i-1][jj].jacinaDejstva-=matrica[i][j].jacinaDejstva;
								
								}
							if (i<pocetna+po-1)
								if (matrica[i+1][jj].tip==3){
									matrica[i+1][jj].jacinaDejstva-=matrica[i][j].jacinaDejstva;
								
								}
						}
					}
					if (j>0 && matrica[i][j-1].tip==3){
						matrica[i][j-1].jacinaDejstva-=matrica[i][j].jacinaDejstva;
						
					}
					if (j<n && matrica[i][j+1].tip==3){
						matrica[i][j+1].jacinaDejstva-=matrica[i][j].jacinaDejstva;	
						matrica[i][j+1].jacinaDejstva-=matrica[i][j].jacinaDejstva;
						
					}		
				
			}		
		}
		
	}
	B--;
}
if (id==0)
	for (i = 0; i < m; i++)
	{
		for (j = 0; j < n; j++)
		{
			if (matrica[i][j].tip==1) 
				printf("(i,j)=(%d,%d) ",i,j);
		}
		
	}

	
	


	MPI_Finalize();
	return 0;
}
