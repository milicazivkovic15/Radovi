import Izuzeci.NedovoljnoNovca;
import Izuzeci.NepostojecaDestinacija;
import Karte.*;
import Putnici.*;


public class TuristickaAgencija {
	private Destinacija[] destinacije;
	private String naziv;
	
	public TuristickaAgencija(String nazivv, int brDestinacija){
		naziv=nazivv;
		destinacije=new Destinacija[brDestinacija];
	}
	
	
	public void dodajDestinaciju(Destinacija dest){
		for (int i = 0; i < destinacije.length; i++)
			if (destinacije[i]==null){
				destinacije[i]=dest;
				break;
			}
	}
	public Karta kupiKartu (String odMesta, String doMesta,Putnik putnik)throws NepostojecaDestinacija{
		boolean flag=false;
		for (int i = 0; i < destinacije.length && destinacije[i]!=null; i++) {
			if (destinacije[i].equals(odMesta, doMesta)){
				
				flag=true;
				try {
					Karta k=destinacije[i].kupiKartu(putnik);
					putnik.setKarta(k);
					System.out.println(k);
					return k;
				} catch (NedovoljnoNovca e) {
					// TODO Auto-generated catch block
					System.out.println(e);;
				}
				
			}
		}
		
		if (flag==false)
			throw new NepostojecaDestinacija("Nema destinacije od "+odMesta+" do "+ doMesta);
		return null;
	}
}