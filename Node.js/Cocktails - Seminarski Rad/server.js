var express = require('express');
var engine = require('ejs-locals');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer = require('multer');
var db = require(__dirname + '/DBclass.js');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public')
    },
    filename: function (req, file, cb) {
        var temp = file.originalname.split('.');
        var ext = temp[temp.length - 1];

        cb(null, popuni.generateRandomString() + "." + ext)
    }
})

var upload = multer({
    storage: storage
}).array('pictures');
var popuni = require(__dirname + '/popuni.js');

var server = app.listen(80, function () {
    console.log("Started");

});

app.set('trust proxy', 1);

app.use(cookieParser());

app.use(session({
    httpOnly: false,
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(express.static('public'));

app.engine('ejs', engine);

app.set('view engine', 'ejs');

var logIn = false;
app.post('/login', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            popuni.error2(res, "Greska!", "/inserted");
        }
        else {
            if (user == "" || pass == "") {
                res.redirect('/error1');
            }
            else {

                var user = req.body.user;
                var pass = req.body.pass;
                if (user == "milica" && pass == "milica")
                    res.redirect('/login');
                else
                    res.redirect('/fail');
            }

        }

    });
});

app.post('/inserted', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            popuni.error2(res, "Greska!", "/home3");
        }
        else {
            if (req.files[0] == undefined)
                res.redirect('/error2');
            else if (name == "" || description == "" || price == "") {
                res.redirect('/error1');
            }
            else {

                var name = req.body.name;
                var description = req.body.description;
                var price = req.body.price;
                var ingredients = req.body.ingredients;
                var sastojak = ingredients + "";

                if (ingredients == undefined)
                    sastojak = "";

                var pictures = req.files[0];
                var baza = new db.DBclass();
                baza.insertCocktails(name, description, pictures.filename, sastojak, price);

                baza.kill();
                res.redirect('/insertedCocktails');
            }

        }

    });
});
app.post('/delete', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            popuni.error2(res, "Greska!", "/inserted");
        }
        else {

            var id = req.body.name;

            var baza = new db.DBclass();
            baza.deleteCocktails(id);

            baza.kill();
            res.redirect('/deletedCocktails');
        }



    });
});
app.post('/update', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            popuni.error2(res, "Greska!", "/inserted");
        }
        else {

            var id = req.body.name;
            var desc = req.body.description;
            var ingredients = req.body.ingredients;
            var sastojak = ingredients + "";

            if (ingredients == undefined)
                sastojak = "";


            var baza = new db.DBclass();
            baza.updateCocktails(id, desc, sastojak);

            baza.kill();
            res.redirect('/updateCocktails');
        }



    });
});

app.get("*", function (req, res) {
    var requestPath = req.url.split('?')[0];

    var text1 = undefined;

    if (requestPath == '/') {
        text1 = popuni.Home();
    }
    else if (requestPath == '/insertedCocktails') {
        text1 = popuni.IsertedCocktails("inserted");
    } else if (requestPath == '/deletedCocktails') {
        text1 = popuni.IsertedCocktails("deleted");
    } else if (requestPath == '/updateCocktails') {
        text1 = popuni.IsertedCocktails("updated");
    }
    else if (requestPath == '/home') {
        text1 = popuni.Home();
    } else if (requestPath == '/login') {
        text1 = popuni.IsertedCocktails("Login");
        logIn = true;
    }
    else if (requestPath == '/fail') {
        var text1 = "<div class='container'>"
            + "<div class='panel panel-default'>"

            + "<br/><br/><p style='text-align:center'>Neuspesno logovanje, pokusajte ponovo!</p><br/><br/>"

            + "</div>"
            + "</div>";
        logIn = false;
    }

    else if (requestPath == '/error1') {
        text1 = popuni.error1();
    }


    else if (requestPath == '/home1') {
        text1 = popuni.Home1("");
    }
    else if (requestPath == '/home2') {
        text1 = popuni.Home2("home2");
    }
    else if (requestPath == '/home3') {
        if (logIn == true) {
            text1 = popuni.Add();
            text1 += popuni.Delete();
            text1 += popuni.Update();
        } else {
            var text1 = "<div class='container'>"
                + "<div class='panel panel-default'>"

                + "<br/><br/><p style='text-align:center'>Niste ulogovani, nemate pristup izmeni podataka!</p><br/><br/>"

                + "</div>"
                + "</div>";
        }

    }
    else if (requestPath == '/error2') {
        text1 = popuni.error2(res, "Greska!", "/home3");
    }

    if (text1 != undefined) {
        res.render('../template.ejs', {

            text: text1

        });

    }
    else {
        res.setHeader('content-type', 'text/plain');
        res.send('Ne postoji stranica');
    }


});