var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var nools = require("nools");
var DateDiff = require('date-diff');
//app.use(express.static('public'));
const uri = "mongodb://fensey15:Passpass12@plantech-shard-00-00-839b8.gcp.mongodb.net:27017,plantech-shard-00-01-839b8.gcp.mongodb.net:27017,plantech-shard-00-02-839b8.gcp.mongodb.net:27017/PlanTECH?ssl=true&replicaSet=PlanTech-shard-0&authSource=admin&retryWrites=true&w=majority"

urlencodedParser = bodyParser.urlencoded({ extended: false });

var Fact = function (parcelID, culture, vlaznost, temperatura, temperaturaPrognoza, padavine, vetar, vlaznostVazduha, vlaznostVazduhaPrognoza, godina, mesec, dan, kalcijum, fosfor, azot, ph, natrijum, vetarSenzor, padavineSenzor) {
    this.parcelID = parcelID;
    this.culture = culture;
    this.vlaznost = vlaznost;
    this.temperatura = temperatura;
    this.temperaturaPrognoza = temperaturaPrognoza;
    this.padavine = padavine;
    this.vetar = vetar;
    this.vlaznostVazduha = vlaznostVazduha;
    this.vlaznostVazduhaPrognoza = vlaznostVazduhaPrognoza;
    this.godina = godina;
    this.mesec = mesec;
    this.dan = dan;
    this.kalcijum = kalcijum;
    this.fosfor = fosfor;
    this.azot = azot;
    this.ph = ph;
    this.natrijum = natrijum;
    this.vetarSenzor = vetarSenzor;
    this.padavineSenzor = padavineSenzor;
};

var Notification = function (parcelID, message, priority) {
    this.parcelID = parcelID;
    this.message = message;
    this.priority = priority;

}


app.post('/matchRules', urlencodedParser, function (req, res) {

    //147.91.204.116
    MongoClient.connect(uri, function (err, client) {
        var allParcels = JSON.parse(req.body.allParcels);
        var rules = [];
        var messages = [];
        nools.deleteFlow("PlanTECH" + req.body.userID);
        getFlow(allParcels, messages, rules, client.db("PlanTECH"), allParcels.length, req.body.userID, function (flow) {
            var collection = client.db("PlanTECH").collection('facts' + req.body.userID);

            var session = flow.getSession();

            collection.find().toArray(function (err, data) {

                for (var i = 0; i < data.length; i++)
                    addFact(data[i], session);


                session.match(function (err) {
                    if (err) {
                        console.error(err.stack);
                    } else {
                        session.dispose();
                        nools.deleteFlow("PlanTECH" + req.body.userID);
                    }

                    client.close();
                    res.send(messages);
                });

            });
        });

    });

});


function getFlow(allParcels, messages, rules, db, len, userID, callback) {
    var floww = nools.flow("PlanTECH" + userID, function (flow) {
        addCollection(allParcels, messages, rules, flow, db, 0, len, function (c1) {
            callback(flow);
        });
    });
}

function addCollection(allParcels, messages, rules, flow, db, j, len, callback) {

    if (j == len) callback({}); else {
        var id = allParcels[j].ID;
        var collection = db.collection('rules' + id);
        collection.find().toArray(function (err, data) {
            for (var i = 0; i < data.length; i++) {
                var k = i;
                addRule(data, i, flow, messages);
            }
            addCollection(allParcels, messages, rules, flow, db, ++j, len, callback);
        });
    }
}

app.post('/addRule', urlencodedParser, function (req, res) {

    MongoClient.connect(uri, function (err, client) {


        var string = req.body.string;
        var ParcelsLen = 0;

        var allParcels = JSON.parse(req.body.allParcels);
        if (err) console.log(err);
        else client.db("PlanTECH").collection('rules', function (err, collection) { });
        if (req.body.userType != "Agronom" && (+string.split(" ")[1]) >= 0) {
            var ParcelsLen = + ((string.split(' '))[0]);
            similarRule(JSON.parse(req.body.allParcels), string, 0, req, client.db("PlanTECH"), function (data) {
                if (data.success == true) {
                    client.close();
                    res.send({});
                } else {
                    var rule = { rule: string, message: req.body.newMessage, priority: req.body.newPriority, defaultRule: false, owner: req.body.ID, modifiedBy: req.body.ID, modifiedDate: (new Date()) };
                    for (var i = 1; i < ParcelsLen + 1; i++)
                        addInParcel(rule, string, ParcelsLen, client.db("PlanTECH"), false, i, null, res);
                }
            });

        }

        if (req.body.userType != "Agronom" && (+string.split(" ")[1]) < 0) {
            var ParcelsLen = + ((string.split(' '))[0]);
            var rule = { rule: string, message: req.body.newMessage, priority: req.body.newPriority, defaultRule: false, owner: req.body.ID, modifiedBy: req.body.ID, modifiedDate: (new Date()) };
            for (var i = 1; i < ParcelsLen + 1; i++)
                addInParcel(rule, string, ParcelsLen, client.db("PlanTECH"), false, i, null, res);
        }


        if (req.body.userType == "Agronom") {

            var rule = { rule: string, message: req.body.newMessage, priority: req.body.newPriority, defaultRule: true, owner: req.body.ID, modifiedBy: req.body.ID, modifiedDate: (new Date()) };
            collection = client.db("PlanTECH").collection('rules');

            collection.insert(rule, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    for (var i = 0; i < allParcels.length; i++)
                        addInParcel(rule, string, null, client.db("PlanTECH"), true, i, allParcels, res);

                }

            });

        }

    });
    try {
        res.send({});
    }
    catch (err) { };
});

