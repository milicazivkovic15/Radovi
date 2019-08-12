package banka;

public class PravnoLice extends Klijent 
{
	private String pib;
	private String naziv;
	
	public PravnoLice(String naziv,String adresa,String pib)
	{
		super(adresa);
		this.pib=pib;
		this.naziv=naziv;
	}
	
	public String toString()
	{
		return("Naziv: "+naziv+super.toString());
	}
}
