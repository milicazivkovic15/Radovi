import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from "app/appConfig";

declare var swal: any;

@Injectable()
export class MenuService {

  constructor(private http: Http) { }

  getNumberSupportTicket(): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/getNumberSupportTicket';

    var input = {};
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }


  logout(): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/logout';

    var input = {};
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  getNumberPendingOwner(): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/getNumberPendingOwner';

    var input = {};
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
    if (localStorage.getItem("lang") == "en") swal("Error!", "Please try again", "error");
    else swal("Greška!", "Molimo vas pokušajte ponovo", "error");
    return Observable.throw(error);
  }
}