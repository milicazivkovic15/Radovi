import { Injectable, ElementRef, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AppConfig } from "app/appConfig";
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
declare var swal:any;

@Injectable()
export class CornyService {
 
  constructor(private http:Http) {}

  private static componentFactoryResolver:ComponentFactoryResolver;
  private static elementRef:ViewContainerRef;
  private static callback:any;
  private static componentRef:ComponentRef<{}>;
  public static show:boolean = false;
  private static component:any;

  public static setReference(elementRef:ViewContainerRef, componentFactoryResolver:ComponentFactoryResolver,component:Type<{}>){
    this.elementRef = elementRef;
    this.componentFactoryResolver = componentFactoryResolver;
    this.component = component;
  }

  public static onClose(callback){
    this.callback = callback;
  }

  public static destroyMe(){
    this.componentRef.destroy();

    this.show = false;
    try{
      this.callback();
    }catch(err){}
  }

  public static forceRefreshSelect()
  {
    setTimeout(()=>{
      (<any>this.componentRef.instance).refreshSelector();
    },300);
  }

  public static showCorny(){
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.componentRef = this.elementRef.createComponent(factory);
    this.componentRef.changeDetectorRef.detectChanges();

    this.show = true;
  }

  getShow():Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/getShowCorny'; 
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
  
  setShow(flagShow:boolean):Observable<any> {
      let determineUrl =  AppConfig.WEB_API +'/setShowCorny'; 
      var tokenString = localStorage.getItem("key");
      var input = {token: tokenString, flag:flagShow};
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
