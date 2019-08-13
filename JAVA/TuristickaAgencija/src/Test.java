import Izuzeci.NepostojecaDestinacija;
import Karte.BiznisKlasa;
import Prevoz.*;
import Putnici.*;


public class Test {

	public static void main(String[] args)  {
		TuristickaAgencija turistickaAgencija = new TuristickaAgencija("IMI Travel",
				2);
				Destinacija d1 = new Destinacija("Kragujevac", "Pariz", 1900, 5);
				PrevoznoSredstvo a1 = new Avion(900,1,5);
				d1.dodajPrevoznoSredstvo(a1);
				PrevoznoSredstvo v1 = new Autobus(80,5);
				d1.dodajPrevoznoSredstvo(v1);
				turistickaAgencija.dodajDestinaciju(d1);
				Destinacija d2 = new Destinacija("Kragujevac", "London", 2225, 10);
				PrevoznoSredstvo a2 = new Avion(900,1,5);
				d2.dodajPrevoznoSredstvo(a2);
				PrevoznoSredstvo v2 = new Autobus(80,4);
				d2.dodajPrevoznoSredstvo(v2);
				turistickaAgencija.dodajDestinaciju(d2);
				
				
				//TO DO 1
				// Za svakog putnika iz niza "putniciZaPariz" pokusaj da kupis kartu od
				//turisticke agencije za destinacija "Kragujevac", "Pariz"
				
				Putnik putniciZaPariz[]= new Putnik[5];
				putniciZaPariz[0] = new Student("Maja", "54/08", 60000, 10);
				putniciZaPariz[1] = new Radnik("Mila", "Informaticar", 20000, 15);
				putniciZaPariz[2] = new Radnik("Ana", "Informaticar", 15000, 20);
				putniciZaPariz[3] = new Student("Milica", "60/08", 11000, 20);
				putniciZaPariz[4] = new Student("Marina", "59/08", 14000, 10);
				
				System.out.println("PARIS");
				
				for (Putnik putnik : putniciZaPariz) {
					try {
						turistickaAgencija.kupiKartu("Kragujevac", "Pariz", putnik);
					} catch (NepostojecaDestinacija e) {
						// TODO Auto-generated catch block
						System.out.println(e);
					}
				}
				
				//TO DO 2
				// Za svakog putnika iz niza "putniciZaLondon" pokusaj da kupis
				//kartu od turisticke agencije za destinacija "Kragujevac", "London"
				
				Putnik putniciZaLondon[]= new Putnik[5];
				putniciZaLondon[0] = new Student("Pera", "590/08", 54000, 10);
				putniciZaLondon[1] = new Radnik("Zika", "Informaticar", 20000, 15);
				putniciZaLondon[2] = new Radnik("Zika", "Informaticar", 20000, 20);
				putniciZaLondon[3] = new Student("Pavle", "60/09", 20000, 20);
				putniciZaLondon[4] = new Student("Milivoje", "59/07", 20000, 10);
				
				System.out.println("LONDON");

				
				for (Putnik putnik : putniciZaLondon) {
					try {
						turistickaAgencija.kupiKartu("Kragujevac", "London", putnik);
					} catch (NepostojecaDestinacija e) {
						// TODO Auto-generated catch block
						System.out.println(e);;
					}
				}
				//TO DO 3 
				// Ispisati na standardni izlaz imena putnika koji su kupili
				//avionsku biznis klasu
			
				System.out.println("BIZNIS KLASE");

				
				for (Putnik putnik : putniciZaPariz) {
					if (putnik.getKarta() instanceof BiznisKlasa)
						System.out.println(putnik);
				}
				
				for (Putnik putnik : putniciZaLondon) {
					if (putnik.getKarta() instanceof BiznisKlasa)
						System.out.println(putnik);
				}
				//TO DO 4 
				// Ispisati na standardni izlaz koliko su putnici ukupno potrosili
				//novca na kupovinu karata
				
				double suma=0;
				for (Putnik putnik : putniciZaPariz) {
					if (putnik.getKarta()!=null)
					suma+=putnik.getKarta().dajCenuKarte();
				}
				
				for (Putnik putnik : putniciZaLondon) {
					if (putnik.getKarta()!=null)
					suma+=putnik.getKarta().dajCenuKarte();
				}
				System.out.println("Suma= "+suma);
				
				
				

	}

}