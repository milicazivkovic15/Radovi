
public class VezanaKota extends Kota
{
	private Kota levo;
	private Kota desno;
	
	public VezanaKota(double x,double y,double h)
	{
		super(x,y,h);
	}

	public Kota getLevo() {
		return levo;
	}

	public void setLevo(Kota levo) {
		this.levo = levo;
	}

	public Kota getDesno() {
		return desno;
	}

	public void setDesno(Kota desno) {
		this.desno = desno;
	}
	
	public double rastojanje(Kota k)
	{
		double d1=k.rastojanje(levo);
		double d2=k.rastojanje(desno);
		double d3=k.rastojanje(this);
		if(d1<d2) d2=d1;
		if(d2<d3) return d2;
		else return d3;
	}
	
	public String toString()
	{
		String s=super.toString();
		if(desno!=null) s+="---"+(VezanaKota)desno;
		return s;
	}
}