function addInParcel(rule, string, ParcelsLen, db, agro, i, allParcels, res) {

    if (agro == false) {
        collection = db.collection('rules' + ((string.split(' '))[i]));
        collection.insert(rule, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if (i == ParcelsLen) {
                    client.close();
                    res.send({});
                }
            }
        });
    }

    if (agro == true) {
        collection = db.collection('rules' + allParcels[i].ID);
        collection.insert(rule, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if (i == allParcels.length - 1) {
                    client.close();
                    res.send({});
                }
            }
        });

    }


}




app.post('/addFact', urlencodedParser, function (req, res) {
    MongoClient.connect(uri, function (err, client) {

        if (err) console.log(err);
        else client.db("PlanTECH").collection('facts' + req.body.userID, function (err, collection) { });
        var collection = client.db("PlanTECH").collection('facts' + req.body.userID);
        collection.remove({});
        var allFacts = JSON.parse(req.body.allParcels);
        var facts = [];
        var now = new Date();
        for (var i = 0; i < allFacts.length; i++) {
            if (allFacts[i].sensors != null) {
                var fact = { parcelID: allFacts[i].ID, culture: allFacts[i].CropID, vlaznost: allFacts[i].sensors.Vlaznost, padavine: allFacts[i].padavine, temperatura: allFacts[i].sensors.Temperatura, temperaturaPrognoza: allFacts[i].temperatura, vetar: allFacts[i].vetar, vlaznostVazduha: allFacts[i].sensors.Vlaznostvazduha, vlaznostVazduhaPrognoza: allFacts[i].vlaznostPrognoza, godina: now.getFullYear(), mesec: now.getMonth() + 1, dan: now.getDate(), kalcijum: allFacts[i].sensors.Kalcijum, fosfor: allFacts[i].sensors.Fosfor, azot: allFacts[i].sensors.Azot, ph: allFacts[i].sensors.Phvrednost, natrijum: allFacts[i].sensors.Natrijum, vetarSenzor: allFacts[i].sensors.Brzinavetra, padavineSenzor: allFacts[i].sensors.Padavine };
                facts.push(fact);
            }
        }
        if (facts.length != 0)
            collection.insert(facts, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });

        res.send({});
        client.close();
    });

});

app.post('/getAllRules', urlencodedParser, function (req, res) {
    MongoClient.connect(uri, function (err, client) {
        var body = JSON.parse(req.body.test);
        if (body == null) {
            var temp = [];
            var collection = client.db("PlanTECH").collection('rules');
            collection.find().toArray(function (err, data) {
                data.forEach(el => {
                    temp.push(el);
                });
                res.send(temp);
            });
        } else {
            var temp = [];
            recFind(body, 0, temp, function (data) {
                res.send(data);
            });

            client.close();
        }
    });
});



app.post('/getAllFacts', urlencodedParser, function (req, res) {
    MongoClient.connect(uri, function (err, client) {
        if (err) console.log(err);
        else client.db("PlanTECH").collection('facts', function (err, collection) { });
        var collection = client.db("PlanTECH").collection('facts');
        collection.find().toArray(function (err, data) {

            res.send(data);
        });
        client.close();
    });
});

