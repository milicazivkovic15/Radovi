package Anketa;

import java.util.Arrays;

public class ArhivaUpitnika {
	Upitnik[] u;
	private int br=0;
	public ArhivaUpitnika() {
		u=new Upitnik[20];
	}
	public void dodajUpitnik(Upitnik upitnik){
		
		if (br==20)
			System.out.println("Premasen broj upitnika");
		else
			u[br++]=upitnik;
	}
	public double dajProsecnuOcenu(Osoba o){
		double prosek=0;
		try{
			for (int i = 0; i < u.length; i++) {
				prosek+=u[i].dajOcenu(o);
			}
			
		}
		catch(NepostojecaOsoba e){
			//System.out.println(e);
		}
		
		
		return prosek/u.length;
	}
	
	public void stampajArhivuUpitnika() {
		System.out.println("UPITNICI");
		for (Upitnik upitnik : u) {
			if (upitnik!=null)
				System.out.println(upitnik);
		}
	} 
	public int koJeBolji(Osoba o1, Osoba o2)throws NemogucePoredjenje{
			if (o1 instanceof Student)
				return ((Student)o1).uporedi(o2, this);
			else
				return ((Nastavnik)o1).uporedi(o2,this);
	}
	
}
