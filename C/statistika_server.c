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
	int qid=msgget (ftok("statistika_server.c",'A'),IPC_PRIVATE);
	int n,i;
	printf ("Unesi n:\n");
	scanf("%d",&n);
	struct osoba *studenti=(struct osoba*)malloc(n*sizeof(struct osoba));
	struct osoba *zaposleni=(struct osoba*)malloc(n*sizeof(struct osoba));
	struct statistika statistike[2];
	printf("Unesite podatke o studentima");
	for (i=0;i<n;i++)
	{
		scanf("%d",&studenti[i].br1);
		
		scanf("%d",&studenti[i].br2);
		
		scanf("%d",&studenti[i].br3);
		studenti[i].type=1;
		studenti[i].qid=qid;
		strcpy(studenti[i].poruka,"student");
		msgsnd(serverID,&studenti[i],sizeof(struct osoba)-sizeof(long),0);
	}
	printf("Unesite podatke o zaposlenima");
	for (i=0;i<n;i++)
	{
		scanf("%d",&zaposleni[i].br1);
		
		scanf("%d",&zaposleni[i].br2);
		
		scanf("%d",&zaposleni[i].br3);
		zaposleni[i].type=2;
		zaposleni[i].qid=qid;
		strcpy(zaposleni[i].poruka,"zaposlen");
		msgsnd(serverID,&zaposleni[i],sizeof(struct osoba)-sizeof(long),0);
	}
	printf("QID:%d\n",qid);
	msgrcv(qid,&statistike[0],sizeof(struct osoba)-sizeof(long),1,0);
	msgrcv(qid,&statistike[1],sizeof(struct osoba)-sizeof(long),2,0);
	printf("Statistika o studentima min:%f\tprosek:%f\tbr:%f\n",statistike[0].min,statistike[0].prosek,statistike[0].br);
	printf("Statistika o zaposlenima min:%f\tprosek:%f\tbr:%f\n",statistike[1].min,statistike[1].prosek,statistike[1].br);
	
	return 0;	
}