app.post('/updateRule', urlencodedParser, function (req, res) {
    MongoClient.connect(uri, function (err, client) {

        var oldString = req.body.oldString.split(' ');
        var newString = req.body.newString.split(' ');

        var allParcels = JSON.parse(req.body.allParcels);
        var permissionParcels = JSON.parse(req.body.permissionParcels);

        var makeRule = "";
        var len = 0;
        if (req.body.userType != "Agronom" && (+newString[1]) >= 0) {
            for (var i = 0; i < +oldString[0]; i++) {
                var k = permissionParcels.find(el => +oldString[i + 1] == +el.ID);
                if (k == null) { makeRule += oldString[i + 1] + " "; len++; }
            }

            makeRule = len + " " + makeRule;
            i++;
            for (; i < oldString.length; i++)
                makeRule += oldString[i] + " ";


            keepNoPermissionRules(makeRule, req.body.oldString, 0, req, client.db("PlanTECH"), function (data1) {
                deleteOldRuleFromAllParcels(allParcels, req.body.oldString, 0, req, client.db("PlanTECH"), function (data2) {
                    similarRule(allParcels, req.body.newString, 0, req, client.db("PlanTECH"), function (dataa) {
                        if (dataa.success == true) {
                            client.close();
                            res.send({});
                        } else {
                            addChangedRulesToParcels(req.body.newString, newString, 0, req, client.db("PlanTECH"), function (data3) {
                                client.close();
                                res.send({});
                            });
                        }
                    });
                });
            });
        }

        if (req.body.userType != "Agronom" && (+newString[1]) < 0) {
            for (var i = 0; i < +oldString[0]; i++) {
                var k = permissionParcels.find(el => +oldString[i + 1] == +el.ID);
                if (k == null) { makeRule += oldString[i + 1] + " "; len++; }
            }

            makeRule = len + " " + makeRule;
            i++;
            for (; i < oldString.length; i++)
                makeRule += oldString[i] + " ";

            keepNoPermissionRules(makeRule, req.body.oldString, 0, req, client.db("PlanTECH"), function (data1) {
                deleteOldRuleFromAllParcels(allParcels, req.body.oldString, 0, req, client.db("PlanTECH"), function (data2) {
                    addChangedRulesToParcels(req.body.newString, newString, 0, req, client.db("PlanTECH"), function (data3) {
                        client.close();
                        res.send({});
                    });
                });
            });
        }

        if (req.body.userType == "Agronom") {
            var collection = client.db("PlanTECH").collection('rules');

            collection.update({ rule: req.body.oldString }, { $set: { rule: req.body.newString, message: req.body.newMessage, priority: req.body.newPriority, modifiedBy: req.body.ID, modifiedDate: (new Date()) } }, function (data) {
                changeAgronomRules(req.body.newString, req.body.oldString, 0, allParcels, req, client.db("PlanTECH"), function (data) {
                    client.close();
                    res.send({});
                });
            });

        }
    });
});

function keepNoPermissionRules(makeRule, oldRule, ind, req, db, callback) {

    if (ind == +makeRule.split(' ')[0]) callback({}); else {
        var collection = db.collection("rules" + makeRule.split(' ')[ind + 1]);
        collection.update({ rule: oldRule }, { $set: { rule: makeRule, modifiedBy: req.body.ID, modifiedDate: (new Date()) } }, function (data) {
            keepNoPermissionRules(makeRule, oldRule, ++ind, req, db, callback);
        });

    }
}

function deleteOldRuleFromAllParcels(allParcels, oldRule, ind, req, db, callback) {
    if (ind == allParcels.length) callback({}); else {
        var collection = db.collection("rules" + allParcels[ind].ID);
        collection.remove({ rule: oldRule }, function (data) {
            deleteOldRuleFromAllParcels(allParcels, oldRule, ++ind, req, db, callback);
        });
    }
}

function addChangedRulesToParcels(newRule, newRuleSplit, ind, req, db, callback) {
    if (ind == +newRuleSplit[0]) callback({}); else {
        var collection = db.collection("rules" + newRuleSplit[ind + 1]);
        var rule = { rule: newRule, message: req.body.newMessage, priority: req.body.newPriority, owner: req.body.owner, modifiedBy: req.body.ID, modifiedDate: (new Date()) };
        collection.insert(rule, function (data) {
            addChangedRulesToParcels(newRule, newRuleSplit, ++ind, req, db, callback);
        });
    }
}

function changeAgronomRules(newRule, oldRule, ind, allParcels, req, db, callback) {
    if (ind == allParcels.length) callback({}); else {
        var collection = db.collection("rules" + allParcels[ind].ID);
        collection.update({ rule: oldRule }, { $set: { rule: newRule, message: req.body.newMessage, priority: req.body.newPriority, modifiedBy: req.body.ID, modifiedDate: (new Date()) } }, function (data) {
            changeAgronomRules(newRule, oldRule, ++ind, allParcels, req, db, callback);
        });

    }
}


app.post('/updateFact', urlencodedParser, function (req, res) {
    MongoClient.connect(uri, function (err, client) {
        if (err) console.log(err);
        else client.db("PlanTECH").collection('facts', function (err, collection) { });
        var collection = client.db("PlanTECH").collection('facts');

        collection.update({ fact: "hello" }, { $set: { fact: "testt" } });
        client.close();
    });
    res.send({});
});

