import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from "app/appConfig";
import { Rule } from '../Rule';
declare var swal:any;



@Injectable()
export class EditRulesService {

  constructor(private http:Http) { }

  getAllRules():Observable<any> {
    let determineUrl =  AppConfig.WEB_API +'/getAllRules'; 
    var tokenString = localStorage.getItem('key');
    var ut = localStorage.getItem('userType');

    var input = {tokenID:tokenString, userType: ut};
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

    addRule(string:string,message:string,priority:number):Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/addRule'; 
      var ut = localStorage.getItem('userType');
       var id= localStorage.getItem("key");
     
      
      var input = {ID:id,owner:id,string: string,message: message, userType:ut,priority:priority};
      var body = JSON.stringify({ input });
      var params = "json=" + body; 
      var headers = new Headers();
      headers.append('Content-Type' , 'application/x-www-form-urlencoded');
      return this.http.post(determineUrl, params, { headers: headers })
                      .map(res => res.json())
                      .catch(this.handleError);
  }

    deleteRule(rulee):Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/deleteRule'; 
      var ut = localStorage.getItem('userType');
      var id= localStorage.getItem("key");
      var input = {ID: id,string: rulee, userType:ut};
      var body = JSON.stringify({ input });
      var params = "json=" + body; 
      var headers = new Headers();
      headers.append('Content-Type' , 'application/x-www-form-urlencoded');
      return this.http.post(determineUrl, params, { headers: headers })
                      .map(res => res.json())
                      .catch(this.handleError);
  }

    updateRule(string:string,message:string,priority:number,oldString:string,oldMessage:string,owner:number):Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/updateRule'; 
     
      var ut = localStorage.getItem('userType');
       var id= localStorage.getItem("key");
      var input = {owner:owner,ID: id,string: string,message: message, userType:ut,priority:priority,oldString: oldString,oldMessage: oldMessage};
      var body = JSON.stringify({ input });
      var params = "json=" + body; 
      var headers = new Headers();
      headers.append('Content-Type' , 'application/x-www-form-urlencoded');
      return this.http.post(determineUrl, params, { headers: headers })
                      .map(res => res.json())
                      .catch(this.handleError);
  }

    getUserParcels():Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/getUserParcels'; 
      var tokenString = localStorage.getItem('key');

      var input = {tokenID:tokenString};
      var body = JSON.stringify({ input });
      var params = "json=" + body; 
      var headers = new Headers();
      headers.append('Content-Type' , 'application/x-www-form-urlencoded');
      return this.http.post(determineUrl, params, { headers: headers })
                      .map(res => res.json())
                      .catch(this.handleError);
  }
   getCrops () 
  {
    let determineUrl =  AppConfig.WEB_API +'/getCrops'; 
    var input = {};
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

