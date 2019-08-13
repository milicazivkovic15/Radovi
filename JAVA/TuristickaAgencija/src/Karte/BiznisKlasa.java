package Karte;

import Putnici.*;

public class BiznisKlasa extends Karta {

	public BiznisKlasa(Putnik putnikk, double cenaPK, double cenaPKP, double razdaljinaa) {
		super(putnikk, cenaPK, cenaPKP, razdaljinaa);
		// TODO Auto-generated constructor stub
	}
	@Override
	public double dajCenuKarte() {
		return putnik.getTezinaPrtljaga()*cenaPoKilogramuPrtljaga+razdaljina*cenaPoKilometru;
	
	}

}