app.post('/deleteRule', urlencodedParser, function (req, res) {

    MongoClient.connect(uri, function (err, client) {

        var string = req.body.string.split(' ');
        var allParcels = JSON.parse(req.body.allParcels);
        var allParcelsAgro = JSON.parse(req.body.allParcelsAgro);

        var makeRule = "";
        var len = 0;
        if (req.body.userType != "Agronom") {
            for (var i = 0; i < +string[0]; i++) {
                var k = allParcels.find(el => +string[i + 1] == +el.ID);
                if (k == null) { makeRule += string[i + 1] + " "; len++; }
            }

            i++;

            makeRule = len + " " + makeRule;
            for (; i < string.length; i++)
                makeRule += string[i] + " ";

            keepNoPermissionRules(makeRule, req.body.string, 0, req, client.db("PlanTECH"), function (data1) {
                deleteOldRuleFromAllParcels(allParcels, req.body.string, 0, req, client.db("PlanTECH"), function (data2) {
                    client.close();
                    res.send({});
                });
            });
        } else {
            var collection = client.db("PlanTECH").collection('rules');
            collection.remove({ rule: req.body.string }, function (data) {
                deleteOldRuleFromAllParcels(allParcelsAgro, req.body.string, 0, req, client.db("PlanTECH"), function (data2) {
                    client.close();
                    res.send({});
                });
            });

        }
    });

});

// function deleteInParcel(db, i, rule, allParcels, res, req, col) {

//     var collection = db.collection('rules' + allParcels[i].ID);
//     collection.remove({ name: rule.name }, function (err) {
//         if (i == allParcels.length - 1) {
//             col.remove({ name: rule.name }, function (err) {
//                 client.close();
//                 res.send({});
//             });
//         }
//     });
// }

app.post('/deleteFact', urlencodedParser, function (req, res) {
    MongoClient.connect(uri, function (err, client) {
        if (err) console.log(err);
        else client.db("PlanTECH").collection('facts', function (err, collection) { });
        var collection = client.db("PlanTECH").collection('facts');

        collection.remove({ fact: "testt" });
        client.close();
    });
    res.send({});
});

app.post('/generateDefaultRules', urlencodedParser, function (req, res) {

    MongoClient.connect(uri, function (err, client) {
        client.db("PlanTECH").collection('rules' + req.body.parcelID, function (err, collection) { });

        copyBasicRules(client.db("PlanTECH"), req.body.parcelID, function (callback) {
            client.close();
            res.send({});
        });


    });

});


