import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from "app/appConfig";
declare var swal:any;

@Injectable()
export class RegisterUserService {

  constructor(private http:Http) { }


  addWorker(user,parcelsList):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/addWorker'; 

    var token = localStorage.getItem("key");
    var input = {perms : JSON.stringify(user), mytoken : token, parcels: parcelsList};
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getWorkersCount():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getWorkersCount'; 

    var tokenString = localStorage.getItem("key");
    var input = {token: tokenString};
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getParcels():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllParcels'; 

    var tokenString = localStorage.getItem("key");
    var input = {token : tokenString};
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }


  private handleError (error: Response) {
      var status = error.status;
      console.log(status);

      if(localStorage.getItem("lang")=="en") swal("Error!","Please try again","error");
      else swal("Greška!","Molimo vas pokušajte ponovo","error");
      return Observable.throw(error);
  }
}




