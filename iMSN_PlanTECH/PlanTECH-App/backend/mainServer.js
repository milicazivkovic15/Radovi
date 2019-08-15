var express = require('express');
var cookieParser = require('cookie-parser');
var db = require("./modules/iMSN_database");
var tokenGenerator = require('jsonwebtoken');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var KEY = 'my-secret-key-1235';
var fs = require('fs');
var mail = require("./modules/iMSN_mailSend");
var forecast = require("./modules/iMSN_forecast");
var reqSend = require("./modules/iMSN_requestSender");
var cors = require('cors');
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
app.use(cookieParser());
var multer = require('multer');

var INTERVAL = 60 * 60 * 1000;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/images/uplatnice');
    },
    filename: function (req, file, cb) {
        var temp = file.originalname.split('.');
        var ext = temp[temp.length - 1];

        var path = generateRandomString(ext);
        cb(null, path);
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fieldSize: '5MB'
    }
}).any();

var auth = require('http-auth');

var basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/data/users.htpasswd"
});

app.get("/", auth.connect(basic), function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});


app.post('/loginMobile', urlencodedParser, function (req, res) {
    var user = req.body;

    db.login(user.user, user.pass, function (data, type_returned, date) {
        if (data == false) {
            res.send({ status: data, registered: type_returned });
        }
        else {
            if (date) {
                var tokenString = tokenGenerator.sign({
                    ID: data
                }, KEY);
                res.send({ 'status': true, 'token': tokenString, 'type_of_user': type_returned, 'date': true });
            }
            else {
                res.send({ 'status': true, 'date': false });
            }
        }
    });
});


app.get("/mobile", function (req, res) {
    var token = req.query.token;
    var ID = getID(token);

    if (ID != -1) {
        res.sendFile(__dirname + "/public/index.html");
    }
    else {
        res.send("404: Page doesn't exists!");
    }
});

app.use(express.static('public'));

app.get("*", auth.connect(basic), function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/logout', urlencodedParser, function (req, res) {
    res.send({});
});

app.post('/paypalRegistration/:data', urlencodedParser, function (req, res) {
    if (req.body.payment_status != 'Completed') return;
    var user = {};
    var tmp = req.params.data.split("-:-");
    user.email = tmp[0];
    user.fname = tmp[1];
    user.lname = tmp[2];
    user.password = tmp[3];
    user.phone = tmp[4];
    user.username = tmp[5];
    if (user.phone == undefined || user.phone == 'undefined') user.phone = '';
    user.accType = 3;
    if (req.body.mc_gross == 49.99)
        user.PaymentType = 1;
    if (req.body.mc_gross == 99.99)
        user.PaymentType = 2;
    else
        user.PaymentType = 3;

    var transactionID = req.body.payment_date;

    db.checkTransaction(transactionID, function () {
        db.insertRegisteredUser(user, function () {

            mail.sendMail(user.email, "Plaćanje uspesno", "Vaša uplata je primljena, možete se ulogovati!");
        });
    });

});

app.post('/paypalUpdate/:data', urlencodedParser, function (req, res) {
    if (req.body.payment_status != 'Completed') return;

    var username = req.params.data;
    var ID = getID(username);

    var PaymentType = req.body.option_selection1.split(" - ")[1];
    if (PaymentType == undefined || PaymentType == '') {
        if (req.body.mc_gross == 49.99)
            PaymentType = 1;
        if (req.body.mc_gross == 99.99)
            PaymentType = 2;
        else
            PaymentType = 3;
    }
    var transactionID = req.body.payment_date;

    db.checkTransaction(transactionID, function () {
        if (ID == -1) {
            db.updateData(username, undefined, PaymentType, function (email) {
                mail.sendMail(email, "Plaćanje uspesno", "Vaša uplata je primljena, možete se ulogovati!");
            });
        }
        else {
            db.updateData(undefined, ID, PaymentType, function (email) {
                mail.sendMail(email, "Plaćanje uspesno", "Vaša uplata je primljena, možete se ulogovati!");
            });
        }
    });
});


