import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { LoginService } from '../default/login/login.service';
import {Router} from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import * as $ from 'jquery';
import { CornyService } from "app/shared/corny/corny.service";

@Component({
  selector: 'app-administrator-component',
  providers: [LoginService, CornyService],
  templateUrl: './administrator-component.component.html',
  styleUrls: ['./administrator-component.component.css']
})
export class AdministratorComponent implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChild("menu") menu:MenuComponent;

 
    ngAfterContentInit(){
      this.cornyService.getShow().subscribe(data=>{
        if(data.flag)
        {
          CornyService.showCorny();
        }
      });
    }
  constructor(private service:LoginService,private router:Router, private cornyService:CornyService) { }

    ngAfterViewInit(): void {
    }

  ngOnInit() {
    if(localStorage.getItem("key")!=null)
    {
      if(localStorage.getItem("userType")=="Admin")
      {
        this.service.validateToken().subscribe(data=>{
          let status:boolean = data.tokenStatus;

          if(!status)
          {
            localStorage.removeItem('key');
            localStorage.removeItem('userType');
            this.router.navigate(['../PlanTECH']);
          }
        });
      }
      else
      {
        this.router.navigate(['../'+localStorage.getItem("userType")]);
      }
    }
    else
    {
      this.router.navigate(['../PlanTECH']);
    }
  }
  refresh()
  {
    this.menu.refresh();
  }
  refreshUser()
  {
    this.menu.refreshUser();
  }
}
