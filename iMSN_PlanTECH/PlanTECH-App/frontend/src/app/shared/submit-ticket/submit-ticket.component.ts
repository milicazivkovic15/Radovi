import { Component, OnInit } from '@angular/core';
import { SubmitTicketService } from './submit-ticket.service';
import { Validation } from '../Validation';

declare var swal:any;

@Component({
  selector: 'app-submit-ticket',
  providers: [ SubmitTicketService ] ,
  templateUrl: './submit-ticket.component.html',
  styleUrls: ['./submit-ticket.component.css']
})
export class SubmitTicketComponent implements OnInit {

  constructor( private service: SubmitTicketService) { }

  private date: string = "";
  private question: string = "";

  ngOnInit() {
  }


  addTicket()
  {
    if (this.question!=undefined && this.question.trim().length!=0 && this.question.length<500) {
      this.service.addSupportTicket(this.question,Date.now()).subscribe(() =>{
        if(localStorage.getItem("lang")==="sr")
        {
            swal("Poslato!", "Poruka uspešno poslata!", "success");
        }
        else
        {
          swal("Sent!", "Message sent successfully!", "success");
        }
          this.question = '';
      });
    }else {
      Validation.newMessage("ques",localStorage.getItem("lang")=="sr"?"Uneti sadržaj od maksimalno <br> 500 karaktera":"Enter content with maximum <br> 500 characters length");
    }
  }

}
