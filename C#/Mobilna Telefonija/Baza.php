<?php

class Baza{
    
    var $host="localhost";
    var $ime="root";
    var $pass="";
    var $baza="auto";
    public $dbh;
    public $dbh1;

    function __construct() {
        try {
             $konekcija="mysql:host=$this->host;dbname=$this->baza";
             $this->dbh=new PDO($konekcija,$this->ime,$this->pass);
            
        } catch (Exception $exc) {
            echo "Greska: pristup1";
            echo $exc->getMessage();
        }
        try {
             $konekcija="sqlite:auto.db";
             $this->dbh1=new PDO($konekcija);
            
        } catch (Exception $exc) {
            echo "Greska: pristup2";
            echo $exc->getMessage();
        }
    }
    function __destruct() {
        $this->dbh=null;
        $this->dbh1=null;
    }
   function ucitajAutomobile(){
        $sql="Select Marka, Tip, ID From auto";
        $pdp_izraz= $this->dbh->query($sql);
        $niz=$pdp_izraz->fetchAll();
        echo "<form method='post' action='prodaja.php' >";
        foreach ($niz as $red){
            echo "<input type='checkbox' name='auto[]' value='1#".$red[2]."' /><a href='detalji.php?id=".$red[2]."'>$red[0]:$red[1]</a></br>";

        }
        echo "<input type='submit' value='Prodaj vozila' name='prodaja1' />";
        echo "</form>";
    }
      function ucitajAutomobile2(){
        $sql="Select Marka, Tip, ID From auto";
        $pdp_izraz= $this->dbh1->query($sql);
        $niz=$pdp_izraz->fetchAll();
        echo "<form method='post' action='prodaja.php' >";
        foreach ($niz as $red){
            echo "<input type='checkbox' name='auto[]' value='2#".$red[2]."' /><a href='detalji.php?id=".$red[2]."'>$red[0]:$red[1]</a><br>";

        }
        echo "<input type='submit' value='Prodaj vozila' name='prodaja2' />";
        echo "</form>";
    }
    public function dodaj($fleg,$a){
        try {
                $sql="INSERT into auto(ID, Marka, Tip, Kubikaza, Konjaza) values($a[0],'$a[1]','$a[2]',$a[3],$a[4])";
                if($fleg==1){
                     $pdp_izraz= $this->dbh->exec($sql);
                } 
                else {
                      $pdp_izraz= $this->dbh1->exec($sql);
                 }
                 return true;
        } catch (Exception $exc) {
            echo "GRESKA: "; 
            echo $e->getMessage(); 
            return false;
        }

    } 
    function detalji($id,$fleg){
        $sql="Select Konjaza, Kubikaza From auto where ID=$id";
        if($fleg==1){
             $pdp_izraz= $this->dbh->query($sql);
        }
        $niz=$pdp_izraz->fetchAll();
        if($niz!=null){
            foreach ($niz as $red){
                return $red[1]."##".$red[0];
            }
        }
        else {
              $pdp_izraz= $this->dbh1->query($sql);
              $niz=$pdp_izraz->fetchAll();
        
            foreach ($niz as $red){
                return $red[1]."##".$red[0];
            }
         }
    }
    function getID($fleg){
        $sql="Select ID From auto";
        
        if($fleg===1){
           $pdp_izraz= $this->dbh->query($sql);
        
        }
        else{
           $pdp_izraz= $this->dbh1->query($sql);
        }
        $niz=$pdp_izraz->fetchAll();
        
        return $niz;
    }
    function getAuto($id,$fleg){
        $sql="Select * From auto where ID=$id";
        
        if($fleg===1){
           $pdp_izraz= $this->dbh->query($sql);
        
        }
        else{
           $pdp_izraz= $this->dbh1->query($sql);
        }
        $niz=$pdp_izraz->fetchAll();
        
        return $niz;
    }
    
}

$b=new Baza();