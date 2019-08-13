package Karte;

import Putnici.Putnik;
import Putnici.Student;

public class EkonomskaKlasa extends Karta {
	
	public EkonomskaKlasa(Putnik putnikk, double cenaPK, double cenaPKP, double razdaljinaa) {
		super(putnikk, cenaPK, cenaPKP, razdaljinaa);
		// TODO Auto-generated constructor stub
	}
	@Override
	public double dajCenuKarte() {
		if (putnik instanceof Student)
			return (putnik.getTezinaPrtljaga()*cenaPoKilogramuPrtljaga+razdaljina*cenaPoKilometru)*(((Student)putnik).dajPopust()/100.0);		
		return putnik.getTezinaPrtljaga()*cenaPoKilogramuPrtljaga+razdaljina*cenaPoKilometru;
	}

}
