import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, AfterContentInit, OnDestroy } from '@angular/core';
import { User } from '../../shared/User';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { PopupWindowComponent } from '../../shared/popup-window/popup-window.component';
import { UploadComponent } from "app/default/login/upload/upload.component";
import { RegisteredComponent } from './registered/registered.component';
import { ForgottenPassComponent } from './forgotten-pass/forgotten-pass.component';
import * as $ from 'jquery';
import { AppConfig } from "app/appConfig";
import { Validation } from "app/shared/Validation";

declare var swal: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterContentInit, OnDestroy {

  private user: User = new User();
  private username: string;
  private password: string;
  private password2: string;
  private type: string = "password";
  private type1: string = "password";
  private type2: string = "password";
  private show: boolean = false;
  private show1: boolean = false;
  private valid: boolean = true;
  private error: string = "";
  private error1: string = "";
  private status: boolean = true;
  private paid: boolean = false;
  private online: boolean = false;
  private paidButtonPath: string = AppConfig.Path + "/images/paidButton_" + localStorage.getItem("lang") + ".png";
  private paidParams: string = "";

  private height;
  private width;
  private sizeCheckInterval;


  setLanguage(lang) {
    this.paidButtonPath = AppConfig.Path + "/images/paidButton_" + lang + ".png";

    $("#regButton").attr("src", this.paidButtonPath);
  }

  ngOnDestroy() {
    clearInterval(this.sizeCheckInterval);
  }

  ngAfterContentInit() {
    //this.message();

    let element = document.getElementById("bGround");
    this.height = element.offsetHeight
    this.width = element.offsetWidth;

    this.sizeCheckInterval = setInterval(() => {
      let h = element.offsetHeight;
      let w = element.offsetWidth;
      if ((h !== this.height) || (w !== this.width)) {
        this.height = h;
        this.width = w;

        $("#over").height(h + "px");
      }
    }, 100);
  }

  setPaid(flag) {
    this.paid = flag;
    if (!flag) this.online = false;

    this.setTopBar();
  }

  setOnline(flag) {
    this.online = flag;

    this.setTopBar();
  }

  constructor(private service: LoginService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
  }

  login(form: any) {
    if (Validation.validate(["userVal", "passVal"])) {
      this.service.postlogin(this.username, this.password).subscribe(
        (data: any) => {
          if (data.status) {
            if (data.date) {
              localStorage.setItem("key", data.token);
              localStorage.setItem("userType", data.type_of_user);
              localStorage.setItem("username", this.username);
              this.router.navigate(['../' + data.type_of_user]);
            }
            else {
              this.uploadFile(true);
            }
            this.error1 = "";
          }
          else {
            if (data.registered) {

              this.uploadFile(false);

            }
            else {
              if (localStorage.getItem("lang") === "sr")
                Validation.newMessage("userVal", "Netačna kombinacija korisničkog <br> imena i lozinke")
              else
                Validation.newMessage("userVal", "Incorrect combination of <br> user name and password")
            }
          }

        });
    }
  }

  changeSelect(select) {
    if (select.value == '-1') {
      this.setPaid(false);
      return;
    }

    this.setPaid(true);
    if (select.value.indexOf("Osnovni") != -1) this.user.PaymentType = 1;
    else if (select.value.indexOf("Srebrni") != -1) this.user.PaymentType = 2;
    else this.user.PaymentType = 3;

  }

  uploadFile(flag) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.setReference(ref);
    ref.instance.setTitle(localStorage.getItem("lang") === "sr" ? 'Pošalji uplatnicu' : 'Send deposit slip');
    ref.instance.addContent(UploadComponent);
    ref.instance.setContent({ username: this.username, status: flag });
    ref.changeDetectorRef.detectChanges();
  }

  registration(form: any) {
    if (Validation.validate(["fname", "lname", "name", "siff", "Email", "Phone"])) {
      if (Validation.validate(["password2"])) {
        if (this.user.phone == undefined)
          this.user.phone = "";
        if (this.paid && !this.online && this.user.PaymentType == undefined) this.user.PaymentType = 1;
        this.service.postRegistration(this.user, this.paid).subscribe(
          (data: any) => {
            if (data.status == "true") {
              Validation.clearOnValid();
              this.user = new User();
              this.change(true);
              this.password2 = '';
              $("#select").val(-1);
              this.message();
            }
            else if (data.status == "username") {
              if (localStorage.getItem("lang") === "sr")
                Validation.newMessage("name", "Takvo korisničko ime već postoji!");
              else
                Validation.newMessage("name", "This username already exists!");
            } else {
              if (localStorage.getItem("lang") === "sr")
                Validation.newMessage("Email", "Takav E-mail već postoji!");
              else
                Validation.newMessage("Email", "That E-mail already exists!");
            }
          });
      }
    }
  }
  message() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.setReference(ref);
    if (localStorage.getItem("lang") === "sr")
      ref.instance.setTitle('Registracija');
    else
      ref.instance.setTitle('Registration');
    ref.instance.addContent(RegisteredComponent);
    ref.instance.setContent({ paid: this.paid, online: this.online });
    ref.changeDetectorRef.detectChanges();
  }
  forgotenPass() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.setReference(ref);
    if (localStorage.getItem("lang") === "sr")
      ref.instance.setTitle('Zaboravljena lozinka');
    else
      ref.instance.setTitle('Forgot your password');
    ref.instance.addContent(ForgottenPassComponent);

    ref.changeDetectorRef.detectChanges();
  }

  submitPaid(form: any) {
    this.service.checkExistance(this.user.username).subscribe(data => {
      if (data.status) {
        if (Validation.validate(["fname", "lname", "name", "siff", "Email", "Phone"])) {
          if (Validation.validate(["password2"])) {
            if (this.user.phone == undefined)
              this.user.phone = "";

            this.paidParams = this.user.email + "-:-" + this.user.fname + "-:-" + this.user.lname + "-:-" + this.user.password + "-:-" + this.user.phone + "-:-" + this.user.username;
            form.submit();

            this.user = new User();
            this.online = false;
            this.paid = false;
            this.password2 = '';
            $("#select").val(-1);
            this.change(true);

            if (localStorage.getItem("lang") == "sr")
              swal("Obaveštenje", "Elektronsko plaćanje se mora obraditi, bićete obavešteni o prihvatanju uplate preko mejla", "success");
            else
              swal("Notification", "Online payment need to be processed, you will be notified when payment is accepted via e-mail", "success");
          }
        }
      }
      else {
        if (localStorage.getItem("lang") === "sr")
          Validation.newMessage("name", "Takvo korisničko ime već postoji!");
        else
          Validation.newMessage("name", "This username already exists!");
      }
    });


  }

  mouseup(id) {
    if (id == 1)
      this.type1 = "password";
    else if (id == 2)
      this.type2 = "password";
    else
      this.type = "password";

  }
  mousedown(id) {
    if (id == 1)
      this.type1 = "text";
    else if (id == 2)
      this.type2 = "text";
    else
      this.type = "text";
  }

  change(flag) {
    if (this.status != flag) {
      this.status = flag;

      $(".li").toggleClass("active");
      $(".myDIV").toggleClass("border");
      $("#notActive").toggleClass("notActive");
    }

    this.setTopBar();
  }

  setTopBar() {
    try {
      setTimeout(() => {
        var scrollPosition = $("body").scrollTop();
        var go = $('#go-top');
        var visible = $(document).height() - $('footer').height() - scrollPosition - $(window).height() - 35;

        if (visible < 0) {
          go.css({
            bottom: -visible
          });
        } else {
          go.css({
            bottom: 0
          });
        }


      }, 50);
    }
    catch (err) { }
  }


}
