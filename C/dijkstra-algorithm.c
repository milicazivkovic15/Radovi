/*
Problem Algoritamske strategije - Grafovi - Dijkstra algoritam

Na Dakar reliju za 2013. godinu prvi put učestvuje automobilska posada iz Srbije. Najmlađoj posadi u sastavu
Bojan Milanović i Darko Veljković je potrebna pomoć u savladavanju prve etape u Argentini. Mreža puteva kojom je
dozvoljeno kretanje u etapi sastavljena je od kontrolnih tačaka (numerisanih od 0) spojenih deonicama. Svaka
deonica ima svoju dužinu, maksimalnu dozvoljenu brzinu i težinu vozila. Naši vozači voze maksimalno dozvoljenom
brzinom i samo na deonicama koje mogu da izdrže njihovo vozilo, u oba smera. Automobil naše posade ima
utvrđenju potrošnju goriva na 100 pređenih kilometara. Tokom same vožnje kroz etapu, moguće je da će im nestati
goriva pre stizanja u krajnju kontrolnu tačku. Rezeorvar smeju da dopune samo u kontrolnim tačkama. Svaka dopuna
traje fiksno vreme i uvek se potpuno dopuni rezervoar bez obzira na već prisutnu količinu. Potrebno je da se dopuna
uradi pred deonicu na kojoj se očekuje nestanak goriva. Vozilo kreće sa punim rezervoarom. Ako su poznate početna
i krajnja kontrolna tačka etape, zadatak je da odrediti kojim putem (kroz koje kontrolne tačke) naša posada treba da
vozi kako bi u najkraćem vremenu prešla etapu i koje je to vreme. Pri tom treba odrediti i u kojim kontrolnim
tačkama posada treba da izvrši dosipanje goriva.
Rešenje u vidu programa predati u datoteci dakar.c (dakar.java i pratećih klasa). Program prihvata podatke
sa standardnog ulaza u formatu:
n
m
kts0 ktk0 brzina0 tezina0 duzina0
kts1 ktk1 brzina1 tezina1 duzina1
...
ktsm-1 ktkm-1 brzinam-1 tezinam-1 duzinam-1
tezinavozila
rezervoarvozila
potrosnjavozila
vremedopune
start kraj
gde su n i m redom brojevi kontrolnih tačaka i broj deonica, ktsi ktki brzinai tezinai duzinai su za deonicu
indeksiranu sa i redom indeksi kontrolnih tački na krajevim deonice, maksimalna brzina(km/h) i težina(tone) na
deonici, kao i dužina deonice(km). tezinavozila , rezervoarvozila , potrosnjavozila , vremedopune su redom težina vozila (tone),
zapremina rezeorvara u litrima, potrošnja u litrima na 100km i vreme (u satima) koliko traje dopuna rezervoara.
Na standardni izlaz program ispisuje podatke u formatu:
vremeetape
kt0 kt1 ... ktm
ktd0 ktd1 ... ktdr
gde su kti redom indeksi kontrolnih tačaka najbržeg puta na etapi od početne do kranje, ktdj redom
kontrolne tačke tog istog puta gde je vršena dopuna gorivom i vremeetape je ukupno vreme koje je posada utrošila u
putu na toj etapi.
Napomena : Indeksi kontrolnih tačaka, njihov broj i broj deonica su prirodni brojevi sa 0. Težina vozila,
potrošnja vozila, vreme dopune gorivom, dužina deonice, brzina deonice i dozvoljena težina na deonici su decimalni
brojevi. Nema deonice koja zahteva više goriva od ukupne zapremine rezervoara. Garantuje se postojanje puta od
startne do krajnje kontrolne tačke.
*/

#include<stdio.h>
#include<stdlib.h>

struct grana{
		int start;
		int kraj;
		double brzina;
		double tezina;
		double duzina;
	};

int jeManji(int i,int j){
	if (i==-1)
		return 0;
		
	if (j==-1)
		return 1;
	return i<j;
}

int nadjiMinimum(double *d,int*pos,int n){
	double min=-1;
	int minCvor=-1,i;
	for (i = 0; i < n; i++)
	{
		if(pos[i]==0 && jeManji(d[i],min)){
			min=d[i];
			minCvor=i;
		}
	}
	return minCvor;
	
}

