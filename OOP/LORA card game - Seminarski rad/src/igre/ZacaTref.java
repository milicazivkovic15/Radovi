package igre;

import igraci.Igrac;
import karte.Karta;
import karte.Znak;

public class ZacaTref extends Igra{

	@Override
	public Karta preporucenPotez(Igrac igrac) {
		
		int br=0;
		int max=0;
		karteKojeSuPreostale(igrac);

		while (trenutneKarte[br]!=null){
			
			if (trenutneKarte[br].getBroj()==1 && znak==trenutneKarte[br].getZnak())
				max=15;
			else if (trenutneKarte[br].getBroj()>max && znak==trenutneKarte[br].getZnak())
				max=trenutneKarte[br].getBroj();
			br++;
		}
		//ti prvi bacas kartu
		if (max==0){
			int k=0;
			int nizBrojeva[]=new int[2*igrac.getBrKarata()];
			Znak z;
			int broj;
			int brojVecihKarata;
			int brojManjihKarata;
			
			for (int i = 0; i < igrac.getBrKarata(); i++) {
				
				z=igrac.getKarta(i).getZnak();
				broj=igrac.getKarta(i).getBroj();
				brojVecihKarata=0;
				brojManjihKarata=0;
				if (broj!=1){
					for (int j = 0; j < 32; j++) {
							if (preostaleKarte.getKarta(j)!=null && preostaleKarte.getKarta(j).getZnak()==z ){
							while(preostaleKarte.getKarta(j).getZnak()==z){
								//System.err.println(preostaleKarte.getKarta(j).getBroj());
								if (preostaleKarte.getKarta(j).getBroj()<broj && preostaleKarte.getKarta(j).getBroj()!=1){
										brojManjihKarata++;
								}
								else
									brojVecihKarata++;
								
								j++;
								while(j<32 && preostaleKarte.getKarta(j)==null ) {
									j++;
								}
								if (j==32)
									break;
							}
							break;
						}
					}
					if (brojManjihKarata==0 && brojVecihKarata>0){//nema manjih karata al ima karata u tom znaku
						znak=igrac.getKarta(i).getZnak();
						return igrac.getKarta(i);
					}
				}
					nizBrojeva[k++]=brojManjihKarata;
					nizBrojeva[k++]=brojVecihKarata;
					brojManjihKarata=0;
					brojVecihKarata=0;
				
			}
			for (int i = 0; i < k; i+=2) {
				if (nizBrojeva[i+1]>1 && nizBrojeva[i]<3){
					i/=2;
					znak=igrac.getKarta(i).getZnak();
					return igrac.getKarta(i);
				}
			}
		
			//do ovde trazi stv najmanju kartu
			int min=15;
			int f=-1;
			int t=-1;
			for (int i = 0; i < igrac.getBrKarata(); i++) {
					if (igrac.getKarta(i).getBroj()==1)
						f=i;
					else if(igrac.getKarta(i).getBroj()<min ){
						min=igrac.getKarta(i).getBroj();
						t=i;
					}	
				
			}
			if (t==-1){
				znak=igrac.getKarta(f).getZnak();

				return igrac.getKarta(f);
			}
			znak=igrac.getKarta(t).getZnak();

			return igrac.getKarta(t);
		}
		
		//ovde izbacuje minimalnu kartu koju ima
		

		for (int i = 0; i < igrac.getBrKarata(); i++) {
			if (igrac.getKarta(i).getZnak()==znak){
				int j=i;
				while (i<igrac.getBrKarata() && igrac.getKarta(i).getZnak()==znak ){
					if (igrac.getKarta(i).getBroj()<max && igrac.getKarta(i).getBroj()!=1){	
						if (znak==Znak.TREF && igrac.getKarta(i).getBroj()>12)
							for (int k = i; k < igrac.getBrKarata(); k++) {
								if (igrac.getKarta(k).getZnak()!=znak || igrac.getKarta(k).getBroj()<12)
									break;
								if(igrac.getKarta(k).getBroj()==12)
									return igrac.getKarta(k);
							}
						return igrac.getKarta(i);
					}
					i++;
				}
				if (brKarataNaTalonu==3 && (igrac.getKarta(j).getBroj()!=12 || igrac.getKarta(j).getZnak()!=Znak.TREF))
					return igrac.getKarta(j);//ako vec nema da se podvuce da uzme najvecom
				
				if (igrac.getKarta(i-1).getBroj()==12 && igrac.getKarta(i-1).getZnak()==Znak.TREF)
					if (i>1)
						if(igrac.getKarta(i-2)!=null && igrac.getKarta(i-2).getZnak()==Znak.TREF)
							return igrac.getKarta(i-2);
				
				return igrac.getKarta(i-1);
			}
			
		}
		//ovde izbacuje 12 tref ako ima pa prvu manju kartu od karata na talonu ili ako nema prvu vecu
		for (int i = 0; i < igrac.getBrKarata(); i++) {
			if (igrac.getKarta(i).getBroj()==12 && igrac.getKarta(i).getZnak()==Znak.TREF)
				return igrac.getKarta(i);
		}
		
		int nizMaksimuma[]=new int[4];
		int brojManjihKarata[]=new int[4];
		int j=-1;
		for (int k = 0; k < igrac.getBrKarata(); k++) {
			if (igrac.getKarta(k).getBroj()>12){
				j=0;
				if (igrac.getKarta(k+1)!=null && igrac.getKarta(k+1).getZnak()==igrac.getKarta(k).getZnak())
					nizMaksimuma[0]=k+1;
				else
					nizMaksimuma[0]=k;
					
				Znak z=igrac.getKarta(k).getZnak();
			
				for (int i = k+1; i < igrac.getBrKarata(); i++) {
					if (igrac.getKarta(i).getZnak()==z){
						if(igrac.getKarta(i).getBroj()<13)
							brojManjihKarata[j]++;
					}
					else{
						for (int i1 = i; i1 < igrac.getBrKarata(); i1++) 
							if (igrac.getKarta(i1).getBroj()>12){
								if (igrac.getKarta(i1+1)!=null && igrac.getKarta(i1+1).getZnak()==igrac.getKarta(i1).getZnak())
									nizMaksimuma[++j]=i1+1;
								else
									nizMaksimuma[++j]=i1;
								z=igrac.getKarta(i1).getZnak();
								i=i1;
								break;
							}
							else
								i++;
					}
				}//na 0 mesto pamtim najveci br, a na 1. mesto pamtim koliko ima karata u tom znaku sem nje
				
			break;	
			}
		}
		
		int min=7;
		int t=-1;
		for (int i = 0; i < j+1; i++) {
			if(brojManjihKarata[i]<min){
				//System.out.println(brojManjihKarata[i]+ "  "+igrac.getKarta(nizMaksimuma[i]).getBroj());
				t=i;
				min=brojManjihKarata[i];
			}
		}
		for (int i = 0; i < j+1; i++) {
			if (brojManjihKarata[i]==min && t!=i){
				if (igrac.getKarta(nizMaksimuma[i]).getBroj()>igrac.getKarta(nizMaksimuma[t]).getBroj())
					t=i;
			}
		}
		if (j!=-1){
			if (nizMaksimuma[t]==0)
				return igrac.getKarta(nizMaksimuma[t]);
			else if( igrac.getKarta(nizMaksimuma[t]-1).getZnak()!=igrac.getKarta(nizMaksimuma[t]).getZnak())
				return igrac.getKarta(nizMaksimuma[t]);					
			else 
				return igrac.getKarta(nizMaksimuma[t]-1);
			
		}
			//do ovde stv izbacuje najodgovarajucu max kartu >12
			

		
		
		 t=0;
		 min=0;
		for (int i = 0; i < igrac.getBrKarata(); i++) {
			if (igrac.getKarta(i).getBroj()==1){
				return igrac.getKarta(i);
			}
			if(igrac.getKarta(i).getBroj()>min ){
				min=igrac.getKarta(i).getBroj();
				t=i;
			}
		}
		
		return igrac.getKarta(t);
		
		
		//ovde izbacuje maximalnu kartu kako bi je se oslobodio posto nema taj znak
	}

