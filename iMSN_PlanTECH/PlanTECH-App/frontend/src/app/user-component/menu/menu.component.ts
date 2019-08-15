import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from '../../shared/MenuItem';
import { Router } from '@angular/router';
import { LoginService } from '../../default/login/login.service';
import { AppConfig } from "app/appConfig";
import { MenuService } from "app/owner-component/menu/menu.service";

@Component({
  selector: 'app-user-menu',
  providers: [LoginService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements AfterViewInit {

  numNotifi() {
    this.numNotif = 0;
  }

  private items: MenuItem[] = [];
  private router: Router;
  private logoPath: string = AppConfig.Path + "/images/logo.png";
  private service: LoginService;
  private dropdownItems: MenuItem[] = [];
  private numNotif: number = 0;

  constructor(router: Router, service: LoginService, private menuService: MenuService) {
    this.router = router;
    this.service = service;

    this.service.getPermissions().subscribe(json => {
      var perms = json;
      this.items.push(new MenuItem('Plantaže', 'plantaze', "glyphicon glyphicon-tree-deciduous"));

      var flag = true;
      this.items.push(new MenuItem('Obaveštenja', 'obavestenja', "fa fa-bell"));
      if (perms.view) {
        this.items.push(new MenuItem('Upravljanje sistemom', '', "fa fa-cogs"));
        flag = false;
      }
      if (perms.edit) {
        if (flag) this.items.push(new MenuItem('Upravljanje sistemom', '', "fa fa-cogs"));
        this.dropdownItems.push(new MenuItem('Upravljanje kulturama', 'nove-kulture', "fa fa-leaf"));
        flag = false;
        //if(!perms.view) this.items.push(new MenuItem('Parcele','Korisnik/'));       
      }
      if (perms.rules) {
        if (flag) this.items.push(new MenuItem('Upravljanje sistemom', '', "fa fa-cogs"));
        this.dropdownItems.push(new MenuItem('Upravljanje pravilima', 'izmena-pravila', "fa fa-pencil"));
      }

      this.items.push(new MenuItem('Tehnička podrška', 'tehnicka-podrska', "fa fa-wrench"));
      this.items.push(new MenuItem('Profil', 'profil', "fa fa-user"));

    });
  }

  ngAfterViewInit(): void {
    this.setFakeOnLoad();

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

  setHeight() {
    try {
      var height = Number.parseInt(getComputedStyle($(".navbar")[0]).height) + 20;
      height < 100 ? this.min = height : this.max = height;
      $(".menuOffset").css("height", height + "px");
    }
    catch (err) { }
  }


  setFakeOnLoad() {
    if (this.router.url.includes("izmena-pravila") ||
      this.router.url.includes("nove-kulture") || this.router.url.includes("dodaj-korisnika")) {
      $("#fake").addClass("active");
    }
  }

  setFake(status) {
    status ? $("#fake").addClass("active") : $("#fake").removeClass("active");
  }

  logOut() {
    this.menuService.logout().subscribe(data => {

      var lang = localStorage.getItem("lang");
      localStorage.clear();
      localStorage.setItem("lang", lang);
      localStorage.setItem("scroll", "true");
      this.router.navigate(['../PlanTECH']);
    });
  }

  collapse() {
    $(".collapse").removeClass("in");
    this.flag = !this.flag;
  }
}
