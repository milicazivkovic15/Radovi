import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from "app/appConfig";
import { Notification } from '../Notification';
import { MenuInterface } from "../MenuInterface";
declare var swal: any;

@Injectable()
export class NotificationsService {

  constructor(private http: Http) { }

  static parentRef: MenuInterface;

  getNotifications(): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/getNotification';
    let username = localStorage.getItem('key');

    var input = { username };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  getCalendar(): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/getCalendar';
    let username = localStorage.getItem('key');
    var input = { username };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  insertInCalendar(title, date, bg): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/insertInCalendar';
    let username = localStorage.getItem('key');
    var input = { username, title, date, bg };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  insertInNotification(title, bg): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/insertInNotification';
    let username = localStorage.getItem('key');
    var input = { username, title, bg };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  deleteFromCalendar(title, date): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/deleteFromCalendar';
    let username = localStorage.getItem('key');
    var input = { username, title, date };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  deleteFromNotification(title): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/deleteFromNotification';
    let username = localStorage.getItem('key');
    var input = { username, title };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  deleteNotification(notifID): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/deleteNotification';
    var input = { ID: notifID };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }



  private handleError(error: Response) {
    var status = error.status;
    console.log(status);

    if (localStorage.getItem("lang") == "en") swal("Error!", "Please try again", "error");
    else swal("Greška!", "Molimo vas pokušajte ponovo", "error");
    return Observable.throw(error);
  }
}
