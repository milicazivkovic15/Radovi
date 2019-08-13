package Anketa;

public class AnketniListic {
	private Nastavnik n;
	private double ocena;
	public AnketniListic(Osoba o, double ocene){
		n=(Nastavnik)o;
		ocena=ocene;
	}
	public Nastavnik getN() {
		return n;
	}
	public double getOcena() {
		return ocena;
	}
	@Override
	public String toString() {
		return "AnketniListic [n=" + n + ", ocena=" + ocena + "]";
	}
	
}
