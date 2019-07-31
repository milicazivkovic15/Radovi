create database pet_store

use pet_store

create table owners
(
	owner_id int PRIMARY KEY not NULL ,
	fname varchar(30) not NULL,
	lname varchar(30) not NULL,
	address varchar(30) not NULL
	
);

create table pet_type
(
	type_id  int PRIMARY KEY not NULL,
	type varchar(30) not NULL
);


create table pets
(
	pet_id int PRIMARY KEY not NULL,
	name varchar(30) not NULL,
	age int not NULL,
	description varchar(300) not null,
	owner_id int not NULL,
	type_id int not NULL,
	FOREIGN KEY (owner_id) references owners(owner_id),
	FOREIGN KEY (type_id) references pet_type(type_id)

);

insert into pet_type values(0,'Pas')
insert into pet_type values(1,'Macka')
insert into pet_type values(2,'Hrcak')

insert into owners values(0, 'Milica','Zivkovic','Zmaj Jovina 14')
insert into owners values(1, 'Dimitrije','Kokeric','Boleta Bojovica 25')
insert into owners values(2, 'Andjela','Djokic','Benetova 4')


insert into pets values(0,'Barton',4,'Rasa: Mesanac, Boja: braon, Nadimak: Baki. Umiljat, nije agresivan, najbolji prijatelj mu je princ Reinaldo.',1,0)
insert into pets values(1,'Cica',2,'Rasa: persijska, Boja: siva. Uredna je i ne mnogo zahtevna.',2,1)
insert into pets values(2,'Djole',1,'Nestasan i ponekad pobegne iz kaveza, ali se ubrzo vrati.',0,2)