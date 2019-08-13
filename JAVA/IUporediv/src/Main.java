import Anketa.*;
public class Main {

	public static void main(String[] args) {
		ArhivaUpitnika arhiva=new ArhivaUpitnika();
		Student studenti[]=new Student[3];
		studenti[0]=new Student("student1", "adresa1", "59/08");
		studenti[1]=new Student("student2", "adresa2", "60/08");
		studenti[2]=new Student("student3", "adresa2", "61/08");
		Nastavnik nastavnici[]=new Nastavnik[2];
		nastavnici[0]=new Nastavnik("nastavnik1", "050689750041", "adresa4");
		nastavnici[1]=new Nastavnik("nastavnik2", "050689750042", "adresa5");
		String[] tacni1=new String[4];
		tacni1[0]="a";
		tacni1[1]="b";
		tacni1[2]="a";
		tacni1[3]="c";
		
		String[] tacni2=new String[4];	
		tacni2[0]="a";
		tacni2[1]="a";
		tacni2[2]="a";
		tacni2[3]="a";
		Testiranje testiranje[]=new Testiranje[2];
		testiranje[0]=new Testiranje("Testiranje1", tacni1, nastavnici[0]);
		testiranje[1]=new Testiranje("Testiranje2", tacni2, nastavnici[1]);
		Test[] testovi=new Test[3];
		String[] odg=new String[4];
		odg[0]="a";
		odg[1]="a";
		odg[2]="c";
		odg[3]="c";
		testovi[0]=new Test(studenti[0], odg);
		odg[0]="a";
		odg[1]="c";
		odg[2]="h";
		odg[3]="b";
		testovi[1]=new Test(studenti[1],odg);
		odg[0]="a";
		odg[1]="c";
		odg[2]="b";
		odg[3]="b";
		testovi[2]=new Test(studenti[2],odg);
		
		testiranje[0].dodajTest(testovi[0]);
		testiranje[0].dodajTest(testovi[1]);
		testiranje[0].dodajTest(testovi[2]);
		
		arhiva.dodajUpitnik(testiranje[0]);
		
		odg[0]="a";
		odg[1]="a";
		odg[2]="c";
		odg[3]="c";
		testovi[0]=new Test(studenti[0], odg);
		odg[0]="a";
		odg[1]="d";
		odg[2]="h";
		odg[3]="a";
		testovi[1]=new Test(studenti[1],odg);
		odg[0]="a";
		odg[1]="c";
		odg[2]="b";
		odg[3]="b";
		testovi[2]=new Test(studenti[2],odg);
		
		testiranje[1].dodajTest(testovi[0]);
		testiranje[1].dodajTest(testovi[1]);
		testiranje[1].dodajTest(testovi[2]);
		
		arhiva.dodajUpitnik(testiranje[1]);
		
		Anketiranje[] anketiranje=new Anketiranje[2];
		anketiranje[0]=new Anketiranje("Zimski semestar");
		anketiranje[1]=new Anketiranje("Letnji semestar");
		anketiranje[0].dodajListic(new AnketniListic(nastavnici[0],10));
		anketiranje[0].dodajListic(new AnketniListic(nastavnici[1],10));
		anketiranje[0].dodajListic(new AnketniListic(nastavnici[0],9));
		anketiranje[0].dodajListic(new AnketniListic(nastavnici[1],10));
		anketiranje[0].dodajListic(new AnketniListic(nastavnici[0],10));
	
		anketiranje[1].dodajListic(new AnketniListic(nastavnici[0],10));
		anketiranje[1].dodajListic(new AnketniListic(nastavnici[1],10));
		anketiranje[1].dodajListic(new AnketniListic(nastavnici[0],6));
		anketiranje[1].dodajListic(new AnketniListic(nastavnici[1],7));
		anketiranje[1].dodajListic(new AnketniListic(nastavnici[0],8));
		
		arhiva.dodajUpitnik(anketiranje[0]);
		arhiva.dodajUpitnik(anketiranje[1]);
		
		arhiva.stampajArhivuUpitnika();
		
		Osoba[] osobe=new Osoba[5];
		osobe[0]=studenti[0];
		osobe[1]=nastavnici[0];
		osobe[2]=studenti[1];
		osobe[3]=studenti[2];
		osobe[4]=nastavnici[1];
		for (int i=0;i<4;i++) {
			if (osobe[i] instanceof Student){
				for (int j=i+1;j<5;j++) {
					
					try {
						if (((Student)osobe[i]).uporedi(osobe[j], arhiva)==2){
							Osoba o=osobe[i];
							osobe[i]=osobe[j];
							osobe[j]=o;
						}
					} catch (NemogucePoredjenje e) {
						System.out.println(e);
					}
						
				}
			}
			else{
				for (int j=i+1;j<5;j++) {
					try {
						if (((Nastavnik)osobe[i]).uporedi(osobe[j], arhiva)==2){
							Osoba o=osobe[i];
							osobe[i]=osobe[j];
							osobe[j]=o;
						}
					} catch (NemogucePoredjenje e) {
						System.out.println(e);
					}
						
				}
			}
		}
		System.out.println("POREDJENJE");
		for (int i = 0; i < osobe.length; i++) {
			System.out.println(osobe[i]+ " ---------- OCENA = "+osobe[i].getOcena());
		}
		
	}

}
