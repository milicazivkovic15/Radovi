import { Component, OnInit, Input, ChangeDetectorRef, forwardRef, Inject, ViewChild, HostListener, AfterContentInit } from '@angular/core';
import { MyDate } from "app/shared/MyDate";
import { PlotComponent } from "../plot.component";
import { PlotsService } from "../../plots.service";
import { PlotlyComponent } from "../../../plotly/plotly.component";

@Component({
  selector: 'app-sensor-data-graphic',
  templateUrl: './sensor-data-graphic.component.html',
  styleUrls: ['./sensor-data-graphic.component.css'],
  providers: [PlotsService]
})

export class SensorDataGraphicComponent implements OnInit, AfterContentInit {

  @ViewChild("chart") chart: PlotlyComponent;
  @Input("fake") flag: boolean;

  private sensors: any[] = [];
  private selected: number = -1;
  private chartData: any[] = [];
  private layout: any;
  private allData: any[] = [];
  private message: any = "";

  constructor(private service: PlotsService, private cdRef: ChangeDetectorRef, @Inject(forwardRef(() => PlotComponent)) private parent: PlotComponent) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.flag) this.redrawChart();
  }

  resize(event) {
    if (this.chart != undefined) this.chart.onResize(event);
  }

  change(val) {
    this.selected = val;
    this.cdRef.detectChanges();

    this.parent.changeMarker(val);
    this.redrawChart();
  }

  redrawChart() {
    this.setLayout();
    this.setData();
  }

  setData() {
    let tmp: any[] = [];

    let data = this.allData.find(el => el.ID == this.selected);

    if (data != null) {
      tmp.push({
        type: 'scatter',
        mode: 'lines',
        x: data.dataX,
        y: data.dataY,
        hoverinfo: 'none',
        text: data.text,
        line: {
          shape: "spline",
          color: "red"
        }
      });

      this.chartData = tmp;

      if (data.dataX.length > 1) {
        this.message = "";
        this.chart.drawChart(this.chartData, this.layout);
      }

      else this.message = "Senzor je nov, trenutno nema podatke!";
    }
    else {
      if (!this.flag) {
        this.service.getDataForSensor(this.selected).subscribe(data => {
          var tmp = {
            ID: this.selected,
            dataX: [],
            dataY: [],
            text: []
          }

          data.forEach(el => {
            tmp.dataX.push(new Date(el.Date * 1000));
            tmp.dataY.push(el.value);
            tmp.text.push("%");
          });

          this.allData.push(tmp);

          var temp = [];

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
        var data2 = [
          {
            Date: 1494796388,
            value: 25,
          }, {
            Date: 1494882788,
            value: 35
          }, {
            Date: 1494969188,
            value: 59,
          }, {
            Date: 1495055588,
            value: 60
          }, {
            Date: 1495141988,
            value: 67
          }, {
            Date: 1495228388,
            value: 78
          }, {
            Date: 1495314788,
            value: 90
          }];

        var tmp2 = {
          ID: -1,
          dataX: [],
          dataY: [],
          text: []
        };

        data2.forEach(el => {
          tmp2.dataX.push(new Date(el.Date * 1000));
          tmp2.dataY.push(el.value);
          tmp2.text.push("%");
        });

        this.allData.push(tmp);

        var temp = [];

        temp.push({
          type: 'scatter',
          mode: 'lines',
          x: tmp2.dataX,
          y: tmp2.dataY,
          hoverinfo: 'none',
          text: tmp2.text,
          line: {
            shape: "spline",
            color: "red"
          }
        });

        this.chartData = temp;

        this.sensors.push({
          ime: 'Fosfor',
          list: [{
            ID: -1,
            ime: 'Fosfor'
          }]
        });

        setTimeout(() => {
          this.chart.drawChart(this.chartData, this.layout);
        }, 1500);
      }
    }
  }

  setLayout() {

    var sensorType;
    this.sensors.forEach(type => {
      type.list.forEach(sensor => {
        if (sensor.ID == this.selected)
          sensorType = sensor.SensorType;
      });
    });

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

  firstCapital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  setSensors(sensors) {
    sensors = sensors.filter(el => el.used == 1);
    sensors.forEach(el => {
      var tmp = this.sensors.find(s => s.SensorType == el.SensorType);

      if (tmp) {
        tmp.list.push(el);
      }
      else {
        this.sensors.push({
          SensorType: el.SensorType,
          ime: el.ime.toLowerCase(),
          list: [el]
        });
      }
    });

    if (this.sensors.length > 0) {
      this.selected = this.sensors[0].list[0].ID;
      this.change(this.selected);
    }
  }
}
