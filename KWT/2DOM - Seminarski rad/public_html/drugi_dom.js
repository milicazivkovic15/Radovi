/* global toString */

var hoteli;
var meniFleg=false;
var flag=true;
var niz=[];
var zvezda=0;
var ocena=0;
var dat1=true;
var dat2=true;
var sobica=true;
var korpa=[];
var brUKorpi=0;
var brKreveta=1;
var brojac=-1;
var zaCenu=-1;

function ucitajXML(){

  var xhttp= new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
     if (xhttp.readyState === 4 && xhttp.status === 200) 
      hoteli = xhttp.responseXML.getElementsByTagName("hotel");
  };

  xhttp.open("GET", "hoteli.xml", true);
  xhttp.send();
}

function pretvoriUMeni(){
    if(flag===true){
        var p = document.getElementById("p1");
        var pocetna = document.getElementById("pocetna");
        var meni = document.getElementById("centrirano");
        var slika= document.getElementById("kuca");
        var home= document.getElementById("home");
        var search1= document.getElementById("search");
        var search2= document.getElementById("pretraga");
        var search=document.getElementById("pretrazi");
        var span=document.getElementById("spann");
        
        document.getElementById("dolazak").style.visibility="visible";
         document.getElementById("polazak").style.visibility="visible";
         document.getElementById("brKreveta").style.visibility="visible";
        document.getElementById("pozadinaFiltera").style.visibility="visible";
        document.body.style.overflow="auto";
        document.getElementById("tekst").innerHTML="";
        document.getElementById("page").style.paddingBottom="0px";
        search.style.position="absolute";
        search.style.left="20%";
        home.style.position="absolute";
      span.style.position="absolute";
     
        
        
        var pos =200;
        var pos0 =200;
        var pos1=500;
        var pos2=60;
        var pos3=170;
        var pos4=650;
        var velicina=300;
        var velicina1=2000;
        var velicina2=2000;
        var pos00=200;
        var id = setInterval(frame, 4);
        function frame() {
         if (pos===40) {
           clearInterval(id);
         } else {
           pos--;
           pos0-=0.9;
           pos00-=1.45;
           pos1-=3;
           pos2-=0.15;
           pos3-=0.1;
           pos4-=1;
           velicina-=1.3;
           velicina1-=11.3;
           velicina2-=11.7;
           search.style.top= pos00 + 'px';
           search1.style.height = pos2 + 'px';
           search2.style.height = pos2 + 'px';
           search1.style.width = pos3 + 'px';
           search2.style.width = pos4 + 'px';
           span.style.left = pos00 + 'px';
           
           slika.style.width=velicina + 'px';
           slika.style.height=velicina + 'px';
           home.style.top= pos + 'px';
           home.style.right = pos1 + 'px';
           home.style.width=velicina + 'px';
           home.style.height=velicina + 'px';
        
                
                
                
           pocetna.style.height=velicina1 + 'px';
           meni.style.top = pos0 + 'px';
           meni.style.height=velicina2+'px';
         
           
         }
       }
       p.style.display="block";
       meni.style.paddingBottom='0px';
       pocetna.style.paddingBottom='0px';
      
       meni.style.marginTop='0px';
    }
    flag=false;
    
    pretrazuj();
}
function pretrazuj(){
        document.getElementById("gradovi").style.visibility="hidden"; 
   

    var j=0;
    var gradovi="<table>";
    var text=document.getElementById("pretraga").value;
   
    for (i=0;i<hoteli.length;i++){
        if (hoteli[i].getElementsByTagName("grad")[0].childNodes[0].nodeValue.search(new RegExp(text,"ig"))>-1 && text!=="" && text!==" " ){
            for (k=0;k<j;k++){
                if (hoteli[i].getElementsByTagName("grad")[0].childNodes[0].nodeValue===niz[k]){ 
                    break;
                }
            }
            if (k===j){
                gradovi+="<tr><td style=' height: 40px'><input type='submit' onclick='nazad("+j+")' value='"+hoteli[i].getElementsByTagName("grad")[0].childNodes[0].nodeValue+"'></td></tr>";
                niz[j++]=hoteli[i].getElementsByTagName("grad")[0].childNodes[0].nodeValue;
            }
        }
        
                  
    }
    gradovi+="</table>";
     if (j>0)
        document.getElementById("gradovi").style.visibility="visible"; 
   
    document.getElementById("gradovi").innerHTML=gradovi;
    
}

