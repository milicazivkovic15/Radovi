<html>
    <head></head>
    <body>
        <?php
        if (isset($_GET['id'])){
            include_once 'Baza.php';
            $auto = explode("#", $baza->detalji($_GET['id']));
            echo "<h3>Detalji o automobilu</h3>";
            echo "Kubikaza: $auto[0]<br>";
            echo "Konjaza: $auto[1]";
        }
        ?>
    </body>
</html>