app.post('/login', urlencodedParser, function (req, res) {
    var user = JSON.parse(req.body.json).input;

    db.login(user.user, user.pass, function (data, type_returned, date) {
        if (data == false) {
            res.send({ status: data, registered: type_returned });
        }
        else {
            if (date) {
                var tokenString = tokenGenerator.sign({
                    ID: data
                }, KEY);
                res.send({ 'status': true, 'token': tokenString, 'type_of_user': type_returned, 'date': true });
            }
            else {
                res.send({ 'status': true, 'date': false });
            }
        }
    });
});

app.post('/forValidation', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    db.usersForValidation(function (rows) {
        if (rows == false || rows.length == 0) res.send({ data: null });
        else res.send({ data: rows });
    });
});

app.post('/saveEditedUserData', urlencodedParser, function (req, res) {
    var user = JSON.parse(req.body.json).input;
    db.saveUserDataEdit(user, function (s) {
        res.send(s);
    });

});

app.post('/getUsersForEdit', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    db.getUsersForEdit(function (rows) {
        if (rows == false || rows.length == 0) res.send({ data: null });
        else res.send({ data: rows });
    });
});

app.post('/verifyToken', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;
    try {
        var status = tokenGenerator.verify(token, KEY);
        res.send({ tokenStatus: true });
    }
    catch (err) {
        res.send({ tokenStatus: false })
    }
});

app.post('/deleteOldNotif', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.username);
    db.deleteOldNotif(ID, function () {
        res.send(true);
    });
});
app.post('/acceptAccount', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var accID = body.accID;
    var accepted = body.accAccepted;

    if (accepted) {
        db.moveUser(accID, function (email) {
            mail.sendMail(email, "Obaveštenje!", "Vaš nalog je odobren, možete se prijaviti!");
        });
    }
    else {
        db.deleteUser(accID, function (email) {
            mail.sendMail(email, "Obaveštenje!", "Vaš nalog je odobren, možete se prijaviti!");
        });
    }

    res.send({ ID: accID });
});

app.post('/registration', urlencodedParser, function (req, res) {
    var user = JSON.parse(req.body.json)
    db.insertRegisteredUser(user, function (status) {
        if (status) mail.sendMail(user.email, "Obaveštenje", "Uspešno ste se registrovali!");
        res.send({ status: status });
    });


});
app.post('/getCrops', urlencodedParser, function (req, res) {
    db.getCrops(function (crops) {
        res.send({ crops: crops });

    });


});
app.post('/insertCrops', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;

    db.insertCrops(crop.crop, function (status) {
        res.send({ status: status });
    });


});
app.post('/deleteCrops', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.deleteCrops(crop.crop, function (status) {
        res.send({ status: status });
    });
});
app.post('/updateCrops', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.updateCrops(crop.crop, crop.ID, function (status) {
        res.send({ status: status });
    });
});
app.post('/getOnlySubCrops', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.getSubCrops(crop.crop, function (crops) {
        res.send({ crops: crops });
    });
});
app.post('/getSubCrops', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.getSubCrops(crop.crop, function (crops) {
        db.getUserSubCrops(crop.crop, crop.username, function (userCrops, ID) {
            db.getOwnerSubCrops(crop.crop, ID, function (ownerCrops) {
                db.getFreeUsersSubCrops(crop.crop, ID, function (freeUsersCrops) {
                    res.send({ crops: crops, userCrops: userCrops, ownerCrops: ownerCrops, freeUsersCrops: freeUsersCrops });
                });
            });
        });
    });
});
app.post('/insertSubCrop', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.insertSubCrop(crop.ID, crop.crop, crop.username, function (status) {
        res.send({ status: status });
    });
});

app.post('/updateSubCrop', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;

    db.updateSubCrop(crop.IDsubcrop, crop.crop, function (status) {
        res.send({ status: status });
    });
});


app.post('/getManufacturer', urlencodedParser, function (req, res) {

    db.getManufactures(function (data) {
        res.send({ manuf: data });
    });
});

app.post('/getSensors', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;

    reqSend.sendRequest("localhost:2037/getSensorTypes", {}, function (err, data) {
        var tmp;

        data = JSON.parse(data);

        if (err || data.data == null) tmp = null;
        else tmp = JSON.parse(data.data);

        res.send({ tmp });
    });
});


app.post('/deleteSubCrop', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.deleteSubCrop(crop.IDsub, function (status) {
        res.send({ status: status });
    });
});
app.post('/insertGeneralSubCrop', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.insertGeneralSubCrop(crop.ID, crop.crop, crop.manuf, function (status) {
        res.send({ status: status });
    });
});