function  dajRezultate(j){
   
   var hotel=document.getElementById("nazivHotela").value;
   var adresa=document.getElementById("adresaHotela").value;
    document.getElementById("podaci").style.visibility="visible";
       
   var slike;
   var k=0;
   var fleg=false;
   document.getElementById("gradovi").style.visibility="hidden"; 
   
   if (j!==-1)
      document.getElementById("pretraga").value=niz[j]; 
   
   var gradPoPretrazi=document.getElementById("pretraga").value;
      
   var tekst="<table style='margin-left:255px'>";
        for (i=0;i<hoteli.length;i++){
            if (hoteli[i].getElementsByTagName("grad")[0].childNodes[0].nodeValue.search(new RegExp(gradPoPretrazi,"ig"))>-1  ){
                if (zvezda!==0 && hoteli[i].getElementsByTagName("zvezdica")[0].childNodes[0].nodeValue!=zvezda ){
                   
                }
                else if (ocena!==0 && hoteli[i].getElementsByTagName("ocena")[0].childNodes[0].nodeValue!=ocena){

                }
                else if (hoteli[i].getElementsByTagName("ime")[0].childNodes[0].nodeValue.search(new RegExp(hotel,"ig"))>-1 && hoteli[i].getElementsByTagName("ulica")[0].childNodes[0].nodeValue.search(new RegExp(adresa,"ig"))>-1  ){
                    fleg=true;
                    slike=hoteli[i].getElementsByTagName("slike");
                        tekst+="<tr><td rowspan='6' style='border-bottom:5px solid #c9d8c5;  padding: 10px' class='kolonaS"+k+"'> <img src='hoteli/"+slike[0].getElementsByTagName("putanja")[0].childNodes[0].nodeValue+"' onclick='prikaziHotel("+i+")' width='180px' height='180px'></td></tr>";
                        k++;

                    if (brUKorpi>0){ 
                            var f=false;
                             for (t=0;t<brUKorpi;t++)
                                 if (korpa[t]===hoteli[i].id){
                                    tekst+="<tr><td id='srce"+k+"' class='kolonaSr"+k+"'> <img src='slike/Red-Heart.png'  onclick='dodajUKorpu("+i+")' width='50px' height='50px' ></td>";
                                    f=true;
                                }
                            if (f===false)
                                tekst+="<tr><td id='srce"+k+"' class='kolonaSr"+k+"'> <img src='slike/heart.png'  onclick='dodajUKorpu("+i+")' width='50px' height='50px' ></td>";

                        }
                        else
                             tekst+="<tr><td id='srce"+k+"' class='kolonaSr"+k+"'> <img src='slike/heart.png'  onclick='dodajUKorpu("+i+")' width='50px' height='50px' ></td>";


                    tekst+="<td class ='kolonaI"+k+"'>Hotel: "+hoteli[i].getElementsByTagName("ime")[0].childNodes[0].nodeValue+"</td>";

                    tekst+="<tr><td colspan='2' class='kolonaA"+k+"'>U ulici: "+hoteli[i].getElementsByTagName("ulica")[0].childNodes[0].nodeValue+"</td></tr>";
                        tekst+="<tr><td colspan='2' class='kolonaG"+k+"'>"+hoteli[i].getElementsByTagName("grad")[0].childNodes[0].nodeValue+"</td></tr>";
                        tekst+="<tr><td colspan='2' class='kolonaZ"+k+"'>Hotel sa "+hoteli[i].getElementsByTagName("zvezdica")[0].childNodes[0].nodeValue+" zvezdica</td></tr>";
                        tekst+="<tr><td colspan='2' style='border-bottom:5px solid #c9d8c5; margin-bottom: 26px' class='kolonaO"+k+"'>Ocena :"+hoteli[i].getElementsByTagName("ocena")[0].childNodes[0].nodeValue+"</td></tr>";

                }        
            }
        }
  tekst+="</table>";
   if (fleg===false)
       document.getElementById("ponudjeno").innerHTML="<table style='margin-left:270px'><tr><td>Nema pronadjenih rezultata</td></tr></table>";
   else
    document.getElementById("ponudjeno").innerHTML=tekst;
}

function zvezdice(broj){
    zvezda=broj;
    dajRezultate(-1);
}
function ocene(broj){
    ocena=broj;
    dajRezultate(-1);
    
}
function reset(){
    zvezda=0;
    ocena=0;
    document.getElementById("adresaHotela").innerHTML="";
    document.getElementById("nazivHotela").innerHTML="";
    dajRezultate(-1);
    
}

