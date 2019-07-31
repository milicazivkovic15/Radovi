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
using System.Windows.Shapes;

namespace MilicaZivkovic
{
    /// <summary>
    /// Interaction logic for Telefon.xaml
    /// </summary>
    public partial class Telefon : Window
    {
        TelefonijaDataContext db;
        MainWindow w;
        public Telefon(TelefonijaDataContext db, MainWindow v)
        {
            w = v;
            this.db = db;
            InitializeComponent();
            ucitaj();

        }
        void ucitaj() {
            var a = from k in db.korisniks
                    select k;
            comboBox.ItemsSource = a;
            comboBox.SelectedIndex = 0;
            bool bul = false;
            var a1 = from t in db.karticas
                     select t;
            ComboBoxItem cb;
            var tt = from tel in db.telefons
                     select tel;

            foreach (var item in a1)
            {
                bul = false;
                foreach (var item1 in tt)
                {

                    if (item.id == item1.idkartice) {
                        bul = true;
                        break;
                    }
                    
                }
                if (bul == false) {
                
                    comboBox1.Items.Add(item.broj);
                }
            }

            
            comboBox1.SelectedIndex = 0;

        }

        private void button_Click(object sender, RoutedEventArgs e)
        {
            string m = marka.Text;
           
            var a = from t in db.karticas
                    where t.broj == comboBox1.SelectedItem.ToString()
                    select t;
            var aa = from t2 in db.korisniks
                     where t2.ime == (comboBox.SelectedItem as korisnik).ime
                     select t2;
            telefon tel = new telefon();
            tel.marka = m;
            tel.idKorisnika = aa.First().id;
            tel.idkartice = a.FirstOrDefault().id;

            try
            {
                db.telefons.InsertOnSubmit(tel);
                db.SubmitChanges();
            }
            catch (Exception)
            {

                throw;
            }
            w.ucitaj();
            Close();
            
        }

        
    }
}
