import { Component, OnInit } from '@angular/core';
import { AppConfig } from "app/appConfig";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  private logoPath:string = AppConfig.Path+"/images/logo.png";
  private iMSNPath:string = AppConfig.Path+"/images/iMSN.png";
  private whyPath:string = AppConfig.Path+"/images/why.png";

  constructor() { }

  ngOnInit() {
  }

}
