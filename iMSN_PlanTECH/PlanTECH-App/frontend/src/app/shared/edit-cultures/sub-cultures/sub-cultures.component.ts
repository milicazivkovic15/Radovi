import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';
import { EditCulturesService } from '../edit-cultures.service';
import { Crops } from '../../../shared/Crops';
import { Validation } from '../../Validation';

declare var swal: any;

@Component({
  selector: 'app-sub-cultures',
  templateUrl: './sub-cultures.component.html',
  styleUrls: ['./sub-cultures.component.css']
})
export class SubCulturesComponent implements PopupInteface {
  private close;
  private callback;
  private crop: Crops;
  private title: string;
  private error: string;
  private error1: string;
  private sub: Crops[] = [];
  private userCrops: Crops[] = [];
  private freeUsersCrops: Crops[] = [];
  private ownerCrops: Crops[] = [];
  private subCrops: Crops[] = [];
  private subFiltered: Crops[] = [];
  private userCropsFiltered: Crops[] = [];
  private freeUsersCropsFiltered: Crops[] = [];
  private ownerCropsFiltered: Crops[] = [];
  private subCropsFiltered: Crops[] = [];
  private newSubCrop: string;
  private agr = false;
  private filterValue: string = "";

  filter() {
    this.subFiltered = this.sub.filter(el => el.Title.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1);
    this.userCropsFiltered = this.userCrops.filter(el => el.Title.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1);
    this.freeUsersCropsFiltered = this.freeUsersCrops.filter(el => el.Title.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1);
    this.ownerCropsFiltered = this.ownerCrops.filter(el => el.Title.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1);
    this.subCropsFiltered = this.subCrops.filter(el => el.Title.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1);
  }

  constructor(private service: EditCulturesService) { }

  setContent(c: Crops) {
    if (localStorage.getItem("userType") == "Agronom")
      this.agr = true;
    this.crop = new Crops(c.Title, c.ID);
    this.title = this.crop.Title;
    c.subCrops.forEach(element => {
      this.sub.push(element);
    });
    this.service.getSubCrops(c.ID).subscribe(data => {
      if (localStorage.getItem("userType") == "Agronom")
        this.sub = data.crops;
      else {
        this.subCrops = data.crops;
        this.userCrops = data.userCrops;
        this.ownerCrops = data.ownerCrops;
        this.freeUsersCrops = data.freeUsersCrops;
      }

      this.filter();
    });
  }

  edit(selectedID) {
    if (localStorage.getItem("userType") != "Agronom") {
      var tmp = this.userCropsFiltered.find(el => el.ID == selectedID);
      if (tmp) {
        tmp.edit = true;
        tmp.old = tmp.Title;
      }
      else {
        tmp = this.freeUsersCropsFiltered.find(el => el.ID == selectedID);
        if (tmp) {
          tmp.edit = true;
          tmp.old = tmp.Title;
        }
      }
    }
    else {
      var tmp = this.subFiltered.find(el => el.ID == selectedID);


      tmp.edit = true;
      tmp.old = tmp.Title;
    }
  }
  updateSubCrop(selectedID, selectedTitle) {
    if (selectedTitle == "" || selectedTitle == undefined) {
      if (localStorage.getItem("lang") === "sr")
        Validation.newMessage("newSubCrop", "Unesite naziv vrste kulture!");
      else
        Validation.newMessage("newSubCrop", "Enter the name of subculture!");
    }
    else {

      if (localStorage.getItem("userType") != "Agronom") {
        var tmp = this.userCropsFiltered.find(el => el.ID == selectedID);
        if (tmp) {
          tmp.edit = false;
          if (tmp.old == tmp.Title) return;
        }
        else {
          tmp = this.freeUsersCropsFiltered.find(el => el.ID == selectedID);
          if (tmp) {
            tmp.edit = false;
            if (tmp.old == tmp.Title) return;
          }
        }
      }
      else {
        var tmp = this.subFiltered.find(el => el.ID == selectedID);

        tmp.edit = false;
        if (tmp.old == tmp.Title) return;

      }


      this.service.updateSubCrop(this.crop.ID, selectedID, selectedTitle).subscribe(data => {
        if (data.status) {
          this.service.getSubCrops(this.crop.ID).subscribe(data => {
            if (localStorage.getItem("userType") == "Agronom") {
              this.sub = data.crops;
            }
            else {
              this.subCrops = data.crops;
              this.userCrops = data.userCrops;
              this.ownerCrops = data.ownerCrops;
              this.freeUsersCrops = data.freeUsersCrops;
              if (localStorage.getItem("lang") === "sr") {
                swal("Uspesno!", "Podaci uspešno izmenjeni!", "success");
              }
              else {
                swal("Successfully!", "Data successfully changed!", "success");
              }
            }
            this.filter();
          });
        }
        else {
          if (localStorage.getItem("lang") === "sr") {
            swal("Postoji!", "Takva podkultura vec postoji!", "error");
          }
          else {
            swal("Exists!", "Such subculture already exists!", "error");
          }
          if (localStorage.getItem("userType") != "Agronom") {

            var tmp = this.userCropsFiltered.find(el => el.ID == selectedID);
            if (tmp) {
              tmp.Title = tmp.old;
            }
            else {
              tmp = this.freeUsersCropsFiltered.find(el => el.ID == selectedID);
              if (tmp) {
                tmp.Title = tmp.old;
              }
            }
          }
          else {
            var tmp = this.subFiltered.find(el => el.ID == selectedID);

            tmp.Title = tmp.old;
          }
        }
      });
    }
  }
  delete(ID: number): any {
    this.service.deleteSubCrop(ID).subscribe(data => {
      if (data.status) {
        this.service.getSubCrops(this.crop.ID).subscribe(data => {
          if (localStorage.getItem("userType") == "Agronom") {
            this.sub = data.crops;
            return true;
          }
          else {
            this.subCrops = data.crops;
            this.userCrops = data.userCrops;
            this.ownerCrops = data.ownerCrops;
            this.freeUsersCrops = data.freeUsersCrops;
          }
          this.filter();
          return true;
        });
      }
      else {
        if (localStorage.getItem("lang") === "sr") {
          swal("Ne mozete obrisati!", "Podkultura je već posađena na nekoj plantaži, ne moze biti obrisana!", "error");
        }
        else {
          swal("You can not delete", "Subculture is already planted on a plantation, it can not be deleted!", "error");
        }
      }
    });
  }

  deleteSubCrop(ID) {
    let thisRef: any = this;
    if (localStorage.getItem("lang") === "sr") {
      swal({
        title: "Da li ste sigurni?",
        text: "Nećete biti u mogucnosti da opozovete brisanje!",
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
            swal("Izbrisana!", "Podkultura uspešno izbrisana.", "success");
            thisRef.closeForm();
          }
          else {
            swal("Otkazano", "Podkultura nije izbrisana", "error");
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
            swal("Deleted!", "Subculture successfully deleted!", "success");
            thisRef.closeForm();
          }
          else {
            swal("Cancelled", "Subculture is not deleted", "error");
          }
        });
    }

  }

  setCallback(callback: any) {
    this.callback = callback;
  }
  setClose(callback: any) {
    this.close = callback;
  }
  closeForm() {
    this.callback(this.crop);
    this.close();
  }
}
