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

namespace Mobilna_Telefonija
{
    /// <summary>
    /// Interaction logic for Korisnij.xaml
    /// </summary>
    public partial class Korisnik : Window
    {
        TelefonijaDataContext db;
        MainWindow w;
        public Korisnik(TelefonijaDataContext db, MainWindow v)
        {
            w = v;
            this.db = db;
            InitializeComponent();
            datum.SelectedDate = DateTime.Now;
        }

    

        private void button_Click_1(object sender, RoutedEventArgs e)
        {
            string i = ime.Text;
            string a = adresa.Text;
            DateTime d = (DateTime)datum.SelectedDate;
            korisnik k = new korisnik();
            k.ime = i;
            k.adresa = a;
            k.datumRodjenja = d;

            try
            {
                db.korisniks.InsertOnSubmit(k);
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