function izaberiDatum(dat, flag){
    var div=document.getElementById("datum"+dat);
    if (flag===1){
        if ((dat===1 && dat1===false) || (dat===2 && dat2===false) ){
            div.style.visibility="hidden";
            if (dat===1) dat1=true;
            else dat2=true;
        }
        else{
            div.style.visibility="visible";
            if (dat===1) dat1=false;
            else dat2=false;
        }
    }
    else{   
        if (dat===1) dat1=true;
        else dat2=true;
        div.style.visibility="hidden";
    }
}
function datumIzabran(dugme){
     var tekst=document.getElementById("d"+dugme).value;
    var patt=/^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/ig;
    var rez=patt.test(tekst);
    
    if(rez || tekst==="")
    {
        izaberiDatum(dugme,2);   
        document.getElementById("izabranDatum"+dugme).innerHTML=tekst;
        if (zaCenu>0)
            prikaziKorpu();
    }
    else
    {
        alert("Niste uneli ispravan datum");
    }
}
function izaberiBrSoba(){
    if (sobica===false) {
        document.getElementById("izborSoba").style.visibility="hidden";
        sobica=true;
    }
    else{
        var text="<table><tr><td><input type='submit' onclick='biraj("+"1"+")' value='Jednokrevetna'></td></tr><tr><td></td></tr><tr><td><input type='submit' onclick='biraj("+"2"+")' value='Dvokrevetna'></td></tr><tr><td></td></tr><tr><td><input type='submit' onclick='biraj("+"3"+")' value='Trokrevetna'></td></tr></table>";
       document.getElementById("izborSoba").style.visibility="visible";
        sobica=false;
        document.getElementById("izborSoba").innerHTML=text;
    }
}
function biraj(soba){
    brKreveta=soba;
    if (soba===1)
        document.getElementById("sobe").innerHTML="Jednokrevetna";
    else if (soba===2)
        document.getElementById("sobe").innerHTML="Dvokrevetna";
    else
        document.getElementById("sobe").innerHTML="Trokrevetna";
   
    document.getElementById("izborSoba").style.visibility="hidden";
   sobica=true;
   if (brojac>0)
        prikaziHotel(brojac);
    if (zaCenu>0){
        prikaziKorpu();
    }
        
}

