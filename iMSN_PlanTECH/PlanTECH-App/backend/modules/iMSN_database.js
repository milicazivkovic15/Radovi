var exports = module.exports = {};
var sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../db/iMSN_DatabaseF.db');
var DateDiff = require('date-diff');
var crypto = require('crypto');
var fs = require('fs');
openConnection = function () {
	return new sqlite3.Database(dbPath);
}

exports.login = function (user, pass, callback) {
	var db = openConnection();

	pass = getSHA1(pass);

	sql = "SELECT u.ID as ID, u.PaymentType, u.AccountTypeID, at.Title as Type, u.ActivationDate as Datum from User as u join AccountType as at on u.AccountTypeID=at.ID where u.Username=? and u.Password=?";
	db.all(sql, [user.toLowerCase(), pass], function (err, rows) {
		console.log(err);
		if (err) {
			callback(false, false);
		}
		else {
			if (rows.length == 0) {
				sql = "SELECT ID from PendingOwner where Username=? and Password=?";
				db.all(sql, [user.toLowerCase(), pass], function (err1, rows1) {
					destroy(db);
					if (err1) {
						callback(false, false)
					}
					else {
						if (rows1.length == 0)
							callback(false, false);
						else {
							callback(false, true);
						}
					}
				});
			}
			else if (rows[0].AccountTypeID == 3 || rows[0].AccountTypeID == 4) {
				destroy(db);
				var now = new Date();
				var datum = new Date(rows[0].Datum);
				if (((new DateDiff(now, datum)).months()) - 12 >= 0)
					callback(rows[0].ID, rows[0].Type, false);
				else
					callback(rows[0].ID, rows[0].Type, true);
			}
			else {
				callback(rows[0].ID, rows[0].Type, true);
			}
		}
	});
}

exports.usersForValidation = function (callback) {
	var db = openConnection();

	sql = "SELECT Fname, Lname, ID, URL, `E-mail` as email, Username, Phone, PaymentType FROM PendingOwner WHERE URL IS NOT NULL";

	db.all(sql, function (err, rows) {
		destroy(db);

		if (err) {
			callback(false);
		}
		else {
			callback(JSON.stringify(rows));
		}
	});
}

exports.moveUser = function (ID, callback) {
	var db = openConnection();

	sql = "SELECT Fname, Lname, Username, Password, `E-mail` as email, Phone, URL, PaymentType  FROM PendingOwner WHERE ID=?";

	db.all(sql, [ID], function (err, rows) {
		var row = rows[0];
		if (callback != undefined) callback(row.email);
		fs.unlink(__dirname + "/../public" + row.URL, function () { });
		sql = "select * from User where Username=?";

		db.all(sql, [row.Username.toLowerCase()], function (err, rows1) {
			if (rows1.length > 0) {
				var accType = rows1[0].AccountTypeID;

				var paymentType = row.PaymentType < 10 ? row.PaymentType : row.PaymentType % 10;

				if (paymentType == 1 || paymentType == 2 || paymentType == 3) accType = 3;
				var datum = new Date(Date.now());
				sql = "Update User SET ActivationDate=?, PaymentType = ?, AccountTypeID = ? where Username=?";
				db.run(sql, [datum, paymentType, accType, row.Username.toLowerCase()], function () {
					sql = "DELETE FROM PendingOwner WHERE ID=?";
					db.run(sql, [ID], function () {
						destroy(db);
					});
				});
			}
			else {
				sql = "INSERT INTO User(Fname,Lname,Username,Password,`E-mail` ,Phone, AccountTypeID,ActivationDate, PaymentType) VALUES (?,?,?,?,?,?,3,'" + new Date() + "',?)";
				db.run(sql, [row.Fname, row.Lname, row.Username.toLowerCase(), row.Password, row.email, row.Phone, row.PaymentType], function () {
					sql = "DELETE FROM PendingOwner WHERE ID=?";
					db.run(sql, [ID], function () {
						destroy(db);
					});
				});
			}
		});
	});
}


exports.deleteUser = function (ID, callback) {
	var db = openConnection();
	sql = "SELECT Fname, Lname, Username, Password, `E-mail` as email, Phone, URL  FROM PendingOwner WHERE ID=?";

	db.all(sql, [ID], function (err, rows) {
		if (callback != undefined) callback(rows[0].email);
		fs.unlink(__dirname + "/../public" + rows[0].URL, function () { });

		sql = "DELETE FROM PendingOwner WHERE ID=?";
		db.run(sql, [ID], function () {
			destroy(db);
		});
	});

}

exports.getAllPermissions = function (ID, callback) {
	var db = openConnection();
	sql = "SELECT u.*, u.`E-Mail` as email, u.ID as accID FROM User u JOIN OwnerWithUser ow ON u.ID = ow.UserID WHERE ow.OwnerID=?";

	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows);
	});

}

exports.getAllPermissionsOfWorker = function (myID, workerID, callback) {
	var db = openConnection();
	sql = "SELECT " + workerID + " as accID, p.Title, pm.Rules, pm.View, pm.Edit, pm.ParcelID FROM Parcel p JOIN Permissions pm ON p.ID = pm.ParcelID WHERE p.UserID = " + myID + " AND pm.UserID = " + workerID + " UNION SELECT " + workerID + " as accID, p.Title, 0 as Rules, 0 as View, 0 as Edit, p.ID as ParcelID FROM Parcel p WHERE p.UserID = " + myID + " AND p.ID NOT IN (SELECT pm.ParcelID as ID FROM Parcel p JOIN Permissions pm ON p.ID = pm.ParcelID WHERE p.UserID = " + myID + " AND pm.UserID = " + workerID + ")";

	db.all(sql, function (err, rows) {
		destroy(db);
		callback(rows);
	});

}

exports.getUser = function (ID, callback) {
	var db = openConnection();
	sql = "SELECT *, `E-mail` as email FROM User WHERE ID=?";

	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows.length != 0 ? rows[0] : { Fname: '', Lname: '' });
	});

}
exports.changeUser = function (user, callback) {
	var db = openConnection();
	sql = "SELECT ID from User where Username=? and ID!=? UNION Select ID from PendingOwner where  Username=?";
	db.all(sql, [user.username.toLowerCase(), user.ID, user.username], function (err, rows) {
		if (!err) {
			if (rows.length > 0) {
				destroy(db);
				callback(false);
			}
			else {
				var arr = [];
				if (user.password == "") {
					sql = "Update User SET Username=?, Fname=?, Lname=?, Phone=?, `E-mail`=? WHERE ID=?";
					arr.push(user.username.toLowerCase());
					arr.push(user.fname);
					arr.push(user.lname);
					arr.push(user.phone);
					arr.push(user.email);
					arr.push(user.ID);
				}
				else {
					var pass = getSHA1(user.password);
					sql = "Update User SET Password=? WHERE ID=?";
					arr.push(pass);
					arr.push(user.ID);
				}
				db.run(sql, arr, function (err) {
					destroy(db);
					callback(true);
				});
			}
		}
	});
}

exports.insertRegisteredUser = function (user, callback) {
	var db = openConnection();
	if (user.paid && user.accType == undefined) {
		sql = "SELECT ID from User where Username=? ";
		db.all(sql, [user.username.toLowerCase()], function (err, rows) {

			if (!err) {

				if (rows.length > 0) {
					destroy(db);
					callback("username");
				}
				else {
					sql = "SELECT ID from User where `E-mail`=?";
					db.all(sql, [user.email], function (err, rows) {

						if (!err) {
							if (rows.length > 0) {
								destroy(db);
								callback("email");
							}
							else {
								sql = "SELECT ID from PendingOwner where Username=? ";
								db.all(sql, [user.username.toLowerCase()], function (err1, rows1) {
									if (!err1) {
										if (rows1.length > 0) {
											destroy(db);
											callback("username");
										}
										else {
											sql = "SELECT ID from PendingOwner where `E-mail`=? ";
											db.all(sql, [user.email], function (err1, rows1) {
												if (!err1) {
													if (rows1.length > 0) {
														destroy(db);
														callback("email");
													}
													else {
														sql = "INSERT INTO PendingOwner(Fname,Lname,Username,Password,`E-mail` ,Phone, PaymentType) VALUES (?,?,?,?,?,?,?)";
														db.run(sql, [user.fname, user.lname, user.username.toLowerCase(), getSHA1(user.password), user.email, user.phone, user.PaymentType], function () {
															destroy(db);
															callback("true");
														});

													}
												}
											});
										}
									}
								});
							}
						}

					});
				}
			}
		});
	}
	else {
		sql = "SELECT ID from User where Username=? ";
		db.all(sql, [user.username.toLowerCase()], function (err, rows) {
			if (rows.length > 0) {
				destroy(db);
				callback("username");
			}
			else {
				sql = "SELECT ID from User where `E-mail`=?";
				db.all(sql, [user.email], function (err, rows) {
					if (rows.length > 0) {
						destroy(db);
						callback("email");
					}
					else {
						sql = "INSERT INTO User(Fname,Lname,Username,Password,`E-mail` ,Phone, AccountTypeID, ActivationDate, PaymentType) VALUES (?,?,?,?,?,?,?,'" + new Date(Date.now()) + "',?)";
						db.run(sql, [user.fname, user.lname, user.username.toLowerCase(), getSHA1(user.password), user.email, user.phone, user.accType, user.PaymentType], function (err) {

							destroy(db);
							callback("true");
						});
					}
				});
			}
		});
	}
}


