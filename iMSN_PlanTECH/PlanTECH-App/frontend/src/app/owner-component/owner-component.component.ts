import { Component, OnInit, AfterViewInit, ViewChild, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../default/login/login.service';
import { MenuComponent } from './menu/menu.component';
import { MenuInterface } from '../shared/MenuInterface';
import { NotificationsService } from "app/shared/notifications/notifications.service";
import { ExpertService } from './expert.service';
import { MenuService } from './menu/menu.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { CornyService } from "app/shared/corny/corny.service";
import { AppConfig } from "app/appConfig";

@Component({
  selector: 'app-owner-component',
  providers: [LoginService, NotificationsService, CornyService],
  templateUrl: './owner-component.component.html',
  styleUrls: ['./owner-component.component.css']
})
export class OwnerComponent implements OnInit, AfterViewInit, AfterContentInit, MenuInterface {
  @ViewChild("menu") menu: MenuComponent;

  ngAfterViewInit(): void {
  }

  ngAfterContentInit() {
    this.cornyService.getShow().subscribe(data => {
      if (data.flag) {
        CornyService.showCorny();
      }
    });
  }

  numNotif() {
    this.menu.numNotifi();
  }

  constructor(private cornyService: CornyService, private service: LoginService, private router: Router, private expert: ExpertService, private menuService: MenuService, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
    NotificationsService.parentRef = this;
    this.service.getPaymentType().subscribe(data => {
      localStorage.setItem("paymentType", data.paymentType);
    });

    this.audio = new Audio();
    this.audio.src = AppConfig.WEB_API + "/notification.mp3";
    this.audio.load();
  }

  private audio: any;

  ngOnInit() {
    if (localStorage.getItem("key") != null) {
      if (localStorage.getItem("userType") == "Vlasnik") {
        this.service.validateToken().subscribe(data => {
          let status: boolean = data.tokenStatus;

          if (!status) {
            localStorage.removeItem('key');
            localStorage.removeItem('userType');
            this.router.navigate(['../PlanTECH']);

          }
          else {
            this.refresh();
            setInterval(() => { this.refresh(); }, 5 * 60 * 1000);
          }
        });
      }
      else {
        this.router.navigate(['/' + localStorage.getItem("userType")]);
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
                  this.router.navigate(['/Vlasnik/obavestenja']);
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
