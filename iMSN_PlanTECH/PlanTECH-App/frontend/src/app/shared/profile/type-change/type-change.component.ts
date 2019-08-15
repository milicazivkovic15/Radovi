import { Component, OnInit, Directive } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';
import { Crops } from '../../../shared/Crops';
import { LoginService } from "app/default/login/login.service";
import { NgClass, NgStyle } from '@angular/common';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { AppConfig } from 'app/appConfig';

declare var swal: any;

@Component({
  selector: 'app-type-change',
  templateUrl: './type-change.component.html',
  styleUrls: ['./type-change.component.css'],

})
export class TypeChangeComponent implements PopupInteface {
  private close;
  private callback;
  private error: string;
  private URL = AppConfig.WEB_API + "/uploadPacketChange/";
  private tmp = AppConfig.WEB_API + "/uploadPacketChange/";
  private err: string = "";
  private type;
  private token = localStorage.getItem("key");


  public uploader: FileUploader = new FileUploader({ url: this.URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;



  checkIfFieldsArePopulated() {
    return (this.uploader.queue.length > 0);
  }


  ngDoCheck() {

    if (this.uploader.queue.length == 1) {
      var file: string = this.uploader.queue[0].file.name;
      if (file.toLocaleLowerCase().endsWith(".jpg") == false && file.toLocaleLowerCase().endsWith(".jpeg") == false && file.toLocaleLowerCase().endsWith(".bmp") == false && file.toLocaleLowerCase().endsWith(".png") == false) {
        this.uploader.clearQueue();

        if (localStorage.getItem("lang") == "sr") {
          swal("Greška!", "Slika mora imati jedan od sledećih formata: .jpg, .jpeg, .bmp, .png", "error");
        }
        else {
          swal("Error!", "Picture should be in one of following formates: .jpg, .jpeg, .bmp, .png", "error");
        }
      }
    }

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }



  msgs: any[];
  uploadedFiles: any[] = [];

  private show;

  constructor(private service: LoginService) {

    if (localStorage.getItem("userType") == "Korisnik") {
      this.type = 1;
      this.URL = this.tmp + localStorage.getItem("key") + "-:-11";
    }
    else {
      var t = localStorage.getItem("paymentType");

      if (t == '1') {
        this.type = 2;
        this.URL = this.tmp + localStorage.getItem("key") + "-:-22";
      }
      else if (t == '2') {
        this.type = 3;
        this.URL = this.tmp + localStorage.getItem("key") + "-:-33";
      }
    }

    this.uploader = new FileUploader({ url: this.URL });
    this.uploader._onCompleteItem = () => {
      if (localStorage.getItem("lang") === "sr")
        swal("Uspešno!", "Uplatnica je poslata na pregled administratoru", "success");
      else
        swal("Successfully", "Deposit slip has been sent for review to administrator", "success");
      this.close();
    }
  }

  private paidButtonPath: String = AppConfig.Path + "/images/paidButton_" + localStorage.getItem("lang") + ".png";

  submitPaid(form) {
    form.submit();
    this.close();
    if (localStorage.getItem("lang") == "sr")
      swal("Obaveštenje", "Elektronsko plaćanje se mora obraditi, bićete obavešteni o prihvatanju uplate preko mejla", "success");
    else
      swal("Notification", "Online payment need to be processed, you will be notified when payment is accepted via e-mail", "success");

  }

  private online: boolean = false;
  private message;

  change() {
    this.online = !this.online;

    if (this.online) {
      if (localStorage.getItem("lang") == "sr")
        this.message = "Uplatnica";
      else this.message = "Deposit slip";
    }
    else {
      if (localStorage.getItem("lang") == "sr")
        this.message = "Elektronsko plaćanje";
      else this.message = "Online"
    }
  }

  setChange(sel) {
    var t = this;

    var num = Number.parseInt(sel.value.split(" - ")[1]);

    this.URL = this.tmp + localStorage.getItem("key") + "-:-" + this.type + "" + num;

    this.uploader = new FileUploader({ url: this.URL });
    this.uploader._onCompleteItem = function () {
      if (localStorage.getItem("lang") === "sr")
        swal("Uspešno!", "Uplatnica je poslata na pregled administratoru", "success");
      else
        swal("Successfully", "Deposit slip has been sent for review to administrator", "success");
      t.close();
    }

  }

  setContent() {
    var t = this;

    this.uploader = new FileUploader({ url: this.URL });
    this.uploader._onCompleteItem = function () {
      if (localStorage.getItem("lang") === "sr")
        swal("Uspešno!", "Uplatnica je poslata na pregled administratoru", "success");
      else
        swal("Successfully", "Deposit slip has been sent for review to administrator", "success");
      t.close();
    }

    if (localStorage.getItem("lang") == "sr")
      this.message = "Elektronsko plaćanje";
    else this.message = "Online"
  }

  saveChanges() {

  }

  upload() {
    if (this.uploader.queue.length != 0)
      this.uploader.queue[0].upload();
  }

  setCallback(callback: any) {
    this.callback = callback;
  }

  setClose(callback: any) {
    this.close = callback;
  }
  closeWin() {
    this.close();
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
}
