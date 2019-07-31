using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Owner : System.Web.UI.Page
{
    DataClassesDataContext db = new DataClassesDataContext();

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void dodaj_Click(object sender, EventArgs e)
    {
        if (fname.Text == "" ||  lname.Text == "" || address.Text == "")
        {
            error.Text = "Insert values!";
            return;
        }
        var a = from ow in db.owners
                select ow.owner_id;

        owner o = new owner();
        o.fname = fname.Text;
        o.lname = lname.Text;
        o.address = address.Text;
        o.owner_id = a.Max() + 1;

        db.owners.InsertOnSubmit(o);
        db.SubmitChanges();
        Response.Redirect("Pet.aspx");
    }



    protected void ownerPets_Load(object sender, EventArgs e)
    {
        int  id = -1;
        if (izborVlasnika.Items.Count>0)
            id = int.Parse(izborVlasnika.SelectedValue);
        var a = from p in db.pets
                where p.owner_id == id
                select new {
                    name= p.name,
                    tip= p.type_id
                };
        string s;
        if (a.Count() > 0)
        {
            s = "Dog: ";
            foreach (var pets in a)
            {
                if (pets.tip == 0)
                    s += pets.name + ",\t";
            }
            s += "\n\nCat: ";
            foreach (var pets in a)
            {
                if (pets.tip == 1)
                    s += pets.name + ",\t";
            }
            s += "\n\nHamster: ";
            foreach (var pets in a)
            {
                if (pets.tip == 2)
                    s += pets.name + ",\t";
            }
        }
        else
            s = "This owner doesn't have any pets";
         ownerPets.Text = s;
    }


    protected void obrisi_Click(object sender, EventArgs e)
    {
        int id = -1;
        if (izborVlasnika.Items.Count > 0)
        {
            id = int.Parse(izborVlasnika.SelectedValue);
            var a = from p in db.pets
                    where p.owner_id == id
                    select p;

            foreach (var pet in a)
            {
                db.pets.DeleteOnSubmit(pet);
            }

            var b = from o in db.owners
                    where o.owner_id == id
                    select o;
            var own = b.FirstOrDefault();
            db.owners.DeleteOnSubmit(own);
            db.SubmitChanges();
            Response.Redirect(Request.RawUrl);
        }
    }
}