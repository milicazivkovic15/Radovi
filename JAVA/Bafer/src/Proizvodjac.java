
public class Proizvodjac extends Thread{
	Bafer bbb;
	String ime;
	
	public Proizvodjac(String ime, Bafer bbb) {
		this.bbb = bbb;
		this.ime = ime;
	}
	
	public void run() {
		
			for(int i=0; i<10; i++){
			bbb.upis(ime, i*10);
			try {
			sleep(50);
			}	
		 catch (InterruptedException e) {
			e.printStackTrace();
		}
			}
		
	}
	
	
}
