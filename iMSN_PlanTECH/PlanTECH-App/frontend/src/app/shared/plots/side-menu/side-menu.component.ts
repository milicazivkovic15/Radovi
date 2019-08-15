import { Component, OnInit, Input, AfterViewInit, AfterContentInit } from '@angular/core';
import { PlotsService } from '../plots.service';
import { Router } from '@angular/router';
import { CornyService } from "app/shared/corny/corny.service";

@Component({
  selector: 'app-side-menu',
  providers: [PlotsService],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})

export class SideMenuComponent implements OnInit, AfterViewInit, AfterContentInit {

  private sideMenuHeight: number;

  ngAfterContentInit(): void {

    setTimeout(() => { this.corny = CornyService.show; }, 500);
    CornyService.onClose(() => {
      this.corny = false;
    });

    this.sideMenuHeight = $(window).height();

    $(window).scroll(() => {
      this.setSideMenuHeight();
    });

    $(window).resize(() => {
      this.setSideMenuHeight();
    });

    setTimeout(() => {
      this.setSideMenuHeight();
    }, 300);
  }

  @Input() parent;

  constructor(private service: PlotsService, private router: Router) {
    router.events.subscribe(val => {
      if (val.url.endsWith("plantaze")) this.setActive({ ID: null });
    });

  }

  ngAfterViewInit() {

    if (localStorage.getItem("userType") == "Vlasnik") this.newSensor = true;
    else {
      this.service.getPermissions().subscribe(data => {
        if (data.status) this.newSensor = true;
      });
    }

    $("#menu-toggle").click(e => {
      e.preventDefault();

      $("#wrapper").toggleClass("toggled");
      $(".fakeCardWithSideMenu").removeClass("notransition");
      $(".fakeCardWithSideMenu").toggleClass("toggledCard");

      this.changeIcon();
    });

    if ($("body").width() < 768) {
      $("#menu-toggle").click();
    }
  }

  scroll() {
    $("#sidebar-wrapper").scrollTop(0);
  }

  setSideMenuHeight() {
    var scrollPos = $(window).scrollTop() + $(window).height();
    var offset = Math.round($(".bg").outerHeight());

    var diff = offset - scrollPos;

    $("#sidebar-wrapper").height(diff < 0 ? this.sideMenuHeight + diff - 10 : this.sideMenuHeight);
  }

  changeIcon() {
    if (this.arrowName.endsWith("left")) this.arrowName = "glyphicon glyphicon-chevron-right";
    else this.arrowName = "glyphicon glyphicon-chevron-left";
  }

  private arrowName: string = "glyphicon glyphicon-chevron-left";
  private parcels: any[] = [];
  private filtered: any[] = [];
  private newPlot: string = "";
  private newParcel: boolean = false;
  private filterWord: string = "";
  private owners: boolean = false;
  private corny: boolean = false;

  ngOnInit() {
    if (localStorage.getItem("userType") == "Vlasnik") {
      setTimeout(() => {
        this.service.getParcelCount().subscribe(data => {
          var type = Number.parseInt(localStorage.getItem("paymentType"));

          if (type == 3) this.newParcel = true;
          else {
            this.newParcel = +data.count < +(type * 5);
          }
        });
      }, 500);
    }
    this.load();
  }

  load(f?, callback?) {
    this.service.getParcels().subscribe(data => {
      if (data.parcels != null) {
        var tmp = data.parcels;
        if (CornyService.show) {
          data.parcels = [{
            Edit: 1,
            ID: -1,
            MiddleLatitude: 44.01735,
            MiddleLongitude: 20.903936499999983,
            No: null,
            Owner: null,
            Title: 'Plantaža 1',
            parcelWithOwner: 'Plantaža 1',
          }];
        }
        tmp.forEach(el => {
          data.parcels.push(el);
        });

        localStorage.setItem("parcels", JSON.stringify(data.parcels));

        this.parcels = data.parcels;
        var temp = JSON.parse(localStorage.getItem("parcelData"));
        var user = "/" + localStorage.getItem("userType");

        if (temp != null && this.router.url == user + '/plantaze/plantaza') {
          this.parcels.filter(el => {
            if (el.ID == temp.ID) el.class = "bold";
            else el.class = "";
          });
          this.newPlot = "";
          this.newSensorClass = "";
        }
        this.filter();
      }
      this.service.getParcelCount().subscribe(data => {
        var type = Number.parseInt(localStorage.getItem("paymentType"));

        if (type == 3 && localStorage.getItem("userType") == "Vlasnik") this.newParcel = true;
        else {
          this.newParcel = +data.count < +(type * 5) && localStorage.getItem("userType") == "Vlasnik";
          this.service.getPossibleOwners().subscribe(data => {
            if (data.owners.length > 0) {
              this.newParcel = true;
              this.owners = true;
            }

            if (f == true) {
              callback();
            }
          });
        }
      });

    });
  }

