var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./db/SensorsF.db');
var bodyParser = require('body-parser');

urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/getSensorTypes', urlencodedParser, function (req, res) {
	sql = "SELECT ID as id, ime, opis from SensorType";
	db.all(sql, function (err, rows) {

		if (err) {
			res.send({ data: null });
		}
		else {
			res.send({ data: JSON.stringify(rows) });
		}
	});
});
app.post('/getSensorCount', urlencodedParser, function (req, res) {
	var IDs = JSON.parse(req.body.parcelIDs);

	if (IDs.length == 0) res.send({ count: 0 });
	else {
		var into = "(" + IDs[0].ID;
		for (var i = 1; i < IDs.length; i++) {
			into += "," + IDs[i].ID;
		}
		into += ")";

		sql = "SELECT COUNT(DISTINCT SensorID) as count FROM ParcelSensor WHERE ParcelID IN " + into;

		db.all(sql, function (err, rows) {
			res.send({ count: rows[0].count });
		});
	}
});

app.post('/deleteParcelSensor', urlencodedParser, function (req, res) {

	var parcelID = req.body.parcelID;

	sql = "DELETE FROM ParcelSensor WHERE ParcelID = ?";
	db.run(sql, [parcelID], function () { });

	res.send({});
});

app.post('/deleteSensor', urlencodedParser, function (req, res) {

	var sID = req.body.sID;

	sql = "DELETE FROM ParcelSensor WHERE SensorID = ?";
	db.run(sql, [sID], function () {
		sql = "DELETE FROM Sensor WHERE ID = ?";

		db.run(sql, [sID], function () {
			res.send({});
		})
	});
});

app.post('/saveParcelEdit', urlencodedParser, function (req, res) {

	var sensors = JSON.parse(req.body.coords);
	var parcelID = req.body.parcelID;
	var userID = req.body.userID;

	db.run(sql, function () {
		sql = "DELETE FROM ParcelSensor WHERE ParcelID = ?";
		db.run(sql, [parcelID], function () {
			sql = "INSERT INTO ParcelSensor VALUES ";
			var arr = [];
			var i = 0;
			sensors.forEach(sensor => {
				if (i++ > 0) {
					sql += ", ";
				}
				if (sensor.IP == undefined) sensor.IP = "";
				sql += "(null,?,?)";
				arr.push(parcelID);
				arr.push(sensor.ID);
			});

			db.run(sql, arr, function () {
				res.send({});
			});
		});
	});

});

app.post('/addParcelSensor', urlencodedParser, function (req, res) {

	var info = JSON.parse(req.body.data);
	var userID = info.userID;

	sql = "INSERT INTO Sensor VALUES ";

	var i = 0;
	var arr = [];
	info.coords.forEach(sensor => {
		if (i++ > 0) {
			sql += ", ";
		}

		if (sensor.IP == undefined) sensor.IP = "";

		sql += "(null,?, ?, ?, " + ((Math.round(Math.random() * 10) % 7) + 1) + ",?,'" + new Date(Date.now()) + "',?)";
		arr.push(sensor.lng);
		arr.push(sensor.lat);
		arr.push(sensor.sensorType);
		arr.push(sensor.IP);
		arr.push(userID);
	});

	db.run(sql, arr, function (err) {

		info.coords.forEach(sensor => {
			sql = "SELECT ID FROM SENSOR WHERE latitude =? AND longitude=?";

			db.all(sql, [sensor.lat, sensor.lng], function (err, data) {
				sql = "INSERT INTO ParcelSensor VALUES (null,?,?)";

				db.run(sql, [info.parcelID, data[0].ID], function () { });
			});
		});
	});
	res.send({});
});

app.post('/updateParcelSensor', urlencodedParser, function (req, res) {

	var info = JSON.parse(req.body.json).input;

	sql = "UPDATE ParcelSensor set SensorID=? where ParcelID=?";
	db.run(sql, [info.SensorID, info.ParcelID], function () {
	});
	res.send({});
});

