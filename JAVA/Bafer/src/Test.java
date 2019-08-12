
public class Test {


	public static void main(String[] args) {
		Bafer bbb = new Bafer();
		Proizvodjac[] pro  = new Proizvodjac[10];
		
		pro[0] = new Proizvodjac("Nikola", bbb);
		pro[1] = new Proizvodjac("Marko", bbb);
		pro[2] = new Proizvodjac("Milos", bbb);
		pro[3] = new Proizvodjac("Goran", bbb);
		pro[4] = new Proizvodjac("Ivan", bbb);
		pro[5] = new Proizvodjac("Jovan", bbb);
		pro[6] = new Proizvodjac("Stefan", bbb);
		pro[7] = new Proizvodjac("Lazar", bbb);
		pro[8] = new Proizvodjac("Djordje", bbb);
		pro[9] = new Proizvodjac("Branko", bbb);
		
		Potrosac pot = new Potrosac("IGOR", bbb);
		
		for (int i=0; i<10; i++)
			pro[i].start();
		
		pot.start();
		
		
	}

}
