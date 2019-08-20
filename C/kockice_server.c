#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<signal.h>
#include<sys/types.h>
#include<sys/ipc.h>
#include<sys/msg.h>
#define POLJE 30

typedef struct msg{
	long type;
	char poruka[30];
	int ID;
	int kocka;
	int trenutno;
	
	}MSG;
	
MSG poruka;
int key;
int pid;
MSG niz[4];

void zavrsio (MSG iti, MSG niz[],int br)
{
	int i;
	for (i=0;i<br;i++)
	{
		strcpy(poruka.poruka,"IZGUBIO SI\n");
		msgsnd(niz[i].ID,&poruka,sizeof(MSG)-sizeof(long),0);
	}
	//oslobodi red;
	
}

int main()
{
	int i,br,k,j;
	key=ftok("server.c",'A');
	pid=msgget(key,0666|IPC_CREAT);
	
	
	for (i=0;i<4;i++)
	{
		msgrcv(pid,&poruka,sizeof(MSG)-sizeof(long),0,0);
		niz[i].ID=poruka.ID;
		niz[i].trenutno=0;
		printf("PID %d igraca je: %d\n",i+1,poruka.ID);
	}
	i=0;
	br=4;
	
	while(br>1)
	{	
		if (i==4) i=0;

		strcpy(poruka.poruka,"IGRAJ\n");

		msgsnd(niz[i].ID,&poruka,sizeof(MSG)-sizeof(long),0);
		msgrcv(pid,&poruka,sizeof(MSG)-sizeof(long),0,0);
		
		for (j=0;j<br;j++)
			if (niz[j].trenutno==niz[i].trenutno+poruka.kocka) 
				break;
		if (poruka.kocka+niz[i].trenutno>=POLJE) 
		{
			
			strcpy(poruka.poruka,"ZAVRSIO SI\n");
			msgsnd(niz[j].ID,&poruka,sizeof(MSG)-sizeof(long),0);
			zavrsio(niz[j],niz,br);
			return 0;
		}
		else if (j<br)
		{
		
			strcpy(poruka.poruka,"POJEDEN SI\n");
			msgsnd(niz[j].ID,&poruka,sizeof(MSG)-sizeof(long),0);
			for (k=j;k<br;k++)
				niz[k]=niz[k+1];
			--br;
			niz[i].trenutno+=poruka.kocka;
		}
		else
			niz[i].trenutno+=poruka.kocka;
		
		if(br==1) 
		{
			strcpy(poruka.poruka,"ZAVRSIO SI\n");
			msgsnd(niz[j].ID,&poruka,sizeof(MSG)-sizeof(long),0);
			zavrsio(niz[j],niz,br);
		}
		i++;
	}
	return 0;
}
