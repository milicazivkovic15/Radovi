<?php

class Baza{
    
    public $dbh;
    
    function __construct() {
        $konekcija = "mysql:host=localhost;dbname=press";
        $this->dbh = new PDO($konekcija,"root","");
    }
    
    function __destruct() {
        $this->dbh = NULL;
    }
    
    function ucitajVesti() {
        $sql = "Select * From vesti";
        $pdp = $this->dbh->query($sql);
        $niz = $pdp->fetchAll();
        echo "<h2>IMI Press vesti</h2>";
        echo "<table>";
        foreach ($niz as $vest) {
            echo "<tr>";
            echo "<td><a href='#'>$vest[1]</a></td>";
            echo "<td>$vest[2]</td>";
            echo "<td><a href='index.php?id=".$vest[0]."' name='izmeniLink'>IZMENI</a></td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    function dodajIzmenu($id) {
        $sql = "Select * From vesti Where id=$id";
        $pdp1 = $this->dbh->query($sql);
        $vest = $pdp1->fetch();
        $sql = "Select * From kategorija";
        $pdp2 = $this->dbh->query($sql);
        $kategorije = $pdp2->fetchAll();
        $sql = "Select * From novinar";
        $pdp3 = $this->dbh->query($sql);
        $novinari = $pdp3->fetchAll();
        
        echo "<br><br><form method='post' action='index.php?idV=$id'>";
        echo "Naslov: <input style='min-width:300px;' type='text' name='naslov' value='".$vest[1]."'><br><br>";
        echo "Opis:&nbsp;&nbsp;&nbsp;&nbsp; <textarea style='min-width:300px;min-height:100px;' name='opis'>$vest[2]</textarea><br><br>";
        echo "Kategorija: <select name='selectK'>";
        foreach ($kategorije as $kat) {
            echo "<option value='".$kat[0]."'>$kat[1]</option>";
        }
        echo "</select>";
        //echo " Trenutno: $vest[3]";
        echo "<br><br>Novinar:&nbsp;&nbsp;&nbsp;&nbsp; <select name='selectN'>";
        foreach ($novinari as $nov) {
            echo "<option value='".$nov[0]."'>$nov[1]</option>";
        }
        echo "</select>";
        //echo " Trenutno: $vest[4]";
        echo "<br><br><input type='submit' name='izmeniButton'>";
        echo "</form>";
    }
    
    function izmeniVest($id,$naslov,$opis,$idK,$idN) {
        try{
            $this->dbh->beginTransaction();
            $this->dbh->exec("UPDATE vesti SET naslov='".$naslov."',opis='".$opis."',kategorija_id='".$idK."',novinar_id='".$idN."' WHERE id='".$id."'");
            $this->dbh->commit();
            header("Location: index.php");
        } catch (Exception $ex) {
            $this->dbh->rollBack();
            echo "GRESKA";
        }
    }
    /*
    function analiza() {
        $crvene = array('napad','terorizam','borba','bojkot','bomba','izdaja','udarac','prevara','sipka','kradja','zlocudan');        
        $crveneBr = array(0,0,0,0,0,0,0,0,0,0,0);
        $sql = "Select * From vesti";
        $pdp = $this->dbh->query($sql);
        $niz = $pdp->fetchAll();
        echo "<h2>BIA analiza - autorizovani pristup</h2>";
        echo "<table style='border:1px solid black'>";
        foreach ($niz as $vest) {
            echo "<tr>";
            echo "<td style='border:1px solid black'><a href='#'>$vest[1]</a></td>";
            echo "<td style='border:1px solid black'>";
            $reci = explode(" ", $vest[2]);
            foreach ($reci as $rec1) {
                $rec = strtolower($rec1);
                $i = 0;
                $flag = 0;
                foreach ($crvene as $crvena) {
                    if ($rec == $crvena) {
                        $flag = 1;
                        echo "<span><b><a href='#' style='color:red;'>$rec1</a></b></span> ";
                        $crveneBr[$i] = $crveneBr[$i] + 1;
                        break;
                    }
                    $i = $i + 1;
                }
                if ($flag == 0){
                    echo "$rec1 ";
                }
            }
            echo "</td>";
            $i = 0;
            $tekst = "";
            foreach ($crveneBr as $broj) {
               if ($broj > 0) {
                   $tekst = $tekst."$crvene[$i] = $broj <br>";
               }
               $i = $i + 1;
            }
            echo "<td style='border:1px solid black;min-width:100px'>$tekst</td>";
            echo "</tr>";
            $crveneBr = array(0,0,0,0,0,0,0,0,0,0,0);
        }
        echo "</table>";
    }
    */
}

$baza = new Baza();

