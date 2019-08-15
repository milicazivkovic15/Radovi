import { Component, ViewChild, forwardRef, Inject, HostListener } from '@angular/core';
import { PlotsService } from './../../plots.service';
import { Polygon, Ng2MapComponent } from 'ng2-map';
import { LatLngBoundsLiteral } from 'angular2-google-maps/core';
import { PlotsComponent } from "../../plots.component";
import { PlotComponent } from "../plot.component";
import { AppConfig } from "app/appConfig";
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [PlotsService]
})

export class MapComponent {
  @ViewChild("target") map: Ng2MapComponent;

  private center = '';
  private polygon: any;
  private flag: boolean = false;
  private sensors: any[] = [];
  private size = new google.maps.Size(25, 35);

  onMapReady(map) {
    if (this.data.ID != '-1') {
      this.service.getCoords(this.data.ID).subscribe(data => {
        var temp = data;
        var count = 0;

        temp.coords.forEach(el => {
          this.polygonData.push({ lng: el.Longitude, lat: el.Latitude });
        });
        this.createPolygon(this.flag);
      });

      this.getAllSensors();
    }
    else {
      this.sensors.push({
        ID: 77,
        IP: '192.168.1.1',
        SensorType: 4,
        ime: "Fosfor",
        latitude: 44.015822,
        longitude: 20.906209999999987
      });

      this.polygonData = [{
        lat: 44.015822,
        lng: 20.906209999999987
      }, {
        lat: 44.017080082764025,
        lng: 20.90353295767204
      }, {
        lat: 44.01767825262901,
        lng: 20.902151521163887
      }, {
        lat: 44.018369,
        lng: 20.90081299999997
      }, {
        lat: 44.018878,
        lng: 20.90134999999998
      }, {
        lat: 44.017659,
        lng: 20.904289000000063
      }, {
        lat: 44.018417,
        lng: 20.90491700000007
      }, {
        lat: 44.016929,
        lng: 20.90706
      }];

      this.createPolygon(this.flag);
      this.drawMarkers(false);
    }
  }

  getAllSensors() {
    this.service.getAllSensors(this.data.ID).subscribe(data => {
      this.sensors = data.filter(el => el.used == 1);
      this.parent.setSensors(data);
      this.drawMarkers(false);
    });
  }

  setEditable(flag, flag2?) {
    this.flag = flag;

    if (flag2 == undefined) {
      this.polygonData = [];
      (<any>this.map.map).polygons[0].latLngs.b[0].b.forEach(el => {
        this.polygonData.push({
          lat: el.lat(),
          lng: el.lng()
        });
      });
    }

    this.createPolygon(flag);
    this.drawMarkers(false);

    setTimeout(() => {
      this.resize();
      this.setBound();
    }, 50);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resize();
  }

  revertChanges(coords: any, sensors: any) {
    this.polygonData = coords;
    this.sensors = [];
    sensors.forEach(el => {
      this.sensors.push({
        latitude: el.lat,
        longitude: el.lng
      });
    });
    this.setEditable(false, true);
  }

  resize() {
    google.maps.event.trigger(this.map.map, "resize");
  }

  getCoods() {
    return this.polygonData;
  }

  getSensors() {
    var tmp = [];

    this.sensors.forEach(el => {
      tmp.push({
        ID: el.ID,
        sensorType: el.SensorType,
        lat: el.latitude,
        lng: el.longitude
      });
    });

    return tmp;
  }

  createPolygon(flag) {
    /*
      <map-polygon
      [paths]="polygonData"
      [strokeColor]="'#fd1c1c'"
      [strokeOpacity]="0.8"
      [strokeWeight]="2"
      [fillColor]="'#fd1c1c'"
      [fillOpacity]="0.35">
      </map-polygon>
    */
    if (this.polygon != null) this.polygon.ngOnDestroy();

    var tempPoly = new Polygon(this.map);
    tempPoly.paths = this.polygonData;
    tempPoly.strokeColor = '#fd1c1c';
    tempPoly.strokeOpacity = "0.8";
    tempPoly.strokeWeight = "2";
    tempPoly.fillColor = "#fd1c1c";
    tempPoly.fillOpacity = "0.35";
    tempPoly.editable = flag;
    tempPoly.draggable = flag;
    tempPoly.initialize();

    this.setBound();

    this.polygon = tempPoly;

    try {
      let tmp: google.maps.LatLng[] = [];
      this.polygonData.forEach(el => {
        tmp.push(new google.maps.LatLng(el.lat, el.lng));
      });

      let area: number = google.maps.geometry.spherical.computeArea(tmp);
      let surface: number = area;
      if (surface < 100) this.parent.setSurface(surface.toFixed(2) + " m²");
      else {
        surface /= 100;
        if (surface < 100) this.parent.setSurface(surface.toFixed(2) + " a");
        else {
          surface /= 100;
          this.parent.setSurface(surface.toFixed(2) + " ha");
        }
      }
    }
    catch (err) { }
  }

