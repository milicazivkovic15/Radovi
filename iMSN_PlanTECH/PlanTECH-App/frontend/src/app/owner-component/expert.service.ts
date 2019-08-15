import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, Response } from '@angular/http';
import { AppConfig } from 'app/appConfig';
declare var swal:any;

@Injectable()
export class ExpertService {

   constructor(private http:Http) { }

getExpert():Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/getNotificationsFromExpert'; 
        let username=localStorage.getItem('key');
    
      var input = {tokenID:username};
      var body = JSON.stringify({ input });
      var params = "json=" + body; 
      var headers = new Headers();
      headers.append('Content-Type' , 'application/x-www-form-urlencoded');
      return this.http.post(determineUrl, params, { headers: headers })
                      .map(res => res.json())
                      .catch(this.handleError);
  }
  deleteOldNotif():Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/deleteOldNotif'; 
        let username=localStorage.getItem('key');
    
      var input = {username};
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
