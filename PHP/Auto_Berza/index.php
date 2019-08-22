<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            div{
                float: left;
                border: 1px solid black;
                min-height: 100px;
                min-width: 200px;
                margin: 30px;
            }
            input{
                margin: 10px;
            }
        </style>
    </head>
    <body>
        <?php
        echo "<h2> IMI Auto Berza</h2>";
            include_once 'Baza.php';
            $baza->ucitajAutomobile1();
            $baza->ucitajAutomobile2();
        ?>
    </body>
</html>