exports.getAllTickets = function (callback) {
	var db = openConnection();

	sql = 'select u.Fname || " " || u.Lname as fullName, u.PaymentType,s.ID,S.Date as date,s.Text as text from SupportTicket s join User u on u.ID=s.UserID';

	db.all(sql, function (err, rows) {
		destroy(db);

		if (err) {
			callback(false);
		}
		else {
			callback(JSON.stringify(rows));
		}
	});
}

exports.deleteSupportTicket = function (ID) {
	var db = openConnection();
	sql = "DELETE FROM SupportTicket WHERE ID=?";
	db.run(sql, [ID], function () {
		destroy(db);
	});
}

exports.addMobileNotifications = function (all, callback) {
	var db = openConnection();

	recAddMobileNotification(db, [], all, 0, 0, callback);
}

function recAddMobileNotification(db, ret, all, i, j, callback) {
	if (all.length == i) {
		destroy(db);
		callback(ret);
	}
	else {
		if (all[i].parcels.length == j) recAddMobileNotification(db, ret, all, i + 1, 0, callback);
		else {
			sql = "SELECT ID FROM MobileNotifications WHERE userID =? AND Message = ?";
			db.all(sql, [all[i].ID, 'Obavestenje: ' + all[i].parcels[j].Message + ', Plantaza: ' + all[i].parcels[j].Title], function (err, rows) {
				console.log(err);
				if (rows.length != 0) recAddMobileNotification(db, ret, all, i, j + 1, callback);
				else {
					var tmp = ret.find(el => el.ID == all[i].ID);

					if (tmp != null) {
						tmp.parcels.push(all[i].parcels[j]);
					}
					else {
						ret.push({
							ID: all[i].ID,
							email: all[i].email,
							parcels: [all[i].parcels[j]]
						});
					}

					sql = "INSERT INTO MobileNotifications VALUES (null,?,?,'" + new Date(Date.now()) + "','FALSE',1)";

					db.run(sql, ['Obavestenje: ' + all[i].parcels[j].Message + ', Plantaza: ' + all[i].parcels[j].Title, all[i].ID], function (err) {
						console.log(err);
						recAddMobileNotification(db, ret, all, i, j + 1, callback);
					});
				}
			});
		}
	}
}

exports.getAllParcelsWithViewers = function (callback) {
	var db = openConnection();

	sql = "SELECT u.*,p.ID as ParcelID, p.Title as Title FROM User u JOIN (SELECT p.ID, p.Title, p.UserID as User1, per.UserID as User2 FROM Parcel p LEFT JOIN Permissions per ON p.ID = per.ParcelID) p ON u.ID = p.User1 OR u.ID = p.User2";

	db.all(sql, function (err, data) {
		var ret = [];
		data.forEach(el => {
			var tmp = ret.find(e => e.ParcelID == el.ParcelID);

			if (tmp != null) {
				tmp.users.push(el);
			}
			else {
				ret.push({
					ParcelID: el.ParcelID,
					Title: el.Title,
					users: [el]
				})
			}
		});

		callback(ret);
	})
};

exports.getMail = function (ID, callback) {
	var db = openConnection();
	sql = "select `E-Mail` as email from User where ID=?";
	db.all(sql, [ID], function (err, rows) {
		console.log(err);
		destroy(db);

		callback(rows[0].email);
	});
}

exports.getEmail = function (user, temp, callback) {
	var db = openConnection();
	sql = "select ID,`E-Mail` as email from User where Username=?";

	db.all(sql, [user.toLowerCase()], function (err, rows) {

		if (err) {
			destroy(db);
			callback(false)
		}
		else {
			if (rows.length > 0) {
				var pass = getSHA1(temp);
				sql = "Update User set Password=? where ID=?";
				db.run(sql, [pass, rows[0].ID], function () {
					destroy(db);
					callback(rows[0].email);
				});


			}

			else {
				destroy(db);
				callback(false);
			}
		}
	});
}
exports.getEmailFromSupportTicket = function (ID, callback) {
	var db = openConnection();
	sql = 'select u.`E-Mail` as email from SupportTicket s join User u on u.ID=s.UserID where s.ID=?';

	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows[0].email);
	});
}

exports.addSupportTicket = function (userID, Text, date) {
	var db = openConnection();
	sql = "INSERT INTO SupportTicket(ID,UserID,Text,Date)  VALUES (null,?,?,?)";

	db.run(sql, [userID, Text, date], function () {
		destroy(db);
	});
}
exports.deleteOldNotif = function (ID, callback) {
	days = "(";
	var br = 0;
	var db = openConnection();
	var now = new Date();
	sql = "select * from Notification where UserID=?";
	db.all(sql, [ID], function (err, rows) {
		if (rows.length > 0) {
			rows.forEach(el => {
				var datum = new Date(el.Date);

				if (((new DateDiff(now, datum)).days()) > 3) {

					if (br == 0) {
						br++;
						days += "" + el.ID;
					}
					else {
						days += "," + el.ID;
					}
				}

			});
			days += ")";
			sql = "Delete from Notification where ID in ?";
			db.run(sql, [days], function () {
				callback(true);
			});
		}
		else {
			callback(true);

		}
	});

}

exports.updateData = function (username, ID, type, callback) {
	if (username != undefined) {
		sql = "UPDATE User SET AccountTypeID = 3, PaymentType = ?, ActivationDate = '" + new Date(Date.now()) + "' WHERE Username = ?";

		var db = openConnection();

		db.run(sql, [type, username.toLowerCase()], function (err) {
			sql = "SELECT `E-Mail` as email FROM User WHERE Username = ?";
			db.all(sql, [username.toLowerCase()], function (err, rows) {
				console.log(err);
				destroy(db);
				callback(rows[0].email);
			})
		});
	}
	else {
		sql = "UPDATE User SET AccountTypeID = 3, PaymentType = ?, ActivationDate = '" + new Date(Date.now()) + "' WHERE ID = ?";

		var db = openConnection();

		db.run(sql, [type, ID], function (err) {
			sql = "SELECT `E-Mail` as email FROM User WHERE ID = ?";
			db.all(sql, [ID], function (err, rows) {
				console.log(err);
				destroy(db);
				callback(rows[0].email);
			})
		});
	}
}

exports.getToDo = function (ID, callback) {
	sql = "Select * from Notification where ParcelID=?";

	var db = openConnection();

	db.all(sql, [ID], function (err, rows) {
		callback(rows);
	});
}

exports.doIt = function (ID, check, user) {
	sql = "Select * from Notification where ID=?";

	var db = openConnection();

	db.all(sql, [ID], function (err, rows) {
		if (rows.length > 0) {
			sql = "Update Notification set ToDo=? where ID=?";
			db.run(sql, [check, ID]);
			if (check == 0) {
				sql = "Delete from ToDo where UserID=? and Title=? and Date=? and ParcelID=?";
				db.run(sql, [user, rows[0].Title, rows[0].Date, rows[0].ParcelID]);
			}
			else {
				sql = "INSERT into ToDo(Title,UserID,ParcelID,Date) VALUES(?,?,?,?)"
				db.run(sql, [rows[0].Title, user, rows[0].ParcelID, rows[0].Date]);
			}
		}
	});
}
exports.getNumberSupportTicket = function (callback) {
	var db = openConnection();
	sql = "Select count(ID) as number from SupportTicket";

	db.all(sql, function (err, data) {
		destroy(db);
		callback(data[0].number);
	});
}

exports.getNumberPendingOwner = function (callback) {
	var db = openConnection();
	sql = "Select count(*) as numb From PendingOwner WHERE URL IS NOT NULL";

	db.all(sql, function (err, data) {
		destroy(db);
		callback(data[0].numb);
	});
}


