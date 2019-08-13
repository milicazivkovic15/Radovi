package Izuzeci;

public class NedovoljnoNovca extends Exception {
	String poruka;
	public NedovoljnoNovca(String porukica){
		poruka=porukica;
	}
	public String getPoruka() {
		return poruka;
	}
	
}
