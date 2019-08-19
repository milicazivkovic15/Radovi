/*
Problem - grafovi

1. Kao i svakog leta Raja, Gaja i Vlaja su otišli na selo i jedva čekali da se čika Paja vrati iz Nemačke i
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
-->2. Napisati program koji proverava da li se mogu obići svih n sela, a ako to nije moguće ispitati da li je bi
se izbacivanjem sela k (unosi se sa tastature) moglo obići preostalih n-1.
*/

#include<stdio.h>
#include<stdlib.h>

int **Ucitavanje(FILE *f, int *n){
   int **a, j, i, m;
   
   fscanf(f, "%d", &m);
   
   a = (int **)malloc(m*sizeof(int *));
   for(i=0; i<m; i++)
      a[i] = (int *)malloc(m*sizeof(int));
   
   for(i=0; i<m; i++)
      for(j=0; j<m; j++)
	     fscanf(f, "%d", &a[i][j]);
      
   (*n) = m;

   return a;
}

int **NulaMatrica(int n){
   int **a, i, j;
   
   a = (int **)malloc(n*sizeof(int *));
   for(i=0; i<n; i++)
      a[i] = (int *)malloc(n*sizeof(int));
   
   for(i=0; i<n; i++)
      for(j=0; j<n; j++)
	     a[i][j] = 0;
   
   return a;
}

int **Jedinicna(int n){
	int **a, i, j;

	a = (int **)malloc(n*sizeof(int *));
	for(i=0; i<n; i++)
		a[i] = (int *)malloc(n*sizeof(int));

	for(i=0; i<n; i++)
		for(j=0; j<n; j++)
			if(i==j)
	    		a[i][j] = 1;
     		else
	    		a[i][j] = 0;

	return a;
}

int **Sabiranje(int **a, int **b, int n){
	int i, j, **c;
   	c = NulaMatrica(n);
   	
  	for(i=0; i<n; i++)
    	for(j=0; j<n; j++)
		     c[i][j] = a[i][j] + b[i][j];
     
	return c;
}

int **Mnozenje(int **a, int **b, int n)
{
	int i, j, k, **c;
	c = NulaMatrica(n);
	
	for(i=0; i<n; i++)
		for(j=0; j<n; j++)
			for(k=0; k<n; k++)
				c[i][j] += a[i][k] * b[k][j];
		
	return c;
}

void Ispisi(int **a, int n){
	int i,j;
       
	for(i=0; i<n; i++){
		for(j=0; j<n; j++)
			printf("%d ", a[i][j]);
			printf("\n");
	}
}

int NemaNula(int **a, int n){
    int i,j;
    for(i = 0; i < n; i++)
        for(j = 0; j < i; j++)
    		if(a[i][j] == 0)
				return 0;
	     
    return 1;//ima nula
} 

int povezan(int **a, int n){
	int **b, **c, i;
	b=NulaMatrica(n);
	c=Jedinicna(n);
	
	for (i=0; i<n-1; i++)
	{
		c=Mnozenje(a,c,n);
		b=Sabiranje(b,c,n);
		printf("printujem %d\n",NemaNula(b,n));
		if (NemaNula(b,n)==1)
			return 1;
	}
	
	return 0;
}

int graf(int **a, int n, int k){
	int **b, ind;
	ind = povezan(a,n);
	b = NulaMatrica(n-1);
	
	if(ind){
		printf("Greska:graf je vec povezan\n");
		exit(0);
	} else {
		int i,j,ii,jj;
		for(i=0; i<n-1; i++)
			for(j=0; j<n-1; j++){
				if(i<k)
					ii = i;
				else
					ii = i+1;
				if(j<k)
					jj = j;
				else
					jj = j+1;
				b[i][j] = a[ii][jj];
			}
			
		ind=povezan(b,n-1);		
	}
	
	return ind; 
}

int main(void){
	int n, **matrica;
	FILE *f;
	int ind;
	f = fopen("fajl.dat", "r");
	matrica = Ucitavanje(f, &n);
	fclose(f);
	Ispisi(matrica,n);
	ind=povezan(matrica,n);
	if (ind){
		printf("Vec jeste povezan!\n");
	} else {
		int k;
		scanf("%d",&k);
		if (graf(matrica,n,k)==1)
			printf("Izbacivanjem sela %d ne bi vise bilo povezano",k);
		else
			printf("Jos uvek je povezano!\n");
	}
	   
}

