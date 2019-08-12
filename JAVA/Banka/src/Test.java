import prodavnica.*;
import banka.*;
public class Test {

	public static void main(String[] args) throws NepostojeciRacun,NepostojecaKartica
	{
		Banka b1=new Banka("Intesa","Brazil");
		FizickoLice f1=new FizickoLice("Pera","Kragujevac",12475);
		b1.KreirajRacun(f1, "dinarski");
		try
		{
			b1.uplatiNovac("1110", 1000);
		}
		catch(NepostojeciRacun e)
		{
			System.out.println(e.getMessage());
		}
		
		Banka b2=new Banka("Komercijalna","Srbija");
		b2.KreirajRacun(f1, "devizni");
		try
		{
			b2.uplatiNovac("2221", 1000);
		}
		catch(NepostojeciRacun e)
		{
			System.out.println(e.getMessage());
		}
		
		FizickoLice f2=new FizickoLice("Mika", "Kragujevac", 7777);
		b2.dodajPunomocje("2221", f2);
		
		PravnoLice p1=new PravnoLice("ImiSoft","Kragujevac","154");
		b1.izdajKarticu("1110", "maestro");
		
		
		Prodavnica[] prodavnice=new Prodavnica[3];
		prodavnice[0]=new SuperMarket("Trnava", "Kragujevac");
		prodavnice[0].dodajProizvod(new Proizvod("Sljivovica",300));
		prodavnice[0].dodajProizvod(new Proizvod("Kafa Minas",120));
		prodavnice[1]=new Trafika("Minut","Kragujevac");
		prodavnice[1].dodajProizvod(new Proizvod("Sljivovica",250));
		prodavnice[1].dodajProizvod(new Proizvod("Kafa Minas",130));
		prodavnice[2]=new SuperMarket("Maxi", "Kragujevac");
		prodavnice[2].dodajProizvod(new Proizvod("Sljivovica",290));
		prodavnice[2].dodajProizvod(new Proizvod("Kafa Minas",140));
		
		Kartica k=f1.dajKartica(3);
		
		Prodavnica minS=prodavnice[0];
		
		for(int i=1;i<prodavnice.length;i++)
		{
			if(prodavnice[i].dajCenu("Sljivovica")<minS.dajCenu("Sljivovica") && prodavnice[i] instanceof ElektronskoPlacanje) minS=prodavnice[i];
		}
		
		Prodavnica minK=prodavnice[0];
		
		for(int i=1;i<prodavnice.length;i++)
		{
			if(prodavnice[i].dajCenu("Kafa Minas")<minK.dajCenu("Kafa Minas") && prodavnice[i] instanceof ElektronskoPlacanje) minK=prodavnice[i];
		}
		String[] niz={"Sljivovica"};
		minS.kupiProizvode(k, niz);
		String[] niz2={"Kafa Minas"};
		minK.kupiProizvode(k, niz2);
		
		System.out.println(f1);
		System.out.println("---------------");
		System.out.println(f2);
		System.out.println("---------------");
		System.out.println(b1);
		System.out.println("---------------");
		System.out.println(b2);
		System.out.println("---------------");
		System.out.println(prodavnice[0]);
		System.out.println("---------------");
		System.out.println(p1);
	}
	
}
