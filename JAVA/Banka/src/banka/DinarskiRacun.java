package banka;

import java.util.Arrays;

public class DinarskiRacun extends Racun 
{
	public DinarskiRacun(String broj,Banka banka)
	{
		super(broj,banka);
	}
	
	@Override
	public String toString() {
		return "DinarskiRacun [brojKartica=" + brojKartica
				+ ", skiniNovacSaRacuna()=" + skiniNovacSaRacuna()
				+ ", getBanka()=" + getBanka() + ", getKartice()="
				+ Arrays.toString(getKartice()) + ", getBrojRacuna()="
				+ getBrojRacuna() + ", getStanjeRacuna()=" + getStanjeRacuna()
				+ ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}

	public double skiniNovacSaRacuna(double iznos)
	{
		double din=getStanjeRacuna();
		
		if(din>=iznos)
		{
			setStanjeRacuna((din-iznos));
			return (iznos);
		}
		else return 0.0f;
	}
	
	public void dodajIznos(double iznos)
	{
		setStanjeRacuna(getStanjeRacuna()+iznos);
	}
}
