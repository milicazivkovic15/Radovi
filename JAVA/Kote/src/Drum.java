
public class Drum extends Slozen implements Prohodan 
{
	private char kategorija;
	private final double AUTOPUT=120.0;
	private final double MAGISTRALNI=60.0;
	private final double ZEMLJANI=30.0;
	private static int brojac=0;
	
	public Drum(String naziv,char kategorija)
	{
		this(naziv,kategorija,null);
	}
	
	public Drum(String naziv,char kategorija,VezanaKota k)
	{
		super(naziv,"D"+(++brojac),k);
		this.kategorija=kategorija;
	}
	
	
	@Override
	public double procenjenoVremePutovanja(Kota k1, Kota k2) 
	{	
		double t=0;
		Kota k=getKota();
		while(k!=null)
		{
			if(k.equals(k1)) break;
			k=((VezanaKota)(k)).getDesno();
		}
		if(k==null) return -1f;
		double v=1;
		if(kategorija=='A') v=AUTOPUT;
		if(kategorija=='M') v=MAGISTRALNI;
		if(kategorija=='Z') v=ZEMLJANI;
		while(k!=null && !k.equals(k2))
		{
			if(((VezanaKota)(k)).getDesno()!=null) t+=k.rastojanje(k,((VezanaKota)(k)).getDesno())/v;
			k=((VezanaKota)(k)).getDesno();
		}
		if(k.equals(k2)) return t;
		else return -1f;
	}

	@Override
	public void dodajKotu(double x, double y, double visina) 
	{
		VezanaKota k=new VezanaKota(x,y,visina);
		Kota tren=getKota();
		if (tren==null) setKota(k);
		else
		{
			while(((VezanaKota)(tren)).getDesno()!=null) tren=((VezanaKota)(tren)).getDesno();
			((VezanaKota)(tren)).setDesno(k);
		}
	}

}
