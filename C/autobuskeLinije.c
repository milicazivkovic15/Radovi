/*
Problem - grafovi
U državi Nabu svaka dva grada koja su bliža od 100km povezana su direktnom autobuskom
linijom. Izuzetak su turističke linije koje mogu biti i duže od 100km. Ako nisu svi gradovi povezani,
ispitati da li bi uvođenjem jedne autobske linije svi gradovi bilo međusobno povezani. Takođe
odštampati gradove kroz koje se prolazi u putu iz grada x u grad y (unose se sa tastatutre).
Podaci za učitavanje su dati u datoteci na sledeći način: U prvoj linije se nalazi broj gradova, a ispod
toga se redom nalaze svi parovi gradova tako što prvo stoji id prvog grada, pa id drugog grada, pa
udaljenost tih gradova i na kraju oznaka da li postoji turistička linija između ta dva grada („T“ ili „N“
*/

#include<stdio.h>
#include<stdlib.h>

int** alocate(int n)
{
	int i;
	int **a;
	a=(int**)malloc(n*sizeof(int *));
	for (i = 0; i < n; i++)
	{
		a[i]=(int*)malloc(n*sizeof(int));
	}
	return a;
}
int ** zero (int n)
{
	int i,j;
	int **a=alocate(n);
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		a[i][j]=0;
	return a;
}
int ** saberi(int **a, int **b, int n)
{
	int i,j;
	int **c=alocate(n);
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		c[i][j]=a[i][j]+b[i][j];
	return c;
}

int ** pomnozi(int **a, int **b, int n)
{
	int i,j,k;
	int **c=zero(n);
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		for (k=0;k<n;k++)
			c[i][j]+=a[i][k]*b[k][j];
	return c;
}
int isfull(int **mat, int n)
{
	int i,j;
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		if (mat[i][j]==0)	
			return 0;
	return 1;
}
int da_li(int **mat, int n)
{
	int **o=zero(n);
	int **I=zero(n);
	int i;
	
	for (i=0;i<n;i++)
		I[i][i]=1;
	for (i=0;i<n;i++)
	{
		I=pomnozi(I,mat,n);
		o=saberi(I,o,n);
		if (isfull(o,n))
			return 1;
	}
	return 0;
}

void pretraga1(int **mat,int *posetio,int *stek,int *brp, int n,int tren, int j, int *mm)
{
	if (stek[tren]==j) return;
	int i;
	 stek[(*mm)++]=tren;
	posetio[tren]=1;
	(*brp)++;
	if (*brp==n) return;
	
	
	
	for (i=0;i<n;i++)	
		if (mat[tren][i]==1 && posetio[i]==0)
		{
			pretraga1(mat,posetio,stek,brp,n,i,j,mm);
			//--(*mm);
		}
}
int main()
{
	FILE *in=fopen("in1.txt","r");
	int i,j,n,d,k;
	char c;
	 
	fscanf(in,"%d",&n);
	int **mat=zero(n);
	
	for (k=0;k<n;k++)
	{
		fscanf(in,"%d",&i);
		fscanf(in,"%d",&j);
		fscanf(in,"%d",&d);
		getc(in);
		fscanf(in,"%c",&c);
		printf("%d %d %d %c\n",i,j,d,c);
		if ((d<100 && c=='N') || c=='T')
		{
				mat[i][j]=1;
				mat[j][i]=1;
		}
	}
	for (i=0;i<n;i++){
		for (j=0;j<n;j++)
			printf("%d\t",mat[i][j]);
			printf("\n");}
	if (da_li(mat,n))
		printf("Svi gradovi su povezani\n");
	else
	{
		printf("Nisu svvi gradovi povezani\n Unesite linuju(g1 g2 udaljenost T/N)\n");
		scanf("%d",&i);
		scanf("%d",&j);
		scanf("%d",&d);
		getchar();
		scanf("%c",&c);
		if ((d<100 && c=='N') || c=='T')
		{
			mat[i][j]=1;
			mat[j][i]=1;
		}
		if (da_li(mat,n))
			printf("Sada su svi gradovi povezani\n");
		else
			printf("I dalje nisu svi gradovi povezani\n");
		
	}
	int ii,jj;
	printf("Unesite gradove X i Y\n");
	scanf("%d",&ii);
	scanf("%d",&jj);
	int *stek=(int*)malloc(n*sizeof(int));
	int *posetio=(int*)malloc(n*sizeof(int));
	stek[0]=ii;
	for (i=0;i<n;i++)
		posetio[i]=0;
	posetio[stek[0]]=1;
	
	int brp=0,nn=0;
	pretraga1(mat,posetio,stek,&brp,n,ii,jj,&nn);
	printf("Gradove koje je posetio su:\n");
	for (i=0;i<nn;i++)
		printf("%d\t",stek[i]);
		
	fclose(in);
	return 0;
}
