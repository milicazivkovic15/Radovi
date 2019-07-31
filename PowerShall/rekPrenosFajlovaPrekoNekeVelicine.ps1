#Napisati powershell skriptu (zad2.ps1) koja nakon pokretanja traži od
#korisnika da unese 3 vrednosti. Te vrednosti su 2 putanje do direktorijuma (izvornog i
#odredišnog) i vrednost broja koja predstavlja veličinu u MB. Skripta mora da proveri
#postojanje direktorijuma i da ispiše odgovarajuću poruku greške ukoliko postoji greška.
#Skripta zatim uzima sve datoteke iz izvornog direktorijuma (i njegovih poddirektorijuma
#rekurzivno) koje su veće on unete veličine i prebacuje (ne kopira) u odredišni direktorijum
#ali sa promenom njihovog imena. Novo ime je oblika datX.ext, gde je X redni broj datoteke
#kada se sve one sortiraju po veličini opadajuće, a .ext je originalna ekstenzija koja se ne
#menja. U odredišnom direktorijumu treba kreirati i datoteku prenos.txt koja sadrži linije
#formata:
#izvorna putanja -> novo ime

if ($args.count -ne 3)
{
    echo "greska"
    exit
}
$putanja1=$args[0]
$putanja2=$args[1]
$velicina=$args[2]

if (!(test-path $putanja1 -PathType container))
{
    echo "Greska putanja1"
    exit
}
if (!(test-path $putanja2 -PathType container))
{
    echo "Greska putanja2"
    exit
}


dir -r $putanja1|Sort-Object -Descending

$i=0
$prenos=New-item -name "prenos.txt" -path $putanja2 -type $file

dir -r $putanja1  | foreach {
    if($_.length -gt $velicina)  
    {
        $ime=$_.fullname
         $i++
        $exe=$_.Extension
  
      rename-item $_.fullname "text$i$exe"
  
   
       move-item ($putanja1+"\text$i$exe") $putanja2
    
       add-content $prenos "$ime -> text$i$exe"
    
    }#
}