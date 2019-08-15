import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Inject, forwardRef, ChangeDetectorRef, HostListener, ElementRef, OnDestroy, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlotsService } from '../plots.service';
import { MapComponent } from './map/map.component';
import { PlotsComponent } from "../plots.component";
import { SensorDataGraphicComponent } from "./sensor-data-graphic/sensor-data-graphic.component";
import { Validation } from '../../Validation';
import { MyDate } from "app/shared/MyDate";
import { CornyService } from "app/shared/corny/corny.service";

declare var swal: any;

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css'],
  providers: [PlotsService]
})

export class PlotComponent implements OnInit, OnDestroy, AfterContentInit {

  @ViewChild("map") map: MapComponent;
  @ViewChild("graphic") chart: SensorDataGraphicComponent;

  private data: any;
  private text: string;
  private icon: string;
  private editable: boolean;
  private crops: any = [];
  private allCrops: any = [];
  private otherCrops: any = [];
  private surface: string = "";
  private ip: string = "";
  private toDos: any = [];

  check(sensor) {
    this.map.editSensor(sensor);
  }

  constructor(private router: Router, private service: PlotsService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef, @Inject(forwardRef(() => PlotsComponent)) private parent: PlotsComponent) {
    this.data = JSON.parse(localStorage.getItem("parcelData"));
    this.fakeFlag = this.data.ID == '-1';

    if (localStorage.getItem("lang") === "sr") {
      this.text = "Izmena podataka";
    }
    else {
      this.text = "Change data";
    }
    this.icon = "uk-icon-pencil";
    this.editable = false;
  }

  getByIp() {
    this.service.getSensorByIp(this.ip).subscribe(data => {
      if (data.sensor == null) {
        if (localStorage.getItem("lang") === "sr") {
          swal("Ne postoji!", "Ne postoji senzor! \n Odgovarajući oblik ip adrese: 0-255.0-255.0-255.0-255", "error");
        }
        else {
          swal("Does not exist!", "Sensor does not exist! \n Appropriate form of IP address: 0-255.0-255.0-255.0-255", "error");
        }
      }
      else {
        var t = null;
        this.sensors.forEach(s => {
          if (t == null) t = s.all.find(el => el.ID = data.sensor.ID);
        })

        if (t == null) {
          if (localStorage.getItem("lang") === "sr") {
            swal("Dodat!", "Senzor uspešno dodat", "success");
          }
          else {
            swal("Added!", "The sensor successfully added", "success");
          }
          data.sensor.ime = data.sensor.ime.toLowerCase();
          data.sensor.used = 1;

          this.map.editSensor(data.sensor);

          var tmp = this.sensors.find(el => el.SensorType == data.sensor.SensorType);
          if (tmp != null) tmp.all.push(data.sensor);
          else {
            this.sensors.push({
              SensorType: data.sensor.SensorType,
              ime: this.firstCapital(data.sensor.ime),
              all: [data.sensor]
            });
          }
        }
        else {
          if (localStorage.getItem("lang") === "sr") {
            swal("Postoji!", "Senzor je već dodat", "warning");
          }
          else
            swal("Exists!", "The sensor has already been added", "warning");
        }
      }
    });
  }

  private sizeCheckInterval;
  private height: number;
  private width: number;
  private fakeFlag: boolean = false;

  revert1() {

    if (localStorage.getItem("lang") === "sr") {
      this.text = "Izmena podataka";
    }
    else {
      this.text = "Change data";
    }
    this.icon = "uk-icon-pencil";

    this.editable = false;

    this.data = this.dataBackup;
    this.crops = this.cropsBackup;

    this.map.revertChanges(this.coordsBackup, this.sensorsBackup);
  }

