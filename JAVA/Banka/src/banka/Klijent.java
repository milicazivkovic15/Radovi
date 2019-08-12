package banka;

public abstract class Klijent 
{
	public int brojOtvorenihRacuna=0;
	private String adresa;
	private Racun[] racuni;
	
	public Klijent()
	{
		racuni=new Racun[10];
	}
	
	public Klijent(String a)
	{
		this();
		adresa=a;
	}
	
	public Kartica dajKartica(int id)
	{
		for(int i=0;i<brojOtvorenihRacuna;i++)
		{
			if(racuni[i]!=null)
			{
				for(int j=0;j<racuni[i].getKartice().length;j++)
				{
					if((racuni[i].getKartice())[j]!=null && (racuni[i].getKartice())[j].getId()==id)
						return racuni[i].getKartice()[j];
				}
			}
		}
		return null;
	}
	
	public void dodajRacun(Racun r) 
	{
		racuni[brojOtvorenihRacuna++]=r;
	}

	@Override
	public String toString() {
		String s= " brojOtvorenihRacuna=" + brojOtvorenihRacuna
				+ ", adresa=" + adresa + ", racuni=";
		for(int i=0;i<brojOtvorenihRacuna;i++) s+=racuni[i];
		return s;
	}


}