app.post('/getSensorByIp', urlencodedParser, function (req, res) {

	var body = req.body;

	sql = "SELECT s.*, st.ime FROM Sensor s JOIN SensorType st ON s.SensorType = st.ID WHERE IP = ?";
	db.all(sql, [body.ipAddress], function (err, data) {
		if (data.length == 0) res.send({ sensor: null });
		else res.send({ sensor: data[0] });
	});
});

app.post('/addSensor', urlencodedParser, function (req, res) {

	var info = JSON.parse(req.body.json).input;
	var userID = info.userID;

	sql = "INSERT INTO Sensor VALUES (null,?,?,?,?,?,'" + new Date(Date.now()) + "',?);"
	db.run(sql, [info.longitude, info.latitude, info.SensorType, info.randomizer, info.IP, userID], function () {
	});
	res.send({});
});

app.post('/getSensorsForGeneralMap', urlencodedParser, function (req, res) {
	var into = req.body.IDs;

	sql = "SELECT s.*, st.ime, ps.ID as ParcelID FROM Sensor s LEFT JOIN SensorType st ON s.SensorType = st.ID LEFT JOIN ParcelSensor ps ON s.ID = ps.SensorID WHERE s.UserID IN " + into;

	db.all(sql, function (err, data) {
		res.send({ sensors: data })
	});
});

app.post('/addSensorWithParcels', urlencodedParser, function (req, res) {

	var info = req.body;
	var date = new Date(Date.now());

	info.parcels = JSON.parse(info.parcels);

	var IP = info.IP;

	sql = "SELECT * FROM Sensor WHERE IP = ?";

	db.all(sql, [IP], function (err, data) {
		if (data.length == 0) {
			sql = "INSERT INTO Sensor VALUES (null,?,?,?, 0,?,?,?);"
			db.run(sql, [info.lng, info.lat, info.sensorType, info.IP, date, info.userID], function () {
				sql = "SELECT s.*, st.ime FROM Sensor s JOIN SensorType st ON s.SensorType = st.ID WHERE s.latitude = ? AND s.longitude = ? AND s.userID =? and s.Date = ?";

				db.all(sql, [info.lat, info.lng, info.userID, date], function (err, data) {
					if (info.parcels.length == 0) {
						res.send({ status: true, sensor: data[0], parcels: [] });
					}
					else {
						var arr = [];
						sql = "INSERT INTO ParcelSensor VALUES (null,?,?)";
						arr.push(info.parcels[0].ID);
						arr.push(data[0].ID);

						for (var i = 1; i < info.parcels.length; i++) {
							sql += ",(null,?,?)";
							arr.push(info.parcels[i].ID);
							arr.push(data[0].ID);
						}

						db.run(sql, arr, function () {
							sql = "SELECT * FROM ParcelSensor WHERE SensorID = ?";

							db.all(sql, [data[0].ID], function (err, rows) {
								res.send({ status: true, sensor: data[0], parcels: rows });
							});
						});
					}
				});
			});
		}
		else res.send({ status: false });
	})
});

app.post('/addEditSensorWithParcels', urlencodedParser, function (req, res) {

	var info = req.body;

	info.parcels = JSON.parse(info.parcels);

	sql = "UPDATE Sensor SET longitude = ?, latitude = ?, SensorType = ?, IP = ? WHERE ID =?";
	db.run(sql, [info.lng, info.lat, info.SensorType, info.IP, info.ID], function (err) {
		sql = "DELETE FROM ParcelSensor WHERE SensorID =?";

		db.run(sql, [info.ID], function () {
			if (info.parcels.length == 0) {
				res.send({});
			}
			else {
				var arr2 = [];
				sql = "INSERT INTO ParcelSensor VALUES (null,?,?)";
				arr2.push(info.parcels[0].ID);
				arr2.push(info.ID);
				for (var i = 1; i < info.parcels.length; i++) {
					sql += ",(null,?,?)";
					arr2.push(info.parcels[i].ID);
					arr2.push(info.ID);
				}

				db.run(sql, arr2, function () {
					res.send({});
				});
			}
		});
	});
});

