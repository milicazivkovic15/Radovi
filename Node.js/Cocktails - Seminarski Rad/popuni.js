var exports = module.exports = {};
var db=require(__dirname+'/DBclass.js');
var sastojci= ['Soda water','Vermouth','Gin','Tequila','Bacardi Carta Negra','Banana liqueur','Juice','Milk','Worcestershire sauce','Blue Curacao liqueur','Rum','Vodtka','Coca-Cola','Lemon'];
exports.Home1 = function(name)
{
	var bp = new db.DBclass();
	var res = bp.getCocktails(name);
	bp.kill();
        var string="<br/><br/>"
            +"<div class='container'>"  ;  
    for (var i = 0; i < res.length; i++) {
         string+="<br><div class='col-md-4'><div class='thumbnail' >"
        
         +"<img  src='"+res[i].pictures+"' style='max-width:340px; max-height:227px';/>"
         
         +"<div  class='caption'> <b>"
                +res[i].name+"</b><br/><i>Description:"
                +res[i].description
        
       
         +"</i><br><p>"+res[i].ingredients+"</p><br>"
        +"<b>Price: "+res[i].price+" $</b>"
        +"</div>"
        + "</div></div>";
    }
string+="</div><br/>";
    
	
	return string;
};


exports.Home = function()
{
	var string = "<div class='container'>"
            +"<div class='panel panel-default'>" 
        +"<br/><br/>"
        +"<center><form enctype='multipart/form-data' style='width:70%;' method='post' action='/login'>" 
          
        +"Username: <input  type='text'  name='user' placeholder='Username' style='width:100%;' > <br/> "
        +"Password: <input type='password'  name='pass' placeholder='Password' style='width:100%;' > <br/> "
        +"<i>*Obavezno je popuniti sva polja !</i> <br/><br/> "
          +"<input class='btn btn-success' type='submit' name='login' value='Login'>"
          + "</form></center>"
        +"<br/><br/>"
        +"</div>"
         +"</div>";
	return string;
};

exports.Home2 = function()
{
	var string = "<div class='container'>"
                +"<div class='panel panel-default' style='text-align:center' >"
         +"<img src='cocktail.jpg' />"
                  +"<br/><br/><p style='text-align:center'>It is now a well-known fact that the word “cocktail” was first defined in 1806 by The Balance and Columbian Repository of Hudson, New York as “a stimulating liquor composed of any kind of sugar, water and bitters, vulgarly called a bittered sling.” Most cocktail aficionados might recognize that formula from drinks such as the Old Fashioned and Sazerac. Some geeks out there might even be aware that before the invention of bitters, cocktails were known as “slings,” which comes from the German word “schlingen,” meaning to swallow quickly. The first time the word “cocktail” is recorded as being used in the U.S. was on April 28, 1803 in a publication called The Farmers’ Cabinet and in the UK there is a reference to the “cock-tail” even earlier in The Morning Post and Gazetteer in London, England on March 20, 1798. Could the cocktail be an English invention? The Punch was, after all. Not that any of this really matters, anyway, because the word cocktail has been misused for many years now. It is used as a header for the entire category of mixed alcoholic drinks, whether they are highballs, punches, fizzes or sours</p><br/><br/>"
           +"<br/><br/><p style='text-align:center'>Today, the word “cocktail” is used to describe the collective group of mixed alcoholic drinks that we see on bar menus around the world. There was a point when they were, even more incorrectly, called “Martini lists” (a Martini is in that is chilled and mixed with vermouth, with the optional addition of bitters. It is not anything that is served in a cocktail glass that many referred to as a Martini glass — this is something that may have gotten lost in translation during Prohibition). The hospitality industry has taken a giant leap forward in relearning knowledge on the subject over the past 10-15 years, and most professional and informed bartenders now understand a cocktail to be something made of spirit, water, sugar and bitters. My belief is that this knowledge is going to continue to grow until we are once defining drinks as Jerry Thomas did in 1862 in the first cocktail book ever written, How to Mix Drinks or The Bon Vivant’s Companion. In fact, some bars already do. Of course, as long as people make good quality drinks with great spirits and fresh ingredients, they are perfectly entitled to call them whatever they wish as far as I’m concerned. I must admit, however, that I am always impressed with some historical wisdom and understanding and the word “cocktail” just sounds better than anything else.</p><br/><br/>"
           +"</div>"
                 +"</div>";
	return string;
};

exports.Inserted=function()
{
    
    return "Successfully!";
};


