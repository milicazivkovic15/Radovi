#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>

struct sembuf pop[2], vop[2];
int K;
int initNiz[2];

int main(){
	int key = ftok("brodic_main.c",'A');
	int semID = semget(key, 2, 0666 | IPC_CREAT);
	
	pop[0].sem_num = 0; // mutex
	pop[0].sem_op = -1;
	pop[0].sem_flg = 0;
	
	vop[0].sem_num = 0;
	vop[0].sem_op = +1;
	vop[0].sem_flg = 0;
	
	pop[1].sem_num = 1;
	pop[1].sem_op = -1;
	pop[1].sem_flg = 0;
	
	vop[1].sem_num = 1;
	vop[1].sem_op = +1;
	vop[1].sem_flg = 0;
	
	
	initNiz[0] = 1;
	initNiz[1] = 0;
	semctl(semID, 0, SETALL, initNiz);
	
	return 0;
}