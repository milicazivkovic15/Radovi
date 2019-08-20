#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>

struct sembuf P_op[2], V_op[2];
ushort init_niz[2]; // koliko ima semafora

int main(){
	P_op[0].sem_num = 0; 
	P_op[0].sem_op = -1;
	P_op[0].sem_flg = SEM_UNDO;
	
	P_op[1].sem_num = 0; 
	P_op[1].sem_op = -1;
	P_op[1].sem_flg = SEM_UNDO;
	
	V_op[0].sem_num = 0;
	V_op[0].sem_op = +1;
	V_op[0].sem_flg = SEM_UNDO;
	
	V_op[1].sem_num = 0;
	V_op[1].sem_op = +1;
	V_op[1].sem_flg = SEM_UNDO;
	
	
	
	int key = ftok("semafor_vaspitacica.c",'A');
	int semID = semget(key, 2, 0666 | IPC_CREAT);
	if (semID == -1){
		perror("semget error");
		exit(1);
	}
	
	
	semop(semID, &P_op[0], 1);
	
	printf("Jedna vaspitacica ulazi\n");
 	sleep(20);
 	printf("Izlazi jedna vaspitacica\n");
 	
 	semop(semID, &V_op[1], 0);
 	getchar();
	
	return 0;
}
