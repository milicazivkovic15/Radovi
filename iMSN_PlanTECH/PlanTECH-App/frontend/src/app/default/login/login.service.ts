import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';
import { User } from '../../shared/User'
import { AppConfig } from "app/appConfig";

declare var swal:any;

@Injectable()
export class LoginService {
 
  constructor (private http: Http) {}

  postlogin (user:string, pass:string) 
  {
    let determineUrl = AppConfig.WEB_API + "/login";

    var input = { user, pass };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  postRegistration (user:User,userType:boolean) 
  {
    let determineUrl =  AppConfig.WEB_API +'/registration'; 
    var tmp = JSON.stringify(user);
    var jsonTmp = JSON.parse(tmp);
    jsonTmp.paid = userType;
    if(!userType) jsonTmp.accType = 4;
    var body = JSON.stringify(jsonTmp);
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  validateToken () 
  {
    let determineUrl =  AppConfig.WEB_API +'/verifyToken'; 

    var tokenString = localStorage.getItem('key');
    var input = { token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  checkExistance(uname) 
  {
    let determineUrl =  AppConfig.WEB_API +'/checkExistance'; 

    var input = { username: uname };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }
  
  getPaymentType()
  {
    let determineUrl =  AppConfig.WEB_API +'/getPaymentType'; 

    var tokenString = localStorage.getItem("key");

    var input = { token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getPermissions() 
  {
    let determineUrl =  AppConfig.WEB_API +'/allPermissions'; 

    var tokenString = localStorage.getItem('key');
    var input = { token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }
  sendMessage(username):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/forgottenPass'; 

    var input = { username };
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