app.post('/updateGeneralSubCrop', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.updateGeneralSubCrop(crop.IDcrop, crop.IDsubcrop, crop.crop, function (status) {
        res.send({ status: status });
    });
});
app.post('/deleteGeneralSubCrop', urlencodedParser, function (req, res) {
    var crop = JSON.parse(req.body.json).input;
    db.deleteGeneralSubCrop(crop.IDsub, function (status) {
        res.send({ status: status });
    });
});

app.post('/allTickets', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;
    db.getAllTickets(function (rows) {
        if (rows == false || rows.length == 0) res.send({ arr: null });
        else res.send({ arr: rows });
    });
});

app.post('/sendMessage', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    db.getEmailFromSupportTicket(body.ID, function (email) {
        mail.sendMail(email, "Odgovor Tehnicke podrske", body.message);
        db.deleteSupportTicket(body.ID);
        res.send(true);
    });
});

app.post('/deleteMessage', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    db.deleteSupportTicket(body.id);
    res.send(true);
});
app.post('/forgottenPass', urlencodedParser, function (req, res) {
    var rnd = "qwertyuiopasdfghjklzxcvbnm1234567890ASDQWEZXCRTYFGHVBNUIOJKLNM";
    var length = 8;
    var temp = "iMSN_";

    var i;

    for (i = 0; i < length; i++) {
        temp += rnd.charAt((Math.random() * 100) % rnd.length);
    }

    var message = "Ovo je Vasa trenutna lozika: " + temp;
    var body = JSON.parse(req.body.json).input;
    db.getEmail(body.username, temp, function (email) {
        if (email) {
            mail.sendMail(email, "Promenjena lozinka", message);
            res.send({ status: true });
        }
        else
            res.send({ status: false });
    });



});

app.post('/registerAgronomist', urlencodedParser, function (req, res) {

    var body = JSON.parse(req.body.json).input;

    var user = body.user;
    var userType = body.userType;
    db.insertAgronomist(user, userType, function (status) {
        res.send({ status: status });
    });
});

app.post('/allPermissions', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;

    var ID = getID(token);
    db.getPermissions(ID, function (perms) {
        res.send(perms);
    });
});

app.post('/getPermission', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;

    var ID = getID(token);
    db.getEditPermissions(ID, function (perms) {
        res.send({ status: perms });
    });
});

app.post('/deletePermissions', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;
    var myID = getID(body.token);
    db.deletePermissions(ID, myID);
    db.getMail(ID, function (email) {
        db.getUser(myID, function (user) {

            mail.sendMail(email, "Otkaz!", 'Više niste zaposleni kod ' + user.Fname + " " + user.Lname);

        })
    })
    res.send(true);
});

function getID(token) {
    try {
        return tokenGenerator.verify(token, KEY).ID;
    }
    catch (err) {
        return -1;
    }
}

app.post('/allPermissionsOfOwner', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;

    var ID = getID(token);
    db.getPermissionsOfOwner(ID, function (data) {
        if (data == false) res.send({ perms: [] });
        else res.send({ perms: data });
    });
});

app.post('/savePermissions', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var perms = body.perms;
    db.savePermissions(perms);
    res.send({});
});

app.post('/getCropsForParcel', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;
    db.getCropsForParcel(ID, function (crops) {
        res.send({ data: crops });
    });
});

app.post('/deleteParcel', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;
    db.deleteParcel(ID, function () {
        reqSend.sendRequest("/deleteParcelRules", { parcelID: ID }, function () { });
        reqSend.sendRequest("localhost:2037/deleteParcelSensor", { parcelID: ID }, function () { });

        res.send({});
    });
});

app.post('/getSensorsForGeneralMap', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;

    var ID = getID(token);

    db.getOwners(ID, function (data) {
        var tmp = [ID];

        var into = "(" + ID;
        for (var i = 0; i < data.length; i++)
            if (tmp.find(el => el == data[i].UserID) == null) into += "," + data[i].UserID;
        into += ")";

        reqSend.sendRequest('localhost:2037/getSensorsForGeneralMap', { IDs: into }, function (err, data) {
            res.send(data);
        });
    });
});

