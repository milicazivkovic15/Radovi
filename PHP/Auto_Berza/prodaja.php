<?php

if (isset($_POST['prodaja1'])){
    include_once 'Baza.php';
    if (isset($_POST['auto'])){
        foreach ($_POST['auto'] as $autoID){
            $a = $baza->getAuto($autoID,1);
            try{
                $baza->dbh->beginTransaction();
                $baza->dbh1->beginTransaction();
                $baza->dbh1->exec("INSERT into auto(ID, Marka, Tip, Kubikaza, Konjaza) values('$a[0]','$a[1]','$a[2]','$a[3]','$a[4]')");
                $baza->dbh->exec("DELETE from auto where ID='$a[0]'");
                $baza->dbh1->commit();
                $baza->dbh->commit();
            } catch (Exception $ex) {
                $baza->dbh->rollBack();
                $baza->dbh1->rollBack();
                echo "Greska";
            }
        }
    }
    header("Location:index.php");
}

if (isset($_POST['prodaja2'])){
    include_once 'Baza.php';
    if (isset($_POST['auto'])){
        foreach ($_POST['auto'] as $autoID){
            $a = $baza->getAuto($autoID,2);
            try{
                $baza->dbh->beginTransaction();
                $baza->dbh1->beginTransaction();
                $baza->dbh->exec("INSERT into auto(ID, Marka, Tip, Kubikaza, Konjaza) values('$a[0]','$a[1]','$a[2]','$a[3]','$a[4]')");
                $baza->dbh1->exec("DELETE from auto where ID='$a[0]'");
                $baza->dbh1->commit();
                $baza->dbh->commit();
            } catch (Exception $ex) {
                $baza->dbh->rollBack();
                $baza->dbh1->rollBack();
                echo "Greska";
            }
        }
    }
    header("Location:index.php");
}