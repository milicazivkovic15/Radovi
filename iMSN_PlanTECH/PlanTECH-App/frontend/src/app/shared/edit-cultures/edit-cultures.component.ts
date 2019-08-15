import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../default/login/login.service';
import { EditCulturesService } from './edit-cultures.service';
import { PopupWindowComponent } from '../../shared/popup-window/popup-window.component';
import { InsertComponent } from './insert/insert.component';
import { SubCulturesComponent } from './sub-cultures/sub-cultures.component';
import { YesNoDialogComponent } from '../../shared/popup-window/yes-no-dialog/yes-no-dialog.component';
import { Crops } from '../Crops';
import { Validation } from '../Validation';
import { CornyService } from "app/shared/corny/corny.service";
import * as $ from 'jquery';

declare var swal: any;

@Component({
  selector: 'app-edit-cultures',
  templateUrl: './edit-cultures.component.html',
  styleUrls: ['./edit-cultures.component.css']
})
export class EditCulturesComponent implements OnInit {

  private agr = false;
  private crops: Crops[] = [];
  private filtered: Crops[] = [];
  private newCrop: string;
  private podkulture: string;
  //private error: string;private error1: string;
  private selectedValue: number;
  private selected: number;
  private manuf: string;
  private manufacturer = [];

  private manufacturerFilter = [];
  private newSubCrop: string;
  constructor(private router: Router, private service: LoginService, private editService: EditCulturesService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {

  }

  ngOnInit() {
    if (localStorage.getItem("key") != null) {
      if (localStorage.getItem("userType") == "Agronom") {
        this.agr = true;

      }
      else if (localStorage.getItem("userType") == "Korisnik") {
        this.service.getPermissions().subscribe(data => {
          if (!data.edit && !CornyService.show)
            this.router.navigate(['/' + localStorage.getItem("userType") + '/plantaze']);
        });
      }
    }
    else {
      this.router.navigate(['../PlanTECH']);
    }
    this.selected = 1;
    this.refresh("");

  }
  add() {
    if (this.newCrop == "" || this.newCrop == undefined) {
      if (localStorage.getItem("lang") === "sr")
        Validation.newMessage("newCrop", "Unesite naziv kulture!");
      else
        Validation.newMessage("newCrop", "Enter the name of culture!");
    }
    else {
      this.editService.insertCrop(this.newCrop).subscribe(data => {
        if (localStorage.getItem("lang") === "sr") {
          if (!data.status) {
            swal("Postoji!", "Takva kultura već postoji!", "error");
          }
          else {
            this.refresh("");
            swal("Dodata!", "Kultura uspešno dodata!", "success");
          }
        }
        else {
          if (!data.status) {
            swal("Exists!", "Such culture already exists!", "error");
          }
          else {
            this.refresh("");
            swal("Added!", "Culture has been successfully added!", "success");
          }
        }
      });
    }
  }
  yes(res) {
    if (res == true) {
      this.editService.insertSubCrop(this.selected, this.newSubCrop, this.manuf).subscribe(data => {
        if (localStorage.getItem("lang") === "sr") {
          if (!data.status) {
            swal("Postoji!", "Takva podkultura već postoji!", "error");
          }
          else {
            this.refresh("");
          }
        }
        else {
          if (!data.status) {
            swal("Exists!", "Such subculture already exists!", "error");
          }
          else {
            this.refresh("");
          }
        }
      });
    }

  }

  ref(el) {
    $(el).focusout();
    $(el).focusin();
  }

  addNew(crop, manuf) {
    this.editService.addNew(crop, manuf, this.selected).subscribe(data => {
      if (data.status) {
        if (localStorage.getItem("lang") == "sr") swal("Uspešno!", "Uspešno dodata kombinacija podkulture i proizvođača", "success");
        else swal("Success!", "Successfully added new combination of subculture and manufacturer", "success");

        this.refresh("");
      }
      else {
        if (localStorage.getItem("lang") == "sr") swal("Greška!", "Ova kombinacija podkulture i proizvođača već postoji", "error");
        else swal("Error!", "This combination of subcrop and manufacturer already exists", "error");
      }
    });
  }

  addSub() {

    if (localStorage.getItem("lang") === "sr") {
      if (this.newSubCrop == "" || this.newSubCrop == undefined && !this.agr) {
        Validation.newMessage("subCrop", "Unesite naziv podkulture!");
        return;
      }

      if (localStorage.getItem("userType") == "Agronom") {
        Validation.clearOnValid();

        if (this.subcrops == "" || this.subscrops == undefined)
          Validation.newMessage("subcrops", "Unesi naziv podkulture!");
        else if (this.manuf == "" || this.manuf == undefined)
          Validation.newMessage("manuf", "Unesi naziv dobavljača!");
        else {

          var c = this.subscrops.find(el => el == this.subcrops);
          var m = this.manufacturer.find(el => el == this.manuf);
          var t = this;

          if (c == null && m == null) {
            swal({
              title: "Ovakva podkultura i dobavljač ne postoje, da li želite da ih dodate?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Da",
              cancelButtonText: "Odustani",
              closeOnConfirm: false
            },
              function (iss) {
                if (iss) {
                  t.addNew(t.subcrops, t.manuf);
                }
                else
                  t.refresh("");
              });
          }
          else if (c == null) {
            swal({
              title: "Ovakva podkultura ne postoji, da li želite da je dodate?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Da",
              cancelButtonText: "Odustani",
              closeOnConfirm: false
            },
              function (iss) {
                if (iss) {
                  t.addNew(t.subcrops, t.manuf);
                }
                else
                  t.refresh("");
              });
          }
          else if (m == null) {
            swal({
              title: "Ovakav dobavljač ne postoji, da li želite da ga dodate?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Da",
              cancelButtonText: "Odustani",
              closeOnConfirm: false
            },
              function (iss) {
                if (iss) {
                  t.addNew(t.subcrops, t.manuf);
                }
                else
                  t.refresh("");
              });
          }
          else {
            t.addNew(t.subcrops, t.manuf);
          }
        }
      }
      else {

        Validation.clearOnValid();
        this.editService.insertSubCrop(this.selected, this.newSubCrop, this.manuf).subscribe(data => {
          if (!data.status) {
            swal("Postoji!", "Takva podkultura već postoji!", "error");
          }
          else {
            swal("Dodata!", "Podkultura uspešno dodata!", "success");
            this.refresh("");
          }
        });
      }

    }
    else {
      if (this.newSubCrop == "" || this.newSubCrop == undefined && !this.agr) {
        Validation.newMessage("subCrop", "Enter the name of subculture!");
        return;
      }

      if (localStorage.getItem("userType") == "Agronom" && this.manufacturer.find(x => x == this.manuf) == undefined) {

        Validation.clearOnValid();

        if (this.subcrops == "" || this.subscrops == undefined)
          Validation.newMessage("subcrops", "Enter the name of the subculture!");
        else if (this.manuf == "" || this.manuf == undefined)
          Validation.newMessage("manuf", "Enter the name of the manufacturer!");
        else {

          var c = this.subscrops.find(el => el == this.subscrops);
          var m = this.manufacturer.find(el => el == this.manuf);

          var t = this;

          if (c == null && m == null) {
            swal({
              title: "Subculture and manufacturer does not exists, do you want to add them?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes",
              closeOnConfirm: false
            },
              function (iss) {
                if (iss) {
                  t.addNew(t.subcrops, t.manuf);
                }
                else
                  t.refresh("");
              });
          }
          else if (c == null) {
            swal({
              title: "Subculture does not exist, do you want to add it?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes",
              closeOnConfirm: false
            },
              function (iss) {
                if (iss) {
                  t.addNew(t.subcrops, t.manuf);
                }
                else
                  t.refresh("");
              });
          }
          else if (m == null) {
            swal({
              title: "Manufacturer does not exist, do you want to add it?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes",
              closeOnConfirm: false
            },
              function (iss) {
                if (iss) {
                  t.addNew(t.subcrops, t.manuf);
                }
                else
                  t.refresh("");
              });
          }
          else {
            t.addNew(t.subcrops, t.manuf);
          }
        }
      }
      else {

        Validation.clearOnValid();
        this.editService.insertSubCrop(this.selected, this.newSubCrop, this.manuf).subscribe(data => {
          if (!data.status) {
            swal("Exists!", "Such subculture already exists!", "error");
          }
          else {
            this.refresh("");
            swal("Added!", "Subculture has been successfully added!", "success");
          }
        });
      }

    }

  }

  delete(ID) {
    this.editService.deleteCrop(ID).subscribe(data => {
      if (data.status) {
        this.refresh("");
      }
      else {
        if (localStorage.getItem("lang") === "sr") {
          swal("Ne mozete obrisati!", "Kultura je već posađena na nekoj plantaži, ne može biti obrisana!", "error");
        }
        else {
          swal("You can not delete", "Culture is already planted on a plantation, it can not be deleted!", "error");
        }
      }
    });
  }

  deleteCrop(ID) {
    let thisRef: any = this;
    if (localStorage.getItem("lang") === "sr") {
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
        function (isConfirm) {
          if (isConfirm) {
            thisRef.delete(ID);
            swal("Izbrisana!", "Kultura uspešno izbrisana!", "success");
          }
          else {
            swal("Otkazano", "Kultura nije izbrisana", "error");
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
            swal("Deleted!", "Culture successfully deleted!", "success");
          }
          else {
            swal("Cancelled", "Culture is not deleted", "error");
          }
        });
    }
  }


