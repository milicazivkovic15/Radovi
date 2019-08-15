import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, AfterContentInit, forwardRef, Inject } from '@angular/core';
import { NotificationsService } from './notifications.service';
import * as $ from 'jquery';
import { MenuInterface } from '../MenuInterface';
import { MyDate } from "app/shared/MyDate";
import { Router } from '@angular/router';
import { LoginService } from "app/default/login/login.service";
import { CornyService } from "app/shared/corny/corny.service";

declare var setCalendar;
declare var swal: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  providers: [NotificationsService, LoginService],
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, AfterContentInit {

  constructor(private service: NotificationsService, private router: Router, private loginService: LoginService) {
    this.parent = NotificationsService.parentRef;
  }

  parent: MenuInterface;

  deleteNotification(ID) {

    this.service.deleteNotification(ID).subscribe(data => { });
    this.notifications = this.notifications.filter(e => e.ID != ID);
  }

  deleteNotificationByText(text) {
    this.delNotif(text);
  }

  ngAfterContentInit(): void {



    var ev = [];
    this.service.getCalendar().subscribe(data => {
      if (data.data) {

        data.data.forEach(el => {
          var bg: string;
          if (el.Priority == 1)
            bg = "#ff5c33";
          else if (el.Priority == 2)
            bg = "#ffd11a";
          else
            bg = "#66cc66";
          ev.push({ title: el.Title, start: el.Date, backgroundColor: bg, borderColor: bg });
        });

        if (ev.length == 0 && CornyService.show) {
          ev.push({ title: 'Proverite parcelu', start: new Date(Date.now()), backgroundColor: '#99ff99', borderColor: '#99ff99' });
        }
      }
      setCalendar(ev, this.callService.bind(this), this.delete.bind(this), this.newNotif.bind(this), this.delNotif.bind(this), this.setDate.bind(this), this.deleteFromCalendar.bind(this), this.addFromCalendar.bind(this), this.deleteNotificationByText.bind(this), this.dragable.bind(this));

    });
  }
  dragable(tmp) {
  }

  deleteFromCalendar(text, date) {
    this.service.deleteFromCalendar(text, date).subscribe();
  }

  addFromCalendar(text, date, color) {
    this.callService(text, date, color);
  }

  setDate() {
    try {
      if (localStorage.getItem("lang") === "sr") {
        setTimeout(() => {
          var date = $(".fc-center")[0].innerHTML;

          var string = date.substring(date.indexOf(">") + 1, date.lastIndexOf("<"));

          var tmp = new MyDate(string);
          $(".fc-center")[0].innerHTML = "<h2>" + tmp.getFullMonthName() + " " + tmp.getFullYear() + "</h2>";
          if ($(".fc-center")[0].innerHTML.indexOf("undefined") != -1) $(".fc-center")[0].innerHTML = date;
        }, 10);

        $(".fc-day-header").each((ind, el) => {
          var tmp = el.textContent;

          if (tmp == "Sun") tmp = "Ned";
          else if (tmp == "Mon") tmp = "Pon";
          else if (tmp == "Tue") tmp = "Uto";
          else if (tmp == "Wed") tmp = "Sre";
          else if (tmp == "Thu") tmp = "Čet";
          else if (tmp == "Fri") tmp = "Pet";
          else if (tmp == "Sat") tmp = "Sub";

          el.textContent = tmp;
        });
      }
      else {
        $(".fc-today-button")[0].innerText = "today";
      }
    } catch (err) { }
  }

  callService(title, date, bg) {

    var priority;
    if (bg == "rgb(255, 92, 51)")
      priority = 1;
    else if (bg == "rgb(255, 209, 26)")
      priority = 2;
    else
      priority = 3;
    if (title.indexOf("- Pregled") != -1 || title.indexOf("- Review") != -1) {
      if (title.indexOf("- Pregled") != -1) title = title.substr(0, title.lastIndexOf("- Pregled"));
      else title = title.substr(0, title.lastIndexOf("- Review"));

      title = title.trim();
    }

    this.service.insertInCalendar(title, date, priority).subscribe();
  }
  newNotif(val, bg) {

    var priority;
    if (bg == "rgb(255, 92, 51)")
      priority = 1;
    else if (bg == "rgb(255, 209, 26)")
      priority = 2;
    else
      priority = 3;
    this.service.insertInNotification(val, priority).subscribe(data => {
      if (data.data) {
        if (localStorage.getItem('lang') == "sr")
          swal("Ušpesno", "Kreirano obaveštenje!", "success");
        else
          swal("Successfully", "Created a notification!", "success");
      }
      else {
        if (localStorage.getItem('lang') == "sr")
          swal("Greška", "Takvo obaveštenje već postoji!", "error");
        else
          swal("Error", "That notification already exists!", "error");


        $("#external-events")[0].children[0].remove();
      }
    });

  }
  delNotif(val) {
    this.service.deleteFromNotification(val).subscribe();
  }
  delete(el: JQuery, del) {

    var title = el.parent()[0].getElementsByClassName("fc-title")[0].textContent;

    $(el[0].parentNode.parentNode).find("td").each((ind, e) => {
      if ($.contains(e, el[0])) {
        var date = new Date($($(el[0].parentNode.parentNode.parentNode.parentNode.firstChild)[0].children[0].children[ind]).attr("data-date"));
        this.service.deleteFromCalendar(title, date).subscribe();
        del();
      }
    });

  }


  public notifications: any[] = [];

  ngOnInit() {
    this.parent.numNotif();

    this.service.getNotifications().subscribe(data => {
      this.notifications = data.notif;
      this.notifications.reverse();

      if (this.notifications.length == 0 && CornyService.show) {
        this.notifications.push({
          ID: 1,
          Title: 'Podsetnik: Zaliti parcelu',
          Priority: 2,
          UserID: 1,
          Date: new Date(Date.now()),
        });
      }
    });
  }
  lookPlantage(ID) {
    var parcels = JSON.parse(localStorage.getItem("parcels"));

    var parcel = parcels.find(el => el.ID == ID);
    localStorage.setItem("parcelData", JSON.stringify(parcel));

    this.router.navigate(['/' + localStorage.getItem("userType") + '/plantaze/plantaza']);
  }
}
