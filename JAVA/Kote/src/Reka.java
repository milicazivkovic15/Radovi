
public class Reka extends Slozen 
{
	private static int brojac=0;
	
	public Reka(String naziv)
	{
		this(naziv,null);
	}
	
	public Reka(String naziv,VezanaKota k)
	{
		super(naziv,"R"+(++brojac),k);
	}
	
	@Override
	public void dodajKotu(double x, double y, double visina) 
	{
		VezanaKota k=new VezanaKota(x,y,visina);
		Kota tren=getKota();
		if (tren==null) setKota(k);
		else
		{
			while(((VezanaKota)(tren)).getDesno()!=null && ((VezanaKota)(tren)).getDesno().getVisina()>visina) tren=((VezanaKota)(tren)).getDesno();
			k.setDesno(((VezanaKota)(tren)).getDesno());
			((VezanaKota)(tren)).setDesno(k);
		}
	}

}
