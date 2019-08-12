
public class PlovnaReka extends Reka implements Prohodan
{
	private double UZVODNO=10.0;
	private double NIZVODNO=20.0;
	
	public PlovnaReka(String naziv)
	{
		super(naziv);
	}
	
	public PlovnaReka(String naziv,VezanaKota k)
	{
		super(naziv,k);
	}
	
	public double procenjenoVremePutovanja(Kota k1,Kota k2)
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
		
		while(k!=null && !k.equals(k2))
		{
			if(((VezanaKota)(k)).getDesno()!=null) 
			{
				if(((VezanaKota)(k)).getDesno().getVisina()>k.getVisina()) v=UZVODNO;
				else v=NIZVODNO;
				t+=k.rastojanje(k,((VezanaKota)(k)).getDesno())/v;
			}
			k=((VezanaKota)(k)).getDesno();
		}
		if(k.equals(k2)) return t;
		else return -1f;
	}
}