function prikaziHotel(i){
    brojac=i;
   document.getElementById("pozadinaFiltera").style.visibility="hidden";
   document.getElementById("ponudjeno").innerHTML="<div id='galerija'></div><div id='text'></div>";
   
   document.getElementById("ponudjeno").style.backgroundColor="#e3e3e3";
    ubaciGaleriju(i);
   var text="" ;
   text+="<br><br><br>";
   text+="<span>Hotel "+hoteli[i].getElementsByTagName("ime")[0].childNodes[0].nodeValue;
   
   text+=" nalazi se u ulici "+hoteli[i].getElementsByTagName("ulica")[0].childNodes[0].nodeValue;
   text+=" u "+hoteli[i].getElementsByTagName("grad")[0].childNodes[0].nodeValue+". ";
   
   text+="To je hotel koji je od strane gostiju ocenjen sa "+hoteli[i].getElementsByTagName("ocena")[0].childNodes[0].nodeValue;
   
   text+=". i to je hotel od "+hoteli[i].getElementsByTagName("zvezdica")[0].childNodes[0].nodeValue+" zvezdica.</span> ";
   
   text+="<br><br><br>";
   text+="<span>Najbolja cena u hotelu je </span>"+hoteli[i].getElementsByTagName("najboljaCena")[0].childNodes[0].nodeValue;
   
   text+="<br><br><br>";
   text+="<table  style='margin-left:80px'><tr><td>Broj kreveta</td><td>Dorucak ukljucen u cenu</td><td>Cena prenocista</td></tr>";
    var sobe=hoteli[i].getElementsByTagName("sobe");
    for (j=0;j<sobe.length;j++){
       if (brKreveta==sobe[j].getElementsByTagName("brojKreveta")[0].childNodes[0].nodeValue)
            text+="<tr style='background-color:red'><td  class='kolonaBK"+j+"'>"+sobe[j].getElementsByTagName("brojKreveta")[0].childNodes[0].nodeValue+"</td>";
        else
            text+="<tr ><td  class='kolonaBK"+j+"'>"+sobe[j].getElementsByTagName("brojKreveta")[0].childNodes[0].nodeValue+"</td>";
        
        text+="<td  class='kolonaDO"+j+"'>"+sobe[j].getElementsByTagName("dorucak")[0].childNodes[0].nodeValue+"</td>";
         
        text+="<td  class='kolonaCE"+j+"'>"+sobe[j].getElementsByTagName("cena")[0].childNodes[0].nodeValue+"</td></tr>";
         
    }
    text+="</table>";
    
   text+="<br><br><br>";
   text+="<span>Ukupan broj soba u hotelu </span>"+hoteli[i].getElementsByTagName("brojSoba")[0].childNodes[0].nodeValue;
   
   text+="<br><br><br><span>Oprema i usluge u hotelu:</span><br> <br>";
   text+=hoteli[i].getElementsByTagName("uHotelu")[0].childNodes[0].nodeValue;
   
   text+="<br><br><br><span>Oprema i usluge u sobama hotela:</span><br> <br>";
   text+=hoteli[i].getElementsByTagName("uSobama")[0].childNodes[0].nodeValue;
   
   text+="<br><br><br><span>Kratak opis hotela:</span><br><br>";
   
   text+= hoteli[i].getElementsByTagName("opis")[0].childNodes[0].nodeValue;
   
   text+="<br><br><br><span>Komentari gostiju hotela:</span><br><br>";
   text+="<table>";
    var komentari=hoteli[i].getElementsByTagName("komentar");
    for (j=0;j<komentari.length;j++){
        text+="<tr><td  class='kolonaBK"+j+"'>"+komentari[j].getElementsByTagName("pasus")[0].childNodes[0].nodeValue+"</td></tr>";
          text+="<tr><td></td></tr>";
    }
    text+="</table>";
   text+="<input type='submit' value='Nazad' class='nazad' onclick='nazad(-1)'>";
    document.getElementById("text").innerHTML=text;
    
  
   
}
function ubaciGaleriju(i){
    var slike=hoteli[i].getElementsByTagName("slike");
    var j=0;
    document.getElementById("galerija").innerHTML="<img src='hoteli/"+slike[j++].getElementsByTagName("putanja")[0].childNodes[0].nodeValue+"' style='margin-top:20px;  border:4px solid red;' width='700px' height='400px'>";
      
    var id = setInterval(frame, 2500);
        function frame() {
            if (j===slike.length) 
                j=0;
            document.getElementById("galerija").innerHTML="<img src='hoteli/"+slike[j++].getElementsByTagName("putanja")[0].childNodes[0].nodeValue+"'  style='margin-top:20px; border:4px solid red;' width='700px' height='400px' >";
        }
}
function dodajUKorpu(i){
    var f=true;
    for (k=0;k<brUKorpi;k++)
        if (korpa[k]===hoteli[i].id){
            for (j=k;j<brUKorpi-1;j++){
                korpa[j]=korpa[j+1];
            }
            brUKorpi--;
            f=false;
            break;
        }
    if (f===true){
        korpa[brUKorpi++]=hoteli[i].id;
    }
    dajRezultate(-1);
}
function nazad(j){
    brojac=-1;
    zaCenu=-1;
    document.getElementById("pozadinaFiltera").style.visibility="visible";
    
    document.getElementById("ponudjeno").innerHTML="";
    document.getElementById("ponudjeno").style.backgroundColor="#F5F5DC";
    dajRezultate(j);
}

function otvoriMeni(){
    
    var meni=document.getElementById("bar-meni");
    
    if (meniFleg===false){
        meni.style.visibility="visible";
        meniFleg=true;
        
    }
    else{
        meni.style.visibility="hidden";
         meniFleg=false;
    }
    
}

