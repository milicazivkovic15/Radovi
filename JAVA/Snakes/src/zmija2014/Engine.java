package zmija2014;

public class Engine {
	int[][] matrica = new int[15][15];// 1-glava,2 telo,3 slika;
	Zmija zmija = new Zmija();
	Zmija rep = null;

	public Engine() {
		// TODO Auto-generated constructor stub
		inicijalizacija();
	}

	void inicijalizacija() {
		matrica[4][10] = 1;
		zmija.i = 4;
		zmija.j = 10;
		zmija.smer = Math.round((float) (Math.random() * 3));
		generisiSliku();

	}

	boolean daLiSamMrtav() {// u sledecem potrzu
		if (zmija.i == 0 && zmija.smer == 0)// gornji zid
			return true;
		if (zmija.i == 14 && zmija.smer == 1)// donji zid
			return true;
		if (zmija.j == 0 && zmija.smer == 2)// levo
			return true;
		if (zmija.j == 14 && zmija.smer == 3)// desno
			return true;
		if (zmija.smer == 0 && matrica[zmija.i - 1][zmija.j] == 2
				|| zmija.smer == 1 && matrica[zmija.i + 1][zmija.j] == 2
				|| zmija.smer == 2 && matrica[zmija.i][zmija.j - 1] == 2
				|| zmija.smer == 3 && matrica[zmija.i][zmija.j + 1] == 2)// udara u telo zmije
			return true;
		return false;
	}

	boolean pomeriZmijicu(int smer) {
		zmija.smer = smer;
		if (daLiSamMrtav() == true)
			return false;

		if (smer == 0)
			odigrajgore();
		else if (smer == 1)
			odigrajdole();
		else if (smer == 2)
			odigrajlevo();
		else
			odigrajdesno();

		return true;
	}

	void odigrajgore() {
		if (matrica[zmija.i - 1][zmija.j] == 3) {

			Zmija pom = new Zmija();
			pom.sleddeci = zmija.sleddeci;
			if (rep == null)
				rep = pom;
			else
				pom.sleddeci.prethodni = pom;
			pom.prethodni = zmija;
			zmija.sleddeci = pom;

			pom.i = zmija.i;
			pom.j = zmija.j;
			zmija.i--;
			matrica[zmija.i][zmija.j] = 1;
			matrica[pom.i][pom.j] = 2;
			generisiSliku();
		} else {
			if (rep != null) {
				matrica[rep.i][rep.j] = 0;
				matrica[zmija.i][zmija.j] = 2;

				Zmija pom = rep.prethodni;
				pom.sleddeci = null;
				rep.i = zmija.i - 1;
				rep.j = zmija.j;
				rep.sleddeci = zmija;
				rep.prethodni = null;
				zmija.prethodni = rep;
				zmija = rep;
				rep = pom;

				matrica[zmija.i][zmija.j] = 1;
			} else {
				matrica[zmija.i][zmija.j] = 0;
				zmija.i--;
				matrica[zmija.i][zmija.j] = 1;

			}
		}
	}

	void odigrajdole() {
		if (matrica[zmija.i + 1][zmija.j] == 3) {
			Zmija pom = new Zmija();
			pom.sleddeci = zmija.sleddeci;
			if (rep == null)
				rep = pom;
			else
				pom.sleddeci.prethodni = pom;

			pom.prethodni = zmija;
			zmija.sleddeci = pom;

			pom.i = zmija.i;
			pom.j = zmija.j;
			zmija.i++;
			matrica[zmija.i][zmija.j] = 1;
			matrica[pom.i][pom.j] = 2;
			generisiSliku();

		} else {
			if (rep != null) {

				matrica[rep.i][rep.j] = 0;
				matrica[zmija.i][zmija.j] = 2;

				Zmija pom = rep.prethodni;
				pom.sleddeci = null;
				rep.i = zmija.i + 1;
				rep.j = zmija.j;
				rep.sleddeci = zmija;
				rep.prethodni = null;
				zmija.prethodni = rep;
				zmija = rep;
				rep = pom;

				matrica[zmija.i][zmija.j] = 1;
			} else {
				matrica[zmija.i][zmija.j] = 0;
				zmija.i++;
				matrica[zmija.i][zmija.j] = 1;

			}
		}
	}

	void odigrajlevo() {
		if (matrica[zmija.i][zmija.j - 1] == 3) {

			Zmija pom = new Zmija();

			pom.sleddeci = zmija.sleddeci;
			if (rep == null)
				rep = pom;
			else
				pom.sleddeci.prethodni = pom;
			pom.prethodni = zmija;
			zmija.sleddeci = pom;
			pom.i = zmija.i;
			pom.j = zmija.j;
			zmija.j--;
			matrica[zmija.i][zmija.j] = 1;
			matrica[pom.i][pom.j] = 2;
			generisiSliku();
		} else {
			if (rep != null) {
				matrica[rep.i][rep.j] = 0;
				matrica[zmija.i][zmija.j] = 2;

				Zmija pom = rep.prethodni;
				pom.sleddeci = null;
				rep.i = zmija.i;
				rep.j = zmija.j - 1;
				rep.sleddeci = zmija;
				rep.prethodni = null;
				zmija.prethodni = rep;
				zmija = rep;
				rep = pom;

				matrica[zmija.i][zmija.j] = 1;
			} else {
				matrica[zmija.i][zmija.j] = 0;
				zmija.j--;
				matrica[zmija.i][zmija.j] = 1;

			}
		}
	}

	void odigrajdesno() {
		if (matrica[zmija.i][zmija.j + 1] == 3) {

			Zmija pom = new Zmija();
			pom.sleddeci = zmija.sleddeci;
			if (rep == null)
				rep = pom;
			else
				pom.sleddeci.prethodni = pom;
			pom.prethodni = zmija;
			zmija.sleddeci = pom;
			pom.i = zmija.i;
			pom.j = zmija.j;
			zmija.j++;
			matrica[zmija.i][zmija.j] = 1;
			matrica[pom.i][pom.j] = 2;
			generisiSliku();
		} else {
			if (rep != null) {

				matrica[rep.i][rep.j] = 0;
				matrica[zmija.i][zmija.j] = 2;

				Zmija pom = rep.prethodni;
				pom.sleddeci = null;
				rep.i = zmija.i;
				rep.j = zmija.j + 1;
				rep.sleddeci = zmija;
				rep.prethodni = null;
				zmija.prethodni = rep;
				zmija = rep;
				rep = pom;

				matrica[zmija.i][zmija.j] = 1;
			} else {
				matrica[zmija.i][zmija.j] = 0;
				zmija.j++;
				matrica[zmija.i][zmija.j] = 1;

			}
		}
	}

	void generisiSliku() {
		int i = Math.round((float) (Math.random() * 14));
		int j = Math.round((float) (Math.random() * 14));
		while (matrica[i][j] == 1 || matrica[i][j] == 2) {
			i = Math.round((float) (Math.random() * 14));
			j = Math.round((float) (Math.random() * 14));
		}
		matrica[i][j] = 3;

	}

	protected int[][] getMatrica() {
		return matrica;
	}

}
