package karte;

public class Spil {
	private Karta karte[]=new Karta[32];
	public Spil(){
		int br=0;
		Znak z=Znak.KOCKA;
		karte[br++]=new Karta(z,1);

		for (int i=14;i>6;i--){
			if (i==11)
				i--;
			karte[br++]=new Karta(z,i);
		}


		z=Znak.PIK;
		karte[br++]=new Karta(z,1);

		for (int i=14;i>6;i--){
			if (i==11)
				i--;
			karte[br++]=new Karta(z,i);
		}


		z=Znak.SRCE;
		karte[br++]=new Karta(z,1);

		for (int i=14;i>6;i--){
			if (i==11)
				i--;
			karte[br++]=new Karta(z,i);
		}


		z=Znak.TREF;
		karte[br++]=new Karta(z,1);

		for (int i=14;i>6;i--){
			if (i==11)
				i--;
			karte[br++]=new Karta(z,i);
		}

		
	}
	
	public void promesajKarte(){
		int brKarata=32;
		Karta pomSpil[]=new Karta[32];
		int brPom=0;
		int i=31;
		int r;
		while (i>0){
			r=(int)(Math.random()*(i-1));
			pomSpil[brPom++]=karte[r];
			i--;
			
			for (int j = r; j < brKarata-1; j++) {
				karte[j]=karte[j+1];
			}
			brKarata--;
		}
		pomSpil[brPom++]=karte[i];
		karte=pomSpil;
		
	}

	public Karta[] getKarte() {
		return karte;
	}
	public Karta getKarta(int i) {
		return karte[i];
	}
//	public void stampaj(){
//		for (int i = 0; i < karte.length; i++) {
//			System.err.println(karte[i].znak+"   "+karte[i].broj);
//		}
//	}

	public void setKarta(int i, Karta k) {
		// TODO Auto-generated method stub
		karte[i]=k;
	}
}
