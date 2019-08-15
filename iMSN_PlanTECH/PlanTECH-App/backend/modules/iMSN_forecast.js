var exports = module.exports = {};
var ForecastIo = require('forecast.io');

var date;
var count;

var keys = [
    '9d0ebd44541e5e635e6c1191b3006183',
    'e14543d31db69d7ed7c780a8b837ffb8',
    '7ad79c84b336405d498bedfa5e74055c',
    'ce91654c64b2f1677eb5d9e314455838',
    '3358c07d1f4b7e0dc3250dc2c0418dc2'
]

var yrno = require('yr.no-forecast')({
    version: '1.9',
    request: {
        timeout: 15000
    }
});

exports.getForecastForWidget = function (latitude, longitude, language, callback) {
    var options = {
        lang: language,
        units: 'si',
        exclude: 'minutely,hourly,flags,alerts'
    };

    var ret = [];

    getForDate(ret, [{ lat: latitude, lng: longitude }], 0, options, callback);
}

function getForecastConnection() {
    var d = new Date(Date.now());
    var tmpDate = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear();

    if (date != tmpDate) {
        date = tmpDate;
        count = 0;
    }
    else count++;


    var ind = Math.round(count / 950);

    var apiOptions = {
        APIKey: keys[ind],
        timeout: 10000
    };

    return new ForecastIo(apiOptions);
}

function getForDate(array, coords, ind, options, callback) {
    if (coords.length == ind) callback(array);
    else {
        try {
            var forecast = getForecastConnection();

            forecast.get(coords[ind].lat, coords[ind].lng, options, function (err, res, data) {
                try {
                    array.push({
                        today: {
                            currentTemperature: data.currently.apparentTemperature,
                            icon: data.currently.icon,
                            summary: data.currently.summary,
                            humidity: data.currently.humidity,
                            rainProbability: data.currently.precipProbability,
                            windSpeed: data.currently.windSpeed,
                            precipIntensity: data.currently.precipIntensity
                        },
                        next: []
                    });

                    for (var i = 1; i < 8; i++) {
                        array[ind].next.push({
                            icon: data.daily.data[i].icon,
                            summary: data.daily.data[i].summary,
                            temperatureMax: data.daily.data[i].apparentTemperatureMax,
                            temperatureMin: data.daily.data[i].apparentTemperatureMin,
                            humidity: data.daily.data[i].humidity,
                            rainProbability: data.daily.data[i].precipProbability,
                            windSpeed: data.daily.data[i].windSpeed,
                            precipIntensity: data.daily.data[i].precipIntensity
                        });
                    }
                }
                catch (err) {
                    getForDate(array, coords, ind, options, callback);
                }

                getForDate(array, coords, ind + 1, options, callback);
            });
        }
        catch (err) {
            callback(false);
        }
    }
}

exports.getDataAboutParcels = function (parcels, callback) {
    var arr = [];
    getForParcels(arr, parcels, 0, callback);
}

function getForParcels(array, coords, ind, callback) {
    if (coords.length == ind) callback(array);
    else {
        yrno.getWeather({ lat: coords[ind].lat, lon: coords[ind].lng }).then((weather) => {
            weather.getFiveDaySummary().then((data) => {
                var tmp = {
                    ID: coords[ind].ID,
                    temperature: [],
                    wind: [],
                    rainfall: [],
                    vlaznost: []
                };

                data.forEach(el => {
                    tmp.temperature.push(Number.parseFloat(el.temperature));
                    tmp.vlaznost.push(Number.parseFloat(el.humidity));
                    tmp.wind.push(Number.parseFloat(el.windSpeed.mps));
                    tmp.rainfall.push(Number.parseFloat(el.rain));
                });

                array.push(tmp);
                getForParcels(array, coords, ind + 1, callback);
            });
        }).catch((err) => {
            array.push({
                ID: coords[ind].ID,
                temperature: [undefined, undefined, undefined, undefined, undefined],
                wind: [undefined, undefined, undefined, undefined, undefined],
                rainfall: [undefined, undefined, undefined, undefined, undefined]
            });
            getForParcels(array, coords, ind + 1, callback);
        });
    }
}

