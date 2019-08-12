package prodavnica;

import banka.ElektronskoPlacanje;
import banka.Kartica;

public class SuperMarket extends Prodavnica implements ElektronskoPlacanje 
{
	private String naziv;
	private String adresa;
	
	public SuperMarket(String naziv,String adresa)
	{
		super();
		this.naziv=naziv;
		this.adresa=adresa;
	}
	@Override
	public boolean skiniNovacSaRacuna(Kartica k,double i) 
	{
		return(k.skiniNovacSaRacuna(i));
	}

}
