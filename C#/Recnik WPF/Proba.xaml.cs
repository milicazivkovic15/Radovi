using System;
using System.Collections;
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
using System.Windows.Shapes;

namespace RecnikWPF
{

    public class ListaStudenata<T> : IEnumerable where T : class
    {
        T s;
        ListaStudenata<T> next;

        public ListaStudenata(T s)
        {
            this.s = s;
        }

        public ListaStudenata<T> Next
        {
            get
            {
                return next;
            }

            set
            {
                next = value;
            }
        }

        public T S
        {
            get
            {
                return s;
            }

            set
            {
                s = value;
            }
        }

        public T this[int index]
        {
            get
            {
                ListaStudenata<T> ls = this;
                int br = 0;

                while (br++ != index && ls != null)
                {
                    ls = ls.Next;
                }
                if (ls != null)
                    return ls.s;
                return null;
            }
            set
            {
                S = value;
            }
        }

        public int Count
        {
            get
            {
                ListaStudenata<T> ls = this;
                int br = 0;

                while (ls != null)
                {
                    ls = ls.Next;
                    br++;
                }
                return br;
            }
        }

        public IEnumerator GetEnumerator()
        {
            for (int i = 0; i < Count; i++)
            {
                yield return this[i];
            }
        }


        public void Add(T student)
        {
            ListaStudenata<T> ls = new ListaStudenata<T>(student);
            ListaStudenata<T> lista = this;

            while (lista.Next != null)
            {
                lista = lista.Next;
            }
            lista.Next = ls;

        }

        public bool Delete(T student)
        {
            ListaStudenata<T> lista = this;
            if (lista.S.Equals(student))
            {
                S = lista.Next.S;
                lista.Next = lista.Next.Next;
                return true;
            }
            while (lista.Next != null)
            {
                if (lista.Next.S.Equals(student))
                {
                    lista.Next = lista.Next.Next;
                    return true;
                }
                lista = lista.Next;
            }
            return false;

        }

        public T Find(string jmbg)
        {
            if (s is Studenti)
            {

                for (int i = 0; i < Count; i++)
                {
                    if (this[i].Equals(new Studenti("", "", jmbg, 0)))
                        return this[i];
                }

            }
            else
            {
                for (int i = 0; i < Count; i++)
                {
                    if (this[i].Equals(new Zaposlen(jmbg, 0)))
                        return this[i];
                }

            }
            return null;
        }


    }


    public class  Studenti
    {

        string index;
        string upisan;
        string jmbg;
        int godine;

        public int Godine
        {
            get
            {
                return godine;
            }

            set
            {
                godine = value;
            }
        }

        public string Jmbg
        {
            get
            {
                return jmbg;
            }

            set
            {
                jmbg = value;
            }
        }

        public Studenti(string i, string u, string j, int g)
        {
            index = i;
            upisan = u;
            Jmbg = j;
            Godine = g;
        }
        public override bool Equals(object st)
        {
            Studenti s = (Studenti)st;
            if ((index == s.index && upisan == s.upisan) || jmbg == s.Jmbg)
                return true;
            return false;
        }
        public static int operator +(Studenti s, Zaposlen z)
        {
            return s.Godine + z.Godine;
        }

        public static implicit operator Zaposlen(Studenti s)
        {
            return new Zaposlen(s.Jmbg, s.Godine);
        }
        public override string ToString()
        {
            return "Index\\Upisan: " + index + "\\" + upisan + ", JMBG: " + jmbg + ", Godine: " + godine + "\n";
        }
    }

    public class Zaposlen
    {

        string jmbg;
        int godine;

        public int Godine
        {
            get
            {
                return godine;
            }

            set
            {
                godine = value;
            }
        }

        public string Jmbg
        {
            get
            {
                return jmbg;
            }

            set
            {
                jmbg = value;
            }
        }

        public Zaposlen(string j, int g)
        {
            Jmbg = j;
            Godine = g;
        }
        public static int operator +(Zaposlen z, Studenti s)
        {
            return s.Godine + z.Godine;
        }
        public override bool Equals(object obj)
        {
            Zaposlen z = (Zaposlen)obj;
            if (Jmbg == z.Jmbg)
                return true;
            return false;
        }

        public override string ToString()
        {
            return "JMBG: " + jmbg + ", Godine: " + godine + " \n";
        }

    }
    /// <summary>
    /// Interaction logic for Proba.xaml
    /// </summary>
    public partial class Proba : Window
    {
        public delegate void hendlerZaDogadjaj(int godine);

        ListaStudenata<Studenti> ls;
        ListaStudenata<Zaposlen> lz;
        event  hendlerZaDogadjaj dogadjaj;
        public Proba()
        {
            InitializeComponent();
            dogadjaj += ispisiGodine;
        }

        public void ispisiGodine(int godine) {
            if (godine == 21) {
                MessageBox.Show("EVENT");
            }
        }

        private void button_Click(object sender, RoutedEventArgs e)
        {
            if (ls == null)
                ls = new ListaStudenata<Studenti>(new Studenti(index.Text, upisan.Text, jmbg.Text, int.Parse(godine.Text)));
            else
                ls.Add(new Studenti(index.Text, upisan.Text, jmbg.Text, int.Parse(godine.Text)));

            string st="";
            foreach (var item in ls)
            {
                st += item;
            }
            dogadjaj(int.Parse(godine.Text));
            MessageBox.Show(st);
        }

        private void button1_Click(object sender, RoutedEventArgs e)
        {
            if (ls != null){
                Studenti s = ls.Find(jmbg.Text);
            
                if (s != null)
                {
                    MessageBox.Show(s + " uspesno zaposlen! :) ");
                    Zaposlen z = s;
                    ls.Delete(s);
                    if (lz == null)
                        lz = new ListaStudenata<Zaposlen>(z);
                    else
                        lz.Add(z);


                    string st = "";
                    foreach (var item in lz)
                    {
                        st += item;
                    }

                    MessageBox.Show(st);
                }
            }
            else {
                MessageBox.Show("Takav student ne postoji");
            }
            
        }

        private void button2_Click(object sender, RoutedEventArgs e)
        {
            if (ls != null){
                Studenti s = ls.Find(jmbgS.Text);
                Zaposlen z = lz.Find(jmbgZ.Text);
                if (s != null)
                {
                    if (z != null)
                    {
                        int br = s + z;
                        br_godina.Content = br;
                        br = z + s;
                        MessageBox.Show(br + "");
                    }
                    else {
                        MessageBox.Show("Takav zaposlen ne postoji");
                    }
                 }
            }
            else {
                MessageBox.Show("Takav student ne postoji");
                if (z == null)
                   MessageBox.Show("Takav zaposlen ne postoji");
            }
            
        }
    }
}
