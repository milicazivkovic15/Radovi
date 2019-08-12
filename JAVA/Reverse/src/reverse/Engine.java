package reverse;

public class Engine {
	Polje[][] tabla=new Polje[8][8];
	Boja naPotezu;
	int skorCrni;
	int skorCrveni;
	boolean racunar; 
	Polje[] mogucaPotezi=new Polje[64];
	int brojPoteza;
	
	
	Engine (boolean racunarr, Boja naPoetezuu){
		inicijalizacija(racunarr, naPoetezuu);
	}
	
	void inicijalizacija(boolean racunarr, Boja naPoetezuu){
		racunar=racunarr;
		naPotezu=naPoetezuu;
		for (int i = 0; i <8; i++) {
			for (int j = 0; j <8; j++) {
				tabla[i][j]=new Polje(i,j,Boja.NEPOZNATA);
			}
		}
		tabla[3][3].boja=Boja.CRNA;
		tabla[3][4].boja=Boja.CRVENA;
		tabla[4][3].boja=Boja.CRVENA;
		tabla[4][4].boja=Boja.CRNA;
		for (int i = 0; i <32; i++) {
			mogucaPotezi[i]=new Polje(-1, -1, Boja.NEPOZNATA);
		}
		skorCrni=2;
		skorCrveni=2;
	}
	Polje[] mogucaPolja(){
		brojPoteza=0;
		Boja suprotna=Boja.NEPOZNATA;
		if (naPotezu==Boja.CRNA)
			suprotna=Boja.CRVENA;
		else
			suprotna=Boja.CRNA;	
		
		
			for (int i = 0; i <8; i++) {
				for (int j = 0; j <8; j++) {
					if (tabla[i][j].boja==naPotezu){
						Polje pom=desno(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						pom=null;
						pom=levo(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						pom=null;
						pom =gore(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						pom=null;
						pom =dole(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						pom=null;
						pom =doleDesno(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						pom=null;
						pom =doleLevo(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						pom=null;
						pom =goreDesno(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						pom=null;
						pom =goreLevo(i,j,suprotna);
						if (pom!=null)
							mogucaPotezi[brojPoteza++]=pom;
						
					}
				}
			}
		return mogucaPotezi;
	}
	Polje desno(int vrsta, int kolona, Boja boja){
		int brojac=0;
			for (int j = kolona+1; j < 7;j++) {
				if (tabla[vrsta][j].boja==boja){
					if (tabla[vrsta][j+1].boja==Boja.NEPOZNATA){
						++brojac;
						tabla[vrsta][j+1].desno=brojac;
						return tabla[vrsta][j+1];
					}
					else if (tabla[vrsta][j+1].boja!=boja)
						return null;
					brojac++;
				}
				else if (tabla[vrsta][j].boja==Boja.NEPOZNATA)
					return null;
			}
			return null;
	}
	Polje	levo(int vrsta, int kolona, Boja boja){
		int brojac=0;
		for (int j = kolona-1; j >0 ;j--) {
			if (tabla[vrsta][j].boja==boja){
				if (tabla[vrsta][j-1].boja==Boja.NEPOZNATA){
					++brojac;
					tabla[vrsta][j-1].levo=brojac;
					return tabla[vrsta][j-1];
				}
				else if (tabla[vrsta][j-1].boja!=boja)
					return null;
				++brojac;
			}
			else if (tabla[vrsta][j].boja==Boja.NEPOZNATA)
				return null;	
		}
		return null;
	}
	Polje	gore(int vrsta, int kolona, Boja boja){
		int brojac=0;
		for (int i = vrsta-1; i >0 ;i--) {
			if (tabla[i][kolona].boja==boja && tabla[i][kolona].boja!=Boja.NEPOZNATA){
				if (tabla[i-1][kolona].boja==Boja.NEPOZNATA){
					++brojac;
					tabla[i-1][kolona].gore=brojac;
					return tabla[i-1][kolona];
				}
				else if (tabla[i-1][kolona].boja!=boja)
					return null;
				brojac++;
			}

			else if (tabla[i][kolona].boja==Boja.NEPOZNATA)
				return null;
		}
		return null;
	}
	Polje	dole(int vrsta, int kolona, Boja boja){
		int brojac=0;
		for (int i = vrsta+1; i <7 ;i++) {
			if (tabla[i][kolona].boja==boja){
				if (tabla[i+1][kolona].boja==Boja.NEPOZNATA){
					++brojac;
					tabla[i+1][kolona].dole=brojac;
					return tabla[i+1][kolona];
				}
				else if (tabla[i+1][kolona].boja!=boja)
					return null;
				brojac++;
			}

			else if (tabla[i][kolona].boja==Boja.NEPOZNATA)
				return null;	
		}
		return null;
	}
	Polje goreDesno(int i, int j, Boja boja){
		int brojac=0;
		while(--i>0 && ++j<7){
			if (tabla[i][j].boja==boja){
				if (tabla[i-1][j+1].boja==Boja.NEPOZNATA){
					++brojac;
					tabla[i-1][j+1].goreDesno=brojac;
					return tabla[i-1][j+1];
				}
				else if (tabla[i-1][j+1].boja!=boja)
					return null;
				brojac++;
			}
			else if (tabla[i][j].boja==Boja.NEPOZNATA)
				return null;
		}
		return null;
	}
	Polje goreLevo(int i, int j, Boja boja){
		int brojac=0;
		while(--i>0 && --j>0){
			if (tabla[i][j].boja==boja){
				if (tabla[i-1][j-1].boja==Boja.NEPOZNATA){
					++brojac;
					tabla[i-1][j-1].goreLevo=brojac;
					return tabla[i-1][j-1];
				}
				else if (tabla[i-1][j-1].boja!=boja)
					return null;
				++brojac;
			}
			else if (tabla[i][j].boja==Boja.NEPOZNATA)
				return null;
		}
		return null;
	}
	Polje doleDesno(int i, int j, Boja boja){
		int brojac=0;
		while(++i<7 && ++j<7){
			if (tabla[i][j].boja==boja){
				if (tabla[i+1][j+1].boja==Boja.NEPOZNATA){
					++brojac;
					tabla[i+1][j+1].doleDesno=brojac;
					return tabla[i+1][j+1];
				}
				else if (tabla[i+1][j+1].boja!=boja)
					return null;
				++brojac;
			}
			else if (tabla[i][j].boja==Boja.NEPOZNATA)
				return null;
		}
		return null;
	}
	Polje doleLevo(int i, int j, Boja boja){
		int brojac=0;
		while(++i<7 && --j>0){
			if (tabla[i][j].boja==boja){
				if (tabla[i+1][j-1].boja==Boja.NEPOZNATA){
					++brojac;
					tabla[i+1][j-1].doleLevo=brojac;
					return tabla[i+1][j-1];
				}
				else if (tabla[i+1][j-1].boja!=boja)
					return null;
				brojac++;
			}
			else if (tabla[i][j].boja==Boja.NEPOZNATA)
				return null;
		}
		return null;
	}

	boolean odigrajPotez(int vrsta, int kolona, Polje[] nizPolja){
		int i = 0;
		for (; i < brojPoteza ; i++) 
			if (nizPolja[i].i==vrsta && nizPolja[i].j==kolona)
				break;	
		
		tabla[vrsta][kolona].boja=naPotezu;

		for (int k = 0; k <nizPolja[i].levo ; k++) {
			tabla[nizPolja[i].i][nizPolja[i].j+k+1].boja=naPotezu;
		}
		for (int k = 0; k <nizPolja[i].desno ; k++) {
			tabla[nizPolja[i].i][nizPolja[i].j-k-1].boja=naPotezu;
		}
		for (int k = 0; k <nizPolja[i].dole ; k++) {
			tabla[nizPolja[i].i-k-1][nizPolja[i].j].boja=naPotezu;
		}
		for (int k = 0; k <nizPolja[i].gore ; k++) {
			tabla[nizPolja[i].i+k+1][nizPolja[i].j].boja=naPotezu;
		}
		for (int k = 0; k <nizPolja[i].doleDesno ; k++) {
			tabla[nizPolja[i].i-k-1][nizPolja[i].j-k-1].boja=naPotezu;
		}
		for (int k = 0; k <nizPolja[i].doleLevo ; k++) {
			tabla[nizPolja[i].i-k-1][nizPolja[i].j+k+1].boja=naPotezu;
		}
		for (int k = 0; k <nizPolja[i].goreDesno ; k++) {
			tabla[nizPolja[i].i+k+1][nizPolja[i].j-k-1].boja=naPotezu;
		}
		for (int k = 0; k <nizPolja[i].goreLevo ; k++) {
			tabla[nizPolja[i].i+k+1][nizPolja[i].j+k+1].boja=naPotezu;
		}
		
		if (naPotezu==Boja.CRVENA){
			skorCrveni+=nizPolja[i].gore+nizPolja[i].dole+nizPolja[i].levo+nizPolja[i].desno+nizPolja[i].goreLevo+nizPolja[i].goreDesno+nizPolja[i].doleDesno+nizPolja[i].doleLevo+1;
			skorCrni-=nizPolja[i].gore+nizPolja[i].dole+nizPolja[i].levo+nizPolja[i].desno+nizPolja[i].goreLevo+nizPolja[i].goreDesno+nizPolja[i].doleDesno+nizPolja[i].doleLevo;
			naPotezu=Boja.CRNA;
		}
		else{
			skorCrveni-=nizPolja[i].gore+nizPolja[i].dole+nizPolja[i].levo+nizPolja[i].desno+nizPolja[i].goreLevo+nizPolja[i].goreDesno+nizPolja[i].doleDesno+nizPolja[i].doleLevo;
			skorCrni+=nizPolja[i].gore+nizPolja[i].dole+nizPolja[i].levo+nizPolja[i].desno+nizPolja[i].goreLevo+nizPolja[i].goreDesno+nizPolja[i].doleDesno+nizPolja[i].doleLevo+1;
			naPotezu=Boja.CRVENA;
		}
		refresujBrojace();
		if (mogucaPotezi==null){
			if (naPotezu==Boja.CRVENA)
				naPotezu=Boja.CRNA;
			
			else
				naPotezu=Boja.CRVENA;
			return false;
		}
		return true;
	}
	boolean kraj(){
		if (skorCrni+skorCrveni==64) return true;
		return false;
	}
	void refresujBrojace(){
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j < 8; j++) {
				tabla[i][j].desno=0;
				tabla[i][j].dole=0;
				tabla[i][j].levo=0;
				tabla[i][j].gore=0;
				tabla[i][j].goreDesno=0;
				tabla[i][j].goreLevo=0;
				tabla[i][j].doleDesno=0;
				tabla[i][j].doleLevo=0;
			}
		}
	}
}