app.post('/getParcelSensor', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;

    reqSend.sendRequest('localhost:2037/getParcelSensor', { sensorID: ID }, function (err, data) {
        res.send(data);
    });
});

app.post('/deleteSensor', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;

    reqSend.sendRequest('localhost:2037/deleteSensor', { sID: ID }, function (err, data) {
        res.send(data);
    });
});

app.post('/getParcels', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;

    var ID = getID(token);

    db.getParcels(ID, function (data) {
        if (data == false || data.length == 0) res.send({ parcels: [] });
        else res.send({ parcels: data });
    });
});

app.post('/getAllSensors', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var parcelID = body.ID;

    db.getOwnerID(parcelID, function (user) {
        reqSend.sendRequest('localhost:2037/getSensors', { ID: parcelID, userID: user }, function (err, data) {
            res.send(data);
        });
    });
});

app.post('/getAllSensorsForUser', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.userID;
    if (ID == -1) ID = getID(body.token);

    reqSend.sendRequest('localhost:2037/getSensors', { userID: ID }, function (err, data) {
        res.send(data);
    });
});

app.post('/getCoords', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;

    db.getCoords(ID, function (data) {
        res.send({ coords: data });
    });
});

app.post('/getAllCoords', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;
    var ID = getID(token);
    db.getAllCoords(ID, function (data) {
        res.send({ coords: data });

    });

});

app.post('/saveParcelEdit', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var ID = getID(body.token);
    var parcel = JSON.parse(body.data);

    db.saveParcelEdit(parcel, function () { });
    reqSend.sendRequest('localhost:2037/saveParcelEdit', { parcelID: parcel.ID, userID: ID, coords: JSON.stringify(parcel.Sensors) }, function (err, data) { });
    res.send({});
});


app.post('/getSensorByIp', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var ip = body.ip;

    reqSend.sendRequest('localhost:2037/getSensorByIp', { ipAddress: ip }, function (err, data) {
        res.send(data);
    });
});

app.post('/saveNewParcel', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var parcel = JSON.parse(body.data);
    var token = body.token;
    var ID = getID(token);

    db.saveNewParcel(parcel, ID, function (parc) {
        if (parc) {
            reqSend.sendRequest("/generateDefaultRules", { parcelID: parc.ID }, function () { });
            if (parcel.SensorCoords.length > 0)
                reqSend.sendRequest('localhost:2037/addParcelSensor', { data: JSON.stringify({ parcelID: parc.ID, coords: parcel.SensorCoords, userID: ID }) }, function () { });
        }
        res.send({ parcel: parc });
    });

});

app.post('/addWorker', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.mytoken);
    var perms = JSON.parse(body.perms);
    var parcels = body.parcels;
    db.addWorker(perms, ID, parcels, function (status, work, email, text) {
        if (status && work)
            mail.sendMail(email, "Angazovanje!", text);
        res.send({ status: status, work: work });
    });
});

app.post('/getUser', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.user);
    db.getUser(ID, function (user) {
        res.send({ user: user });
    });

});

app.post('/changeUser', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var user = body.user;
    db.changeUser(user, function (status) {
        res.send(status);
    });
});
app.post('/getTodaysForecast', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var lat = body.latitude;
    var lng = body.longitude;
    var lang = body.lang;

    forecast.getForecastForWidget(lat, lng, lang, function (data) {
        res.send(data);
    });
});

app.post('/addSupportTicket', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var userID = getID(body.token);
    var Text = body.Text;
    var date = body.date;

    db.addSupportTicket(userID, Text, date);
    res.send({});
});

app.post('/getAllCrops', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;
    var ID = getID(token);
    var parcelID = body.parcelID;

    db.getAllCrops(ID, parcelID, function (data) {
        res.send({ crops: data });
    });
});

app.post('/getToDos', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;
    var ID = getID(token);

    db.getToDos(ID, function (data) {
        res.send(data);
    });
});

app.post('/getAllCropsForNew', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;
    var ID = getID(token);;

    db.getAllCropsForNew(ID, function (data) {
        res.send({ crops: data });
    });
});

app.post('/upload/:username', function (req, res) {
    //

    upload(req, res, function (err) {
        if (err) {
            res.send({ status: false });
        }
        else {
            var url;
            var pictures = req.files;
            //
            if (pictures) {
                for (i = 0; i < pictures.length; i++) {
                    url = "/images/uplatnice/" + pictures[i].filename;
                }
            }

            db.addUrl(req.params.username, url);
            //
            res.send({ status: true });
        }

    });
});

