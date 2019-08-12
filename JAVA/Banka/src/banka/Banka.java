package banka;

public class Banka 
{
	private static int racunld=0;
	private String naziv;
	private String racun;
	private String zemlja;
	
	private Klijent[] klijenti;
	private Racun[] racuni;
	
	public Banka()
	{
		klijenti=new Klijent[100];
		racuni=new Racun[100];
	}
	
	public Banka(String naziv,String zemlja)
	{
		this();
		this.naziv=naziv;
		this.zemlja=zemlja;
		
	}
	
	public void KreirajRacun(Klijent k,String tip)
	{
		String r;
		
		Racun rac=null;
		if(tip=="dinarski")
		{
			r="111"+racunld;
			rac=new Racun(r,this);
		}
		else
		{
			r="222"+racunld;
			rac=new Racun(r,this);
		}
		
		PlasticnaKartica pk=new PlasticnaKartica(rac, 1234);
		rac.dodajKarticu(pk);
		
		k.dodajRacun(rac);
		
		for(int i=0;i<racuni.length;i++)
			if(racuni[i]==null)
			{
				racuni[i]=rac;
				break;
			}
		
		racunld++;
		
		for(int i=0;i<klijenti.length;i++)
		{
			if(klijenti[i]==null)
			{
				klijenti[i]=k;
				break;
			}
		}
	}
	
	public void uplatiNovac(String r,double iznos) throws NepostojeciRacun
	{
		boolean k=true;
		Racun rr = null;
		for(int i=0;i<racuni.length;i++)
		{
			if(racuni[i]!=null && racuni[i].getBrojRacuna().equals(r))
			{
				k=false;
				rr=racuni[i];
				break;
			}
		}
		if(k) throw new NepostojeciRacun();
		
		rr.setStanjeRacuna(rr.getStanjeRacuna()+iznos);
	
	}
	
	public void dodajPunomocje(String r,Klijent k) throws NepostojeciRacun
	{
		boolean t=true;
		Racun rr=null;
		for(int i=0;i<racuni.length;i++)
		{
			if(racuni[i]!=null && racuni[i].getBrojRacuna().equals(r))
			{
				t=false;
				rr=racuni[i];
				break;
			}
		}
		if(t) throw new NepostojeciRacun();
		
		for(int i=0;i<klijenti.length;i++)
		{
			if(klijenti[i]==null)
			{
				klijenti[i]=k;
				break;
			}
		}
		
		k.dodajRacun(rr);
	}
	
	public void izdajKarticu(String r,String k) throws NepostojeciRacun,NepostojecaKartica
	{
		boolean t=true;
		Racun rr=null;
		for(int i=0;i<racuni.length;i++)
		{
			if(racuni[i]!=null && racuni[i].getBrojRacuna().equals(r))
			{
				t=false;
				rr=racuni[i];
				break;
			}
		}
		if(t) throw new NepostojeciRacun();
		
		if(k!="maestro") throw new NepostojecaKartica();
		
		rr.dodajKarticu(new MaestroKartica(rr, 5555));
		
	}

	@Override
	public String toString() 
	{
		String s="Banka naziv:" + naziv + ", zemlja="+ zemlja + ",\nklijenti=";
		for(int i=0;i<klijenti.length;i++) if(klijenti[i]!=null) s+=klijenti[i].toString();
		s+="\nracuni=";
		for(int i=0;i<racuni.length;i++) if(racuni[i]!=null) s+=racuni[i].toString();
		return s;
	}
	
	
}
