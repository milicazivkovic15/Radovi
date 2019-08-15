import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from '../../shared/MenuItem';
import { Router } from '@angular/router';
import { AppConfig } from "app/appConfig";
import { MenuService } from './menu.service';
import { SupportTicketService } from '../support-ticket/support-ticket.service';
import { AdministratorComponent } from '../administrator-component.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-menu',
  providers: [MenuService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements AfterViewInit {

  private items: MenuItem[] = [];
  private router: Router;
  private newUsers: number;
  private support: number;
  private logoPath: string = AppConfig.Path + "/images/logo.png";

  constructor(router: Router, private service: MenuService) {
    this.router = router;

    this.service.getNumberSupportTicket().subscribe(data => {
      this.support = data.numb;
    });

    this.service.getNumberPendingOwner().subscribe(el => {
      this.newUsers = el.numbe;
    });

    this.items.push(new MenuItem('Novi korisnici', 'novi-korisnici', "fa fa-user-plus"));
    this.items.push(new MenuItem('Dodaj agronoma', 'dodaj-korisnika', "fa fa-plus-square"));
    this.items.push(new MenuItem('Svi korisnici', 'izmena-podataka', "fa fa-pencil"));//ovde je menjano prva da zareza
    this.items.push(new MenuItem('Tehnička podrška', 'tehnicka-podrska', "fa fa-wrench"));
    this.items.push(new MenuItem('Profil', 'profil', "fa fa-user"));
  }

  ngAfterViewInit() {
    this.setHeight();
    $(window).resize(this.setHeight.bind(this));

    var height = $(".navbar").height() + 5;

    if (height < 100) {
      this.flag = false;
      this.min = height;
    }
    else {
      this.flag = true;
      this.max = height;
    }
  }

  private flag: boolean;
  private min: number = -1;
  private max: number = -1;

  setHeightAnimated() {
    var height = this.getOpenNavHeight() + 9;

    $(".menuOffset").animate({ "height": height + "px" }, "0.7s");
  }

  getOpenNavHeight(): number {
    this.flag = !this.flag;

    if (this.min != -1 && this.max != -1) {
      return this.flag ? this.max : this.min;
    }
    else {
      var navbar = $(".navbar");
      var copy = navbar.clone(true, true);
      copy.css("width:", "hidden");
      copy.find(".navbar-collapse").toggleClass("in");
      $("body").append(copy);

      var height = copy.height() + 15;
      copy.remove();

      this.flag ? this.max = height : this.min = height;

      return height;
    }
  }

  collapse() {
    $(".collapse").removeClass("in");
    this.flag = !this.flag;
  }

  setHeight() {
    try {
      var height = Number.parseInt(getComputedStyle($(".navbar")[0]).height) + 20;
      height < 100 ? this.min = height : this.max = height;
      $(".menuOffset").css("height", height + "px");
    }
    catch (err) { }
  }

  logOut() {
    this.service.logout().subscribe(data => {
      var lang = localStorage.getItem("lang");
      localStorage.clear();
      localStorage.setItem("lang", lang);
      localStorage.setItem("scroll", "true");
      this.router.navigate(['../PlanTECH']);
    });
  }

  refresh() {
    this.support--;
  }
  refreshUser() {
    this.newUsers--;
  }


}
