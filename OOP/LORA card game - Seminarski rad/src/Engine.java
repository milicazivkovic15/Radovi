import igraci.Igrac;
import igraci.Racunar;
import igraci.Takmicar;
import igre.Dame;
import igre.Igra;
import igre.Max;
import igre.Min;
import igre.SestaRukaIKraljSrce;
import igre.SvaSrca;
import igre.ZacaTref;
import karte.Spil;

public class Engine {
	private Igrac igraci[]=new Igrac[4];
	private Spil spil;
	private int brIgracaNaRedu=0;
	private Igra odabranaIgra;
	private int poslednjiBirao;
	
	public Engine(){
		init();
	}
	public int poslednjiBiraoIgru(){
		return poslednjiBirao;
	}
	public Igrac itiIgrac(int i){
		return igraci[i];
	}
	public Igra odabranaIgra(){
		return odabranaIgra;
	}
	public Igrac takmicar(){
		return igraci[0];
	}
	public Igrac igracNaPotezu(){
		return igraci[brIgracaNaRedu];
	}
	public int redniBrojTrenutnogIgraca(){
		return brIgracaNaRedu;
	}
	void init(){
		
		igraci[0]=new Takmicar(0);	
		igraci[0].setIgramPrvi(true);
		
		for (int i = 1; i < igraci.length; i++) {
			igraci[i]=new Racunar(i);
			if (i==0)
				igraci[i].setIgramPrvi(true);
		}
		spil=new Spil();
		spil.promesajKarte();
		koIgra();
		podeliKarte();
		poslednjiBirao=0;
	}
	void podeliKarte(){
		for (int i = 0; i < igraci.length; i++) {
			igraci[i].setBrKarata(0);
		}
		int i=brIgracaNaRedu;
		for (int j = 0; j < 32; j++) {
			if (igraci[i].getBrKarata()==8){
				igraci[i].sortKarte();
				if (i==3)
					i=0;
				else
					i++;
			}
			igraci[i].dodeliKarte(spil.getKarta(j));

			
		}
		igraci[i].sortKarte();
		spil.promesajKarte();
		for (int j = 0; j < igraci.length; j++) {
			igraci[j].stampajKarte();
		}
	}
	void birajIgru(NazivIgara igra){
		if (igra==null)
			odabranaIgra=igraci[poslednjiBirao].izaberiIgru(9);
		else{
			if (igra==NazivIgara.DAME)
				for (int i = 0; i < igraci[0].getBrIgara(); i++) {
					if(igraci[0].getIgre(i) instanceof Dame){
						odabranaIgra=igraci[0].izaberiIgru(i);
					}
				}
			else if(igra==NazivIgara.MAX)
				for (int i = 0; i < igraci[0].getBrIgara(); i++) {
					if(igraci[0].getIgre(i) instanceof Max){
						odabranaIgra=igraci[0].izaberiIgru(i);
					}
				}
			else if(igra==NazivIgara.MIN)
				for (int i = 0; i < igraci[0].getBrIgara(); i++) {
					if(igraci[0].getIgre(i) instanceof Min){
						odabranaIgra=igraci[0].izaberiIgru(i);
					}
				}
			else if(igra==NazivIgara.SESTARUKAIKRALJSRCE)
				for (int i = 0; i < igraci[0].getBrIgara(); i++) {
					if(igraci[0].getIgre(i) instanceof SestaRukaIKraljSrce){
						odabranaIgra=igraci[0].izaberiIgru(i);
					}
				}
			else if(igra==NazivIgara.SVASRCA)
				for (int i = 0; i < igraci[0].getBrIgara(); i++) {
					if(igraci[0].getIgre(i) instanceof SvaSrca){
						odabranaIgra=igraci[0].izaberiIgru(i);
					}
				}
			else if(igra==NazivIgara.ZACATREF)
				for (int i = 0; i < igraci[0].getBrIgara(); i++) {
					if(igraci[0].getIgre(i) instanceof ZacaTref){
						odabranaIgra=igraci[0].izaberiIgru(i);
					}
				}	
		}
	}
	
