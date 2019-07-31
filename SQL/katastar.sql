use KATASTAR
go

--Data je baza podataka KATASTAR sa slededim tabelama:
--vlasnik(šifra,ime,prezime,datumRođenja) - podaci o vlasnicima;
--tip(šifra,naziv) - podaci o tipovima parcela (vodnjak, dvorište sa kudom, livada, građevinsko zemljište...);
--parcela(šifra,naziv,površina,šifraTipa) parcele sa svojim podacima, površina u arima;
--posed(šifraParcele,šifraVlasnika,datumPočetka,datumZavršetka) podaci o vlasništvu.

--Pojašnjenje : Tabela posed sadrži podatke o vlasništvu. Jedna parcela može da ima više vlasnika u nekom
--vremenskom periodu. Ne sme se dogoditi da nad jednom parcelom jedan isti vlasnik ima 2 vremenska
--perioda vlasništva (od datumPočetka do datumZavršetka) koji se preklapaju. Jedna parcela može imati istog
--vlasnika u više odvojenih vremenskih perioda. Dakle, za istog vlasnika i istu parcelu, nije čak ni dozvoljeno
--da datumZavršetka bude recimo 2013-08-01, a novi datumPočetka da bude 2013-08-02 kao naredni
--podatak o posedu. Podaci(vrste) u tabeli posed koje imaju kolonu datumZavršetka u vrednosti NULL govore
--da je parcela još uvek u vlasništvu počev od datuma početka vlasništva.



--Napisati SQL upit kojim se ispisuju imena i prezimena vlasnika koji u trenutku izvršenja upita imaju manje od 21 godinu starosti (20 i manje).
select ime, prezime
from vlasnik
where datepart(year,getdate())-datepart(year,datumrodjenja) < 21


--Napisati SQL upit koji ispisuje šifre i nazive parcela koje su tipa “Građevinsko zemljište” i koje na datum 24.05.2013. imaju najviše 2 vlasnika.
select p.sifraParcele,pa.naziv
from posed p join parcela pa on p.sifraparcele=pa.sifra
			 join tip t on pa.sifratipa=t.sifra
where t.naziv like 'Gradjevinsko zemljiste' and datumpocetka<'2013-05-24' and ('2013-05-24'<datumzavrsetka or datumzavrsetka is null)
group by p.sifraparcele,pa.naziv
having count(*)>1


--Napisati SQL upit kojim se za svaku parcelu ispisuje njena šifra i naziv kao i najduži vremenski period (u mesecima) tokom kojeg je parcela bila 
--ili još uvek jeste u nečijem vlasništvu (bilo kog vlasnika). Za parcele gde je datum završetka vlasništva NULL,
--vreme posmatrati od datuma početka vlasništva do vremena izvršavanja upita.
select p.sifraParcele,pa.naziv,max(datediff(month,datumpocetka,ISNULL(datumzavrsetka,getdate()))) as meseci
from posed p join parcela pa on p.sifraParcele=pa.sifra
group by p.sifraParcele,pa.naziv


--Napisati SQL upit koji ispisuje šifre parcela koje nijednom nisu menjale svog vlasnika. 
--U upitu je OBAVEZNO koristiti UGNJEŽDENE upite, a nije dozvoljeno koristiti JOIN mehanizam i poglede.
select sifraParcele
from posed p
where not exists
(
	select *
	from posed p1
	where p.sifraparcele=p1.sifraparcele and p.sifraVlasnika<>p1.sifraVlasnika
)


--Napisati SQL upit kojim se ispisuje šifra, ime i prezime vlasnika koji trenutno poseduje najvedu ukupnu površinu svih svojih parcela 
--(ne deli vlasništvo ni sa kim). U obzir se uzimaju samo parcele koje poseduje samostalno.
select t1.sifraVlasnika,t1.ime,t1.prezime
from 
(
select p.sifraVlasnika,v.ime,v.prezime,sum(povrsina) as ukupna_P
from posed p join vlasnik v on p.sifraVlasnika=v.sifra
			 join parcela pa on p.sifraParcele=pa.sifra
where datumZavrsetka is null and not exists
(
	select *
	from posed p2
	where p2.datumZavrsetka is null and p.sifraVlasnika<>p2.sifraVlasnika and p.sifraParcele=p2.sifraParcele
)
group by p.sifraVlasnika,v.ime,v.prezime
) t1
where t1.ukupna_P>=all
(
select sum(povrsina) as ukupna_P
from posed p join vlasnik v on p.sifraVlasnika=v.sifra
			 join parcela pa on p.sifraParcele=pa.sifra
where datumZavrsetka is null and not exists
(
	select *
	from posed p2
	where p2.datumZavrsetka is null and p.sifraVlasnika<>p2.sifraVlasnika and p.sifraParcele=p2.sifraParcele
)
group by p.sifraVlasnika,v.ime,v.prezime
)

--Napisati SQL upit kojim se ispisuju šifre parcela koje su imale ili imaju “rupe” u vlasništvu 
--tj. kod kojih postoji bar 1 vremenski period (makar 1 dan) u kome nisu imale ni jednog vlasnika
insert into posed values (6,1,'2008-01-01','2008-10-10'),(6,2,'2008-09-12','2012-12-12')

select p.sifraParcele
from posed p left join
(
select *
from posed p1
where datumzavrsetka is null or exists
(
	select *
	from posed p2
	where p1.sifraParcele=p2.sifraParcele and p1.datumzavrsetka>=p2.datumpocetka and (p1.datumZavrsetka<p2.datumZavrsetka or p2.datumZavrsetka is null)
)
) t on p.sifraParcele=t.sifraParcele and p.sifraVlasnika=t.sifraVlasnika and p.datumPocetka=t.datumPocetka
where t.sifraParcele is null
