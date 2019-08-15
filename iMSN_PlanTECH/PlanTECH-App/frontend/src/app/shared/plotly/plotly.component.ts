import { Component, EventEmitter, Input, Output, OnInit, ElementRef, OnChanges, ViewChild, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
import { MyDate } from "../MyDate";

declare var Plotly: any;

@Component({
  selector: 'plotly-chart',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.css']
})

export class PlotlyComponent implements OnInit {

  private chartData = undefined;
  private layout;
  private dateRegExp: RegExp = new RegExp(/(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December)/i);
  private yearRegExp: RegExp = new RegExp(/[0-9]{4}/i);

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.chartData != undefined)
      this.drawChart(this.chartData, this.layout);
  }

  drawChart(chartData, layout) {

    this.chartData = chartData;
    this.layout = layout;

    Plotly.newPlot('myPlotlyDiv', chartData, layout);
    $(".main-svg").css("background-color", "rgba(255,255,255,0.1)");

    if (chartData[0].x[0] instanceof Date) this.changeDate();

    return <any>document.getElementById('myPlotlyDiv');
  }


  changeDate() {
    if (localStorage.getItem("lang") === "sr") {
      $(".xtick").each((ind, el) => {
        this.parseDate(el.firstChild.firstChild, el.firstChild.childNodes[1], el);
      });
    }
  }

  parseDate(first: Node, second: Node, el: Element) {
    var part11 = '<tspan class="line" dy="0em" x="0" y="284">';
    var part12 = '<tspan class="line" dy="1.3em" x="0" y="284">';
    var part2 = '</tspan>';

    var nodeString = "";

    var text = first.textContent;

    if (this.dateRegExp.test(text)) {
      var date = new MyDate(text);

      if (this.yearRegExp.test(text)) {
        text = date.getDate() + ". " + date.getMonthName() + " " + date.getFullYear();
      }
      else {
        text = date.getDate() + ". " + date.getMonthName();
      }
    }

    nodeString += part11 + text + part2;

    if (second != undefined) {
      text = second.textContent;

      if (this.dateRegExp.test(text)) {
        var date = new MyDate(text);

        if (this.yearRegExp.test(text)) {
          text = date.getDate() + ". " + date.getMonthName() + " " + date.getFullYear();
        }
        else {
          text = date.getDate() + ". " + date.getMonthName();
        }
      }

      nodeString += part12 + text + part2;
    }

    el.firstElementChild.innerHTML = nodeString;
  }
}