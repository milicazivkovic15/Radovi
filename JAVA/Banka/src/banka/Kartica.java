package banka;

public class Kartica 
{

	public static int brojac=0;
	private int id;
	private int pin;
	private Racun racun;
	
	public Kartica(Racun racun,int pin)
	{
		this.racun=racun;
		this.pin=pin;
		brojac++;
		id=brojac;
	}
	
	public boolean skiniNovacSaRacuna(double iznos)
	{
		if(racun.getStanjeRacuna()>=iznos)
		{
			racun.setStanjeRacuna(racun.getStanjeRacuna()-iznos);
			return true;
		}
		else return false;
	}
	
	
	@Override
	public String toString() {
		return "\nid=" + id + ", pin=" + pin;
	}

	public int getId() {
		// TODO Auto-generated method stub
		return id;
	}

	public int getPin() {
		return pin;
	}

	public Racun getRacun() {
		return racun;
	}

	public void setPin(int pin) {
		this.pin = pin;
	}
	
	

}
