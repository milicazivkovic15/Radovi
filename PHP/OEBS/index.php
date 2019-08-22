<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            table, td, th{
                border: 1px solid black;
            }
        </style>
    </head>
    <body>
        <?php
            include_once 'izjave.php';
            $baza->ucitajTeme();
            
            if (isset($_POST['prikazi'])) {
                $idTeme = $_POST['tema'];
                $sql = "SELECT * FROM topiccou";
                $pdp = $baza->dbh->query($sql);
                $niz = $pdp->fetchAll();
                $trazene = array('dobar','odlican','razvoj','napredak','buducnost');
                echo "<br><table>";
                echo "<tr><th>Ime drzave</th><th>Izjava predstavnika</th><th>Klasifikacija</th></tr>";
                foreach ($niz as $izjava) {
                    if ($izjava[0] == $idTeme) {
                        $sql = "SELECT * FROM countries WHERE id=$izjava[1]";
                        $pdp = $baza->dbh->query($sql);
                        $drzava = $pdp->fetch();
                        $reci = explode(" ",$izjava[2]);
                        $klasifikacija = "Negativno";
                        $i = 0;
                        foreach ($reci as $rec) {
                            if (strtolower($rec) == "srbija") {
                                for ($j = $i - 3; $j <= $i + 3; $j++) {
                                    if ($j > -1 && $j < count($reci) && $i != $j) {
                                        foreach ($trazene as $trazena) {
                                            if (strpos(strtolower($reci[$j]), $trazena) !== false){
                                                $reci[$j] = "<span style='color:red'>$reci[$j]</span>";
                                                $klasifikacija = "Pozitivan";
                                            }
                                        }
                                    }
                                }
                            }
                            $i = $i + 1;
                        }
                        $tekst = "";
                        foreach ($reci as $rec) {
                            $tekst = $tekst.$rec." ";
                        }
                        echo "<tr>";
                        echo "<td><a href='izjave.php?drzava=".$drzava[0]."|".$drzava[1]."'>$drzava[1]</a></td>";
                        echo "<td>$tekst</td>";
                        echo "<td>$klasifikacija</td>";
                        echo "</tr>";
                    }
                }
                echo "<table>";
            }
        ?>
    </body>
</html>
