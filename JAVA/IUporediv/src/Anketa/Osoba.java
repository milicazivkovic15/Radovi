package Anketa;

public class Osoba {
	static int br;
	private String ime;
	private String adresa;
	public int id;
	protected double ocena;
	public double getOcena() {
		return ocena;
	}
	public Osoba(String imee, String adresaa){
		id=++br;
		ime=imee;
		adresa=adresaa;
	}
	public String getAdresa() {
		return adresa;
	}
	public void setAdresa(String adresa) {
		this.adresa = adresa;
	}
	public String getIme() {
		return ime;
	}
	@Override
	public String toString() {
		return "Osoba [ime=" + ime + ", adresa=" + adresa + ", id=" + id + "]";
	}
	
}