exports.getCrops = function (callback) {
	var db = openConnection();
	sql = 'select * from Crops';

	db.all(sql, function (err, rows) {
		destroy(db);
		callback(rows);
	});
}
exports.getUserSubCrops = function (crop, username, callback) {
	var db = openConnection();
	sql = "SELECT ID from User where Username=?";
	db.all(sql, [username.toLowerCase()], function (err1, rows1) {
		rows1.forEach(function (row1) {
			sql = 'select ID,Title from CustomSubCrop where CropID=? and OwnerID=?';
			db.all(sql, [crop, row1.ID], function (err, rows) {
				destroy(db);
				callback(rows, row1.ID);
			});
		});
	});
}
exports.getOwnerSubCrops = function (crop, ID, callback) {

	var db = openConnection();
	sql = "SELECT c.ID, c.Title from OwnerWithUser as p join CustomSubCrop as c on c.OwnerID=p.OwnerID where p.UserID=? and c.CropID=?";
	db.all(sql, [ID, crop], function (err, rows) {
		destroy(db);
		callback(rows);
	});
}
exports.getFreeUsersSubCrops = function (crop, ID, callback) {

	var db = openConnection();
	sql = "SELECT c.ID, c.Title from OwnerWithUser as p join CustomSubCrop as c on c.OwnerID=p.UserID where p.OwnerID=? and c.CropID=?";
	db.all(sql, [ID, crop], function (err, rows) {
		destroy(db);
		callback(rows);
	});
}
exports.getSubCrops = function (crop, callback) {
	var db = openConnection();

	sql = 'select sc.ID, sc.Title || " - " || m.Title as Title from SubCrop sc JOIN SubCropOfManufacturer scom ON sc.ID = scom.SubCropID JOIN Manufacturer m ON scom.ManufacturerID = m.ID where CropsID=?';
	db.all(sql, [crop], function (err, rows) {
		console.log(err);
		destroy(db);

		callback(rows);
	});
}
exports.insertSubCrop = function (ID, crop, username, callback) {
	var db = openConnection();
	sql = "SELECT ID from User where Username=?";
	db.all(sql, [username.toLowerCase()], function (err1, rows1) {
		rows1.forEach(function (row1) {
			sql = "select ID from CustomSubCrop where Title=? and OwnerID=?";
			db.all(sql, [crop, row1.ID], function (err, rows) {
				if (rows.length > 0) {
					destroy(db);
					callback(false);
				}
				else {

					sql = "select ID from SubCrop where Title=?";
					db.all(sql, [crop], function (err, rows2) {
						if (rows2.length > 0) {
							destroy(db);
							callback(false);
						}
						else {
							sql = "INSERT INTO CustomSubCrop(OwnerID,Title,CropID) VALUES (?,?,?)";
							db.run(sql, [row1.ID, crop, ID], function () {

								destroy(db);
								callback(true);
							});
						}
					});
				}
			});
		});
	});
}
exports.getManufactures = function (callback) {
	var db = openConnection();
	sql = "select * from Manufacturer"
	db.all(sql, function (err, rows) {
		destroy(db);
		callback(rows);
	});
}

exports.updateSubCrop = function (ID, crop, callback) {
	var db = openConnection();
	sql = "select ID from CustomSubCrop where Title=?";
	db.all(sql, [crop], function (err, rows) {
		if (rows.length > 0) {
			destroy(db);
			callback(false);
		}
		else {

			sql = "select ID from SubCrop where Title=?";
			db.all(sql, [crop], function (err, rows2) {
				if (rows2.length > 0) {
					destroy(db);
					callback(false);
				}
				else {
					sql = "Update CustomSubCrop Set Title=? WHERE ID=?";
					db.run(sql, [crop, ID], function () {
						destroy(db);
						callback(true);
					});

				}
			});
		}
	});

}

exports.deleteSubCrop = function (IDsub, callback) {
	var db = openConnection();
	sql = "select * from SubCropOnParcel as p join CustomSubCrop as c on p.CustomCropID=c.ID  where c.ID=?";
	db.all(sql, [IDsub], function (err, rows2) {
		if (rows2.length > 0) {
			destroy(db);
			callback(false);
		}
		else {
			sql = "DELETE FROM CustomSubCrop WHERE ID=?";
			db.run(sql, [IDsub], function () {

				destroy(db);
				callback(true);
			});
		}
	});
}
exports.insertCrops = function (crop, callback) {
	var db = openConnection();
	sql = "select ID from Crops where Title=?";
	db.all(sql, [crop], function (err, rows2) {
		if (rows2.length > 0) {
			destroy(db);
			callback(false);
		}
		else {
			sql = "INSERT INTO Crops(Title) VALUES (?)";
			db.run(sql, [crop], function () {

				destroy(db);
				callback(true);
			});
		}
	});
}
exports.insertGeneralSubCrop = function (IDcrop, title, manuf, callback) {
	var db = openConnection();
	sql = "select ID from SubCrop where Title=? and CropsID=?";
	db.all(sql, [title, IDcrop], function (err, rows2) {
		if (rows2.length > 0) {
			destroy(db);
			callback(false);
		}
		else {
			sql = "INSERT INTO SubCrop(CropsID,Title) VALUES (?,?)";
			db.run(sql, [IDcrop, title], function () {
				sql = "select* from SubCrop where Title=? and CropsID=?";
				db.all(sql, [title, IDcrop], function (err, rows2) {
					sql = "select * from Manufacturer where Title=?";
					db.all(sql, [manuf], function (err, rows) {
						if (rows.length > 0) {
							sql = "INSERT INTO SubCropOfManufacturer(SubCropID,ManufacturerID) VALUES(?,?)"
							db.run(sql, [rows2[0].ID, rows[0].ID], function () {
								destroy(db);
								callback(true);
							});
						}
						else {
							sql = "INSERT INTO Manufacturer(Title) VALUES(?)";
							db.run(sql, [manuf], function () {
								sql = "select * from Manufacturer where Title=?";
								db.all(sql, [manuf], function (err, rows) {
									sql = "INSERT INTO SubCropOfManufacturer(SubCropID,ManufacturerID) VALUES(?,?)"
									db.run(sql, [rows2[0].ID, rows[0].ID], function () {
										destroy(db);
										callback(true);
									});
								});
							});
						}
					});
				});
			});
		}
	});
}
exports.deleteCrops = function (ID, callback) {
	var db = openConnection();
	sql = "select s.ID from SubCropOnParcel as p join SubCropOfManufacturer as m on p.ManufacturersCropID=m.ID join SubCrop as s on m.SubCropID=s.ID where s.CropsID=?";
	db.all(sql, [ID], function (err2, rows2) {
		if (rows2.length > 0) {
			destroy(db);
			callback(false);
		}
		else {
			sql = "select c.ID from SubCropOnParcel as p join CustomSubCrop as c on p.CustomCropID=c.ID  where c.CropID=?";
			db.all(sql, [ID], function (err, rows) {
				if (rows.length > 0) {
					destroy(db);


					callback(false);
				}
				else {
					sql = "DELETE FROM SubCrop WHERE CropsID=?";
					db.run(sql, [ID], function () {
						sql = "DELETE FROM CustomSubCrop WHERE CropID=?";
						db.run(sql, [ID], function () {

							sql = "DELETE FROM Crops WHERE ID=?";
							db.run(sql, [ID], function () {

								destroy(db);
								callback(true);
							});
						});

					});

				}
			});
		}
	});
}
exports.deleteGeneralSubCrop = function (IDsub, callback) {
	var db = openConnection();
	sql = "select * from SubCropOnParcel as p join SubCropOfManufacturer as m on p.ManufacturersCropID=m.ID join SubCrop as s on m.SubCropID=s.ID where s.ID=?";
	db.all(sql, [IDsub], function (err, rows2) {
		if (rows2.length > 0) {
			destroy(db);
			callback(false);
		}
		else {
			sql = "DELETE FROM SubCrop WHERE ID=?";
			db.run(sql, [IDsub], function () {
				sql = "DELETE from SubCropOfManufacturer where SubCropID=?";
				db.run(sql, [IDsub], function () {
					destroy(db);
					callback(true);
				});
			});
		}
	});
}
exports.updateCrops = function (crop, ID, callback) {
	var db = openConnection();
	sql = "select ID from Crops where Title=?";
	db.all(sql, [crop], function (err, rows2) {
		if (rows2.length > 0) {
			destroy(db);
			callback(false);
		}
		else {
			sql = "Update Crops Set Title=? WHERE ID=?";
			db.run(sql, [crop, ID], function () {

				destroy(db);
				callback(true);
			});
		}
	});
}
exports.updateGeneralSubCrop = function (IDcrop, IDsub, title, callback) {
	var db = openConnection();
	sql = "select ID from SubCrop where Title=? and CropsID=?";
	db.all(sql, [title, IDcrop], function (err, rows2) {
		if (rows2.length > 0) {
			destroy(db);
			callback(false);
		}
		else {
			sql = "Update SubCrop Set Title=? WHERE ID=?";
			db.run(sql, [title, IDsub], function () {

				destroy(db);
				callback(true);
			});
		}
	});
}
exports.getUsersForEdit = function (callback) {
	var db = openConnection();
	sql = 'SELECT *, `E-Mail` as email FROM User ORDER BY Fname || \' \' || Lname DESC';

	db.all(sql, function (err, rows) {
		destroy(db);

		if (err) {
			callback(false);
		}
		else {
			callback(JSON.stringify(rows));
		}
	});
}

exports.saveUserDataEdit = function (json, callback) {
	var db = openConnection();

	var user = JSON.parse(json);


	sql = "SELECT ID from User where Username=? and ID!=? UNION Select ID from PendingOwner where  Username=?";
	db.all(sql, [user.Username.toLowerCase(), user.ID, user.Username.toLowerCase()], function (err, rows) {
		if (!err) {
			if (rows.length > 0) {
				destroy(db);
				callback('1');
			}
			else {
				sql = "SELECT ID from User where `E-Mail`=? and ID!=? UNION Select ID from PendingOwner where `E-Mail`=?";
				db.all(sql, [user.email, user.ID, user.email], function (err, rows) {
					if (!err) {
						if (rows.length > 0) {
							destroy(db);
							callback('2');
						}
						else {
							var arr = [];

							sql = 'UPDATE User SET Fname=?, Lname=?, Username=?, `E-Mail`=?';
							arr.push(user.Fname);
							arr.push(user.Lname);
							arr.push(user.Username.toLowerCase());
							arr.push(user.email);
							if (user.Phone != '') { sql += ', phone=?'; arr.push(user.Phone); }
							if (user.Password != "********") { sql += " ,Password=?"; arr.push(getSHA1(user.Password)); }
							sql += ' WHERE ID=?';
							arr.push(user.ID);


							db.run(sql, arr, function () {
								destroy(db);
								callback('3');
							});
						}
					}
				});
			}
		}
	});
}

