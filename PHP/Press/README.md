U MySQL bazi press formirati sledede tabele:
1) kategorija (id, naziv)
2) vesti (id, naslov, opis, kategorija_id, novinar_id)
3) novinar (id, ime, prezime, adresa, status = “”)

Relacije KATEGORIJA i NOVINAR su povezane preko relacije VESTI. Podrazumeva se da pojedinacni clan moze napisati vise vesti u vise kategorija.
Napisati skript prva.php cija je uloga izlistavanja svih vesti. Pored svake vesti napraviti dugme/link za izmenu vesti, pri cemu je pored
ostalih polja prikazuje combobox sa imenima novinara i combobox sa nazivima kategorija.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Press/Press_vesti.PNG)

Jedan od poslova Bezbednosne informacione agencije (BIA) je istrazivanje i analiza objavljenih vesti u cilju pradenja stanja drustva. 
Analiza obuhvata pretragu svih kljucnih reci koje se koriste kao indikator za crvenu uzbunu - napad, terorizam, borba, bojkot, bomba, 
izdaja, udarac, prevara, sipka, kradja, zlocudan. Napraviti stranu analiza.php na kojoj se prikazuju sve vesti sa oznacenim “crvenim” 
kljucnim recima u tekstu (crvena boja i bold). Sve pronadjene reci postaviti kao linkove, klikom na njih prikazuju se samo vesti koje 
sadrze odredjenu rec na koju je agent kliknuo. Pored svake vesti ispisati pronadjene reci i broj njihovog pojavljivanja u recenici.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Press/Analiza.PNG)
