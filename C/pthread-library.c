/*
Problem : Konkurentno programiranje
*/
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
typedef struct kam{
	int t;
	int m;
	int zauzet;
	int brRadnika;
	int istovaren;
}kamion;

 kamion *kamioni;
 int *radnici;
 int n,k,kKamiona,nn;
 int m,mRadnika;
 pthread_mutex_t mutex_k;
 pthread_mutex_t mutex_r;
 pthread_mutex_t *mutex_m;
 pthread_mutex_t mutex_br;
 pthread_mutex_t mutex_brK;
 pthread_cond_t stigaoKamion;
 pthread_cond_t stovaristeOslobodjeno;
 pthread_cond_t radnikM;
 int zauzetoStovariste=0;
 long indexK=0;
 void *func_kamioni(void *arg)
 {
	long i=(long)arg;
	sleep(kamioni[i].t);

    pthread_mutex_lock (&mutex_k);
	while(zauzetoStovariste==k){
		pthread_cond_wait(&stovaristeOslobodjeno,&mutex_k);
	}
	pthread_mutex_lock (&mutex_brK);
			
			printf("Istovar kamiona %ld od %d kg!\n",i,kamioni[i].m);
			zauzetoStovariste++;
			kamioni[i].zauzet=1;
			pthread_cond_broadcast(&stigaoKamion);
			pthread_cond_broadcast(&radnikM);

			
	pthread_mutex_unlock (&mutex_brK);
	pthread_mutex_unlock (&mutex_k);
			
  sleep(1);

    pthread_exit((void*) 0);
 }
 void *func_radnici(void *arg)
 {
	long i=(long)arg;
	while (1){
		pthread_mutex_lock (&mutex_r);
		if (!n) 
				break;
		while(zauzetoStovariste==0){
			pthread_cond_wait(&stigaoKamion,&mutex_r);
		}
	
		int ii=-1,t;
		
		pthread_mutex_lock(&mutex_br);
		
			for (t = 0; t < nn; t++)
			{
				if (!kamioni[t].istovaren && kamioni[t].zauzet && kamioni[t].brRadnika>0)
				{
					ii=t;
					kamioni[t].brRadnika--;
								printf("Radnik %ld istovaruje, m=%d jos radi na kamionu %d\n",i,kamioni[ii].brRadnika,ii);

					break;
				}
			}
			

			pthread_mutex_unlock(&mutex_r);

			pthread_mutex_unlock(&mutex_br);

		while(ii==-1){
			pthread_cond_wait(&radnikM,&mutex_r);
			pthread_mutex_lock(&mutex_br);
		
			for (t = 0; t < nn; t++)
			{
				if (!kamioni[t].istovaren && kamioni[t].zauzet && kamioni[t].brRadnika>0)
				{
					ii=t;
					kamioni[t].brRadnika--;
					break;
				}
			}
			
		printf("ii %d\n",ii);

			pthread_mutex_unlock(&mutex_r);

			pthread_mutex_unlock(&mutex_br);

			printf("Radnik %ld istovaruje, m=%d jos radi na kamionu %d\n",i,kamioni[ii].brRadnika,ii);
		}
		sleep(1);
		pthread_mutex_lock (&mutex_m[ii]);
		printf("zakljucan %d\n",ii);
		int kg=50;
		if (kamioni[ii].m-50<0)
			kg=kamioni[ii].m;
		printf("i=%ld %d\n",i,kg);
		kamioni[ii].m-=kg;	
		radnici[i]+=kg;
		if (kamioni[ii].m==0){
			zauzetoStovariste--;
			n--;
			pthread_cond_broadcast(&stovaristeOslobodjeno);
			printf("Kamion %d istovaren %d\n",ii,n);
			kamioni[ii].istovaren=1;
			if (!n){
				pthread_mutex_unlock (&mutex_r);
			
				pthread_cond_broadcast(&radnikM);
				pthread_cond_broadcast(&stigaoKamion);

				break;
			}
			
		}
		pthread_mutex_lock(&mutex_r);
			kamioni[ii].brRadnika++;
			pthread_cond_broadcast(&radnikM);
		pthread_mutex_unlock(&mutex_r);
		
		pthread_mutex_unlock (&mutex_m[ii]);
		sleep(2);
	}
	pthread_exit((void*) 0);

 }
int main (int argc, char *argv[])
 {
    long i;
    void *status;
	
	FILE *f=fopen("kamioni.txt","r");
	fscanf(f,"%d",&n);
	nn=n;
	kamioni = (kamion*) malloc (n*sizeof(kamion));
	
	mutex_m = (pthread_mutex_t*) malloc (n*sizeof(pthread_mutex_t));
	radnici = (int*) malloc (4*sizeof(int));
	for (i = 0; i < 4; i++)
	{
		radnici[i]=0;
	}
	printf("Unesi m:\n");
	scanf("%d",&m);
	printf("Unesi k:\n");
	scanf("%d",&k);
	mRadnika=m;
	kKamiona=k;
	i=0;
	nn=n;
	while(!feof(f)){
		fscanf(f,"%d%d",&kamioni[i].t,&kamioni[i].m);
		kamioni[i].zauzet=0;
		kamioni[i].brRadnika=m;
		kamioni[i].istovaren=0;
		i++;
	}
	pthread_t niti_k[n];
	pthread_t niti_r[4];
	
    pthread_attr_t attr;  
   
    pthread_mutex_init(&mutex_r, NULL);
    pthread_mutex_init(&mutex_k, NULL);
    pthread_mutex_init(&mutex_br, NULL);
    for (i = 0; i < n; i++)
	{
		pthread_mutex_init(&mutex_m[i], NULL);
    
	}
	
    
    pthread_cond_init(&stigaoKamion, NULL);
    pthread_cond_init(&stovaristeOslobodjeno, NULL);
    pthread_cond_init(&radnikM, NULL);
         
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_JOINABLE);

    for(i=0; i< n  ; i++)
    {
		pthread_create(&niti_k[i], &attr, func_kamioni, (void *)i);
    }
    
    for(i=0; i< 4  ; i++)
    {
		pthread_create(&niti_r[i], &attr, func_radnici, (void *)i);
    }

    pthread_attr_destroy(&attr);

    for(i=0; i<n  ; i++)
       {
       pthread_join(niti_k[i], NULL);
       }
	for(i=0; i<4 ; i++)
       {
       pthread_join(niti_r[i], NULL);
       }

    pthread_mutex_destroy(&mutex_r);
    pthread_mutex_destroy(&mutex_k);
    
    pthread_cond_destroy(&stigaoKamion);
    pthread_cond_destroy(&stovaristeOslobodjeno);
    pthread_cond_destroy(&radnikM);
    pthread_exit(NULL);
 }   