exports.generateRandomString=function()
{
	var text = "";
    var possible = "0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.IsertedCocktails=function(opis)
{
	
    
    var string = "<div class='container'>"
   
                +"<div class='panel panel-default'>"
               
                  +"<br/><br/><p style='text-align:center'>Successfully "+opis+"!</p><br/><br/>"
           +"</div>"
                
                 +"</div>";
	return string;
};

exports.Add = function()
{
	var string = "<div class='container'>"
         +"<h2>Insert cocktail</h2>"
                +"<div class='panel panel-default'>"
               
                  +"<br/><br/>"
          +"<center><form enctype='multipart/form-data' style='width:70%;' method='post' action='/inserted'>" 
          +"<input type='text'  name='name' placeholder='Name' style='width:100%;' > <br/>"

          +"<input type='text' placeholder='Price' style='width:100%;' name='price'> <br/>"
          +"<textarea name='description' style='width:100%;' placeholder='Description...'></textarea> <br/><table>";
  
          for (var i = 0; i < sastojci.length; i++) {
                if (i%2===0)
                string +="<tr><td><input type='checkbox' name='ingredients' value='"+sastojci[i]+"'>"+sastojci[i]+"</td>";
                else
                string +="<td><input type='checkbox' name='ingredients' value='"+sastojci[i]+"'>"+sastojci[i]+"</td></tr>";
             
             
            }
        string+="</table><input type='file'  name='pictures'  >"
          +"<i>*Obavezno je popuniti sva polja i odabrati zeljenu sliku!</i> <br/><br/> "
          +"<input class='btn btn-success' type='submit' name='insert' value='Insert'>"
          + "</form></center>"
+"<br/><br/>"
           
                 +"</div>"
                 +"</div>";
	return string;
};
exports.Delete = function()
{
    var base= new db.DBclass();
    var res=base.getCocktails("");
	var string = "<div class='container'>"
         +"<h2>Delete selected cocktail</h2>"
                +"<div class='panel panel-default'>"
                  +"<br/><br/>"
          +"<center><form enctype='multipart/form-data' style='width:70%;' method='post' action='/delete'>" 
        
             +"<br/><br/>"
            +"<select name='name'  class='form-control'>";
         for (var i = 0; i < res.length; i++) {
            string+= "<option value='"+res[i].id+"'>"+res[i].name+"</option>";
        }
        string+="</select>"
         +"<br><br><input class='btn btn-success' type='submit' name='delete' value='Delete'>"
          + "</form></center>"
+"<br/><br/>"
           +"</div>"
                 +"</div>";
	return string;
};
exports.Update = function()
{
    var base= new db.DBclass();
    var res=base.getCocktails("");
	var string = "<div class='container'>"
         +"<h2>Update description for selected cocktail</h2>"
                +"<div class='panel panel-default'>"
                
                  +"<br/><br/>"
          +"<center><form enctype='multipart/form-data' style='width:70%;' method='post' action='/update'>" 
        
             +"<br/><br/>"
            +"<select name='name' class='form-control'>";
         for (var i = 0; i < res.length; i++) {
            string+= "<option value='"+res[i].id+"'>"+res[i].name+"</option>";
        }
        string+="</select>"
        +"<br><br><textarea name='description' style='width:100%;' placeholder='Description...'></textarea> <br/><table>";
  
          for (var i = 0; i < sastojci.length; i++) {
                if (i%2===0)
                string +="<tr><td><input type='checkbox' name='ingredients' value='"+sastojci[i]+"'>"+sastojci[i]+"</td>";
                else
                string +="<td><input type='checkbox' name='ingredients' value='"+sastojci[i]+"'>"+sastojci[i]+"</td></tr>";
             
             
            }
        string+="</table><br><br><input class='btn btn-success' type='submit' name='update' value='Update'>"
          + "</form></center>"
+"<br/><br/>"
           +"</div>"
                
                 +"</div>";
	return string;
};

exports.error1 = function()
{
    
    
    var string = "<div class='container'>"
                +"<div class='panel panel-default'>"
               
                  +"<br/><br/><p style='text-align:center'>Greska pri unosu, pratite pravila!</p><br/><br/>"
           +"</div>"
                 +"</div>";
               
	return string;
};


exports.error2 = function(je,dva,tr)
{
    
    
     var string = "<div class='container'>"
                +"<div class='panel panel-default'>"
               
                  +"<br/><br/><p style='text-align:center'>Greska pri unosu slike</p><br/><br/>"
           +"</div>"
               
                 +"</div>";
	return string;
};