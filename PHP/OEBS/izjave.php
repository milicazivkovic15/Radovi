<?php

class Baza {
    public $dbh;
    
    function __construct() {
        $konekcija = "mysql:host=localhost;dbname=oebs;";
        $this->dbh = new PDO($konekcija,"root","");
    }
    
    function __destruct() {
        $this->dbh = NULL;
    }
    
    function ucitajTeme() {
        $sql = "SELECT * FROM topics";
        $pdp = $this->dbh->query($sql);
        $niz = $pdp->fetchAll();
        echo "<h3>Izaberite temu:</h3>";
        echo "<form method='post' action='index.php'>";
        echo "<select name='tema'>";
        foreach ($niz as $topic) {
            echo "<option value='".$topic[0]."'>$topic[1]</option>";
        }
        echo "</select>";
        echo "<br><br><input type='submit' name='prikazi' value='Prikazi'>";
        echo "</form>";
    }
}

$baza = new Baza();

if (isset($_GET['drzava'])) {
    echo "<head><style> table,td,th { border: 1px solid black; }</style></head>";
    $drzava = explode("|",$_GET['drzava']);
    $sql = "SELECT * FROM topiccou";
    $pdp = $baza->dbh->query($sql);
    $niz = $pdp->fetchAll();
    echo "<h3>Izjave zemlje: $drzava[1]</h3>";
    echo "<table>";
    echo "<tr><th>Tema</th><th>Izjava predstavnika</th></tr>";
    foreach ($niz as $izjava) {
        if ($izjava[1] == $drzava[0]) {
            $sql = "SELECT * FROM topics WHERE id=$izjava[0]";
            $pdp = $baza->dbh->query($sql);
            $tema = $pdp->fetch();
            echo "<tr>";
            echo "<td>$tema[1]</td>";
            echo "<td>$izjava[2]</td>";
            echo "</tr>";
        }
    }
    echo "<table>";
}
