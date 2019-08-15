import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';
import { UserEditService } from '../user-edit.service';
import { Validation } from '../../../shared/Validation';

declare var swal: any;

@Component({
  selector: 'app-form',
  providers: [UserEditService],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements PopupInteface {

  private close;
  private callback;
  private user: any = {};
  private newPass: string = "";
  private pass2: string = "";
  private err: string = "";
  private err1: string = "";
  private changePass: boolean = false;
  private type1: string = "password";
  private type2: string = "password";


  constructor(private service: UserEditService) { }

  setContent(json: any) {
    this.user = JSON.parse(json);
  }

  formValidated() {
    return this.user.Fname != '' && this.user.Lname != '' && this.user.Username != '' && this.user.Password != '' && this.user.email != '';
  }


  setCallback(callback: any) {
    this.callback = callback;
  }

  setClose(callback: any) {
    this.close = callback;
  }

  clear() {
    if (this.user.Password = "********") this.user.Password = '';
  }


  mouseup(id) {
    if (id == 1)
      this.type1 = "password";
    else if (id == 2)
      this.type2 = "password";

  }
  mousedown(id) {
    if (id == 1)
      this.type1 = "text";
    else if (id == 2)
      this.type2 = "text";
  }
  saveChanges() {
    if (Validation.validate(["fname", "lname", "username", "Email", "phone"])) {

      this.service.saveChanges(this.user).subscribe(data => {
        if (data != '3' && data != 3) {
          if (data == '1' || data == 1) {
            if (localStorage.getItem("lang") === "sr") {
              Validation.newMessage("username", "Takvo korisničko ime već postoji!");
            }
            else {
              Validation.newMessage("username", "This username already exists!");
            }
          }
          else if (data == '2' || data == 2) {
            if (localStorage.getItem("lang") === "sr") {
              Validation.newMessage("Email", "Takav mejl već postoji!");
            }
            else {
              Validation.newMessage("Email", "This e-mail already exists!");
            }
          }
        }
        else {
          Validation.clearOnValid();
          this.callback(this.user);
          if (localStorage.getItem("lang") === "sr") {
            swal("Sacuvano!", "Uspešno ste saćuvali izmene!", "success");
          }
          else {
            swal("Saved!", "You have successfully saved changes!", "success");
          }
          this.close();
        }
      });
    }
  }
  flip(bool) {
    this.err = "";
    this.err1 = "";
    this.newPass = "";
    this.pass2 = "";

    if (this.changePass != bool) {
      this.changePass = bool;

      $(".li").toggleClass("active");
      $(".myDIV").toggleClass("border");
      $("#notActive").toggleClass("notActive");
    }
  }
  savePass() {
    if (Validation.validate(["siff"])) {

      if (this.newPass == this.pass2) {
        this.user.Password = this.newPass;
        this.service.saveChanges(this.user).subscribe(data => {
          this.callback(this.user);
          if (localStorage.getItem("lang") === "sr") {
            swal("Sacuvano!", "Uspešno ste promenili lozinku!", "success");
          }
          else {
            swal("Saved!", "You have successfully changed the password!", "success");
          }
          this.close();
        });
      }
      else {
        if (localStorage.getItem("lang") === "sr") {
          Validation.newMessage("siff2", "Ponovljena lozinka nije jednaka unetoj lozinci!")
        }
        else {
          Validation.newMessage("siff2", "Repeated password is not the same password inputed!")
        }
      }
    }
  }

}
