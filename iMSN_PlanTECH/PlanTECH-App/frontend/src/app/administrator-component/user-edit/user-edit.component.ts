import { Component, OnInit, ViewContainerRef , ComponentFactoryResolver } from '@angular/core';
import { UserEditService } from './user-edit.service';
import { FormComponent } from './form/form.component';
import { PopupWindowComponent } from '../../shared/popup-window/popup-window.component';
import { User } from '../../shared/User';
import { MyDate } from "app/shared/MyDate";
import { CornyService } from "app/shared/corny/corny.service";

@Component({
  selector: 'app-user-edit',
  providers: [UserEditService],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {

  constructor(private service: UserEditService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef ) { }

  private users:any[] = [];
  private message:string = "";
  private ordered:any[] = [];
  private searchResult;
  private page = 1;
  private val = 1;
  ngOnInit() {
    this.getAll();
   
  }

  getAll()
  {
    this.service.getUsersForEdit().subscribe(data=>{
      if(data.data)
      {
        this.users = JSON.parse(data.data);

        if(this.users.length==0 && CornyService.show){
          this.users.push({
            Fname: "Petar",
            Lname: "Petrović",
            URL: "abc",
            ID: 1,
            Username: 'pera1235',
            Phone: '064/123-15-15',
            email: 'pera1235@hotmail.com',
            ActivationDate: Date.now()
          });
        }

        this.users.filter(el => { 
          el.ActivationDate=localStorage.getItem("lang")==="sr"?new MyDate(el.ActivationDate).toDateString():new Date(el.ActivationDate).toDateString();
          el.fullName = el.Fname + ' ' + el.Lname;
          this.ordered.push(Object.assign({},el));
        });
      }
    });
  }

  showForm(ID:string)
  {
    var user = this.ordered.find(el => el.ID == ID);
    if(user!=null)
    {
      this.message="";
      const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
      const ref = this.viewContainerRef.createComponent(factory);

      ref.instance.setReference(ref);
      ref.instance.setTitle(localStorage.getItem("lang")==="sr"?'Izmena podataka':'Edit user info');
      ref.instance.addContent(FormComponent);


      ref.instance.setContent(JSON.stringify(user));
      ref.instance.setCallback(this.refresh.bind(this));
      ref.changeDetectorRef.detectChanges();
    }
    else this.message="Nema rezultata!";
  }

  refresh(alteredUser)
  {
    this.searchResult = alteredUser;
    this.searchResult.fullName = this.searchResult.Fname + ' ' + this.searchResult.Lname;

    this.ordered=this.ordered.filter(el=>el.ID!=alteredUser.ID);
    this.ordered.push(alteredUser);

    this.users=this.users.filter(el=>el.ID!=alteredUser.ID);
    this.users.push(alteredUser);
    this.users.sort((a,b)=>{
      if ((a.Fname+' '+b.Fname)>(b.Fname+' '+b.Fname)) return -1;
      else if ((a.Fname+' '+b.Fname)<(b.Fname+' '+b.Fname)) return 1;
      else return 0;
    });

    this.sort(this.val);
  }

  sort(value)
  {
    this.val=value;

    switch(+value)
    {
      case 1:
        this.ordered.sort((a,b)=>{
          if ((a.Fname+' '+b.Fname)>(b.Fname+' '+b.Fname)) return -1;
          else if ((a.Fname+' '+b.Fname)<(b.Fname+' '+b.Fname)) return 1;
          else return 0;
        });
        break;
      case 2:
        this.ordered.sort((a,b)=>{
          if (a.Username<b.Username) return -1;
          else if (a.Username>b.Username) return 1;
          else return 0;
        });
        break;
      case 3:
        this.ordered.sort((a,b)=>{
          if (a.email<b.email) return -1;
          else if (a.email>b.email) return 1;
          else return 0;
        });
        break;
      case 4:
        this.ordered.sort((a,b)=>{
          if ((a.Fname+' '+b.Fname)<(b.Fname+' '+b.Fname)) return -1;
          else if ((a.Fname+' '+b.Fname)>(b.Fname+' '+b.Fname)) return 1;
          else return 0;
        });
        break;
      case 5:
        this.ordered.sort((a,b)=>{
          if (a.Username<b.Username) return 1;
          else if (a.Username>b.Username) return -1;
          else return 0;
        });
        break;
      case 6:
        this.ordered.sort((a,b)=>{
          if (a.email<b.email) return 1;
          else if (a.email>b.email) return -1;
          else return 0;
        });
        break;
    }
  }

  showList(data)
  {
    return data.Fname + ' ' + data.Lname + ' - ' + data.Username + '\n' + data.email;
  }

  showChange()
  {
    try
    {
      this.showForm(this.searchResult.ID);
    }
    catch(err){}
  }
}
