package karte;

public class Karta {
	private Znak znak;
	private int broj;
	public Karta(Znak znak, int broj) {
		super();
		this.znak = znak;
		this.broj = broj;
	}
	public Znak getZnak() {
		return znak;
	}
	public int getBroj() {
		return broj;
	}
	
}
