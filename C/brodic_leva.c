//02.12.2015 21:32:00
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
	
	int key1 = ftok("brodic_main.c", 'a');
	int key2 = ftok("brodic_main.c", 'b');
		
	int semID1 = semget(key1, 4, 0666 | IPC_CREAT);
	int semID2 = semget(key2, 4, 0666 | IPC_CREAT);
	
	int k = 0;
	srand(time(NULL));
	
	while (1){
		while (k < K){
			k += rand()%10;
			printf("Trenutno ceka %d putnika.\n", k);
			sleep(2);
		}
		printf("Ima dovoljno putnika!\n");
		
		semop(semID1, &pop[0], 1);
			printf("Putnici ulaze sa leve obale!\n");
			k -= K;
			sleep(5);
		semop(semID2, &vop[1], 1);
	}
	
	return 0;
}
