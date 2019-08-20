/*
Upotrebom semafora napraviti kontrolu rada ove tri vrste procesa imajući u vidu da:
1. Brodic ima stalan kapacitet, npr. K.
2. Brodic uvek kreće sa leve obale, putuje, iskrca putnike na desnoj, sačeka da se napune
kapaciteti, pa se vraća na levu obalu, putuje, iskrca itd ...
3. Na obali se nalazi kondukter, koji vodi evidenciju o putnicima koji čekaju na prevoz. Kada ih
se nakupi dovoljno on ih, ako je brodić tu, pusti da se ukrcaju, mahne kapetanu da vozi, a
broj ljudi koji čekaju na prevoz smanji za k.
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <time.h>
#include <signal.h>
#include <unistd.h>
#define K 20

struct sembuf pop[4] = {{0,-1,SEM_UNDO},{1,-1,SEM_UNDO},{2,-1,SEM_UNDO},{3,-1,SEM_UNDO}};
struct sembuf vop[4] = {{0,+1,SEM_UNDO},{1,+1,SEM_UNDO},{2,+1,SEM_UNDO},{3,+1,SEM_UNDO}};

int initNiz[4];

int main(){
	int key3 = ftok("brodic_main.c", 'c');
	int key4 = ftok("brodic_main.c", 'd');
	
	int semID3 = semget(key3, 4, 0666 | IPC_CREAT);
	int semID4 = semget(key4, 4, 0666 | IPC_CREAT);
	
	int k = 0;
	srand(time(NULL));
	
	while (1){
		while (k < K){
			k += rand()%10;
			printf("Trenutno ceka %d putnika.\n", k);
			sleep(2);
		}
		printf("Ima dovoljno putnika!\n");
		
		semop(semID3, &pop[2], 1);
			printf("Putnici ulaze sa desne obale!\n");
			k -= K;
			sleep(5);
		semop(semID4, &vop[3], 1);
	}
	
	return 0;
}
