import { Component, OnInit, AfterContentInit } from '@angular/core';
import { TranslateService } from "ng2-translate";
import { AppConfig } from "app/appConfig";
import * as $ from 'jquery';
import { Router } from "@angular/router";

@Component({
  selector: 'page-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterContentInit {

  constructor(){}

  ngAfterContentInit() {
  }

}
