import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../popup-inteface';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.css']
})
export class YesNoDialogComponent implements PopupInteface {

  private message = "";
  private callback;
  private close;

  setContent(json: any) {
    this.message=json;
  }
  setCallback(callback: any) {
    this.callback=callback;
  }
  setClose(callback: any) {
    this.close=callback;
  }

  click(status)
  {
    this.callback(status);
    this.close();
  }
}
