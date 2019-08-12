import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

public class GUI extends JFrame{
	JButton dugmici[][]=new JButton[4][4];
	Engine engine=new Engine();
	JButton levo=new JButton();
	JButton desno=new JButton();
	JButton gore=new JButton();
	JButton dole=new JButton();
	JButton nova=new JButton("NOVA");
	JLabel score = new JLabel();
	
	GUI(){
		setBounds(0, 0, 600, 600);
	
		JPanel panel=new JPanel();
		JPanel header= new JPanel(new FlowLayout());
		nova.setPreferredSize(new Dimension(90, 40));
		nova.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				inicijalizacija();
				
			}
		});
		header.add(score);
		header.add(nova);
		panel.add(header);
		add(panel,BorderLayout.NORTH);
		JPanel p=new JPanel(new GridLayout(4, 4));
		for (int i = 0; i <4; i++) {
			for (int j = 0; j < 4; j++) {
				dugmici[i][j]=new JButton();
				dugmici[i][j].setEnabled(false);
				dugmici[i][j].setPreferredSize(new Dimension(94, 100));
				p.add(dugmici[i][j]);
			}
		}
		
		add(p, BorderLayout.CENTER);
		
		
		JPanel p2=new JPanel(new BorderLayout());
		Icon img= new ImageIcon("src/slike/gore.png");
		gore.setIcon(img);
		 img= new ImageIcon("src/slike/dole.png");
		dole.setIcon(img);
		 img= new ImageIcon("src/slike/levo.png");
		levo.setIcon(img);
		 img= new ImageIcon("src/slike/desno.png");
		desno.setIcon(img);
		

		JPanel p3=new JPanel(new FlowLayout(FlowLayout.CENTER, 60, 20));
		p3.add(levo);
		p3.add(dole);
		p3.add(desno);
		JPanel p4=new JPanel(new FlowLayout());
		p4.add(gore);
		
		p2.add(p4,BorderLayout.NORTH);
		p2.add(p3,BorderLayout.SOUTH);
		
		
		add(p2, BorderLayout.SOUTH);
		gore.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				if (engine.odigrajPotez(0)==false)
					kraj();
				osvezi();
			}
		});
		dole.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				if (engine.odigrajPotez(1)==false)
					kraj();
				osvezi();
			}
		});
		levo.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				if (engine.odigrajPotez(2)==false)
					kraj();
				osvezi();
			}
		});
		desno.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent arg0) {
				if (engine.odigrajPotez(3)==false)
					kraj();
				osvezi();
			}
		});
		
		
		inicijalizacija();
		
		setVisible(true);
		setDefaultCloseOperation(EXIT_ON_CLOSE);
	}
	void inicijalizacija(){
		osvezi();
	}
	void osvezi(){
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j < 4; j++) {
				if(engine.matrica[i][j]!=null){
					Icon img= new ImageIcon("src/slike/"+(int)Math.pow(2,engine.matrica[i][j].stepen)+".PNG");
					dugmici[i][j].setIcon(img);
					dugmici[i][j].setDisabledIcon(img);
			}
				else{
					Icon img= new ImageIcon("src/slike/1.png");
					dugmici[i][j].setIcon(img);
					dugmici[i][j].setDisabledIcon(img);				
				}
									
			}
		}
		score.setText("Skor: "+ (int)Math.pow(2,engine.score));
	}
	void kraj(){
		int odg=JOptionPane.showConfirmDialog(this, "Izgubili ste! Zelite li ponovo","Kraj",JOptionPane.YES_NO_OPTION);
		if (odg==JOptionPane.YES_OPTION){
			inicijalizacija();
		}
		else
			System.exit(0);
	}
}