function addRule(data, i, flow, messages) {
    var theRule = "(";

    var string = data[i].rule.split(' ');
    var cur = 0;
    var ParcelsNum = +string[0];

    for (var j = 1; j < ParcelsNum + 1; j++)
        theRule += "f.parcelID ==" + (+string[j]) + " || ";

    theRule += " false) && (";

    var CulturesNum = +string[ParcelsNum + 1];

    cur = ParcelsNum + 2;

    for (var j = cur; j < cur + CulturesNum; j++)
        theRule += "f.culture ==" + (+string[j]) + " || ";

    theRule += " false) ";

    cur += CulturesNum;

    var OperationsNum = +string[cur];
    cur++;
    var br1;
    var br2;

    for (var k = 0; k < OperationsNum; k++) {
        br1 = 0;
        br2 = 0
        uslov = +string[cur];
        cur++;

        if (uslov == 2 || uslov == 3 || uslov == 4 || uslov == 5) {
            var vreme = +string[cur];
            cur++;
        }

        op = string[cur];
        //parcelID, culture, vlaznost, temperatura, temperaturaPrognoza, padavine, vetar, vlaznostVazduha,vlaznostVazduhaPrognoza, godina, mesec, dan, kalcijum, fosfor, azot, ph, natrijum
        if (uslov == 1) {
            op = +op;
            if (op == 1) {
                cur++;
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.vlaznost[" + j + "]!=null && f.vlaznost[" + j + "] < " + (+string[cur]);
            }
            if (op == 2) {
                cur++;
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.vlaznost[" + j + "]!=null && f.vlaznost[" + j + "] > " + (+string[cur]);
            }

            if (op == 3) {
                cur++;
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.vlaznost[" + j + "]!=null && f.vlaznost[" + j + "] <= " + (+string[cur]);
            }
            if (op == 4) {
                cur++;
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.vlaznost[" + j + "]!=null && f.vlaznost[" + j + "] >= " + (+string[cur]);
            }

            if (op == 5) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.vlaznost[" + j + "]!=null && f.vlaznost[" + j + "] >= " + min + " && f.vlaznost[" + j + "] <=" + max;
            }

            if (op == 6) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.vlaznost[" + j + "]!=null && (f.vlaznost[" + j + "] < " + min + " || f.vlaznost[" + j + "] > " + max + ") ";
            }
            cur++;
        }

        if (uslov == 2) {

            op = +op;
            if (vreme == 1) {
                if (op == 1) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperatura[" + j + "]!=null && f.temperatura[" + j + "] < " + (+string[cur]);
                }
                if (op == 2) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperatura[" + j + "]!=null && f.temperatura[" + j + "] > " + (+string[cur]);
                }

                if (op == 3) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperatura[" + j + "]!=null && f.temperatura[" + j + "] <= " + (+string[cur]);
                }
                if (op == 4) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperatura[" + j + "]!=null && f.temperatura[" + j + "] >= " + (+string[cur]);
                }

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperatura[" + j + "]!=null && f.temperatura[" + j + "] >= " + min + " && f.temperatura[" + j + "] <=" + max;
                }

                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperatura[" + j + "]!=null && (f.temperatura[" + j + "] < " + min + " || f.temperatura[" + j + "] > " + max + ") ";
                }

            }

            if (vreme == 2) {
                if (op == 1) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperaturaPrognoza[" + j + "] < " + (+string[cur]);
                }
                if (op == 2) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperaturaPrognoza[" + j + "] > " + (+string[cur]);
                }

                if (op == 3) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperaturaPrognoza[" + j + "] <= " + (+string[cur]);
                }
                if (op == 4) {
                    cur++;
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperaturaPrognoza[" + j + "] >= " + (+string[cur]);
                }

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.temperaturaPrognoza[" + j + "] >= " + min + " && f.temperaturaPrognoza[" + j + "] <=" + max;
                }

                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && (f.temperaturaPrognoza[" + j + "] < " + min + " || f.temperaturaPrognoza[" + j + "] > " + max + ") ";
                }


            }
            cur++;
        }

        if (uslov == 3) {
            op = +op;
            if (vreme == 2) {
                if (op == 1)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavine[" + j + "] < " + (+string[++cur]);
                if (op == 2)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavine[" + j + "] > " + (+string[++cur]);

                if (op == 3)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavine[" + j + "] <= " + (+string[++cur]);
                if (op == 4)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavine[" + j + "] >= " + (+string[++cur]);

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.padavine[" + j + "] >= " + min + " && f.padavine[" + j + "] <=" + max;
                }

                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && (f.padavine[" + j + "] < " + min + " || f.padavine[" + j + "] > " + max + ") ";
                }
            }

            if (vreme == 1) {
                if (op == 1)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavineSenzor[" + j + "]!=null && f.padavineSenzor[" + j + "] < " + (+string[++cur]);
                if (op == 2)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavineSenzor[" + j + "]!=null && f.padavineSenzor[" + j + "] > " + (+string[++cur]);

                if (op == 3)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavineSenzor[" + j + "]!=null && f.padavineSenzor[" + j + "] <= " + (+string[++cur]);
                if (op == 4)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.padavineSenzor[" + j + "]!=null && f.padavineSenzor[" + j + "] >= " + (+string[++cur]);

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.padavineSenzor[" + j + "]!=null && f.padavineSenzor[" + j + "] >= " + min + " && f.padavineSenzor[" + j + "] <=" + max;
                }

                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.padavineSenzor[" + j + "]!=null && (f.padavineSenzor[" + j + "] < " + min + " || f.padavineSenzor[" + j + "] > " + max + ") ";
                }


            }

        }

        if (uslov == 4) {
            op = +op;
            if (vreme == 2) {
                if (op == 1)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vetar[" + j + "] < " + (+string[++cur]);
                if (op == 2)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vetar[" + j + "] > " + (+string[++cur]);

                if (op == 3)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vetar[" + j + "] <= " + (+string[++cur]);
                if (op == 4)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vetar[" + j + "] >= " + (+string[++cur]);

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.vetar[" + j + "] >= " + min + " && f.vetar[" + j + "] <=" + max;
                }

                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && (f.vetar[" + j + "] < " + min + " || f.vetar[" + j + "] > " + max + ") ";
                }
            }


            if (vreme == 1) {
                if (op == 1)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vetarSenzor[" + j + "]!=null &&  f.vetarSenzor[" + j + "] < " + (+string[++cur]);
                if (op == 2)
                    for (var j = 0; j < +string[cur + 2]; j++)
                        theRule += " && f.vetarSenzor[" + j + "]!=null && f.vetarSenzor[" + j + "] > " + (+string[++cur]);

                if (op == 3)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vetarSenzor[" + j + "]!=null && f.vetarSenzor[" + j + "] <= " + (+string[++cur]);
                if (op == 4)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vetarSenzor[" + j + "]!=null && f.vetarSenzor[" + j + "] >= " + (+string[++cur]);

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.vetarSenzor[" + j + "]!=null && f.vetarSenzor[" + j + "] >= " + min + " && f.vetarSenzor[" + j + "] <=" + max;
                }

                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.vetarSenzor[" + j + "]!=null && (f.vetarSenzor[" + j + "] < " + min + " || f.vetarSenzor[" + j + "] > " + max + ") ";
                }


            }


        }

        if (uslov == 5) {
            op = +op;

            op = +op;
            if (vreme == 2) {
                if (op == 1)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduhaPrognoza[" + j + "] < " + (+string[++cur]);
                if (op == 2)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduhaPrognoza[" + j + "] > " + (+string[++cur]);

                if (op == 3)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduhaPrognoza[" + j + "] <= " + (+string[++cur]);
                if (op == 4)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduhaPrognoza[" + j + "] >= " + (+string[++cur]);

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.vlaznostVazduhaPrognoza[" + j + "] >= " + min + " && f.vlaznostVazduhaPrognoza[" + j + "] <=" + max;
                }


                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && (f.vlaznostVazduhaPrognoza[" + j + "] < " + min + " || f.vlaznostVazduhaPrognoza[" + j + "] > " + max + ") ";
                }

            }

            if (vreme == 1) {
                if (op == 1)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduha[" + j + "]!=null && f.vlaznostVazduha[" + j + "] < " + (+string[++cur]);
                if (op == 2)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduha[" + j + "]!=null && f.vlaznostVazduha[" + j + "] > " + (+string[++cur]);

                if (op == 3)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduha[" + j + "]!=null && f.vlaznostVazduha[" + j + "] <= " + (+string[++cur]);
                if (op == 4)
                    for (var j = 0; j < +string[cur + 2] + 1; j++)
                        theRule += " && f.vlaznostVazduha[" + j + "]!=null && f.vlaznostVazduha[" + j + "] >= " + (+string[++cur]);

                if (op == 5) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.vlaznostVazduha[" + j + "]!=null && f.vlaznostVazduha[" + j + "] >= " + min + " && f.vlaznostVazduha[" + j + "] <=" + max;
                }

                if (op == 6) {
                    var num1 = +string[++cur];
                    var num2 = +string[++cur];
                    var max;
                    var min;

                    if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                    for (var j = 0; j < +string[cur + 1] + 1; j++)
                        theRule += " && f.vlaznostVazduha[" + j + "]!=null && (f.vlaznostVazduha[" + j + "] < " + min + " || f.vlaznostVazduha[" + j + "] > " + max + ") ";
                }


            }

        }

        if (uslov == 6) {

            var datumString1 = op;
            var vr = op.split('-');

            var datumString2 = string[++cur];
            var vr2 = datumString2.split('-');

            var datum1 = new Date(datumString1);
            var datum2 = new Date(datumString2);

            if (new DateDiff(datum1, datum2) > 0) {
                var godina1 = vr[0];
                var mesec1 = vr[1];
                var dan1 = vr[2];

                var godina2 = vr2[0];
                var mesec2 = vr2[1];
                var dan2 = vr2[2];
            } else {
                var godina2 = vr[0];
                var mesec2 = vr[1];
                var dan2 = vr[2];

                var godina1 = vr2[0];
                var mesec1 = vr2[1];
                var dan1 = vr2[2];
            }


            theRule += " && dateCmp((Date(" + godina1 + "," + mesec1 + "," + dan1 + ")), (Date(f.godina,f.mesec,f.dan))) == 1 && dateCmp((Date(" + godina2 + "," + mesec2 + "," + dan2 + ")), (Date(f.godina,f.mesec,f.dan))) == -1";

        }

        if (uslov == 7) {
            op = +op;


            if (op == 1)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.kalcijum[" + j + "]!=null && f.kalcijum[" + j + "] < " + (+string[++cur]);
            if (op == 2)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.kalcijum[" + j + "]!=null && f.kalcijum[" + j + "] > " + (+string[++cur]);

            if (op == 3)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.kalcijum[" + j + "]!=null && f.kalcijum[" + j + "] <= " + (+string[++cur]);
            if (op == 4)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.kalcijum[" + j + "]!=null && f.kalcijum[" + j + "] >= " + (+string[++cur]);

            if (op == 5) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.kalcijum[" + j + "]!=null && f.kalcijum[" + j + "] >= " + min + " && f.kalcijum[" + j + "] <=" + max;
            }

            if (op == 6) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.kalcijum[" + j + "]!=null && (f.kalcijum[" + j + "] < " + min + " || f.kalcijum[" + j + "] > " + max + ") ";
            }

        }

        if (uslov == 8) {
            op = +op;

            if (op == 1)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.fosfor[" + j + "]!=null && f.fosfor[" + j + "] < " + (+string[++cur]);
            if (op == 2)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.fosfor[" + j + "]!=null && f.fosfor[" + j + "] > " + (+string[++cur]);

            if (op == 3)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.fosfor[" + j + "]!=null && f.fosfor[" + j + "] <= " + (+string[++cur]);
            if (op == 4)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.fosfor[" + j + "]!=null && f.fosfor[" + j + "] >= " + (+string[++cur]);

            if (op == 5) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.fosfor[" + j + "]!=null && f.fosfor[" + j + "] >= " + min + " && f.fosfor[" + j + "] <=" + max;
            }

            if (op == 6) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.fosfor[" + j + "]!=null && (f.fosfor[" + j + "] < " + min + " || f.fosfor[" + j + "] > " + max + ") ";
            }


        }

        if (uslov == 9) {
            op = +op;

            if (op == 1)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.azot[" + j + "]!=null && f.azot[" + j + "] < " + (+string[++cur]);
            if (op == 2)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.azot[" + j + "]!=null && f.azot[" + j + "] > " + (+string[++cur]);

            if (op == 3)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.azot[" + j + "]!=null && f.azot[" + j + "] <= " + (+string[++cur]);
            if (op == 4)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.azot[" + j + "]!=null && f.azot[" + j + "] >= " + (+string[++cur]);

            if (op == 5) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.azot[" + j + "]!=null && f.azot[" + j + "] >= " + min + " && f.azot[" + j + "] <=" + max;
            }

            if (op == 6) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.azot[" + j + "]!=null && (f.azot[" + j + "] < " + min + " || f.azot[" + j + "] > " + max + ") ";
            }

        }

        if (uslov == 10) {
            op = +op;


            if (op == 1)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.ph[" + j + "]!=null && f.ph[" + j + "] < " + (+string[++cur]);
            if (op == 2)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.ph[" + j + "]!=null && f.ph[" + j + "] > " + (+string[++cur]);

            if (op == 3)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.ph[" + j + "]!=null && f.ph[" + j + "] <= " + (+string[++cur]);
            if (op == 4)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.ph[" + j + "]!=null && f.ph[" + j + "] >= " + (+string[++cur]);

            if (op == 5) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.ph[" + j + "]!=null && f.ph[" + j + "] >= " + min + " && f.ph[" + j + "] <=" + max;
            }

            if (op == 6) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.ph[" + j + "]!=null && (f.ph[" + j + "] < " + min + " || f.ph[" + j + "] > " + max + ") ";
            }

        }

        if (uslov == 11) {
            op = +op;


            if (op == 1)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.natrijum[" + j + "]!=null && f.natrijum[" + j + "] < " + (+string[++cur]);
            if (op == 2)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.natrijum[" + j + "]!=null && f.natrijum[" + j + "] > " + (+string[++cur]);

            if (op == 3)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.natrijum[" + j + "]!=null && f.natrijum[" + j + "] <= " + (+string[++cur]);
            if (op == 4)
                for (var j = 0; j < +string[cur + 2] + 1; j++)
                    theRule += " && f.natrijum[" + j + "]!=null && f.natrijum[" + j + "] >= " + (+string[++cur]);

            if (op == 5) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.natrijum[" + j + "]!=null && f.natrijum[" + j + "] >= " + min + " && f.natrijum[" + j + "] <=" + max;
            }

            if (op == 6) {
                var num1 = +string[++cur];
                var num2 = +string[++cur];
                var max;
                var min;

                if (num1 > num2) { max = num1; min = num2; } else { max = num2; min = num1; }
                for (var j = 0; j < +string[cur + 1] + 1; j++)
                    theRule += " && f.natrijum[" + j + "]!=null && (f.natrijum[" + j + "] < " + min + " || f.natrijum[" + j + "] > " + max + ") ";
            }

        }

        cur++;
    }

    flow.rule(data[i]._id + "" + i + "" + Math.random(), [Fact, "f", theRule], function (facts) {
        var not = new Notification(facts.f.parcelID, data[i].message, data[i].priority);
        var a = messages.find(el => el.parcelID == not.parcelID && el.message == not.message);
        if (a == null) messages.push(not);
    });

}


