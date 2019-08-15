import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, Input, Inject, forwardRef } from '@angular/core';
import { PermissionsService } from './permissions.service';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { PopupWindowComponent } from '../../shared/popup-window/popup-window.component';
import { RegisterUserComponent } from "../register-user/register-user.component";
import { CornyService } from '../../shared/corny/corny.service';

declare var swal: any;

@Component({
  selector: 'app-edit-permissions',
  providers: [PermissionsService],
  templateUrl: './edit-permissions.component.html',
  styleUrls: ['./edit-permissions.component.css']
})
export class EditPermissionsComponent implements OnInit {

  constructor(private service: PermissionsService, private componentFactoryResolver: ComponentFactoryResolver, @Inject(forwardRef(() => RegisterUserComponent)) private parent: RegisterUserComponent) { }

  @Input() parentViewContainerRef: ViewContainerRef;

  private users: any[] = [];
  private filtered: any[] = [];

  private data: Array<any> = [];
  private msg = ' ';
  private filterValue: string = '';

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.service.getAllPermissions().subscribe(data => {
      if (data.perms != null && data.perms.length != 0) {
        this.data = data.perms;
        var count = 0;

        data.perms.forEach(el => {
          var temp = this.users.find(t => {

            return t.accID == el.accID
          });

          if (temp != null) {
            temp.View = temp.View || el.View;
            temp.Edit = temp.Edit || el.Edit;
            temp.Rules = temp.Rules || el.Rules;
          }
          else this.users.push(el);

          count++;
          if (count == data.perms.length) {
            this.users.sort(this.order);
            this.msg = null;
          }

          this.filter();
        });
      }
      else if (CornyService.show) {
        this.users.push({
          Edit: 0,
          Fname: 'Petar',
          ID: 1,
          Lname: 'Petrović',
          Rules: 1,
          Username: 'pera1235',
          View: 1,
          accID: 1,
          email: 'pera1235@hotmail.com'
        });

        this.filter();
      }
      else {
        if (localStorage.getItem("lang") === "sr")
          this.msg = 'Nemate radnike!';
        else
          this.msg = 'You do not have workers!';
      }
    });
  }

  filter() {
    var tmp = [];
    tmp = this.users.filter(u => {
      return u.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1 || u.Username.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1 || (u.Fname.toLowerCase() + " " + u.Lname.toLowerCase()).indexOf(this.filterValue.toLowerCase()) != -1;
    });

    this.filtered = tmp;
  }

  refreshWorkers() {
    this.service.getAllPermissions().subscribe(data => {
      if (data.perms != null) {
        this.data = data.perms;
        var count = 0;

        data.perms.forEach(el => {
          var temp = this.users.find(t => {

            return t.accID == el.accID
          });

          if (temp != null) {
            temp.View = temp.View || el.View;
            temp.Edit = temp.Edit || el.Edit;
            temp.Rules = temp.Rules || el.Rules;
          }
          else this.users.push(el);

          count++;
          if (count == data.perms.length) {
            this.users.sort(this.order);
            this.msg = null;
          }

          this.filter();
        });
      }
      else this.msg = localStorage.getItem("lang") == "sr" ? 'Nemate radnike!' : 'You have no workers!';
    });
  }


  delete(ID: number): boolean {

    let user = this.data.find(el => el.accID == ID);

    this.users = this.users.filter(el => el.accID != ID);
    this.users.sort(this.order);
    this.filter();
    this.service.deletePermissions(user.accID).subscribe();
    this.parent.delete();

    if (this.users.length == 0)
      if (localStorage.getItem("lang") === "sr") this.msg = 'Nemate radnike!';
      else this.msg = "You don't have any workers!";

    return true;
  }

  deleteAsk(ID) {
    let thisRef: any = this;
    if (localStorage.getItem("lang") === "sr") {
      swal({
        title: "Da li ste sigurni?",
        text: "Necete biti u mogucnosti da opozovete brisanje!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Da, izbrisi!",
        cancelButtonText: "Ne, odustani!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            thisRef.delete(ID);
            swal("Radnik izbrisan!", "Radnik uspesno izbrisan.", "success");
          }
          else {
            swal("Otkazano", "Radnik nije izbrisan", "error");
          }
        });
    }
    else {
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
        function (isConfirm) {
          if (isConfirm) {
            thisRef.delete(ID);
            swal("Deleted!", "Worker successfully deleted", "success");
          }
          else {
            swal("Cancelled", "Worker is not deleted", "error");
          }
        });
    }

  }

  show(ID) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.parentViewContainerRef.createComponent(factory);

    ref.instance.setReference(ref);
    ref.instance.addContent(PermissionFormComponent);
    ref.instance.setTitle(localStorage.getItem("lang") === "sr" ? 'Dozvole' : 'Permissions');
    ref.instance.setContent(ID);
    ref.instance.setCallback(this.refresh.bind(this));
    ref.changeDetectorRef.detectChanges();

    if (this.users.length == 0)
      if (localStorage.getItem("lang") === "sr") this.msg = 'Nemate radnike!';
      else this.msg = "You don't have any workers!";
  }

  refresh(user) {
    //swal("Uspesno odradjeno!", "You clicked the button!", "uspesno");
    var temp = Object.assign({}, user[0]);
    var count = 0;
    this.data = this.data.filter(el => el.accID != temp.accID);

    user.forEach(el => {
      this.data.push(el);

      temp.Edit = temp.Edit || el.Edit;
      temp.View = temp.View || el.View;
      temp.Rules = temp.Rules || el.Rules;

      count++;
      if (count == user.length) {

        this.users = this.users.filter(el => el.accID != temp.accID);
        this.users.push(temp);

        this.users.sort(this.order);

        this.filter();
      }
    });
  }

  order(a, b) {
    if ((a.Fname + " " + a.Lname) < (b.Fname + " " + b.Lname)) return -1;
    else if ((a.Fname + " " + a.Lname) > (b.Fname + " " + b.Lname)) return 1;
    else return 0;
  }
}
