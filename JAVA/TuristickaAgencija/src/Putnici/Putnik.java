package Putnici;

import Karte.*;

public class Putnik {
	String ime;
	double budzet;
	double tezinaPrtljaga;
	Karta karta=null;
	public Putnik(String imee, double budzett, double tezinaP){
		ime=imee;
		budzet=budzett;
		tezinaPrtljaga=tezinaP;
	}
	public String getIme() {
		return ime;
	}
	public double getBudzet() {
		return budzet;
	}
	public double getTezinaPrtljaga() {
		return tezinaPrtljaga;
	}
	public void setKarta(Karta karta) {
		budzet-=karta.dajCenuKarte();
		this.karta = karta;
	}
	public Karta getKarta() {
		return karta;
	}
	
	@Override
	public String toString() {
		return karta.toString(); 
	}
}
