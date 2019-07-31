/*
Problem iz Algoritamskih strategija - Grafovi - Floyd Warshall algoritam

Neka je data mreža gradova numerisanih brojevima i neka su poznate udaljenosti
između gradova koji su direktno povezani. Veza između svaka 2 grada je dvosmerna. Za
svaki grad je potrebno da odredimo najkraće udaljenosti od tog grada do svih ostalih. Od
svih najkraćih udaljenosti biramo najveću i nazivamo rasponom mreže za taj grad.
Potrebno je odrediti grad sa najmanjim rasponom mreže i koliki iznosi taj raspon.
Napisati program gradovi.c koji sa standardnog ulaza prihvata podatke:
brojGradova
brojGrana
a1 b1 duzina1
a2 b2 duzina2
...
abrojGrana bbrojGrana duzinabrojGrana
,a na standardni izlaz ispisuje
grad
raspon
*/

#include <stdio.h>
#include <stdlib.h>

#define INF -1
#define NEDEFINISANO -2
#define TRUE 1
#define FALSE 0

int manji(int x, int y) {
	if (x==INF)
		return FALSE;

	if (y==INF)
		return TRUE;

	return (x<y);
}

int main() {
	int **graf, **rast, **pret;
	int *raspon;
	int brGradova, brGrana;
	int i, j, k, u, v, w;
	int minRaspon, minGrad;

	scanf("%d%d",&brGradova,&brGrana);

	graf=(int **)malloc(brGradova*sizeof(int *));
	rast=(int **)malloc(brGradova*sizeof(int *));
	pret=(int **)malloc(brGradova*sizeof(int *));
	raspon=(int *)malloc(brGradova*sizeof(int));

	for (i=0; i<brGradova; i++) {
		graf[i]=(int *)malloc(brGradova*sizeof(int));
		rast[i]=(int *)malloc(brGradova*sizeof(int));
		pret[i]=(int *)malloc(brGradova*sizeof(int));
	}

	for (i=0; i<brGradova; i++)
		for (j=0; j<brGradova; j++) {
			graf[i][j]=INF;
			rast[i][j]=INF;
			pret[i][j]=NEDEFINISANO;
		}

	for (i=0; i<brGrana; i++) {
		scanf("%d%d%d",&u,&v,&w);
		graf[u][v]=graf[v][u]=w;
		rast[u][v]=rast[v][u]=w;
		pret[u][v]=u;
		pret[v][u]=v;
	}

	for (i=0; i<brGradova; i++) {
		graf[i][i]=0;
		rast[i][i]=0;
	}


	for (k=0; k<brGradova; k++)
		for (i=0; i<brGradova; i++)
			for (j=0; j<brGradova; j++)
			{
				if (i!=j && j!=k && i!=k)
				{
					if (rast[i][k]!=INF && rast[k][j]!=INF)
					{
						if (manji(rast[i][k]+rast[k][j], rast[i][j]))
						{
							rast[i][j]=rast[i][k]+rast[k][j];
							pret[i][j]=pret[k][j];
						}
					}
				}
			}

	for (i=0; i<brGradova; i++) {
		raspon[i]=rast[i][0];
		for (j=1; j<brGradova; j++) {
			if (manji(raspon[i],rast[i][j])) {
				raspon[i]=rast[i][j];
			}
		}
	}

	minRaspon = raspon[0];
	minGrad=0;

	for (i=1; i<brGradova; i++) {
		if (manji(raspon[i],minRaspon)) {
			minRaspon = raspon[i];
			minGrad = i;
		}
	}

	printf("\nGrad sa min. rasponom: %d\n", minGrad);
	printf("Minimalni raspon: ");
    if (minRaspon!=INF)
        printf("%d\n", minRaspon);
    else
        printf("INF\n");

	return 0;
}

