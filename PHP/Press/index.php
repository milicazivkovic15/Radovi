<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            table{
                border: 1px solid black;
            }
            td{
                border: 1px solid black;
                padding: 10px;
            }
        </style>
    </head>
    <body>
        <?php
            include_once 'prva.php';
            $baza->ucitajVesti();
            
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $baza->dodajIzmenu($id);
            }
            
            if (isset($_POST['izmeniButton'])) {
                $idV = $_GET['idV'];
                $naslov = $_POST['naslov'];
                $opis = $_POST['opis'];
                
                $idN = intval($_POST['selectN']);
                $idK = intval($_POST['selectK']);
                $baza->izmeniVest($idV,$naslov,$opis,$idK,$idN);
            }
        ?>
    </body>
</html>
