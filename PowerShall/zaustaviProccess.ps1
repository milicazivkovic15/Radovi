#Napisati powershell skript zaustavi.ps1 koji preko komandne linije prima 1 argument.
#Argument predstavlja deo naziva nekog procesa koji je potrebno zaustaviti. Ukoliko više procesa
#ima naziv koje sadrži tekst iz argumenta, zaustaviti ih sve. Prilikom svakog zaustavljanja ispisati
#poruku koji se trenutno proces zaustavlja. Na kraju ispisati poruku koliko je ukupno procesa
#zaustavljeno. Ukoliko nema procesa čiji bi naziv odgovarao, ispisati poruku da je 0 procesa
#zaustavljeno.
if ($args.count -ne 1){
    echo "greska`n"
    exit
}

$imeProcesa = $args[0]
$i = 0 # brojac procesa koji su zaustavljeni

get-process | where { $_.name -like $imeProcesa } | foreach {
              echo $_.name;
              $i++;

             $_.kill()
}
echo "Zaustavljeno: $i`n"