import java.util.Random;

public class Engine {
	public int matrica[][] = new int [10][10]; // -1 is bomb
	int bombice;
	int brMine=15;
	Engine(){
		inicijalizacija();
	}
	void inicijalizacija(){
		for (int i = 0; i < matrica.length; i++) {
			for (int j = 0; j < matrica.length; j++) {
				matrica[i][j]=0;
			}
		}
		for (int i = 0; i <brMine ; i++) {
			random();
		}
		zastave();
		bombice=brMine;
	
	}
	void random(){

		Random r=new Random();
		int i=r.nextInt(10);
		int j=r.nextInt(10);
		
		while(matrica[i][j]==-1){
			 i=r.nextInt(10);
			 j=r.nextInt(10);
		}
		matrica[i][j]=-1;
	}
	
	void zastave(){
		int brojac=0;
		for (int i = 0; i < matrica.length; i++) {
			for (int j = 0; j < matrica[i].length; j++) {
				if (matrica[i][j]!=-1) {
					if (i>0 && j>0 && matrica[i-1][j-1]==-1)
						brojac++;
					if (i>0 && j<9 && matrica[i-1][j+1]==-1)
						brojac++;
					if (i<9 && j>0 && matrica[i+1][j-1]==-1)
						brojac++;
					if (i<9 && j<9 && matrica[i+1][j+1]==-1)
						brojac++;
					if (i>0 && matrica[i-1][j]==-1)
						brojac++;
					if (j>0 && matrica[i][j-1]==-1)
						brojac++;
					if (i<9 && matrica[i+1][j]==-1)
						brojac++;
					if (j<9 && matrica[i][j+1]==-1)
						brojac++;
					
					matrica[i][j]=brojac;
					brojac=0;
				}
			}
		}
	}
	boolean daLiJeKraj(int i, int j, int hided){
		if (matrica[i][j]==-1 || pobedio(hided))
			return true;
		return false;
	}
	void stampaj(){
		for (int i = 0; i <10; i++) {
			for (int j = 0; j <10; j++) {
				System.out.print(matrica[i][j]+"\t");
			}
			System.out.println();
		}
	}
	boolean pobedio(int i, int j){
		if (matrica[i][j]==-1)
			bombice--;
		if (bombice==0)
			return true;
		return false;
	}
	boolean pobedio(int hided){
		 return hided==brMine;
	}
	void resetZastave(int i, int j){
		if (matrica[i][j]==-1)
			bombice++;
	}
	
}
