<?php

    if(isset($_POST['prodaja1'])){
       
        include_once 'Baza.php';
        $nizID=$b->getID(1);
        if(isset($_POST['auto'])) {  
           
            foreach($_POST['auto'] as $car) {
                
                foreach ($nizID as $red){

                    if(  $car==="1#".$red[0]){
                        $auto=$b->getAuto($red[0],1);

                        foreach ($auto as $a){
                            try {
                                $b->dbh->beginTransaction();
                                $b->dbh1->beginTransaction();
                                $b->dodaj(2,$a);
                                //$b->dbh1->exec("INSERT into auto(ID, Marka, Tip, Kubikaza, Konjaza) values($a[0],$a[1],$a[2],$a[3],$a[4])");
                                $b->dbh->exec("DELETE FROM auto WHERE ID=$a[0]");
                                $b->dbh1->commit();
                                $b->dbh->commit();
                            } catch (Exception $exc) {
                                $b->dbh->rollBack();
                                $b->dbh1->rollBack();

                                echo $exc->getTraceAsString();
                            }
                            break;
                        }
                    }
                }
            }
        }
        $b->ucitajAutomobile();
        $b->ucitajAutomobile2();
        
    }
     if(isset($_POST['prodaja2'])){
        include_once 'Baza.php';
        $nizID=$b->getID(2);
         if( isset($_POST['auto'])){
             
                foreach ($_POST['auto'] as $car) {
                    
                    foreach ($nizID as $red){
                        
                        if( $car==="2#".$red[0]){
                            $auto=$b->getAuto($red[0],2);
                            foreach ($auto as $a){
                                try {
                                    $b->dbh->beginTransaction();
                                    $b->dbh1->beginTransaction();
                                    $b->dodaj(1,$a);
                                    //$b->dbh->exec("INSERT into auto(ID, Marka, Tip, Kubikaza, Konjaza) values($a[0],$a[1],$a[2],$a[3],$a[4])");
                                    $b->dbh1->exec("DELETE FROM auto WHERE ID=$a[0]");
                                    $b->dbh1->commit();
                                    $b->dbh->commit();
                                } catch (Exception $exc) {
                                    $b->dbh->rollBack();
                                    $b->dbh1->rollBack();
                                    echo "GRESKA ";
                                    echo $exc->getTraceAsString();
                                }
                                break;
                            }
                        }
                    }
                }
         }
        $b->ucitajAutomobile();
        $b->ucitajAutomobile2();
        
    }
