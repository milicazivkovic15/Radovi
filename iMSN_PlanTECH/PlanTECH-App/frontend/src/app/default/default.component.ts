import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../appConfig';
import { PriceComponent } from './price/price.component'
import * as $ from 'jquery';
import { LoginComponent } from "app/default/login/login.component";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit, AfterViewInit {

  @ViewChild("price") price: PriceComponent;
  @ViewChild("login") login: LoginComponent;

  private logoPath: string = AppConfig.Path + "/images/img4.jpg";
  constructor(private router: Router) { }

  setLanguage(lang) {
    this.price.setLanguage(lang);
    this.login.setLanguage(lang);
  }

  ngOnInit() {

    if (localStorage.getItem("userType")) {
      this.router.navigate(['/' + localStorage.getItem("userType")]);
    }
  }

  ngAfterViewInit() {

    var tmp = localStorage.getItem("scroll");
    if (tmp != undefined) {
      localStorage.removeItem("scroll");
      $('html, body').animate({
        scrollTop: "0"
      }, 0);
    }

    $('body').removeClass();
    $('body').addClass("default");

    $('header').css("height", "66px");
  }
}
