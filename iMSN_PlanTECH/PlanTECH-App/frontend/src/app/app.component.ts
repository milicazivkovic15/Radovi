import { Component, AfterContentInit, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { LoginComponent } from './default/login/login.component';
import { TranslateService } from 'ng2-translate';
import * as $ from 'jquery';
import { CornyService } from "app/shared/corny/corny.service";
import { CornyComponent } from "app/shared/corny/corny.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent implements AfterContentInit {
  
  ngAfterContentInit(): void {
    setTimeout(()=>{$(window).resize();},5000);
  }

  constructor(private router:Router, private translate: TranslateService, private elementRef: ViewContainerRef, private componentFactoryResolver:ComponentFactoryResolver)
  {
    if(localStorage.getItem("lang")==null)  localStorage.setItem("lang","sr");
    
    CornyService.setReference(this.elementRef,this.componentFactoryResolver,CornyComponent);

    router.events.subscribe(val=>{
      $(window).resize();
    });

    translate.addLangs(["sr","en"]);
   // translate.setDefaultLang("sr");

    let browserlang = translate.getBrowserLang();
    //translate.use(browserlang.match(/sr|en/) ? browserlang : "sr");
    var lang = localStorage.getItem("lang");
    if(lang == null) {
      translate.use("sr");
      localStorage.setItem("lang","sr");
    }
    else{
      translate.use(lang);
    }
  }
}
