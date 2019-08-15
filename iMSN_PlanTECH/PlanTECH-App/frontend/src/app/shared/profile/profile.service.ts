import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { User } from '../../shared/User'
import { AppConfig } from "app/appConfig";
declare var swal: any;
@Injectable()
export class ProfileService {

  constructor(private http: Http) { }

  getUser(user) {
    let determineUrl = AppConfig.WEB_API + '/getUser';
    var input = { user };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  getToDos() {
    let determineUrl = AppConfig.WEB_API + '/getToDos';
    var tokenString = localStorage.getItem("key");
    var input = { token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  getNumbers(user) {
    let determineUrl = AppConfig.WEB_API + '/getNumbers';
    var input = { user };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  changeUser(user) {
    let determineUrl = AppConfig.WEB_API + '/changeUser';
    var input = { user };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  getAllWorks() {
    let determineUrl = AppConfig.WEB_API + '/getAllWorks';
    var tokenString = localStorage.getItem("key");
    var input = { token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  deleteJob(ID) {
    let determineUrl = AppConfig.WEB_API + '/deleteJob';
    var tokenString = localStorage.getItem("key");
    var input = { token: tokenString, ownerID: ID };
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
