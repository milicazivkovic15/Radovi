package Prevoz;

import Karte.*;
import Putnici.*;

public abstract class PrevoznoSredstvo {
	private double brzinaPrevoza;
	Karta[] karte;
	public PrevoznoSredstvo(double brzina){
		brzinaPrevoza=brzina;
	}
	public abstract void cekirajKartu(Karta karta);
	public abstract Karta dajKartu(double razdaljina, Putnik putnik);
	public double vremePutovanja(double razdaljina){
		return razdaljina/ brzinaPrevoza;
	}
	public abstract int dajBrojSlobodnihMesta();
	public Karta[] getKarte() {
		return karte;
	}
	
}
