package Karte;

import Putnici.*;

public abstract class Karta {
	Putnik putnik;
	double cenaPoKilometru;
	double cenaPoKilogramuPrtljaga;
	double razdaljina;
	public Karta(Putnik putnikk, double cenaPK, double cenaPKP, double razdaljinaa){
		putnik=putnikk;
		cenaPoKilogramuPrtljaga=cenaPKP;
		cenaPoKilometru=cenaPK;
		razdaljina=razdaljinaa;
	}
	public abstract  double dajCenuKarte();
	@Override
	public String toString() {
		String s="";
		if (this instanceof BiznisKlasa)
			s="Biznis Klasa";
		else s="Ekonomska Klasa";
		return putnik.getIme()+"("+putnik.getBudzet()+")"+ " - "+ s; 
	}
	
}