function prikaziKorpu(){
    zaCenu=1;
    document.getElementById("pozadinaFiltera").style.visibility="hidden";
    document.getElementById("ponudjeno").style.visibility="visible";
    document.getElementById("ponudjeno").style.backgroundColor="#dbc3d0";
  
    document.getElementById("ponudjeno").innerHTML="";
    var text;
    
   text="<span>Datum polaska je "+document.getElementById("izabranDatum1").innerHTML;
    text+="<br><br>";
   text+="Datum dolaska je "+document.getElementById("izabranDatum2").innerHTML;
    text+="<br><br>";
    text+="Izaberite ime hotela iz vase korpe<br><br> <select  onchange='izracunajCenu()' id='izabranHotel'>";
    for (i=0;i<brUKorpi;i++){
        for (j=0;j<hoteli.length;j++){
            if (korpa[i]===hoteli[j].id){
                text+="<option>"+hoteli[j].getElementsByTagName("ime")[0].childNodes[0].nodeValue+"</option>";
                   
            }
        }
    }
     
    text+="</select>";
    text+="<br><br>";
    
    text+="Sa doruckom<input id='RB1' type='radio' name='rb' checked='checked' onchange='izracunajCenu()' width='120px;' />";
    text+="<br>";  
    text+="Bez dorucka<input id='RB2' type='radio' name='rb' onchange='izracunajCenu()' />";
    text+="<br><br></span>";
    
    text+="<p id='ukupnaCena'></p>";
  text+="<br><br>";
    
   text+="<input type='submit' value='Nazad'  class='nazad' onclick='nazad(-1)'>";
  
  
    document.getElementById("ponudjeno").innerHTML=text;
    
    izracunajCenu();
  
}
function izracunajCenu(){
    var d1=new Date(document.getElementById("izabranDatum1").innerHTML);
    var d2=new Date(document.getElementById("izabranDatum2").innerHTML);
    var dana = parseInt((d2 - d1) / (1000 * 60 * 60 * 24)); 
   
    var hotel=document.getElementById("izabranHotel").value;
  
    if (isNaN(dana)===false || dana<0){
        if (dana===0) dana=1;
        for(i=0;i<hoteli.length;i++){
          if (hoteli[i].getElementsByTagName("ime")[0].childNodes[0].nodeValue===hotel){

               var sobe=hoteli[i].getElementsByTagName("sobe");
               for (j=0;j<sobe.length;j++){
                  if (brKreveta==sobe[j].getElementsByTagName("brojKreveta")[0].childNodes[0].nodeValue){
                      if (document.getElementById("RB1").checked===true){
                          if (sobe[j].getElementsByTagName("dorucak")[0].childNodes[0].nodeValue==="da"){
                              var cena=parseInt(sobe[j].getElementsByTagName("cena")[0].childNodes[0].nodeValue);
                              cena*=dana;

                              document.getElementById("ukupnaCena").innerHTML="Ukupna cena za hotel "+hotel+" iznosi : "+cena+ " € za "+dana+" dana.";
                              return;
                          }
                      }
                      else{
                           if (sobe[j].getElementsByTagName("dorucak")[0].childNodes[0].nodeValue==="ne"){
                              var cena=parseInt(sobe[j].getElementsByTagName("cena")[0].childNodes[0].nodeValue);

                              cena*=dana;
                            document.getElementById("ukupnaCena").innerHTML="Ukupna cena za hotel "+hotel+" iznosi : "+cena+ " € za "+dana+" dana.";
                              return;
                          }
                      }
                  }
                }
           }   
        }
    }
    
    document.getElementById("ukupnaCena").innerHTML="Ne mozemo izracunati cenu nisu unete ispravne vrednosti. (npr. : datum dolaska, datum polaska, zeljeni hotel ne nudi mogucnost sobe sa izabranim brojem kreveta, ili sa/bez dorucka)";
                           
}    
function prikaziKontakt(){
    document.getElementById("ponudjeno").style.visibility="visible";
     document.getElementById("pozadinaFiltera").style.visibility="hidden";
   
    document.getElementById("ponudjeno").style.backgroundColor="#dbc3d0";
  
    var text="";  
    text+="<h2>Posaljite nam e-mail:</h2>";


    text+="Ime:<br>";
    text+="<input type='text' name='name' placeholder='#tvoje ime'><br>";
    text+="E-mail:<br>";
    text+="<input type='text' id='mail' placeholder='#tvoj email'><br>";
    text+="Komentar:<br>";
    text+="<input type='text' name='comment' placeholder='#napisi nam tvoj komentar' size='50'><br><br>";
    text+="<input type='submit' class='nazad' value='Posalji' onclick='provera()'>           ";
    text+="<input type='reset' class='nazad' value='Resetuj'><br><br>";
    text+="<input type='submit' value='Nazad'  class='nazad' onclick='nazad(-1)'>";
  
  
    document.getElementById("ponudjeno").innerHTML=text;
    

}
function provera(){
    var patt=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    var rez= patt.test(document.getElementById("mail").value);
    if (rez===false){
        alert("Mail koji ste uneli nije ispravan!");
       
    }
    else{
    document.getElementById("ponudjeno").innerHTML="<span>Hvala na mail-u!</span>";
        
    }
    
}