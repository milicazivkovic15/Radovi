U MySQL bazi shopping formirati sledece tabele:
1) customer (id, ime, prezime, kredit)
2) product (id, naziv, cena)
3) cart (id, kupac_id, proizvod_id, kolicina)

Podrazumeva se da kupac moze kupiti vise proizvoda.

1) Obezbediti prikaz svih kupaca i mogucnost kupovine proizvoda. U dropdown listama prikazati sve kupce, odnosno sve proizvode. 
Trece polje predstavlja kolicinu koja se kupuje. Za kupca koji je upravo kupio proizvod, automatski se prikazuje njegova korpa.
2) Klikom na link „prikazi korpu“ prikazuje se ime vlasnika korpe, proizvodi koje je kupio i vrednost svih proizvoda iz korpe. 
Kada korisnik kupi proizvode, kredit koji poseduje se smanjuje. Obavestiti porukom kupca ukoliko vise nema kredita ili kredit 
nije dovoljan za izabranu stavku/kolicinu.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/Shopping/Cart.PNG)
