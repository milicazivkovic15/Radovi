<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <h1>Logovanje</h1>
        <form method="post" action="login.php">
            <table>
            <tr><td>Username:</td><td><input type="text" name="username" value=""></td></tr>
            <tr><td>Password:</td><td><input type="text" name="password" value=""></td></tr>
            </table>
            <input type="submit" name="posalji" value="Posalji">
        </form>
        
        <?php
            session_start();
            
            if (isset($_POST['posalji'])) {
                $flag = 0;
                $xml = simplexml_load_file("users.xml") or die ("Ne mogu da ucitam fajl users.xml!");
                foreach ($xml->user as $user) {
                    if ($user->log->username == $_POST['username'] && $user->log->password == $_POST['password'] && $user->log->username['aktivan'] == "1") {
                        $_SESSION['user'] = $_POST['username'];
                        $mejl = "$user->email";
                        $_SESSION['email'] = $mejl;
                        echo "<h3>Uspesno logovanje!</h3>";
                        echo "<a href='prva.php'>Prva</a><br>";
                        echo "<a href='druga.php'>Druga</a><br>";
                        $flag = 1;
                    }
                }
                if ($flag == 0) {
                    echo "<br><span style='color:red'>Pogresan user/pass ili korisnik nije aktivan!</span>";
                }
            }
        ?>
    </body>
</html>
