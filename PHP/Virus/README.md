U bazi podataka virus dati su sledeci entiteti:
1) korisnik (id, fname, lname, username, password)
2) automobil (id, korisnik_id, reg_broj, reg_datum)

u kojima su pohranjeni korisnicki identiteti, uz pretpostavku da svaki korisnik moze imati vise automobila.

1) Koristeci Doctrine ORM, napisati skript form-tab.php koji u MySQL bazi formira model podataka prema gore navedenim entitetima sa 
impliciranim relacijama. Skript form-tab.php takodje treba da doda 3 korisnika, i bar po jedan automobil (sifra je enkriptovana preko sha-1 algoritma)

2) Napisati skript login.php koji sadrzi formu za logovanje sa korisnickim imenom i lozinkom. Pristup omoguciti samo ukoliko se unese
kombinacija username(milica70)/password(milica70) koja postoji u bazi podataka i ako je korisnik iz Kragujevca (ima bar jedan auto registrovan na Kragujevac,
npr. KG 057 LS). Nakon logovanja prikazati link ka strani prikaz.php

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Virus/Login.PNG)

3) DOCTRINE prikaz.php: Proveriti da li je korisnik logovan, pa prikazati formu za pretragu korisnika po imenu i prezimenu (moguce je uneti
oba kriterimuma, jedan ili nijedan). Nakon otvaranja stranice na startu se ispisuju svi korisnici sa svojim vozilima. Prilikom ispisa obojiti
red sa vozilom cija je registracija istekla.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Virus/Search.PNG)

4) DOCTRINE Izborom linka (dugmeta) IZMENI obezbediti izmenu podataka o automobilu. Stranicu moze da vidi samo logovani korisnik. 
Tom prilikom je moguce izmeniti broj registracije, datum registracije i vlasnika vozila. Vlasnik vozila se bira iz padajuce liste, 
a prilikom pocetnog prikaza je selektovan trenutni vlasnik.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Virus/Registracije_vozila.PNG)
