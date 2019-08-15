import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from "app/appConfig";
declare var swal:any;

@Injectable()
export class PermissionsService {

  constructor(private http:Http) { }

  getAllPermissions():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllPermissions'; 

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

  getPermissionsOfWorker(ID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllPermissionsOfWorker'; 

    var tokenString = localStorage.getItem("key");
    var input = {accID:ID, token: tokenString};
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  savePermissions(data):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/savePermissions'; 

    var input = {perms: data};
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  deletePermissions(permsID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/deletePermissions'; 

    var tokenString = localStorage.getItem('key');
    var input = {ID: permsID, token:tokenString};
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
