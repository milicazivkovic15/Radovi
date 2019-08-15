import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';

@Component({
  selector: 'app-image-zoom',
  templateUrl: './image-zoom.component.html',
  styleUrls: ['./image-zoom.component.css']
})
export class ImageZoomComponent implements PopupInteface {

  constructor() { }

  private url:String = '';

  setContent(json) {
    this.url = json.url;
  }
  setCallback(callback) {}

  setClose(callback) {}
}
