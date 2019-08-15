import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { PlotsService } from '../../plots.service';
import { PlotlyComponent } from "app/shared/plotly/plotly.component";
import { MyDate } from "app/shared/MyDate";
import * as $ from 'jquery';

declare var Skycons;

@Component({
  selector: 'app-todays-weather',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './todays-weather.component.html',
  styleUrls: ['./todays-weather.component.css'],
  providers: [PlotsService]
})
export class TodaysWeatherComponent implements OnInit {

  private parcelData: any;
  private today: any;
  private nextDays: any[] = [];
  private dayName: any[];
  private loaded: boolean = false;
  private activeSummary: string = '';
  private lastActive: number;

  constructor(private service: PlotsService) {
    this.parcelData = JSON.parse(localStorage.getItem("parcelData"));

    if (localStorage.getItem("lang") === "sr") {
      this.dayName = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];
    }
    else {
      this.dayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    }
  }

  ngOnInit() {
    this.service.getTodaysForecast(this.parcelData.MiddleLatitude, this.parcelData.MiddleLongitude).subscribe(data => {
      if (data != false) {
        this.today = data[0].today;
        this.today.currentTemperature = Math.round(this.today.currentTemperature);
        this.today.humidity = Math.round(this.today.humidity * 100);
        this.today.rainProbability = Math.round(this.today.rainProbability * 100);

        var tmp = new Date(Date.now());

        for (var i = 0; i < 5; i++) {
          if (data[0].next[i].icon.indexOf("night") != -1) {
            if (i == 0) {
              data[0].next[i].icon = "partly-cloudy-day";
            }
            else data[0].next[i].icon = data[0].next[i - 1].icon;
          };
          data[0].next[i].dayName = this.dayName[(tmp.getDay() + i) % 7];
          data[0].next[i].temperatureMax = Math.round(data[0].next[i].temperatureMax);
          data[0].next[i].temperatureMin = Math.round(data[0].next[i].temperatureMin);

          this.nextDays.push(data[0].next[i]);
        }

        this.lastActive = 0;
        this.activeSummary = this.nextDays[0].summary;
        this.nextDays[0].className = "activeTab";

        this.loaded = true;
        this.animate();
      }
    });
  }

  changeActive(ind) {
    this.nextDays[this.lastActive].className = '';

    this.lastActive = ind;
    this.activeSummary = this.nextDays[ind].summary;
    this.nextDays[ind].className = "activeTab";
  }

  animate() {
    setTimeout(() => {
      var icons = new Skycons();
      let list: string[] = ["clear-day", "clear-night", "partly-cloudy-day",
        "partly-cloudy-night", "cloudy", "rain", "sleet",
        "snow", "wind", "fog"];

      list.forEach(el => {

        $("." + el).each((ind, node) => {

          icons.add(node, el);
        });
      });
      icons.play();
    }, 100);
  }
}
