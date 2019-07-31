package igraci;
import igre.*;
import karte.Karta;
import karte.Znak;


public abstract class Igrac {
	protected Karta karte[]=new Karta[8];
	protected int brPoena;
	protected int poeniUOvojIgri;
	protected int brIgara;
	protected int brKarata;
	protected boolean igramPrvi;
	protected Igra igre[]=new Igra[6];
	protected int rbIgraca;
	protected static Igra trenutnaIgra;
	protected Karta talon;
	
	public Igrac(int rb){
		brPoena=0;
		rbIgraca=rb;
		poeniUOvojIgri=0;
		igre[0]=new SvaSrca();
		igre[1]=new Max();
		igre[2]=new Dame();
		igre[3]=new ZacaTref();
		igre[4]=new SestaRukaIKraljSrce();
		igre[5]=new Min();
		brIgara=6;
	}
	
	public Karta getKarta(int i) {
		return karte[i];
	}

	public void setBrPoena(int brPoena) {
		this.brPoena = brPoena;
	}

	public void setPoeniUOvojIgri(int poeniUOvojIgri) {
		this.poeniUOvojIgri = poeniUOvojIgri;
	}

	

	public int getBrPoena() {
		return brPoena;
	}

	public int getPoeniUOvojIgri() {
		return poeniUOvojIgri;
	}

	

	public int getBrIgara() {
		return brIgara;
	}

	public int getBrKarata() {
		return brKarata;
	}

	public boolean isIgramPrvi() {
		return igramPrvi;
	}
	public void setIgramPrvi(boolean igram) {
		igramPrvi=igram;
	}
	public void setBrKarata(int brKarata) {
		this.brKarata = brKarata;
	}

	public int getRbIgraca() {
		return rbIgraca;
	}

	public Karta getTalon() {
		return talon;
	}

	public void dodeliKarte(Karta karta){
		karte[brKarata++]=karta;
	}
	public void osveziTalon() {
		if (this instanceof Takmicar){
				if (trenutnaIgra.getZnak()==null)
					trenutnaIgra.setZnak(talon.getZnak());
		}
		if (trenutnaIgra.getBrKarataNaTalonu()==4){
			trenutnaIgra.poeni();
			trenutnaIgra.novaRuka();
			
			trenutnaIgra.setBrKarataNaTalonu(0);
			trenutnaIgra.setZnak(null);

		}
		
		
		

	}
	public void sortKarte(){
		int  j=0;
		for (int i = 0; i < karte.length; i++) {
			if (karte[i].getZnak()==Znak.TREF){
				Karta pom=karte[j];
				karte[j]=karte[i];
				karte[i]=pom;
				j++;
			}
		}
		for (int i = 0; i < karte.length-1; i++) {
			if (karte[i].getZnak()==Znak.TREF){
				for (int k = i+1; k < karte.length; k++) {
					if (karte[i].getZnak()==karte[k].getZnak() && karte[i].getBroj()!=1){
						if (karte[i].getBroj()<karte[k].getBroj() || karte[k].getBroj()==1){
							
							Karta pom=karte[k];
							karte[k]=karte[i];
							karte[i]=pom;
						}
					}
					else
						break;
				}
				
			}
		}
		for (int i = 0; i < karte.length; i++) {
			if (karte[i].getZnak()==Znak.SRCE){
				Karta pom=karte[j];
				karte[j]=karte[i];
				karte[i]=pom;
				j++;
			}
		}
		for (int i = 0; i < karte.length-1; i++) {
			if (karte[i].getZnak()==Znak.SRCE){
				for (int k = i+1; k < karte.length; k++) {
					if (karte[i].getZnak()==karte[k].getZnak() && karte[i].getBroj()!=1){
						if (karte[i].getBroj()<karte[k].getBroj() || karte[k].getBroj()==1){
							
							Karta pom=karte[k];
							karte[k]=karte[i];
							karte[i]=pom;
						}
					}
					else
						break;
				}
				
			}
		}
		for (int i = 0; i < karte.length; i++) {
			if (karte[i].getZnak()==Znak.PIK){
				Karta pom=karte[j];
				karte[j]=karte[i];
				karte[i]=pom;
				j++;
			}
		}
		for (int i = 0; i < karte.length-1; i++) {
			if (karte[i].getZnak()==Znak.PIK){
				for (int k = i+1; k < karte.length; k++) {
					if (karte[i].getZnak()==karte[k].getZnak() && karte[i].getBroj()!=1){
						if (karte[i].getBroj()<karte[k].getBroj() || karte[k].getBroj()==1){
							
							Karta pom=karte[k];
							karte[k]=karte[i];
							karte[i]=pom;
						}
					}
					else
						break;
				}
				
			}
		}
		for (int i = 0; i < karte.length; i++) {
			if (karte[i].getZnak()==Znak.KOCKA){
				Karta pom=karte[j];
				karte[j]=karte[i];
				karte[i]=pom;
				j++;
			}
		}
		for (int i = 0; i < karte.length-1; i++) {
			if (karte[i].getZnak()==Znak.KOCKA){
				for (int k = i+1; k < karte.length; k++) {
					if (karte[i].getZnak()==karte[k].getZnak() && karte[i].getBroj()!=1){
						if (karte[i].getBroj()<karte[k].getBroj() || karte[k].getBroj()==1){
							
							Karta pom=karte[k];
							karte[k]=karte[i];
							karte[i]=pom;
						}
					}
					else
						break;
				}
				
			}
		}
	}
	void novaIgra(){
		
		
		for (int i = 0; i < brIgara; i++) {
			if (igre[i]==trenutnaIgra){
				for (int j = i; j < brIgara-1; j++) {
					igre[j]=igre[j+1];
				}
				igre[brIgara-1]=null;
				brIgara--;
				break;
			}
		}
		
		for (int i = 0; i < trenutnaIgra.getBrPrethodnihKarata(); i++) {
			trenutnaIgra.setPrethodnaKarta(i,null);
		}
		trenutnaIgra.setBrPrethodnihKarata(0);
	}
	
	public abstract int odigrajPotez(Karta karta);
	public abstract Igra izaberiIgru(int i);
	public void stampajKarte(){
		for (int i = 0; i < karte.length; i++) {
			System.out.println(karte[i].getZnak()+"   "+karte[i].getBroj());
		}
	}

	public void setTalon(Karta karta) {
		talon=karta;
	}

	public Igra getIgre(int i) {
		// TODO Auto-generated method stub
		return	igre[i];
	}

	public static Igra getTrenutnaIgra() {
		return trenutnaIgra;
	}

	public static void setTrenutnaIgra(Igra trenutnaIgra) {
		Igrac.trenutnaIgra = trenutnaIgra;
	}
	
}