exports.insertAgronomist = function (user, userType, callback) {
	var db = openConnection();

	if (user.phone == undefined) user.phone = '';

	sql = "SELECT ID from User where Username=?";
	db.all(sql, [user.username.toLowerCase()], function (err, rows) {
		if (!err) {
			if (rows.length > 0) {
				destroy(db);
				callback("username");
			}
			else {
				sql = "SELECT ID from User where `E-mail`=?";
				db.all(sql, [user.email], function (err, rows) {
					if (!err) {
						if (rows.length > 0) {
							destroy(db);
							callback("email");
						}
						else {
							sql = "SELECT ID from PendingOwner where Username=?";
							db.all(sql, [user.username.toLowerCase()], function (err1, rows1) {
								if (!err1) {
									if (rows1.length > 0) {
										destroy(db);
										callback("username");
									}
									else {
										sql = "SELECT ID from PendingOwner where `E-mail`=?";
										db.all(sql, [user.email], function (err1, rows1) {
											if (!err1) {
												if (rows1.length > 0) {
													destroy(db);
													callback("email");
												}
												else {

													sql = "INSERT INTO User(Fname,Lname,Username,Password,`E-Mail`,Phone, AccountTypeID,ActivationDate, PaymentType) VALUES (?,?,?,?,?,?,?,'" + new Date() + "',-1)";
													db.run(sql, [user.fname, user.lname, user.username.toLowerCase(), getSHA1(user.password), user.email, user.phone, userType], function (err) {

														destroy(db);
														callback("true");
													});
												}
											}
										});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

exports.getPermissions = function (ID, callback) {
	var perms = {
		view: false,
		edit: false,
		rules: false
	}

	var db = openConnection();

	sql = "SELECT * FROM Permissions WHERE UserID=?";

	db.all(sql, [ID], function (err, rows) {
		destroy(db);

		if (err) callback(perms)
		else {
			rows.forEach(row => {
				perms.view = perms.view || row.View;
				perms.edit = perms.edit || row.Edit;
				perms.rules = perms.rules || row.Rules;
			});

			callback(perms);
		}
	});
}

exports.getPermissionsOfOwner = function (ID, callback) {
	var db = openConnection();
	sql = " SELECT User.Fname, User.Lname, User.Username,Permissions.*, Parcel.Title,User.`E-Mail`as email, User.ID as accID FROM Permissions JOIN User ON Permissions.UserID=User.ID JOIN Parcel ON Permissions.ParcelID = Parcel.ID WHERE Parcel.UserID = ?" +
		" UNION " +
		"SELECT  User.Fname, User.Lname, User.Username,null as ID, 0 as Rules, 0 as View, 0 as Edit, User.ID as UserID, null as ParcelID, null as Title ,User.`E-Mail`as email, User.ID as accID FROM User JOIN OwnerWithUser ON User.ID = OwnerWithUser.UserID JOIN Parcel on OwnerID = Parcel.UserID WHERE OwnerID =?";
	db.all(sql, [ID, ID], function (err, rows) {
		destroy(db);

		if (err) callback(false);
		else {
			callback(rows);
		}
	});
}

exports.savePermissions = function (rows) {
	var db = openConnection();

	rows.forEach(perms => {
		perms.Edit = perms.Edit ? 1 : 0;
		perms.View = perms.View ? 1 : 0;
		perms.Rules = perms.Rules ? 1 : 0;
	});
	if (rows.length != 0) {
		sql = "DELETE FROM Permissions WHERE (UserID = " + rows[0].accID + " AND ParcelID = " + rows[0].ParcelID + ")";

		for (var i = 1; i < rows.length; i++)
			sql += " OR (UserID = " + rows[i].accID + " AND ParcelID = " + rows[i].ParcelID + ")"

		db.run(sql, function () {
			sql = "INSERT INTO Permissions VALUES(null," + rows[0].Rules + "," + rows[0].View + "," + rows[0].Edit + "," + rows[0].accID + "," + rows[0].ParcelID + ")";

			for (var i = 1; i < rows.length; i++)
				sql += ",(null," + rows[i].Rules + "," + rows[i].View + "," + rows[i].Edit + "," + rows[i].accID + "," + rows[i].ParcelID + ")";

			db.run(sql, function () {
				destroy(db);
			})

		});
	}
}

exports.getOwnerID = function (parcelID, callback) {
	db = openConnection();
	sql = "SELECT UserID FROM Parcel WHERE ID = ?";

	db.all(sql, [parcelID], function (err, data) {
		callback(data[0].UserID);
	});
}

exports.getEditPermissions = function (ID, callback) {
	db = openConnection();
	sql = "SELECT Edit FROM Permissions WHERE UserID = ?";

	db.all(sql, [ID], function (err, data) {
		var count = 0;
		data.forEach(el => {
			count += el.Edit;
		});
		destroy(db);
		callback(count != 0);
	});
}

exports.getAllWorks = function (ID, callback) {
	db = openConnection();

	sql = "SELECT u.ID as OwnerID, u.Fname || ' ' || u.Lname as Name FROM User u JOIN OwnerWithUser o ON u.ID = o.OwnerID WHERE o.UserID = ?";

	db.all(sql, [ID], function (err, data) {
		console.log(err);
		destroy(db);
		callback(data);
	});
}

exports.deleteJob = function (ID, ownerID) {
	db = openConnection();
	sql = "DELETE FROM Permissions WHERE UserID = ? AND ParcelID IN (SELECT ID FROM Parcel WHERE UserID = ?)";

	db.run(sql, [ID, ownerID], function (err) {
		console.log(err);
		sql = "DELETE FROM OwnerWithUser WHERE UserID =? AND OwnerID=?";

		db.run(sql, [ID, ownerID], function (err) {
			console.log(err);
			destroy(db);
		});
	});
}

exports.getParcels = function (ID, callback) {
	var db = openConnection();
	sql = "SELECT p.UserID, p.ID, p.Title, null as Owner, p.Title as parcelWithOwner, No, MiddleLongitude, MiddleLatitude, 1 as View, 1 as Edit, 1 as Rules FROM User u JOIN Parcel p ON u.ID = p.UserID WHERE p.UserID = ?" +
		" UNION " +
		"SELECT p2.UserID, p2.ID, p2.Title, u2.Fname || ' ' || u2.Lname as Owner, p2.Title as parcelWithOwner, No, MiddleLongitude, MiddleLatitude, View, Edit, Rules FROM User u JOIN Permissions p ON u.ID = p.UserID JOIN Parcel p2 ON p.ParcelID = p2.ID JOIN User u2 ON p2.UserID = u2.ID WHERE u.ID = ?" + " AND View = 1";
	db.all(sql, [ID, ID], function (err, data) {
		destroy(db);
		if (err) callback([]);
		else callback(data);
	});
}

exports.getOwners = function (ID, callback) {
	var db = openConnection();
	sql = "SELECT OwnerID as UserID FROM OwnerWithUser WHERE UserID = ?";
	db.all(sql, [ID], function (err, data) {
		destroy(db);
		if (err) callback([]);
		else callback(data);
	});
}

exports.deleteParcel = function (ID, callback) {
	var db = openConnection();
	sql = "DELETE FROM Coordinates WHERE ParcelID = ?";

	db.run(sql, [ID], function () {
		sql = "DELETE FROM SubCropOnParcel WHERE ParcelID = ?";

		db.run(sql, [ID], function () {
			sql = "DELETE FROM Permissions WHERE ParcelID = ?";

			db.run(sql, [ID], function () {
				sql = "DELETE FROM Parcel WHERE ID = ?";

				db.run(sql, [ID], function () {
					callback();
				});
			});
		});
	});
}

exports.getCropsForParcel = function (ID, callback) {
	var db = openConnection();
	sql = "SELECT 'm' || p.ManufacturersCropID as ID, sc.Title || ' - ' || m.Title as Name " +
		"FROM SubCropOnParcel p JOIN SubCropOfManufacturer scom ON p.ManufacturersCropID = scom.ID JOIN SubCrop sc ON scom.SubCropID = sc.ID JOIN Manufacturer m ON scom.ManufacturerID = m.ID " +
		"WHERE p.ParcelID = ?" +
		" UNION " +
		"SELECT 'c' || p.customCropID as ID, c.Title as Name " +
		"FROM SubCropOnParcel p JOIN CustomSubCrop c ON p.CustomCropID = c.ID " +
		"WHERE p.ParcelID = ?";
	db.all(sql, [ID, ID], function (err, data) {
		destroy(db);
		if (err || data.length == 0) callback(null);
		else callback(JSON.stringify(data));
	});
}

exports.getCoords = function (ID, callback) {
	var db = openConnection();

	sql = "SELECT * FROM Coordinates WHERE ParcelID = ? ORDER BY Coordinates.`Order` ASC"
	db.all(sql, [ID], function (err, data) {
		destroy(db);
		callback(data);
	});
}

exports.getAllCoords = function (ID, callback) {
	var db = openConnection();

	sql = "SELECT * FROM (SELECT p.ID, Longitude, Latitude, `Order` FROM User u JOIN Parcel p ON u.ID = p.UserID JOIN Coordinates c ON p.ID = c.ParcelID WHERE p.UserID = ? UNION SELECT p2.ID, Longitude, Latitude, `Order` FROM User u JOIN Permissions p ON u.ID = p.UserID JOIN Parcel p2 ON p.ParcelID = p2.ID JOIN Coordinates c ON p.ID = c.ParcelID WHERE u.ID = ? AND View = 1) ORDER BY `Order` ASC";


	db.all(sql, [ID, ID], function (err, data) {
		destroy(db);

		var ret = [];
		data.forEach(row => {
			var temp = ret.find(el => el.ID == row.ID);
			if (temp != null) {
				temp.coords.push({
					lng: row.Longitude,
					lat: row.Latitude,
					order: row.Order
				});
			}
			else {
				ret.push({
					ID: row.ID,
					coords: [{
						lng: row.Longitude,
						lat: row.Latitude,
						order: row.Order
					}]
				});
			}
		})
		callback(ret);
	});
}

exports.saveParcelEdit = function (data, callback) {
	var db = openConnection();

	var west = +data.Coords[0].lng;
	var east = +data.Coords[0].lng;
	var north = +data.Coords[0].lat;
	var south = +data.Coords[0].lat;

	data.Coords.forEach(dev => {
		if (west > +dev.lng) {
			west = +dev.lng;
		}
		if (east < +dev.lng) {
			east = +dev.lng;
		}
		if (north < +dev.lat) {
			north = +dev.lat;
		}
		if (south > +dev.lat) {
			south = +dev.lat;
		}
	});

	var midLat = (north + south) / 2;
	var midLng = (west + east) / 2;

	sql = "UPDATE Parcel SET Title = ?, MiddleLatitude = ?, MiddleLongitude = ? WHERE ID = ?";

	db.run(sql, [data.Title, midLat, midLng, data.ID], function () {
		sql = "DELETE FROM Coordinates WHERE ParcelID =?";
		//
		db.run(sql, [data.ID], function () {
			sql = "INSERT INTO Coordinates(Latitude, Longitude, `Order`, ParcelID) VALUES ";
			var count = 0;
			var arr = [];
			//
			data.Coords.forEach(coord => {
				count++;
				if (count != 1) sql += ",";
				arr.push(coord.lat);
				arr.push(coord.lng);
				arr.push(count);
				arr.push(data.ID);
				sql += "(?,?,?,?)";
			});
			db.run(sql, arr, function () {
				//
				sql = "DELETE FROM SubCropOnParcel WHERE ParcelID =?";

				db.run(sql, [data.ID], function () {
					sql = "INSERT INTO SubCropOnParcel(ManufacturersCropID,CustomCropID,ParcelID) VALUES";
					var arr2 = [];
					count = 0;
					//
					data.Crops.forEach(crop => {
						count++;
						if (count != 1) sql += ",";

						if (crop.ID[0] == "c") {
							sql += "(null,?,?)";
							arr2.push(crop.ID.substring(1));
							arr2.push(data.ID);
						}
						else {
							sql += "(?,null,?)";
							arr2.push(crop.ID.substring(1));
							arr2.push(data.ID);
						}
					});
					if (data.Crops.length == 0) sql = "UPDATE Parcel SET ID = 0 WHERE ID = 0";

					db.run(sql, arr2, function () {
						//
						destroy(db);
						callback();
					});
				})
			});
		});
	});
}


exports.saveNewParcel = function (data, ID, callback) {
	var db = openConnection();
	var arr = [];
	if (data.Owner == -1) {
		sql = "select * from Parcel where UserID=? and Title=?";
		arr.push(ID);
		arr.push(data.Title);
	}
	else {
		sql = "select * from Parcel where UserID=? and Title=?";
		arr.push(data.Owner);
		arr.push(data.Title);
	}
	db.all(sql, arr, function (err, rows) {
		console.log(err);
		if (rows.length != 0) {
			destroy(db)
			callback(false);

		}
		else {

			var west = +data.Coords[0].lng;
			var east = +data.Coords[0].lng;
			var north = +data.Coords[0].lat;
			var south = +data.Coords[0].lat;

			data.Coords.forEach(dev => {
				if (west > +dev.lng) {
					west = +dev.lng;
				}
				if (east < +dev.lng) {
					east = +dev.lng;
				}
				if (north < +dev.lat) {
					north = +dev.lat;
				}
				if (south > +dev.lat) {
					south = +dev.lat;
				}
			});

			var midLat = (north + south) / 2;
			var midLng = (west + east) / 2;
			var arr2 = [];

			if (data.Owner == -1) {
				sql = "INSERT INTO Parcel VALUES(null,?,?,?,?,?)";
				arr2.push(data.Title);
				arr2.push(midLng);
				arr2.push(midLat);
				arr2.push(ID);
				arr2.push(data.No);
			}
			else {
				sql = "INSERT INTO Parcel VALUES(null,?,?,?,?,?)";
				arr2.push(data.Title);
				arr2.push(midLng);
				arr2.push(midLat);
				arr2.push(data.Owner);
				arr2.push(data.No);
			}

			db.run(sql, arr2, function () {
				var arr3 = [];

				if (data.Owner == -1) {
					sql = "SELECT * FROM Parcel WHERE UserID =? AND Title LIKE ? AND MiddleLatitude = ? AND MiddleLongitude = ?";
					arr3.push(ID);
					arr3.push(data.Title);
					arr3.push(midLat);
					arr3.push(midLng);
				}
				else {
					sql = "SELECT * FROM Parcel WHERE UserID = ? AND Title LIKE ? AND MiddleLatitude = ? AND MiddleLongitude = ?";
					arr3.push(data.Owner);
					arr3.push(data.Title);
					arr3.push(midLat);
					arr3.push(midLng);

				}
				//
				db.all(sql, arr3, function (err, parcels) {
					sql = "INSERT INTO Coordinates(Latitude, Longitude, `Order`, ParcelID) VALUES ";
					var count = 0;
					var arr4 = [];
					//
					data.Coords.forEach(coord => {
						count++;
						if (count != 1) sql += ",";
						sql += "(?,?,?,?)";
						arr4.push(coord.lat);
						arr4.push(coord.lng);
						arr4.push(count);
						arr4.push(parcels[0].ID);

					});
					db.run(sql, arr4, function () {
						//
						sql = "INSERT INTO SubCropOnParcel(ManufacturersCropID,CustomCropID,ParcelID) VALUES";
						count = 0;
						var arr5 = [];
						//
						data.Crops.forEach(crop => {
							count++;
							if (count != 1) sql += ",";

							if (crop.ID[0] == "c") {
								sql += "(null,?,?)";
								arr5.push(crop.ID.substring(1));
								arr5.push(parcels[0].ID);
							}
							else {
								sql += "(?,null,?)";
								arr5.push(crop.ID.substring(1));
								arr5.push(parcels[0].ID);
							}
						});
						if (data.Crops.length == 0) sql = "UPDATE Parcel SET ID = 0 WHERE ID = 0";

						db.run(sql, arr5, function () {
							//
							if (data.Owner == -1) {
								destroy(db);
								callback(parcels[0]);
							}
							else {
								sql = "INSERT INTO Permissions VALUES(null,0,1,0,?,?)";

								db.run(sql, [ID, parcels[0].ID], function () {
									destroy(db);
									callback(parcels[0]);
								});
							}
						});
					});
				});
			});
		}
	});
}


exports.deletePermissions = function (ID, myID) {
	var db = openConnection();
	sql = "DELETE FROM OwnerWithUser WHERE UserID =? AND OwnerID=?";

	db.run(sql, [ID, myID], function (err) {
		sql = "DELETE FROM Permissions WHERE UserID = ? AND ParcelID IN " +
			"( SELECT Parcel.ID FROM Parcel JOIN User ON Parcel.UserID = User.ID WHERE User.ID = ? )";

		db.run(sql, [ID, myID], function (err) {
			exports.getUser(myID, function (user) {
				exports.insertInNotification(ID, null, "Niste vise angazovani od strane " + user.Fname + " " + user.Lname + ".", 3, function (flg) {
					exports.insertInMobileNotification(ID, "Niste vise angazovani od strane " + user.Fname + " " + user.Lname + ".", new Date());

					destroy(db);
				});
			});
		});
	});
}

exports.addWorker = function (perms, ID, parcels, callback) {
	var db = openConnection();

	sql = "SELECT * , `E-mail` as email from User WHERE (username=? OR `E-mail`=?) AND AccountTypeID != 1 AND AccountTypeID != 2 ";


	db.all(sql, [perms.workerText.toLowerCase(), perms.workerText], function (err, rows) {
		if (rows.length == 0)
			callback(false, false, null, null);
		else {
			rows.forEach(function (row) {
				sql2 = "SELECT * from OwnerWithUser WHERE OwnerID=? AND UserID=?";
				db.all(sql2, [ID, row.ID], function (err1, rows1) {
					if (rows1.length != 0)
						callback(false, true, null, null);
					else {
						//
						exports.getUser(ID, function (user) {


							par = "";
							parcels.forEach(x => { if (x.View || x.Rules || x.Edit) par += x.Title + ", " });

							//
							sql1 = "INSERT INTO OwnerWithUser VALUES (?,?);"
							db.run(sql1, [ID, row.ID], function (err2, rows2) {
								if (parcels.length == 0) {
									text = "Angazovani ste od strane " + user.Fname + " " + user.Lname + ".";
									exports.insertInNotification(row.ID, null, text, 3, function (flg) {
										exports.insertInMobileNotification(row.ID, text, new Date());
										destroy(db);
										callback(true, true, row.email, text);
									});
								}
								else {
									text = "Angazovani ste na plantazama: " + par + " od strane " + user.Fname + " " + user.Lname + ".";
									exports.insertInNotification(row.ID, null, text, 3, function (flg) {
										exports.insertInMobileNotification(row.ID, text, new Date());

										sql = "INSERT INTO Permissions VALUES ";
										var c = 0;
										var arr = [];
										parcels.forEach(parcel => {
											if (c++ > 0) sql += ", ";

											parcel.View = parcel.View ? 1 : 0;
											parcel.Rules = parcel.Rules ? 1 : 0;
											parcel.Edit = parcel.Edit ? 1 : 0;

											sql += "(null,?,?,?,?,?)";
											arr.push(parcel.Rules);
											arr.push(parcel.View);
											arr.push(parcel.Edit);
											arr.push(row.ID);
											arr.push(parcel.ID);

										});
										db.run(sql, arr, function () {
											destroy(db);

											callback(true, true, row.email, text);
										});

									});
								}
							});
						});
					}
				})


			})
		}
	});

}

destroy = function (db) {
	db.close();
}

getSHA1 = function (input) {
	try {
		return crypto.createHash('sha1').update(input).digest('hex');
	}
	catch (err) { return "" };
}

exports.addUrl = function (username, URL) {

	var db = openConnection();
	sql = "select * from PendingOwner where Username=?";
	db.all(sql, [username.toLowerCase()], function (err, rows) {
		if (rows.length > 0) {
			sql = "Update PendingOwner set URL=? where Username=?";
			db.run(sql, [URL, username.toLowerCase()], function () {
				destroy(db);
			});
		}
		else {
			sql = "select *,`E-mail`as email  from User where Username=?";
			db.all(sql, [username.toLowerCase()], function (err1, rows1) {
				sql = "INSERT INTO PendingOwner(Fname,Lname,Username,Password,`E-mail` ,Phone, PaymentType,URL) VALUES (?,?,?,?,?,?,?,?)";
				db.run(sql, [rows1[0].Fname, rows1[0].Lname, rows1[0].Username.toLowerCase(), rows1[0].Password, rows1[0].email, rows1[0].Phone, rows1[0].PaymentType, URL], function () {
					destroy(db);
				});
			});
		}
	});

}

exports.allParcels = function (callback) {

	var db = openConnection();
	sql = "SELECT ID,Title FROM Parcel";

	db.all(sql, function (err, data) {
		destroy(db);

		callback(data);
	})
}
exports.getAllParcels = function (ID, callback) {

	var db = openConnection();
	sql = "SELECT Parcel.ID, Parcel.Title FROM Parcel WHERE UserID =?";

	db.all(sql, [ID], function (err, data) {
		destroy(db);

		callback(data);
	})
}

exports.getAllCrops = function (ID, parcelID, callback) {

	var db = openConnection();

	sql = "SELECT ID,UserID FROM Parcel WHERE ID = ?";
	db.all(sql, [parcelID], function (err, parcel) {
		sql = "SELECT c.ID,c.Title, 'm'||scm.ID as scmID, sc.Title || ' - ' || m.Title as scmTitle FROM Crops c JOIN SubCrop sc ON c.ID = sc.CropsID JOIN SubCropOfManufacturer scm ON sc.ID = scm.SubCropID JOIN Manufacturer m ON scm.ManufacturerID = m.ID" +
			" UNION " +
			"SELECT c.ID, c.Title, 'c'||cc.ID as scmID, cc.Title as scmTitle FROM Crops c JOIN CustomSubCrop cc ON c.ID == cc.CropID WHERE cc.OwnerID = ?";

		db.all(sql, [ID], function (err, mainCrops) {
			var arr = [];
			if (parcel[0].UserID == ID) {
				sql = "SELECT c.ID, c.Title, 'c'||cc.ID as scmID, cc.Title as scmTitle FROM Crops c JOIN CustomSubCrop cc ON c.ID == cc.CropID WHERE cc.OwnerID IN (SELECT UserID FROM OwnerWithUser WHERE OwnerID = ?)";
				arr.push(ID);
			}
			else {
				sql = "SELECT c.ID, c.Title, 'c'||cc.ID as scmID, cc.Title as scmTitle FROM Crops c JOIN CustomSubCrop cc ON c.ID == cc.CropID WHERE cc.OwnerID = ?";
				arr.push(parcel[0].UserID);
			}

			db.all(sql, arr, function (err, otherCrops) {

				var ret = [];

				mainCrops.forEach(crop => {
					var tmp = ret.find(el => el.ID == crop.ID);

					if (tmp) {
						tmp.subcrops.push({
							ID: crop.scmID,
							title: crop.scmTitle
						})
					}
					else {
						ret.push({
							ID: crop.ID,
							title: crop.Title,
							subcrops: [{
								ID: crop.scmID,
								title: crop.scmTitle
							}]
						})
					}
				});

				otherCrops.forEach(crop => {
					var tmp = ret.find(el => el.ID == crop.ID);

					if (tmp) {
						tmp.subcrops.push({
							ID: crop.scmID,
							title: crop.scmTitle
						})
					}
					else {
						ret.push({
							ID: crop.ID,
							title: crop.Title,
							subcrops: [{
								ID: crop.scmID,
								title: crop.scmTitle
							}]
						})
					}
				});

				destroy(db);

				callback(ret);
			});
		});
	});

}


exports.getAllCropsForNew = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT c.ID,c.Title, 'm'||scm.ID as scmID, sc.Title || ' - ' || m.Title as scmTitle FROM Crops c JOIN SubCrop sc ON c.ID = sc.CropsID JOIN SubCropOfManufacturer scm ON sc.ID = scm.SubCropID JOIN Manufacturer m ON scm.ManufacturerID = m.ID" +
		" UNION " +
		"SELECT c.ID, c.Title, 'c'||cc.ID as scmID, cc.Title as scmTitle FROM Crops c JOIN CustomSubCrop cc ON c.ID == cc.CropID WHERE cc.OwnerID = ?";

	db.all(sql, [ID], function (err, mainCrops) {
		sql = "SELECT c.ID, c.Title, 'c'||cc.ID as scmID, cc.Title as scmTitle FROM Crops c JOIN CustomSubCrop cc ON c.ID == cc.CropID WHERE cc.OwnerID IN (SELECT UserID FROM OwnerWithUser WHERE OwnerID = ?)";

		db.all(sql, [ID], function (err, otherCrops) {

			var ret = [];

			mainCrops.forEach(crop => {
				var tmp = ret.find(el => el.ID == crop.ID);

				if (tmp) {
					tmp.subcrops.push({
						ID: crop.scmID,
						title: crop.scmTitle
					})
				}
				else {
					ret.push({
						ID: crop.ID,
						title: crop.Title,
						subcrops: [{
							ID: crop.scmID,
							title: crop.scmTitle
						}]
					})
				}
			});

			otherCrops.forEach(crop => {
				var tmp = ret.find(el => el.ID == crop.ID);

				if (tmp) {
					tmp.subcrops.push({
						ID: crop.scmID,
						title: crop.scmTitle
					})
				}
				else {
					ret.push({
						ID: crop.ID,
						title: crop.Title,
						subcrops: [{
							ID: crop.scmID,
							title: crop.scmTitle
						}]
					})
				}
			});

			destroy(db);

			callback(ret);
		});
	});
}

exports.getPossibleOwners = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT ID, Fname || ' ' || Lname as Name FROM User u JOIN OwnerWithUser o ON u.ID = o.OwnerID WHERE (u.PaymentType = 3 OR (SELECT COUNT(*) FROM Parcel p2 WHERE p2.UserID = o.OwnerID)<u.PaymentType) AND o.UserID =?";

	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows);
	});
}

exports.addNew = function (subcrop, manuf, crop, callback) {

	var db = openConnection();

	sql = "SELECT scom.ID FROM Manufacturer mf JOIN SubCropOfManufacturer scom ON mf.ID = scom.ManufacturerID JOIN SubCrop sc ON scom.SubCropID = sc.ID WHERE mf.Title = ? AND sc.Title = ? AND sc.CropsID = ?";

	db.all(sql, [manuf, subcrop, crop], function (err, data) {
		if (data.length == 0) {
			sql = "SELECT ID FROM SubCrop WHERE Title = ? AND CropsID = ?";
			db.all(sql, [subcrop, crop], function (err, crops) {
				if (crops.length == 0) {
					sql = "INSERT INTO SubCrop VALUES(null,?,?)";

					db.run(sql, [subcrop, crop], function () {
						sql = "SELECT ID FROM SubCrop WHERE Title = ? AND CropsID = ?";
						db.all(sql, [subcrop, crop], function (err, crops) {
							sql = "SELECT ID FROM Manufacturer WHERE Title = ?";

							db.all(sql, [manuf], function (err, manufs) {
								if (manufs.length == 0) {
									sql = "INSERT INTO Manufacturer VALUES(null,?)";
									console.log(err);
									db.run(sql, [manuf], function (err) {
										sql = "SELECT ID FROM Manufacturer WHERE Title = ?";
										console.log(err);

										db.all(sql, [manuf], function (err, manufs) {
											sql = "INSERT INTO SubCropOfManufacturer VALUES(null,?,?)";
											console.log(err);
											db.run(sql, [manufs[0].ID, crops[0].ID], function (err) {
												console.log(err);
												callback(true);
											});
										});
									});
								}
								else {
									sql = "INSERT INTO SubCropOfManufacturer VALUES(null,?,?)";

									db.run(sql, [manufs[0].ID, crops[0].ID], function () {
										callback(true);
									});
								}
							});
						});
					});
				}
				else {
					sql = "SELECT ID FROM Manufacturer WHERE Title = ?";

					db.all(sql, [manuf], function (err, manufs) {
						if (manufs.length == 0) {
							sql = "INSERT INTO Manufacturer VALUES(null,?)";

							db.run(sql, [manuf], function () {
								sql = "SELECT ID FROM Manufacturer WHERE Title = ?";

								db.all(sql, [manuf], function (err, manufs) {
									sql = "INSERT INTO SubCropOfManufacturer VALUES(null,?,?)";

									db.run(sql, [manufs[0].ID, crops[0].ID], function () {
										callback(true);
									});
								});
							});
						}
						else {
							sql = "INSERT INTO SubCropOfManufacturer VALUES(null,?,?)";

							db.run(sql, [manufs[0].ID, crops[0].ID], function () {
								callback(true);
							});
						}
					});
				}
			});
		}
		else {
			callback(false);
		}
	});
}

exports.getPossibleOwnersForSensors = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT DISTINCT u.ID, Fname || ' ' || Lname as Name FROM User u JOIN Parcel p ON u.ID = p.UserID JOIN Permissions per ON p.ID = per.ParcelID WHERE per.Edit = 1 AND per.UserID =?";

	db.all(sql, [ID], function (err, rows) {

		destroy(db);
		callback(rows);
	});
}

exports.getParcelsForSensors = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT ID, Title FROM Parcel WHERE UserID = ?";

	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows);
	});
}

exports.getOwnersParcels = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT Parcel.Title,Parcel.ID FROM User JOIN Parcel ON User.ID = Parcel.UserID WHERE User.ID = ?" +
		" UNION " +
		"SELECT p.title,p.ID FROM Parcel p JOIN OwnerWithUser o ON p.UserID = o.OwnerID JOIN Permissions pm ON o.UserID = pm.UserID AND p.ID = pm.ParcelID WHERE pm.Rules = 1 AND o.UserID = ?";
	db.all(sql, [ID, ID], function (err, rows) {

		destroy(db);
		callback(rows);
	});
}

exports.getToDos = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT td.*, u.Fname || ' ' || u.Lname as Name FROM ToDo td JOIN Parcel p ON td.ParcelID = p.ID JOIN User u ON td.UserID = u.ID WHERE p.UserID = ?";
	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows);
	});
}

