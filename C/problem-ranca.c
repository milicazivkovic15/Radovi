/*
Problem iz Algoritamskih strategija - Dinamicko programiranje - Ranac

U blizini grada Kragujevca se za 2012 godinu planira izgradnja hidrocentrale "Lepenica2k12"na reci Lepenici.
Nakon pazljivih proracuna, utvrdena je lokacija na kojoj je moguca izgradnja brane sa agregatima i pratecim
postrojenjem. Ta lokacija pruza maksimalni protok (u hiljadama m3=s u sekundi) u toku jednog dana i taj
protok iznosi V .
Da bi projekat krenuo u implementaciju, potrebno je odrediti koje agregate za proizvodnju struje ugraditi.
Postoji M razlicitih agregata u ponudi. Treba odabrati tako da bi se postigla optimalna proizvodnja elektricne
energije u smislu maksimalne zarade na nivou dnevne proizvodnje. Naime, za svaki agregat je data specikacija
koja odreduje koliko MW struje on proizvodi , Pi; i = 1::M, sa protokom od Fi > 1; i = 1::M, datim u hiljadu
m3=s. Takode je poznata i cena odrzavanja takvog agregata na svakih propustenih hiljadu m3=s vode u sekundi
preko Ci; i = 1::M. Ako je poznata cena prodaje 1MW struje CST, potrebno je odrediti na koje agregate podeliti
ukupni dnevni protok V i u kojoj kolicini da bi se maksimalno zaradilo posmatrano na nivou dana. Ogranicenje
je da je svi iznosi moraju da budu dati prirodnim brojevima. Jos vaznije, na svakom agregatu je dozvoljeno
pustati samo celobrojne umnoske protoka Fi, dakle Fi; 2Fi; 3Fi; ::: za svaki agregat i; i = 1::M, ili ih ne uracunati
u realizaciju.
Resenje ovog problema dati u vodi programa hidro.c na programskom jeziku C. Program sa standardnog
ulaza prihvata redom podatke:
V
M
F1 P1 C1
: : :
FM PM CM
CST
, a na standardni izlaz ispisuje redom
a1 fa1
: : :
al fal
, gde je aj ; j = 1::l indeks odabranog agregata iz 1::M, a faj(= kaj * Faj ) protok koji se na njemu planira u
hiljadama m3=s.
*/


#include<stdio.h>
#include<stdlib.h>

int main(){
	
	int * p,*f,*c;
	int m,V,CST,i,j;
	scanf("%d%d%d",&m,&V,&CST);
	m++;
	V++;
	p=(int*)malloc(m*sizeof(int));
	c=(int*)malloc(m*sizeof(int));
	f=(int*)malloc(m*sizeof(int));
	
	int *optF,*agr,*brojA;
	
	optF=(int*)malloc(V*sizeof(int));
	agr=(int*)malloc(V*sizeof(int));
	brojA=(int*)malloc(m*sizeof(int));
	
	
	
	for (i = 1; i < m; i++)
	{
		scanf("%d%d%d",&p[i],&c[i],&f[i]);
	}
	optF[0]=0;
	agr[0]=0;
	for (i = 1; i < V; i++)
	{
		
		optF[i]=0;
		agr[i]=0;
		for (j = 1; j < m; j++)
		{
			if(f[j]<=i){
				if(p[j]*CST-c[j]*f[j]+optF[i-f[j]]>optF[i]){
					optF[i]=p[j]*CST-c[j]*f[j]+optF[i-f[j]];
					agr[i]=j;
				}
				
			}
		}
		
	}
	
	for (i = V-1; i >0 ; )
	{
		brojA[agr[i]]++;
		i-=f[agr[i]];
	}
	for (i = 1; i < m; i++)
	{
		if (brojA[i]>0)
			printf("Agregat %d iskoriscen %d\n",i,brojA[i]*f[i]);
	}
	
	
	return 0;
}

/*
in: 13
4
2 10 2000
4 25 3500
5 30 4000
7 40 5000
3500
*/

/*
out:
2     8     
3     5
*/
