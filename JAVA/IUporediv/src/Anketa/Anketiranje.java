package Anketa;

import java.util.Arrays;

public class Anketiranje extends Upitnik {

	AnketniListic[] anketniListic;
	private int br=0;
	
	public Anketiranje(String naziv) {
		super(naziv);
		anketniListic=new AnketniListic[5];
	}
	@Override
	public double dajOcenu(Osoba o) throws NepostojecaOsoba {
		int i;
		double ocena=0;
		
		for (i = 0; i < anketniListic.length; i++) {
			if(anketniListic[i].getN().id==o.id){
				ocena=anketniListic[i].getOcena();
				break;
			}
			
		}
		if (i==anketniListic.length){
			NepostojecaOsoba no=new NepostojecaOsoba(o);
			throw no;
		}
		return ocena;
	}
	public void dodajListic(AnketniListic a){
		if (br==10)
			System.out.println("Prekoracenje broja listica");
		else
			anketniListic[br++]=a;
	}
	@Override
	public String toString() {
		return "Anketiranje [anketniListic=" + Arrays.toString(anketniListic) + "]";
	}
	
}