exports.getAllParcelsForExpert = function (callback) {

	var db = openConnection();

	sql = "SELECT Parcel.ID FROM Parcel";
	db.all(sql, function (err, rows) {

		destroy(db);
		callback(rows);
	});
}

exports.checkExistance = function (username, callback) {

	var db = openConnection();

	sql = "SELECT ID FROM User WHERE Username = ? " +
		"UNION " +
		"SELECT ID FROM PendingOwner WHERE Username = ?";
	db.all(sql, [username.toLowerCase(), username.toLowerCase()], function (err, rows) {

		destroy(db);
		callback(rows.length == 0);
	});
}

exports.getWorkers = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT Count(*) as num FROM OwnerWithUser WHERE OwnerID =?";
	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows[0].num);
	});
}
exports.getNotifNum = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT Count(*) as num FROM Notification WHERE UserID =? and Seen=0";
	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		var br = rows[0].num;
		callback(br);
	});
}

exports.getShowCorny = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT ShowCorny FROM User WHERE ID =?";
	db.all(sql, [ID], function (err, rows) {

		destroy(db);
		callback(rows[0].ShowCorny);
	});
}

exports.setShowCorny = function (ID, flag, callback) {

	var db = openConnection();


	if (flag) sql = "UPDATE User SET ShowCorny = 1 WHERE ID =?";
	else sql = "UPDATE User SET ShowCorny = 0 WHERE ID =?";
	db.run(sql, [ID], function (err) {
		destroy(db);
		callback();
	});
}

