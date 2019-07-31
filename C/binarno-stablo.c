/*
Problem: Binarno stablo.    

Na ulazu se zadaje jedan karakter i ceo broj N, a zatim N reči. Za svaku reč treba odrediti broj
pojavljivanja unetog karaktera. Formirati binarno stablo čiji su elementi strukturе kojе sadržе
REC (unetu reč) i BROJ (broj pojavljivanja unetog karaktera u reči) i koje je uređeno u odnosu na
BROJ. Ispisati unete reči, ali tako da se najpre ispisuju reči sa najvedim brojem pojavljivanja datog
karaktera, pa u nerastudem poretku, u odnosu na broj pojavljivanja datog karaktera, ostale reči.
Koliko unetih reči ne sadrži zadati karakter?
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct n{
	char *rec;
	int broj;
	struct n *l, *r;
	};
	

void addNode(struct n **root, char *str, int num){
	struct n *new, *t, *t1;
	int i;
	new = (struct n *)malloc(sizeof(struct n));
	if(!new){
		printf("Greska u alociranju mem!\n");
		exit(0);
		}
	
	i = 0;
	while(str[i]) i++;
	str[i-1]='\0';
		
	new->rec = (char *)malloc(strlen(str) + 1);
	if(!new->rec){
		printf("Greska u alokaciji!\n");
		exit(0);
		}
	
	strcpy(new->rec, str);
	new->broj = num;
	new->l = new->r = NULL;
	if(!(*root)){
		(*root) = new;
		}
	else{
		t = (*root);
		while(t){
			t1 = t;
			if(num > t->broj) t = t->r;
			else t= t->l;
			}
		if(num > t1->broj) t1->r = new;
		else t1->l = new;
		}
	}

int broj(char *str, char C){
	int br = 0, i = 0;
	
	while(str[i]){
		if (str[i] == C) br++;
		i++;
		}
	return(br);
	}

int neSadrzi(struct n *root){
	int br = 0;
	
	if(root){
		if(root->broj == 0){
			br++;
			while(root->l){
				br++;
				root = root->l;
				}
			return br;
			}
		else neSadrzi(root->l);
		}
	else return 0;		
	}

void formTree(struct n **root, FILE *f){
	int N, i, num;
	char str[50], C;
	(*root) = NULL;
	C = fgetc(f); fgetc(f);
	fscanf(f,"%d", &N);
	fgetc(f);
	for(i = 0; i < N; i++){
		fgets(str, 50, f);
		num = broj(str, C);
		addNode(root, str, num);
		}
	}

void printTree(struct n *root){
	
	if(root){
		if(root->r) printTree(root->r);
		printf("%s\n", root->rec);
		if(root->l) printTree(root->l);
		}
	}

int main(int argc, char **argv){
	struct n *root;
	FILE *f;
	f = fopen(argv[1], "r");
	if(!f){
		printf("Greska u fajlu!\n");
		exit(0);
		}
	
	formTree(&root, f);
	printTree(root);
	printf("Broj cvorova koji ne sadrze uneto slovo je %d\n", neSadrzi(root));
	close(f);
	
	}
