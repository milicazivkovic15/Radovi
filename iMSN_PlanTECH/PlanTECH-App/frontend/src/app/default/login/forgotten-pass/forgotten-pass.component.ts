import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';
import { LoginService } from '../login.service';
import { Validation } from '../../../shared/Validation';

declare var swal:any;

@Component({
  selector: 'app-forgotten-pass',
  templateUrl: './forgotten-pass.component.html',
  styleUrls: ['./forgotten-pass.component.css']
})
export class ForgottenPassComponent implements PopupInteface  {
  private close;
  private callback;
  private username="";
  private title:string;
  private error:string;

  constructor(private service:LoginService) { }

  setContent(flag: any) {
    
  }
  saveChanges()
  {
    
  this.service.sendMessage(this.username).subscribe(data=>{
    if (data.status){
      if(localStorage.getItem("lang")==="sr")
      {
          swal("Promenjeno","Nova lozinka je poslata na Vas e-mail. Proverite e-mail.","success"); 
      }
      else
      {
          swal("Changed","New password is sent to your e-mail. Check e-mail","success");
      }
      
    }
    else
    {
      if(localStorage.getItem("lang")==="sr")
      {
          Validation.newMessage("user","Uneto korisnocko ime ne postoji"); 
      }
      else
      {
          Validation.newMessage("user","Enter username does not exist");
      }
    }
            
  });
  
        
  }
  closeWin(){
      this.close();
  }
  setCallback(callback: any) {
    this.callback=callback;
  } 
  setClose(callback: any) {
    this.close=callback;  
  }
  
}