  revert() {
    var t = this;
    if (localStorage.getItem("lang") === "sr") {
      swal({
        title: "Da li ste sigurni?",
        text: "Izmene se neće sačuvati!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Da!",
        cancelButtonText: "Ne!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            t.revert1();
            swal("Uspešno!", "Izašli ste bez sačuvanih izmena.", "success");
          } else {
            swal("Otkazano", "Niste izašli", "error");
          }
        });
    }
    else {
      swal({
        title: "Are you sure?",
        text: "You will not be saved changes!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes!",
        cancelButtonText: "No!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            t.revert1();
            swal("Successfully!", "You exit without changes saved.", "success");
          } else {
            swal("Cancelled", "Not exit", "error");
          }
        });
    }
  }

  private dataBackup: any;
  private cropsBackup: any;
  private sensorsBackup: any;
  private coordsBackup: any;

  setBackup() {
    this.dataBackup = JSON.parse(JSON.stringify(this.data));
    this.cropsBackup = this.crops;
    this.sensorsBackup = this.map.getSensors();
    this.coordsBackup = this.map.getCoods();
  }

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

        if (!this.editable && this.chart) this.chart.resize(null);
        this.map.resize();
      }
    }, 500);
  }

  ngOnDestroy() {
    if (this.sizeCheckInterval !== null) {
      clearInterval(this.sizeCheckInterval);
    }
  }

  changeMarker(ID) {
    this.map.changeMarker(ID);
  }

  setSensors(array) {
    if (this.chart) this.chart.setSensors(array);
  }

  setSurface(area) {
    this.surface = area;
  }

  refreshOtherCrops() {
    this.otherCrops = [];

    this.allCrops.forEach(crop => {
      var c = 0;
      crop.subcrops.forEach(sub => {
        if (this.crops.find(el => el.ID == sub.ID) == null) c++;
      });

      if (c > 0) {
        var tmp = {
          ID: crop.ID,
          Title: crop.title,
          subcrops: []
        };

        crop.subcrops.forEach(sub => {
          if (this.crops.find(el => el.ID == sub.ID) == null) {
            tmp.subcrops.push(sub);
          }
        });

        this.otherCrops.push(tmp);
      }
    });
  }

  add(ID) {
    this.otherCrops.forEach(crop => {
      crop.subcrops.forEach(sub => {
        if (sub.ID == ID) {
          this.crops.push({
            ID: sub.ID,
            Name: sub.title
          });
        }
      });
    });

    if (localStorage.getItem("lang") === "sr") {
      swal("Dodata!", "Kultura dodata", "success");
    }
    else {
      swal("Added!", "Culture successfully added", "success");
    }
    this.refreshOtherCrops();
  }

  ngOnInit() {
    var data = localStorage.getItem("parcelData");
    if (data == null || this.data.View == 0) {
      var user = "/" + localStorage.getItem("userType");
      this.router.navigate(['../' + user + '/plantaze']);
    }
    else {
      this.parent.setActive(this.data);
      if (this.data.ID != '-1') {
        this.service.getToDo(this.data.ID).subscribe(data => {
          if (data.data != null) {
            this.toDos = data.data;
            this.toDos.forEach(element => {
              var datum = new Date(element.Date);
              var str = datum.getDate() + "/" + datum.getMonth() + "/" + datum.getFullYear();
              element.Date = str;
            });
          }
          if (this.toDos.length == 0 && CornyService.show) {
            this.toDos.push({
              toDo: true,
              Title: 'Potrebno je zaliti parcelu!',
              Date: new MyDate(Date.now()).toMyString()
            });
          }
        });

        this.service.getCrops(this.data.ID).subscribe(data => {
          if (data.data != null) {
            this.crops = JSON.parse(data.data);

          }
        });

        this.service.getAllCrops(this.data.ID).subscribe(data => {
          this.allCrops = data.crops;
          this.refreshOtherCrops();
        });
      }
      else {
        this.toDos.push({
          toDo: true,
          Title: 'Potrebno je zaliti parcelu!',
          Date: new MyDate(Date.now()).toMyString()
        });
        this.crops.push({
          ID: 1,
          Name: 'Kukuruz'
        });
        this.crops.push({
          ID: 2,
          Name: 'Pasulj'
        });
      }
    }
  }

  private sensors: any;

  edit() {
    if (this.editable) {
      this.save();
      //this.chart.redrawChart();
    }
    else {
      this.setBackup();

      if (this.sensors == null) {
        this.service.getAllSensors(this.data.ID).subscribe(data => {

          this.sensors = [];

          data.forEach(el => {
            var tmp = this.sensors.find(e => e.SensorType == el.SensorType);

            el.ime = el.ime.toLowerCase();

            if (tmp != null) tmp.all.push(el);
            else {
              this.sensors.push({
                SensorType: el.SensorType,
                ime: this.firstCapital(el.ime),
                all: [el]
              })
            }
          })
        });
      }
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
  }

  firstCapital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  save() {
    if (this.data.Title == "" || this.data.Title == undefined) {
      Validation.newMessage("title", "Unesite naziv plantaže!");

    }
    else {
      var temp = {
        ID: this.data.ID,
        Title: this.data.Title,
        Coords: this.map.getCoods(),
        Crops: this.crops,
        Sensors: this.map.getSensors()
      };

      this.parent.setNewName(this.data.Title, this.data.ID);
      this.editable = false;
      if (localStorage.getItem("lang") === "sr") {
        this.text = "Izmena podataka";
      }
      else {
        this.text = "Change data";
      }
      this.icon = "uk-icon-pencil";

      this.map.setEditable(this.editable);
      this.service.saveParcelEdit(JSON.stringify(temp)).subscribe(ret => {
        localStorage.setItem("parcelData", JSON.stringify(this.data));
        if (localStorage.getItem("lang") === "sr") {
          swal("Sacuvano!", "Izmene sačuvane!", "success");
        }
        else {
          swal("Saved!", "Changes saved!", "success");
        }
        this.map.getAllSensors();
      });
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
            thisRef.onClose(true);
            // swal("Plantaza uspesno izbrisana!", "Kliknite na dugme da zatvorite!", "success");
          }
          else {
            swal("Otkazano", "Plantaža nije izbrisana", "error");
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
            thisRef.onClose(true);
            // swal("Plantaza uspesno izbrisana!", "Kliknite na dugme da zatvorite!", "success");
          }
          else {
            swal("Cancelled", "Plantation could not be deleted", "error");
          }
        });
    }
  }

  onClose(results) {
    if (results) {
      this.service.deleteParcel(this.data.ID).subscribe(x => {
        if (localStorage.getItem("lang") === "sr") {
          swal("Izbrisana!", "Plantaža uspešno izbrisana!", "success");
        }
        else {
          swal("Deleted!", "Plantation successfully deleted!", "success");
        }
        setTimeout(() => {
          this.router.navigate(["../PlanTECH"]);
        }, 500);
      });
    }
  }

  deleteAll() {
    this.crops = [];
    this.refreshOtherCrops();
  }

  deleteAllCrops() {
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
            thisRef.deleteAll();
            swal("Izbrisano!", "Izbrisane sve kulture!", "success");
          }
          else {
            swal("Otkazano", "Kulture nisu izbrisane!", "error");
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
            thisRef.deleteAll();
            swal("Deleted!", "Deleted all cultures!", "success");
          }
          else {
            swal("Cancelled", "Cultures are not deleted!", "error");
          }
        });
    }
  }

  deleteC(ID) {
    this.crops = this.crops.filter(c => c.ID != ID);
    this.refreshOtherCrops();
  }

  deleteCrop(ID) {
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
            thisRef.deleteC(ID);
            swal("Izbrisana!", "Izbrisana kultura!", "success");
          }
          else {
            swal("Otkazano", "Kultura nije izbrisana!", "error");
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
            thisRef.deleteC(ID);
            swal("Deleted!", "Culture is deleted!", "success");
          }
          else {
            swal("Cancelled", "Cultures is not deleted!", "error");
          }
        });
    }
  }
  changeToDo(ID, toDo) {
    this.service.doIt(ID, toDo).subscribe();
  }
}
