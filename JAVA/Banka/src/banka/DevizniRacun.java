package banka;

import java.util.Arrays;

public class DevizniRacun extends Racun 
{
	public DevizniRacun(String broj,Banka banka)
	{
		super(broj,banka);
	}
	
	@Override
	public String toString() {
		return "DevizniRacun [brojKartica=" + brojKartica
				+ ", skiniNovacSaRacuna()=" + skiniNovacSaRacuna()
				+ ", getBanka()=" + getBanka() + ", getKartice()="
				+ Arrays.toString(getKartice()) + ", getBrojRacuna()="
				+ getBrojRacuna() + ", getStanjeRacuna()=" + getStanjeRacuna()
				+ ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}

	public double skiniNovacSaRacuna(double iznos)
	{
		double evro=getStanjeRacuna();
		evro*=115.0;
		if(evro>=iznos)
		{
			setStanjeRacuna((evro-iznos)/115.0);
			return (iznos);
		}
		else return 0.0f;
	}
	
	public void dodajIznos(double iznos)
	{
		super.dodajIznos(iznos/115.0);
	}
}
