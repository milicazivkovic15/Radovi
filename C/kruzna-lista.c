/*
Problem - Kruzna lista

Ogrlica je napravljena od roze i belih kuglica. Napraviti kružnu listu u kojoj svaki element
odgovara jednoj kuglici, pri čemu je roze kuglica predstavljena slovom R, a bela slovom B.
Kuglice, tj. elementi liste, se unose dok se ne unese karakter “0” (nula). Odrediti dužinu najdužeg
dela ogrlice koji je sastavljen samo od roze kuglica. Ispisati formiranu listu i traženu dužinu dela
ogrlice.
*/

#include <stdio.h>
#include <stdlib.h>

struct e{
	char k;
	struct e *next;
	};

void addElem(struct e **start, char c){
	struct e *t, *new;
	
	new = (struct e *)malloc(sizeof(struct e));
	if(!new){
		printf("Greska u alokaciji!\n");
		exit(0);
		}
	new->k = c;
	
	if(!(*start)){
		(*start) = new;
		new->next = (*start);		
		}
	else{
		t = (*start);
		while(t->next != (*start)) t = t->next;
		t->next = new; new->next = (*start);
		}
	}

void form(struct e **start, FILE *f){
	int ok;
	char c;
	struct e *t;
	
	(*start) = NULL;
	
	while((c = fgetc(f)) != '0'){
		addElem(start,c);
		fgetc(f);
		}
	
	}

void printList(struct e *start){
	struct e *t;
	
	t=start;
	do{
		printf("%c", t->k);
		t = t->next;
		}while(t != start);
	}

int broj(struct e *start){
	struct e *t;
	int max = 0, br, ok;
	
	t = start;
	ok = 0;
	if(t){
	do{
		if(t->k == 'B'){
			start = t;
			ok = 1;
			}
		t = t->next;
		}while((t != start) && (!ok));
	}	
	
	t = start;
	do{
		if(t->k == 'R'){
			br = 0;
			while((t->k == 'R') && (t!=start)){
				br++;
				t = t->next;
				}
			if(br > max) max = br;
			if(t == start) return max;
			}
		t = t->next;
		}while(t != start);
	return max;
	}

int main(int argc, char **argv){
	struct e *start, *from, *t;
	FILE *f;
	int max = 0, ok;
	f = fopen(argv[1], "r");
	if(!f){
		printf("Greska pri otvaranju fajla!\n");
		exit(0);
		}
	form(&start, f);
	printList(start);
	close(f);
	
	printf("\nTrazena duzina je: %d\n", broj(start));
	}
