
import Izuzeci.NedovoljnoNovca;
import Karte.*;
import Prevoz.*;
import Putnici.*;

public class Destinacija {
	private PrevoznoSredstvo[] prevoznaSredstva;
	private String odMesta;
	private String doMesta;
	private double razdaljina;

	public Destinacija(String odMesta, String doMesta, double razdaljina,
			int maxBrojPrevoznihSredstava) {
		this.odMesta = odMesta;
		this.doMesta = doMesta;
		this.razdaljina = razdaljina;
		prevoznaSredstva = new PrevoznoSredstvo[maxBrojPrevoznihSredstava];
	}

	public void dodajPrevoznoSredstvo(PrevoznoSredstvo prevoznosredstvo) {
		for (int i = 0; i < prevoznaSredstva.length; i++)
			if (prevoznaSredstva[i] == null) {
				prevoznaSredstva[i] = prevoznosredstvo;
				break;
			}
	}

	public boolean equals(String odMestaa, String doMestaa) {
		if (doMestaa.equals(doMesta) && odMestaa.equals(odMesta))
			return true;
		return false;
	}
	public Karta kupiKartu(Putnik putnik) throws NedovoljnoNovca{
		int k=0;
		Karta karta=null;
		Karta kk;
		boolean flag=false;
		for (int i=0;i<prevoznaSredstva.length && prevoznaSredstva[i]!=null ;i++) {
			karta = prevoznaSredstva[i].dajKartu(razdaljina, putnik);
			if (karta!=null){	
				double min=prevoznaSredstva[i].vremePutovanja(razdaljina);
				k=i;
				flag=true;
				for (int j = i+1; j < prevoznaSredstva.length && prevoznaSredstva[j]!=null; j++) {
					if (prevoznaSredstva[j].vremePutovanja(razdaljina)<min ) {
						kk=prevoznaSredstva[j].dajKartu(razdaljina, putnik);
						if (kk!=null){
							min=prevoznaSredstva[j].vremePutovanja(razdaljina);
							k=j;
							karta=kk;
						}
					}
				}
				break;
			}
		}
		if (flag==true){
			prevoznaSredstva[k].cekirajKartu(karta);
			return karta;
		}
		else
			throw new NedovoljnoNovca("Nedovoljno novca :(");
		
			
	}
}