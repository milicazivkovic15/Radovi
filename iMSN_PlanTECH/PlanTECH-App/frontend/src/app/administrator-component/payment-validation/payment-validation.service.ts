import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from "app/appConfig";
declare var swal: any;

@Injectable()
export class PaymentValidationService {

  constructor(private http: Http) { }

  getForValidation(): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/forValidation';

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

  sendResponse(ID: String, accepted: boolean): Observable<any> {
    let determineUrl = AppConfig.WEB_API + '/acceptAccount';

    var tokenString = localStorage.getItem('key');
    var input = { accID: ID, accAccepted: accepted };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
}
