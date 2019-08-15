import { Component, OnInit, ViewContainerRef , ComponentFactoryResolver,  Inject , forwardRef } from '@angular/core';
import { SupportTickets } from '../../shared/SupportTickets';
import { SupportTicketService } from './support-ticket.service';
import { PopupWindowComponent }  from '../../shared/popup-window/popup-window.component';
import { FormComponent } from './form/form.component';
import { AdministratorComponent } from '../administrator-component.component';
import { CornyService } from "app/shared/corny/corny.service";
import { MyDate } from "app/shared/MyDate";

declare var swal:any;

@Component({
  selector: 'app-support-ticket',
  providers: [ SupportTicketService ] ,
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.css']
})
export class SupportTicketComponent implements OnInit {

  public tickets:SupportTickets[] = [];

  constructor( private service: SupportTicketService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef,@Inject(forwardRef(() => AdministratorComponent)) private parent:  AdministratorComponent) { }

  ngOnInit() {
    this.service.getTickets().subscribe(data => {
      if(data.arr!=null)
      {
        var arr = JSON.parse(data.arr);

        if(arr.length==0 && CornyService.show){
          arr.push({
            fullName: 'Petar Petrović',
            ID: 1,
            date: Date.now(),
            text: 'Pozrav, da li možete da mi pomognete da promenim šifru?'
          });
        }

        arr.filter( element =>
        {
          this.tickets.push(new SupportTickets(element.fullName,element.ID,element.date,element.text));
        });
      }
    });
  }

  open(ID)
  {
    let ticket = this.tickets.find( element => element.ID==ID);
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);

    ref.instance.setReference(ref);
    ref.instance.setTitle("#"+ticket.ID);
    ref.instance.addContent(FormComponent);
    ref.instance.setContent(JSON.stringify(ticket));
    ref.instance.setCallback(this.refresh.bind(this));
    ref.changeDetectorRef.detectChanges();
  }
  delete(id:number):boolean
  {
    this.service.deleteMessage(id).subscribe();
    //this.refresh(id);
    return true
  }

deleteAs(ID)
  {
    let thisRef:any = this;
    if(localStorage.getItem("lang")==="sr")
    {
        swal({
          title: "Da li ste sigurni?",
          text: "Nećete biti u mogućnosti da opozovete brisanje!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Da, izbriši!",
          cancelButtonText: "Ne, odustani!",
          closeOnConfirm: false,
          closeOnCancel: false
          },
          function(isConfirm)
          {
            if (isConfirm) 
            {
                thisRef.delete(ID);
                thisRef.refresh(ID);
                swal("Izbrisan!", "Poruka izbrisana uspešno.", "success");
            } 
            else {
              swal("Otkazano", "Poruka nije izbrisana", "error");
            }
          });
    }
    else
    {
      swal({
          title: "Are you sure?",
          text: "You will not be able to cancel the deletion!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          closeOnConfirm: false,
          closeOnCancel: false
          },
          function(isConfirm)
          {
            if (isConfirm) 
            {
                thisRef.delete(ID);
                thisRef.refresh(ID);
                swal("Deleted!", "Message deleted successfully.", "success");
            } 
            else {
              swal("Cancelled", "The message was not deleted", "error");
            }
          });
    }
  }

  refresh(ID)
  {
    this.tickets = this.tickets.filter(el => el.ID!=ID);
    this.parent.refresh();
  }
}
