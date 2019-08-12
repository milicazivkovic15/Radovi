
public class Test 
{

	public static void main(String[] args) 
	{
		Reka r1=new Reka("Dunav");
		r1.dodajKotu(102, 154, 400);
		r1.dodajKotu(99, 105, 396);
		r1.dodajKotu(89, 45, 350);
		r1.dodajKotu(96, 178, 310);
		r1.dodajKotu(45, 154, 370);
		
		Reka r2=new Reka("Neccku");
		r2.dodajKotu(100, 150, 400);
		r2.dodajKotu(80, 40, 350);
		r2.dodajKotu(90, 170, 310);
		r2.dodajKotu(35, 54, 370);
		
		Drum d1=new Drum("Put 1",'A');
		d1.dodajKotu(99, 105, 396);
		d1.dodajKotu(100, 134, 270);
		d1.dodajKotu(96, 178, 310);
		
		Drum d2=new Drum("Put 2",'M');
		d2.dodajKotu(99, 105, 396);
		d2.dodajKotu(56, 49, 223);
		d2.dodajKotu(96, 178, 310);
		
		Merljivo[] niz=new Merljivo[4];
		
		niz[0]=r1;
		niz[1]=r2;
		niz[2]=d1;
		niz[3]=d2;
		VezanaKota k1=new VezanaKota(99,105,396);
		VezanaKota k2=new VezanaKota(96,178,310);
		
		
		
		double t1=d1.procenjenoVremePutovanja(k1, k2);
		double t2=d2.procenjenoVremePutovanja(k1, k2);
		double s1=d1.duzinaPuta(k1, k2);
		double s2=d2.duzinaPuta(k1, k2);
		
		System.out.println("Put sa minimalnim vremenom:");
		if(t1<t2) System.out.println(d1.getKota());
		else System.out.println(d2.getKota());
		
		System.out.println("Put sa minimalnom duzinom:");
		if(s1<s2) System.out.println(d1.getKota());
		else System.out.println(d2.getKota());
		
		System.out.println("------REKE------");
		
		System.out.println(r1.getKota());
		System.out.println(r2.getKota());
	}

}
