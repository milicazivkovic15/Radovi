import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from '../../shared/MenuItem';
import { Router } from '@angular/router';
import { AppConfig } from "app/appConfig";
import { MenuService } from "app/administrator-component/menu/menu.service";

@Component({
  selector: 'app-agronom-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [MenuService]
})

export class MenuComponent implements AfterViewInit {

  private items: MenuItem[] = [];
  private router: Router;
  private logoPath: string = AppConfig.Path + "/images/logo.png";

  constructor(router: Router, private service: MenuService) {
    this.router = router;

    this.items.push(new MenuItem('Izmena pravila', 'izmena-pravila', "fa fa-pencil"));
    this.items.push(new MenuItem('Izmena kultura', 'izmena-kultura', "fa fa-leaf"));
    this.items.push(new MenuItem('Korisnička podrška', 'korisnicka-podrska', "fa fa-wrench"));
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

}
