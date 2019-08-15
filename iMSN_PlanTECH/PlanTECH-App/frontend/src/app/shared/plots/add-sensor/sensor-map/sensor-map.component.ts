import { Component, OnInit, ViewChild } from '@angular/core';
import { PlotsService } from "../../plots.service";
import { Ng2MapComponent } from "ng2-map/dist";
import { AppConfig } from "app/appConfig";

@Component({
  selector: 'app-sensor-map',
  templateUrl: './sensor-map.component.html',
  styleUrls: ['./sensor-map.component.css'],
  providers: [PlotsService]
})
export class SensorMapComponent implements OnInit {

  @ViewChild("target") map: Ng2MapComponent;
  @ViewChild("search") autocomplete: google.maps.places.Autocomplete;

  private center = "44.7866, 20.4489";
  private size = new google.maps.Size(25, 35);
  private event: any;
  private marker: google.maps.Marker;

  constructor(private service: PlotsService) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(data => {
      this.center = data.coords.latitude + ", " + data.coords.longitude;
    });

  }

  placeChanged(event) {
    this.event = event;
    this.map.map.setCenter({
      lat: event.geometry.location.lat(),
      lng: event.geometry.location.lng()
    });
  }

  private circle: google.maps.Circle;

  onMapClick(event) {
    if (this.marker == null) {
      this.marker = new google.maps.Marker();
      this.marker.setPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
      this.marker.setMap(this.map.map);
      this.marker.setIcon({
        url: AppConfig.WEB_API + "/images/default-marker.png",
        scaledSize: this.size
      });

      this.circle = new google.maps.Circle();
      this.circle.setCenter({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
      this.circle.setRadius(50);
      this.circle.setMap(this.map.map);
      this.circle.set('fillColor', "#FD1C1C");
      this.circle.set('strokeColor', '#FD1C1C');
      this.circle.set('strokeWeight', 2);
      this.circle.set('strokeOpacity', 0.8);
      this.circle.set('fillOpacity', 0.25);

      this.marker.setDraggable(true);
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
  }

  getCoords() {
    if (this.marker == null) return null;

    var pos = this.marker.getPosition();

    return pos;
  }

  resize() {
    google.maps.event.trigger(this.map.map, "resize");
  }

}
