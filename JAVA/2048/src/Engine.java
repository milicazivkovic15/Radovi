import java.util.Random;

public class Engine {
	Polje[][] matrica=new Polje[4][4];
	boolean flag=false;
	int score=2;
	Engine(){
		inicijalizacija();
	}
	
	void inicijalizacija(){
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j < 4; j++) {
				matrica[i][j]=null;
			}
		}
		Polje p=random();
		matrica[p.i][p.j]=p;
		p=random();
		matrica[p.i][p.j]=p;
		
	}
	
	Polje random(){
		
		Random r=new Random();
		int stepen=r.nextInt(2)+1;
		int i=r.nextInt(4);
		int j=r.nextInt(4);
		while(matrica[i][j]!=null){
			i=r.nextInt(4);
			j=r.nextInt(4);
		}
		
		return new Polje(stepen,i,j);
		
	}
	boolean odigrajPotez(int smer){
		flag=false;
		if (smer==0)
			odigrajGore();
		else if(smer==1)
			odigrajDole();
		else if(smer==2)
			odigrajLevo();
		else 
			odigrajDesno();
		Polje p=random();
		matrica[p.i][p.j]=p;
		if (flag==false && kraj()==true)
			return false;
		for (int i = 0; i < matrica.length; i++) {
			for (int j = 0; j < matrica[i].length; j++) {
				if (matrica[i][j]!=null && matrica[i][j].stepen>score) {
					score=matrica[i][j].stepen;
				}
			}
		}
		return true;
	}
	void odigrajGore(){
		
		for (int j = 0; j < 4; j++) {
			for (int i= 0;  i< 3; i++) 
				if(matrica[i][j]!=null)
					for (int i2 = i+1; i2 < 4; i2++) 
						if(	matrica[i2][j]!=null)
							if (matrica[i][j].stepen==matrica[i2][j].stepen){
								matrica[i2][j].stepen++;
								matrica[i][j]=null;
								break;
							}
							else 
								break;
			for (int i = 0; i<4; i++) 
				if (matrica[i][j]==null)
					for (int j2 = i; j2 <4; j2++) 
						if (matrica[j2][j]!=null){
							matrica[i][j]=new Polje (matrica[j2][j].stepen,i,j);
							matrica[j2][j]=null;
							break;
						}
		}
	}
	void odigrajDole(){
		
		for (int j = 0; j < 4; j++) {
			for (int i = 3; i >0; i--) 
				if (matrica[i][j]!=null)
					for (int i2 = i-1; i2 >-1; i2--) 
						if(matrica[i2][j]!=null)
							if (matrica[i][j].stepen==matrica[i2][j].stepen){
								matrica[i2][j].stepen++;
								matrica[i][j]=null;
								flag=true;
								break;
							}
							else
								break;
			for (int i = 3; i>-1; i--) 
				if (matrica[i][j]==null)
					for (int j2 = i;j2>-1; j2--) 
						if (matrica[j2][j]!=null){
							matrica[i][j]=new Polje (matrica[j2][j].stepen,i,j);
							matrica[j2][j]=null;
							break;
						}
		}
	}
	void odigrajLevo(){
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j <3; j++) 
				if (matrica[i][j]!=null)
					for (int j2 = j+1; j2 <4; j2++) 
						if(matrica[i][j2]!=null)
							if (matrica[i][j2].stepen==matrica[i][j].stepen){
								matrica[i][j2].stepen++;
								matrica[i][j]=null;
								break;
							}
							else 
								break;
			for (int j = 0; j < 3; j++) 
				if (matrica[i][j]==null)
					for (int j2 = j; j2 < 4; j2++) 
						if (matrica[i][j2]!=null){
							matrica[i][j]=new Polje(matrica[i][j2].stepen,i,j2);
							matrica[i][j2]=null;
							break;
						}
		}
	}
	void odigrajDesno(){
		for (int i = 0; i < 4; i++) {
			for (int j = 3; j >0; j--)
				if(matrica[i][j]!=null )
					for (int j2 = j-1; j2 >-1; j2--) 
						if(matrica[i][j2]!=null)
							if (matrica[i][j2].stepen==matrica[i][j].stepen){
								matrica[i][j2].stepen++;
								matrica[i][j]=null;
								break;
							}
							else 
								break;
			for (int j = 3; j>0; j--) 
				if (matrica[i][j]==null)
					for (int j2 = j; j2 >-1; j2--) 
						if (matrica[i][j2]!=null){
							matrica[i][j]=new Polje(matrica[i][j2].stepen,i,j2);
							matrica[i][j2]=null;
							break;
						}
		}
	}
	boolean kraj(){
		if (score==11) {
			return true;
		}
		for (int i = 0; i < matrica.length; i++) {
			for (int j = 0; j < matrica.length; j++) {
				if (matrica[i][j]==null)
					return false;
			}
		}
		return true;
	}

}
