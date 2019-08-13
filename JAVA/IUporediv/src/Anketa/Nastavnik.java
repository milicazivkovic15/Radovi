package Anketa;

public class Nastavnik extends Osoba implements IUporediv {
	private String jmbg;
	public Nastavnik(String ime,String adresa, String jmbgg){
		super(ime,adresa);
		jmbg=jmbgg;
	}
	
	public int uporedi(Object o, ArhivaUpitnika a) throws NemogucePoredjenje {
		if (o instanceof Nastavnik){
			this.ocena=a.dajProsecnuOcenu(this);
			double nastavnikProsek=a.dajProsecnuOcenu((Nastavnik)o);
			if (this.ocena>nastavnikProsek)
				return 1;
			if(this.ocena<nastavnikProsek)
				return 2;
			else return 0;
		}
		else{
			NemogucePoredjenje np=new NemogucePoredjenje(this,(Osoba)o);
			throw np ;
		}
	}
	@Override
	public String toString() {
		return "Nastavnik ["+super.toString()+"]";
	}
	
}
