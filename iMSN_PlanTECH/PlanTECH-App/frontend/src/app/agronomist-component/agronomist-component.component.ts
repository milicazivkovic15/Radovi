import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../default/login/login.service';
import { CornyService } from "app/shared/corny/corny.service";

@Component({
  selector: 'app-agronomist-component',
  providers: [LoginService, CornyService],
  templateUrl: './agronomist-component.component.html',
  styleUrls: ['./agronomist-component.component.css']
})
export class AgronomistComponent implements OnInit, AfterViewInit, AfterContentInit {

  constructor(private service: LoginService, private router: Router, private cornyService: CornyService) { }

  ngAfterContentInit() {
    this.cornyService.getShow().subscribe(data => {
      if (data.flag) {
        CornyService.showCorny();
      }
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    if (localStorage.getItem("key") != null) {
      if (localStorage.getItem("userType") == "Agronom") {
        this.service.validateToken().subscribe(data => {
          let status: boolean = data.tokenStatus;

          if (!status) {
            localStorage.removeItem('key');
            localStorage.removeItem('userType');
            this.router.navigate(['../PlanTECH']);
          }
        });
      }
      else {
        this.router.navigate(['/' + localStorage.getItem("userType")]);
      }
    }
    else {
      this.router.navigate(['../PlanTECH']);
    }
  }

}
