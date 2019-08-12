package banka;

public class NepostojecaKartica extends Exception 
{
	public NepostojecaKartica() {
		super("Kartica ne postoji!");
	}
}
