
public class Bafer {
	int[] sadrzaj = new int[10];
	int brUpisa = 0;
	int sledi = 0;
	boolean ispis=false;
	
	public synchronized void upis(String ime, int unos) {
		if (ispis == false){
			sadrzaj[sledi] = unos; 
			
			System.out.println(ime+" JE UPISAO "+unos);
			notify();
			brUpisa++;
			if (brUpisa == 10){
				ispis = true;
			}
		}
	}
	
	public synchronized void ispis(String ime) {
		while(ispis == false){
			try {
				wait();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}		
		int ispisivanje;
		ispisivanje = sadrzaj[(brUpisa - sledi)%10];
		System.out.println(ime+" je PROCITAO "+ispisivanje);
		
		brUpisa=0;
		ispis = false;
	}
}
