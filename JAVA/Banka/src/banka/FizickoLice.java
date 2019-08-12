package banka;

public class FizickoLice extends Klijent 
{
	private int brojLicneKarte;
	private String imeIPRezime;
	
	public FizickoLice(String imeIPrezime,String adresa,int brojLicneKarte)
	{
		super(adresa);
		this.brojLicneKarte=brojLicneKarte;
		this.imeIPRezime=imeIPrezime;
	}
	
	public String toString()
	{
		return("imeIPrezime: "+imeIPRezime+super.toString());
	}

}
