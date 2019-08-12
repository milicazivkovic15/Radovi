import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.Image;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class GUI extends JFrame {
	Engine engine;
	MojeDugme matrica[][]=new MojeDugme[10][10];
	int bomba=0;
	JLabel lbl[]=new JLabel[4];
	int hided;
	GUI(){
		setBounds(0, 0, 400, 400);
		setLayout(new FlowLayout());
		for (int i = 0; i < 10; i++) {
			for (int j = 0; j < 10; j++) {
				matrica[i][j]=new MojeDugme(i, j);
				matrica[i][j].setPreferredSize(new Dimension(24, 24));
				matrica[i][j].setEnabled(true);
				matrica[i][j].addMouseListener(new MouseListener() {
					
					@Override
					public void mouseReleased(MouseEvent e) {
						// TODO Auto-generated method stub
						
					}
					
					@Override
					public void mousePressed(MouseEvent e) {
						if (SwingUtilities.isRightMouseButton(e)){
							if (!matrica[((MojeDugme)e.getSource()).i][((MojeDugme)e.getSource()).j].flag ) {
								if ( bomba<engine.brMine ) {
									Icon img=new ImageIcon(new ImageIcon("src/slike/flag.png").getImage().getScaledInstance(24, 24, Image.SCALE_DEFAULT));
									((MojeDugme)e.getSource()).setIcon(img);
									((MojeDugme)e.getSource()).setDisabledIcon(img);
									bomba++;
									matrica[((MojeDugme)e.getSource()).i][((MojeDugme)e.getSource()).j].flag=true;
									lbl[1].setText(bomba+"");
									lbl[3].setText(engine.brMine-bomba+"");
									if (engine.pobedio(((MojeDugme)e.getSource()).i,((MojeDugme)e.getSource()).j)==true){
										kraj();
									}
								}
							}
							else {
								matrica[((MojeDugme)e.getSource()).i][((MojeDugme)e.getSource()).j].flag=false;	
								((MojeDugme)e.getSource()).setIcon(null);
								bomba--;
								engine.resetZastave(((MojeDugme)e.getSource()).i,((MojeDugme)e.getSource()).j);
								lbl[1].setText(bomba+"");
								lbl[3].setText(engine.brMine-bomba+"");
								

							}
						}
						if (SwingUtilities.isLeftMouseButton(e)){
							if (engine.daLiJeKraj(((MojeDugme)e.getSource()).i,((MojeDugme)e.getSource()).j,hided-1)){
								kraj();
							}
							else
								otvoriBroj(((MojeDugme)e.getSource()).i,((MojeDugme)e.getSource()).j);
						}
						
					}
					
					@Override
					public void mouseExited(MouseEvent e) {
						// TODO Auto-generated method stub
						
					}
					
					@Override
					public void mouseEntered(MouseEvent e) {
						// TODO Auto-generated method stub
						
					}
					
					@Override
					public void mouseClicked(MouseEvent e) {
						// TODO Auto-generated method stub
						
					}
				});
			}
		}

		izgled();
		inicijalizacija();
		
		
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		setVisible(true);
	}
	void izgled(){
		lbl[0]=new JLabel("Broj pogodjenih bombica:");
		lbl[2]=new JLabel("Broj preostalih bombica");
		lbl[1]=new JLabel("0");
		lbl[3]=new JLabel( );
		JPanel p2=new JPanel(new GridLayout(2, 2));
		for (int i = 0; i < 4; i++) {
			p2.add(lbl[i]);
		}
		getContentPane().add(p2);
		JPanel p=new JPanel(new GridLayout(10, 10));
		for (int i = 0; i < 10; i++) {
			for (int j = 0; j < 10; j++) {
				p.add(matrica[i][j]);
			}
		}
		getContentPane().add(p);
	}
	void inicijalizacija(){
		hided=matrica.length*matrica.length;
		engine=new Engine();
		for (int i = 0; i <10; i++) {
			for (int j = 0; j <10; j++) {
				matrica[i][j].setEnabled(true);
				matrica[i][j].setIcon(null);
				matrica[i][j].setBackground(null);
				matrica[i][j].shown=false;
				matrica[i][j].flag=false;
			}
		}
		lbl[1].setText("0");
		lbl[3].setText(engine.brMine+"" );
		bomba=0;
	}
	void kraj(){
		for (int i = 0; i <10; i++) {
			for (int j = 0; j < 10; j++) {
				if (engine.matrica[i][j]==-1){
					Icon img=new ImageIcon(new ImageIcon("src/slike/bomb.png").getImage().getScaledInstance(24, 24, Image.SCALE_DEFAULT));
					matrica[i][j].setIcon(img);
				}
			}
		}
		int odg= new JOptionPane().showConfirmDialog(this,"Kraj. Oces opet?","Kraj",JOptionPane.YES_NO_OPTION);
		if (odg==JOptionPane.YES_OPTION){
			inicijalizacija();
		}
		else
			System.exit(0);
	}
	
	void otvoriBroj(int i, int j){
		int br=0;
		
		if (i<10 && j<10 && i>-1 && j>-1 && !matrica[i][j].shown ) {
			if (engine.matrica[i][j]>0){
				matrica[i][j].shown=true;
				hided--;
				if (engine.pobedio(hided)){
					kraj();
				}
				Icon img=new ImageIcon(new ImageIcon("src/slike/"+engine.matrica[i][j]+".png").getImage().getScaledInstance(24, 24, Image.SCALE_DEFAULT));
				matrica[i][j].setIcon(img);
				matrica[i][j].setDisabledIcon(img);
			}
			else  {
				matrica[i][j].shown=true;
				hided--;
				matrica[i][j].setBackground(Color.white);
				matrica[i][j].setEnabled(false);
				
					otvoriBroj(i+1, j);
					otvoriBroj(i-1, j);
					otvoriBroj(i, j+1);
					otvoriBroj(i, j-1);
					

					otvoriBroj(i+1, j+1);
					otvoriBroj(i+1, j-1);
					otvoriBroj(i-1, j+1);
					otvoriBroj(i-1, j-1);
				
			}	
			matrica[i][j].setEnabled(false);
		}
	}
}
