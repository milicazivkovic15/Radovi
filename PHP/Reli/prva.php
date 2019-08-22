<?php
session_start();

if (isset($_SESSION['user'])) {
    $mejl = explode("@",$_SESSION['email']);
    echo "Korisnicko ime: $mejl[0]<br><br>";
    
    echo "Broj dana od 17.08.2014. pa do danas iznosi: ".intval((time()-mktime(0,0,0,8,17,2014))/60/24/60)."<br><br>";
    
    $xml = simplexml_load_file("users.xml") or die ("Ne mogu da ucitam fajl users.xml!");
    foreach ($xml->user as $user) {
        if ($user->group == "admin") {
            echo "<span style='color:red'>$user->fname $user->lname $user->email</span><br>";
        }
        else {
            echo "<span style='color:blue'>$user->fname $user->lname $user->email</span><br>";
        }
    }

}
else {
    echo "Niste ulogovani! <a href='login.php'>Login</a>";
}