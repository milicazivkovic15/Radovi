#include<string.h>
#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/msg.h>
#include<sys/ipc.h>
#include<signal.h>

struct osoba{
		long type;
		char poruka[30];
		int br1;
		int br2;
		int br3;
		int qid;
	};
	
struct statistika{
		long type;
		char poruka[30];
		float prosek;
		float min;
		float br;
	};


int main()
{
	int serverID=msgget(ftok("statistika_server.c",'A'),IPC_CREAT|0666);
	int n,i;
	float a=0,b=0,c=1;
	struct statistika statistike;
	printf("Unesi n\n");
	scanf("%d",&n);
	struct osoba *studenti=(struct osoba*)malloc(n*sizeof(struct osoba));
	for (i=0;i<n;i++)
		msgrcv(serverID,&studenti[i],sizeof(struct osoba)-sizeof(long),1,0);
	for (i=0;i<n;i++)
	{
		a+=studenti[i].br1;
		b-=studenti[i].br2;
		c*=studenti[i].br3;
	}
	statistike.min=a;
	statistike.prosek=b;
	statistike.br=c;
	printf("%f %f %f\n",a,b,c);
	statistike.type=1;
	strcpy(statistike.poruka,"bla");
	
	printf("QID:%d\n",studenti[0].qid);
	msgsnd(studenti[0].qid,&statistike,sizeof(struct osoba)-sizeof(long),0);
	return 0;
}
