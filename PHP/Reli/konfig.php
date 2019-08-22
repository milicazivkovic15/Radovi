<?php

date_default_timezone_set("CET");
require_once("doctrine/Doctrine.php");
spl_autoload_register(array("Doctrine","autoload"));
Doctrine_Manager::getInstance()->setAttribute("model_loading","conservative");
Doctrine::loadModels("./modeli/");
$konekcija = Doctrine_Manager::connection("mysql://root@localhost/reli");