app.post('/uploadPacketChange/:token', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send({ status: false });
        }
        else {
            var url;
            var pictures = req.files;
            //
            if (pictures) {
                for (i = 0; i < pictures.length; i++) {
                    url = "/images/uplatnice/" + pictures[i].filename;
                }
            }

            var tmp = req.params.token.split("-:-");
            var ID = getID(tmp[0]);
            var newType = tmp[1];
            db.addUrlForChange(ID, url, newType);
            res.send({ status: true });
        }

    });
});

app.post('/uploadRenew/:username/:type', function (req, res) {
    var username = req.params.username;
    var newType = req.params.type;
    upload(req, res, function (err) {
        if (err) {
            res.send({ status: false });
        }
        else {
            var url;
            var pictures = req.files;
            //
            if (pictures) {
                for (i = 0; i < pictures.length; i++) {
                    url = "/images/uplatnice/" + pictures[i].filename;
                }
            }

            db.addUrlForChangeWithUsername(username, url, newType);
            //
            res.send({ status: true });
        }

    });
});

function generateRandomString(ext) {
    var rnd = "qwertyuiopasdfghjklzxcvbnm1234567890ASDQWEZXCRTYFGHVBNUIOJKLNM";
    var length = 25;
    var temp = "";

    var i;

    for (i = 0; i < length; i++) {
        temp += rnd.charAt((Math.random() * 100) % rnd.length);
    }

    if (fileExists(temp + "." + ext)) {
        return generateRandomString(ext);
    }
    else return temp + "." + ext;
}

function fileExists(path) {
    var url = __dirname + "/public/images/uplatnice/" + path;

    return fs.existsSync(path);
}

app.post('/getNumberSupportTicket', urlencodedParser, function (req, res) {
    db.getNumberSupportTicket(function (numb) {
        res.send({ numb });
    });
});

app.post('/getPossibleOwners', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var token = body.token;
    var ID = getID(token);

    db.getPossibleOwners(ID, function (data) {
        res.send({ owners: data });
    });
});

app.post('/getPossibleOwnersForSensors', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var token = body.token;
    var ID = getID(token);

    db.getPossibleOwnersForSensors(ID, function (data) {
        res.send({ owners: data });
    });
});

app.post('/getParcelsForSensors', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var ID = body.userID;
    if (ID == -1) ID = getID(body.token);

    db.getParcelsForSensors(ID, function (data) {
        res.send({ parcels: data });
    });
});

app.post('/addNewSensor', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var sensor = body.sensor;
    if (sensor.userID == -1) sensor.userID = getID(body.token);

    reqSend.sendRequest("localhost:2037/addSensorWithParcels", sensor, function (err, data) {
        res.send(data);
    });
});

app.post('/addNew', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var subcrops = body.sc;
    var manufacturer = body.mf;
    var crop = body.c;

    db.addNew(subcrops, manufacturer, crop, function (flag) {
        res.send({ status: flag });
    });
});

app.post('/addEditSensor', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var sensor = body.sensor;

    reqSend.sendRequest("localhost:2037/addEditSensorWithParcels", sensor, function (err, data) {
        res.send(data);
    });
});

app.post('/getNumberPendingOwner', urlencodedParser, function (req, res) {
    db.getNumberPendingOwner(function (numbe) {
        res.send({ numbe });
    });
});

app.post('/sendMailToUs', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var email = body.email;
    var text = body.text;

    mail.sendMailToUs(email, "Pitanje posetioca", text);
    setTimeout(() => {
        mail.sendMail(email, "Potvrda", "Primili smo vašu poruku, očekute odgovor!");
    }, 1500);

    res.send({});
});

app.post('/getAllRules', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.tokenID;
    var userType = body.userType;
    var ID = getID(token);
    db.getOwnersParcels(getID(token), function (data) {
        data.push({ ID: "-" + ID });
        if (userType == "Agronom") data = null;
        reqSend.sendRequest("localhost:2038/getAllRules", { test: JSON.stringify(data) }, function (err, data1) {
            var data2 = JSON.parse(data1);
            if (err) {
                res.send({});
            } else {
                if (data1) {
                    recFix(data2, 0, res);
                }
                else
                    res.send(data1);
            }
        });
    });



});

