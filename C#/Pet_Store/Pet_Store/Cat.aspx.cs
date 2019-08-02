using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Pet_Store
{

    public partial class Cat : System.Web.UI.Page
    {
        DataClasses1DataContext db = new DataClasses1DataContext();

        protected void Page_Load(object sender, EventArgs e)
        {

        }



        protected void dodaj_Click(object sender, EventArgs e)
        {
            if (izborVlasnika.Items.Count > 0)
            {
                if (name.Text == "" || age.Text == "")
                {
                    error.Text = "Insert values!";
                    return;
                }
                var a = from pe in db.pets
                        select pe.pet_id;
                pet p = new pet();
                p.name = name.Text;
                p.age = int.Parse(age.Text);
                p.description = desc.Text;
                p.owner_id = int.Parse(izborVlasnika.SelectedValue);
                p.type_id = 1;
                p.pet_id = a.Max() + 1;
                db.pets.InsertOnSubmit(p);
                db.SubmitChanges();
                Response.Redirect(Request.RawUrl);
            }
            else
            {
                error.Text = "Insert a owner first";
                Response.Redirect("Owner.aspx");
            }
        }


        protected void izborLjubimca_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (izborLjubimca.Items.Count > 0)
            {
                int id = int.Parse(izborLjubimca.SelectedValue);
                var a = from p in db.pets
                        where p.pet_id == id
                        select new
                        {
                            des = p.description,
                            ownf = p.owner.fname,
                            ownl = p.owner.lname
                        };
                var aa = a.FirstOrDefault();
                description.Text = aa.des;
                own.Text = aa.ownf + " " + aa.ownl;
            }
        }


        protected void izmeni_Click(object sender, EventArgs e)
        {
            if (izborLjubimca.Items.Count > 0)
            {
                int id = int.Parse(izborLjubimca.SelectedValue);
                var a = from p in db.pets
                        where p.pet_id == id
                        select p;
                var pet = a.FirstOrDefault();
                pet.description = description.Text;
                db.SubmitChanges();
                Response.Redirect(Request.RawUrl);
            }
        }
        protected void obrisi_Click(object sender, EventArgs e)
        {
            if (izborLjubimca.Items.Count > 0)
            {
                int id = int.Parse(izborLjubimca.SelectedValue);
                var a = from p in db.pets
                        where p.pet_id == id
                        select p;
                var pet = a.FirstOrDefault();
                db.pets.DeleteOnSubmit(pet);
                db.SubmitChanges();
                Response.Redirect(Request.RawUrl);
            }
        }
    }
}