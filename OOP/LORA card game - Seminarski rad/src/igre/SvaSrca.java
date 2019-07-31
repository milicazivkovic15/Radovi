package igre;

import igraci.Igrac;
import karte.Karta;
import karte.Znak;

public class SvaSrca extends Igra{

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
		boolean f=true;
		br=0;//br srca
		for (int i = 0; i < brPrethodnihKarata; i++) {
			if (prethodneKarte[i]!=null && prethodneKarte[i].getZnak()==Znak.SRCE){
				f=true;
				for (int j = 0; j < brKarataNaTalonu; j++) {
					if (prethodneKarte[i].getBroj()==trenutneKarte[j].getBroj() && prethodneKarte[j].getZnak()==trenutneKarte[j].getZnak())
						f=false;
				}
				if(f==true)
					br++;
			
			}
		}

		if (br==0){
						if (brKarataNaTalonu==0){
			
							//System.out.println("IGRAM PRVI I NEMA JOS SRCA");
							for (int i = 0; i < igrac.getBrKarata(); i++) {
								if(igrac.getKarta(i).getZnak()==Znak.SRCE ){//a igra se srce
									if (i<6)
										if(igrac.getKarta(i).getBroj()==1 && igrac.getKarta(i+1).getZnak()==Znak.SRCE && (igrac.getKarta(i+1).getBroj()==14 ||  igrac.getKarta(i+1).getBroj()==13))
												if(igrac.getKarta(i+2).getZnak()==Znak.SRCE){
													znak=Znak.SRCE;
													//System.out.println("I MOGU DIGNEM");
													if ( igrac.getKarta(i+1).getBroj()==13)
														return igrac.getKarta(i+1);
													return igrac.getKarta(i);
												}//ako ima 3 srca i moze da digne prvi igra
									int j = i;
									for (; j <brPrethodnihKarata; j++) {
										if (igrac.getKarta(j).getZnak()==Znak.SRCE && igrac.getKarta(j).getBroj()<10 ){
											znak=Znak.SRCE;
			
											//System.out.println("I NE MOGU DIGNEM PA BACAM MALO SRCE");
											return igrac.getKarta(j);
										}//zna da ne moze da digne pa baca malo srce
									}
									break;
								}
							}
							
							int k=0;
							int nizBrojeva[]=new int[2*igrac.getBrKarata()];
							for (int i = 0; i < igrac.getBrKarata(); i++) {
								
								Znak z=igrac.getKarta(i).getZnak();
								int broj=igrac.getKarta(i).getBroj();
								//boolean flag=false;
								int brojVecihKarata=0;
								int brojManjihKarata=0;
								
								if (broj!=1){
									for (int j = 0; j < 32; j++) {
										if (preostaleKarte.getKarta(j)!=null && preostaleKarte.getKarta(j).getZnak()==z ){
											while(preostaleKarte.getKarta(j).getZnak()==z){
												if (preostaleKarte.getKarta(j).getBroj()<broj && preostaleKarte.getKarta(j).getBroj()!=1){
														brojManjihKarata++;
														break;
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
									nizBrojeva[k++]=brojManjihKarata;
									nizBrojeva[k++]=brojVecihKarata;
									brojManjihKarata=0;
									brojVecihKarata=0;
								}
							}
							for (int i = 0; i < k; i+=2) {
								if (nizBrojeva[i]==1 && nizBrojeva[i+1]>1){
									i/=2;
									znak=igrac.getKarta(i).getZnak();
									return igrac.getKarta(i);
								}
							}
							//do ovde trazi stv najmanju kartu
							int min=15;
							int fi=-1;
							int t=-1;
							for (int i = 0; i < igrac.getBrKarata(); i++) {
									if (igrac.getKarta(i).getBroj()==1)
										fi=i;
									else if(igrac.getKarta(i).getBroj()<min ){
										min=igrac.getKarta(i).getBroj();
										t=i;
									}	
								
							}
							if (t==-1){
								znak=igrac.getKarta(fi).getZnak();
			
								return igrac.getKarta(fi);
							}
							znak=igrac.getKarta(t).getZnak();
			
							return igrac.getKarta(t);
						
						}
						else{//ne igra pprvi a sva srca su u igri
			
							//System.out.println(" NE IGRAM PRVI ");
							if (znak==Znak.SRCE){
								for (int i = 0; i < igrac.getBrKarata(); i++) {
									if(igrac.getKarta(i).getZnak()==Znak.SRCE  ){
										if(i<6)
											if(igrac.getKarta(i).getBroj()==1 &&  igrac.getKarta(i+1)!=null) 
												if(igrac.getKarta(i+1).getZnak()==Znak.SRCE && (igrac.getKarta(i+1).getBroj()==14 || igrac.getKarta(i+1).getBroj()==13) && igrac.getKarta(i+2)!=null)
													if(igrac.getKarta(i+2).getZnak()==Znak.SRCE)
														if (igrac.getKarta(i+1).getBroj()==13)
															return igrac.getKarta(i+1);
														else 
															return igrac.getKarta(i);
										//System.out.println("AL NEMAM NI NAJVECA SRCA PA BACAM NAJMANJE KOJE IMAM");
										
										int j;
										for (j = i; j < igrac.getBrKarata(); j++) {
											if (igrac.getKarta(j).getZnak()!=Znak.SRCE)
												return igrac.getKarta(j-1);
										}
			
										return igrac.getKarta(j-1);
									}
													
								}//ako ima srce
								//System.out.println("NEMAM SRCE PA BACAM NAJVECU");
								
								int min=0;
								int t=-1;
								for (int i1 = 0; i1 < igrac.getBrKarata(); i1++) {
									if (igrac.getKarta(i1).getBroj()==1)
										return igrac.getKarta(i1);
									if(igrac.getKarta(i1).getBroj()>min){
										min=igrac.getKarta(i1).getBroj();
										t=i1;
									}	
												
								}
									return igrac.getKarta(t);
							
								//ako nema srce znak baca maximalnu kartu
							}
							else{//nije srce
								for (int i = 0; i < igrac.getBrKarata(); i++) {
									if(igrac.getKarta(i).getZnak()==Znak.SRCE){
										if (i<6) 
											if (igrac.getKarta(i).getBroj()==1 && igrac.getKarta(i+1)!=null) 
												if(igrac.getKarta(i+1).getZnak()==Znak.SRCE && (igrac.getKarta(i+1).getBroj()==14 || igrac.getKarta(i+1).getBroj()==13) && igrac.getKarta(i+2)!=null)
													if (igrac.getKarta(i+2).getZnak()==Znak.SRCE){
														//System.out.println("AL MOGU DIGNEM PA BACAM NAJVECU KARTU U TOM ZNAKU");
														for (int i1 = 0; i1 < igrac.getBrKarata(); i1++) {
															if (igrac.getKarta(i1).getZnak()==znak)
																return igrac.getKarta(i1);
														}//ako moze da digne baca najvecu kartu u znaku ako ga ima 
														//System.out.println("AL NE MOGU DIGNEM PA BACAM NAJMANJU KARTU DA BI DIGU U SLEDECOJ");
														
														int min=15;
														int f1=-1;
														int t=-1;
														for (int i1 = 0; i1 < igrac.getBrKarata(); i1++) {
															if (igrac.getKarta(i1).getBroj()==1 || (igrac.getKarta(i1).getZnak()==Znak.SRCE && igrac.getKarta(i1).getBroj()<max))
																f1=i1;
															if(igrac.getKarta(i1).getBroj()<min && igrac.getKarta(i1).getBroj()!=1 &&igrac.getKarta(i1).getZnak()!=Znak.SRCE){
																min=igrac.getKarta(i1).getBroj();
																t=i1;
															}	
																		
														}
														if (t==-1){
															return igrac.getKarta(f1);
														}
														return igrac.getKarta(t);
														
													
													//baca minimalnu kartu jer zeli da digne u sl ruku jer nema taj znak
													}
										break;
									}
								}
								//System.out.println("NEMAM SRCE I PODVUK");
			
								//ne moze da digne pa baca manju na talonu ili baca najvecu posto nema znak (na dole kod)
								for (int i = 0; i < igrac.getBrKarata(); i++) {
									if (igrac.getKarta(i).getZnak()==znak){
										int j=i;
										while (igrac.getKarta(i)!=null && igrac.getKarta(i).getZnak()==znak ){
											if (igrac.getKarta(i).getBroj()<max && igrac.getKarta(i).getBroj()!=1){	
												return igrac.getKarta(i);
											}
											i++;
											if (i==igrac.getBrKarata()) break;
										}
										if (brKarataNaTalonu==3)
											return igrac.getKarta(j);//ako vec nema da se podvuce da uzme najvecom
										
											
										return igrac.getKarta(i-1);
											
									}
									
								}
			
								//ovde izbacuje prvu manju kartu od karata na talonu ili ako nema prvu vecu
								for (int i = 0; i < igrac.getBrKarata(); i++) {
									if (igrac.getKarta(i).getZnak()==Znak.SRCE)
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
									if (igrac.getKarta(i).getBroj()==1 ){
										return igrac.getKarta(i);
									}
									if(igrac.getKarta(i).getBroj()>min ){
										min=igrac.getKarta(i).getBroj();
										t=i;
									}
								}
								
								return igrac.getKarta(t);
								
								
								//ovde izbacuje maximalnu kartu kako bi je se oslobodio posto nema taj znak
			
							}//ako nije srce
							
						}
		}
		else{//neka srca su prosla
			if (brKarataNaTalonu==0){
				//System.out.println("IGRAM PRVI");
					if (br==igrac.getPoeniUOvojIgri()){
						//System.out.println("IGRAM PRVI I POKUPIO SAM SVA SRCA SA TALONA I IMAM SRCE");
						for (int i = 0; i < igrac.getBrKarata(); i++) {
							if (igrac.getKarta(i).getZnak()==Znak.SRCE){
								znak=Znak.SRCE;
								return igrac.getKarta(i);
							}
						}
					
						//System.out.println("IGRAM PRVI I POKUPIO SAM SVA SRCA SA TALONA I NEMAM SRCE");
	//napad srcem
						int k=0;
						int nizBrojeva[]=new int[2*igrac.getBrKarata()];
						for (int i = 0; i < igrac.getBrKarata(); i++) {
							
							Znak z=igrac.getKarta(i).getZnak();
							int broj=igrac.getKarta(i).getBroj();
							//boolean flag=false;
							int brojVecihKarata=0;
							int brojManjihKarata=0;
							
							if (broj!=1){
								for (int j = 0; j < 32; j++) {
									if (preostaleKarte.getKarta(j)!=null && preostaleKarte.getKarta(j).getZnak()==z ){
										while(preostaleKarte.getKarta(j).getZnak()==z){
											if (preostaleKarte.getKarta(j).getBroj()<broj && preostaleKarte.getKarta(j).getBroj()!=1){
													brojManjihKarata++;
													break;
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
								nizBrojeva[k++]=brojManjihKarata;
								nizBrojeva[k++]=brojVecihKarata;
								brojManjihKarata=0;
								brojVecihKarata=0;
							}
						}
						for (int i = 0; i < k; i+=2) {
							if (nizBrojeva[i]==1 && nizBrojeva[i+1]>1){
								i/=2;
								znak=igrac.getKarta(i).getZnak();
								return igrac.getKarta(i);
							}
						}
						//do ovde trazi stv najmanju kartu
						int min=15;
						int fi=-1;
						int t=-1;
						for (int i = 0; i < igrac.getBrKarata(); i++) {
								if (igrac.getKarta(i).getBroj()==1)
									fi=i;
								else if(igrac.getKarta(i).getBroj()<min ){
									min=igrac.getKarta(i).getBroj();
									t=i;
								}	
							
						}
						if (t==-1){
							znak=igrac.getKarta(fi).getZnak();
	
							return igrac.getKarta(fi);
						}
						znak=igrac.getKarta(t).getZnak();
	
						return igrac.getKarta(t);//podvlacenje jer nemam vise srca ili ne moze da digne
		
						
				}
				else{
						int k=0;
						int nizBrojeva[]=new int[2*igrac.getBrKarata()];
						for (int i = 0; i < igrac.getBrKarata(); i++) {
							
							Znak z=igrac.getKarta(i).getZnak();
							int broj=igrac.getKarta(i).getBroj();
							//boolean flag=false;
							int brojVecihKarata=0;
							int brojManjihKarata=0;
							
							if (broj!=1){
								for (int j = 0; j < 32; j++) {
									if (preostaleKarte.getKarta(j)!=null && preostaleKarte.getKarta(j).getZnak()==z ){
										while(preostaleKarte.getKarta(j).getZnak()==z){
											if (preostaleKarte.getKarta(j).getBroj()<broj && preostaleKarte.getKarta(j).getBroj()!=1){
													brojManjihKarata++;
													break;
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
								nizBrojeva[k++]=brojManjihKarata;
								nizBrojeva[k++]=brojVecihKarata;
								brojManjihKarata=0;
								brojVecihKarata=0;
							}
						}
						for (int i = 0; i < k; i+=2) {
							if (nizBrojeva[i]==1 && nizBrojeva[i+1]>1){
								i/=2;
								znak=igrac.getKarta(i).getZnak();
								return igrac.getKarta(i);
							}
						}
						//do ovde trazi stv najmanju kartu
						int min=15;
						int fi=-1;
						int t=-1;
						for (int i = 0; i < igrac.getBrKarata(); i++) {
								if (igrac.getKarta(i).getBroj()==1)
									fi=i;
								else if(igrac.getKarta(i).getBroj()<min ){
									min=igrac.getKarta(i).getBroj();
									t=i;
								}	
							
						}
						if (t==-1){
							znak=igrac.getKarta(fi).getZnak();

							return igrac.getKarta(fi);
						}
						znak=igrac.getKarta(t).getZnak();

						return igrac.getKarta(t);
					}
	
			}
			else{//na baca prvi kartu i srce neko je pokupljeno
					//System.out.println("NE IGRAM PRVI");
					if (br==igrac.getPoeniUOvojIgri()){//imam sve poene na srcima i ne biram ruku
						if (znak==Znak.SRCE){
							for (int i = 0; i < igrac.getBrKarata(); i++) {
								if (igrac.getKarta(i).getZnak()==Znak.SRCE)
									return igrac.getKarta(i);
							}
							//System.out.println("NEMAM DA SKUPIM PA BACAM NAJVECU");

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
								if (igrac.getKarta(i).getBroj()==1 ){
									return igrac.getKarta(i);
								}
								if(igrac.getKarta(i).getBroj()>min ){
									min=igrac.getKarta(i).getBroj();
									t=i;
								}
							}
							
							return igrac.getKarta(t);
							
						}//ako nemas srce pocni da se ppodvlacis
						//System.out.println("BACAM NAJVECU KOJU IMAM PLANIRAM DA SKUPIM");

						for (int i = 0; i < igrac.getBrKarata(); i++) {
							if (igrac.getKarta(i).getZnak()==znak)
								return igrac.getKarta(i);
						}//ako nije srce baci max u tom znaku
						//System.out.println("IPAK SE PODVLACIM NEMAM ZNAK");

						int min=15;
						int f1=-1;
						int t=-1;
						for (int i1 = 0; i1 < igrac.getBrKarata(); i1++) {
							if (igrac.getKarta(i1).getBroj()==1 || (igrac.getKarta(i1).getZnak()==Znak.SRCE && igrac.getKarta(i1).getBroj()<max))
								f1=i1;
							if(igrac.getKarta(i1).getBroj()<min && igrac.getKarta(i1).getBroj()!=1 &&igrac.getKarta(i1).getZnak()!=Znak.SRCE){
								min=igrac.getKarta(i1).getBroj();
								t=i1;
							}	
										
						}
						if (t==-1){
							return igrac.getKarta(f1);
						}
						return igrac.getKarta(t);
						//ako nemas znak baci min 
					}//skupi sva srca
					else{
						if (znak==Znak.SRCE){
							for (int i = 0; i <igrac.getBrKarata(); i++) {
								if (igrac.getKarta(i).getZnak()==Znak.SRCE){
									//System.out.println("NAJMANJE SRCE KOJE IMAM");

									int j;
									for (j = i; j < igrac.getBrKarata(); j++) {
										if (igrac.getKarta(j).getZnak()!=Znak.SRCE)
											return igrac.getKarta(j-1);
									}

									return igrac.getKarta(j-1);
									//baca najmanje srce
								}
								
							}
							
						}
						else{						
							for (int i = 0; i < igrac.getBrKarata(); i++) {
								if (igrac.getKarta(i).getZnak()==znak){
									int j=i;
									//System.out.println("PODVUKKK");
									while (igrac.getKarta(i)!=null && igrac.getKarta(i).getZnak()==znak ){
										if(igrac.getKarta(i).getBroj()<max)
											return igrac.getKarta(i);
										i++;
										if (i==igrac.getBrKarata()) break;
									}
									if (brKarataNaTalonu==3)
										return igrac.getKarta(j);//ako vec nema da se podvuce da uzme najvecom
									
									return igrac.getKarta(i-1);
										
								}
								
							}
						}
						//ovde izbacuje prvu manju kartu od karata na talonu ili ako nema prvu vecu
						for (int i = 0; i < igrac.getBrKarata(); i++) {
							if (igrac.getKarta(i).getZnak()==Znak.SRCE)
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
							if (igrac.getKarta(i).getBroj()==1 ){
								return igrac.getKarta(i);
							}
							if(igrac.getKarta(i).getBroj()>min ){
								min=igrac.getKarta(i).getBroj();
								t=i;
							}
						}
						
						return igrac.getKarta(t);
						
						
						
						//ovde izbacuje maximalnu kartu kako bi je se oslobodio posto nema taj znak
					}//podvuci se
				
				
			}
			
		}
		
	}

	@Override
	public boolean preporucujemIgru(Igrac igrac) {
		for (int i = 0; i < igrac.getBrIgara(); i++) {
			if (igrac.getIgre(i) instanceof SvaSrca && igrac.getIgre(i+1)==null)
				return true;
			
		}
		for (int i = 0; i < igrac.getBrKarata()-2; i++) {
			if(igrac.getKarta(i).getZnak()==Znak.SRCE && igrac.getKarta(i).getBroj()==1 && i<6 && igrac.getKarta(i+1)!=null){
				if (igrac.getKarta(i+1).getZnak()==Znak.SRCE && (igrac.getKarta(i+1).getBroj()==14 ||  igrac.getKarta(i+1).getBroj()==13) && igrac.getKarta(i+2)!=null)
						return true;
				return false;
			}
		}
		return false;
	}

	@Override
	public int dodatiPoene(int ruka, Igrac igraci[]) {
		int p=0;
		int max=0;
		int j=-1;
		for (int i = 0; i < trenutneKarte.length; i++) {
			if (trenutneKarte[i]!=null) {
				if(trenutneKarte[i].getZnak()==Znak.SRCE)
					p+=1;
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
		igraci[j].setPoeniUOvojIgri(igraci[j].getPoeniUOvojIgri()+p);
		if (igraci[j].getPoeniUOvojIgri()==8)
			igraci[j].setPoeniUOvojIgri(igraci[j].getPoeniUOvojIgri()-16);
		return j;
	}
	
}