exports.getParcelsCount = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT Count(*) as num FROM Parcel WHERE UserID =?";
	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows[0].num);
	});
}
exports.getCalendar = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT * FROM Calendar WHERE UserID =?";
	db.all(sql, [ID], function (err, rows) {
		destroy(db);
		callback(rows);
	});
}

exports.checkCalendar = function (ID, niz, callback) {
	var now = new Date();

	var db = openConnection();
	sql = "SELECT * FROM Calendar WHERE UserID =?";
	db.all(sql, [ID], function (err, rows) {
		if (rows.length > 0) {
			var nizID = "(";
			var br = 0;
			rows.forEach(function (element) {
				var datum = new Date(element.Date);
				if (((new DateDiff(now, datum)).days()) < 1 && ((new DateDiff(now, datum)).days()) >= 0 && element.Seen == 0) {
					niz.push("Danas je: " + datum.getDate() + "/" + datum.getMonth() + "/" + datum.getFullYear() + ", obavestenje: " + element.Title);
					if (br == 0) {
						br++;
						nizID += "" + element.ID;
					}
					else {
						nizID += "," + element.ID;
					}
				}
			}, this);
			nizID += ")";
			sql = "update Calendar set Seen=1 where ID in " + nizID;
			db.run(sql, function () {
				destroy(db);
				callback();
			});
		}
		else {
			destroy(db);
			callback();
		}

	});

}

