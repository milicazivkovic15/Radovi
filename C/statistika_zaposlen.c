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
	struct osoba *zaposleni=(struct osoba*)malloc(n*sizeof(struct osoba));
	for (i=0;i<n;i++)
		msgrcv(serverID,&zaposleni[i],sizeof(struct osoba)-sizeof(long),2,0);
	for (i=0;i<n;i++)
	{
		a+=zaposleni[i].br1;
		b-=zaposleni[i].br2;
		c*=zaposleni[i].br3;
	}
	printf("%f %f %f\n",a,b,c);
	statistike.min=a;
	statistike.prosek=b;
	statistike.br=c;
	statistike.type=2;
	strcpy(statistike.poruka,"bla");
	printf("QID:%d\n",zaposleni[0].qid);
	msgsnd(zaposleni[0].qid,&statistike,sizeof(struct osoba)-sizeof(long),0);
	return 0;
}
