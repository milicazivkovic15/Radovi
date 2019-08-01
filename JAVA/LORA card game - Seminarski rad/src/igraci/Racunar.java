package igraci;

import karte.*;
import igre.*;
public class Racunar  extends Igrac{

	public Racunar(int rb) {
		super(rb);
		// TODO Auto-generated constructor stub
	}
	public Igra izaberiIgru(int k){
	
		for (int i = 0; i < brIgara; i++) {
			if (igre[i].preporucujemIgru(this)==true){
				trenutnaIgra=igre[i];
				trenutnaIgra.setRuka(0);
				trenutnaIgra.setZnak(null);
				
				novaIgra();
				return trenutnaIgra;
			}
		}

		return null;
	}
	public int odigrajPotez(Karta karta){
		Karta k=trenutnaIgra.preporucenPotez(this);
		int i;
		for (i = 0; i < brKarata; i++) {
			if (karte[i]==k) {
				for (int j = i; j < brKarata-1; j++) {
					karte[j]=karte[j+1];
				}
				break;
			}
		}
		trenutnaIgra.talon(this,k);

		if (brKarata>0)
			karte[brKarata-1]=null;

		else System.err.println(brKarata+" a joooooooj ");
		brKarata--;
		
		return i;
	}
}
