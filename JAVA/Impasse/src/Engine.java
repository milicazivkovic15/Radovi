
public class Engine {
	Polje matrica[][] = new Polje[3][10];
	int brnivoa = 0;

	Engine() {
		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 10; j++) {
				matrica[i][j] = new Polje(i, j, Smer.PRAZNO);
			}
		}
		inicijalizacija();
	}

	void pocetak() {
		brnivoa = 0;
		inicijalizacija();
	}

	void inicijalizacija() {
		pocetnoStanje();
		++brnivoa;
		if (brnivoa == 1)
			nivo1();
		if (brnivoa == 2)
			nivo2();
		if (brnivoa == 3)
			nivo3();
		if (brnivoa == 4)
			nivo4();
		if (brnivoa == 5)
			nivo5();
	}

	void pocetnoStanje() {

		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 10; j++) {
				matrica[i][j].smer = Smer.PRAZNO;
			}
		}
	}

	void nivo1() {
		matrica[1][0].smer = Smer.START;
		matrica[0][2].smer = Smer.FIKSNA;
		matrica[1][2].smer = Smer.FIKSNA;
		matrica[1][9].smer = Smer.END;
		matrica[1][7].smer = Smer.FIKSNA;
		matrica[2][7].smer = Smer.FIKSNA;

	}

	void nivo2() {
		matrica[1][0].smer = Smer.START;
		matrica[0][2].smer = Smer.FIKSNA;
		matrica[1][2].smer = Smer.FIKSNA;
		matrica[1][9].smer = Smer.END;
		matrica[1][7].smer = Smer.FIKSNA;
		matrica[0][7].smer = Smer.FIKSNA;
		matrica[1][3].smer = Smer.FIKSNA;
		matrica[1][4].smer = Smer.FIKSNA;
		matrica[1][5].smer = Smer.FIKSNA;
		matrica[1][6].smer = Smer.FIKSNA;
		matrica[2][4].smer = Smer.FIKSNA;
		matrica[2][5].smer = Smer.FIKSNA;

	}

	void nivo3() {
		matrica[1][0].smer = Smer.START;
		matrica[1][2].smer = Smer.GORE;
		matrica[2][2].smer = Smer.GORE;
		matrica[1][9].smer = Smer.END;
		matrica[1][7].smer = Smer.GORE;
		matrica[0][7].smer = Smer.GORE;
		matrica[0][4].smer = Smer.GORE;
		matrica[0][5].smer = Smer.GORE;
		matrica[2][4].smer = Smer.GORE;
		matrica[2][5].smer = Smer.GORE;

	}

	void nivo4() {
		matrica[1][0].smer = Smer.START;
		matrica[1][2].smer = Smer.GORE;
		matrica[0][2].smer = Smer.GORE;
		matrica[1][9].smer = Smer.END;
		matrica[1][4].smer = Smer.GORE;
		matrica[0][4].smer = Smer.GORE;
		matrica[1][8].smer = Smer.GORE;
		matrica[0][8].smer = Smer.GORE;
		matrica[1][1].smer = Smer.FIKSNA;
		matrica[0][1].smer = Smer.FIKSNA;
		matrica[1][3].smer = Smer.FIKSNA;
		matrica[2][3].smer = Smer.FIKSNA;
		matrica[2][5].smer = Smer.FIKSNA;
		matrica[0][5].smer = Smer.FIKSNA;
		matrica[2][6].smer = Smer.FIKSNA;

		matrica[1][7].smer = Smer.FIKSNA;
		matrica[2][7].smer = Smer.FIKSNA;

		matrica[2][9].smer = Smer.FIKSNA;
		matrica[0][9].smer = Smer.FIKSNA;
	}

	void nivo5() {
		matrica[1][0].smer = Smer.START;
		matrica[1][2].smer = Smer.DOLE;
		matrica[0][2].smer = Smer.DOLE;
		matrica[1][9].smer = Smer.END;

		matrica[1][4].smer = Smer.DOLE;
		matrica[0][4].smer = Smer.DOLE;

		matrica[1][8].smer = Smer.DOLE;
		matrica[0][8].smer = Smer.DOLE;

		matrica[1][6].smer = Smer.FIKSNA;
		matrica[0][6].smer = Smer.FIKSNA;

		matrica[1][3].smer = Smer.FIKSNA;
		matrica[2][3].smer = Smer.FIKSNA;

		matrica[1][1].smer = Smer.GORE;
		matrica[2][1].smer = Smer.GORE;

		matrica[1][5].smer = Smer.GORE;
		matrica[2][5].smer = Smer.GORE;

		matrica[1][7].smer = Smer.GORE;
		matrica[2][7].smer = Smer.GORE;
	}

	Smer odigrajUSmeru(int i, int j, Smer smer) {

		if (smer == Smer.GORE) {
			if (i == 0) {
				if (matrica[2][j].smer == Smer.END)
					return Smer.END;
				if (matrica[2][j].smer != Smer.PRAZNO)
					return Smer.PRAZNO;
				matrica[2][j].smer = matrica[i][j].smer;
			} else {
				if (matrica[i - 1][j].smer == Smer.END)
					return Smer.END;
				if (matrica[i - 1][j].smer != Smer.PRAZNO)
					return Smer.PRAZNO;
				matrica[i - 1][j].smer = matrica[i][j].smer;

			}
		}
		if (smer == Smer.DOLE) {
			if (i == 2) {
				if (matrica[0][j].smer == Smer.END)
					return Smer.END;
				if (matrica[0][j].smer != Smer.PRAZNO)
					return Smer.PRAZNO;
				matrica[0][j].smer = matrica[i][j].smer;

			}

			else {
				if (matrica[i + 1][j].smer == Smer.END)
					return Smer.END;
				if (matrica[i + 1][j].smer != Smer.PRAZNO)
					return Smer.PRAZNO;

				matrica[i + 1][j].smer = matrica[i][j].smer;
			}
		}
		if (smer == Smer.LEVO) {
			if (j == 0)
				return Smer.PRAZNO;
			if (matrica[i][j - 1].smer == Smer.END)
				return Smer.END;
			if (matrica[i][j - 1].smer != Smer.PRAZNO)
				return Smer.PRAZNO;

			matrica[i][j - 1].smer = matrica[i][j].smer;
		}
		if (smer == Smer.DESNO) {
			if (j == 9)
				return Smer.PRAZNO;
			if (matrica[i][j + 1].smer == Smer.END)
				return Smer.END;
			if (matrica[i][j + 1].smer != Smer.PRAZNO)
				return Smer.PRAZNO;

			matrica[i][j + 1].smer = matrica[i][j].smer;
		}
		matrica[i][j].smer = Smer.PRAZNO;

		return smer;
	}

	Smer odigrajPotez(Smer smer) {
		int i = 0;
		int j = 0;

		for (int k = 0; k < 3; k++) {
			for (int k2 = 0; k2 < 10; k2++) {
				if (matrica[k][k2].smer == Smer.START) {
					i = k;
					j = k2;

				}

			}

		}

		if (brnivoa == 1)
			return odigrajUSmeru(i, j, smer);
		if (brnivoa == 2)
			return odigrajUSmeru(i, j, smer);
		if (brnivoa == 3 || brnivoa == 4) {
			matrica[i][j].smer = Smer.PRAZNO;

			if (Smer.DOLE == smer || Smer.GORE == smer)
				for (int k = 0; k < 10; k++) {
					for (int k2 = 0; k2 < 3; k2++)
						if (matrica[k2][k].smer == Smer.GORE) {
							if (k2 == 0 && matrica[2][k].smer != Smer.PRAZNO) {
								odigrajUSmeru(2, k, Smer.GORE);
								odigrajUSmeru(k2, k, Smer.GORE);
								break;
							} else if (k2 == 0) {
								odigrajUSmeru(k2, k, Smer.GORE);
								odigrajUSmeru(k2 + 1, k, Smer.GORE);
								break;
							} else
								odigrajUSmeru(k2, k, Smer.GORE);

						}
				}
			Smer p = matrica[i][j].smer;
			matrica[i][j].smer = Smer.START;
			Smer p1 = odigrajUSmeru(i, j, smer);
			matrica[i][j].smer = p;
			return p1;
		}
		if (brnivoa == 5) {
			matrica[i][j].smer = Smer.PRAZNO;
			if (Smer.DOLE == smer || Smer.GORE == smer) {
				for (int k = 0; k < 10; k++) {
					for (int k2 = 0; k2 < 3; k2++)
						if (matrica[k2][k].smer == Smer.GORE) {
							if (k2 == 0 && matrica[2][k].smer != Smer.PRAZNO) {
								odigrajUSmeru(2, k, Smer.GORE);
								odigrajUSmeru(k2, k, Smer.GORE);
								break;
							} else if (k2 == 0) {
								odigrajUSmeru(k2, k, Smer.GORE);
								odigrajUSmeru(k2 + 1, k, Smer.GORE);
								break;
							} else
								odigrajUSmeru(k2, k, Smer.GORE);

						}
				}
				for (int k = 0; k < 10; k++) {
					for (int k2 = 2; k2 > -1; k2--) {
						if (matrica[k2][k].smer == Smer.DOLE)
							if (k2 == 2 && matrica[0][k].smer != Smer.PRAZNO) {
								odigrajUSmeru(0, k, Smer.DOLE);
								odigrajUSmeru(k2, k, Smer.DOLE);
								break;
							} else if (k2 == 2) {
								odigrajUSmeru(k2, k, Smer.GORE);
								odigrajUSmeru(k2 - 1, k, Smer.GORE);
								break;
							} else
								odigrajUSmeru(k2, k, Smer.GORE);

					}
				}
			}
			Smer p = matrica[i][j].smer;
			matrica[i][j].smer = Smer.START;
			Smer p1 = odigrajUSmeru(i, j, smer);
			matrica[i][j].smer = p;
			return p1;
		}
		return Smer.PRAZNO;
	}

}
