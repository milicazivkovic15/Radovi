using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Microsoft.Win32;
using System.IO;
using System.Collections;

namespace RecnikWPF {

    public class Par<Kljuc, Vrednost> where Kljuc:class,IEquatable<Kljuc> where Vrednost:class,IEquatable<Vrednost> {
        Kljuc k;
        Vrednost v;

        public Kljuc K
        {
            get
            {
                return k;
            }

            set
            {
                k = value;
            }
        }

        public Vrednost V
        {
            get
            {
                return v;
            }

            set
            {
                v = value;
            }
        }

        public Par(Kljuc kk, Vrednost vv) {
            v = vv;
            k = kk;
        }

        public override string ToString()
        {
            return k+"\t"+v;
        }
    }


    public class Recnik<Kljuc, Vrednost>:IEnumerable where Kljuc : class, IEquatable<Kljuc> where Vrednost : class, IEquatable<Vrednost>
    {
        public delegate void hendlerDogadjaja(int vrednost);
        public delegate bool delegat(Par<Kljuc, Vrednost> par);


        List<Par<Kljuc, Vrednost>> parovi;
        event hendlerDogadjaja dogadjaj1;

        public hendlerDogadjaja Dogadjaj{
            get{
                return dogadjaj1;            
            }
            set {
                dogadjaj1 += value;
            }
        }

        
        public Recnik() {
            parovi = new List<Par<Kljuc, Vrednost>>();
        }

        public void Dodaj(Kljuc kk, Vrednost vv) {

            foreach (var item in parovi)
            {
                if (item.K == kk) {
                    item.V = vv;
                    return;
                }
            }
            parovi.Add(new Par<Kljuc,Vrednost>(kk, vv));
           if(dogadjaj1!=null)
            dogadjaj1(parovi.Count);
        }

        public IEnumerator GetEnumerator()
        {
            for (int i = 0; i < parovi.Count; i++)
            {
                yield return this[parovi[i].K];
            }
        }

        public Vrednost this[Kljuc kk] {
            get {
                foreach (var item in parovi)
                {
                    if (item.K == kk)
                    {
                        
                        return item.V;
                    }
                }
                return null;
            }
            set {
                foreach (var item in parovi)
                {
                    if (item.K == kk)
                    {
                        item.V = value;
                        return;
                    }
                }
            }
        }

        public static Recnik<Kljuc, Vrednost> operator +(Recnik<Kljuc, Vrednost> r1, Recnik<Kljuc, Vrednost> r2) {
            Recnik<Kljuc, Vrednost> r=new Recnik<Kljuc,Vrednost>();
            foreach (var item in r1.parovi)
            {
                r.Dodaj(item.K, item.V);
            }
            foreach (var item in r2.parovi)
            {
                r.Dodaj(item.K, item.V);
            }
            return r;
        }

        public IEnumerable<Par<Kljuc, Vrednost>> Filtriraj(delegat fja) {
            List<Par<Kljuc, Vrednost>> lista = new List<Par<Kljuc, Vrednost>>();
            foreach (var item in parovi)
            {

                if (fja(item)==true)
                {
                        lista.Add(item);
                }
            }
            return lista;
        }
    }

    public class Student : IEquatable<Student>
    {
        string ime;
        string index;
        int brojPolozenihIspita;
        float prosek;

        public int BrojPolozenihIspita
        {
            get
            {
                return brojPolozenihIspita;
            }

            set
            {
                brojPolozenihIspita = value;
            }
        }

        public float Prosek
        {
            get
            {
                return prosek;
            }

            set
            {
                prosek = value;
            }
        }

        public string Index
        {
            get
            {
                return index;
            }

            set
            {
                index = value;
            }
        }

        public Student(string ind,string i, int br, float pros)
        {
            ime = i;
            Index = ind;
            BrojPolozenihIspita = br;
            Prosek = pros;
        }
        public bool Equals(Student other)
        {
           
            if (Index == other.Index)
                return true;
            return false;
        }

        public override string ToString()
        {
            return Index + " " + ime + " " + BrojPolozenihIspita + " " + Prosek + "\n";
        }
        public static implicit operator string(Student s) {
            return s.index;
        }
    }


    public partial class MainWindow : Window
    {
       
