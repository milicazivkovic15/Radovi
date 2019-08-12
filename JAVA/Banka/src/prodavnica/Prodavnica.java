package prodavnica;

import java.util.Arrays;

import banka.*;

public class Prodavnica 
{
	

	int brojDodatihProizvoda=0;
	Proizvod[] proizvodi;
	
	public Prodavnica()
	{
		proizvodi=new Proizvod[100];
	}
	
	public void dodajProizvod(Proizvod p)
	{
		proizvodi[brojDodatihProizvoda++]=p;
	}
	
	public boolean kupiProizvode(Kartica k,String[] niz)
	{
		if(this instanceof ElektronskoPlacanje && k instanceof MaestroKartica)
		{
			for(int i=0;i<niz.length;i++)
			{
				for(Proizvod p:proizvodi)
					if(p!=null && p.getNaziv().equals(niz[i]))
					{
						k.skiniNovacSaRacuna(p.getCena());
						break;
					}
			}
			return true;
		}
		else return false;
	}
	
	public double dajCenu(String p)
	{
		for(int i=0;i<brojDodatihProizvoda;i++)
		{
			if(proizvodi[i].getNaziv()==p)
				return proizvodi[i].getCena();
		}
		return 0.0f;
	}
	
	@Override
	public String toString() {
		String s= "Prodavnica [brojDodatihProizvoda=" + brojDodatihProizvoda
				+ ", proizvodi=";
		for(int i=0;i<brojDodatihProizvoda;i++) s+=proizvodi[i];
		return s;
	}
}