function addFact(data, session) {
    if (data.parcelID != null) {
        var f = new Fact(+data.parcelID, data.culture, data.vlaznost, data.temperatura, data.temperaturaPrognoza, data.padavine, data.vetar, data.vlaznostVazduha, data.vlaznostVazduhaPrognoza, +data.godina, +data.mesec, +data.dan, data.kalcijum, data.fosfor, data.azot, data.ph, data.natrijum, data.vetarSenzor, data.padavineSenzor);
        session.assert(f);
    }
}

function copyBasicRules(db, parcelID, callback) {
    var collection = db.collection('rules' + parcelID);
    var col = db.collection('rules');

    col.find().toArray(function (err, data) {


        recAddBasicRules(db, data, 0, collection, function (call) {
            callback({});
        });
    });
}

function recAddBasicRules(db, data, ind, collection, callback) {
    if (ind == data.length) callback({}); else {
        collection.insert(data[ind], function (data2) {
            recAddBasicRules(db, data, ++ind, collection, callback);
        });
    }
}

var collection1;
function recFind(parcel, ind, temp, callback) {
    MongoClient.connect(uri, function (err, client) {

        if (ind < parcel.length) {
            client.db("PlanTECH").collection('rules' + parcel[ind].ID);
            collection1 = client.db("PlanTECH").collection('rules' + parcel[ind].ID);
            collection1.find().toArray(function (err, data) {
                if (data != undefined) {
                    data.forEach(el => {

                        temp.push(el);
                    });

                }
                recFind(parcel, ind + 1, temp, callback);
            });
        } else {
            callback(temp);
        }
        client.close();
    });
}

