package Anketa;

import java.util.Arrays;

public class Test {
	private Student s;
	private String[] odgovori;
	public Test(Osoba student, String[] odg){
		s=(Student)student;
		odgovori=new String[odg.length];
		for (int i = 0; i < odg.length; i++)
			odgovori[i]=odg[i];
		
	}
	public Student getS() {
		return s;
	}
	public String[] getOdgovori() {
		return odgovori;
	}
	public double dajOcenu(String[] tacniOdg){
		int br=0;
		for (int i = 0; i < odgovori.length; i++) {
			if (odgovori[i]==tacniOdg[i])
				br++;
		}
		return (double)(br*100)/odgovori.length;
		
	}
	@Override
	public String toString() {
		return "Test [s=" + s + ", odgovori=" + Arrays.toString(odgovori) + "]";
	}
	
	
}
