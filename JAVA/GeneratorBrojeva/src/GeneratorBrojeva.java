

public class GeneratorBrojeva {
	long odBroja;
	long doBroja;
	long trenutni;
	static int brojNiti=0;
	public GeneratorBrojeva(long odBroja, long doBroja) {
		super();
		this.odBroja = odBroja;
		trenutni=odBroja;
		this.doBroja = doBroja;
	}

	public synchronized long getBroj(){
		while(brojNiti==5)
			try {
				wait();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
		brojNiti++;
		notifyAll();
		if (trenutni<doBroja)
			return trenutni++;
		else return 0;
	}
	public synchronized void stampaj(long broj, boolean stampaj){
		brojNiti--;
		if (stampaj==true)
			System.out.println(broj);
		notifyAll();
	}
	
}
