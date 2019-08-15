import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AppConfig } from "app/appConfig";
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
declare var swal:any;

@Injectable()
export class FooterService {

  constructor(private http: Http) { }

  sendMail(mText, mEmail):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/sendMailToUs'; 

    var input = {text: mText, email: mEmail};
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
