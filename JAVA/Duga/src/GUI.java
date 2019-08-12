import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

public class GUI extends JFrame{

	private static final long serialVersionUID = 1L;
	MojeDugme[][] dugmici=new MojeDugme[8][4];
	MojeDugme[][] pomocni=new MojeDugme[8][4];
	engine logika=new engine();
	JButton provera=new JButton("Provera");
	JButton resetuj=new JButton("Resetuj");
	JButton nova=new JButton("Nova");
	JLabel brojPokusaja=new JLabel("Broj pokusaja: 0");
	JLabel raspolozivos=new JLabel("Raspolozive boje");
	JButton[] boje=new JButton[5];
	int niz[]=new int[4];
	
	
	GUI(){
		
		setBounds(0, 0, 600, 450);
		setLayout(new BorderLayout());
		setBackground(Color.CYAN);
		
		izgled();
		actionLiseneri();		
		dodajMatrice();
		inicijalizacija();
		
		setVisible(true);
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		
	}

	void izgled(){

		JPanel gore=new JPanel();
		gore.setLayout(new BorderLayout());
		gore.setBackground(Color.cyan);
		JPanel panel1=new JPanel();
		panel1.setLayout(new FlowLayout());
		panel1.add(raspolozivos);
		for (int i = 0; i < boje.length; i++) {
			boje[i]=new JButton();
			boje[i].setEnabled(false);
			boje[i].setPreferredSize(new Dimension(25,25));
		}
		boje[0].setBackground(Color.BLUE);
		boje[1].setBackground(Color.green);
		boje[2].setBackground(Color.yellow);
		boje[3].setBackground(Color.orange);
		boje[4].setBackground(Color.red);
		for (int i = 0; i < boje.length; i++) {
			panel1.add(boje[i]);
		}
		gore.add(panel1,BorderLayout.EAST);
		getContentPane().add(gore,BorderLayout.NORTH);
		
		JPanel panel2 =new JPanel();
		panel2.setBackground(Color.cyan);
		panel1.setBackground(Color.cyan);
		
		panel2.setLayout(new GridLayout(15, 1));
		panel2.add(brojPokusaja);
		panel2.add(provera);
		panel2.add(resetuj);
		panel2.add(nova);
		getContentPane().add(panel2, BorderLayout.WEST);
		
	}
	void dodajMatrice(){
		JPanel centar=new JPanel();
		centar.setBackground(Color.cyan);
		
		JPanel panel1=new JPanel();
		panel1.setLayout(new GridLayout(8, 4));
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j<4; j++) {
				panel1.add(dugmici[i][j]);
			}
		}
		JPanel panel2=new JPanel();
		panel2.setLayout(new GridLayout(8, 4));
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j<4; j++) {
				panel2.add(pomocni[i][j]);
			}
		}
		centar.add(panel1);
		centar.add(panel2);
		getContentPane().add(centar);
	}
	void actionLiseneri(){
		for (int i = 0; i <8; i++) {
			for (int j = 0; j < 4; j++) {
				dugmici[i][j]=new MojeDugme();
				pomocni[i][j]=new MojeDugme();
				dugmici[i][j].setPreferredSize(new Dimension(50,50));
				pomocni[i][j].setPreferredSize(new Dimension(50,50));
				dugmici[i][j].addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent arg0) {
						MojeDugme dugme=(MojeDugme)arg0.getSource();
						
						if(dugme.brojBoje==0){
							dugme.trenutnaBoja=0;
							dugme.setBackground(Color.BLUE);
							dugme.brojBoje++;
						}
						else if(dugme.brojBoje==1){
							dugme.trenutnaBoja=1;
							dugme.setBackground(Color.green);
							dugme.brojBoje++;
						}
						else if(dugme.brojBoje==2){
							dugme.trenutnaBoja=2;
							dugme.setBackground(Color.yellow);
							dugme.brojBoje++;
						}
						else if(dugme.brojBoje==3){
							dugme.trenutnaBoja=3;
							dugme.setBackground(Color.orange);
							dugme.brojBoje++;
						}
						else if(dugme.brojBoje==4){
							dugme.trenutnaBoja=4;
							dugme.setBackground(Color.red);
							dugme.brojBoje=0;
						}
					}
				});
			}
		}
		

		
		provera.addActionListener(new ActionListener() {
			
			@Override
				public void actionPerformed(ActionEvent arg0) {
					funkcijaProvere();			}
			});
			
		resetuj.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				inicijalizacija();
				
			}
		});
		

		
		nova.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				logika.inicijalizacija();
				inicijalizacija();
				
			}
		});
		
	}
	void funkcijaProvere(){
		int i=logika.brojPokusaja;
		
		for (int j = 0; j < niz.length; j++) {
			niz[j]=dugmici[i][j].trenutnaBoja;
		}

		
		int tacnaMesta=logika.proveraKombinacije(niz);
	
		int tacneBoje=logika.proveraBoja(niz);
		
		
		oboji(tacnaMesta,tacneBoje);
		if (tacnaMesta==4){
			kraj();
			
		}
		
		brojPokusaja.setText("Broj pokusaja: "+logika.brojPokusaja);
		if (logika.moguLiOpet()==false){
			kraj();
		}

		odkljucajVrstu();
	
		
		
	}

	void inicijalizacija(){
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j < 4; j++) {
				
				dugmici[i][j].setEnabled(false);
				dugmici[i][j].setBackground(Color.WHITE);
				
				dugmici[i][j].brojBoje=0;
				dugmici[i][j].trenutnaBoja=15;
				
				
				pomocni[i][j].setEnabled(false);
				pomocni[i][j].setBackground(Color.CYAN);
				
			}
		}
		logika.brojPokusaja=0;
		brojPokusaja.setText("Broj pokusaja: 0");
		
		odkljucajVrstu();
		
		
	}
	void oboji(int tm, int tb){
		int i =logika.brojPokusaja-1;
		
		int j = 0;
		for (; j < tm; j++) {
			pomocni[i][j].setBackground(Color.BLACK);
		}
		for (int jj=0; jj <tb; jj++) {
			pomocni[i][j++].setBackground(Color.WHITE);
		}
	}
	void odkljucajVrstu(){
		int i=logika.brojPokusaja;
		for (int j = 0; j < 4; j++) {
			dugmici[i][j].setEnabled(true);
		}
	}

	void kraj(){
		int odg=JOptionPane.showConfirmDialog(this, "Pobedili ste. Da li zelite novu partiju ","Kraj",JOptionPane.YES_NO_OPTION);
		if (odg==JOptionPane.YES_OPTION){
			logika.inicijalizacija();
			inicijalizacija();
		}
		else
			System.exit(0);
	}
}
