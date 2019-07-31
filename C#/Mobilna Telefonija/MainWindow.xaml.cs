using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MilicaZivkovic
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        TelefonijaDataContext db = new TelefonijaDataContext();
        public MainWindow()
        {
            InitializeComponent();
            ucitaj();
            osveziListu();
            date.SelectedDate = DateTime.Now;
        }
        public void ucitaj() {
            var a = from k in db.korisniks
                    select k;
            comboBox_Korisnik.ItemsSource = a;
            comboBox_Korisnik.SelectedIndex = 0;

            var a1 = from s in db.saobracajs
                     select s.tipSaobracaja;

            comboBox_saobracaj.ItemsSource = a1.Distinct();
            comboBox_saobracaj.SelectedIndex = 0;


        }


        void osveziListu() {
            var a = from k in db.korisniks
                    join t in db.telefons
                     on k.id equals t.idKorisnika
                    join ka in db.karticas
                    on t.idkartice equals ka.id
                    join s in db.saobracajs
                    on t.idkartice equals s.idKartice
                    join ts in db.tipSaobracajas
                    on s.idTipaSaobracaja equals ts.id
                    select new klasaListe
                    {
                        korisnik = k.ime,
                        brTel = ka.broj,
                        saobracaj = ts.naziv,
                        ostvSaobracaj = s.ostvareniSaobracaj,
                        datum = s.datum
                    };

            listView.ItemsSource = a;

        }
        private void button_Click(object sender, RoutedEventArgs e)
        {
            string s = novSaobracaj.Text;
            korisnik k = (comboBox_Korisnik.SelectedItem as korisnik);
            kartica broj = (comboBox_broj.SelectedItem as kartica);
            tipSaobracaja tip = (comboBox_saobracaj.SelectedItem as tipSaobracaja);
            saobracaj novi = new saobracaj();
            novi.idKartice = k.id;
            novi.ostvareniSaobracaj = int.Parse(s);
            novi.idTipaSaobracaja = tip.id;
            novi.datum = DateTime.Now;

            try
            {
                db.saobracajs.InsertOnSubmit(novi);
                db.SubmitChanges();
            }
            catch (Exception)
            {

                throw;
            }
            osveziListu();
        }

        private void MenuItem_Click(object sender, RoutedEventArgs e)
        {
            new Kartica(db,this).ShowDialog();
        }

        private void MenuItem_Click_1(object sender, RoutedEventArgs e)
        {
            new Korisnik(db,this).ShowDialog();

        }

        private void MenuItem_Click_2(object sender, RoutedEventArgs e)
        {
            new Telefon(db,this).ShowDialog();
        }

        private void comboBox_Korisnik_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            int a = (comboBox_Korisnik.SelectedItem as korisnik).id;
            var a1 = from t in db.telefons
                     where t.idKorisnika == a
                     select t.kartica;

            comboBox_broj.ItemsSource = a1;
            comboBox_broj.SelectedIndex = 1;

        }

        private void DatePicker_SelectedDateChanged(object sender, SelectionChangedEventArgs e)
        {
            var a = from s in db.saobracajs
                    where s.datum == date.SelectedDate
                    select s;
            int max = 0;
            kartica ss = null; 
            foreach (var item in a)
            {
                if (item.ostvareniSaobracaj > max) {
                    max = item.ostvareniSaobracaj;
                    ss = item.kartica;
                }

            }
            var b = from t in db.telefons
                    select t;
          

            marko.Content = (b.FirstOrDefault(x => x.idkartice == x.id)).korisnik.ime;

        }
    }

    internal class klasaListe
    {
        public string brTel { get; set; }
        public DateTime? datum { get; set; }
        public string korisnik { get; set; }
        public int ostvSaobracaj { get; set; }
        public string saobracaj { get; set; }
    }
}