app.post('/updateSensor', urlencodedParser, function (req, res) {

	var info = JSON.parse(req.body.json).input;

	sql = "UPDATE Sensor set longitude=?, latitude=?, SensorType=?, randomizer=?, IP =? where SensorID=?";
	db.run(sql, [info.longitude, info.latitude, info.SensorType, info.randomizer, info.IP, info.SensorID], function () {
	});
	res.send({});
});

app.post('/getParcelSensor', urlencodedParser, function (req, res) {

	var ID = req.body.sensorID;

	sql = "SELECT ParcelID FROM ParcelSensor WHERE SensorID = ?";
	db.all(sql, [ID], function (err, data) {
		var tmp = [];

		data.forEach(e => { tmp.push(e.ParcelID) });

		res.send({ list: tmp });
	});
});

app.post('/getSensors', urlencodedParser, function (req, res) {

	var parcelID = req.body.ID;
	var userID = req.body.userID;

	if (parcelID != undefined) {
		sql = "SELECT s.ID, s.longitude, s.latitude, s.SensorType, st.ime, s.IP, 1 as used from Sensor s JOIN ParcelSensor ps ON ps.SensorID = s.ID JOIN SensorType st ON s.SensorType = st.ID WHERE ps.ParcelID = ?" +
			" UNION SELECT Sensor.ID, longitude, latitude, SensorType, st.ime, IP, 0 as used FROM Sensor JOIN SensorType st ON SensorType = st.ID WHERE UserID = ?" + " AND Sensor.ID NOT IN (SELECT s.ID from Sensor s JOIN ParcelSensor ps ON ps.SensorID = s.ID JOIN SensorType st ON s.SensorType = st.ID WHERE ps.ParcelID = ?" + ")"
		db.all(sql, [parcelID, userID, parcelID], function (err, rows) {
			if (err || rows.length == 0) {
				res.send([]);
			}
			else {
				res.send(rows);
			}
		});
	}
	else {
		sql = "SELECT Sensor.ID, longitude, latitude, SensorType, st.ime, IP, 0 as used FROM Sensor JOIN SensorType st ON SensorType = st.ID WHERE UserID = ?";
		db.all(sql, [userID], function (err, rows) {
			if (err || rows.length == 0) {
				res.send([]);
			}
			else {
				res.send(rows);
			}
		});
	}
});

app.post('/getHumidityForParcels', urlencodedParser, function (req, res) {

	var parcels = JSON.parse(req.body.plantages);

	if (parcels.length == 0) res.send(JSON.stringify({ sensors: [] }));
	else {
		var arr = [];

		all = "(" + parcels[0].ID;

		for (var i = 1; i < parcels.length; i++) {
			all += "," + parcels[i].ID;
		}
		all += ")";

		sql = "SELECT s.*, st.ime, ps.ParcelID FROM Sensor s JOIN SensorType st ON s.SensorType = st.ID JOIN ParcelSensor ps ON s.ID = ps.SensorID WHERE ps.ParcelID IN " + all;

		db.all(sql, arr, function (err, data) {

			recFind([], data, 0, function (retData) {

				sql = "SELECT * from SensorType";

				db.all(sql, function (err, rows) {
					retData.forEach(el => {
						rows.forEach(el2 => {
							if (el[el2.ime.replace(" ", "")] == undefined)
								el[el2.ime.replace(" ", "")] = [undefined, undefined, undefined, undefined, undefined];
						});
					});

					parcels.forEach(el => {
						var tmp = retData.find(e => e.parcelID == el.ID);

						if (tmp == null) {
							var t = {
								parcelID: el.ID
							}

							rows.forEach(el2 => {
								t[el2.ime.replace(" ", "")] = [undefined, undefined, undefined, undefined, undefined];
							});

							retData.push(t);
						}
					});

					res.send(JSON.stringify({ sensors: retData }));
				});

			});
		});
	}
});