function similarRule(allParcels, rule, ind, req, db, callback) {

    if (ind == allParcels.length) callback({ success: false }); else {
        collection = db.collection('rules' + allParcels[ind].ID);
        if (+allParcels[ind].ID < 0) similarRule(allParcels, rule, ++ind, req, db, callback); else {
            collection.find().toArray(function (err, data) {

                if (data != undefined) {

                    var oldRule = "false";
                    var newestRule = "false";

                    data.forEach(el => {

                        newestRule = addParcelsToRuleIfSame(el.rule.split(" "), rule.split(" "));
                        if (newestRule != "false" && req.body.newMessage == el.message) oldRule = el.rule;
                    });

                    if (oldRule != "false") {
                        deleteOldRuleFromAllParcels(allParcels, oldRule, 0, req, db, function (data2) {
                            addChangedRulesToParcels(newestRule, newestRule.split(" "), 0, req, db, function (data3) {
                                callback({ success: true });
                            });
                        });
                    } else
                        similarRule(allParcels, rule, ++ind, req, db, callback);
                }
            });
        }
    }
}

function addParcelsToRuleIfSame(rule1, rule2) {
    var newRule = "false"; var len = 0;
    if (checkIfRulesAreTheSameExceptParcels(rule1, rule2) == true) {
        newRule = "";
        for (var i = 1; i <= (rule1[0]); i++) {
            newRule = newRule + " " + rule1[i];
            len++;
        }

        for (var i = 1; i <= (rule2[0]); i++) {
            var check = false;
            for (var j = 1; j <= (rule1[0]); j++)
                if (rule2[i] == rule1[j]) check = true;

            if (check == false) { newRule = newRule + " " + rule2[i]; len++; }
        }
        newRule = len + "" + newRule;

        for (i = (+rule1[0]) + 1; i < rule1.length; i++)
            newRule = newRule + " " + rule1[i];

    }

    return newRule;
}

