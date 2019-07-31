package igre;

import igraci.Igrac;
import karte.Karta;
import karte.Spil;
import karte.Znak;

public abstract class Igra {
	protected int brPrethodnihKarata=0;
	protected Karta trenutneKarte[]=new Karta[4];
	protected Karta prethodneKarte[]=new Karta[32];
	protected Znak znak=null;
	protected Spil preostaleKarte;
	protected int ruka;
	protected int brKarataNaTalonu;
	protected Igrac redosledIgraca[]=new Igrac[4];
	protected int brIgraca;
	
	public void talon(Igrac igrac, Karta karta) {
		igrac.setTalon(karta);
		redosledIgraca[brIgraca]=igrac;
		redosledIgraca[brIgraca++].setIgramPrvi(false);
		trenutneKarte[brKarataNaTalonu++]=karta;
		
		
	}
	public void novaRuka() {
		ruka++;
		brIgraca=0;
		for (int i = 0; i < trenutneKarte.length; i++) {
			prethodneKarte[brPrethodnihKarata++]=trenutneKarte[i];
			
			trenutneKarte[i]=null;
			redosledIgraca[i].setTalon(null);
		}
	}
	public void poeni(){
		
		int i=dodatiPoene(ruka,redosledIgraca);
		redosledIgraca[i].setIgramPrvi(true);

		
	
		
	}
	
	void karteKojeSuPreostale(Igrac igrac){
		preostaleKarte=new Spil();
		for (int i = 0; i < brPrethodnihKarata; i++) {
			for (int j = 0; j < 32; j++) {
				if ( preostaleKarte.getKarta(j)!=null && prethodneKarte[i]!=null && preostaleKarte.getKarta(j).getBroj()==prethodneKarte[i].getBroj() && preostaleKarte.getKarta(j).getZnak()==prethodneKarte[i].getZnak()){
					preostaleKarte.setKarta(j,null);
				}
			}
		}
		for (int i = 0; i < igrac.getBrKarata(); i++) {
			for (int j = 0; j < 32; j++) {
				if ( preostaleKarte.getKarta(j)!=null && preostaleKarte.getKarta(j).getBroj()==igrac.getKarta(i).getBroj() && preostaleKarte.getKarta(j).getZnak()==igrac.getKarta(i).getZnak()){
					preostaleKarte.setKarta(j,null);
				}
			}
		}
		
	}
	abstract public Karta preporucenPotez(Igrac igrac);
	abstract public boolean preporucujemIgru(Igrac igrac);
	abstract public int dodatiPoene(int ruka,Igrac igraci[]);
	public Znak getZnak() {
		return znak;
	}
	public int getBrKarataNaTalonu() {
		
		return brKarataNaTalonu;
	}
	public void setZnak(Znak znak2) {
		// TODO Auto-generated method stub
		znak=znak2;
	}
	public void setBrPrethodnihKarata(int i) {
		// TODO Auto-generated method stub
		brPrethodnihKarata=i;

	}
	public int getBrPrethodnihKarata() {
		// TODO Auto-generated method stub
		return brPrethodnihKarata;
	}
	public void setPrethodnaKarta(int i, Karta k) {
		// TODO Auto-generated method stub
		prethodneKarte[i]=k;
	}
	public void setBrKarataNaTalonu(int i) {
		// TODO Auto-generated method stub
		brKarataNaTalonu=i;
	}
	public void setRuka(int i) {
		// TODO Auto-generated method stub
		ruka=i;
	}
}
