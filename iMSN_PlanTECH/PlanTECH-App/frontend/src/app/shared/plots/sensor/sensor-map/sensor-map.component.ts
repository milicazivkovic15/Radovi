import { Component, OnInit, ViewChild } from '@angular/core';
import { Ng2MapComponent } from "ng2-map/dist";
import { AppConfig } from "app/appConfig";

@Component({
  selector: 'sensor-map',
  templateUrl: './sensor-map.component.html',
  styleUrls: ['./sensor-map.component.css']
})
export class SensorMapComponent {

  @ViewChild("map") map: Ng2MapComponent;

  constructor() { }

  setEditable(flag) {
    this.marker.setDraggable(flag);
  }

  private center = "44.7866, 20.4489";
  private size = new google.maps.Size(25, 35);
  private event: any;
  private marker: google.maps.Marker = null;
  private circle: google.maps.Circle;
  private sensor: any;

  mapReady() {
    var tmp = JSON.parse(localStorage.getItem("sensorData"));
    this.sensor = tmp.sensor;

    this.setCenter();
    this.drawMarker(false);
  }

  setSensor(sensor) {
    this.marker.setMap(null);
    this.circle.setMap(null);

    this.sensor = {
      latitude: sensor.lat(),
      longitude: sensor.lng()
    };

    this.drawMarker(false);
    this.setCenter();
  }

  getCoords() {
    return this.marker.getPosition();
  }

  setCenter() {
    setTimeout(() => {
      this.map.map.setCenter({ lat: this.marker.getPosition().lat(), lng: this.marker.getPosition().lng() });
    }, 500);
  }

  drawMarker(flag) {
    this.marker = new google.maps.Marker();
    this.marker.setPosition({
      lat: this.sensor.latitude,
      lng: this.sensor.longitude
    });
    this.marker.setMap(this.map.map);
    this.marker.setIcon({
      url: AppConfig.Path + "/images/default-marker.png",
      scaledSize: this.size
    });

    this.circle = new google.maps.Circle();
    this.circle.setCenter({
      lat: this.sensor.latitude,
      lng: this.sensor.longitude
    });
    this.circle.setRadius(50);
    this.circle.setMap(this.map.map);
    this.circle.set('fillColor', "#FD1C1C");
    this.circle.set('strokeColor', '#FD1C1C');
    this.circle.set('strokeWeight', 2);
    this.circle.set('strokeOpacity', 0.8);
    this.circle.set('fillOpacity', 0.25);

    this.marker.setDraggable(flag);
    this.marker.addListener("drag", (event2) => {
      this.marker.setPosition({
        lat: event2.latLng.lat(),
        lng: event2.latLng.lng()
      });
      this.circle.setCenter({
        lat: event2.latLng.lat(),
        lng: event2.latLng.lng()
      });
    });
  }

  onMapClick(event) {

  }

  resize() {
    google.maps.event.trigger(this.map.map, "resize");
  }

}