  updateCrop(ID) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.setReference(ref);
    ref.instance.setTitle(localStorage.getItem("lang") === "sr" ? 'Izmena podataka' : 'Edit culture');
    ref.instance.addContent(InsertComponent);


    var crop = this.crops.find(c => c.ID == ID);
    ref.instance.setContent(crop);
    ref.instance.setCallback(this.refresh.bind(this));

    ref.changeDetectorRef.detectChanges();
  }

  refresh(alteredUser) {
    this.manuf = '';
    Validation.clearOnValid();
    this.editService.getCrops().subscribe(data => {
      this.crops = data.crops;
      this.filter("");
      this.crops.forEach(crop => {
        this.editService.getSubCrops(crop.ID).subscribe(data => {
          crop.subCrops = data.crops;
        });
      });
      if (this.crops.length > 0) this.changeSubscrops(this.crops[0].ID);
      else if (this.crops.length == 0 && CornyService.show) {
        this.crops.push({
          ID: 1,
          Title: 'Jabuka',
          edit: true,
          subCrops: [],
          old: ''
        });
        this.crops.push({
          ID: 2,
          Title: 'Kukuruz',
          edit: true,
          subCrops: [],
          old: ''
        });
        this.filter("");
      }


    });
    if (localStorage.getItem("userType") == "Agronom")

      this.editService.getManufacturer().subscribe(data => {
        if (data.manuf) {

          data.manuf.forEach(el => {
            if (this.manufacturer.find(e => e == el.Title) == null) this.manufacturer.push(el.Title);
          })
        }
        this.filterM("");
      });

  }

  private subscropsFilter;
  private subscrops;
  private subcrops;

  changeSubscrops(ID) {
    this.editService.getSubCrops(ID).subscribe(data => {
      this.subscrops = [];
      data.crops.forEach(el => { this.subscrops.push(el.Title); });
      this.filterNew('');
      this.subcrops = '';
    })
  }

  showListCrops(data) {
    return data;
  }

  filterNew(word) {
    this.subscropsFilter = this.subscrops.filter(el => el.toLowerCase().indexOf(word.toLowerCase()) != -1);
  }

  filter(data) {
    this.filtered = this.crops.filter(el => el.Title.toLowerCase().indexOf(data.toLowerCase()) != -1);
  }

  filterM(data) {
    this.manufacturerFilter = this.manufacturer.filter(el => el.toLowerCase().indexOf(data.toLowerCase()) != -1);
  }


  showList(data) {
    return data;
  }

  showSubCrop(ID) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.setReference(ref);
    if (localStorage.getItem("lang") === "sr") {
      ref.instance.setTitle('Izmena podataka podkultura');
    }
    else {
      ref.instance.setTitle('Change data subculture');
    }
    ref.instance.addContent(SubCulturesComponent);
    var crop = this.crops.find(c => c.ID == ID);
    ref.instance.setContent(crop);
    ref.instance.setCallback(this.refresh.bind(this));

    ref.changeDetectorRef.detectChanges();
  }


}
