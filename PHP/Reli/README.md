Napisati skript login.php koji sadrzi formu za login sa korisnickim imenom i lozinkom, kao na slici. Pristup omoguciti samo ukoliko se 
unese kombinacija username/password koja postoji u prilozenom XML fajlu users.xml i atribut aktivan ima vrednost 1. Kada se korisnik uspesno
uloguje ponuditi mu linkove na stranice prva.php i druga.php, kao na slici, a ako je logovanje neuspesno, stampati obavestenje o tome.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Reli/Login.PNG)
![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Reli/Uspesno_logovanje.PNG)

Strana prva.php na pocetku treba da proveri da li je dati korisnik pravilno ulogovan, pa ako nije, da o tome ga obavesti i ponudi link na
login.php. Ukoliko je korisnik pravilno ulogovan, na vrhu strane stampati korisnicko ime emaila (ono sto se nalazi ispred znaka “@” u njegovoj e-mail adresi) 
i broj dana protekao od 17.8.2014. god. do danas. U okviru iste strane, ucitati prilozeni fajl users.xml i prikazati ga u obliku spiska, 
ali tako da admini budu prikazani crvenom bojom, a registrovani korisnici plavom.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Reli/Prva.PNG)

Dati su sledeci entiteti:
1) driver (id, fname, lname, email, phone, year)
2) car (id, driver_id, model, motor_num)

u kojima su pohranjeni korisnicki identiteti, uz pretpostavku se da svaki vozac moze imati vise automobila. Baza podataka se zove reli.
1) Koristeci Doctrine ORM, napisati skript form-tab.php koji u MySQL bazi formira model podataka prema gore navedenim entitetima sa
impliciranim relacijama. Skript form-tab.php takodje treba da doda bar dva vozaca, sa po dva asocirana automobila u model.
2) druga.php: Ako je korisnik logovan prikazati sve vozace i njima odgovarajuce automobile. Korisniku omoguciti da moze da obrise vlasnika,
pri cemu se brisu i svi njegovi automobili. Kompletan serverski deo koristi Doctrine.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Reli/Druga.PNG)