double potrosnja,gorivo,rezervoar;

double dajGorivo(struct grana *grane,int u,int v,int m){
		int i;
		for (i = 0; i < m; i++)
		{
			if((grane[i].start==u && grane[i].kraj==v) || (grane[i].start==v && grane[i].kraj==u))
				return grane[i].duzina*potrosnja/100.0;
		}
		return -1;
		
}


void dijkstra(double **graf,double* d,int *pos,int *pret,int n){
	int u,v,i;
	
	for (i = 0; i < n; i++)
	{
		u=nadjiMinimum(d,pos,n);
		pos[u]=1;
		
		for (v = 0; v < n; v++)
		{
			if(pos[v]==0 && graf[u][v]!=-1 && jeManji(d[u]+graf[u][v],d[v])){
				d[v]=graf[u][v]+d[u];
				pret[v]=u;
				
			}
		}
		
	}
}

void rek(int start, int kraj, int *pret,double **graf, struct grana *grane,int m, double *vreme,double vremeD,int *punjenje,int END){
		(*vreme)+=graf[kraj][pret[kraj]];
		if (start==kraj){
			printf("%d\n",start);
			return;
		}
		rek(start,pret[kraj],pret,graf,grane,m,vreme,vremeD,punjenje,END);
		printf("%d\t",kraj);
		printf("%d-%d = %lf, g= %lf\n",kraj,pret[kraj],dajGorivo(grane,kraj,pret[kraj],m),gorivo);
				if (gorivo-dajGorivo(grane,kraj,pret[kraj],m)<=0){
					gorivo=rezervoar;
					punjenje[pret[kraj]]=1;
					(*vreme)+=vremeD;
				}
				gorivo-=dajGorivo(grane,kraj,pret[kraj],m);
			
		
}

int main(){
	
	struct grana * grane;
	double **graf,*d;
	int *pos,*pret;
	int n,m,i,j;
	
	scanf("%d%d",&n,&m);
	graf=(double**)malloc(n*sizeof(double*));
	d=(double*)malloc(n*sizeof(double));
	pos=(int*)malloc(n*sizeof(int));
	pret=(int*)malloc(n*sizeof(int));
	grane=(struct grana*)malloc(m*sizeof(struct grana));
	
	for (i = 0; i < n; i++)
	{
		graf[i]=(double*)malloc(n*sizeof(double));
		pos[i]=0;
		pret[i]=-1;
		d[i]=-1;
		for (j = 0; j < n; j++)
		{
			graf[i][j]=-1;
		}
		
	}
	for (i = 0; i < m; i++)
	{
		scanf("%d%d%lf%lf%lf",&grane[i].start,&grane[i].kraj,&grane[i].brzina,&grane[i].tezina,&grane[i].duzina);
	}
	
	double tezina,punjenjeGoriva;
	int start,kraj;
	
	int *punjenje;
	punjenje=(int*)malloc(n*sizeof(int));
	
	for (i = 0; i < n; i++)
	{
		punjenje[i]=-1;
	}
	
	
	scanf("%lf%lf%lf%lf%d%d",&tezina,&rezervoar,&potrosnja,&punjenjeGoriva,&start,&kraj);
	gorivo=rezervoar;
	for (i = 0; i < m; i++)
	{
		if(grane[i].tezina>=tezina && grane[i].duzina*potrosnja/100.0<=rezervoar)
			graf[grane[i].start][grane[i].kraj]=graf[grane[i].kraj][grane[i].start]=grane[i].duzina/grane[i].brzina;
	}
	
	d[start]=0;
	dijkstra(graf,d,pos,pret,n);
	
	
	double vreme=0;
	rek(start,kraj,pret,graf,grane,m,&vreme,punjenjeGoriva,punjenje,kraj);
	printf("\n\n");
	
	for (i = 0; i < n; i++)
	{
		if(punjenje[i]!=-1){
			printf("%d\t",i);
		}
	}
	printf("\n VREME %lf",vreme);
	
	
	
	return 0;
}
