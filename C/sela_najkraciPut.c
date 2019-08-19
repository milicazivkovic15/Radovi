/* 
Problem - grafovi

-->1. Kao i svakog leta Raja, Gaja i Vlaja su otišli na selo i jedva čekali da se čika Paja vrati iz Nemačke i
donese im gomilu poklona. Međutim, pošto ove godine nisu baš najbolje prošli u školi, čika Paja je rešio
da im zada jedan zadatak kako bi oni zaradili poklone.
Naime, čika Paja je dao zadatak da Raja, Gaja i Vlaja krenu iz njihovog Neradina i biciklama obiđu n
okolnih sela. Pri tome, na svakom putu između sela čika Paja je označio takozvane "štreberske tačke" gde
oni treba da stanu i pročitaju tacno po 10 strana knjige. Ako jednim putem prođu više puta, na svakoj
štreberskoj tački treba da se zaustave samo jednom.
Na polasku, čika Paja im daje mapu, na kojoj je se vidi koliko sela ima (tj. broj n), vide se direktni putevi
izmedju sela, kao i koliko štreberskih tačaka se nalazi na svakom direktnom putu izmedju dva sela.
Kada sva sela obiđu, oni treba čika Paji da pokažu kojim su putem išli i koliko su tačno strana pročitali.
Čika Paja ce doć po njih u poslednje selo koje su obišli i doneti im poklone.
Pomozite Raji, Gaji i Vlaji da uz što manje truda (tj što manje procitanih strana) dođu do poklona.
Ulazni fajl: u prvom redu se nalaze brojevi n i m, gde n označava broj sela, a m broj puteva između tih
sela. Nakon toga se u m redova nalaze po tri broja gde prva dva označavaju sela koja su povezana, a treći
broj označava broj štreberskih tačaka na tom putu..
2. Napisati program koji proverava da li se mogu obići svih n sela, a ako to nije moguće ispitati da li je bi
se izbacivanjem sela k (unosi se sa tastature) moglo obići preostalih n-1.
*/

#include<stdio.h>
#include<stdlib.h>


int ** alocate(int n)
{
	int i;
	int **a;
	a=(int **)malloc(n*sizeof(int*));
	for (i = 0; i < n; i++)
	 a[i]=(int *)malloc(n*sizeof(int));
	
	return a;
}

int** zero(int n)
{
	int i,j;
	int **a;
	a=alocate(n);
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		a[i][j]=0;
	return a;
}
int find(int i,int *niz)
{
	while(niz[i]!=-1)
		i=niz[i];
	return i;
}
int  conect(int i, int j, int *niz)
{
	if (i!=j)
	{
		niz[j]=i;
		return 1;
	}
	return 0;
}
void najkraciput(int **tez, int n)
{
	int *niz;
	niz=(int *)malloc(n*sizeof(int));
	int ukupno=0;
	int i,j,u,v,ui,vj;
	for (i=0;i<n;i++)
		niz[i]=-1;
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		if(tez[i][j]<1)
			tez[i][j]=999;
	int ind=0;
	int stepen;
	for (i=0;i<n;i++)
	{ 
		stepen=0;
		for (j=0;j<n;j++)
			stepen+=tez[i][j];
		if (stepen==999*n) ind++;
	}		
	
	while(ind<n-1)
	{
		int min=999;
		for (i=0;i<n;i++)
		for (j=0;j<n;j++)
			if (tez[i][j]<min)
			{
				min=tez[i][j];
				u=i;
				v=j;
			}
		ui=find(u,niz);
		vj=find(v,niz);
		
	
		if (conect(ui,vj,niz)==1)
		{
			++ind;
			ukupno+=min;
			printf("Putovali su iz sela %d do sela %d i naisli na %d streberskih tacaka\n",u,v,min);
		}
		
		tez[u][v]=999;
		tez[v][u]=999;
	}
	printf("Ukupno su procitali %d strana\n",ukupno*10);
}
int ** saberi(int **a, int **b, int n)
{
	int i,j;
	int **c;
	c=zero(n);
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		c[i][j]=a[i][j]+b[i][j];
	return c;
}

int ** pomnozi(int **a, int **b, int n)
{
	int i,j,k;
	int **c;
	c=zero(n);
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		for (k=0;k<n;k++)
		c[i][j]+=a[i][k]*b[k][j];
	return c;
}
int da_li(int **mat, int n)
{
	int i,j;
	for (i=0;i<n;i++)
	for (j=0;j<n;j++)
		if (mat[i][j]==0)
			return 0;
	return 1;
}
int Obici_sva_sela(int **mat, int n)
{
	int **o=zero(n);
	
	int **I=zero(n);
	int k,i;
	for (i=0;i<n;i++)
		I[i][i]=1;
	
	
	for (k=0;k<n;k++)
	{
		
		I=pomnozi(I,mat,n);
		o=saberi(I,o,n);
		if (da_li(o,n))
			return 1;
	}
	return 0;
}

int main()
{
	FILE *in =fopen("in.txt","r");
	
	int n,m,k,i,j;
	fscanf(in,"%d",&n);
	fscanf(in,"%d",&m);

	int **tez=zero(n);
	int **mat=zero(n);
	for (k=0;k<m;k++)
	{
		fscanf(in,"%d",&i);
		fscanf(in,"%d",&j);
		mat[i][j]=1;
		mat[j][i]=1;
		fscanf(in,"%d",&tez[i][j]);
		tez[j][i]=tez[i][j];
	}
	najkraciput(tez,n);
	if (Obici_sva_sela(mat,n)==0)
	{
		printf("Nije moguce obici sva sela\nUnesi broj sela za izbacivanje\n");
		scanf("%d",&k);
		for (i=0;i<n;i++)
		for (j=0;j<n;j++)
			if (i==k || j==k)
				mat[i][j]=1;
				
		if (Obici_sva_sela(mat,n))
			printf("Posle izbacivanja moguce je obici sva sela\n");
		else
			printf("Posle izbacivanja nije moguce je obici sva sela\n");
	}
	else
		printf("Moguce je obici sva sela\n");
	
	fclose(in);
	return 0;
}

