import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../appConfig';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {

  private imgPath: string;

  constructor() {
    this.imgPath = AppConfig.Path + "/images/cenovnik/cenovnik_" + localStorage.getItem("lang") + ".png";
    $("#priceImg").attr("src", this.imgPath);
  }

  setLanguage(lang) {
    this.imgPath = AppConfig.Path + "/images/cenovnik/cenovnik_" + lang + ".png";
    $("#priceImg").attr("src", this.imgPath);
  }

  ngOnInit() {
  }

}