function checkIfRulesAreTheSameExceptParcels(rule1, rule2) {

    var cur1 = (+rule1[0] + 1);
    var cur2 = (+rule2[0] + 1);

    if (rule1[cur1] != rule2[cur2]) return false;

    for (var i = cur1 + 1; i <= cur1 + (+rule1[cur1]); i++) {
        var check = false;
        for (var j = cur2 + 1; j <= cur2 + (+rule2[cur2]); j++)
            if (rule1[i] == rule2[j]) check = true;
        if (check == false) return false;
    }

    cur1 = cur1 + (+rule1[cur1]) + 1;
    cur2 = cur2 + (+rule2[cur2]) + 1;

    for (i = cur1; i < rule1.length; i++ , cur2++)
        if (rule1[i] != rule2[cur2]) return false;


    return true;

}

function checkIfRulesAreTheSameExceptCultures(rule1, rule2) {


    var cur1 = 0;
    var cur2 = 0;

    if (rule1[cur1] != rule2[cur2]) return false;

    for (var i = cur1 + 1; i <= cur1 + (+rule1[cur1]); i++) {
        var check = false;
        for (var j = cur2 + 1; j <= cur2 + (+rule2[cur2]); j++)
            if (rule1[i] == rule2[j]) check = true;
        if (check == false) return false;
    }

    cur1 = cur1 + (+rule1[cur1]) + 1;
    cur2 = cur2 + (+rule2[cur2]) + 1;

    cur1 = cur1 + (+rule1[cur1]) + 1;
    cur2 = cur2 + (+rule2[cur2]) + 1;


    for (i = cur1; i < rule1.length; i++ , cur2++)
        if (rule1[i] != rule2[cur2]) return false;


    return true;
}



app.listen(2038, function () {
    console.log("Server startovan!");
});
