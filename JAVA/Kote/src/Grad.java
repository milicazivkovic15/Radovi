
public class Grad extends Objekat 
{
	private static int brojac=0;
	
	public Grad(String naziv,Kota kota)
	{
		super(naziv,"G"+(++brojac),kota);
	}

}
