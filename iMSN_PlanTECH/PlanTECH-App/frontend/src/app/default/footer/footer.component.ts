import { Component, AfterViewInit } from '@angular/core';
import { AppConfig } from "app/appConfig";
import { FooterService } from './footer.service';
import { Validation } from '../../shared/Validation';

declare var swal:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [FooterService]
})
export class FooterComponent{
  
  constructor(private service: FooterService) { 
    this.center = "44.012513, 20.907813";
    this.coord.push([44.012513, 20.907813]);
  }

  private center:string = "";
  private coord:any[] = [];
  private text:string = "";
  private email:string = "";

  sendMail()
  {
     if (Validation.validate(["email"])) {
        this.service.sendMail(this.text,this.email).subscribe(res=>{
          this.text = "";
          this.email = "";

          if(localStorage.getItem("lang")=="sr") swal("Upešno","poslat mejl!","success");
          else swal("Successfully","sent mail!","success");
        });
     }
  }
}