        Recnik<string, Student> informatika = new Recnik<string, Student>();
        Recnik<string, Student> matematika = new Recnik<string, Student>();
        public MainWindow()
        {

            InitializeComponent();
            informatika.Dogadjaj = brojStudenataInf;
            matematika.Dogadjaj = brojStudenataMat;
        }

        private void button_Click(object sender, RoutedEventArgs e)
        {
            new Proba().Show();
            Close();
        }

        private void button_DodajIzFajla_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog o = new OpenFileDialog();

            if (o.ShowDialog()==true) {
                StreamReader s = new StreamReader(o.FileName);
                string linija;
                while (!s.EndOfStream) {
                    linija = s.ReadLine();
                    string[] vred = linija.Split(',');
                    if (vred[4] == "informatika") 
                        informatika.Dodaj(vred[0], new Student(vred[0], vred[1],  int.Parse(vred[2]), float.Parse(vred[3])));
                    
                    else
                        matematika.Dodaj(vred[0], new Student(vred[0], vred[1], int.Parse(vred[2]), float.Parse(vred[3])));
                    
                }
            }
            osveziListu();
        }

        void osveziListu() {
            listBox_Informatika.Items.Clear();
            listBox_Matematika.Items.Clear();
            foreach (var item in informatika)
            {
                listBox_Informatika.Items.Add(item);
            }
            foreach (var item in matematika)
            {
                listBox_Matematika.Items.Add(item);
            }

        }

        private void button_Dodaj_Click(object sender, RoutedEventArgs e)
        {
            if (radioButton_Informatika.IsChecked==true) {
                informatika.Dodaj(textBox_brojIndeksa.Text, new Student(textBox_brojIndeksa.Text, textBox_ImeIPrezime.Text, int.Parse(textBox_BrojPolozenihIspita.Text), float.Parse(textBox_Prosek.Text)));
            }
            else
                matematika.Dodaj(textBox_brojIndeksa.Text, new Student(textBox_brojIndeksa.Text, textBox_ImeIPrezime.Text, int.Parse(textBox_BrojPolozenihIspita.Text), float.Parse(textBox_Prosek.Text)));
            osveziListu();
        }

        private void buttonPrikaziStudentaMatematike_Click(object sender, RoutedEventArgs e)
        {
            foreach (var item in matematika)
            {
                if (((Student)item).Equals(new Student(textBoxindeksMatematika.Text, "", 0, 0))) {
                    textBlockPrikazMatematika.Text = item.ToString();
                    return;
                }
            }
        }

        private void buttonPrikayiStudentaInformatike_Click(object sender, RoutedEventArgs e)
        {
            foreach (var item in informatika)
            {
               
                if (((Student)item).Equals(new Student(textBoxIndeksInformatika.Text, "", 0, 0)))
                {
                    textBlockInformatika.Text = item.ToString();
                    return;
                }
            }
        }

        public void brojStudenataInf(int br) {
            label_BrojStudenataNaInformatici.Content =br;
        }
        public void brojStudenataMat(int br)
        {
            label_BrojStudenataNaMatematici.Content = br;
        }

        private void comboBox_IzborOpcijePrikaza_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            listBox_Rezultat.Items.Clear();
            IEnumerable<Par<string, Student>> r;
            switch (comboBox_IzborOpcijePrikaza.SelectedIndex)
            {
                
                case 0:
                    Recnik<string, Student> recnik = matematika + informatika;
                   
                    foreach (var item in recnik)
                    {
                        listBox_Rezultat.Items.Add(item);
                    }
                    
                    break;
                case 1:
                     r = informatika.Filtriraj(filt);
                    foreach (var item in r)
                    {
                        listBox_Rezultat.Items.Add(item.V);
                    }
                    break;
                case 2:
                    r = matematika.Filtriraj(filt1);
                    foreach (var item in r)
                    {
                        listBox_Rezultat.Items.Add(item.V);
                    }
                    break;
                case 3:
                    string index;
                    foreach (var item in matematika)
                    {
                        index = (Student)item;
                        listBox_Rezultat.Items.Add(index);
                    }
                    break;
                default:
                    break;
            }
        }

        public bool filt(Par<string,Student> par)
        {
           
            if (par.V.Prosek > 7.5 && par.V.BrojPolozenihIspita >= 10)
                return true;
            return false;
        }
        public bool filt1(Par<string, Student> par)
        {
            
            if (int.Parse(par.V.Index.Split('/')[1]) >2012  && par.V.Prosek > 8)
                return true;
            return false;
        }
    }

}
