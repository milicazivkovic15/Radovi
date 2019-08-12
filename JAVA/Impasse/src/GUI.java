import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.Image;
import java.awt.KeyEventDispatcher;
import java.awt.KeyboardFocusManager;
import java.awt.Toolkit;
import java.awt.event.KeyEvent;

import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;


public class GUI extends JFrame implements KeyEventDispatcher {

	private static final long serialVersionUID = 1L;
	JButton[][] polja=new JButton[3][10];
	JLabel[] kruzici=new JLabel[5];
	JLabel nazivNivoa=new JLabel("motion");
	Engine engine=new Engine();
	
	
	GUI(){
	
		setBounds(0, 0, 900, 600);
		setLayout(new GridLayout(3, 1));
		
		KeyboardFocusManager manager = KeyboardFocusManager.getCurrentKeyboardFocusManager();
	    manager.addKeyEventDispatcher(this);
		
		izgled();
		inicijalizacija();
		
		setVisible(true);
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		
	}
	void izgled(){
		JPanel gore=new JPanel(new FlowLayout());
		gore.setBackground(Color.GRAY);
		gore.add(nazivNivoa);
		add(gore);
		
		JPanel centar=new JPanel(new GridLayout(3,10));
		centar.setSize(new Dimension(900, 400));
		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 10; j++) {
				polja[i][j]=new JButton();
				
				centar.add(polja[i][j]);
				
			}
		}
		add(centar);
		
		JPanel dole=new JPanel(new BorderLayout());
		JPanel niz=new JPanel(new FlowLayout());
		dole.setBackground(Color.GRAY);
		niz.setBackground(Color.GRAY);
		for (int i = 0; i < kruzici.length; i++) {
			kruzici[i]=new JLabel();
			kruzici[i].setBackground(Color.white);
			niz.add(kruzici[i]);
		}
		dole.add(niz, BorderLayout.CENTER);
		add(dole);
		
		
		
	}
	void inicijalizacija(){
		osveziGui();
	}
	void osveziGui(){
		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 10; j++) {
				if (engine.matrica[i][j].smer==Smer.START){
					//Icon img =  new ImageIcon(new ImageIcon("/home/student/Desktop/Materijal/IIkolokvijum/1.png").getImage().getScaledInstance(60, 60, Image.SCALE_DEFAULT));
					//polja[i][j].setIcon(img);
					polja[i][j].setBackground(Color.black);
				}
				else if (engine.matrica[i][j].smer==Smer.END){
					//Icon img =  new ImageIcon(new ImageIcon("/home/student/Desktop/Materijal/IIkolokvijum/2.png").getImage().getScaledInstance(60, 60, Image.SCALE_DEFAULT));
					//polja[i][j].setIcon(img);

					polja[i][j].setBackground(Color.black);
				}
				else if (engine.matrica[i][j].smer==Smer.FIKSNA){
					//Icon img =  new ImageIcon(new ImageIcon("/home/student/Desktop/Materijal/IIkolokvijum/3.png").getImage().getScaledInstance(60, 60, Image.SCALE_DEFAULT));
					//polja[i][j].setIcon(img);

					polja[i][j].setBackground(Color.gray);
				}
				else if (engine.matrica[i][j].smer==Smer.DOLE){
					//Icon img =  new ImageIcon(new ImageIcon("/home/student/Desktop/Materijal/IIkolokvijum/4.png").getImage().getScaledInstance(60, 60, Image.SCALE_DEFAULT));
					//polja[i][j].setIcon(img);

					polja[i][j].setBackground(Color.PINK);
				}
				else if (engine.matrica[i][j].smer==Smer.GORE){
					//Icon img =  new ImageIcon(new ImageIcon("/home/student/Desktop/Materijal/IIkolokvijum/5.png").getImage().getScaledInstance(60, 60, Image.SCALE_DEFAULT));
					//polja[i][j].setIcon(img);

					polja[i][j].setBackground(Color.yellow);
				}
				else{
					//polja[i][j].setIcon(null);

					polja[i][j].setBackground(Color.white);
				}
			}
		}
	}
	void presaoNivo(){
		if (engine.brnivoa==5)
			presaoIgricu();
		else{
			if (engine.brnivoa==1)
				nazivNivoa.setText("wrap");
			else if (engine.brnivoa==2)
				nazivNivoa.setText("suprise");
			else if (engine.brnivoa==3)
				nazivNivoa.setText("going up");
			else
					nazivNivoa.setText("weave");
			engine.inicijalizacija();
			osveziGui();
			
		}
			
	}
	void kraj(){
		int odg=new JOptionPane().showConfirmDialog(this, "Doslo je do sudara! \n Da li zelite novu partiju?","Kraj igre",JOptionPane.YES_NO_OPTION);
		if (odg==JOptionPane.YES_OPTION){
			engine.pocetak();
			inicijalizacija();
		}
		else
			System.exit(0);
	}
	
	void presaoIgricu(){
		int odg=new JOptionPane().showConfirmDialog(this, "Pobedili ste igricu! \n Da li zelite novu partiju?","Kraj igre",JOptionPane.YES_NO_OPTION);
		if (odg==JOptionPane.YES_OPTION){
			engine.pocetak();
			inicijalizacija();
		}
		else
			System.exit(0);
	}

	@Override
	public boolean dispatchKeyEvent(KeyEvent arg0) {
		Smer daLi=Smer.PRAZNO;
		
		if (arg0.getID()==KeyEvent.KEY_RELEASED ){
		if ( arg0.getKeyCode()==KeyEvent.VK_LEFT){
			daLi=engine.odigrajPotez(Smer.LEVO);
			
			if (daLi==Smer.PRAZNO)
				kraj();
			else if(daLi==Smer.END)
				presaoNivo();
			else
				osveziGui();
		}
		if (arg0.getKeyCode()==KeyEvent.VK_RIGHT){
			daLi=engine.odigrajPotez(Smer.DESNO);
			if (daLi==Smer.PRAZNO)
				kraj();
			else if(daLi==Smer.END)
				presaoNivo();
			else
				osveziGui();
		}
		if (arg0.getKeyCode()==KeyEvent.VK_UP){
			daLi=engine.odigrajPotez(Smer.GORE);
			if (daLi==Smer.PRAZNO)
				kraj();
			else if(daLi==Smer.END)
				presaoNivo();
			else
				osveziGui();
		}
		if (arg0.getKeyCode()==KeyEvent.VK_DOWN){
			daLi=engine.odigrajPotez(Smer.DOLE);
			if (daLi==Smer.PRAZNO)
				kraj();
			else if(daLi==Smer.END)
				presaoNivo();
			else
				osveziGui();
		}}
		return false;
	}
	
}
