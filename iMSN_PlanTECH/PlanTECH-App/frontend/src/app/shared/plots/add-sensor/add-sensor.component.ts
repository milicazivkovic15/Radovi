import { Component, OnInit, ViewChild } from '@angular/core';
import { SensorMapComponent } from "app/shared/plots/add-sensor/sensor-map/sensor-map.component";
import { PlotsService } from "app/shared/plots/plots.service";
import { Router } from "@angular/router";
import { Validation } from '../../Validation';
import { CornyService } from "app/shared/corny/corny.service";

declare var swal: any;

@Component({
  selector: 'app-add-sensor',
  templateUrl: './add-sensor.component.html',
  styleUrls: ['./add-sensor.component.css'],
  providers: [PlotsService]
})
export class AddSensorComponent implements OnInit {

  @ViewChild("map") map: SensorMapComponent;

  constructor(private service: PlotsService, private router: Router) { }

  private height;
  private type;
  private sensorTypes = [];
  private width;
  private sizeCheckInterval;
  private ip: string;
  private showAll: boolean = false;
  private users: any[] = [];
  private selected;

  ngOnInit() {

    this.service.getSensors().subscribe(data => {
      this.sensorTypes = data.tmp;
      this.type = data.tmp[0].id;
    });

    this.service.getPossibleOwnersForSensors().subscribe(data => {
      try {
        if (localStorage.getItem("userType") == "Vlasnik")
          this.users.push({
            ID: -1,
            Name: "JA"
          });

        if (data.owners != undefined)
          data.owners.forEach(o => {
            this.users.push(o);
          });

        if (localStorage.getItem("userType") == "Vlasnik" && this.users.length > 1) this.showAll = true;
        else if (localStorage.getItem("userType") != "Vlasnik" && this.users.length > 0) this.showAll = true;

        if (data.owners.length == 0 && localStorage.getItem("userType") != "Vlasnik" && !CornyService.show) this.router.navigate(['/' + localStorage.getItem("userType") + '/plantaze']);

        this.selected = this.users[0].ID;
        this.loadParcels(this.selected);
      } catch (err) { }
    });

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

  save() {
    var coords = this.map.getCoords();
    var parcTemp = this.parcels.filter(el => el.selected);

    if (coords == null) {
      if (localStorage.getItem("lang") === "sr") {
        swal("Greska!", "Niste postavili senzor na mapi", "error");
      }
      else
        swal("Error!", "You did not put the sensor on the map", "error");
    }
    else if (this.ip == "") {
      if (localStorage.getItem("lang") === "sr") {
        swal("Greska!", "Niste uneli IP adresu senzora", "error");
      }
      else
        swal("Error!", "You did not enter the IP address of the sensor", "error");
    }
    else {
      if (Validation.validate(["ip"])) {
        this.service.addNewSensor({
          lat: coords.lat(),
          lng: coords.lng(),
          sensorType: this.type,
          IP: this.ip,
          userID: this.selected,
          parcels: JSON.stringify(parcTemp)
        }).subscribe(data => {
          if (data.status) {
            if (localStorage.getItem("lang") === "sr") {
              swal("Dodat!", "Senzor uspešno dodat", "success");
            }
            else {
              swal("Added!", "Sensor successfully added", "success");
            }
            localStorage.setItem("sensorData", JSON.stringify(data));
            this.router.navigate(['/' + localStorage.getItem("userType") + '/plantaze/senzor']);
          }
          else {
            if (localStorage.getItem("lang") === "sr") {
              swal("Greška!", "Proverite IP adresu, senzor sa istom adresom već postoji", "error");
            }
            else {
              swal("Error!", "Check IP address, sensor with same IP already exists", "error");
            }
          }
        })
      }
    }
  }

  private parcels: any[] = [];
  private allStatus: boolean;
  private message: string;

  all() {
    this.allStatus = !this.allStatus;

    this.parcels.forEach(p => {
      p.selected = this.allStatus;
    });

    if (!this.allStatus) {
      this.message = localStorage.getItem("lang") === "sr" ? "Sve" : "All";
    }
    else {
      this.message = localStorage.getItem("lang") === "sr" ? "Ništa" : "Nothing";
    }
  }

  loadParcels(ID) {
    this.service.getParcelsForSensor(ID).subscribe(data => {
      this.parcels = data.parcels;
      if (this.parcels.length == 0 && CornyService.show) {
        this.parcels = [{
          ID: 1,
          Title: 'Plantaža 1'
        }, {
          ID: 2,
          Title: 'Plantaža 2'
        }];
      }

      this.allStatus = false;
      this.message = localStorage.getItem("lang") === "sr" ? "Sve" : "All";
    });
  }
}
