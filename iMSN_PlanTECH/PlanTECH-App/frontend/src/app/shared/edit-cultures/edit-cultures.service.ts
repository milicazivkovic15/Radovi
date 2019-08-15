import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { User } from '../../shared/User'
import { AppConfig } from "app/appConfig";
declare var swal: any;
@Injectable()
export class EditCulturesService {

  constructor(private http: Http) { }

  getCrops() {
    let determineUrl = AppConfig.WEB_API + '/getCrops';
    var input = {};
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  addNew(subcrops, manufacturer, crop) {
    let determineUrl = AppConfig.WEB_API + '/addNew';
    var input = { sc: subcrops, mf: manufacturer, c: crop };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  getSubCrops(crop) {
    let determineUrl;
    if (localStorage.getItem("userType") == "Agronom")
      determineUrl = AppConfig.WEB_API + '/getOnlySubCrops';
    else
      determineUrl = AppConfig.WEB_API + '/getSubCrops';
    let username = localStorage.getItem("username");

    var input = { crop, username };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  deleteCrop(crop) {
    let determineUrl = AppConfig.WEB_API + '/deleteCrops';
    var input = { crop };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  updateCrop(ID, crop) {
    let determineUrl = AppConfig.WEB_API + '/updateCrops';
    var input = { ID, crop };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  insertCrop(crop) {
    let determineUrl = AppConfig.WEB_API + '/insertCrops';
    var input = { crop };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  deleteSubCrop(IDsub) {
    let determineUrl;
    if (localStorage.getItem("userType") == "Agronom")
      determineUrl = AppConfig.WEB_API + '/deleteGeneralSubCrop';
    else
      determineUrl = AppConfig.WEB_API + '/deleteSubCrop';

    var input = { IDsub };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  updateSubCrop(IDcrop, IDsubcrop, crop) {
    let determineUrl;
    if (localStorage.getItem("userType") == "Agronom")
      determineUrl = AppConfig.WEB_API + '/updateGeneralSubCrop';
    else
      determineUrl = AppConfig.WEB_API + '/updateSubCrop';

    var input = { IDcrop, IDsubcrop, crop };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  insertSubCrop(ID, crop, manuf) {
    let determineUrl;
    if (localStorage.getItem("userType") == "Agronom")
      determineUrl = AppConfig.WEB_API + '/insertGeneralSubCrop';
    else
      determineUrl = AppConfig.WEB_API + '/insertSubCrop';
    let username = localStorage.getItem("username");
    var input = { ID, crop, manuf, username };
    var body = JSON.stringify({ input });
    var params = "json=" + body;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(determineUrl, params, { headers: headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  getManufacturer() {
    let determineUrl = AppConfig.WEB_API + '/getManufacturer';
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
    console.log(status);

    if (localStorage.getItem("lang") == "en") swal("Error!", "Please try again", "error");
    else swal("Greška!", "Molimo vas pokušajte ponovo", "error");
    return Observable.throw(error);
  }
}
