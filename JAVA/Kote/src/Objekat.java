
public abstract class Objekat 
{
	private String naziv;
	private String id;
	
	private Kota kota;

	public Kota getKota() {
		return kota;
	}

	protected void setKota(Kota kota) {
		this.kota = kota;
	}

	public String getNaziv() {
		return naziv;
	}
	
	public Objekat(String naziv,String id,Kota kota)
	{
		this.naziv=naziv;
		this.kota=kota;
		this.id=id;
	}
	
	public double udaljenost(Objekat o)
	{
		return kota.rastojanje(o.getKota());
	}
}