  show(ID) {
    this.scroll();
    var parcel = this.parcels.find(el => el.ID == ID);
    var json = JSON.stringify(parcel);
    var user = "/" + localStorage.getItem("userType");

    localStorage.setItem("parcelData", json);

    if (this.router.url != user + '/plantaze/plantaza') {
      this.router.navigate([user + '/plantaze/plantaza']);
    }
    else {
      this.router.navigate([user + '/plantaze/_blank']);
      setTimeout(() => {
        this.router.navigate([user + '/plantaze/plantaza']);
      }, 0);
    }

    var temp = JSON.parse(localStorage.getItem("parcelData"));

    this.setActive(temp);

    // if ($(".toggled").length == 0) {
    //   $("#wrapper").addClass("toggled");
    //   this.changeIcon();
    // }
  }

  setActive(temp) {
    this.parcels.filter(el => {
      if (el.ID == temp.ID) el.class = "bold";
      else el.class = "";
    });
    this.newPlot = "";
    this.newSensorClass = "";
    this.filter();
  }

  showNew() {
    this.scroll();

    this.parcels.filter(el => {
      el.class = "";
    });
    this.newPlot = "bold";
    this.newSensorClass = "";

    var user = "/" + localStorage.getItem("userType");
    this.router.navigate([user + '/plantaze/nova']);

    // if ($(".toggled").length == 0) {
    //   $("#wrapper").addClass("toggled");
    //   this.changeIcon();
    // }
    this.filter();
  }

  showNewSensor() {
    this.scroll();

    this.parcels.filter(el => {
      el.class = "";
    });
    this.newPlot = "";
    this.newSensorClass = "bold";

    var user = "/" + localStorage.getItem("userType");
    this.router.navigate([user + '/plantaze/novi-senzor']);

    // if ($(".toggled").length == 0) {
    //   $("#wrapper").addClass("toggled");
    //   this.changeIcon();
    // }
    this.filter();
  }

  private newSensor: boolean = false;
  private newSensorClass: string = "";

  //zatvri posle promene
  //prikazi ikonice

  refreshMenu(ID) {
    var t = this;

    this.newParcel = false;
    this.load(true, function () {
      var tmp = t.parcels.find(el => el.ID == ID);

      localStorage.setItem("parcelData", JSON.stringify(tmp));
      t.router.navigate([localStorage.getItem("userType") + '/plantaze/plantaza']);
    });
  }

  filter() {
    var tmp = [];

    if (this.filterWord === "") {
      tmp = this.parcels;
    }
    else {
      this.parcels.forEach(el => {
        if (el.parcelWithOwner.toLowerCase().indexOf(this.filterWord.toLowerCase()) != -1) tmp.push(el);
      });
    }

    this.filtered = [];

    tmp.forEach(el => {
      if (this.filtered.find(e => e.ID == el.ID) == null) this.filtered.push(el);
    });

    this.filtered.sort((a, b) => {
      return a.parcelWithOwner.localeCompare(b.parcelWithOwner);
    });
  }

  setNewName(ID, name) {
    var parcel = this.parcels.find(el => el.ID == ID);
    var other = parcel.parcelWithOwner.substr(parcel.Title.length);

    parcel.parcelWithOwner = name + other;

    parcel.Title = name;
    this.filter();
  }
}
