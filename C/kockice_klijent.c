#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<signal.h>
#include<sys/types.h>
#include<sys/ipc.h>
#include<sys/msg.h>


typedef struct msg{
	long type;
	char poruka[30];
	int ID;
	int kocka;
	int trenutno;
	}MSG;	
	
	
MSG poruka;

int main()
{
	int pid=msgget(IPC_PRIVATE,0666);
	int serverID=msgget(ftok("server.c",'A'),0666|IPC_CREAT);
	poruka.ID=pid;
	printf("%d",poruka.ID);
	msgsnd(serverID,&poruka,sizeof(MSG)-sizeof(long),0);
	
	while(1)
	{	

		msgrcv(pid,&poruka,sizeof(MSG)-sizeof(long),0,0);
		if (!strcmp(poruka.poruka,"IGRAJ\n"))
			{
				printf("Unesite br kocke:\n");
				scanf("%d",&poruka.kocka);
				poruka.ID=pid;
				msgsnd(serverID,&poruka,sizeof(MSG)-sizeof(long),0);
			}
		else if (!strcmp(poruka.poruka,"ZAVRSIO SI\n") || !strcmp(poruka.poruka,"POJEDEN SI\n"))
		{
			printf("%s",poruka.poruka);
			//ukloni red
			return 0;
		}
	}	
	return 0;
}
