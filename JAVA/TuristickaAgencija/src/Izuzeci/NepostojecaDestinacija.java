package Izuzeci;

public class NepostojecaDestinacija extends Exception {
	String poruka;
	public NepostojecaDestinacija(String porukica){
		poruka=porukica;
	}
	public String getPoruka() {
		return poruka;
	}
	
}