function recFix(d, ind, res) {
    if (d.length == ind) {
        res.send(JSON.stringify(d));
    }
    else {
        var id = d[ind].owner;
        var mod = d[ind].modifiedBy;
        if (id != undefined)
            db.getUser(id, function (usr) {
                if (mod != undefined)
                    db.getUser(mod, function (modi) {
                        d[ind].OWNER = d[ind].owner;
                        d[ind].owner = usr.Fname + " " + usr.Lname;
                        d[ind].modifiedBy = modi.Fname + " " + modi.Lname;


                        recFix(d, ind + 1, res);
                    });

            });
    }
}

app.post('/getAllParcels', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;

    var ID = getID(token);

    db.getAllParcels(ID, function (parcels) {
        res.send({ data: parcels });
    });
});

app.post('/addRule', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.ID);
    var ut = body.userType;
    var message = body.message;
    var string = body.string;
    var exp = string.split(' ');
    if (exp[0] == 0 && ut != "Agronom") {
        string = "1 -" + ID;
        for (i = 1; i < exp.length; i++) string += " " + exp[i];
    }

    db.getAllParcelsForExpert(function (data) {
        reqSend.sendRequest("localhost:2038/addRule", { ID: ID, owner: ID, newMessage: message, allParcels: JSON.stringify(data), string: string, userType: ut, newPriority: body.priority }, function (err, data) {
            if (err) {
                res.send({});
            } else res.send(data);
        });
    });

});

app.post('/getDataForSensor', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var sensorID = body.sensorID;

    reqSend.sendRequest("localhost:2037/getSensorMeasurement", { id: sensorID, days: 15 }, function (err, data) {

        res.send(data);
    });
});

app.post('/deleteRule', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var ut = body.userType;
    var ID = getID(body.ID);
    db.getOwnersParcels(ID, function (data) {
        db.getAllParcelsForExpert(function (data2) {
            data.push({ ID: "-" + ID });

            reqSend.sendRequest("localhost:2038/deleteRule", { ID: ID, allParcels: JSON.stringify(data), allParcelsAgro: JSON.stringify(data2), string: body.string, userType: ut }, function (err, data) {
                if (err) {
                    res.send({});
                } else res.send(data);
            });
        });
    });
});

app.post('/updateRule', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ut = body.userType;

    var ID = getID(body.ID);
    var string = body.string;
    var exp = string.split(' ');
    if (exp[0] == 0 && ut != "Agronom") {
        string = "1 -" + ID;
        for (i = 1; i < exp.length; i++) string += " " + exp[i];
    }
    db.getAllParcelsForExpert(function (data) {
        db.getOwnersParcels(ID, function (data2) {
            data.push({ ID: "-" + ID });
            data2.push({ ID: "-" + ID });
            reqSend.sendRequest("localhost:2038/updateRule", { ID: ID, owner: ID, allParcels: JSON.stringify(data), permissionParcels: JSON.stringify(data2), newString: string, newMessage: body.message, oldMessage: body.oldMessage, oldString: body.oldString, userType: ut }, function (err, data) {
                if (err) {
                    res.send({});
                } else res.send(data);
            });
        });
    });
});

app.post('/getUserParcels', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.tokenID;

    var ID = getID(token);

    db.getOwnersParcels(ID, function (data) {
        res.send({ parcels: data });
    });
});

app.post('/checkExistance', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var username = body.username;

    db.checkExistance(username, function (exists) {
        res.send({ status: exists });
    });
});
app.post('/getNumbers', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.user);


    db.getWorkers(id, function (workers) {
        db.getParcelIDs(id, function (parcels) {
            if (parcels.length > 0) {
                reqSend.sendRequest("localhost:2037/getSensorCount", { parcelIDs: JSON.stringify(parcels) }, function (err, sensors) {
                    db.getParcelsCount(id, function (parcels) {
                        res.send({ workers: workers, sensors: sensors == null ? 0 : JSON.parse(sensors).count, parcels: parcels });
                    });
                });
            }
            else {
                db.getParcelsCount(id, function (parcels) {
                    res.send({ workers: workers, sensors: 0, parcels: parcels });
                });
            }
        });
    });
});
app.post('/getCalendar', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.username);


    db.getCalendar(id, function (exists) {
        res.send({ data: exists });
    });
});

