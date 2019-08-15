import { Component, OnInit, ViewChild, Inject, forwardRef, AfterViewInit, EventEmitter, AfterContentInit } from '@angular/core';
import { PlotsService } from '../plots.service';
import { Polygon, Ng2MapComponent } from 'ng2-map';
import { LatLngBoundsLiteral } from 'angular2-google-maps/core';
import { Router } from '@angular/router';
import { PlotsComponent } from "app/shared/plots/plots.component";
import { AppConfig } from "app/appConfig";

@Component({
  selector: 'app-general-map',
  providers: [PlotsService],
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.css']
})
export class GeneralMapComponent implements AfterContentInit {

  @ViewChild("target") map: Ng2MapComponent;

  private infowindow: google.maps.InfoWindow[] = [];

  private infoWindow: any;
  private positions = [];
  private center = "44.7866, 20.4489";
  private parcels;
  private size = new google.maps.Size(25, 35);
  private data = {
    coords: []
  }

  private sensors: any[] = [];

  load() {
    this.service.getAllCoords().subscribe(data => {

      this.data = data;
      this.parcels = JSON.parse(localStorage.getItem("parcels"));
      if (this.parcels != null && this.parcels.length > 0) {
        try {
          this.fitBound();
        }
        catch (err) { };
      }

      this.service.getSensorsForGeneralMap().subscribe(res => {
        res.sensors.forEach(e => {
          var tmp = this.sensors.find(el => el.ID == e.ID);

          if (tmp == null) {
            this.sensors.push({
              sensor: e,
              parcels: [e.ParcelID]
            });
          }
          else {
            tmp.parcels.push(e.ParcelID);
          }
        });


        this.drawMarkers();
      });
    });
  }

  drawMarkers() {
    this.sensors.forEach(s => {

      let marker = new google.maps.Marker();
      marker.setPosition({
        lat: s.sensor.latitude,
        lng: s.sensor.longitude
      });
      marker.setMap(this.map.map);
      marker.setIcon({
        url: AppConfig.Path + "/images/default-marker.png",
        scaledSize: this.size
      });

      marker.addListener('mouseover', () => {
        this.infoWindow = new google.maps.InfoWindow();
        this.infoWindow.setContent(s.sensor.ime);
        this.infoWindow.open(this.map.map, marker);
      });

      // assuming you also want to hide the infowindow when user mouses-out
      marker.addListener('mouseout', () => {
        this.infoWindow.close();
      });

      marker.addListener('click', () => {
        localStorage.setItem("sensorData", JSON.stringify(s));
        this.router.navigate(['/' + localStorage.getItem("userType") + '/plantaze/senzor']);
      });
    })
  }

  private sizeCheckInterval;
  private height: number;
  private width: number;

  ngAfterContentInit() {
    this.load();

    let element = document.getElementById("content");

    this.height = element.offsetHeight
    this.width = element.offsetWidth;

    this.sizeCheckInterval = setInterval(() => {
      let h = element.offsetHeight;
      let w = element.offsetWidth;
      if ((h !== this.height) || (w !== this.width)) {
        this.height = h;
        this.width = w;

        google.maps.event.trigger(this.map.map, "resize");
      }
    }, 500);
  }

  ngOnDestroy() {
    if (this.sizeCheckInterval !== null) {
      clearInterval(this.sizeCheckInterval);
    }
  }


  onMouseOver(event, ID) {
    var poly: Polygon = null;

    var parcel = this.parcels.find(el => el.ID == ID);
    var infowindow = new google.maps.InfoWindow({
      content: parcel.Title
    });

    var parcela = new google.maps.Polygon({});

    infowindow.setPosition({ lat: parcel.MiddleLatitude, lng: parcel.MiddleLongitude });
    infowindow.open(this.map.map, parcela);

    this.infowindow.push(infowindow);
  }

  onMouseOut() {
    setTimeout(() => {
      this.infowindow[0].close();

      var c = 0;
      this.infowindow = this.infowindow.filter(e => {
        c++;
        if (c > 1) return true;
        else return false;
      });
    }, 1000);
  }

  onClick(event, ID) {
    var user = "/" + localStorage.getItem("userType");
    var parcel = this.parcels.find(el => el.ID == ID);
    this.parent.setActive(parcel);
    localStorage.setItem("parcelData", JSON.stringify(parcel));
    this.router.navigate(["../" + user + '/plantaze/plantaza']);
  }

  onMapReady(map) {
  }


  onMapClick(event) {
    this.positions.push(event.latLng);
    event.target.panTo(event.latLng);
  }


  constructor(private service: PlotsService, private router: Router, @Inject(forwardRef(() => PlotsComponent)) private parent: PlotsComponent) {
  }

  private polygonData = [];

  fitBound() {
    if (this.data.coords == null || this.data.coords == undefined || this.data.coords.length == 0) return;
    var west = +this.data.coords[0].coords[0].lng;
    var east = +this.data.coords[0].coords[0].lng;
    var north = +this.data.coords[0].coords[0].lat;
    var south = +this.data.coords[0].coords[0].lat;

    var c1 = 0;

    this.data.coords.forEach(parc => {
      c1++;
      var c2 = 0;

      parc.coords.forEach(dev => {


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

        c2++;

        if (c1 == this.data.coords.length && c2 == parc.coords.length) {
          var offset = 0;
          this.map.map.fitBounds(<LatLngBoundsLiteral>{ west: west - offset, north: north + offset, south: south - offset, east: east + offset });
        }
      })
    });
  }
}
