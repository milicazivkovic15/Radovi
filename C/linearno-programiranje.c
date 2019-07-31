/*
Problem iz Algoritamskih strategija - Linearno programiranje

Fabrika proizvodi 2 tipa hemikalija od iste sirovine. Tona prve hemikalije treba da sadrži 65%
sirovine, a tona druge hemikalije treba da sadrži 75% sirovine. Prilikom procesa proizvodnje hemikalija gubi
se 10% sirovine u obe. Zato je potrebno pre procesa proizvodnje obezbediti više sadržaja sirovine, kako bi
hemikalije kao proizvodi zadovoljili datu specifikaciju. Za svaku od hemikalija potreban je određen broj
radnih sati koji je potrebno utrošiti za proizvodnju jedne tone od svake. Poznate su ukupne zalihe sirovine,
ukupni zajednički skladišni prostor za obe hemikalije,ukupan broj dostupnih radnih sati i cena tone svake
hemikalije. Koliko tona od svake hemikalije fabrika treba da proizvede kako bi ostvarila maksimalnu dobit od
prodaje?
Rešenje problema predati u obliku programa fabrika.c. Program sa standardnog ulaza prihvata:
sirovina
skladište
ukupnosatiRada
sati1 sati2
cena1 cena2
, gde imamo redom raspoloživu količinu sirovine u tonama, skladišni prostor za obe hemikalije u
tonama, broj ukupnih radnih sati,broj sati potrebnih za proizvodnju tonu svake od hemikalija i cene obe
hemikalije na tržištu. Na standardni izlaz program ispisuje rešenje:
količina1 količina2
dobit
gde redom imamo količinu u tonama svake od hemikalija koje treba proizvesti i iznos dobiti od
njihove prodaje.

*/


#include<stdio.h>
#include<stdlib.h>

double **a,*b,*c,v;
int *BN;
int n,m;


void ucitaj()
{
	int i;
	n=2;
	m=3;
	a=(double**)malloc((n+m)*sizeof(double*));
	for (i = 0; i < n+m; i++)
	{
		a[i]=(double*)malloc((n+m)*sizeof(double));
	}
	b=(double*)malloc((n+m)*sizeof(double));
	c=(double*)malloc((n+m)*sizeof(double));
	BN=(int*)malloc((n+m)*sizeof(int));
	
	for (i = n; i <n+m; i++)
	{
		scanf("%lf",&b[i]);
		BN[i]=1;
		c[i]=0;
	}
	
	
	a[n][0]=0.715;
	a[n][1]=0.825;
	
	a[n+1][0]=1;
	a[n+1][1]=1;
	
	scanf("%lf",&a[n+2][0]);
	scanf("%lf",&a[n+2][1]);
	
	
	for (i = 0; i < n; i++)
	{
		scanf("%lf",&c[i]);
		b[i]=0;
		BN[i]=0;
	}
}

int ulaz(){
	
	int i;
	for (i = 0; i < n+m; i++)
	{
		if(BN[i]==0 && c[i]>0)
			return i;
	}
	return -1;
	
}

int izlaz(int e){
	int l=-1,i;
	double min;
	
	for (i = 0; i < n+m; i++)
	{
		if (BN[i]==1 && a[i][e]>0){
			if (l==-1 || b[i]/a[i][e]<min){
				min=b[i]/a[i][e];
				l=i;
			}
		}
	}
	return l;
	
}
void pivot(int e, int l){
	int i,j;
	b[e]=b[l]/a[l][e];
	for (j = 0; j < n+m; j++)
	{
		if(BN[j]==0 && j!=e)
			a[e][j]=a[l][j]/a[l][e];
	}
	a[e][l]=1/a[l][e];
	for (i = 0; i < n+m; i++)
	{
		if(BN[i]==1 && i!=l){
			b[i]-=a[i][e]*b[e];
			for (j = 0; j <n+m ; j++)
			{
				if(BN[j]==0 && j!=e)
					a[i][j]-=a[i][e]*a[e][j];
			}
			a[i][l]=-a[i][e]*a[e][l];
		}
	}
	v+=c[e]*b[e];

	for (j = 0; j < n+m; j++)
	{
		if(BN[j]==0 && j!=e)
			c[j]-=c[e]*a[e][j];
	}
	c[l]=-c[e]*a[e][l];
	BN[e]=1;
	BN[l]=0;	
	
	
	
}
int main(){
	
	int i,e,l;
	
	ucitaj();

	while((e=ulaz())!=-1){	
		l=izlaz(e);
		if(l==-1){
			printf("Ne moze");
			return 0;
		}
		pivot(e,l);
		
	}
	printf("%lf\n",v);
	for (i = 0; i < n; i++)
	{
		if(BN[i]==1)
			printf("%lf\t",b[i]);
		else
			printf("0\t");
	}
	
	return 0;
}
