import { Component, OnInit, ViewChild, OnDestroy, AfterContentInit } from '@angular/core';
import { SensorMapComponent } from "./sensor-map/sensor-map.component";
import { MyDate } from "app/shared/MyDate";
import { PlotlyComponent } from "../../plotly/plotly.component";
import { PlotsService } from "../../plots/plots.service";
import { Router } from "@angular/router";
import { Validation } from '../../Validation';

declare var swal: any;

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css'],
  providers: [PlotsService]
})
export class SensorComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild("map") map: SensorMapComponent;
  @ViewChild("chart") chart: PlotlyComponent;

  private data: any;
  private editable: boolean;
  private text: string;
  private icon: string;
  private date: string;
  private message: string = '';
  private res: any;

  private dataBackup: any;
  private allParcelsBackup: any;
  private sensorBackup: any;

  revert() {
    this.editable = false;
    if (localStorage.getItem("lang") === "sr") {
      this.text = "Izmena podataka";
    }
    else {
      this.text = "Change data";
    }
    this.icon = "uk-icon-pencil";

    this.data = this.dataBackup;
    this.allParcels = this.allParcelsBackup;
    this.map.setSensor(this.sensorBackup);
  }

  setBackup() {
    this.dataBackup = JSON.parse(JSON.stringify(this.data));
    this.allParcelsBackup = JSON.parse(JSON.stringify(this.allParcels));
    this.sensorBackup = this.map.getCoords();
  }

  constructor(private service: PlotsService, private router: Router) {
    this.data = JSON.parse(localStorage.getItem("sensorData"));
    this.data.sensor.ime = this.data.sensor.ime.toLowerCase();

    if (localStorage.getItem("lang") === "sr") {
      this.text = "Izmena podataka";
      this.date = new MyDate(this.data.sensor.Date).toLocaleDateString();
    }
    else {
      this.text = "Change data";
      this.date = new Date(this.data.sensor.Date).toLocaleDateString();
    }
    this.icon = "uk-icon-pencil";
    this.editable = false;
  }

  refreshParcels() {
    this.parcels = this.allParcels.filter(el => el.used == 1);
  }

  ngOnInit() {
    this.service.getParcelsForSensor(-1).subscribe(data => {
      this.allParcels = data.parcels;

      this.service.getParcelSensor(this.data.sensor.ID).subscribe(res => {
        this.res = res;
        this.parcels = this.allParcels.filter(el => {
          var tmp = this.res.list.find(e => e == el.ID);
          if (tmp != null) el.used = 1;

          return tmp != null;
        });
      });
    });

    this.service.getSensors().subscribe(data => {
      this.types = data.tmp;
    });

    this.setLayout();
    this.setData();
  }

  setData() {
    if (this.chartData == null) {
      this.service.getDataForSensor(this.data.sensor.ID).subscribe(data => {
        var tmp = {
          dataX: [],
          dataY: [],
          text: []
        }

        data.forEach(el => {
          tmp.dataX.push(new Date(el.Date * 1000));
          tmp.dataY.push(el.value);
          tmp.text.push("%");
        });

        var temp = [];

        this.chartData = tmp;

        temp.push({
          type: 'scatter',
          mode: 'lines',
          x: tmp.dataX,
          y: tmp.dataY,
          hoverinfo: 'none',
          text: tmp.text,
          line: {
            shape: "spline",
            color: "red"
          }
        });

        this.chartData = temp;
        if (tmp.dataX.length > 1) {
          this.message = "";
          this.chart.drawChart(this.chartData, this.layout);
        }
        else this.message = "Senzor je nov, trenutno nema podatke!";
      });
    }
    else {
      if (this.chartData[0].x.length > 1) {
        this.message = "";
        this.chart.drawChart(this.chartData, this.layout);
      }

      else this.message = "Senzor je nov, trenutno nema podatke!"

    }
  }

  private allParcels: any[] = [];
  private parcels: any[] = [];
  private height: any;
  private width: any;
  private sizeCheckInterval: any;

  ngAfterContentInit() {
    let element = document.getElementById("content");

    this.height = element.offsetHeight
    this.width = element.offsetWidth;

    this.sizeCheckInterval = setInterval(() => {
      let h = element.offsetHeight;
      let w = element.offsetWidth;
      if ((h !== this.height) || (w !== this.width)) {
        this.height = h;
        this.width = w;

        if (!this.editable) this.setData();
        this.map.resize();
      }
    }, 500);
  }

  private chartData: any;

  ngOnDestroy() {
    if (this.sizeCheckInterval !== null) {
      clearInterval(this.sizeCheckInterval);
    }
  }

  private layout: any;

  setLayout() {
    var sensorType = +this.data.sensor.SensorType;

    if (localStorage.getItem('lang') === 'sr') {
      switch (sensorType) {
        case 1:
          this.layout = {
            title: 'Vlažnost zemljišta',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "Procenat (%)"
            }
          };
          break;
        case 3:
          this.layout = {
            title: 'Sadržaj kalcijuma u zemljištu',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "meq/100g"
            }
          };
          break;
        case 4:
          this.layout = {
            title: 'Sadržaj fosfora u zemljištu',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "mg/kg"
            }
          };
          break;
        case 5:
          this.layout = {
            title: 'Sadržaj azota u zemljištu',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "mg/kg"
            }
          };
          break;
        case 6:
          this.layout = {
            title: 'pH vrednost zemljišta',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "pH"
            }
          };
          break;
        case 7:
          this.layout = {
            title: 'Sadržaj natrijuma u zemljištu',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "meq/100g"
            }
          };
          break;
        case 8:
          this.layout = {
            title: 'Temperatura na plantaži',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "Stepeni (°C)"
            }
          };
          break;
        case 11:
          this.layout = {
            title: 'Padavine',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "Količina padavina (mm/m2)"
            }
          };
          break;
        case 12:
          this.layout = {
            title: 'Brzina vetra',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "Brzina (m/s)"
            }
          };
          break;
      }
    }
    else {
      switch (sensorType) {
        case 1:
          this.layout = {
            title: 'Soil humidity',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "Percentage (%)"
            }
          };
          break;
        case 3:
          this.layout = {
            title: 'Amount of calcium in soil',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "meq/100g"
            }
          };
          break;
        case 4:
          this.layout = {
            title: 'Amount of phosphorus in soil',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "mg/kg"
            }
          };
          break;
        case 5:
          this.layout = {
            title: 'Amount of nitrogen in soil',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "mg/kg"
            }
          };
          break;
        case 6:
          this.layout = {
            title: 'pH value of soil',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "pH"
            }
          };
          break;
        case 7:
          this.layout = {
            title: 'Amount of sodium in soil',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "meq/100g"
            }
          };
          break;
        case 8:
          this.layout = {
            title: 'Temperature on plantation',
            xaxis: {
              fixedrange: true,
              title: "Datum"
            },
            yaxis: {
              fixedrange: true,
              title: "Degree (°C)"
            }
          };
          break;
        case 11:
          this.layout = {
            title: 'Precipitation',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "Amount (mm/m2)"
            }
          };
          break;
        case 12:
          this.layout = {
            title: 'Wind speed',
            xaxis: {
              fixedrange: true,
              title: "Date"
            },
            yaxis: {
              fixedrange: true,
              title: "Speed (m/s)"
            }
          };
          break;
      }
    }
  }

  private types: any[] = [];

  save() {
    var coords = this.map.getCoords();
    var parcTemp = this.allParcels.filter(el => el.used);

    if (Validation.validate(["ip"])) {

      this.editable = false;
      if (localStorage.getItem("lang") === "sr") {
        this.text = "Izmena podataka";
      }
      else {
        this.text = "Change data";
      }
      this.icon = "uk-icon-pencil";

      this.map.setEditable(this.editable);
      this.service.addEditSensor({
        lat: coords.lat(),
        lng: coords.lng(),
        SensorType: this.data.sensor.SensorType,
        IP: this.data.sensor.IP,
        ID: this.data.sensor.ID,
        parcels: JSON.stringify(parcTemp)
      }).subscribe(data => {
        if (localStorage.getItem("lang") === "sr") {
          swal("Izmenjeno!", "Uspešna izmena podataka senzor", "success");
        }
        else {
          swal("Edited!", "Successful data exchange sensor", "success");
        }
        localStorage.setItem("sensorData", JSON.stringify(this.data));

        this.setLayout();
        this.setData();

        this.map.setCenter();
        this.refreshParcels();
      })
    }
  }

  delete() {
    let thisRef: any = this;
    if (localStorage.getItem("lang") === "sr") {
      swal({
        title: "Da li ste sigurni?",
        text: "Nećete biti u mogućnosti da opozovete brisanje!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Da, izbriši!",
        cancelButtonText: "Ne, odustani!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            thisRef.deleteTrue();
          }
          else {
            swal("Otkazano", "Senzor nije izbrisan", "error");
          }
        });
    }
    else {
      swal({
        title: "Are you sure?",
        text: "You will not be able to cancel the deletion!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            thisRef.deleteTrue();
          }
          else {
            swal("Canceled", "The sensor is not deleted", "error");
          }
        });
    }
  }

  deleteTrue() {
    this.service.deleteSensor(this.data.sensor.ID).subscribe(data => {
      if (localStorage.getItem("lang") === "sr") {
        swal("Izbrisan", "Senzor uspešno izbrisan!", "success");
      }
      else {
        swal("Deleted", "Sensor successfully deleted!", "success");
      }
      setTimeout(() => {
        this.router.navigate(["../PlanTECH"]);
      }, 500);
    });
  }

  change(ID) {
    var tmp = this.types.find(el => el.id == ID);

    this.data.sensor.ime = tmp.ime.toLowerCase();
    this.data.sensor.SensorType = ID;
  }

  edit() {
    if (this.editable) {
      //this.editable = false;
      this.save();
      //this.chart.redrawChart();
    }
    else {
      this.setBackup();
      this.editable = true;
      if (localStorage.getItem("lang") === "sr") {
        this.text = "Zapamti izmene";
      }
      else {
        this.text = "Save changes";
      }
      this.icon = "uk-icon-save";
      this.map.setEditable(this.editable);
    }

    this.map.setCenter();
  }
}
