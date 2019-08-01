using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Store : System.Web.UI.Page
{
    DataClassesDataContext db = new DataClassesDataContext();
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void usvoji_Click(object sender, EventArgs e)
    {
        int idO = -1;
        int idP = -1;
        if (usvajanjeVlasnik.Items.Count > 0 && usvajanjeLjubimac.Items.Count > 0)
        {
            idO = int.Parse(usvajanjeVlasnik.SelectedValue);

            idP = int.Parse(usvajanjeLjubimac.SelectedValue);
            var pets = from p in db.pets
                       where p.pet_id == idP
                       select p;

            Pet pet = pets.FirstOrDefault();
            pet.owner_id = idO;
            db.SubmitChanges();
        }
        Response.Redirect(Request.RawUrl);
    }
}