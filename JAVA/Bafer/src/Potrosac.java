
public class Potrosac extends Thread{
	Bafer bbb;
	String ime;
	
	public Potrosac(String ime, Bafer bbb) {
		this.bbb = bbb;
		this.ime = ime;
	}
	
	public void run() {
		try {
			for(int i=0; i<10; i++){
			bbb.ispis(ime);
			sleep(50);
			}	
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
	}
}