	public int odigrajPotez(int brKarte){
		
		int i;
		if (brKarte==8)
			i= igraci[brIgracaNaRedu].odigrajPotez(null);
		else{
			boolean f=true;
			for (int j = 0; j < igraci[brIgracaNaRedu].getBrKarata(); j++) {
				if (igraci[brIgracaNaRedu].getKarta(j).getZnak()==Igrac.getTrenutnaIgra().getZnak())
					f=false;
			}
			if (brKarte>=igraci[brIgracaNaRedu].getBrKarata())
				return -1;
			if (igraci[brIgracaNaRedu].getKarta(brKarte).getZnak()!=Igrac.getTrenutnaIgra().getZnak() && Igrac.getTrenutnaIgra().getZnak()!=null && f==false)
					return -1;
			i=igraci[brIgracaNaRedu].odigrajPotez(igraci[brIgracaNaRedu].getKarta(brKarte));
		}

		return i;
		
	}
	public boolean next(){
		boolean f=false;
		if (Igrac.getTrenutnaIgra()!=null && Igrac.getTrenutnaIgra().getBrKarataNaTalonu()==0){
			f=true;
			koIgra();
		}
		else if (brIgracaNaRedu==3)
			brIgracaNaRedu=0;
		
		else
			brIgracaNaRedu++;
		
		return f;
	}
	void koIgra(){
		for (int i = 0; i < igraci.length; i++) {
			if (igraci[i].isIgramPrvi()==true){
				brIgracaNaRedu=i;
				break;
			}
		}
	}
	boolean krajIgre(){
		if (igraci[brIgracaNaRedu].getBrKarata()==0){
			if (poslednjiBirao==3)
				poslednjiBirao=0;
			
			else
				poslednjiBirao++;

			brIgracaNaRedu=poslednjiBirao;

			return true;
		}
		int sum=0;
		for (int i = 0; i < igraci.length; i++) {
			if (igraci[i].getPoeniUOvojIgri()==8 || igraci[i].getPoeniUOvojIgri()==-8){
					if (poslednjiBirao==3)
						poslednjiBirao=0;
					
					else
						poslednjiBirao++;

					brIgracaNaRedu=poslednjiBirao;

					return true;
				}
			sum+=igraci[i].getPoeniUOvojIgri();
		}
		if (sum==8){
			if (poslednjiBirao==3)
				poslednjiBirao=0;
			
			else
				poslednjiBirao++;

			brIgracaNaRedu=poslednjiBirao;

			return true;
		}
		return false;
	}
	void dodeliPoene(){
		for (int i = 0; i < igraci.length; i++) {

			igraci[i].setBrPoena(igraci[i].getBrPoena()+igraci[i].getPoeniUOvojIgri());
			igraci[i].setPoeniUOvojIgri(0);
		}
	}
	boolean kraj(){
		if (brIgracaNaRedu==0 && takmicar().getBrIgara()==0)
			return true;
		return false;
	}
	Igrac[] nagrada(){
		Igrac[] rBrIgraca=new Igrac[4];
		int j=0;
		int brIgraca=poslednjiBirao-1;
		if (brIgraca==-1)
			brIgraca=3;
		if (Igrac.getTrenutnaIgra()!=null && (Igrac.getTrenutnaIgra() instanceof Max || Igrac.getTrenutnaIgra() instanceof SvaSrca))
			for (int i = 0; i < igraci.length; i++) {
				if (igraci[i].getPoeniUOvojIgri()<-3 && i!=brIgraca){
					igraci[i].setBrPoena(igraci[i].getBrPoena()-5);
					rBrIgraca[j++]=igraci[i];
				}
			}
		
		return rBrIgraca;
	}
	void pobednik(){
		
		for (int i = 0; i < 3; i++) {
			for (int j = i+1; j < 4; j++) {
				if (igraci[i].getBrPoena()>igraci[j].getBrPoena()){
					Igrac pom=igraci[i];
					igraci[i]=igraci[j];
					igraci[j]=pom;
				}
			}
		}
	}
}
