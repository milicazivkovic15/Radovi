import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { RegisterUserService } from './register-user.service';
import { User } from '../../shared/User';
import { EditPermissionsComponent } from "app/owner-component/edit-permissions/edit-permissions.component";
import { CornyService } from '../../shared/corny/corny.service';
import { Validation } from '../../shared/Validation';

declare var swal:any;

@Component({
  selector: 'app-register-user',
  providers: [RegisterUserService],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  @ViewChild("workers") workers:EditPermissionsComponent;

  private user = new User();
  constructor(private service: RegisterUserService, private viewContainerRef:ViewContainerRef ) { }
  private success = "";
  private parcels:any[] = [];
  private edit;
  private view;
  private rules;
  private editMsg;
  private viewMsg;
  private rulesMsg;
  private count:number;
  private canAdd:boolean = false;
  
  check(type)
  {
    setTimeout(()=>{
      switch(type)
    {
      case 1:
        var v = 0;
        this.parcels.forEach(el=>{
          if(el.View) v++;
        });

        if(v==this.parcels.length)
        {
          this.view = false;
          this.viewMsg = "Ništa";
        }
        else if(v==0)
        {
          this.view = true;
          this.viewMsg = "Sve";
        }     
        break;
      case 2:
      var e = 0;
        this.parcels.forEach(el=>{
          if(el.Edit) e++;
        });

        if(e==this.parcels.length)
        {
          this.edit = false;
          this.editMsg = "Ništa";
        }
        else if(e==0)
        {
          this.edit = true;
          this.editMsg = "Sve";
        }      
        break;
      case 3:
      var r = 0;
        this.parcels.forEach(el=>{
          if(el.Rules) r++;
        });

        if(r==this.parcels.length)
        {
          this.rules = false;
          this.rulesMsg = "Ništa";
        }
        else if (r==0)
        {
          this.rules = true;
          this.rulesMsg = "Sve";
        }      
        break;
    }
    },50);
  }

  delete(){
    this.count--;
    this.checkButton();
  }

  change(type)
  {
    switch(type)
    {
      case 1:
        this.parcels.forEach(el=>{
          el.View=this.view;
        });
        this.view=!this.view;
        break;
      case 2:
        this.parcels.forEach(el=>{
          el.Edit=this.edit;
        });
        this.edit=!this.edit;
        break;
      case 3:
        this.parcels.forEach(el=>{
          el.Rules=this.rules;
        });
        this.rules=!this.rules;
        break;
    }

    if(localStorage.getItem("lang")==="sr")
    {
      this.view?this.viewMsg="Sve":this.viewMsg="Ništa";
      this.edit?this.editMsg="Sve":this.editMsg="Ništa";
      this.rules?this.rulesMsg="Sve":this.rulesMsg="Ništa";
    }
    else
    {
      this.view?this.viewMsg="All":this.viewMsg="Noting";
      this.edit?this.editMsg="All":this.editMsg="Noting";
      this.rules?this.rulesMsg="All":this.rulesMsg="Noting";
    }
  }

  checkButton()
  {
    var type = Number.parseInt(localStorage.getItem("paymentType"));

    if(type!=3)
    {
      if(type==1)
      {
        if(this.count<1) this.canAdd = true;
        else this.canAdd = false;
      }
      else 
      {
        if(this.count<5) this.canAdd = true;
        else this.canAdd = false;
      }
    }
  }

  ngOnInit(): void {
    var type = Number.parseInt(localStorage.getItem("paymentType"));

    if(type==3) this.canAdd = true;
    else
    {  
      this.service.getWorkersCount().subscribe(data=>{
        this.count = data.count;
        this.checkButton();
      });
    }

    this.service.getParcels().subscribe(res=>{
      this.parcels = res.data;
      if(this.parcels.length==0 && CornyService.show){
        this.parcels.push({
          Title:'Plantaža 1'
        });
        this.parcels.push({
          Title:'Plantaža 2'
        });
      }
      var e=0;
      var r=0;
      var v=0;
   if(localStorage.getItem("lang")==="sr")
    {   
      if(e==this.parcels.length)
      {
        this.edit = false;
        this.editMsg = "Ništa";
      }
      else
      {
        this.edit = true;
        this.editMsg = "Sve";
      }
      if(v==this.parcels.length)
      {
        this.view = false;
        this.viewMsg = "Ništa";
      }
      else
      {
        this.view = true;
        this.viewMsg = "Sve";
      }
      if(r==this.parcels.length)
      {
        this.rules = false;
        this.rulesMsg = "Ništa";
      }
      else
      {
        this.rules = true;
        this.rulesMsg = "Sve";
      }
    }
    else
    {
      if(e==this.parcels.length)
      {
        this.edit = false;
        this.editMsg = "Noting";
      }
      else
      {
        this.edit = true;
        this.editMsg = "All";
      }
      if(v==this.parcels.length)
      {
        this.view = false;
        this.viewMsg = "Noting";
      }
      else
      {
        this.view = true;
        this.viewMsg = "All";
      }
      if(r==this.parcels.length)
      {
        this.rules = false;
        this.rulesMsg = "Noting";
      }
      else
      {
        this.rules = true;
        this.rulesMsg = "All";
      }
    } 
    });
  }

  addWorker() {
    if(Validation.validate(["workerText"]))
    this.service.addWorker(this.user,this.parcels).subscribe(
    (data:any)=>
    {
       if(data.status && data.work)
       {
         if(localStorage.getItem("lang")==="sr")
         {
          swal("Uspesno!", "Radnik uspesno dodat!", "success");

          this.count++;
          this.checkButton();
          this.workers.refreshWorkers();

          this.parcels.forEach(el=>{
            el.Edit = el.Rules = el.View = false;
          });

            this.edit = true;
            this.editMsg = "Sve";
            this.view = true;
            this.viewMsg = "Sve";
            this.rules = true;
            this.rulesMsg = "Sve";
         }
         else
         {
            swal("Successfully!", "Worker successfully added!", "success");

            this.count++;
            this.checkButton();
            this.workers.refreshWorkers();

            this.parcels.forEach(el=>{
              el.Edit = el.Rules = el.View = false;
            });

              this.edit = true;
              this.editMsg = "All";
              this.view = true;
              this.viewMsg = "All";
              this.rules = true;
              this.rulesMsg = "All";
         }
       }

       if(data.status==false && data.work==false){
          if(localStorage.getItem("lang")==="sr")
         {
            swal("Ne postoji!", "Takav korisnik ne postoji!", "error");
         }
         else
            swal("Does not exist!", "This user does not exist!", "error");
       } 

       if(data.status==false && data.work){
         if(localStorage.getItem("lang")==="sr")
         {
            swal("Postoji!", "Korisnik vec dodat!", "error");
         }
         else
            swal("Exists!", "User already added!", "error");
       } 
    });
  }
}

