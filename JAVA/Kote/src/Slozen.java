
public abstract class Slozen extends Objekat implements Merljivo 
{
	public Slozen(String naziv,String id,Kota kota)
	{
		super(naziv,id,kota);
	}
	
	public abstract void dodajKotu(double x,double y,double visina);
	
	@Override
	public double duzinaPuta(Kota k1, Kota k2)
	{
		double r=0;
		Kota k=getKota();
		while(k!=null)
		{
			if(k.equals(k1)) break;
			k=((VezanaKota)(k)).getDesno();
		}
		if(k==null) return -1f;
		
		while(k!=null&&!k.equals(k2)) 
			if(((VezanaKota)(k)).getDesno()!=null) 
			{
				r+=k.rastojanje(k,((VezanaKota)(k)).getDesno());
				k=((VezanaKota)(k)).getDesno();
			}
		if(k==null) return -1;
		else return r;
	}

}
