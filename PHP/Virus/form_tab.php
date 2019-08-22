<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include 'konfig.php';
Doctrine::createTablesFromArray(array("Korisnik", "Automobil"));

$user1=new Korisnik();
$user1->fname="Milica";
$user1->lname="Zivkovic";
$user1->username="milica70";
$user1->password=sha1("milica70");
$user1->save();
//
$car=new Automobil();
$car->Korisnik=$user1;
$car->reg_broj="KG 057 LS";
$car->reg_datum=mktime(0, 0, 0, 1, 13, 2016);
$car->save();

$user2=new Korisnik();
$user2->fname="Andjela";
$user2->lname="Djokic";
$user2->username="ela69";
$user2->password=sha1("ela69");
$user2->save();

$car1=new Automobil();
$car1->Korisnik=$user2;
$car1->reg_broj="KG 046 KS";
$car1->reg_datum=mktime(0, 0, 0, 1, 13, 2015);
$car1->save();
//
$car2=new Automobil();
$car2->Korisnik=$user2;
$car2->reg_broj="UE 123 LM";
$car2->reg_datum=mktime(0, 0, 0, 7, 23, 2016);
$car2->save();

$car3=new Automobil();
$car3->Korisnik=$user2;
$car3->reg_broj="NG 057 MZ";
$car3->reg_datum=mktime(0, 0, 0, 11, 15, 2016);
$car3->save();


$user3=new Korisnik();
$user3->fname="Dimitrije";
$user3->lname="Kokeric";
$user3->username="kokica";
$user3->password=sha1("kokica");
$user3->save();
//
$car4=new Automobil();
$car4->Korisnik=$user3;
$car4->reg_broj="KG 512 DO";
$car4->reg_datum=mktime(0, 0, 0, 7, 8, 2015);
$car4->save();