app.post('/insertInCalendar', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.username);
    db.insertInCalendar(id, body.title, body.date, body.bg);
    db.insertInMobileNotification(id, body.title, body.date);

    res.send({});
});
app.post('/insertInNotification', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.username);

    db.insertInNotification(id, null, body.title, body.bg, function (data) {
        res.send({ data: data });
    });
});
app.post('/deleteFromCalendar', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.username);

    db.deleteFromCalendar(id, body.title, body.date);
    res.send({});
});

app.post('/deleteFromNotification', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.username);

    db.deleteFromNotification(id, body.title);
    res.send({});
});

app.post('/deleteNotification', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;

    db.deleteNotification(ID);
    res.send({});
});

app.post('/getPaymentType', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.token);

    db.getPaymentType(ID, function (data) {
        res.send({ paymentType: data });
    })
});

app.post('/getParcelCount', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.token);

    db.getParcelsCount(ID, function (parcels) {
        res.send({ count: parcels });
    });
});

app.post('/getWorkersCount', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.token);

    db.getWorkers(ID, function (workers) {
        res.send({ count: workers });
    });
});

app.post('/getNotification', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.username);

    db.getNotification(id, function (exists) {
        res.send({ notif: exists });
    });
});

app.post('/getNotificationForMobile', urlencodedParser, function (req, res) {
    var token = req.body.token;
    var ID = getID(token);

    db.getNotificationsForMobile(ID, function (data) {
        res.send(data);
    });
});

app.post('/setShowCorny', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.token);
    var flag = body.flag;

    db.setShowCorny(ID, flag, function () {
        res.send({});
    });
});

app.post('/getShowCorny', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = getID(body.token);

    db.getShowCorny(ID, function (flag) {
        res.send({ flag });
    });
});

app.post('/getNotifNum', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var id = getID(body.username);

    db.getNotifNum(id, function (exists) {
        res.send({ notif: exists });
    });
});

app.post('/getAllPermissionsOfWorker', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.token;
    var accID = body.accID;
    var ID = getID(token);

    db.getAllPermissionsOfWorker(ID, accID, function (data) {
        res.send(data);
    });
});

app.post('/getToDo', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;
    db.getToDo(ID, function (data) {

        res.send({ data: data });
    });
});
app.post('/doIt', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var ID = body.ID;
    var check = body.check;
    var UserID = getID(body.token);

    db.doIt(ID, check, UserID);
    res.send({});
});

app.post('/getAllWorks', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var token = body.token;
    var ID = getID(token);

    db.getAllWorks(ID, function (data) {
        res.send(data);
    });
});

app.post('/deleteJob', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var token = body.token;
    var ID = getID(token);
    var ownerID = body.ownerID;

    db.deleteJob(ID, ownerID);
    res.send({});

    db.getUser(ownerID, function (o) {
        db.getUser(ID, function (i) {
            mail.sendMail(o.email, "Ostavka", "Radnik " + i.Fname + " " + i.Lname + " je dao otkaz!");
        });
    });
});

app.post('/getAllPermissions', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;

    var token = body.token;
    var ID = getID(token);

    db.getAllPermissions(ID, function (data) {
        res.send({ perms: data });
    })
});

