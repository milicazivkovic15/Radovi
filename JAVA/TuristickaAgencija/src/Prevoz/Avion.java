package Prevoz;

import Karte.BiznisKlasa;
import Karte.EkonomskaKlasa;
import Karte.Karta;
import Putnici.Putnik;

public class Avion extends PrevoznoSredstvo {
	private int brojSlobodnihMestaUBiznisKlasi;
	private int brojSlobodnihMestaUEkonomskojKlasi;
	static double cenaKartePoKilometruUBiznisKlasi=20;
	static double cenaKartePoKilometruUEkonomskojKlasi=10;
	static double cenaPrtljagaPoKilogramu=50;
	
	
	public Avion(double brzina, int brSMUBK, int brSMUEK) {
		super(brzina);
		// TODO Auto-generated constructor stub
		brojSlobodnihMestaUBiznisKlasi=brSMUBK;
		brojSlobodnihMestaUEkonomskojKlasi=brSMUEK;
		karte=new Karta[brojSlobodnihMestaUBiznisKlasi+brojSlobodnihMestaUEkonomskojKlasi];
	}

	@Override
	public int dajBrojSlobodnihMesta() {
		
		return brojSlobodnihMestaUBiznisKlasi+brojSlobodnihMestaUEkonomskojKlasi;
	}

	@Override
	public Karta dajKartu(double razdaljinaa, Putnik putnikk) {
		if (brojSlobodnihMestaUBiznisKlasi>0){
		BiznisKlasa bk=new BiznisKlasa(putnikk, cenaKartePoKilometruUBiznisKlasi, cenaPrtljagaPoKilogramu, razdaljinaa);

		if (putnikk.getBudzet()>=bk.dajCenuKarte())
			return bk;
		}
		if (brojSlobodnihMestaUEkonomskojKlasi>0){
		EkonomskaKlasa ek=new EkonomskaKlasa(putnikk, cenaKartePoKilometruUEkonomskojKlasi, cenaPrtljagaPoKilogramu, razdaljinaa);
													
		if (putnikk.getBudzet()>=ek.dajCenuKarte())
			return ek;
		}
		return null;
	}
	@Override
	public void cekirajKartu(Karta kartaa) {
		for (int i = 0; i < karte.length; i++) 
			if (karte[i]==null){
				karte[i]=kartaa;
				break;
			}
		if (kartaa instanceof BiznisKlasa)
			brojSlobodnihMestaUBiznisKlasi--;
		else
			brojSlobodnihMestaUEkonomskojKlasi--;
		
	}




}
