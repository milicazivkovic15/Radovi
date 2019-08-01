package igre;

import igraci.Igrac;
import karte.Karta;
import karte.Znak;

public class Max extends Igra{

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

			for (int i = 0; i < igrac.getBrKarata(); i++) {
				
				Znak z=igrac.getKarta(i).getZnak();
				int broj=igrac.getKarta(i).getBroj();
				boolean flag=false;
				if (broj==1){
					znak=igrac.getKarta(i).getZnak();
					return igrac.getKarta(i);
				}
				for (int j = 0; j < 32; j++) {
					if (preostaleKarte.getKarta(j)!=null && preostaleKarte.getKarta(j).getZnak()==z ){
						if (preostaleKarte.getKarta(j).getBroj()>broj || preostaleKarte.getKarta(j).getBroj()==1){
							flag=true;
							break;
						}
						break;
					}
				}
				if (flag==false){
					znak=igrac.getKarta(i).getZnak();
					return igrac.getKarta(i);
				}
			}

			//do ovde trazi stv najvecu kartu
			int t=-1;
			max=15;//min

			for (int i = 0; i < igrac.getBrKarata(); i++) {
					if(igrac.getKarta(i).getBroj()<max && igrac.getKarta(i).getBroj()>8 && igrac.getKarta(i).getBroj()<14){
						max=igrac.getKarta(i).getBroj();
						t=i;
					}	
				
			}
			if (t!=-1){
				znak=igrac.getKarta(t).getZnak();
				
				return igrac.getKarta(t);
			}

			for (int i = 0; i < igrac.getBrKarata(); i++) {
					if(igrac.getKarta(i).getBroj()<max){
						max=igrac.getKarta(i).getBroj();
						t=i;
					}	
			}
			znak=igrac.getKarta(t).getZnak();
			
