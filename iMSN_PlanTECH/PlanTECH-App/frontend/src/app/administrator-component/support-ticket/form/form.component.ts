import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface'
import { SupportTicketService } from '../support-ticket.service';
import { MyDate } from "app/shared/MyDate";
import { Validation } from "app/shared/Validation";

declare var swal: any;

@Component({
  selector: 'app-form',
  providers: [SupportTicketService],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, PopupInteface {

  private ID: string = '';
  private myDate: string = '';
  private fullName: string = '';
  private text: string = '';
  private message: string = '';
  private callback: any;
  private close: any;

  constructor(private service: SupportTicketService) { }

  ngOnInit() {

  }

  setCallback(callback) {
    this.callback = callback;
  }

  setContent(data) {
    var temp = JSON.parse(data);
    this.ID = temp.ID;
    this.myDate = localStorage.getItem("lang") === "sr" ? new MyDate(temp.date).toDateString() : new Date(temp.date).toDateString();

    this.fullName = temp.fullName;
    this.text = temp.text;
  }

  setClose(callback) {
    this.close = callback;
  }

  sendEmail() {
    if (this.message!=undefined && this.message.trim().length!=0 && this.message.length<500) {
      this.service.sendMessage(this.ID, this.message).subscribe(data => {
        if (this.callback) {
          this.callback(this.ID);
          if (localStorage.getItem("lang") === "sr") {
            swal("Poslato!", "Poruka uspešno poslata!", "success");
          }
          else {
            swal("Sent!", "Message sent successfully!", "success");
          }
          this.close();
        }
      });
    }
    else {
      Validation.newMessage("msg",localStorage.getItem("lang")=="sr"?"Uneti sadržaj od maksimalno <br> 500 karaktera":"Enter content with maximum <br> 500 characters length");
    }
  }

}
