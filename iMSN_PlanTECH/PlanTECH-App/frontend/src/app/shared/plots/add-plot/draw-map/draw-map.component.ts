import { Component, OnInit, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Ng2MapComponent, Polygon, Polyline, Circle } from 'ng2-map';
import { PlotsService } from '../../plots.service';
import { AppConfig } from "app/appConfig";

declare var swal: any;

@Component({
  selector: 'app-draw-map',
  templateUrl: './draw-map.component.html',
  styleUrls: ['./draw-map.component.css'],
  providers: [PlotsService]
})
export class DrawMapComponent implements OnInit {

  @ViewChild("target") map: Ng2MapComponent;
  @ViewChild("search") autocomplete: google.maps.places.Autocomplete;

  private poly: Polygon | Polyline;
  private edit: boolean = true;
  private coords = [];
  private sensorID = -1;
  private surface: string = "0,00 m²";
  private center = "44.7866, 20.4489";
  private event: any;
  private sensors: any[] = [];
  private size = new google.maps.Size(25, 35);

  constructor(private service: PlotsService) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(data => {
      this.center = data.coords.latitude + ", " + data.coords.longitude;
    });

  }

  setSensor(ID) {
    this.sensorID = ID;
  }

  placeChanged(event) {
    this.event = event;
    this.map.map.setCenter({
      lat: event.geometry.location.lat(),
      lng: event.geometry.location.lng()
    });
  }

  delete() {
    this.coords = [];
    this.surface = "0.00 m²";
    this.edit = true;

    this.sensorID = -1;
    if (this.circle != null) this.circle.setMap(null);
    this.markers.forEach((el: google.maps.Marker) => { el.setMap(null) });
    this.circles.forEach((el: google.maps.Circle) => { el.setMap(null) });
    this.markers = [];
    this.circles = [];

    this.redraw(this.coords);
  }

  restart() {
    let thisRef: any = this;
    if (localStorage.getItem("lang") === "sr") {
      swal({
        title: "Da li ste sigurni?",
        text: "Nećete biti u mogućnosti da opozovete brisanje svih koordinata!",
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
            thisRef.delete(true);
            swal("Izbrisano!", "Sve koordinate uspešno izbrisane!!", "success");
          }
          else {
            swal("Otkazano", "Koordinate nisu izbrisane", "error");
          }
        });
    }
    else {
      swal({
        title: "Are you sure?",
        text: "You will not be able to cancel the deletion of all coordinates!",
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
            thisRef.delete(true);
            swal("Deleted!", "All coordinates successfully deleted!", "success");
          }
          else {
            swal("Cancelled", "Coordinates is not deleted", "error");
          }
        });
    }
  }

  drawCircle() {
    var size = 0.0002;

    this.circle = new google.maps.Circle();
    this.circle.setCenter(this.coords[0]);
    var p = Math.pow(2, (21 - this.map.map.getZoom()));
    this.circle.setRadius(p * 1128.497220 * size);
    this.circle.setMap(this.map.map);
    this.circle.set('fillColor', "#ffff00");
    this.circle.set('strokeColor', '#ffff00');
    this.circle.set('strokeWeight', 0);
    this.circle.set('strokeOpacity', 1.0);
    this.circle.set('fillOpacity', 1.0);
    this.circle.set('zIndex', 100000);

    this.circle.addListener("click", () => {
      this.edit = false;
    });

    google.maps.event.addListener(this.map.map, 'zoom_changed', () => {
      var p = Math.pow(2, (21 - this.map.map.getZoom()));
      this.circle.setRadius(p * 1128.497220 * size);
    });
  }

  onMapClick(event) {
    if (this.edit) {
      this.coords.push({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });

      if (this.coords.length == 1) this.drawCircle();

      this.redraw(this.coords);
    }
    else if (this.sensorID != -1) {
      this.sensorsCoords.push({
        sensorType: this.sensorID
      });

      this.circles.push(this.circle);
      this.markers.push(this.marker);

      this.marker = null;
      this.sensorID = -1;
    }
  }

  getSensorCoords() {
    try {
      var tmp = [];
      var i = 0;
      this.markers.forEach(el => {
        tmp.push({
          sensorType: this.sensorsCoords[i++].sensorType,
          lat: el.getPosition().lat(),
          lng: el.getPosition().lng()
        });
      });
      return tmp;
    }
    catch (err) {
      return [];
    }
  }

  editSensor(sensor) {
    var tmp = this.sensors.find(el => el.ID == sensor.ID);

    if (tmp == null) this.sensors.push(sensor);
    else this.sensors = this.sensors.filter(el => el.ID != sensor.ID);
    this.redrawSensors();
  }

  private infoWindow: any;
  redrawSensors() {
    this.circles.forEach(c => { c.setMap(null) });
    this.markers.forEach(m => { m.setMap(null) });
    this.circles = [];
    this.markers = [];

    this.sensors.forEach(s => {
      let circleCoords: google.maps.LatLngLiteral = {
        lat: s.latitude,
        lng: s.longitude
      };

      this.sensorCoords = circleCoords;

      this.marker = new google.maps.Marker();
      this.marker.setPosition(circleCoords);
      this.marker.setMap(this.map.map);
      this.marker.setIcon({
        url: AppConfig.Path + "/images/default-marker.png",
        scaledSize: this.size
      });

      this.circle = new google.maps.Circle();
      this.circle.setCenter(circleCoords);
      this.circle.setRadius(50);
      this.circle.setMap(this.map.map);
      this.circle.set('fillColor', "#FD1C1C");
      this.circle.set('strokeColor', '#FD1C1C');
      this.circle.set('strokeWeight', 2);
      this.circle.set('strokeOpacity', 0.8);
      this.circle.set('fillOpacity', 0.25);

      this.markers.push(this.marker);
      this.circles.push(this.circle);

      // this.marker.addListener('mouseover', function () {
      //   this.infoWindow = new google.maps.InfoWindow();
      //   this.infoWindow.setContent(s.ime);
      //   this.infoWindow.open(this.map.map, this.marker);
      // });

      // assuming you also want to hide the infowindow when user mouses-out
      // this.marker.addListener('mouseout', function () {
      //   this.infoWindow.close();
      // });
    });
  }

  getCoords() {
    try {
      var tmp = [];

      (<any>this.map.map).polygons[0].latLngs.b[0].b.forEach(el => {
        tmp.push({
          lat: el.lat(),
          lng: el.lng()
        });
      });
      if (this.edit) return [];

      return tmp;
    }
    catch (err) {
      return [];
    }
  }

  isClosed(event): boolean {
    if (this.coords.length < 3) return false;

    let offset: number = 0.00005;
    if (this.map.map.getZoom() < 15) {
      offset = 0.0005 * (16 - this.map.map.getZoom());
    }

    let num: number = Math.sqrt(Math.pow((+this.coords[0].lat) - (+event.latLng.lat()), 2) + Math.pow((+this.coords[0].lng) - (+event.latLng.lng()), 2));

    return num < offset;
  }

  removeCoord(event) {
    if (this.edit) {
      let tmp = [];
      this.coords.forEach(el => {
        if (tmp.length < this.coords.length - 1) tmp.push(el);
      })
      this.coords = tmp;
      this.redraw(this.coords);

      if (tmp.length == 0) this.circle.setMap(null);
    }
    else if (this.markers.length > 0) {
      var marker = this.markers.pop();
      var circle = this.circles.pop();
      this.sensorsCoords.pop();

      marker.setMap(null);
      circle.setMap(null);

    }
  }

  redraw(path) {
    if (this.poly != null) this.poly.ngOnDestroy();

    this.poly = new Polygon(this.map);
    this.poly.paths = path;
    this.poly.strokeColor = '#fd1c1c';
    this.poly.strokeOpacity = "0.8";
    this.poly.strokeWeight = "2";
    this.poly.draggable = !this.edit;
    //this.poly.editable=!this.edit;
    this.poly.fillColor = "#fd1c1c";
    this.poly.fillOpacity = "0.35";

    (<EventEmitter<any>>this.poly.click).subscribe(event => {
      this.onMapClick(event);
    });

    (<EventEmitter<any>>this.poly.mousemove).subscribe(event => {
      this.onMouseMove(event);
    });

    (<EventEmitter<any>>this.poly.rightclick).subscribe(event => {
      this.removeCoord(event);
    });

    this.poly.initialize();

    this.calculateSurfaceArea(path);
  }

  calculateSurfaceArea(path) {
    try {
      let tmp: google.maps.LatLng[] = [];
      path.forEach(el => {
        tmp.push(new google.maps.LatLng(el.lat, el.lng));
      });
      let area: number = google.maps.geometry.spherical.computeArea(tmp);
      let surface: number = area;
      if (surface < 100) this.surface = surface.toFixed(2) + " m²";
      else {
        surface /= 100;
        if (surface < 100) this.surface = surface.toFixed(2) + " a";
        else {
          surface /= 100;
          this.surface = surface.toFixed(2) + " ha";
        }
      }
    }
    catch (err) { }
  }

  onMouseMove(event) {
    if (event instanceof MouseEvent) return;

    if (this.edit) {
      let tmp = [];
      this.coords.forEach(el => {
        tmp.push(el);
      });

      tmp.push({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });

      this.redraw(tmp);
    }
    else if (this.sensorID != -1) {
      this.drawMarker({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  }

  private sensorCoords;
  private sensorsCoords = [];
  private marker: google.maps.Marker = null;
  private circle: google.maps.Circle = null;
  private markers = [];
  private circles = [];

  drawMarker(latLng, ime?) {
    let circleCoords: google.maps.LatLngLiteral = {
      lat: latLng.lat,
      lng: latLng.lng
    };


    if (this.marker != null) {
      this.marker.setPosition(circleCoords);
      this.circle.setCenter(circleCoords);
    }
    else {
      this.sensorCoords = latLng;

      this.marker = new google.maps.Marker();
      this.marker.setPosition(circleCoords);
      this.marker.setMap(this.map.map);
      this.marker.setIcon({
        url: AppConfig.Path + "/images/default-marker.png",
        scaledSize: this.size
      });

      this.circle = new google.maps.Circle();
      this.circle.setCenter(circleCoords);
      this.circle.setRadius(50);
      this.circle.setMap(this.map.map);
      this.circle.set('fillColor', "#FD1C1C");
      this.circle.set('strokeColor', '#FD1C1C');
      this.circle.set('strokeWeight', 2);
      this.circle.set('strokeOpacity', 0.8);
      this.circle.set('fillOpacity', 0.25);

      // this.marker.addListener("click",event=>{
      //   this.onMapClick(event);
      // });
      // this.marker.addListener("mousemove",event=>{
      //   this.onMouseMove(event);
      // });
      // this.circle.addListener("click",event=>{
      //   this.onMapClick(event);
      // });
      // this.circle.addListener("mousemove",event=>{
      //   this.onMouseMove(event);
      // });
      // this.marker.addListener("rightclick",event=>{
      //   this.removeCoord(event);
      // });
      // this.circle.addListener("rightclick",event=>{
      //   this.removeCoord(event);
      // });

      // this.marker.addListener('mouseover', function () {
      //   this.infoWindow = new google.maps.InfoWindow();
      //   this.infoWindow.setContent(ime);
      //   this.infoWindow.open(this.map.map, this.marker);
      // });

      // assuming you also want to hide the infowindow when user mouses-out
      // this.marker.addListener('mouseout', function () {
      //   this.infoWindow.close();
      // });
    }
  }

  resize() {
    google.maps.event.trigger(this.map.map, "resize");
  }

}
