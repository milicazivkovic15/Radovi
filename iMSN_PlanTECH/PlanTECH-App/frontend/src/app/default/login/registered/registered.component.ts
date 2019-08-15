import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';
import { LoginService } from '../login.service';
import { AppConfig } from "app/appConfig";



@Component({
  selector: 'app-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.css']
})
export class RegisteredComponent implements PopupInteface {
  private close;
  private callback;
  private title: string;
  private error: string;
  private paid: boolean;
  private online: boolean;
  private picPath: string;

  constructor(private service: LoginService) { }

  setContent(flag: any) {
    this.paid = flag.paid;
    this.online = flag.online;

    this.picPath = AppConfig.Path + "/images/primer_uplatnice-" + localStorage.getItem("lang") + ".png";
  }
  saveChanges() {


  }
  closeWin() {
    this.close();
  }
  setCallback(callback: any) {
    this.callback = callback;
  }
  setClose(callback: any) {
    this.close = callback;
  }

}
