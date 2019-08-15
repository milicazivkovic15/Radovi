import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';
import { PermissionsService } from '../permissions.service';

declare var swal: any;

@Component({
  selector: 'app-permission-form',
  providers: [PermissionsService],
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css']
})

export class PermissionFormComponent implements PopupInteface {

  constructor(private service: PermissionsService) { }

  private users: any[] = [];
  private close;
  private callback;
  private edit;
  private view;
  private rules;
  private editMsg;
  private viewMsg;
  private rulesMsg;
  private Lname = '';
  private Fname = '';
  private ID;
  change(type) {
    switch (type) {
      case 1:
        this.users.forEach(el => {
          el.View = this.view;
        });
        this.view = !this.view;
        break;
      case 2:
        this.users.forEach(el => {
          el.Edit = this.edit;
        });
        this.edit = !this.edit;
        break;
      case 3:
        this.users.forEach(el => {
          el.Rules = this.rules;
        });
        this.rules = !this.rules;
        break;
    }

    if (localStorage.getItem("lang") === "sr") {
      this.view ? this.viewMsg = "Sve" : this.viewMsg = "Ništa";
      this.edit ? this.editMsg = "Sve" : this.editMsg = "Ništa";
      this.rules ? this.rulesMsg = "Sve" : this.rulesMsg = "Ništa";
    }
    else {
      this.view ? this.viewMsg = "All" : this.viewMsg = "Noting";
      this.edit ? this.editMsg = "All" : this.editMsg = "Noting";
      this.rules ? this.rulesMsg = "All" : this.rulesMsg = "Noting";
    }
  }

  setContent(json: any) {
    var ID = json;

    this.service.getPermissionsOfWorker(ID).subscribe(data => {
      this.users = data;
      var e = 0;
      var r = 0;
      var v = 0;

      this.users.forEach(el => {
        if (el.Edit) e++;
        if (el.View) v++;
        if (el.Rules) r++;
      });

      if (localStorage.getItem("lang") === "sr") {
        if (e == this.users.length) {
          this.edit = false;
          this.editMsg = "Ništa";
        }
        else {
          this.edit = true;
          this.editMsg = "Sve";
        }
        if (v == this.users.length) {
          this.view = false;
          this.viewMsg = "Ništa";
        }
        else {
          this.view = true;
          this.viewMsg = "Sve";
        }
        if (r == this.users.length) {
          this.rules = false;
          this.rulesMsg = "Ništa";
        }
        else {
          this.rules = true;
          this.rulesMsg = "Sve";
        }
      }
      else {
        if (e == this.users.length) {
          this.edit = false;
          this.editMsg = "Noting";
        }
        else {
          this.edit = true;
          this.editMsg = "All";
        }
        if (v == this.users.length) {
          this.view = false;
          this.viewMsg = "Noting";
        }
        else {
          this.view = true;
          this.viewMsg = "All";
        }
        if (r == this.users.length) {
          this.rules = false;
          this.rulesMsg = "Noting";
        }
        else {
          this.rules = true;
          this.rulesMsg = "All";
        }
      }
    });
  }
  setCallback(callback: any) {
    this.callback = callback;
  }
  setClose(callback: any) {
    this.close = callback;
  }

  save() {
    this.service.savePermissions(this.users).subscribe();
    if (localStorage.getItem("lang") === "sr")
      swal("Sacuvano!", "Uspesno ste sacuvali izmene!", "success");
    else
      swal("Saved!", "You have successfully saved changes!", "success");

    this.close();
  }

  check(type) {
    setTimeout(() => {
      switch (type) {
        case 1:
          var v = 0;
          this.users.forEach(el => {
            if (el.View) v++;
          });

          if (v == this.users.length) {
            this.view = false;
            this.viewMsg = "Ništa";
          }
          else if (v == 0) {
            this.view = true;
            this.viewMsg = "Sve";
          }
          break;
        case 2:
          var e = 0;
          this.users.forEach(el => {
            if (el.Edit) e++;
          });

          if (e == this.users.length) {
            this.edit = false;
            this.editMsg = "Ništa";
          }
          else if (e == 0) {
            this.edit = true;
            this.editMsg = "Sve";
          }
          break;
        case 3:
          var r = 0;
          this.users.forEach(el => {
            if (el.Rules) r++;
          });

          if (r == this.users.length) {
            this.rules = false;
            this.rulesMsg = "Ništa";
          }
          else if (r == 0) {
            this.rules = true;
            this.rulesMsg = "Sve";
          }
          break;
      }
    }, 50);
  }
  delete() {
    this.service.deletePermissions(this.ID).subscribe();
    this.users = this.users.filter(el => {
      return el.accID != this.ID
    });


  }
}