  private ind: number = -1;

  changeMarker(ID) {
    if (this.ind != -1 && this.markers[this.ind] != undefined)
      this.markers[this.ind].setIcon({
        url: AppConfig.Path + "/images/default-marker.png",
        scaledSize: this.size
      });

    this.ind = this.sensors.findIndex(el => el.ID == ID);
    if (this.markers.length > 0 && this.ind != -1) {
      this.setColor(this.ind);
    }
  }

  setColor(ind) {
    if (!this.flag && this.markers[this.ind] != undefined) {
      this.markers[ind].setIcon({
        url: AppConfig.Path + "/images/v2-marker.png",
        scaledSize: this.size
      });
    }
  }

  editSensor(sensor) {
    var tmp = this.sensors.find(el => el.ID == sensor.ID);

    if (tmp == null) this.sensors.push(sensor);
    else this.sensors = this.sensors.filter(el => el.ID != sensor.ID);

    this.drawMarkers(false);
  }

  onMapClick(event) {
    //this.positions.push(event.latLng);
    //event.target.panTo(event.latLng);
  }


  private markers: google.maps.Marker[] = [];
  private circles: google.maps.Circle[] = [];

  removeAll() {
    this.markers.forEach(el => {
      el.setMap(null);
    });
    this.circles.forEach(el => {
      el.setMap(null);
    });

    this.markers = [];
    this.circles = [];
  }

  private infoWindow: any;
  drawMarkers(flag) {
    this.removeAll();

    this.sensors.forEach(sensor => {
      let circleCoords: google.maps.LatLngLiteral = {
        lat: sensor.latitude,
        lng: sensor.longitude
      };

      let marker = new google.maps.Marker();
      marker.setPosition(circleCoords);
      marker.setMap(this.map.map);
      marker.setDraggable(flag);
      marker.setIcon({
        url: AppConfig.Path + "/images/default-marker.png",
        scaledSize: this.size
      });

      marker.addListener('mouseover', function () {
        // this.infoWindow = new google.maps.InfoWindow();
        // if (localStorage.getItem("lang") == "sr")
        //   this.infoWindow.setContent(sensor.ime);
        // else {
        var el;
        if (sensor.ime == "Vlaznost")
          el = "Soil moisture";
        else if (sensor.ime == "Kalcijum")
          el = "Calcium";
        else if (sensor.ime == "Fosfor")
          el = "Phosphorus";
        else if (sensor.ime == "Azot")
          el = "Nitrogen";
        else if (sensor.ime == "Ph vrednost")
          el = "pH value";
        else if (sensor.ime == "Natrijum")
          el = "Natrium";

        else if (sensor.ime == "Temperatura")
          el = "Temperature";
        else if (sensor.ime == "Vlaznost vazduha")
          el = "Air humidity";
        else if (sensor.ime == "Padavine")
          el = "Rainfall";

        else if (sensor.ime == "Brzina vetra")
          el = "Wind speed";
        // this.infoWindow.setContent(el);

        // }
        // this.infoWindow.open(this.map.map, marker);


      });

      // assuming you also want to hide the infowindow when user mouses-out
      marker.addListener('mouseout', function () {
        // this.infoWindow.close();
      });

      let circle = new google.maps.Circle();
      circle.setCenter(circleCoords);
      circle.setRadius(50);
      circle.setMap(this.map.map);
      circle.set('fillColor', "#FD1C1C");
      circle.set('strokeColor', '#FD1C1C');
      circle.set('strokeWeight', 2);
      circle.set('strokeOpacity', 0.8);
      circle.set('fillOpacity', 0.25);

      marker.addListener("drag", event => {
        circle.setCenter(marker.getPosition());

        sensor.latitude = event.latLng.lat();
        sensor.longitude = event.latLng.lng();
      });

      this.markers.push(marker);
      this.circles.push(circle);

    });

    if (this.ind != -1)
      this.setColor(this.ind);
  }


  private data;

  constructor(private translate: TranslateService, private service: PlotsService, @Inject(forwardRef(() => PlotComponent)) private parent: PlotComponent) {

    this.data = JSON.parse(localStorage.getItem("parcelData"));
    this.center = this.data.MiddleLatitude + ", " + this.data.MiddleLongitude;
  }

  private polygonData = [];

  setBound() {
    var west = +this.data.MiddleLongitude;
    var east = +this.data.MiddleLongitude;
    var north = +this.data.MiddleLatitude;
    var south = +this.data.MiddleLatitude;

    var count = 0;
    this.polygonData.forEach(dev => {
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

      count++;
      if (count == this.polygonData.length) {
        var offset = 0;
        this.map.map.fitBounds(<LatLngBoundsLiteral>{ west: west - offset, north: north + offset, south: south - offset, east: east + offset });
      }
    });
  }
}