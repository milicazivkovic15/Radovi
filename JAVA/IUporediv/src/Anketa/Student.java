package Anketa;

public class Student extends Osoba implements IUporediv {
	private String indeks;
	public Student(String ime,String adresa,String indekss){
		super(ime,adresa);
		indeks=indekss;
		
	}
	public int uporedi(Object o ,ArhivaUpitnika a) throws NemogucePoredjenje{
		if (o instanceof Student){
			this.ocena=a.dajProsecnuOcenu(this);
			double studentProsek=a.dajProsecnuOcenu((Student)o);
			if (this.ocena>studentProsek)
				return 1;
			if(this.ocena<studentProsek)
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
		return "Student [indeks=" + indeks + ", "+super.toString();
	}
	
}