exports.checkNotif = function (ID, niz, callback) {

	var db = openConnection();
	sql = "SELECT * FROM Notification WHERE UserID =?";
	db.all(sql, [ID], function (err, rows) {
		if (rows.length > 0) {
			var nizID = "(";
			var br = 0;
			rows.forEach(function (element) {


				if (element.Seen == 0) {
					niz.push(element.Title);
					if (br == 0) {
						br++;
						nizID += "" + element.ID;
					}
					else {
						nizID += "," + element.ID;
					}
				}
			}, this);
			nizID += ")";

			destroy(db);
			callback();

		}
		else {
			destroy(db);
			callback();
		}

	});

}
exports.getNotification = function (ID, callback) {

	var db = openConnection();
	sql = "Update Notification set Seen=1 where UserID=?";
	db.run(sql, [ID], function () {
		sql = "SELECT * FROM Notification WHERE UserID =?";
		db.all(sql, [ID], function (err, rows) {
			destroy(db);
			callback(rows);
		});
	});
}

exports.insertInMobileNotification = function (userID, message, date) {
	var db = openConnection();

	sql = "INSERT INTO MobileNotifications(Message, UserID, Date, Type) VALUES (?,?,?,2)";

	db.run(sql, [message, userID, date], function () {
		destroy(db);
	});
}

exports.insertInNotification = function (ID, parcelID, title, priority, callback) {

	if (priority == null) priority = 3;

	var db = openConnection();
	sql = "select * from Notification where Title=? and UserID=?";
	db.all(sql, [title, ID], function (err, rows) {
		if (rows.length == 0) {
			sql = "Insert into Notification(Title,UserID,Priority,Date,ParcelID) VALUES(?,?,?,'" + new Date() + "',?)";
			db.run(sql, [title, ID, priority, parcelID], function (err) {
				destroy(db);
				callback(true);
			});
		}
		else {
			sql = "Update Notification set Priority=?, Seen=0 where ID=?";
			db.run(sql, [priority, rows[0].ID], function () {
				destroy(db);
				callback(false);
			});
		}
	});
}

exports.insertInNotificationForAll = function (ID, parcelID, title, priority, callback) {

	if (priority == null) priority = 3;

	var db = openConnection();

	sql = "SELECT UserID FROM Permissions WHERE ParcelID = ? UNION SELECT UserID FROM Parcel WHERE ID = ?";

	db.all(sql, [parcelID, parcelID], function (err, data) {
		var all = "(";
		var i = 0;
		data.forEach(el => {
			if (i != 0) all += ",";
			i++;

			all += el.UserID;
		});
		all += ")";

		sql = "select * from Notification where Title=? and UserID IN " + all;
		db.all(sql, [title], function (err, rows) {
			console.log(err);
			recInsertNotif(db, title, ID, priority, parcelID, rows, data, 0, false, callback);
		});
	});
}

