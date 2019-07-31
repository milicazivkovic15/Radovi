use SKLADISTE
--Data je baza podataka SKLADIŠTE
--tip(id, naziv) - pšenica, kukuruz,....
--rezervoar(id, kapacitet)
--ulaz(idRezervoara, idTipa, kolicina, datumPrijema) - Količina robe u rezervoaru mora da bude manja ili jednaka od njegove nosivosti. Rezervoari mogu biti i prazni. U jednom vremenskom periodu, samo jedan tip robe (žitarice) može biti u jednom rezervoaru, tj. nema mešanja robe prilikom skladištenja.
--izlaz(idRezervoara, idTipa, kolicina, datumOtpreme) - Prodaja se vrši na dan otpreme iz skladišta (odg. rezervoara). Tom prilikom se uzima važeda cena na tekudi datum - najsvežija cena za taj tip robe u odnosu na taj datum.
--cenovnik(idTipa, datumPočetkaVaženja, cena)


select * from tip
select * from cenovnik
select * from rezervoar
select * from ulaz
select * from izlaz

--Napisati SQL upit kojim se određuje koja je važeda cena pšenice i od kada važi? (cena,datum)
select c.cena,c.datumPocetkaVazenja
from
(select cenovnik.*
from tip join cenovnik on tip.naziv like 'psenica' and cenovnik.idTipa=tip.id) c
left join cenovnik c1 on c.datumPocetkaVazenja<c1.datumPocetkaVazenja and c1.idTipa=c.idTipa
where c1.cena is null

--Napisati SQL upit kojim se određuje trenutna raspoloživa količinu pšenice (u svim rezervoarima)? (kolicina)
select id,
case when u.kolicina is null then kapacitet else kapacitet-u.kolicina end  as 'kapacitet_psenice'
from rezervoar left join 
(select idRezervoar, SUM(kolicina) as 'kolicina'
from tip join ulaz on tip.naziv like 'psenica' and ulaz.idTipa=tip.id 
group by idRezervoar)u on rezervoar.id=u.idRezervoar 

--Napisati SQL upit kojim se odrediti koliko puta je koja roba menjala cenu? Koristiti ugnježdeni upit. (naziv tipa, broj)
select distinct naziv, (select distinct (select  COUNT (cena) 
										from cenovnik 
										where idTipa=c1.idTipa 
										group by idTipa) 
						from cenovnik c1 
						where t.id=idTipa) as 'menjala_cenu'
from tip t

--Napisati SQL upit kojim se određuje koliko u kom rezervoaru ima slobodnog kapaciteta i za koji tip robe.
-- Ako je rezervoar prazan kao naziv tipa robe ispisati ’BILOKOJI’. (idRezervoara, slobodno)
select ID, 
case when r1.kapacitet-c.kolicina+c1.kolicina=0 then 'pun'
when r1.kapacitet-c.kolicina+c1.kolicina> all(select kapacitet from rezervoar r1 where id=r1.id) then 'BILOKOJI'
else r1.kapacitet-c.kolicina+c1.kolicina
end as 'kapacitet'
from rezervoar r1 join(select idRezervoar, SUM(kolicina)as 'kolicina' from ulaz group by idRezervoar) c on r1.id=c.idRezervoar
				join (select idRezervoar, SUM(kolicina)as 'kolicina' from izlaz group by idRezervoar)c1 on r1.id=c1.idRezervoar
				
--Napisati SQL upit kojim se određuje koje je godine skladište najviše zaradilo, tj. koja je godina u kojoj 
--je suma svih iznosa realizovanih otprema maksimalna? 
go
create view cena_po_godinama as
select DATEPART(YEAR,t1.datumOtpreme) as 'godina', sum(t1.kolicina*t1.cena) as 'cena'
from
(select izlaz.* ,cenovnik.datumPocetkaVazenja, cenovnik.cena
from izlaz join cenovnik on cenovnik.idTipa=izlaz.idTipa and cenovnik.datumPocetkaVazenja<datumOtpreme)t1
	left join 
(select izlaz.* ,cenovnik.datumPocetkaVazenja,cenovnik.cena
from izlaz join cenovnik on cenovnik.idTipa=izlaz.idTipa and cenovnik.datumPocetkaVazenja<=datumOtpreme)t2
	on t1.idRezervoar=t2.idRezervoar and t1.idTipa=t2.idTipa and t1.kolicina=t2.kolicina and t1.datumOtpreme=t2.datumOtpreme and t1.datumPocetkaVazenja<t2.datumPocetkaVazenja and t1.cena=t2.cena
where t2.datumOtpreme is null
group by DATEPART(YEAR,t1.datumOtpreme)	
go

select c1.godina
from cena_po_godinama c1 left join cena_po_godinama c2 on c1.cena<c2.cena
where c2.cena is null


--Napisati SQL upit kojim se za svaki tip robe ispisuje tok rasta i opadanja. (nazivTipa, datum, rast/pad)
insert into cenovnik values (2,'2014-12-19 00:00:00.000',29000)

select idTipa, datumPocetkaVazenja,cena,
case when cena >= all
(
	select c1.cena
	from
	(select * from cenovnik
	where c.datumPocetkaVazenja>datumPocetkaVazenja and c.idTipa=idTipa)c1
	 left joiN
	(select * from cenovnik
	where c.datumPocetkaVazenja>datumPocetkaVazenja and c.idTipa=idTipa)c2
	 ON c1.datumPocetkaVazenja<c2.datumPocetkaVazenja
	 where c2.datumPocetkaVazenja IS null
) then 'rast'
else 'pad'
end as 'rast/pad'
from cenovnik c
order by idTipa,datumPocetkaVazenja