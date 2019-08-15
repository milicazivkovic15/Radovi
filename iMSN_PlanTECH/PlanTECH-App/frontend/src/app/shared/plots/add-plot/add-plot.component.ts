import { Component, OnInit, ViewChild, Inject, forwardRef, AfterContentInit, OnDestroy } from '@angular/core';
import { PlotsService } from "../plots.service";
import { DrawMapComponent } from "./draw-map/draw-map.component";
import { PlotsComponent } from "../plots.component";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfig } from "app/appConfig";
import { Validation } from '../../Validation';
import { CornyService } from "app/shared/corny/corny.service";

declare var swal: any;

@Component({
  selector: 'app-add-plot',
  templateUrl: './add-plot.component.html',
  styleUrls: ['./add-plot.component.css'],
  providers: [PlotsService]
})
export class AddPlotComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild("draw") map: DrawMapComponent;

  private Title: string = "";
  private parcelNumber: string = "";
  private crops: any = [];
  private allCrops: any = [];
  private otherCrops: any = [];
  private message: string = "";
  private users: any[] = [];
  private selected = -1;
  private sensors;

  constructor(private router: Router, private route: ActivatedRoute, private service: PlotsService, @Inject(forwardRef(() => PlotsComponent)) private parent: PlotsComponent) {
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


  private sizeCheckInterval;
  private height: number;
  private width: number;

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

        this.map.resize();
      }
    }, 500);
  }

  ngOnDestroy() {
    if (this.sizeCheckInterval !== null) {
      clearInterval(this.sizeCheckInterval);
    }
  }

  firstCapital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    if (localStorage.getItem("lang") === "sr")
      swal("Dodata!", "Uspešno dodata kultura na plantaži", "success");
    else
      swal("Added!", "Successfully added culture on the plantation", "success");
    this.refreshOtherCrops();
  }

  ngOnInit() {

    this.service.getAllCropsForNew().subscribe(data => {
      this.allCrops = data.crops;


      if (this.allCrops.length == 0 && CornyService.show) {
        this.allCrops = [{
          ID: 1,
          Title: 'Jabuka',
          subcrops: [{
            ID: 2,
            Title: 'Zelena jabuka - NS-Seme'
          }, {
            ID: 3,
            Title: 'Moja jabuka'
          }]
        }];
      }

      this.refreshOtherCrops();
    });


    this.service.getPossibleOwners().subscribe(data => {

      var type = Number.parseInt(localStorage.getItem("paymentType"));
      if (localStorage.getItem("userType") == "Vlasnik" && type == 3) {
        this.users.push({
          ID: -1,
          Name: "JA"
        });

        this.service.getAllSensorsForUser(-1).subscribe(data => {
          this.sensors = [];

          if (data.length != 0) {
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
            });
          }
          else if (CornyService.show) {
            this.sensors = [{
              ime: 'Vlažnost zemiljišta',
              all: [{
                ime: 'Vlažnost zemiljišta'
              }, {
                ime: 'Vlažnost zemiljišta'
              }]
            }]
          }
        });
      }
      else if (localStorage.getItem("userType") == "Vlasnik") {
        this.service.getParcelCount().subscribe(data => {
          if (data.count >= type * 5 && !CornyService.show) {
            this.router.navigate(["../Vlasnik/plantaze"]);
          }
          else if (data.count < type * 5) {
            this.users.push({
              ID: -1,
              Name: "JA"
            });

            if (data.owners) {
              data.owners.sort((a, b) => {
                if (a < b) return -1;
                else if (a > b) return 1;
                else return 0;
              });

              data.owners.forEach(e => {
                this.other = true;
                this.users.push(e);
              });
            }

            if ((localStorage.getItem("userType") != "Vlasnik" || data.count >= type * 2)) this.selected = this.users[0].ID;

            var t = this.users.find(el => el.ID == -1);
            if (t == null) t = this.users[0];

            this.service.getAllSensorsForUser(t.ID).subscribe(data => {
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
              });
            });
          }
        });
      }
      else if (data.owners.length == 0 && !CornyService.show) {
        this.router.navigate(["../Korisnik/plantaze"]);
      }
      else {
        if (data.owners) {
          data.owners.sort((a, b) => {
            if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
          });

          data.owners.forEach(e => {
            this.other = true;
            this.users.push(e);
          });
        }

        if ((localStorage.getItem("userType") != "Vlasnik" || data.count >= type * 2) && this.users != null && this.users.length != 0) this.selected = this.users[0].ID;

        var t = this.users.find(el => el.ID == -1);
        if (t == null) t = this.users[0];

        if (t != undefined) this.service.getAllSensorsForUser(t.ID).subscribe(data => {
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
          });
        });
      }
    });
  }

  private other: boolean = false;

  save() {
    var tmp = this.map.getCoords();
    var sensors = this.map.getSensorCoords();

    if (this.Title === "" || this.Title == undefined) {
      if (localStorage.getItem("lang") === "sr")
        Validation.newMessage("title", "Unesite naziv plantaže!");
      else
        Validation.newMessage("title", "Enter the name of the plantation!");
    }
    else if (tmp.length < 3) {
      if (localStorage.getItem("lang") === "sr")
        swal("Greska!", "Morate obeležiti parcelu na mapi", "error");
      else
        swal("Error!", "You must mark the parcel on the map", "error");
    }
    else {
      this.message = "";

      var temp = {
        Title: this.Title,
        Coords: tmp,
        Owner: this.selected,
        Crops: this.crops,
        No: this.parcelNumber,
        SensorCoords: sensors
      };

      this.service.saveNewParcel(JSON.stringify(temp)).subscribe(data => {
        if (data.parcel != false) {
          localStorage.setItem("parcelData", JSON.stringify(data.parcel));
          if (localStorage.getItem("lang") === "sr")
            swal("Dodata!", "Uspešno dodata plantaža!", "success");
          else
            swal("Added!", "Successfully added plantation!", "success");
          this.parent.refreshMenu(data.parcel.ID);
        }
        else {
          if (localStorage.getItem("lang") === "sr")
            swal("Greška!", "Naziv plantaže već postoji", "error");
          else
            swal("Error!", "Name of plantation already exist", "error");
        }
      });
    }
  }

  deleteCr(ID) {
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
            thisRef.deleteCr(ID);
            swal("Izbrisano!", "Kultura uspešno izbrisana sa plantaže!", "success");
          }
          else {
            swal("Otkazano", "Kultura nije izbrisana", "error");
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
            thisRef.deleteCr(ID);
            swal("Deleted!", "Culture successfully deleted from platation!", "success");
          }
          else {
            swal("Cancelled", "Culture is not deleted", "error");
          }
        });
    }
  }

  private ip: string = "";

  check(sensor) {
    this.map.editSensor(sensor);
  }

  getByIp() {
    this.service.getSensorByIp(this.ip).subscribe(data => {
      if (data.sensor == null) {
        if (localStorage.getItem("lang") === "sr")
          swal("Greska!", "Ne postoji senzor! \n Odgovarajući oblik ip adrese: 0-255.0-255.0-255.0-255", "error");
        else
          swal("Error!", "Sensor does not exist! \n Appropriate form of IP address: 0-255.0-255.0-255.0-255", "error");
      }
      else {
        var t = null;
        this.sensors.forEach(s => {
          if (t == null) t = s.all.find(el => el.ID = data.sensor.ID);
        })

        if (t == null) {
          if (localStorage.getItem("lang") === "sr")
            swal("Dodato!", "Uspešno ste dodali senzor", "success");
          else
            swal("Added!", "Successfully added sensor", "success");
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
          if (localStorage.getItem("lang") === "sr")
            swal("Greška!", "Senzor je vec dodat", "warning");
          else
            swal("Error!", "The sensor has already been added", "warning");
        }
      }
    });
  }

  change(val) {
    this.service.getAllSensorsForUser(val).subscribe(data => {

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
      });
    });
  }
}
