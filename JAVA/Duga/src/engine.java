
public class engine {
	int[] kombiacija=new int[4];
	int brojPokusaja;
	int pom[]=new int[4];
	
	public engine() {
		inicijalizacija();
	}
	void odrediKombinaciju(){
		for (int i = 0; i < kombiacija.length; i++) {
			kombiacija[i]=Math.round((float)(Math.random()*4));
			
		}
		
	}
	int proveraKombinacije(int niz[]){
		brojPokusaja++;
		int brojac=0;
		for (int i = 0; i < niz.length; i++) {
			if (niz[i]==kombiacija[i]) 
				brojac++;
		}
		return brojac ;
	}
	void inicijalizacija(){
		odrediKombinaciju();
		brojPokusaja=0;
	}
	boolean moguLiOpet(){
		if (brojPokusaja==8) return false;
		return true;
	}
	int proveraBoja(int niz[]){
		int brojac=0;
		for (int i = 0; i < niz.length; i++) {
			pom[i]=kombiacija[i];
			if (pom[i]==niz[i]){
				pom[i]=12;
				niz[i]=10;
			}
		}
		for (int i = 0; i < niz.length; i++) {
				for (int j = 0; j < niz.length ; j++) {
					if (niz[j]==pom[i]) {
						
						brojac++;
						niz[j]=10;
						pom[i]=12;
						
					}
				}
		}
	
		return brojac;
	}
}
