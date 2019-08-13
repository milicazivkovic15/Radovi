package Prevoz;


import Karte.EkonomskaKlasa;
import Karte.Karta;
import Putnici.*;

public class Autobus extends PrevoznoSredstvo {

	private int brojSlobodnihMesta;
	static double cenaPoKilometru=5;
	static double cenaPoKilogramuPrtljaga=2;
	public Autobus(double brzina, int brSM) {
		super(brzina);
		// TODO Auto-generated constructor stub
		brojSlobodnihMesta=brSM;
		super.karte=new Karta[brSM];
	}

	@Override
	public int dajBrojSlobodnihMesta() {
		// TODO Auto-generated method stub
		return brojSlobodnihMesta;
	}

	@Override
	public void cekirajKartu(Karta kartaa) {
		for (int i = 0; i < karte.length; i++) 
			if (karte[i]==null){
				karte[i]=kartaa;
				break;
			}
		
			brojSlobodnihMesta--;	
	}

	@Override
	public Karta dajKartu(double razdaljinaa, Putnik putnikk) {
		if (brojSlobodnihMesta>0){
			EkonomskaKlasa ek=new EkonomskaKlasa(putnikk, cenaPoKilometru, cenaPoKilogramuPrtljaga, razdaljinaa);
			if (putnikk.getBudzet()>=ek.dajCenuKarte())
				return ek;
		}
		return null;
	}

}
