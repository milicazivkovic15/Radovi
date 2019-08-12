

public class Niti extends Thread{
	GeneratorBrojeva generator;
	
	public Niti(GeneratorBrojeva generator) {
		super();
		this.generator = generator;
		
	}
	
	public boolean provera(){
		long broj=generator.getBroj();
		if (broj==0) return false;
		try {
			Thread.sleep(3);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		for (int i = 2; i < (int)(Math.sqrt(broj)); i++) {
			if (broj%i==0) {
				generator.stampaj(broj, false);
				return true;
			}
		}
		 generator.stampaj(broj, true);
		return true;
	}
	public void run(){
		while( provera()==true);
	}
}
