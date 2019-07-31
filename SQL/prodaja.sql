--Model:
--radnik(IDzaposlenog,ime,IDrukovodioca)
--Rukovodioci se ubrajaju u zaposlene i nemaju svog rukovodioca.
--Racun(IDracuna,datum,idzaposlenog,vrednost)

create database PRODAJA
use PRODAJA
use STUDIJE
select * from Studenti

create table radnik
(
	IDzaposlenog smallint not null PRIMARY KEY,
	ime varchar(10)not null,
	IDrukovodioca smallint
)
create table racun
(
	IDracuna smallint not null PRIMARY KEY,
	datum datetime ,
	idzaposlenog smallint not null,
	vrednost int 
)
insert into radnik values (1,'ime1',6)
insert into radnik values (2,'ime2',6)
insert into radnik values (3,'ime3',7)
insert into radnik values (4,'ime4',7)
insert into radnik values (5,'ime5',7)
insert into radnik values (6,'ime6',null)
insert into radnik values (7,'ime7',null)

insert into racun values (1,1982-05-21,1,15)
insert into racun values (2,1981-05-23,1,15)
insert into racun values (3,1983-05-20,2,15)
insert into racun values (4,1984-05-21,2,15)
insert into racun values (5,1985-05-11,3,15)
insert into racun values (6,1986-05-2,4,15)
insert into racun values (7,1987-05-1,5,15)
insert into racun values (10,2006-09-1,5,15)
insert into racun values (8,1988-05-27,6,15)

drop table racun

select * from racun
select * from radnik

--Napisati SQL script kojim se kreira funkciju Staz koja za dati ID radnika i godinu određuje dužinu radnog
--staža radnika do date godine izraženu u godinama. Dužina staža = data godina – najranija godina kada
--je radnik potpisao neki racun
go
create function staz(@id smallint, @godina int )
returns int
as
begin
	declare @staz int
	declare @god int
	set @staz=@godina-(
	select  distinct datepart(year,r.datum) as 'godina'
	from racun r left join racun r1
	on r.idzaposlenog=5 and r1.idzaposlenog=5 and datepart(year,r.datum)>datepart(year,r1.datum)
	where r1.datum is null)
	return @staz
end
select dbo.staz (5,1910)
--Napisati SQL script kojim se kreira funkciju SopstvenaZarada koja za dati ID radnika, mesec i godinu
--vraća ukupan vrednost racuna koje je dati radnik potpisao.
go
create function SopstvenaZarada(@god int, @mesec int, @id int)
returns int
as
begin
	declare @suma int
	set @suma=
	(select sum(vrednost)
	 from racun
	 where idzaposlenog=@id and (datepart(month,datum)=@mesec or @mesec is null) and datepart(year,datum)=@god
	 group by idzaposlenog
	)
	return @suma

end

select dbo.SopstvenaZarada (1905, 6,5)

--Napisati SQL script kojim se kreira stornu proceduru PripisanaZarada koja dobija ID zaposlenog, mesec
--i godinu i vraća:
-- Sopstvenu zaradu ukoliko je zaposleni radnik koji nije rukovodilac
-- Zbir zarade koju je sam ostvario i svih zarada onih radnika kojim je rukovodilac, ukoliko je u pitanju
--radnik koji je rukovodilac.
go
create procedure PripisanaZarada(@god int, @mesec int, @id int,@suma int output)
as
begin
	declare @ruk int
	set @ruk=
	(select idrukovodioca
	from radnik
	where IDzaposlenog=5)
	if (@ruk is not null)
		set @suma= dbo.SopstvenaZarada(1905,6,5)
	else
	begin
	set @suma=
		(select SUM(r2.vrednost)
		from radnik r1 join racun r2
		on (r1.IDrukovodioca=@id and r2.idzaposlenog=r1.IDzaposlenog) or (r1.IDzaposlenog=@id and r2.idzaposlenog=@id) 
		where  (datepart(month,datum)=@mesec or @mesec is null) and datepart(year,r2.datum)=@god)
	end
end
declare @zarada int
exec dbo.PripisanaZarada 1905,6,7,@suma=@zarada output
select @zarada

