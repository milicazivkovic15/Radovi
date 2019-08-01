import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.Timer;

import igraci.Igrac;
import igraci.Racunar;
import igraci.Takmicar;
import igre.Dame;
import igre.Max;
import igre.Min;
import igre.SestaRukaIKraljSrce;
import igre.SvaSrca;
import igre.ZacaTref;
import karte.Znak;


public class GUI extends JFrame{

	private static final long serialVersionUID = 1L;
	Engine e;
	JButton[] karte=new JButton[8];
	JButton talon[]=new JButton[5];
	JButton rez[]=new JButton[4];
	JButton obavestenje;
	JButton ime2;
	JButton igre[][]= new JButton[4][6];
	JButton imgTekuceIgre=new JButton("");
	JButton vreme= new JButton();
	JTextArea chat;
	JTextArea tekucaIgra=new JTextArea();
	String opisTekuceIgre[]={"TEKUCA IGRA: \n Ne odneti žandara u trefu.\n Nosi 8 poena.","TEKUCA IGRA: \n Odneti što manje dama. \n Svaka odneta dama nosi 2 poena.","TEKUCA IGRA: \n Ne odneti kralja srce i šestu ruku. \n Oba nose po 4 poena.","TEKUCA IGRA: \n Odneti sva srca, ili što manje. Svako odneto \n srce nosi  jedan poen,  ali ako se odnese \n svih 8,  onda se dobija -8 poena","TEKUCA IGRA: \n Odneti što manje karata. \n Svaka odneta ruka nosi jedan poen.","TEKUCA IGRA: \n Odneti što vise karata.\n Svaka odneta ruka nosi -1 poen."};
	String textUChatu="";
	String znakRuke="";
	Timer timer;
	int time;
	
