<?php
    include_once 'prva.php';
    //$baza->analiza();
    analiza($baza);
    
    function analiza($baza) {
        $crvene = array('napad','terorizam','borba','bojkot','bomba','izdaja','udarac','prevara','sipka','kradja','zlocudan');        
        $crveneBr = array(0,0,0,0,0,0,0,0,0,0,0);
        $sql = "Select * From vesti";
        $pdp = $baza->dbh->query($sql);
        $niz = $pdp->fetchAll();
        echo "<h2>BIA analiza - autorizovani pristup</h2>";
        echo "<h4>pretraga reci :'napad','terorizam','borba','bojkot','bomba','izdaja','udarac','prevara','sipka','kradja','zlocudan' </h4>";
        echo "<table style='border:1px solid black'>";
        foreach ($niz as $vest) {
            echo "<tr>";
            echo "<td style='border:1px solid black'><a href=''>$vest[1]</a></td>";
            echo "<td style='border:1px solid black'>";
            $reci = explode(" ", $vest[2]);
            foreach ($reci as $rec1) {
                $rec = strtolower($rec1);
                $i = 0;
                $flag = 0;
                foreach ($crvene as $crvena) {
                    if (strpos($rec, $crvena) !== false){
                        $flag = 1;
                        echo "<span><b><a href='analiza.php?c=".$crvena."' style='color:red;'>$rec1</a></b></span> ";
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
    
    if (isset($_GET['c'])) {
        $sql = "Select * From vesti";
        $pdp = $baza->dbh->query($sql);
        $niz = $pdp->fetchAll();
        echo "<h2>BIA analiza - autorizovani pristup - Izabrana rec: <span  style='color:red;'>".$_GET['c']."</span></h2>";
        echo "<table style='border:1px solid black'>";
        foreach ($niz as $vest) {
            $reci = explode(" ", $vest[2]);
            foreach ($reci as $rec1) {
                $rec = strtolower($rec1);
                if (strpos($rec, $_GET['c']) !== false){
                    echo "<tr>";
                    echo "<td style='border:1px solid black'><a href=''>$vest[1]</a></td>";
                    echo "<td style='border:1px solid black'>$vest[2]</td>";
                    echo "</tr>";
                    break;
                }
            }
        }
        echo "</table>";
    }