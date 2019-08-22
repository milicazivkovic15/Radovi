<?php

class Baza{
    
    public $dbh;
    public $dbh1;
    
    function __construct() {
        $konekcija = "mysql:host=localhost;dbname=auto";
        $this->dbh = new PDO($konekcija,"root","");
        
        $konekcija = "sqlite:auto.db";
        $this->dbh1 = new PDO($konekcija);
    }
    
    function __destruct() {
        $this->dbh = NULL;
        $this->dbh1 = NULL;
    }
    
    function ucitajAutomobile1(){
        $sql = "Select ID, Marka, Tip From auto";
        $pdp = $this->dbh->query($sql);
        $niz = $pdp->fetchAll();
        
        echo "<div>";
        echo "<form method='post' action='prodaja.php'>";
        foreach ($niz as $red){
            echo "<input type='checkbox' name='auto[]' value='".$red[0]."'><a href='detalji.php?id=".$red[0]."'>$red[1] : $red[2]</a><br>";
        }
        echo "<input type='submit' name='prodaja1' value='Prodaj vozila'>";
        echo "</form>";
        echo "</div>";
    }
    
    function ucitajAutomobile2(){
         $sql = "Select ID, Marka, Tip From auto";
        $pdp = $this->dbh1->query($sql);
        $niz = $pdp->fetchAll();
        echo "<div>";
        echo "<form method='post' action='prodaja.php'>";
        foreach ($niz as $red){
            echo "<input type='checkbox' name='auto[]' value='".$red[0]."'><a href='detalji.php?id=".$red[0]."'>$red[1] : $red[2]</a><br>";
        }
        echo "<input type='submit' name='prodaja2' value='Prodaj vozila'>";
        echo "</form>";
        echo "</div>";
    }
    
    function detalji($id){
        $sql = "Select Kubikaza, Konjaza From auto where ID=$id";
        $pdp = $this->dbh->query($sql);
        $auto = $pdp->fetch();
        if ($auto != null){
            return "$auto[0]#$auto[1]";
        }
        else{
            $pdp = $this->dbh1->query($sql);
            $auto = $pdp->fetch();
            if ($auto != null){
                return "$auto[0]#$auto[1]";
            }
        }
    }
    
    function getAuto($id, $flag){
        $sql = "Select * From auto Where ID=$id";
        if ($flag == 1){
            $pdp = $this->dbh->query($sql);
        }
        else{
            $pdp = $this->dbh1->query($sql);
        }
        $auto = $pdp->fetch();
        return $auto;
    }
}

$baza = new Baza();