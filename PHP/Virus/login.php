<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <form action="login.php" method="post">
            Username: <input type="text" name="user" value="" /><br>
            Password: <input type="password" name="pass" value="" /><br>
            <input type="submit" value="Login" name="login" />
        
        </form>
        
        
        <?php
            include 'konfig.php';
            session_start();
            if(isset($_SESSION['usr'])){
                header("Location: prikaz.php");
            }
            else if(isset($_POST['login'])){
                    $upit=Doctrine_Query::create()
                         ->select("*")
                         ->from("korisnik");
                    $users=$upit->fetchArray(Doctrine_Core::HYDRATE_ARRAY);
                    
                    foreach ($users as $u){
                        if(strcmp($u['username'], $_POST['user'])==0 && strcmp($u['password'], sha1($_POST['pass']))==0){
                            $cars= Doctrine::getTable("automobil")->findBy("korisnik_id", $u['id']);
                            
                            foreach ($cars as $c){
                                if (explode(' ', $c['reg_broj'])[0]=="KG"){
                                    echo "</br>Uspesno logovanje</br><a href='prikaz.php'>Prikaz</a>";
                                
                                    $_SESSION['usr']=$_POST['user'];
                                }
                            }
                            break;
                        }
                    }
                    //header("Location: login.php");
                }
        ?>
    </body>
</html>
