package Anketa;

import java.util.Arrays;

public class Testiranje  extends Upitnik {

	String[] odgovori;
	Nastavnik nastavnik;
	Test[] testovi = new Test[10];
	int brTestova=0;
	
	public Testiranje(String naziv, String[] tacni, Nastavnik nastavnik) {
		// TODO Auto-generated constructor stub
		super(naziv);
		this.nastavnik=nastavnik;
		this.odgovori=tacni;
	}

	public void dodajTest(Test test) {
		// TODO Auto-generated method stub
		testovi[brTestova++]=test;
	}
	@Override
	public double dajOcenu(Osoba o) throws NepostojecaOsoba {
		int i;
		double ocena=0;
		
		for (i = 0; i < testovi.length; i++) {
			if(testovi[i]!=null && testovi[i].getS().id==o.id){
				ocena=testovi[i].dajOcenu(odgovori);
				break;
			}
			
		}
		if (i==testovi.length){
			NepostojecaOsoba no=new NepostojecaOsoba(o);
			throw no;
		}
		return ocena;
	}

	@Override
	public String toString() {
		return "Testiranje [Testovi=" + Arrays.toString(testovi) + "]";
	}
	
}
