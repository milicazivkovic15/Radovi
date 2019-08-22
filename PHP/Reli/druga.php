<?php
session_start();
include './konfig.php';
if (isset($_SESSION['user'])) {
    $upit = Doctrine_Query::create()
            ->select("*")
            ->from("driver");
    $drivers = $upit->fetchArray();
    
    echo "<table style='border:1px solid black'>";
    foreach ($drivers as $driver) {
       $upit = Doctrine_Query::create()
            ->select("*")
            ->from("car")
            ->where("driver_id=".$driver['id']);
        $hiscars = $upit->fetchArray();
        $broj = count($hiscars);
        echo "<tr>";
        echo "<td style='border:1px solid black;padding:5px;' rowspan=".$broj.">".$driver['fname']."</td>";
        echo "<td style='border:1px solid black' rowspan=".$broj."><a href='druga.php?id=".$driver['id']."'>Obrisi</a></td>";
        
        $firstRow=true;
        foreach ($hiscars as $car) {
            if ($firstRow===false){
                echo "<tr>";
            }
            echo "<td style='border:1px solid black'>".$car['model']."</td>";
            echo "<td style='border:1px solid black'>".$car['motor_num']."</td>";
            echo "</tr>";
            
            $firstRow=false;
        }          
    }
    echo "</table>";
}
else {
    echo "Niste ulogovani! <a href='login.php'>Login</a>";
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $driver = Doctrine::getTable("driver")->find($id);
    $driver->Car->delete();
    $driver->delete();
    header("Location: druga.php");
}