	@Override
	public boolean preporucujemIgru(Igrac igrac) {
		for (int i = 0; i < igrac.getBrIgara(); i++) {
			if (igrac.getIgre(i) instanceof ZacaTref && igrac.getIgre(i+1)==null)
				return true;
			
		}
		int br=-1;
		boolean flag=false;
		for (int i = 0; i < igrac.getBrKarata(); i++) {
			if (igrac.getKarta(i).getZnak()==Znak.TREF){
				br=0;
				for (int j = i; j < igrac.getBrKarata(); j++) {
					if(igrac.getKarta(j).getZnak()==Znak.TREF){
						if (igrac.getKarta(j).getBroj()==12)
							flag=true;
						else if (igrac.getKarta(j).getBroj()<12 && flag==true)
							br++;
					}
					else 
						break;
				}
				if (br>1)//ako ima 12 tref i 2 karte manje od 12
					return true;
				if (flag==true){//ako ima 12 tref
					int brZnakova=2;//tref i nulta;
					br=0;
					for (int j = 0; j < igrac.getBrKarata(); j++) {
						if(igrac.getKarta(j).getZnak()!=Znak.TREF ){
							Znak z=igrac.getKarta(j).getZnak();
							for (int k = j; k < igrac.getBrKarata(); k++) {
								if(igrac.getKarta(k).getZnak()!=Znak.TREF ){
									if (igrac.getKarta(k).getZnak()==z && igrac.getKarta(k).getBroj()<11)
										br++;
									else{
										if (br==1) 
											return true;
										z=igrac.getKarta(k).getZnak();
										br=0;
										j--;
										brZnakova++;
									}
								}
							}
							break;
						}
					}//ako u nekom znaku ima samo 1 kartu i to manju od 11
					if (brZnakova<4){
						for (int j = 0; j < igrac.getBrKarata(); j++) {
							if (igrac.getKarta(j).getBroj()<10)
								return true;
						}
					}//ako nema neki znak a ima da se podvuce
				}
				break;
			}
			
		}
		if (br==-1 || flag==false ){//nema trefa ili  nema 12 tref
			for (int j = 0; j < igrac.getBrKarata(); j++) {
				if (igrac.getKarta(j).getBroj()>12){
					br=0;
					for (int j2 = j; j2 < igrac.getBrKarata(); j2++) {
						if (igrac.getKarta(j).getZnak()==igrac.getKarta(j).getZnak()){
							if(igrac.getKarta(j2).getBroj()<13)
								br++;
						}
						else
							break;
					}
					if (br<2){
						flag=true;
						break;
					}
				}
			}//ako nema vecu od 12 kartu ili ima a ima bar 2 u tom znaku da se  podvuce
			if (flag==false)
				return true;

		}
		
		
		return false;
	}

	@Override
	public int dodatiPoene(int ruka, Igrac igraci[]) {
		int poen=0;	
		int max=0;
		int j=-1;
		
		for (int i = 0; i < trenutneKarte.length; i++) {
			if (trenutneKarte[i]!=null) {
				
				if (trenutneKarte[i].getZnak()==Znak.TREF && trenutneKarte[i].getBroj()==12)
					poen+=8;
				if (trenutneKarte[i].getBroj()==1 && trenutneKarte[i].getZnak()==znak){
					max=15;
					j=i;
				}
				if (max<trenutneKarte[i].getBroj() && trenutneKarte[i].getZnak()==znak){
					max=trenutneKarte[i].getBroj();
					j=i;
				}
			}
		}
		igraci[j].setPoeniUOvojIgri(igraci[j].getPoeniUOvojIgri()+poen);
		return j;
	}
}