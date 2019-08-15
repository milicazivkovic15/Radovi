import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/User';
import { RegisterAgronomistService } from './register-agronomist.service';
import { AppConfig } from 'app/appConfig';
import { Validation } from 'app/shared/Validation';

declare var swal: any;

@Component({
  selector: 'app-register-agronomist',
  providers: [RegisterAgronomistService],
  templateUrl: './register-agronomist.component.html',
  styleUrls: ['./register-agronomist.component.css']
})
export class RegisterAgronomistComponent {
  private path = AppConfig.Path + "/images/slideshow/img8.jpg";
  private user: User = new User();
  private type: string = "password";
  private type1: string = "password";
  private show1: boolean = false;
  private accType: string = "Agronom";
  private userType: number = 2;

  change(el) {
    this.userType = el.value;
    this.userType == 2 ? this.accType = "Agronom" : this.accType = "Administrator";
  }

  constructor(private service: RegisterAgronomistService) { }

  registerAgro(form: any) {
    if (this.user.phone == undefined) this.user.phone = "";
    if (Validation.validate(["fname", "lname", "name", "siff", "Email", "Phone"])) {
      this.service.postRegistration(this.user, this.userType).subscribe(
        (data: any) => {
          if (data.status == "true") {
            if (localStorage.getItem("lang") === "sr") {
              swal("Dodat!", "Uspesno ste dodali " + (this.userType == 2 ? "agronoma!" : "administratora!"), "success");
            }
            else {
              swal("Added!", "You have successfully added " + (this.userType == 2 ? "agronomist!" : "administrator!"), "success");
            }

            this.user = new User();
          }
          else if (data.status == "username") {
            if (localStorage.getItem("lang") === "sr") {
              Validation.newMessage("name", "Takvo korisnicko ime vec postoji!");
            }
            else {
              Validation.newMessage("name", "This username already exists!");
            }
          }
          else {
            if (localStorage.getItem("lang") === "sr") {
              Validation.newMessage("Email", "Takav e-mail vec postoji!");
            }
            else {
              Validation.newMessage("Email", "That e-mail already exists!");
            }
          }
        });
    }
    else
      this.show1 = true;
  }
  mouseup(id) {
    if (id == 1)
      this.type1 = "password";
    else
      this.type = "password";

  }
  mousedown(id) {
    if (id == 1)
      this.type1 = "text";
    else
      this.type = "text";
  }

}
