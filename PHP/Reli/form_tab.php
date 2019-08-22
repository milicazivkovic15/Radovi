<?php
include './konfig.php';

Doctrine::createTablesFromArray(array("Driver","Car"));

$driver1 = new Driver();
$driver1->fname = "Pera";
$driver1->lname = "Peric";
$driver1->email = "pera@peric.com";
$driver1->phone = "069111222";
$driver1->year = 1995;
$driver1->save();

$car1 = new Car();
$car1->Driver = $driver1;
$car1->model = "Mazda";
$car1->motor_num = "RX 391001";
$car1->save();

$car2 = new Car();
$car2->Driver = $driver1;
$car2->model = "Honda";
$car2->motor_num = "LH 84912";
$car2->save();

$driver2 = new Driver();
$driver2->fname = "Mika";
$driver2->lname = "Mikica";
$driver2->email = "mika@mikic.com";
$driver2->phone = "068222222";
$driver2->year = 1996;
$driver2->save();

$car3 = new Car();
$car3->Driver = $driver2;
$car3->model = "BMW";
$car3->motor_num = "M 873 BM";
$car3->save();

$car4 = new Car();
$car4->Driver = $driver2;
$car4->model = "Fica";
$car4->motor_num = "FLOD 444";
$car4->save();