function recInsertNotif(db, title, ID, priority, parcelID, rows, data, i, flag, callback) {
	if (i == data.length) {
		destroy(db);
		callback(flag);
	}
	else {
		var tmp = rows.find(e => e.UserID == data[i].UserID);

		if (tmp) {
			sql = "Update Notification set Priority=? where ID=?";
			db.run(sql, [priority, tmp.ID], function () {
				recInsertNotif(db, title, ID, priority, parcelID, rows, data, i + 1, flag, callback);
			});
		}
		else {
			if (data[i].UserID == ID) flag = true;

			sql = "Insert into Notification(Title,UserID,Priority,Date,ParcelID) VALUES(?,?,?,'" + new Date() + "',?)";
			db.run(sql, [title, data[i].UserID, priority, parcelID], function (err) {
				sql = "Insert into MobileNotifications(Message, UserID, Date) VALUES(?,?,'" + new Date() + "')";
				db.run(sql, [title, data[i].UserID], function (err) {
					recInsertNotif(db, title, ID, priority, parcelID, rows, data, i + 1, flag, callback);
				});
			});
		}
	}
}

exports.getNotificationsForMobile = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT ID, Message as Title, Date, Type FROM MobileNotifications WHERE userID = ? AND Seen = 'FALSE'";

	db.all(sql, [ID], function (err, data) {
		var date = new Date(Date.now());

		var filtered = data.filter(el => {
			var tmp = new Date(el.Date);
			return (el.Type == 1 || (tmp.getDate() == date.getDate() && tmp.getMonth() == date.getMonth()));
		});

		callback(filtered);

		sql = "SELECT * FROM MobileNotifications WHERE Seen='TRUE'";
		db.all(sql, function (err, res) {
			if (res.length > 0) {
				var all = "(";
				var i = 0;

				res.forEach(el => {
					var tmp = new Date(el.Date);

					if (new DateDiff(date, tmp).days() > 3) {
						if (i != 0) all += ",";
						i++;

						all += "el.ID";
					}
				});

				all += ")";

				if (i != 0) {
					sql = "DELETE FROM MobileNotifications WHERE ID IN " + all;

					db.run(sql, function () {
						if (filtered.length != 0) {
							all = "(";
							i = 0;
							filtered.forEach(el => {
								if (i != 0) all += ",";
								i++;

								all += el.ID;
							});
							all += ")"

							sql = "UPDATE MobileNotifications SET Seen = 'TRUE' WHERE ID IN " + all;
							db.run(sql, function () {
								destroy(db);
							});
						}
						else destroy(db);
					});
				}
				else {
					if (filtered.length != 0) {
						all = "(";
						i = 0;
						filtered.forEach(el => {
							if (i != 0) all += ",";
							i++;

							all += el.ID;
						});
						all += ")"

						sql = "UPDATE MobileNotifications SET Seen = 'TRUE' WHERE ID IN " + all;
						db.run(sql, function () {
							destroy(db);
						});
					}
					else destroy(db);
				}
			}
			else {
				if (filtered.length != 0) {
					all = "(";
					i = 0;
					filtered.forEach(el => {
						if (i != 0) all += ",";
						i++;

						all += el.ID;
					});
					all += ")"

					sql = "UPDATE MobileNotifications SET Seen = 'TRUE' WHERE ID IN " + all;
					db.run(sql, function () {
						destroy(db);
					});
				}
				else destroy(db);
			}
		});
	});
};

exports.deleteFromNotification = function (ID, title, date) {

	var db = openConnection();

	sql = "Delete from Notification where UserID=? and Title like ?";
	db.run(sql, [ID, title], function () {
		destroy(db);
	});
}

exports.deleteNotification = function (ID) {

	var db = openConnection();

	sql = "Delete from Notification where ID=?";

	db.run(sql, [ID], function (err) {
		destroy(db);
	});
}
exports.insertInCalendar = function (ID, title, date, priority) {

	var db = openConnection();

	sql = "Insert into Calendar(Title,UserID,Date,Priority) VALUES(?,?,?,?)";
	db.run(sql, [title, ID, date, priority], function () {
		destroy(db);
	});
}
exports.deleteFromCalendar = function (ID, title, date) {
	var db = openConnection();

	sql = "Delete from Calendar where UserID=? and Title like ? and Date like ?";
	db.run(sql, [ID, title, date], function () {
		sql = "Delete from MobileNotifications where userID=? and Message like ? and Date like ?";
		db.run(sql, [ID, title, date], function (err) {
			console.log(err);
			destroy(db);
		});
	});
}

exports.getAllParcelsForRules = function (ID, callback) {

	var db = openConnection();

	sql = "SELECT DISTINCT p.ID, p.MiddleLatitude as lat, p.MiddleLongitude as lng,CropID " +
		"FROM (SELECT p.ID,p.MiddleLatitude, p.MiddleLongitude FROM Parcel p WHERE p.UserID = ?" + " " +
		"UNION " +
		"SELECT p.ID,p.MiddleLatitude, p.MiddleLongitude FROM Parcel p JOIN Permissions pm ON p.ID = pm.ParcelID WHERE pm.View = 1 AND pm.UserID = ?" + ") p " +
		"JOIN SubCropOnParcel sc ON p.ID = sc.ParcelID " +
		"JOIN CustomSubCrop csp ON sc.CustomCropID = csp.CropID " +
		"UNION " +
		"SELECT DISTINCT p.ID, p.MiddleLatitude as lat, p.MiddleLongitude as lng,CropsID " +
		"FROM (SELECT p.ID,p.MiddleLatitude, p.MiddleLongitude FROM Parcel p WHERE p.UserID = ?" + " " +
		"UNION " +
		"SELECT p.ID,p.MiddleLatitude, p.MiddleLongitude FROM Parcel p JOIN Permissions pm ON p.ID = pm.ParcelID WHERE pm.View = 1 AND pm.UserID = ?" + ") p " +
		"JOIN SubCropOnParcel sc ON p.ID = sc.ParcelID " +
		"JOIN SubCropOfManufacturer scm ON sc.ManufacturersCropID = scm.ID " +
		"JOIN SubCrop sub ON scm.SubCropID = sub.ID";

	db.all(sql, [ID, ID, ID, ID], function (err, rows) {

		if (err) callback([]);
		else callback(rows);
	});
}

exports.getAllParcelsForIntervalRules = function (callback) {

	var db = openConnection();

	sql = "SELECT DISTINCT p.ID, p.MiddleLatitude as lat, p.MiddleLongitude as lng,CropID " +
		"FROM (SELECT p.ID,p.MiddleLatitude, p.MiddleLongitude FROM Parcel p ) p " +
		"JOIN SubCropOnParcel sc ON p.ID = sc.ParcelID " +
		"JOIN CustomSubCrop csp ON sc.CustomCropID = csp.CropID " +
		"UNION " +
		"SELECT DISTINCT p.ID, p.MiddleLatitude as lat, p.MiddleLongitude as lng,CropsID " +
		"FROM (SELECT p.ID,p.MiddleLatitude, p.MiddleLongitude FROM Parcel p ) p " +
		"JOIN SubCropOnParcel sc ON p.ID = sc.ParcelID " +
		"JOIN SubCropOfManufacturer scm ON sc.ManufacturersCropID = scm.ID " +
		"JOIN SubCrop sub ON scm.SubCropID = sub.ID";

	db.all(sql, function (err, rows) {
		console.log(err);

		if (err) callback([]);
		else callback(rows);
	});
}

exports.getParcelIDs = function (ID, callback) {
	sql = "SELECT ID FROM Parcel WHERE UserID = ?";

	var db = openConnection();

	db.all(sql, [ID], function (err, data) {
		destroy(db);

		callback(data);
	});
}

exports.getPaymentType = function (ID, callback) {
	sql = "SELECT PaymentType as type FROM User WHERE ID = ?";

	var db = openConnection();

	db.all(sql, [ID], function (err, data) {
		destroy(db);

		callback(data[0].type);
	});
}

exports.addUrlForChange = function (ID, URL, type) {
	sql = "SELECT *, `E-Mail` as email FROM User WHERE ID = ?";

	var db = openConnection();

	db.all(sql, [ID], function (err, rows) {
		console.log(err);

		sql = "INSERT INTO PendingOwner VALUES(null,?,?,?,?,?,?,?,?)";

		db.run(sql, [rows[0].Username, rows[0].Password, rows[0].Fname, rows[0].Lname, rows[0].Phone, rows[0].email, URL, type], function (err) {
			destroy(db);
		});
	});
}

exports.addUrlForChangeWithUsername = function (username, URL, type) {
	sql = "SELECT *, `E-Mail` as email FROM User WHERE Username = ?";

	var db = openConnection();

	db.all(sql, [username.toLowerCase()], function (err, rows) {
		console.log(err);

		sql = "INSERT INTO PendingOwner VALUES(null,?,?,?,?,?,?,?,?)";

		db.run(sql, [rows[0].Username, rows[0].Password, rows[0].Fname, rows[0].Lname, rows[0].Phone, rows[0].email, URL, type], function (err) {
			console.log(err);
			destroy(db);
		});
	});
}

exports.checkTransaction = function (ID, callback) {
	var db = openConnection();

	sql = "SELECT * FROM PaypalPayments WHERE PaymentID = ?";

	db.all(sql, [ID], function (err, data) {
		console.log(err);
		sql = "INSERT INTO PaypalPayments VALUES(?)";
		db.run(sql, [ID], function () {
			destroy(db);

			if (data.length == 0) callback();
		});
	});
}