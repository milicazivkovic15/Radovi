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
    /// Interaction logic for Kartica.xaml
    /// </summary>
    public partial class Kartica : Window
    {
        MainWindow w;
        TelefonijaDataContext db;
        public Kartica(TelefonijaDataContext db, MainWindow v)
        {
            w = v;
            this.db = db;
            InitializeComponent();
        }

        private void button_Click(object sender, RoutedEventArgs e)
        {
            string s = broj.Text;
            string o = operater.Text;
            kartica k = new kartica();
            k.broj = s;
            k.operater = o;
            try
            {
                db.karticas.InsertOnSubmit(k);
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