--Napisati SQL za kreiranje storne procedure Unapređenje koja za datu godinu određuje radnika (koji nije
--rukovodilac) koji je najviše napedovao i unapređuje u rukovodioca, a rukovodioca koji je bio namanje
--produktivan vraća u radnike i to tako što će njemu samom i svim radnicima kojim je on rukovodio
--dodeliti unapredjenog radnika kao rukovodioca.
--Ko će biti unapređen: Za svakog radnika se određuje kolika je ukupna pripisanazarada koju je napravio
--u traženoj godini. Određivanje najboljeg:
--1) Traži se radnik koji je napravio najveću zaradu.
--2) Ukoliko je više od ostvarilo maksimum, onda se među njima bira onaj koji je napravio najveći skok u
--odnosu na sopstvenu zaradu u prethodnoj godini.
--3) Ukoliko su i po tom kriterijumu dva radnika ravnopravna onda se bira onaj koji ima manji ID.
--Ko će biti sklonjen sa pozicije rukovodioca: Za svakog rukovodioca se određuje pripisanazarada koju je
--napravio u traženoj godini. Određivanje najmanje produktivnog:
--1) Traži se rukovodilac koji ima najmanju pripisanu zaradu.
--2) Ukoliko su postoji više rukovodilaca sa istim minimumom, bira se onaj sa najviše radnika.
--3) Ukoliko i po drugom kriterijumu više rukovodilaca imaju isti status, onda se bira onaj koji ima najkraći
--staž, a ako je i to jednako, onda sam manjom vrednoscu ID-a.
go
create procedure Unapredjenje(@godina int)
as
begin
	declare c cursor for
	select r1.idzaposlenog idz, r1.idrukovodioca idr
	from radnik r1
	
	declare @zarada1 int
	declare @min int
	declare @id1 smallint
	declare @idz smallint
	declare @idr smallint
	declare @max int
	declare @id smallint
	declare @zarada int
	set @max=0
	set @min =99999 
	open c
	fetch next from c into @idz, @idr
	while @@fetch_status=0
	begin	
		exec dbo.PripisanaZarada 1905,null,@idz,@suma=@zarada output
		exec dbo.PripisanaZarada 1905,null,@idr,@suma=@zarada1 output
	
		if (@max<@zarada)
		begin
			set @id =@idz
			set @max=@zarada
		end
		else if (@max=@zarada)
		begin
			declare @z1 int
			declare @z2 int
			set @z1 = @zarada-dbo.SopstvenaZarada(2015-1,null,@idz)
			set @z2 = @max-dbo.SopstvenaZarada(2015-1,null,@id)
			if (@z1>@z2)
			begin
				set @id =@idz
				set @max=@zarada
			end
			else if (@z1=@z2)
				if (@idz<@id)
				begin
					set @id =@idz
					set @max=@zarada
				end
		end
		if (@min>@zarada1)
		begin
			set @min=@zarada1
			set @id1=@idr
		end
		else if (@min=@zarada1)
		begin
			declare @rad int
			declare @rad1 int
			set @rad=
			(select count(idzaposlenog)
			from radnik
			where IDrukovodioca=@idr
			)
			set @rad1=
			(select count(idzaposlenog)
			from radnik
			where IDrukovodioca=@id1
			)
			if (@rad>@rad1)
			begin
				set	@min=@zarada1
				set @id1=@idr
			end
			else if (@rad=@rad1)
			begin
				declare @st int
				declare @st1 int
				set @st=dbo.staz(@idr,2016)
				set @st1=dbo.staz(@id1,2016)
				if (@st<@st1)
				begin
					set @min=@zarada1
					set @id1=@idr
				end
				else if (@st=@st1)
					if (@idr<@id)
					begin
						set @min=@zarada1
						set @id1=@idr
					end
			end
		end
		
	end
	close c
	deallocate c
	
	declare c cursor for
	select r1.idzaposlenog idz, r1.idrukovodioca idr
	from radnik r1
	
	
	open c
	fetch next from c into @idz,@idr
	while @@FETCH_STATUS=0
	begin
		if (@idr=@id1 or @idz=@idr)
			set @idr=@id
		else if (@idz=@id)
			set @id1=null
	end
	close c
	deallocate c

end
drop procedure Unapredjenje 
exec dbo.Unapredjenje 1905
select * from radnik

