

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		GeneratorBrojeva generator=new GeneratorBrojeva(100000000, 200000000);
		Niti[] niti=new Niti[10];
		for (int i = 0; i < niti.length; i++) {
			niti[i]=new Niti(generator);
			niti[i].start();
		}
		
		
	}

}
