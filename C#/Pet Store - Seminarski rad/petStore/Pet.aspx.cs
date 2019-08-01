using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Pet : System.Web.UI.Page
{
    public DataClassesDataContext Db
    {
        get
        {
            return db;
        }

        set
        {
            db = value;
        }
    }

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
            var a = from pe in Db.pets
                    select pe.pet_id;
            Pet p = new Pet();
            p.name = name.Text;
            p.age = int.Parse(age.Text);
            p.description = desc.Text;
            p.owner_id = int.Parse(izborVlasnika.SelectedValue);
            p.type_id = 0;
            p.pet_id = a.Max() + 1;
            Db.pets.InsertOnSubmit(p);
            Db.SubmitChanges();
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
            var a = from p in Db.pets
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
            var a = from p in Db.pets
                    where p.pet_id == id
                    select p;
            var pet = a.FirstOrDefault();
            pet.description = description.Text;
            Db.SubmitChanges();
            Response.Redirect(Request.RawUrl);
        }
    }
    protected void obrisi_Click(object sender, EventArgs e)
    {
        if (izborLjubimca.Items.Count > 0)
        {
            int id = int.Parse(izborLjubimca.SelectedValue);
            var a = from p in Db.pets
                    where p.pet_id == id
                    select p;
            var pet = a.FirstOrDefault();
            Db.pets.DeleteOnSubmit(pet);
            Db.SubmitChanges();
            Response.Redirect(Request.RawUrl);
        }
    }
}