<?php

class Baza {
    public $dbh;

    function __construct() {
        $konekcija = "mysql:host=localhost;dbname=shopping";
        $this->dbh = new PDO($konekcija,"root","");
    }

    function __destruct() {
        $this->dbh = NULL;
    }

    function ucitaj() {
        $sql = "SELECT * FROM customer";
        $pdp = $this->dbh->query($sql);
        $niz = $pdp->fetchAll();
        echo "<h1>Online kupovina</h1>";
        echo "<div>";
        echo "<h3>Kupovina</h3>";
        echo "<table id='tabela1'>";
        echo "<tr><th>IME</th><th>PREZIME</th><th>KREDIT</th><th>PRIKAZ KORPE</th></tr>";
        foreach ($niz as $kupac) {
            echo "<tr>";
            echo "<td>$kupac[1]</td>";
            echo "<td>$kupac[2]</td>";
            echo "<td>$kupac[3]</td>";
            echo "<td><a href='index.php?pk=".$kupac[0]."'>Prikazi korpu</a></td>";
            echo "</tr>";
        }
        echo "</table><br><br><br>";
        
        echo "<form action='index.php' method='post'>";
        echo "<table>";
        echo "<tr>";
        echo "<td>Kupac:</td>";
        echo "<td>";
        echo "<select name='kupac'>";
        foreach ($niz as $kupac) {
            echo "<option value='".$kupac[0]."'>$kupac[1] $kupac[2]</option>";
        }
        echo "</select>";
        echo "</td>";
        echo "</tr>";
        
        $sql = "SELECT * FROM product";
        $pdp = $this->dbh->query($sql);
        $niz = $pdp->fetchAll();
        
        echo "<tr>";
        echo "<td>Proizvod:</td>";
        echo "<td>";
        echo "<select name='proizvod'>";
        foreach ($niz as $proizvod) {
            echo "<option value='".$proizvod[0]."'>$proizvod[1]</option>";
        }
        echo "</select>";
        echo "</td>";
        echo "</tr>";
        echo "<tr>";
        echo "<td>Kolicina:</td>";
        echo "<td><input type='text' name='kolicina' value=''></td>";
        echo "</tr>";
        
        echo "<tr>";
        echo "<td><input type='submit' name='kupi' value='Kupi!'></td>";
        echo "<td></td>";
        echo "</tr>";
        echo "</table>";
        echo "</form>";
        echo "</div>";
    }
    
    function prikaziKorpu($id) {
        $sql = "SELECT * FROM customer WHERE id=$id";
        $pdp = $this->dbh->query($sql);
        $kupac = $pdp->fetch();
        
        $sql = "SELECT * FROM cart WHERE kupac_id=$id";
        $pdp = $this->dbh->query($sql);
        $korpa = $pdp->fetchAll();
        
        $ukupno = 0.0;
        echo "<div>";
        echo "<h3>Korpa za korisnika: <span style='color:red'>$kupac[1] $kupac[2]</span></h3>";
        echo "<table id='tabela1'>";
        echo "<tr><th>PROIZVOD</th><th>KOLICINA</th></tr>";
        foreach ($korpa as $stavka) {
            $sql = "SELECT * FROM product WHERE id=$stavka[2]";
            $pdp = $this->dbh->query($sql);
            $proizvod = $pdp->fetch();
            echo "<tr>";
            echo "<td>$proizvod[1]</td>";
            echo "<td>$stavka[3]</td>";
            echo "</tr>";
            $ukupno = $ukupno + $proizvod[2] * $stavka[3];
        }
        echo "</table>";
        echo "<br>UKUPNO ZA PLACANJE: $ukupno";
        echo "</div>";
    }
    
    function kupiProizvod() {
        if ($_POST['kolicina'] != "") {
            $idK = $_POST['kupac'];
            $idP = $_POST['proizvod'];
            $kol = $_POST['kolicina'];
            $sql = "SELECT * FROM product WHERE id=$idP";
            $pdp = $this->dbh->query($sql);
            $proizvod = $pdp->fetch();
            
            $sql = "SELECT * FROM customer WHERE id=$idK";
            $pdp = $this->dbh->query($sql);
            $kupac = $pdp->fetch();
            if ($kupac[3] == 0.0) {
                echo "<span style='color:red'>Nemate vise kredita!</span>";
                return;
            }
            if ($proizvod[2] * $kol > $kupac[3]) {
                echo "<span style='color:red'>Nemate dovoljno kredita za ovu kupovinu!</span>";
                return;
            }
            
            try {
                $this->dbh->beginTransaction();
                $sql = "INSERT INTO cart(kupac_id,proizvod_id,kolicina) VALUES ('$idK','$idP','$kol')";
                $pdo = $this->dbh->exec($sql);
                
                $novKredit = $kupac[3] - $proizvod[2] * $kol;
                
                $sql = "UPDATE customer SET kredit=$novKredit WHERE id=$kupac[0]";
                $pdo = $this->dbh->exec($sql);
                
                $this->dbh->commit(); //na kolokvijumu je radilo i bez ove linije
                
                header("Location:index.php?prik=$idK");
            } catch (Exception $ex) {
                $this->dbh->rollBack();
                echo "Nije moguce dodati u bazu!";
            }

            $this->prikaziKorpu($idK);
        }
        else {
            echo "<span style='color:red'>Niste uneli kolicinu!</span>";
        }
    }
}

$baza = new Baza();