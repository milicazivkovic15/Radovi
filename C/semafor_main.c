#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>

struct sembuf P_op[2], V_op[2];
ushort init_niz[2];

int main(){

	int key = ftok("semafor_vaspitacica.c" ,'A');
	int semID = semget(key, 2, 0666 | IPC_CREAT);
	if (semID == -1){
		perror("semget error");
		exit(1);
	}
	
	init_niz[0] = 1; 
	init_niz[1] = 0;
	
	if (semctl(semID, 0, SETALL, init_niz) == -1) printf("Greska\n");
	getchar();
	
	return 0;
}
