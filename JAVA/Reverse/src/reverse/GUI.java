package reverse;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Graphics;
import java.awt.GridLayout;
import java.awt.dnd.MouseDragGestureRecognizer;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

public class GUI extends JFrame {
	Engine engine=new Engine(false, Boja.CRNA);
	MojeDugme tabela[][]=new MojeDugme[8][8];
	JLabel lblSkorCrni,lblskorCrveni, lblnaPotezu;
	JButton reset;
	JPanel centar, dole, desno;
	Boja naPotezu;
	JButton nova=new JButton("Nova");
	ImageIcon img = new ImageIcon("src/reverse/slike/4.png");
	
	
	GUI(){
		super("REVERSI");
		
		setBounds(0, 0, 600, 600);
		setLayout(new BorderLayout());
		
		Centar();
		Desno();
		Dole();
		
		init(Boja.CRNA);
		
		setVisible(true);
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		
	}
	void init(Boja naPoetezu){	
		engine.inicijalizacija(false, naPoetezu);

		osvezi();
	
	}
	void osvezi(){
		ImageIcon img1;
		
		for (int i = 0; i <8; i++) {
			for (int j = 0; j <8; j++) {
				img1=new ImageIcon("src/reverse/slike/9.png");
				tabela[i][j].setDisabledIcon(img1);	
				tabela[i][j].setIcon(img1);
				if (engine.tabla[i][j].boja==Boja.CRNA){
					img1= new ImageIcon("src/reverse/slike/6.png");
					tabela[i][j].setIcon(img1);
					tabela[i][j].setDisabledIcon(img1);	
				}
				else if(engine.tabla[i][j].boja==Boja.CRVENA){
					img1 = new ImageIcon("src/reverse/slike/7.png");
					tabela[i][j].setIcon(img1);
					tabela[i][j].setDisabledIcon(img1);	
				}
				
					tabela[i][j].setIcon(img1);
					tabela[i][j].setDisabledIcon(img1);	
				
			
				
				
				tabela[i][j].setEnabled(false);
				

			}
		}
		Polje[] polja=engine.mogucaPolja();
		if (engine.brojPoteza==0){
			
			Boja suprotna;
			if (engine.naPotezu==Boja.CRNA)
				 suprotna=Boja.CRVENA;
			else suprotna=Boja.CRNA;
			lblnaPotezu.setText(engine.naPotezu+" nema moguci potez. Na potezu je "+suprotna);
			engine.naPotezu=suprotna;
			polja=engine.mogucaPolja();
			if (engine.brojPoteza==0)
				kraj();
		}
		else
			lblnaPotezu.setText("Na potezu je "+engine.naPotezu);

		if (engine.kraj()) {
			kraj();
		}
		for (int i = 0; i < engine.brojPoteza; i++) {
			tabela[polja[i].i][polja[i].j].setIcon(img);

			tabela[polja[i].i][polja[i].j].setEnabled(true);
			
		}
		lblskorCrveni.setText("SKOR CRVENI "+engine.skorCrveni);
		lblSkorCrni.setText("SKOR CRNI "+engine.skorCrni);
		
	}
	void Centar(){
		centar= new JPanel(new GridLayout(8, 8,2,2));
		for (int i = 0; i < 8; i++) {
			for (int j = 0; j < 8; j++) {
				tabela[i][j]=new MojeDugme(i, j);
				tabela[i][j].setPreferredSize(new Dimension(64,64));
				tabela[i][j].setBackground(Color.green);
				centar.add(tabela[i][j]);
				
				tabela[i][j].addActionListener(new ActionListener() {
				
					@Override
					public void actionPerformed(ActionEvent e) {
						// TODO Auto-generated method stub
						engine.odigrajPotez(((MojeDugme)e.getSource()).i, ((MojeDugme)e.getSource()).j, engine.mogucaPolja());
						osvezi();
					}
				});
			}
		}
		centar.validate();
		centar.repaint();
		centar.setBackground(Color.green);
		getContentPane().add(centar, BorderLayout.CENTER);
	}
	void Desno(){
		desno=new JPanel(new GridLayout(5, 1));
		
		lblskorCrveni= new JLabel("Skor CRVERNI "+engine.skorCrveni);
		lblSkorCrni= new JLabel("Skor CRNI "+engine.skorCrni);
		
		desno.add(lblskorCrveni);
		desno.add(lblSkorCrni);
		nova.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				init(Boja.CRNA);
			}
		});
		desno.add(nova);
		getContentPane().add(desno, BorderLayout.EAST);
	}
	void Dole(){
		dole=new JPanel();
		lblnaPotezu= new JLabel("Na potezu je "+engine.naPotezu);
		
		dole.add(lblnaPotezu);
		getContentPane().add(dole,BorderLayout.SOUTH);
	}
	void kraj(){
		String pobednik="";
		if (engine.skorCrveni>engine.skorCrni)
			pobednik="CRVENI";
		else
			pobednik="CRNI";
		int odg=JOptionPane.showConfirmDialog(this, "Pobedio je "+pobednik+". Da li zelite novu partiju ","Kraj",JOptionPane.YES_NO_OPTION);
		if (odg==JOptionPane.YES_OPTION){
			init(Boja.CRNA);
		}
		else
			System.exit(0);
	

	}
	
}
