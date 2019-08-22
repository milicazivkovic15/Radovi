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
        <style>
            #tabela1, #tabela1 td, #tabela1 th{
                border: 1px solid black;
            }
            div {
                padding-bottom: 20px;
                padding-left: 20px;
                padding-right: 20px;
                border: 1px solid black;
                float:left;
                margin: 20px;
            }
        </style>
    </head>
    <body>
        <?php
            include_once './baza.php';
            $baza->ucitaj();
            
            if (isset($_GET['prik'])) {
                $baza->prikaziKorpu($_GET['prik']);
            }
            
            if (isset($_GET['pk'])) {
                $baza->prikaziKorpu($_GET['pk']);
            }
            
            if (isset($_POST['kupi'])) {
                $baza->kupiProizvod();
            }
        ?>
    </body>
</html>