	GUI(){
		super("LORA");
		Dimension dim = Toolkit.getDefaultToolkit().getScreenSize();
	    
		setBounds(0, 0,(int) dim.getWidth(), (int) dim.getHeight());
	   
	    timer=new Timer(1000, new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent ev) {
				
				
				vreme.setText(time+"");
				time++;
				if (time==1){
					e.igracNaPotezu();
					e.igracNaPotezu();
					e.igracNaPotezu();
					if (Igrac.getTrenutnaIgra()==null || (Igrac.getTrenutnaIgra()!=null && Igrac.getTrenutnaIgra().getBrKarataNaTalonu()==0))
						for (int i = 0; i < 4; i++) {
							talon[i].setIcon(null);
							
						}
					if (e.igracNaPotezu() instanceof Takmicar){
						timer.stop();
						time=0;
						vreme.setText("0");
					}
				}
				if (time==2){
					timer.stop();
					time=0;
					odigrajPotez();					
				}
			}
		});
		izgled();
		
		setVisible(true);
		
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		setMinimumSize(new Dimension(1000, 725));
		String path=getClass().getResource("img/ICON.png")+"";

		URL url;
		try {
			url = new URL(path);
			Toolkit kit = Toolkit.getDefaultToolkit();
			Image img = kit.createImage(url);
			setIconImage(img);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		pack();
		inicijalizacija();
		
	}
	void izgled(){
		vreme.setBackground(Color.YELLOW);
		vreme.setFont(new Font("Serif", Font.BOLD, 18));
		
		JPanel igra=new JPanel(new BorderLayout());
		for (int i = 0; i < 4; i++) {
			rez[i]=new JButton(" 0 \n 0 ");
			rez[i].setPreferredSize(new Dimension(88, 88));
			rez[i].setHorizontalTextPosition(JButton.CENTER);
			rez[i].setVerticalTextPosition(JButton.CENTER);
			rez[i].setEnabled(false);
			rez[i].setBackground(Color.decode("#008000"));
			rez[i].setFont(new Font("Serif", Font.BOLD, 16));
			
		}
		ImageIcon pozadina=new ImageIcon(getClass().getResource("/img/rez1.jpg"));
		rez[1].setIcon(pozadina);
		rez[1].setDisabledIcon(pozadina);
		pozadina=new ImageIcon(getClass().getResource("/img/rez2.jpg"));
		rez[2].setIcon(pozadina);
		rez[2].setDisabledIcon(pozadina);
		pozadina=new ImageIcon(getClass().getResource("/img/rez3.jpg"));
		rez[3].setIcon(pozadina);
		rez[3].setDisabledIcon(pozadina);
		pozadina=new ImageIcon(getClass().getResource("/img/rez4.jpg"));
		rez[0].setIcon(pozadina);
		rez[0].setDisabledIcon(pozadina);
		
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j < 6; j++) {
				igre[i][j]=new JButton();
				igre[i][j].setPreferredSize(new Dimension(60, 60));
				igre[i][j].setBackground(Color.WHITE);
				igre[i][j].setEnabled(false);

			}
		}
		int j;
		int	i=0;
				j=0;
				igre[i][j++].addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent arg0) {
						// TODO Auto-generated method stub
						e.birajIgru(NazivIgara.MIN);
						((JButton)arg0.getSource()).setIcon(null);
						for (int k = 0; k < 6; k++) {
							igre[0][k].setEnabled(false);
						}
						textUChatu+=" minimum \n";

						chat.setText(textUChatu);
						ImageIcon img=new ImageIcon(getClass().getResource("/img/min.png"));
						img=uvecajSliku(img, 60, 60);
						imgTekuceIgre.setIcon(img);
						imgTekuceIgre.setDisabledIcon(img);
						tekucaIgra.setText(opisTekuceIgre[4]);
						obavestenje.setText("Igra je odabrana, odigrajte potez.");
						for (int k = 0; k < 8; k++) {
							karte[k].setEnabled(true);
						}
					}
				});
				igre[i][j++].addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent arg0) {
						// TODO Auto-generated method stub
						e.birajIgru(NazivIgara.MAX);
						((JButton)arg0.getSource()).setIcon(null);
						for (int k = 0; k < 6; k++) {
							igre[0][k].setEnabled(false);
						}
						textUChatu+=" maksimum \n";

						chat.setText(textUChatu);
						ImageIcon img=new ImageIcon(getClass().getResource("/img/max.png"));
						img=uvecajSliku(img, 60, 60);

						imgTekuceIgre.setIcon(img);
						imgTekuceIgre.setDisabledIcon(img);
						tekucaIgra.setText(opisTekuceIgre[5]);
						for (int k = 0; k < 8; k++) {
							karte[k].setEnabled(true);
						}
						obavestenje.setText("Igra je odabrana, odigrajte potez.");
					}
				});
				igre[i][j++].addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent arg0) {
						// TODO Auto-generated method stub
						e.birajIgru(NazivIgara.SVASRCA);

						((JButton)arg0.getSource()).setIcon(null);
						for (int k = 0; k < 6; k++) {
							igre[0][k].setEnabled(false);
						}
						textUChatu+=" sva srca \n";
						for (int k = 0; k < 8; k++) {
							karte[k].setEnabled(true);
						}
						chat.setText(textUChatu);
						ImageIcon img=new ImageIcon(getClass().getResource("/img/svaS.png"));
						img=uvecajSliku(img, 60, 60);
						imgTekuceIgre.setIcon(img);
						imgTekuceIgre.setDisabledIcon(img);
						tekucaIgra.setText(opisTekuceIgre[3]);
						obavestenje.setText("Igra je odabrana, odigrajte potez.");
					}
				});
				igre[i][j++].addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent arg0) {
						// TODO Auto-generated method stub
						e.birajIgru(NazivIgara.DAME);

						((JButton)arg0.getSource()).setIcon(null);
						for (int k = 0; k < 6; k++) {
							igre[0][k].setEnabled(false);
						}
						textUChatu+=" dame ne \n";
						for (int k = 0; k < 8; k++) {
							karte[k].setEnabled(true);
						}

						chat.setText(textUChatu);
						ImageIcon img=new ImageIcon(getClass().getResource("/img/dame.png"));
						img=uvecajSliku(img, 60, 60);

						imgTekuceIgre.setIcon(img);
						imgTekuceIgre.setDisabledIcon(img);
						tekucaIgra.setText(opisTekuceIgre[1]);

						obavestenje.setText("Igra je odabrana, odigrajte potez.");
					}
				});
				igre[i][j++].addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent arg0) {
						// TODO Auto-generated method stub
						e.birajIgru(NazivIgara.SESTARUKAIKRALJSRCE);
						((JButton)arg0.getSource()).setIcon(null);
						for (int k = 0; k < 6; k++) {
							igre[0][k].setEnabled(false);
						}
						textUChatu+="\n sesta ruka i kralj srce \n";

						chat.setText(textUChatu);
						ImageIcon img=new ImageIcon(getClass().getResource("/img/kraljS.png"));
						img=uvecajSliku(img, 60, 60);

						imgTekuceIgre.setIcon(img);
						imgTekuceIgre.setDisabledIcon(img);
						tekucaIgra.setText(opisTekuceIgre[2]);
						for (int k = 0; k < 8; k++) {
							karte[k].setEnabled(true);
						}
						obavestenje.setText("Igra je odabrana, odigrajte potez.");
					}
				});
				igre[i][j++].addActionListener(new ActionListener() {
					
					@Override
					public void actionPerformed(ActionEvent arg0) {
						// TODO Auto-generated method stub
						e.birajIgru(NazivIgara.ZACATREF);

						((JButton)arg0.getSource()).setIcon(null);
						for (int k = 0; k < 6; k++) {
							igre[0][k].setEnabled(false);
						}
						textUChatu+=" zaca tref ne \n";
						for (int k = 0; k < 8; k++) {
							karte[k].setEnabled(true);
						}
						chat.setText(textUChatu);
						ImageIcon img=new ImageIcon(getClass().getResource("/img/zaca.png"));
						img=uvecajSliku(img, 60, 60);

						imgTekuceIgre.setIcon(img);
						imgTekuceIgre.setDisabledIcon(img);
						tekucaIgra.setText(opisTekuceIgre[0]);

						obavestenje.setText("Igra je odabrana, odigrajte potez.");
					}
				});
				
		
		JPanel gore =new JPanel(new FlowLayout());
		JPanel i1=new JPanel(new GridLayout(1, 8));
		for (int i2 = 0; i2 < 6; i2++) {
			i1.add(igre[2][i2]);
		}

		gore.setBackground(Color.decode("#008000"));
		
		gore.add(i1);
		JButton ime1=new JButton("Igrac 2");
		ime1.setBorder(null);
		ime1.setForeground(Color.BLUE);

		ime1.setBackground(Color.decode("#008000"));
		gore.add(rez[2]);
		gore.add(ime1);
		
		JPanel tekuca=new JPanel(new FlowLayout());
		imgTekuceIgre.setPreferredSize(new Dimension(60, 60));
		imgTekuceIgre.setEnabled(false);
		tekucaIgra.setEditable(false);
		tekuca.add(imgTekuceIgre);
		tekuca.add(tekucaIgra);
		tekucaIgra.setPreferredSize(new Dimension(300,60));
		gore.add(tekuca);
		igra.add(gore, BorderLayout.NORTH);

	
		
		JPanel dole =new JPanel(new FlowLayout());
		JPanel ct=new JPanel(new BorderLayout());

		JPanel k2=new JPanel(new GridLayout(1, 8));
		JPanel i2=new JPanel(new GridLayout(1, 6));
		i2.setBackground(Color.decode("#008000"));
		for (int i11 = 0; i11 <6; i11++) {
			igre[0][i11].setBackground(Color.WHITE);
			i2.add(igre[0][i11]);
		
		}
		ct.add(i2,BorderLayout.NORTH);
		dole.setBackground(Color.decode("#008000"));
		
		for (int i11 = 0; i11 < 8; i11++) {
			karte[i11]=new GUIKarta(i11);
			karte[i11].setPreferredSize(new Dimension(85, 115));
			karte[i11].setEnabled(true);
			karte[i11].setBackground(Color.decode("#008000"));
			karte[i11].addActionListener(new ActionListener() {
				
				@Override
				public void actionPerformed(ActionEvent e) {
					// TODO Auto-generated method stub
					actionPerformedKarta(e);
				}
			});
			k2.add(karte[i11]);
		}
		
		JButton ok=new JButton("Napusti partiju");
		ok.setFont(new Font("Serif", Font.ITALIC, 16));
		ok.setForeground(Color.DARK_GRAY);
		ok.setBackground(Color.white);
		ok.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				// TODO Auto-generated method stub
				timer.stop();
				kraj();
			}
		});
		ct.add(k2,BorderLayout.SOUTH);

		ime2=new JButton("");
		ime2.setForeground(Color.BLUE);

		ime2.setBorder(null);
		
		ime2.setBackground(Color.decode("#008000"));
		dole.add(ime2);
		
		dole.add(rez[0]);
		
		dole.add(ct);
		dole.add(ok);
		

		igra.add(dole,BorderLayout.SOUTH);

		
		JPanel l=new JPanel(new GridLayout(2,1));
		JPanel levo=new JPanel(new FlowLayout());
		
		JPanel i3=new JPanel(new GridLayout(2, 4));
		for (int i11 = 0; i11 < 6; i11++) {
			i3.add(igre[1][i11]);
		}

		chat = new JTextArea();
		chat.setEditable(false);
		chat.setFont(new Font("Serif", Font.ITALIC, 15));
        
		JScrollPane scroller = new JScrollPane(chat, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		
		levo.add(i3);

		JButton ime3=new JButton("Igrac 1");
		ime3.setBorder(null);
		ime3.setBackground(Color.decode("#008000"));
		levo.add(rez[1]);
		levo.add(ime3);
		ime3.setForeground(Color.BLUE);
		l.add(levo);
		l.add(scroller);
		levo.setBackground(Color.decode("#008000"));
		
		igra.add(l,BorderLayout.WEST);
		

		
		JPanel prazno[]=new JPanel[5];
		for (int k = 0; k < 5; k++) {
			prazno[k]=new JPanel();
			prazno[k].setBackground(Color.decode("#008000"));
			
		}

		JPanel c=new JPanel(new FlowLayout());
		int pom=0;
		JPanel centar=new JPanel(new GridLayout(3, 3));
		for (int i11 = 0; i11 < 4; i11++) {
			
			pom++;
			if (pom==5){
				ImageIcon img=new ImageIcon(getClass().getResource("/img/lora.png"));
				img=uvecajSliku(img, 80, 110);
				talon[4]=new JButton();
				talon[4].setPreferredSize(new Dimension(95, 125));
				talon[4].setEnabled(false);
				talon[4].setIcon(img);
				talon[4].setDisabledIcon(img);
				rez[i].setHorizontalTextPosition(JButton.CENTER);
				rez[i].setVerticalTextPosition(JButton.CENTER);
				
				talon[4].setBackground(Color.BLACK);
				centar.add(talon[4]);
					
			}
			else
				centar.add(prazno[i11]);
			talon[i11]=new JButton();
			talon[i11].setPreferredSize(new Dimension(95, 125));
			talon[i11].setEnabled(false);
			talon[i11].setBackground(Color.decode("#008000"));
			centar.add(talon[i11]);
			pom++;
		}
		
		centar.setBackground(Color.decode("#008000"));
		c.setBackground(Color.decode("#008000"));
		
		c.add(centar);
		igra.add(c, BorderLayout.CENTER);
		
	
		
		JPanel desno=new JPanel(new FlowLayout());
		JPanel i4=new JPanel(new GridLayout(2, 4));

		for (int i11 = 0; i11 < 6; i11++) {
			i4.add(igre[3][i11]);
		}
		desno.setBackground(Color.decode("#008000"));
		
		desno.add(i4);

		JButton ime4=new JButton("Igrac 3");
		ime4.setBorder(null);
		ime4.setForeground(Color.BLUE);

		ime4.setBackground(Color.decode("#008000"));
		desno.add(rez[3]);
		desno.add(ime4);
		
		igra.add(desno, BorderLayout.EAST);
		add(igra, BorderLayout.CENTER);
		obavestenje=new JButton("Igra jos nije pocela. Izaberite igru!");
		obavestenje.setPreferredSize(new Dimension(200, 30));
		obavestenje.setBackground(Color.WHITE);
		obavestenje.setFont(new Font("Serif", Font.BOLD, 16));
		add(obavestenje,BorderLayout.AFTER_LAST_LINE);
		add(vreme,BorderLayout.BEFORE_FIRST_LINE);
	}

	void inicijalizacija(){
		e=new Engine();
		textUChatu="Vi birate igru. Trenutna igra je  \n";
		chat.setText(textUChatu);		
		for (int i1 = 0; i1 < 4; i1++) {
			rez[i1].setBackground(Color.decode("#008000"));
			rez[i1].setText("0 \n 0");
			talon[i1].setIcon(null);
			e.next();
		}
		rez[0].setBackground(Color.red);
		
		osveziMojeKarte();
		time=0;
		vreme.setText("0");
		
		tekucaIgra.setText("TEKUCA IGRA");
		int j;
		for (int i = 0; i <6; i++) {
			igre[0][i].setEnabled(true);
		}
		imgTekuceIgre.setIcon(null);
		for (int k = 0; k < 8; k++) {
			karte[k].setEnabled(false);
		}
		for (int i = 0; i < 4; i++) {
			j=0;
			
			ImageIcon img=new ImageIcon(getClass().getResource("/img/min.png"));
			img=uvecajSliku(img, 60, 60);

			igre[i][j].setIcon(img);
			igre[i][j++].setDisabledIcon(img);
			
			img=new ImageIcon(getClass().getResource("/img/max.png"));
			img=uvecajSliku(img, 60, 60);

			igre[i][j].setIcon(img);
			igre[i][j++].setDisabledIcon(img);
			
	
			 img=new ImageIcon(getClass().getResource("/img/svaS.png"));
			 img=uvecajSliku(img, 60, 60);

			 igre[i][j].setIcon(img);
			igre[i][j++].setDisabledIcon(img);
			
	
			img=new ImageIcon(getClass().getResource("/img/dame.png"));
			img=uvecajSliku(img, 60, 60);

			igre[i][j].setIcon(img);
			igre[i][j++].setDisabledIcon(img);
			
	
			img=new ImageIcon(getClass().getResource("/img/kraljS.png"));
			img=uvecajSliku(img, 60, 60);

			igre[i][j].setIcon(img);
			igre[i][j++].setDisabledIcon(img);
			
	
			img=new ImageIcon(getClass().getResource("/img/zaca.png"));
			img=uvecajSliku(img, 60, 60);

			igre[i][j].setIcon(img);
			igre[i][j++].setDisabledIcon(img);
			
	
			
		}
		String name = JOptionPane.showInputDialog(this, "Unesite vase ime");
		 ime2.setText(name);

		
	}
	void osveziMojeKarte(){

			for (int j = 0; j < 8; j++) {
				if(e.takmicar().getKarta(j)!=null){
					int br =e.takmicar().getKarta(j).getBroj();
					Znak znak=e.takmicar().getKarta(j).getZnak();
					ImageIcon img=null;
					if (znak==Znak.KOCKA){
						if (br==7){
							img=new ImageIcon(getClass().getResource("/img/7K.png"));												
						}
						else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8K.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9K.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10K.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JK.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DK.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KK.png"));
												
						}else{
							img=new ImageIcon(getClass().getResource("/img/1K.png"));
							
						}
					}
	
					else if (znak==Znak.TREF){
						if (br==7){
							img=new ImageIcon(getClass().getResource("/img/7D.png"));
							
						}
						else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8D.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9D.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10D.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JD.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DD.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KD.png"));
												
						}else{
							img=new ImageIcon(getClass().getResource("/img/1D.png"));
												
						}
						
						
					}
					else if (znak==Znak.SRCE){
						if (br==7){
							img=new ImageIcon(getClass().getResource("/img/7S.png"));
							
						}
						else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8S.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9S.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10S.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JS.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DS.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KS.png"));
												
						}else{
							img=new ImageIcon(getClass().getResource("/img/1S.png"));
												
						}
						
						
					}
					else if (znak==Znak.PIK){
						if (br==7){
							img=new ImageIcon(getClass().getResource("/img/7L.png"));
							
						}
						else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8L.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9L.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10L.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JL.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DL.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KL.png"));
												
						}else{
							img=new ImageIcon(getClass().getResource("/img/1L.png"));
												
						}
						
						
					}
					img=uvecajSliku(img, 85, 115);

					karte[j].setIcon(img);
					karte[j].setDisabledIcon(img);

				}
				else
					karte[j].setIcon(null);
			}
		


		
	}
	void osveziTalon(){
			if(e.igracNaPotezu().getTalon()!=null){
				int br =e.igracNaPotezu().getTalon().getBroj();
				Znak znak=e.igracNaPotezu().getTalon().getZnak();
				int j=e.redniBrojTrenutnogIgraca();
				ImageIcon img=null;
				if (j==0)
					j=3;
				else if (j==1)
					j=1;
				else if (j==2)
					j=0;
				else
					j=2;
				if (znak!=null){
					if (znak==Znak.KOCKA){
						if (br==7){
							img=new ImageIcon(getClass().getResource("/img/7K.png"));
												
						}else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8K.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9K.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10K.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JK.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DK.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KK.png"));
												
						}else {
							img=new ImageIcon(getClass().getResource("/img/1K.png"));
												
						}
						
					}
	
					else if (znak==Znak.TREF){
						if (br==7){
							 img=new ImageIcon(getClass().getResource("/img/7D.png"));
						
						}else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8D.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9D.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10D.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JD.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DD.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KD.png"));
												
						}else{
							img=new ImageIcon(getClass().getResource("/img/1D.png"));
												
						}
						
					}
					else if (znak==Znak.SRCE){
						if (br==7){
							img=new ImageIcon(getClass().getResource("/img/7S.png"));
						
						}else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8S.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9S.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10S.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JS.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DS.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KS.png"));
												
						}else {
							img=new ImageIcon(getClass().getResource("/img/1S.png"));
												
						}		
					}
					else if (znak==Znak.PIK){
						if (br==7){
							img=new ImageIcon(getClass().getResource("/img/7L.png"));
						
						}
						else if (br==8){
							img=new ImageIcon(getClass().getResource("/img/8L.png"));
												
						}else if (br==9){
							img=new ImageIcon(getClass().getResource("/img/9L.png"));
												
						}else if (br==10){
							img=new ImageIcon(getClass().getResource("/img/10L.png"));
												
						}else if (br==12){
							img=new ImageIcon(getClass().getResource("/img/JL.png"));
												
						}else if (br==13){
							img=new ImageIcon(getClass().getResource("/img/DL.png"));
												
						}else if (br==14){
							img=new ImageIcon(getClass().getResource("/img/KL.png"));
												
						}else {
							img=new ImageIcon(getClass().getResource("/img/1L.png"));
												
						}	
					}
					img=uvecajSliku(img, 95, 125);
					talon[j].setIcon(img);
					talon[j].setDisabledIcon(img);
					
				}
				else
					talon[j].setIcon(null);
			}
	}

	public void actionPerformedKarta(ActionEvent ev) {
		// TODO Auto-generated method stub
		if(e.odigrajPotez(((GUIKarta)ev.getSource()).i)!=-1 && e.igracNaPotezu() instanceof Takmicar){
			e.igracNaPotezu();
			e.igracNaPotezu();
			e.igracNaPotezu();
			if (Igrac.getTrenutnaIgra()==null || (Igrac.getTrenutnaIgra()!=null && Igrac.getTrenutnaIgra().getBrKarataNaTalonu()==1)){
				znakRuke="Igra se u znaku: "+e.igracNaPotezu().getTalon().getZnak();
				obavestenje.setText(znakRuke);	
				for (int i = 0; i < 4; i++) {
					talon[i].setIcon(null);
				}
			}	
			osveziMojeKarte();
			osveziTalon();
			textUChatu+=" Vi ste odigrali potez.  \nIzbacili ste "+e.igracNaPotezu().getTalon().getZnak()+" "+e.igracNaPotezu().getTalon().getBroj()+" \n";
			e.igracNaPotezu().osveziTalon();
			
			obavestenje.setText(znakRuke+".  Ispravno ste odigrali potez");

			chat.setText(textUChatu);
			rez[e.redniBrojTrenutnogIgraca()].setBackground(Color.decode("#008000"));
			if(e.next()){
				znakRuke="";
				rez[e.redniBrojTrenutnogIgraca()].setText(e.igracNaPotezu().getPoeniUOvojIgri()+" \n "+e.igracNaPotezu().getBrPoena());
				if (e.igracNaPotezu() instanceof Racunar)
					textUChatu+=" Nosi: Igrac "+e.redniBrojTrenutnogIgraca()+". \n Na potezu je: Igrac "+e.redniBrojTrenutnogIgraca()+" \n";
				else{
					textUChatu+=" Nosite Vi. \n Vi ste na potezu \n";
				}	
				chat.setText(textUChatu);			
			}
			
			if (e.krajIgre())
				krajIgre();
			else{
				rez[e.redniBrojTrenutnogIgraca()].setBackground(Color.red);
				
				if (e.igracNaPotezu() instanceof Racunar){
					for (int i = 0; i <8; i++) {
						karte[i].setEnabled(false);
					}
					
				}
				time=0;
				timer.start();
				
			}	

			
		}
		else{
			e.igracNaPotezu();
			obavestenje.setText(znakRuke+".  Izbacite kartu u znaku "+Igrac.getTrenutnaIgra().getZnak());
		}
	}
	
	void odigrajPotez(){
		
			e.odigrajPotez(8);
			e.igracNaPotezu();
			e.igracNaPotezu();
			if (Igrac.getTrenutnaIgra()!=null && Igrac.getTrenutnaIgra().getBrKarataNaTalonu()==1){
				znakRuke="Igra se u znaku: "+e.igracNaPotezu().getTalon().getZnak();
				obavestenje.setText(znakRuke);	
			}
			textUChatu+=" Igrac "+e.redniBrojTrenutnogIgraca()+" je odigrao potez. \n Izbacio je "+e.igracNaPotezu().getTalon().getZnak()+" "+e.igracNaPotezu().getTalon().getBroj()+" \n";
				
			osveziTalon();
			e.igracNaPotezu().osveziTalon();
			
			chat.setText(textUChatu);
			rez[e.redniBrojTrenutnogIgraca()].setBackground(Color.decode("#008000"));
			if(e.next()){
				znakRuke="";
				if (e.igracNaPotezu() instanceof Racunar)
					textUChatu+=" Nosi: Igrac "+e.redniBrojTrenutnogIgraca()+". \n Na potezu je: Igrac "+e.redniBrojTrenutnogIgraca()+" \n";
				else
					textUChatu+=" Nosite Vi. \n Vi ste na potezu \n";
						
				rez[e.redniBrojTrenutnogIgraca()].setText(e.igracNaPotezu().getPoeniUOvojIgri()+" \n "+e.igracNaPotezu().getBrPoena());
	
				chat.setText(textUChatu);
			}	
			
			if (e.krajIgre())
				krajIgre();
			else{
				rez[e.redniBrojTrenutnogIgraca()].setBackground(Color.red);

				if(e.igracNaPotezu() instanceof Takmicar){
					for (int i = 0; i < 8; i++) {
						if (e.takmicar().getKarta(i)!=null)
							karte[i].setEnabled(true);
						else break;
					}
					obavestenje.setText(znakRuke+".  Odigrajte potez");
					
				}
				time=0;
				timer.start();
			}
			
	}
	void krajIgre(){
		time=0;
		Igrac[] nagrada=e.nagrada();
		if (nagrada[0]!=null)
			nagrada(nagrada);
		e.dodeliPoene();
		for (int i = 0; i <4; i++) {
			rez[i].setText(e.itiIgrac(i).getPoeniUOvojIgri()+" \n "+e.itiIgrac(i).getBrPoena());
			
		}
		if (e.kraj()==true)
			kraj();
		if (e.itiIgrac(e.poslednjiBiraoIgru()) instanceof Racunar){
			textUChatu="Igrac "+e.poslednjiBiraoIgru()+" bira igru! \n Trenutna igra je \n ";
			
			chat.setText(textUChatu);
			
			e.podeliKarte();	
			e.birajIgru(null);
			if (e.odabranaIgra() instanceof Dame){
				textUChatu+=" dame \n";
				ImageIcon img=new ImageIcon(getClass().getResource("/img/dame.png"));
				img=uvecajSliku(img, 60, 60);

				imgTekuceIgre.setIcon(img);
				imgTekuceIgre.setDisabledIcon(img);
				tekucaIgra.setText(opisTekuceIgre[1]);
				igre[e.redniBrojTrenutnogIgraca()][3].setIcon(null);
			}
			else if (e.odabranaIgra() instanceof Max){
				textUChatu+=" maksimum \n";
				ImageIcon img=new ImageIcon(getClass().getResource("/img/max.png"));
				img=uvecajSliku(img, 60, 60);

				imgTekuceIgre.setIcon(img);
				imgTekuceIgre.setDisabledIcon(img);
				tekucaIgra.setText(opisTekuceIgre[5]);

				igre[e.redniBrojTrenutnogIgraca()][1].setIcon(null);
			}
			else if (e.odabranaIgra() instanceof Min){
				textUChatu+=" minimum \n";
				ImageIcon img=new ImageIcon(getClass().getResource("/img/min.png"));
				img=uvecajSliku(img, 60, 60);

				imgTekuceIgre.setIcon(img);
				imgTekuceIgre.setDisabledIcon(img);
				tekucaIgra.setText(opisTekuceIgre[4]);
				igre[e.redniBrojTrenutnogIgraca()][0].setIcon(null);

			}
			
			else if (e.odabranaIgra() instanceof ZacaTref){
				textUChatu+=" zaca tref ne \n";
				ImageIcon img=new ImageIcon(getClass().getResource("/img/zaca.png"));
				img=uvecajSliku(img, 60, 60);

				imgTekuceIgre.setIcon(img);
				imgTekuceIgre.setDisabledIcon(img);
				tekucaIgra.setText(opisTekuceIgre[0]);
				igre[e.redniBrojTrenutnogIgraca()][5].setIcon(null);

			}
			else if (e.odabranaIgra() instanceof SestaRukaIKraljSrce){
				textUChatu+=" kralj srce i sesta ruka \n";
				ImageIcon img=new ImageIcon(getClass().getResource("/img/kraljS.png"));
				img=uvecajSliku(img, 60, 60);

				imgTekuceIgre.setIcon(img);
				imgTekuceIgre.setDisabledIcon(img);
				tekucaIgra.setText(opisTekuceIgre[2]);

				igre[e.redniBrojTrenutnogIgraca()][4].setIcon(null);

			}
			else if (e.odabranaIgra() instanceof SvaSrca){
				textUChatu+=" sva srca \n";
				ImageIcon img=new ImageIcon(getClass().getResource("/img/svaS.png"));
				img=uvecajSliku(img, 60, 60);

				imgTekuceIgre.setIcon(img);
				imgTekuceIgre.setDisabledIcon(img);
				tekucaIgra.setText(opisTekuceIgre[3]);

				igre[e.redniBrojTrenutnogIgraca()][2].setIcon(null);
			}
			chat.setText(textUChatu);
			rez[e.redniBrojTrenutnogIgraca()].setBackground(Color.red);

			
			osveziMojeKarte();
			
		}
		else{
			System.err.print("Ja sam na potezu");
			imgTekuceIgre.setIcon(null);
			tekucaIgra.setText("TEKUCA IGRA:");
			e.podeliKarte();
			for (int k = 0; k < 6; k++) {
				igre[0][k].setEnabled(true);
			}
			textUChatu="Vi birate igru. Trenutna igra je \n ";
			obavestenje.setText("Igra nije odabrana, odaberite igru.");
			for (int k = 0; k < 8; k++) {
				karte[k].setEnabled(false);
			}
			
			rez[e.redniBrojTrenutnogIgraca()].setBackground(Color.red);
			osveziMojeKarte();
			chat.setText(textUChatu);
			
		}
		time=0;
		timer.start();
	}
	
	boolean proveraImena(String string, File f, int i){
		Scanner s;
		String text="";
		boolean flag=true;
		try {
			
			s = new Scanner(f);
			while(s.hasNextLine()){
				String ime=s.nextLine();
				int broj=Integer.parseInt(s.nextLine());
				text+=ime+"\n";
				
				if (ime.equals(string)){
					if(broj>e.takmicar().getBrPoena()){
						broj=e.itiIgrac(i).getBrPoena();
					}
					flag=false;
				}
				text+=broj+"\n";
			}
			s.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (flag==false){
			String path=getClass().getResource("Rezultati.txt")+"";
			try {
				FileWriter file=new FileWriter(path);
				file.write(text);
				file.close();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
		return flag;
		
	}
	
	void kraj(){
		if (ime2.getText()==null)
			ime2.setText("NoName");
		String path=getClass().getResource("Rezultati.txt")+"";
		
		File file=new File(path);
		
		try {
			FileWriter f=new FileWriter(path,true);
			
			if(proveraImena(ime2.getText(),file, 0)){
				f.write(ime2.getText()+"\n");
				f.write(e.takmicar().getBrPoena()+"\n");
			}
			
			int i=1;
			for (; i < 4; i++) {
				if(proveraImena("Igrac"+i,file,i)){
					f.write("Igrac"+i+"\n");
					f.write(e.itiIgrac(i-1).getBrPoena()+"\n");
				}
			}
			
			f.close();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		String s="";
		e.pobednik();
		int mesto=1;
		for (int i = 0; i < 4; i++) {
			if (i!=0 && e.itiIgrac(i).getBrPoena()!=e.itiIgrac(i-1).getBrPoena())
				mesto++;
			if (e.itiIgrac(i) instanceof Racunar)
				s+="Na "+mesto+". mestu: Igrac "+e.itiIgrac(i).getRbIgraca()+" sa osvojenih "+e.itiIgrac(i).getBrPoena()+" poena \n";
			else
				s+="Na "+mesto+".mestu "+ime2.getText()+" sa osvojenih "+e.itiIgrac(i).getBrPoena()+" poena \n";
		}


		new JOptionPane();
		JOptionPane.showConfirmDialog(this, s,"Rang lista",JOptionPane.CLOSED_OPTION);
		s="";
		Scanner scann;
		try {
			scann = new Scanner(file);
			while(scann.hasNextLine()){
				s+=scann.nextLine();
				if (scann.hasNextLine())
					s+=" broj poena: "+scann.nextLine()+"\n";
			}
			scann.close();
		
		} catch (FileNotFoundException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
		
		new JOptionPane();
		JOptionPane.showConfirmDialog(this, s,"Najbolji rezultati",JOptionPane.CLOSED_OPTION);
		
		
		new JOptionPane();
		int odg=JOptionPane.showConfirmDialog(this, " Da li zelite novu partiju?","Kraj igre",JOptionPane.YES_NO_OPTION);
		if (odg==JOptionPane.YES_OPTION){
			e.init();
			inicijalizacija();
		}
		else
			System.exit(0);
	}
	void nagrada(Igrac igraci[]){
		for (int i = 0; i < igraci.length; i++) {
			if (igraci[i]!=null)
			if (igraci[i] instanceof Takmicar) {
				new JOptionPane();
				JOptionPane.showConfirmDialog(this, "Osvojili ste nagradne poene. Dobijate -5 poena","Nagrada", JOptionPane.CLOSED_OPTION);
			} else {
				new JOptionPane();
				JOptionPane.showConfirmDialog(this, "Igrac "+igraci[i].getRbIgraca()+" je osvoio nagradne poene. Dobio je -5 poena","Nagrada",JOptionPane.CANCEL_OPTION);
			}
		}
	}

	
	
	ImageIcon uvecajSliku(ImageIcon image, int w, int h){
		Image img=image.getImage();
		Image resizedImage = img.getScaledInstance(w,h,java.awt.Image.SCALE_SMOOTH);
	    
		image=new ImageIcon(resizedImage);	
		return image;
	}

}