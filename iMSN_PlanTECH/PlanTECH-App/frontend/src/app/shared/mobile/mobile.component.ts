import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent {

  constructor(activatedRoute: ActivatedRoute, router: Router) {

    activatedRoute.queryParams.subscribe(params => {

      var token = params['token'];
      var userType = params['userType'];
      var lang = params['lang'];

      localStorage.setItem("key", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("lang", lang);

      router.navigate(['/' + userType]);
    });

  }

}
