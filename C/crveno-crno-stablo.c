/*     
Problem: Crveno-crno stablo.    

 Napisati program koji za n stringova sa ulaza formira crveno-crno stablo.
 Napisati funkciju koja za formirano stablo određuje broj čvorova sa jednim naslednikom.
 Napisati funkciju koja iz stabla briše čvor koji se završava slovom K unetom na ulazu.
 Stablo, pre i posle brisanja čvora, ispisati u neopadajudem poretku, a uz svaki čvor ispisati i informaciju o boji
čvora.*/
#include <stdio.h>
#include <stdlib.h>
enum {CRVENA,CRNA};
struct stablo{
	char *rec;
	int boja;
	struct stablo *levi,*desni,*roditelj;
};
#define novi(x) x=(struct stablo *)malloc(sizeof(struct stablo))

void lrotacija(struct stablo **p){
	struct stablo *t,*pom;
	t=*p;
	pom=t->desni;
	t->desni=pom->levi;
	if (pom->levi) pom->levi->roditelj=t;
	pom->roditelj=t->roditelj;
	if (t->roditelj)
		if (t==t->roditelj->levi) t->roditelj->levi=pom;
		else t->roditelj->desni=pom;
	pom->levi=t;
	t->roditelj=pom;
	*p=pom;
}

void drotacija(struct stablo **p){
	struct stablo *t,*pom;
	t=*p;
	pom=t->levi;
	t->levi=pom->desni;
	if (pom->desni) pom->desni->roditelj=t;
	pom->roditelj=t->roditelj;
	if (t->roditelj)
		if (t==t->roditelj->levi) t->roditelj->levi=pom;
		else t->roditelj->desni=pom;
	pom->desni=t;
	t->roditelj=pom;
	*p=pom;
}

void bojefix(struct stablo **p,struct stablo *z){
	struct stablo *y;
	while((z->roditelj)&&(z->roditelj->boja==CRVENA)){
		if (z->roditelj==z->roditelj->roditelj->levi){
			y=z->roditelj->roditelj->desni;
			if ((y!=NULL)&&(y->boja==CRVENA)){
				z->roditelj->boja=CRNA;
				y->boja=CRNA;
				z=z->roditelj->roditelj;
				z->boja=CRVENA;
			}
			else{
				if (z==z->roditelj->desni){
					z=z->roditelj;
					lrotacija(&z);
					z=z->levi;
				}
				z->roditelj->boja=CRNA;
				z=z->roditelj->roditelj;
				z->boja=CRVENA;
				drotacija(&z);
				if (z->roditelj==NULL) *p=z;
			}
		}
		else{
			y=z->roditelj->roditelj->levi;
			if ((y!=NULL)&&(y->boja==CRVENA)){
				z->roditelj->boja=CRNA;
				y->boja=CRNA;
				z=z->roditelj->roditelj;
				z->boja=CRVENA;
			}
			else{
				if (z==z->roditelj->levi){
					z=z->roditelj;
					drotacija(&z);
					z=z->desni;
				}
				z->roditelj->boja=CRNA;
				z=z->roditelj->roditelj;
				z->boja=CRVENA;
				lrotacija(&z);
				if (z->roditelj==NULL) *p=z;
			}
		}
	}
	(*p)->boja=CRNA;
}

void dodaj(struct stablo **p,struct stablo *z){
	struct stablo *tren,*pret;
	tren=*p;
	if (tren==NULL) *p=z;
	else{
		while (tren!=NULL){
			pret=tren;
			if (strcmp(z->rec,tren->rec)<0) tren=tren->levi;
			else tren=tren->desni;
		}
		if (strcmp(z->rec,pret->rec)<0) pret->levi=z; 
		else pret->desni=z;
		z->roditelj=pret;
	}
	bojefix(p,z);
}

struct stablo *form(){
	struct stablo *koren,*z;
	int n,i;
	char s[50];
	koren=NULL;
	printf("Unesi broj stringova:\n");
	scanf("%d",&n);
	for (i=0;i<n;i++){
		printf("Unesi string\n");
		scanf("%s",&s);
		novi(z);
		z->rec=(char *)malloc(strlen(s)+1);
		strcpy(z->rec,s);
		z->boja=CRVENA;
		z->levi=z->desni=z->roditelj=NULL;
		dodaj(&koren,z);
	}
	return(koren);
}

int brojcrnih(struct stablo *p,int nivo){
	if (p==NULL) return 0;
	if (nivo==3)
		if(p->boja==CRNA) return 1;
		else return 0;
	return(brojcrnih(p->levi,nivo+1)+brojcrnih(p->desni,nivo+1));
}

void obrisi(struct stablo **p,int k,struct stablo **q){
	struct stablo *t,*z;
	t=*p;
	if (t!=NULL){
		if (strlen(t->rec)!=k){
			novi(z);
			z->rec=(char *)malloc(strlen(t->rec));
			strcpy(z->rec,t->rec);
			z->boja=CRVENA;
			z->levi=z->desni=z->roditelj=NULL;
			dodaj(q,z);
			obrisi(&(t->levi),k,q);
			obrisi(&(t->desni),k,q);
		}
		else{
			obrisi(&(t->levi),k,q);
			obrisi(&(t->desni),k,q);
		}
		*p=t;
		free(*p);
	}
}

void ispis(struct stablo *p){
	if (p!=NULL){
		ispis(p->desni);
		printf("%s, ",p->rec);
		if (p->boja==CRVENA) printf("(crvena)\n");
		else printf("(crna)\n");
		ispis(p->levi);
	}
}

main(){
	struct stablo *koren,*koren2;
	int k;
	koren=form();
	ispis(koren);
	printf("Broj crnih cvorova na 3.nivou je %d.\n",brojcrnih(koren,1));
	koren2=NULL;
	printf("Unesi duzinu cvora za brisanje:\n");
	scanf("%d",&k);
	obrisi(&koren,k,&koren2);
	ispis(koren2);
	printf("Broj crnih cvorova na 3.nivou je %d.\n",brojcrnih(koren2,1));
	system("Pause");
}