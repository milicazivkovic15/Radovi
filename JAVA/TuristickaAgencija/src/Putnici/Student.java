package Putnici;

public class Student extends Putnik implements Ipopust {
	String brojIndeksa;
	static double popust=10;
	public Student(String imee,String brIndexa, double budzett, double tezinaP) {
		super(imee, budzett, tezinaP);
		// TODO Auto-generated constructor stub
		brojIndeksa=brIndexa;
	}

	@Override
	public double dajPopust() {
		return popust;
	}

}
