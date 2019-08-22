U MySQL bazi oebs formirati sledece tabele:
1) topics (id, topic)
2) countries (id, name, continent)
3) topiccou(topicID, countryID, statement)

Mnoge gradjane interesuje da li se pominje napredak Srbije u nekoj sferi.Ovaj sajt treba da predstavlja online prenos samita.
Prilikom izbora teme potrebno je izlistati sve drzave i njihove izjave koje su vezane za izabranu temu do tog trenutka.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/OEBS/OEBS.PNG)

Tom prilikom zelimo da selektovana tema ostane aktivna u combobox-u. Pored svake izjave potrebno je uraditi grubu analizu teksta i 
proceniti da li je ocena pozitivna ili negativna. Prvo je potrebno pronaci da li se pojavljuje rec “Srbija” (Moze se pojaviti i vise puta). 
Ukoliko se ne pojavljuje smatrati da je ocena negativna. Ukoliko postoji, onda je potrebno proveriti da li se neka od odredjenih reci nalazi
u njenoj okolini – 3 mesta ispred ili 3 mesta iza njene pojave. To znaci da je ocena pozitivna, u suporotnom je negativna.
Reci su: "dobar", "odlican", "razvoj","napredak", "buducnost". Obojiti crvenom bojom rec koja je dovela do pozitivne ocene. 
Klikom na ime drzave ispisuju se ime drzave i izjave njenih predstavnika.

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/PHP/OEBS/Rusija.PNG)
