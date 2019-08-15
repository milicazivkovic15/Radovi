import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from "app/appConfig";
declare var swal:any;

@Injectable()
export class PlotsService {

  constructor(private http:Http) { }

  getParcels():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getParcels'; 

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

  getParcelCount():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getParcelCount'; 

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

  getToDo(ID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getToDo'; 

    var input = { ID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }
 doIt(ID,toDo):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/doIt'; 
    var tokenString = localStorage.getItem("key");
    var check=0;
    if(toDo)
      check=1;
    var input = { ID:ID,check:check,token:tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }
  getSensors():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getSensors'; 

    var input = { };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getParcelSensor(sID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getParcelSensor'; 

    var input = { ID: sID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  deleteSensor(sID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/deleteSensor'; 

    var input = { ID: sID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getAllCrops(pID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllCrops'; 

    var tokenString = localStorage.getItem("key");
    var input = { token: tokenString, parcelID:pID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getAllCropsForNew():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllCropsForNew'; 

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

  getPossibleOwners():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getPossibleOwners'; 

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

  saveParcelEdit(parcel):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/saveParcelEdit'; 
    
    var tokenString = localStorage.getItem("key");

    var input = { data:parcel, token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getSensorByIp(ipAdd):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getSensorByIp'; 
    
    var input = { ip: ipAdd };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  saveNewParcel(parcel):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/saveNewParcel'; 
    var tokenString = localStorage.getItem("key");
    
    var input = { data:parcel, token:tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getDataForSensor(ID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getDataForSensor'; 

    var input = { sensorID: ID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getTodaysForecast(lat,lng):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getTodaysForecast'; 

    var input = { latitude: lat, longitude: lng, lang: localStorage.getItem('lang') };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  deleteParcel(parcelID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/deleteParcel'; 

    var input = { ID: parcelID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getCoords(ID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getCoords'; 

    var input = { ID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getCrops(parcelID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getCropsForParcel'; 

    var input = { ID: parcelID };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getAllSensors(parcelID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllSensors'; 
    var tokenString = localStorage.getItem("key");

    var input = { ID: parcelID, token: tokenString};
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getAllSensorsForUser(ID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllSensorsForUser'; 
    var tokenString = localStorage.getItem("key");

    var input = { userID: ID, token: tokenString};
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getPermissions():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getPermission'; 
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
  
  getPossibleOwnersForSensors():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getPossibleOwnersForSensors'; 

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
 
  getParcelsForSensor(ID):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getParcelsForSensors'; 

    var tokenString = localStorage.getItem("key");

    var input = { userID: ID, token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  addNewSensor(sensorData):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/addNewSensor'; 

    var tokenString = localStorage.getItem("key");

    var input = { sensor: sensorData, token: tokenString };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  addEditSensor(sensorData):Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/addEditSensor'; 

    var tokenString = localStorage.getItem("key");

    var input = { sensor: sensorData };
    var body = JSON.stringify({ input });
    var params = "json=" + body; 
    var headers = new Headers();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  getSensorsForGeneralMap():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getSensorsForGeneralMap'; 

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

  getAllCoords():Observable<any>
  {
    let determineUrl =  AppConfig.WEB_API +'/getAllCoords'; 

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


  private handleError (error: Response) {
      var status = error.status;
      console.log(status);

      if(localStorage.getItem("lang")=="en") swal("Error!","Please try again","error");
      else swal("Greška!","Molimo vas pokušajte ponovo","error");
      return Observable.throw(error);
  }
}