function intervalCheck() {
    var ID = "-interval";

    var plantages = [];
    db.getAllParcelsForIntervalRules(function (data) {
        data.forEach(row => {

            if (plantages.find(el => el.ID == row["p.ID"]) == null) {
                plantages.push({
                    ID: row["p.ID"],
                    lat: row.lat,
                    lng: row.lng
                });
            }
        });

        forecast.getDataAboutParcels(plantages, function (forecastData) {
            reqSend.sendRequest('localhost:2037/getHumidityForParcels', { plantages: JSON.stringify(plantages) }, function (err2, dataSensors) {
                var sensors = null;

                if (dataSensors != null)
                    sensors = JSON.parse(dataSensors).sensors;
                data.forEach(el => {
                    el.ID = el["p.ID"];
                    var tmp = forecastData.find(fEl => fEl.ID == el["p.ID"]);
                    var tmp2 = null;
                    if (sensors != null)
                        tmp2 = sensors.find(sEl => sEl.parcelID == el["p.ID"]);
                    el.temperatura = tmp.temperature;
                    el.padavine = tmp.rainfall;
                    el.vetar = tmp.wind;
                    el.vlaznostPrognoza = tmp.vlaznost;
                    el.sensors = tmp2;
                });
                reqSend.sendRequest("localhost:2038/addFact", { allParcels: JSON.stringify(data), userID: ID }, function (err, data1) {

                    reqSend.sendRequest("localhost:2038/matchRules", { allParcels: JSON.stringify(plantages), userID: ID }, function (err, data2) {

                        data2 = JSON.parse(data2);

                        db.getAllParcelsWithViewers(function (parcels) {

                            var forIn = [];

                            parcels.forEach(p => {
                                var t = null
                                if (data2)
                                    t = data2.find(e => e.parcelID == p.ParcelID);
                                if (t == null) return;

                                p.users.forEach(u => {
                                    var tmp = forIn.find(e => e.ID == u.ID);

                                    if (tmp != null) {
                                        tmp.parcels.push({
                                            Title: p.Title,
                                            Message: t.message
                                        });
                                    }
                                    else {
                                        forIn.push({
                                            email: u['E-mail'],
                                            ID: u.ID,
                                            parcels: [{
                                                Title: p.Title,
                                                Message: t.message
                                            }]
                                        });
                                    }
                                })
                            });


                            db.addMobileNotifications(forIn, function (tmp) {
                                tmp.forEach(el => {
                                    var email = el.email;
                                    var text = "Nova obaveštenja:\n";
                                    el.parcels.forEach(e => {
                                        text += e.Title + " - " + e.Message + "\n";
                                    });


                                    mail.sendMail(email, "Obaveštenja", text);
                                });
                            });

                        });
                    });
                });
            });
        });
    });
}

app.post('/getNotificationsFromExpert', urlencodedParser, function (req, res) {
    var body = JSON.parse(req.body.json).input;
    var token = body.tokenID;

    var ID = getID(token);
    var plantages = [];
    db.getAllParcelsForRules(ID, function (data) {

        data.forEach(row => {

            if (plantages.find(el => el.ID == row.ID) == null) {
                plantages.push({
                    ID: row.ID,
                    lat: row.lat,
                    lng: row.lng
                });
            }
        });
        forecast.getDataAboutParcels(plantages, function (forecastData) {
            reqSend.sendRequest('localhost:2037/getHumidityForParcels', { plantages: JSON.stringify(plantages) }, function (err2, dataSensors) {
                var sensors = null;
                if (dataSensors != null)
                    sensors = JSON.parse(dataSensors).sensors;

                data.forEach(el => {
                    var tmp = forecastData.find(fEl => fEl.ID == el.ID);
                    var tmp2 = null;
                    if (sensors != null)
                        tmp2 = sensors.find(sEl => sEl.parcelID == el.ID);
                    el.temperatura = tmp.temperature;
                    el.padavine = tmp.rainfall;
                    el.vetar = tmp.wind;
                    el.vlaznostPrognoza = tmp.vlaznost;
                    el.sensors = tmp2;
                });

                db.allParcels(function (rows) {
                    var parcels = rows;
                    reqSend.sendRequest("localhost:2038/addFact", { allParcels: JSON.stringify(data), userID: ID }, function (err, data1) {
                        reqSend.sendRequest("localhost:2038/matchRules", { allParcels: JSON.stringify(plantages), userID: ID }, function (err, data2) {
                            var niz = [];
                            db.checkCalendar(ID, niz, function () {
                                data3 = JSON.parse(data2);

                                if (data3 != null && data3.length > 0) {
                                    var b = 0;
                                    data3.forEach(el => {
                                        var p = parcels.find(x => x.ID == el.parcelID);
                                        var message = "Obavestenje: " + el.message + ", Plantaza: " + p.Title;
                                        db.insertInNotificationForAll(ID, el.parcelID, message, el.priority, function (status) {
                                            b++;
                                            if (status) niz.push(message);
                                            if (b == data3.length) {
                                                res.send(niz);
                                            }


                                        });
                                    });
                                }
                                else {
                                    res.send(niz);
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});
app.listen(2035, function () {
    console.log("Server startovan!");

    setInterval(() => {
        intervalCheck();
    }, INTERVAL);
    try {
        intervalCheck();
    } catch (err) { }
});