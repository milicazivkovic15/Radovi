import { Component, OnInit } from '@angular/core';
import { PopupInteface } from '../../../shared/popup-window/popup-inteface';
import { EditCulturesService } from '../edit-cultures.service';
import { Crops } from '../../../shared/Crops';
import { Validation } from '../../Validation';

declare var swal:any;

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements PopupInteface  {
  private close;
  private callback;
  private crop:Crops;
  private title:string;
  private backup:string;

  constructor(private service:EditCulturesService) { }

  setContent(c: Crops) {
  
    this.crop=new Crops(c.Title,c.ID);
    this.title=this.crop.Title;
    this.backup = this.crop.Title;
  }
  saveChanges()
  {
    if(this.backup == this.title) return;

    if(this.title=="" || this.title==undefined)
       Validation.newMessage("title","Unesite naziv kulture!");
    else{
    this.service.updateCrop(this.crop.ID,this.title).subscribe(data=>{
      if (data.status){
          this.callback(this.crop);
          if(localStorage.getItem("lang")==="sr")
              {
                swal("Uspesno!", "Podaci uspešno izmenjeni!", "success");
              }
              else
              {
                swal("Successfully!", "Data successfully changed!", "success");
              }
           this.close();
           
      }
      else{
        if(localStorage.getItem("lang")==="sr")
              {
                swal("Postoji!", "Takva kultura već postoji!", "error");
              }
              else
              {
                swal("Exists!", "Such culture already exists!", "error");
              }
      }

    });  
    }
        
  }
  setCallback(callback: any) {
    this.callback=callback;
  } 
  setClose(callback: any) {
    this.close=callback;  
  }
  
}
