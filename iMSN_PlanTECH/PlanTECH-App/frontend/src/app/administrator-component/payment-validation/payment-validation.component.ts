import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, Inject, forwardRef } from '@angular/core';
import { PaymentValidationService } from './payment-validation.service';
import { ValidationAccount } from '../../shared/ValidationAccount';
import { PopupWindowComponent } from '../../shared/popup-window/popup-window.component';
import { ImageZoomComponent } from './image-zoom/image-zoom.component';
import { AppConfig } from "app/appConfig";
import { AdministratorComponent } from '../administrator-component.component';
import { CornyService } from "app/shared/corny/corny.service";

declare var swal: any;

@Component({
  selector: 'app-payment-validation',
  providers: [PaymentValidationService],
  templateUrl: './payment-validation.component.html',
  styleUrls: ['./payment-validation.component.css']
})
export class PaymentValidationComponent implements OnInit {

  public accounts: ValidationAccount[] = [];

  constructor(private service: PaymentValidationService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef, @Inject(forwardRef(() => AdministratorComponent)) private parent: AdministratorComponent) { }

  ngOnInit() {
    this.getAllForValidation();
  }

  getAllForValidation() {
    this.service.getForValidation().subscribe(json => {
      if (json.data != null) {
        var arr = JSON.parse(json.data);

        if (arr.length == 0 && CornyService.show) {
          arr.push({
            type: 1,
            Fname: "Petar",
            Lname: "Petrović",
            URL: AppConfig.Path + "/images/fakeUplatnica.png",
            ID: 1,
            Username: 'pera1235',
            Phone: '064/123-15-15',
            email: 'pera1235@hotmail.com',
            PaymentType: 1
          });
        }

        arr.filter(element => {
          if (AppConfig.Path == "") element.URL = "." + element.URL;
          else element.URL = AppConfig.Path + element.URL;


          if (localStorage.getItem("lang") === "sr") {
            switch (element.PaymentType) {
              case 1:
                element.type = "Osnovni paket";
                break;
              case 2:
                element.type = "Srebrni paket";
                break;
              case 3:
                element.type = "Zlatni paket";
                break;
              default:
                var tmp = "" + (element.PaymentType - 10 < 10 ? "0" + (element.PaymentType - 10) : element.PaymentType - 10);
                element.type = tmp[0] + " - " + tmp[1];
                break;
            }
          }
          else {

            switch (element.PaymentType) {
              case 1:
                element.type = "Basic package";
                break;
              case 2:
                element.type = "Silver package";
                break;
              case 3:
                element.type = "Gold package";
                break;
              default:
                var tmp = "" + (element.PaymentType - 10 < 10 ? "0" + (element.PaymentType - 10) : element.PaymentType - 10);
                element.type = tmp[0] + " - " + tmp[1];
                break;
            }
          }

          this.accounts.push(new ValidationAccount(element.Fname + ' ' + element.Lname, element.URL, element.ID, element.Username, element.Phone, element.email, element.type));
        });
      }
    });
  }

  acceptAccount(ID) {
    this.service.sendResponse(ID.toString(), true).subscribe(data => {
      this.accounts = this.accounts.filter(el => el.ID != data.ID);
      if (localStorage.getItem("lang") === "sr") {
        swal("Odobreno!", "Uspešno ste odobrili zahtev!", "success");
      }
      else {
        swal("Approved!", "Successfully approved request!", "success");
      }
      this.parent.refreshUser();
    });
  }

  delete(ID) {
    this.service.sendResponse(ID.toString(), false).subscribe(data => {
      this.accounts = this.accounts.filter(el => el.ID != data.ID);
      //swal("Uspesno ste odbili zahtev!", "Kliknite na dugme da zatvorite!", "success");
      this.parent.refreshUser();
    });
  }

  refuseAccount(ID) {
    let thisRef: any = this;
    if (localStorage.getItem("lang") === "sr") {
      swal({
        title: "Da li ste sigurni?",
        text: "Necete biti u mogućnosti da opozovete odbijanje!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Da, odbi!",
        cancelButtonText: "Ne, odustani!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            thisRef.delete(ID);
            swal("Uspešno!", "Uspešno ste odbili zahtev!", "success");
          }
          else {
            swal("Otkazano", "Zahtev nije odbijen", "error");
          }
        });
    }
    else {
      swal({
        title: "Are you sure?",
        text: "You will not be able to cancel the reject!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, reject!",
        cancelButtonText: "No, cancel!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            thisRef.delete(ID);
            swal("Rejected!", "You have successfully rejected the request!", "success");
          }
          else {
            swal("Cancelled", "Request is not rejected", "error");
          }
        });
    }
  }


  zoomPicture(imgUrl: string) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);

    ref.instance.setReference(ref);
    ref.instance.setTitle(localStorage.getItem("lang") === "sr" ? 'Uplatnica' : 'Depisit slip');
    ref.instance.addContent(ImageZoomComponent);
    ref.instance.setContent({ url: imgUrl });
    ref.changeDetectorRef.detectChanges();
  }
}
