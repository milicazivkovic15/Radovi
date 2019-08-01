package igraci;

import karte.*;
import igre.*;
public class Takmicar extends Igrac{

	public Takmicar(int rb) {
		super(rb);
		// TODO Auto-generated constructor stub
	}
	public Igra izaberiIgru(int i){
		trenutnaIgra=igre[i];
		trenutnaIgra.setRuka(0);
		trenutnaIgra.setZnak(null);

		novaIgra();
		return igre[i];
	}
	public int odigrajPotez(Karta karta){
		int i;
		for ( i = 0; i < brKarata; i++) {
			if (karte[i]==karta) {
				for (int j = i; j < brKarata-1; j++) {
					karte[j]=karte[j+1];
				}
				break;
			}
		}
		trenutnaIgra.talon(this,karta);

		if (brKarata>0)
			karte[brKarata-1]=null;
		brKarata--;
		return i;
	}
}
