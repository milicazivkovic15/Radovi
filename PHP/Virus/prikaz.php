<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
session_start();
if(isset($_SESSION['usr'])){
    include 'konfig.php';
    
    if (isset($_GET['izmeni'])){
        
        $upit=Doctrine_Query::create()
                         ->select("*")
                         ->from("korisnik");
         $kor=$upit->fetchArray(Doctrine_Core::HYDRATE_ARRAY);
         foreach ($kor as $k){
             if (strcmp($k['fname'], explode(' ', $_GET['lista'])[0])==0 && strcmp($k['lname'], explode(' ', $_GET['lista'])[1])==0 ){
                 
                 $cars=Doctrine::getTable("automobil")->findBy("id", intval($_GET['skriveno']));
                 $cars->delete();
                 $datum=explode(".", $_GET['datum']);
                 $c=new Automobil();
                 $c->korisnik_id=$k['id'];
                 $c->reg_datum=  mktime(0,0,0, $datum[1], $datum[0], $datum[2]);
                 $c->reg_broj=$_GET['tablice'];
                 $c->save();
                 
                 
                 break;
             }
         }
         
   
    }
    
    
    echo "<form action='prikaz.php' method='post'>";
    echo '<input type="text" name="ime" value="" />  ';
    echo '<input type="text" name="prezime" value="" />  ';
    echo '<input type="submit" value="Prikazi" name="login" /><br>';
    
    echo  "</form>";
    
     $upit=Doctrine_Query::create()
                         ->select("*")
                         ->from("korisnik");
     
     $users=$upit->fetchArray(Doctrine_Core::HYDRATE_ARRAY);
     $today = new DateTime();
     echo "<table style='border: 1px solid black;'>";
     echo "<tr><th>Ime i prezime</th><th>Automobil</th><th>Darum registracije</th><th></th>";
     foreach ($users as $u){
         if ((!isset($_POST['ime']) || trim($_POST['ime'])=="" || strpos(strtolower($u['fname']), strtolower($_POST['ime'])) !== false)
                 &&((!isset($_POST['prezime'])|| trim($_POST['prezime'])=="" ||  strpos(strtolower($u['lname']),strtolower($_POST['prezime'])) !== false))){
            $cars=Doctrine::getTable("automobil")->findBy("korisnik_id", $u['id']);
            
            foreach ($cars as $c){
                $d1 = new DateTime(date("Y-m-d",$c['reg_datum']));
                $diff = $today->diff($d1);
                if ($diff->y===0){
                    echo "<tr ><td style='border: 1px solid black;'>".$u['fname']." ".$u['lname']."</td><td style='border: 1px solid black;'>".$c['reg_broj']."</td><td style='border: 1px solid black;'>".date("d.m.Y",$c['reg_datum'])."</td><td style='border: 1px solid black;'><a href='prikaz.php?id=".$c['id']."'>Izmeni</a></td></tr>" ;                 
                }
                else{
                    echo "<tr style='color:red; border:1 solid black'><td style='border: 1px solid black;'>".$u['fname']." ".$u['lname']."</td><td style='border: 1px solid black;'>".$c['reg_broj']."</td><td style='border: 1px solid black;'>".date("d.m.Y",$c['reg_datum'])."</td><td style='border: 1px solid black;'><a href='prikaz.php?id=".$c['id']."'>Izmeni</a></td></tr>" ;                 
                }
            }
         }
     }
    echo "</table>";
    
    if(isset($_GET['id'])){
         echo "<form action='prikaz.php' merhod='get'>";
    
        $upit=Doctrine_Query::create()
                         ->select("*")
                         ->from("korisnik");
         $users1=$upit->fetchArray(Doctrine_Core::HYDRATE_ARRAY);
    
        echo '<br><br>Registarski broj: <input type="text" name="tablice" value="" /><br>';
        echo 'Datum registracije : <input type="text" name="datum" value="" />(DD.MM.YYYY)<br>';  
        
         
     echo "<select name='lista'>";
     foreach ($users1 as $u1){
        echo "<option>".$u1['fname']." ".$u1['lname']."</option>";
     }
     echo "</select>";
        echo '<input type="submit" value="Izmeni" name="izmeni" />';
        echo "<input type='hidden' name='skriveno' value=".$_GET['id']." />";
                
        
       echo  "</form>";
      
    }
    
    
        
}