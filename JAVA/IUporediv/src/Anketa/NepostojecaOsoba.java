package Anketa;

public class NepostojecaOsoba extends Exception {
	Osoba o;
	public NepostojecaOsoba(Osoba o1){
		o=o1;
	}
	@Override
	public String toString() {
		return "NepostojecaOsoba [o=" + o + "]";
	}
	
}
