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
        <?php
            if(isset($_GET['id'])){
                
                include_once  'Baza.php';
               
                $niz= explode("##",$b->detalji($_GET['id'],1));
                echo "<b>Detalji o automobilu:</b><br>";
                echo "Kubikaza:".$niz[0]."<br>";
                echo "Konjaza:".$niz[1];
            }
        ?>
    </body>
</html>
