package zmija2014;

import java.awt.Color;
import java.awt.GridLayout;
import java.awt.KeyEventDispatcher;
import java.awt.KeyboardFocusManager;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;


import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JTextField;
import javax.swing.Timer;

public class GUI extends JFrame  implements  KeyEventDispatcher {
	JButton dugmici[][]=new JButton[15][15];
	Engine logika=new Engine();
	int SMER;
	Timer t;
	
	
	GUI(){
		setBounds(0, 0, 700, 700);
		setLayout(new GridLayout(15, 15));
		SMER=logika.zmija.smer;
		KeyboardFocusManager manager = KeyboardFocusManager.getCurrentKeyboardFocusManager();
	    manager.addKeyEventDispatcher(this);
	   
		
		for (int i = 0; i < 15; i++) {
			for (int j = 0; j < 15; j++) {
				dugmici[i][j]=new JButton();
				dugmici[i][j].setEnabled(false);
				
			}
		}
		
		for (int i = 0; i <15; i++) {
			for (int j = 0; j <15; j++) {
				getContentPane().add(dugmici[i][j]);
			}
		}
		osveziGui();
		 t= new Timer(500, new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) 
			{
				if (logika.pomeriZmijicu(SMER)==false){
					System.exit(0);
				}
				osveziGui();
			}
		});
		
		t.start();
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		setVisible(true);
	}

	void osveziGui(){
		int matrica[][]=new int[15][15];
		matrica=logika.getMatrica();
		for (int i = 0; i < 15; i++) {
			for (int j = 0; j < 15; j++) {
				
				if (matrica[i][j]==3)
					dugmici[i][j].setBackground(Color.black);
				else if(matrica[i][j]==2)
					dugmici[i][j].setBackground(Color.BLUE);
				else if(matrica[i][j]==1)
					dugmici[i][j].setBackground(Color.yellow);
				else
					dugmici[i][j].setBackground(Color.WHITE);
			}
		}
	}
	@Override
	public boolean dispatchKeyEvent(KeyEvent keyEvent) {
		if(keyEvent.getID() == KeyEvent.KEY_PRESSED)
		{
			
			
			if(keyEvent.getKeyCode() == KeyEvent.VK_RIGHT)
			{
				SMER=3;
			}
			else if(keyEvent.getKeyCode() == KeyEvent.VK_LEFT)
			{
				SMER=2;
			}
			else if(keyEvent.getKeyCode() == KeyEvent.VK_UP)
			{
				SMER=0;
			}
			else if(keyEvent.getKeyCode() == KeyEvent.VK_DOWN)
			{
				SMER=1;
			}
			t.start();
		}

		return false;
	}
	
}
