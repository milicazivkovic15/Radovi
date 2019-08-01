create database mobilnaTelefonija

go

use mobilnaTelefonija

create table korisnik
(
	id int identity(1,1) not null,
	ime varchar(50) not null,
	datumRodjenja datetime,
	adresa varchar(50) not null
	primary key(id)
)

create table kartica
(
	id int identity(1,1) not null,
	broj varchar(10) not null,
	operater varchar(20),
	primary key(id),
)


create table telefon
(
	id int identity(1,1) not null,
	marka varchar(20) not null,
	idKorisnika int not null,
	idkartice int not null,
	primary key(id),
	foreign key (idKorisnika) references korisnik(id),
	foreign key (idkartice) references kartica(id),
)

create table tipSaobracaja
(
	id int identity(1,1) not null,
	naziv varchar(20) not null,
	cenaPoOstvarenomSaobracaju float not null,
	primary key(id)
)

create table saobracaj
(
	id int identity(1,1) not null,
	idKartice int not null,
	ostvareniSaobracaj int not null,
	idTipaSaobracaja int not null,
	datum datetime,
	primary key(id),
	foreign key (idKartice) references kartica(id),
	foreign key (idTipaSaobracaja) references tipSaobracaja(id)
)

insert into tipSaobracaja values('SMS', 5)
insert into tipSaobracaja values('MMS', 10)
insert into tipSaobracaja values('Poziv', 5)
insert into tipSaobracaja values('Internet', 10)

insert into korisnik values ('Marko', '1990-1-1', 'Radoja Domanovica 12')

insert into korisnik values ('PEra', '1994-1-1', ' Domanovica 12')
insert into kartica values ('064123456', 'MTS')

insert into telefon values ('Aj fon', 1, 1)

insert into saobracaj values (1, 10, 1,'1990-2-1')
insert into saobracaj values (1, 5, 2,'1990-3-1')
insert into saobracaj values (1, 5, 3,'1990-4-1')
insert into saobracaj values (1, 10, 4,'1990-5-1')

select * from saobracaj
select distinct broj from telefon t join kartica k on t.idkartice=k.id
where t.idKorisnika = 1

select * from korisnik