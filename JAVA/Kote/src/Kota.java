
public class Kota 
{
	private double x;
	private double y;
	private double visina;
	public double getX() {
		return x;
	}
	public double getY() {
		return y;
	}
	public double getVisina() {
		return visina;
	}
	
	public Kota(double x,double y,double visina)
	{
		this.x=x;
		this.y=y;
		this.visina=visina;
	}
	
	public boolean equals(Kota k,double preciznost)
	{
		if(Math.abs(x-k.getX())<preciznost && Math.abs(y-k.getY())<preciznost) return true;
		else return false;
	}
	
	public boolean equals(Kota k)
	{
		return(equals(k,0.1f));
	}
	
	public String toString()
	{
		return("("+x+","+y+","+visina+")");
	}
	
	public double rastojanje(Kota k1,Kota k2)
	{
		return (double)(Math.sqrt(Math.pow((k1.x-k2.x), 2)+Math.pow((k1.y-k2.y), 2)));
	}
	
	public double rastojanje(Kota k)
	{
		if(k instanceof VezanaKota) return(k.rastojanje(this));
		else return(rastojanje(k,this));
	}
}