			return igrac.getKarta(t);

		}
		//ovde izbacuje maximalnu kartu koju ima
		

		for (int i = 0; i < igrac.getBrKarata(); i++) {
			if (igrac.getKarta(i).getZnak()==znak){

				while (igrac.getKarta(i)!=null && igrac.getKarta(i).getZnak()==znak ){
					if (igrac.getKarta(i).getBroj()==1 && brKarataNaTalonu!=3){
						return igrac.getKarta(i);
					}
					else if (igrac.getKarta(i).getBroj()>max || igrac.getKarta(i).getBroj()==1){
						if (brKarataNaTalonu==3){
							int j=-1;
							//System.out.println("najaci na talonu");
							while((igrac.getKarta(i).getBroj()>max || igrac.getKarta(i).getBroj()==1) && igrac.getKarta(i).getZnak()==znak ){
								j=i;
								i++;
								if (i==igrac.getBrKarata()) break;
							}
							return igrac.getKarta(j);
						}
						return igrac.getKarta(i);

					}
					
					i++;
					if (i==igrac.getBrKarata()) break;
				}
				return igrac.getKarta(i-1);
	
					
			}
			
		}
		//ovde izbacuje max kartu ako ima ako ne podvlaci se
		
		int nizMinimuma[]=new int[4];
		int brojVecihKarata[]=new int[4];
		int j=-1;
		for (int k = 0; k < igrac.getBrKarata(); k++) {
			if (igrac.getKarta(k).getBroj()<13 && igrac.getKarta(k).getBroj()!=1){
				j=0;
				
				Znak z=igrac.getKarta(k).getZnak();
				int t=k;
				while (k>0){
				if (igrac.getKarta(k-1).getZnak()==z && igrac.getKarta(k-1).getBroj()>igrac.getKarta(t).getBroj())
					k--;
				else
					break;
				}
				nizMinimuma[0]=k;
				
				
				for (int i = k; i < igrac.getBrKarata(); i++) {
					if (igrac.getKarta(i).getZnak()==z){
						if(igrac.getKarta(i).getBroj()>12 || igrac.getKarta(k).getBroj()==1)
							brojVecihKarata[j]++;
					}
					else{
						for (int i1 = i; i1 < igrac.getBrKarata(); i1++) 
							if (igrac.getKarta(i1).getBroj()<13 && igrac.getKarta(k).getBroj()!=1){
								z=igrac.getKarta(i1).getZnak();
								t=i1;
								while (i1>0){
									if(igrac.getKarta(i1-1).getZnak()==z && igrac.getKarta(i1-1).getBroj()>igrac.getKarta(t).getBroj())
										i1--;
									else
										break;
								}
									
								nizMinimuma[++j]=i1;
								
								i=i1-1;
								break;
							}
							else
								i++;
					}
					
				}//na 0 mesto pamtim najveci br, a na 1. mesto pamtim koliko ima karata u tom znaku sem nje
				
				break;	
			}
		}
		////System.out.println(j);
		int min=16;
		int t=-1;
		for (int i = 0; i < j+1; i++) {
			//System.out.println(nizMinimuma[i]+ "  "+min);
			if (igrac.getKarta(nizMinimuma[i]).getBroj()<min && igrac.getKarta(nizMinimuma[i]).getBroj()!=1 ){
					t=i;
					min=igrac.getKarta(nizMinimuma[i]).getBroj();
				
			}
		}
		
		if (t!=-1){
			max=brojVecihKarata[t];
			for (int i = 0; i < brojVecihKarata.length; i++) {
				if (igrac.getKarta(nizMinimuma[i])==igrac.getKarta(nizMinimuma[t]) && t!=i && brojVecihKarata[i]>max){
					t=i;
					max=brojVecihKarata[i];
				}
			}
		
		min=nizMinimuma[t];
		if (t!=-1){
			while(min+1<igrac.getBrKarata()){
				if (igrac.getKarta(min+1)!=null && igrac.getKarta(min+1).getZnak()== igrac.getKarta(min).getZnak())
					min++;
				else break;
			}
				
			////System.err.println(nizMinimuma[t]);
			return igrac.getKarta(min);
		}
		
		}
		
		
		t=-1;
		min=15;
		for (int i = 0; i < igrac.getBrKarata(); i++) {
			if(igrac.getKarta(i).getBroj()==1 && t==-1){
				t=i;
			}
			else if(igrac.getKarta(i).getBroj()<min){
				min=igrac.getKarta(i).getBroj();
				t=i;
			}
		}
		
		return igrac.getKarta(t);
		
		
		//ovde izbacuje minimalnu kartu kako bi je se oslobodio posto nema taj znak
	}

	@Override
	public boolean preporucujemIgru(Igrac igrac) {
		int br=0;
		for (int i = 0; i < igrac.getBrIgara(); i++) {
			if (igrac.getIgre(i) instanceof Max && igrac.getIgre(i+1)==null)
				return true;
			
		}
		
		for (int i = 0; i < igrac.getBrKarata(); i++) {
			if (igrac.getKarta(i).getBroj()==1) {
				br++;
				if (i<7 && igrac.getKarta(i+1).getBroj()==14 && igrac.getKarta(i+1).getZnak()==igrac.getKarta(i).getZnak()){
					if ( i<6 && igrac.getKarta(i+2)!=null && igrac.getKarta(i+2).getBroj()==13 && igrac.getKarta(i+2).getZnak()==igrac.getKarta(i).getZnak())
						return true;
					for (int j = 0; j < igrac.getBrKarata(); j++) {
						if (igrac.getKarta(j).getBroj()==1 && j!=i)
							return true;
					}
				}	
			}
		}
		if (br==3)
			return true;
		
		
		return false;
	}

	public int dodatiPoene(int ruka, Igrac igraci[]) {
		
		int max=0;
		int j=-1;
		for (int i = 0; i < trenutneKarte.length; i++) {
			if (trenutneKarte[i]!=null) {
				
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
		igraci[j].setPoeniUOvojIgri(igraci[j].getPoeniUOvojIgri()-1);
		return j;
	}
}
