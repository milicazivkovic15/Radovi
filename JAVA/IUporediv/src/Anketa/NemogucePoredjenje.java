package Anketa;

public class NemogucePoredjenje extends Exception{
	Osoba o1,o2;
	public NemogucePoredjenje(Osoba o11, Osoba o22){
		o1=o11;
		o2=o22;
	}
	@Override
	public String toString() {
		return "------NEMOGUCE POREDJENJE---------\n"+ o1.toString()+"\n"+o2.toString()+"\n---------------";
	}
	
}