function recFind(array, data, ind, callback) {
	if (data)
		if (data.length == ind) callback(array)
		else {
			var ime = data[ind].ime.replace(" ", "");
			var randomizer = (Math.round(data[ind].latitude * 1000) + Math.round(data[ind].longitude * 1000)) % 20;

			sql = "SELECT ps.ParcelID, AVG(vv1.value) as value1, AVG(vv2.value) as value2, AVG(vv3.value) as value3, AVG(vv4.value) as value4, AVG(vv5.value) as value5  FROM ParcelSensor ps JOIN Sensor s ON ps.SensorID = s.ID";
			for (var i = 0; i < 5; i++) {
				var tmp = new Date(Date.now());
				tmp.setDate(tmp.getDate() - i);
				var d = tmp.getDate();
				var num = (d + randomizer) % 20;

				sql += " JOIN " + ime + "Value vv" + (i + 1) + " ON vv" + (i + 1) + ".ID = " + num;
			}

			db.all(sql, function (err, rows) {

				var tmp = array.find(el => el.parcelID == data[ind].ParcelID);

				if (tmp != null) {
					if (tmp[ime] == undefined) {
						tmp[ime] = [rows[0].value5, rows[0].value4, rows[0].value3, rows[0].value2, rows[0].value1];
					}
				}
				else {
					tmp = {
						parcelID: data[ind].ParcelID
					};
					tmp[ime] = [rows[0].value5, rows[0].value4, rows[0].value3, rows[0].value2, rows[0].value1];

					array.push(tmp);
				}

				recFind(array, data, ind + 1, callback);
			});
		}
}

function dateDiff(d1, d2) {
	d1.setHours(12, 0, 0);
	d2.setHours(12, 0, 0);
	var t2 = d2.getTime();
	var t1 = d1.getTime();

	return parseInt((t2 - t1) / (24 * 3600 * 1000));
}

app.post('/getSensorMeasurement', urlencodedParser, function (req, res) {

	var days = req.body.days;
	var id = req.body.id;

	sql1 = "SELECT s.*, st.ime from Sensor s JOIN SensorType st ON s.SensorType = st.ID WHERE s.ID = ?";


	db.all(sql1, [id], function (err, rows1) {
		if (err || rows1.length == 0) {
			res.send([]);
		}
		else {
			sql2 = "";

			var ime = rows1[0].ime.replace(" ", "");

			var randomizer = (Math.round(rows1[0].latitude * 1000) + Math.round(rows1[0].longitude * 1000)) % 20;
			for (var i = days - 1; i >= 0; i--) {
				var tmp = new Date(Date.now());
				tmp.setDate(tmp.getDate() - i);
				var d = tmp.getDate();
				var num = (d + randomizer) % 20;
				var arr2 = [];
				if (i != 0) {
					sql2 += "SELECT value," + Math.round((Date.now() - i * 24 * 60 * 60 * 1000) / 1000) + " as Date from " + ime + "Value WHERE ID = " + num + " UNION ALL ";

				} else {
					sql2 += "SELECT value," + Math.round((Date.now() - i * 24 * 60 * 60 * 1000) / 1000) + " as Date from " + ime + "Value WHERE ID = " + num;


				}

			}

			db.all(sql2, function (err, rows2) {
				if (err || rows2.length == 0) {
					res.send([]);
				}
				else {
					res.send(rows2);
				}
			});

		}
	});
});



destroy = function () {
	if (db != null) {
		db.close();
		db = null;
	}
}

app.listen(2037, function () {
	console.log("Server startovan!");
});