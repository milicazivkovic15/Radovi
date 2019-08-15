import { Component, OnInit, AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../default/login/login.service';
import { MenuComponent } from '../owner-component/menu/menu.component';
import { MenuInterface } from '../shared/MenuInterface';
import { NotificationsService } from "app/shared/notifications/notifications.service";
import { CornyService } from "app/shared/corny/corny.service";
import { AppConfig } from "app/appConfig";
import { ExpertService } from "app/owner-component/expert.service";
import { ToastOptions, ToastData, ToastyService } from "ng2-toasty";
import { MenuService } from "app/owner-component/menu/menu.service";

@Component({
  selector: 'app-user-component',
  providers: [LoginService, NotificationsService, CornyService],
  templateUrl: './user-component.component.html',
  styleUrls: ['./user-component.component.css']
})
export class UserComponent implements OnInit, AfterViewInit, MenuInterface, AfterContentInit {

  constructor(private menuService: MenuService, private service: LoginService, private router: Router, private cornyService: CornyService, private expert: ExpertService, private toastyService: ToastyService) {
    NotificationsService.parentRef = this;

    this.audio = new Audio();
    this.audio.src = AppConfig.WEB_API + "/notification.mp3";
    this.audio.load();
  }

  private audio: any;

  setFakeOnLoad() {
    if (this.router.url.includes("izmena-pravila") ||
      this.router.url.includes("nove-kulture")) {
      setTimeout(() => { $("#fake").addClass("active"); }, 1000);
    }
  }

  ngAfterContentInit() {
    this.setFakeOnLoad();

    this.cornyService.getShow().subscribe(data => {
      if (data.flag) {
        CornyService.showCorny();
      }
    });
  }

  @ViewChild("menu") menu: MenuComponent;

  ngAfterViewInit(): void {
    var tmp = $('.bg');
    tmp.removeClass();
    tmp.addClass("bg");
    tmp.addClass("parcels");
  }

  numNotif() {
    this.menu.numNotifi();
  }

  ngOnInit() {
    if (localStorage.getItem("key") != null) {
      if (localStorage.getItem("userType") == "Korisnik") {
        this.service.validateToken().subscribe(data => {
          let status: boolean = data.tokenStatus;

          if (!status) {
            localStorage.removeItem('key');
            localStorage.removeItem('userType');
            this.router.navigate(['../PlanTECH']);
          }
          this.refresh();
          setInterval(() => { this.refresh(); }, 5 * 60 * 1000);
        });
      }
      else {
        this.router.navigate(['../' + localStorage.getItem("userType")]);
      }
    }
    else {
      this.router.navigate(['../PlanTECH']);
    }
  }

  refresh() {
    this.expert.deleteOldNotif().subscribe(data => {
      this.expert.getExpert().subscribe(data => {

        var ind = 0;

        if (data != []) {
          var int = setInterval(() => {
            if (ind < data.length) {
              var toastOptions: ToastOptions = {
                title: "Novo obavestenje:",
                msg: data[ind],
                showClose: true,
                timeout: 15000,
                theme: 'default',
                onAdd: (toast: ToastData) => {
                  console.log('Toast ' + toast.id + ' has been added!');
                },
                onRemove: function (toast: ToastData) {
                  console.log('Toast ' + toast.id + ' has been removed!');
                }

              }

              this.audio.play();
              this.toastyService.info(toastOptions);
              ind++;

              setTimeout(() => {
                $(".toast-text").click(() => {
                  this.router.navigate(['/Korisnik/obavestenja']);
                });
              }, 100);
            }
            else clearInterval(int);
          }, 1000);
        }
        // Add see all possible types in one shot



        this.menuService.getNotif().subscribe(data => {
          this.menu.numNotif = data.notif;
        });
      });
    });
  }

}
