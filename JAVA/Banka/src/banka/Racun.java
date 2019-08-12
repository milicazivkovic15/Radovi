package banka;

public class Racun 
{
	public int brojKartica;
	private String brojRacuna;
	private Banka banka;
	private Kartica[] kartice;
	private double stanjeRacuna;
	
	public Racun()
	{
		kartice=new Kartica[10];
	}
	
	public Racun(String broj,Banka banka)
	{
		this();
		this.brojRacuna=broj;
		this.banka=banka;
	}

	public void dodajIznos(double iznos)
	{
		stanjeRacuna+=iznos;
	}
	
	public double skiniNovacSaRacuna()
	{
		stanjeRacuna=0.0f;
		return 0.0f;
	}
	
	void dodajKarticu(Kartica k)
	{
		for(int i=0;i<kartice.length;i++)
		{
			if(kartice[i]==null)
			{
				kartice[i]=k;
				brojKartica++;
				break;
			}
		}
	}
	
	

	public Banka getBanka() {
		return banka;
	}

	public Kartica[] getKartice() {
		return kartice;
	}

	public String getBrojRacuna() {
		
		return brojRacuna;
	}

	public double getStanjeRacuna() {
		
		return stanjeRacuna;
	}

	public void setStanjeRacuna(double d) {
		stanjeRacuna=d;
		
	}

	@Override
	public String toString() {
		String s= "\nbrojKartica=" + brojKartica + ", brojRacuna="
				+ brojRacuna  + ", stanjeRacuna=" + stanjeRacuna;
		for(int i=0;i<brojKartica;i++) s+=kartice[i];
		return s;
	}

}
