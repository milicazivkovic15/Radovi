import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { EditRulesService } from './edit-rules.service';
import { Rule, Selected } from '../Rule';
import { PopupWindowComponent } from '../popup-window/popup-window.component';
import { UpdateRuleComponent } from './update-rule/update-rule.component';
import { AddRuleComponent } from './add-rule/add-rule.component';
import { CornyService } from "app/shared/corny/corny.service";
import { LoginService } from "app/default/login/login.service";
import { Router } from "@angular/router";
import { AddRuleAgrComponent } from './add-rule-agr/add-rule-agr.component'
import { UpdateRuleAgrComponent } from './update-rule-agr/update-rule-agr.component';
import * as $ from 'jquery';

declare var swal: any;

@Component({
  selector: 'app-edit-rules',
  templateUrl: './edit-rules.component.html',
  providers: [EditRulesService],
  styleUrls: ['./edit-rules.component.css']
})

export class EditRulesComponent implements OnInit {

  private show = false;
  private what = 1;
  private search;
  private search1;
  private search2;
  private filterRules: Rule[] = [];
  public rules: Rule[] = [];
  public newRule: Rule;
  public notAgro: boolean;
  private uslov: Array<{ v1: string, v2: string }> = [{ v1: 'vlaznost zemljista', v2: '%' }, { v1: 'temperatura', v2: '°C' }, { v1: 'kolicina padavina', v2: 'mm/h' }, { v1: 'jacina vetrova', v2: 'km/h' }, { v1: 'vlaznost vazduha', v2: '%' }, { v1: '', v2: '' }, { v1: 'kalcijum', v2: 'meq/100g' }, { v1: 'fosfor', v2: 'mg/kg' }, { v1: 'azot', v2: 'mg/kg' }, { v1: 'ph vrednost', v2: 'pH' }, { v1: 'natrijum', v2: 'meq/100g' }];
  private searchList = [];
  private searchList1 = [];
  private searchList2 = [];

  private operacija: Array<string> = ['manja od', 'veca od', 'manja ili jednaka', 'veca ili jednaka', 'izmedju'];
  private parcels: any = [];
  private crops: any = [];
  constructor(private loginService: LoginService, private router: Router, private service: EditRulesService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
    if (localStorage.getItem("lang") == "sr") {
      this.operacija = ['manja od', 'veca od', 'manja ili jednaka', 'veca ili jednaka', 'izmedju', 'nije između'];
      this.uslov = [{ v1: 'vlaznost zemljista', v2: '%' }, { v1: 'temperatura', v2: '°C' }, { v1: 'kolicina padavina', v2: 'mm/h' }, { v1: 'jacina vetrova', v2: 'km/h' }, { v1: 'vlaznost vazduha', v2: '%' }, { v1: '', v2: '' }, { v1: 'kalcijum', v2: 'meq/100g' }, { v1: 'fosfor', v2: 'mg/kg' }, { v1: 'azot', v2: 'mg/kg' }, { v1: 'pH vrednost', v2: 'pH' }, { v1: 'natrijum', v2: 'meq/100g' }];
    }
    else {
      this.operacija = ["smaller then", "bigger then", "smaller or equal to", "bigger or equal to", "between", "not between"]
      this.uslov = [{ v1: 'soil moisture', v2: '%' }, { v1: 'temperature', v2: '°C' }, { v1: 'rainfall', v2: 'mm/h' }, { v1: 'wind speed', v2: 'km/h' }, { v1: 'air humidity', v2: '%' }, { v1: '', v2: '' }, { v1: 'calcium', v2: 'meq/100g' }, { v1: 'phosphorus', v2: 'mg/kg' }, { v1: 'nitrogen', v2: 'mg/kg' }, { v1: 'pH', v2: 'pH' }, { v1: 'natrium', v2: 'meq/100g' }]
    }
  }

  ngOnInit() {
    this.notAgro = true;
    if (localStorage.getItem("userType") == "Agronom") this.notAgro = false;
    else if (localStorage.getItem("userType") == "Korisnik") {
      this.loginService.getPermissions().subscribe(data => {
        if (!data.rules && !CornyService.show)
          this.router.navigate(['/' + localStorage.getItem("userType") + '/plantaze']);
      });
    }
    this.service.getUserParcels().subscribe(data => {
      if (data != null) {
        this.parcels = data.parcels;
      }

    });
    this.service.getCrops().subscribe(data => {
      if (data != null) {
        this.crops = data.crops;
      }

    });
    this.refresh();
  }


  addRule() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.setReference(ref);
    ref.instance.setTitle(localStorage.getItem("lang") === "sr" ? 'Dodaj pravilo' : 'Add rule');

    if (localStorage.getItem('userType') == "Agronom")
      ref.instance.addContent(AddRuleAgrComponent);
    else
      ref.instance.addContent(AddRuleComponent);
    ref.instance.setContent(this.rules);
    ref.instance.setCallback(this.add.bind(this));
    ref.changeDetectorRef.detectChanges();
  }
  add(string, rule, priority) {
    this.show = false;
    var has = true;
    this.rules.forEach(x => {
      var i = 0;
      rule.parcelID.forEach(el => {

        var name = this.parcels.find(n => n.ID == el).Title

        if (x.parcelID.find(y => name == y) != undefined) {
          i++;
        }
      });
      if (i == rule.parcelID.length) {
        i = 0;

        rule.culture.forEach(el => {
          var name = this.crops.find(n => n.ID == el).Title

          if (x.culture.find(y => name == y) != undefined) {
            i++;
          }
        });
        var a = x.oldString.split(' ');
        var data1 = "";
        for (var j = x.culture.length + x.parcelID.length + 2; j < a.length; j++) data1 += " " + a[j];
        a = string.split(' ');
        var data2 = "";
        for (j = rule.culture.length + rule.parcelID.length + 2; j < a.length; j++) data2 += " " + a[j];

        if (i == rule.culture.length && rule.message == x.message && data1 == data2) {
          has = false;
        }
      }
    });
    var flg = this.rules.find(x => x.message == rule.message && x.oldString == string && priority == x.priority)
    if (flg == undefined && has) {
      this.service.addRule(string, rule.message, priority).subscribe(data => {
        this.refresh();
      });
    }
    else {
      this.show = true;
      if (localStorage.getItem('lang') == "sr")
        swal("Greska", "Pravilo vec postoji!", "error");
      else
        swal("Error", "Rule already exists!", "error");
    }
  }
  deleteRule(rule: Rule) {
    if (localStorage.getItem("lang") === "sr") {
      var t = this;
      swal({
        title: "Da li ste sigurni?",
        text: "Nećete biti u mogućnosti da opozovete brisanje!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Da, izbriši!",
        cancelButtonText: "Ne, otkaži!",
        closeOnConfirm: false,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (isConfirm) {
            t.show = false;
            t.service.deleteRule(rule.oldString).subscribe(data => {
              swal("Izbrisano!", "Uspešno izbrisano pravilo.", "success");
              t.refresh();
            });
          } else {
            swal("Otkazano", "Niste izbrisali pravilo", "error");
          }
        });
    }
    else {
      var t = this;
      swal({
        title: "Are you sure?",
        text: "You will not be able to undelete!",
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
            t.show = false;
            t.service.deleteRule(rule.oldString).subscribe(data => {
              swal("Deleted!", "Successfully deleted rule.", "success");
              t.refresh();
            });
          } else {
            swal("Cancelled", "You did not delete rule", "error");
          }
        });
    }
  }

  updateRule(rule: Rule) {

    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.setReference(ref);
    if (localStorage.getItem("lang") === "sr")
      ref.instance.setTitle('Izmena pravila');
    else
      ref.instance.setTitle('Edit rules');
    if (localStorage.getItem('userType') == "Agronom")
      ref.instance.addContent(UpdateRuleAgrComponent);
    else
      ref.instance.addContent(UpdateRuleComponent);


    ref.instance.setContent(JSON.stringify(rule));
    ref.instance.setCallback(this.upd.bind(this));
    ref.changeDetectorRef.detectChanges();
  }

  upd(string: string, rule: Rule, priority: number, oldRule: Rule) {
    this.show = false;
    var has = true;
    this.rules.forEach(x => {
      var i = 0;
      rule.parcelID.forEach(el => {

        var name = this.parcels.find(n => n.ID == el).Title

        if (x.parcelID.find(y => name == y) != undefined) {
          i++;
        }
      });
      if (i == rule.parcelID.length) {
        i = 0;

        rule.culture.forEach(el => {
          var name = this.crops.find(n => n.ID == el).Title

          if (x.culture.find(y => name == y) != undefined) {
            i++;
          }
        });
        var a = [];
        a = x.oldString.split(' ');
        var data1 = "";
        for (var j = x.culture.length + x.parcelID.length + 2; j < a.length; j++) data1 += " " + a[j];
        a = string.split(' ');
        var data2 = "";

        for (var j = rule.culture.length + rule.parcelID.length + 2; j < a.length; j++) data2 += " " + a[j];

        if (i == rule.culture.length && rule.message == x.message && data1 == data2 && priority == x.priority && x.ID != rule.ID) {
          has = false;
        }
      }
    });
    var flg = this.rules.find(x => x.message == rule.message && x.oldString == string && priority == x.priority)
    if (flg == undefined && has) {

      this.service.updateRule(string, rule.message, priority, oldRule.oldString, oldRule.message, rule.OWNER).subscribe(data => {
        if (localStorage.getItem("lang") === "sr")
          swal("Uspesno!", "Uspešno ste promenili pravilo", "success");
        else
          swal("Successful!", "Successfully updated rule", "success");
        this.refresh();
      });
    }
    else {
      this.show = true;
      if (localStorage.getItem('lang') == "sr")
        swal("Greska", "Pravilo već postoji!", "error");
      else
        swal("Error", "Rule already exists!", "error");
    }
  }

  toggle(ID) {
    $("#" + ID).toggleClass("showAll");
  }

  showList(data) {
    return data.v1;
  }
  filter(data)//uslov
  {
    var i = 0;
    this.searchList = this.uslov.filter(el => el.v1.toLowerCase().indexOf(data.toLowerCase()) != -1);
    this.filterRules = this.rules.filter(el => el.data.toLowerCase().indexOf(data.toLowerCase()) != -1);
  }

  focus(el) {
    $(el).focusout();
    $(el).focusin();
  }

  refresh() {
    this.show = false;
    this.service.getAllRules().subscribe(data => {
      this.rules = [];
      if (data.length != 0 && data.length != undefined) {
        var IDID = 0;
        data.forEach(element => {
          IDID++;
          let rule: string[];
          rule = element.rule.split(' ');
          let r = new Rule();
          r.ID = IDID;
          r.OWNER = element.OWNER;
          r.IDowner = element.owner;
          if (element.owner != undefined)
            r.IDmodify = element.modifiedBy;
          if (element.modifiedDate != undefined)
            r.dateModify = element.modifiedDate.split('T')[0];
          r.oldString = element.rule;
          r.message = element.message;
          r.priority = element.priority;
          r.defaultRule = element.defaultRule;
          var index;
          var flg;
          for (index = 1; index < Number(rule[0]) + 1; index++) {

            flg = this.parcels.find(x => x.ID == Number(rule[index]))
            if (flg != undefined)
              r.parcelID.push(flg.Title);
          }
          var index1 = 1;
          for (index1 = 1; index1 < Number(rule[index]) + 1; index1++) {
            flg = this.crops.find(x => x.ID == Number(rule[index1 + index]))

            r.culture.push(flg.Title);

          }
          index += index1;
          r.data = "";
          var i = index + 1;
          var br1 = 0;
          var br2 = 0;
          var time = 1;
          for (var ii = 1; ii < Number(rule[index]) + 1; ii++) {
            br1 = 0;
            br2 = 0;
            if (localStorage.getItem('lang') == "sr") {
              if (Number(rule[i]) == 6) {
                r.data += "U periodu od " + rule[i + 1] + " do " + rule[i + 2] + ".";
                var req = new Selected(Number(rule[i]), 6, 0, 0, 0, 0);
                req.day1 = new Date(rule[i + 1]);
                req.day1 = new Date(rule[i + 2]);
                r.requirement.push(req);
                i += 3;
              }
              else {
                if (Number(rule[i]) != 1 && Number(rule[i]) < 6) {
                  r.data += "Ako je " + this.uslov[Number(rule[i]) - 1].v1 + " " + this.operacija[Number(rule[i + 2]) - 1] + " " + rule[i + 3] + " " + this.uslov[Number(rule[i]) - 1].v2;
                  var j = 4;

                  if (Number(rule[i + 2]) == 5) {
                    r.data += " i " + rule[i + 4] + " " + this.uslov[Number(rule[i]) - 1].v2;

                    br1 = Number(rule[i + 4]);
                    j++;
                  }
                  time = Number(rule[i + 1]);
                  if (Number(rule[i + 1]) == 1)
                    r.data += " u prethodna " + rule[i + j] + " dana. ";
                  else
                    r.data += " u naredna " + rule[i + j] + " dana. ";

                  br2 = Number(rule[i + j]);
                  j++;
                  r.requirement.push(new Selected(Number(rule[i]), Number(rule[i + 2]), Number(rule[i + 3]), br1, br2, time));

                }
                else {
                  r.data += "Ako je " + this.uslov[Number(rule[i]) - 1].v1 + " " + this.operacija[Number(rule[i + 1]) - 1] + " " + rule[i + 2] + " " + this.uslov[Number(rule[i]) - 1].v2;
                  var j = 3;

                  if (Number(rule[i + 1]) == 5 || Number(rule[i + 1]) == 6) {
                    r.data += " i " + rule[i + 3] + " " + this.uslov[Number(rule[i]) - 1].v2;

                    br1 = Number(rule[i + 3]);
                    j++;
                  }
                  r.data += " u prethodna " + rule[i + j];
                  r.data += " dana.";
                  r.requirement.push(new Selected(Number(rule[i]), Number(rule[i + 1]), Number(rule[i + 2]), br1, Number(rule[i + j]), time));
                  j++;
                }


                i += j;
              }
            } else {

              if (Number(rule[i]) == 6) {
                r.data += "In a period from " + rule[i + 1] + " to " + rule[i + 2] + ".";
                var req = new Selected(Number(rule[i]), 6, 0, 0, 0, 0);
                req.day1 = new Date(rule[i + 1]);
                req.day1 = new Date(rule[i + 2]);
                r.requirement.push(req);
                i += 3;
              }
              else {
                if (Number(rule[i]) != 1 && Number(rule[i]) < 6) {
                  r.data += "If " + this.uslov[Number(rule[i]) - 1].v1 + " " + this.operacija[Number(rule[i + 2]) - 1] + " " + rule[i + 3] + " " + this.uslov[Number(rule[i]) - 1].v2;
                  var j = 4;

                  if (Number(rule[i + 2]) == 5) {
                    r.data += " and " + rule[i + 4] + " " + this.uslov[Number(rule[i]) - 1].v2;

                    br1 = Number(rule[i + 4]);
                    j++;
                  }
                  time = Number(rule[i + 1]);
                  if (Number(rule[i + 1]) == 1)
                    r.data += " in the previous " + rule[i + j] + " days. ";
                  else
                    r.data += " in the next " + rule[i + j] + " days. ";

                  br2 = Number(rule[i + j]);
                  j++;
                  r.requirement.push(new Selected(Number(rule[i]), Number(rule[i + 2]), Number(rule[i + 3]), br1, br2, time));

                }
                else {
                  r.data += "If " + this.uslov[Number(rule[i]) - 1].v1 + " " + this.operacija[Number(rule[i + 1]) - 1] + " " + rule[i + 2] + " " + this.uslov[Number(rule[i]) - 1].v2;
                  var j = 3;

                  if (Number(rule[i + 1]) == 5 || Number(rule[i + 1]) == 6) {
                    r.data += " and " + rule[i + 3] + " " + this.uslov[Number(rule[i]) - 1].v2;

                    br1 = Number(rule[i + 3]);
                    j++;
                  }
                  r.data += " in the previous " + rule[i + j];
                  r.data += " days.";
                  r.requirement.push(new Selected(Number(rule[i]), Number(rule[i + 1]), Number(rule[i + 2]), br1, Number(rule[i + j]), time));
                  j++;
                }


                i += j;
              }


            }
          }
          var flg1 = this.rules.find(x => x.oldString == r.oldString);

          if (flg1 == undefined)
            this.rules.push(r);

        });
      }
      this.filterRules = this.rules;

      if (this.rules.length == 0 && CornyService.show) {
        this.rules.push({
          OWNER: 0,
          message: 'Neophodno je zaliti plantazu!',
          data: 'Ako je vlažnost manja od 25%',
          defaultRule: !this.notAgro,
          parcelID: ['Plantaža 1'],
          culture: ['Kukuruz'],
          oldString: '',
          priority: 3,
          ID: 1,
          requirement: [],
          IDowner: "",
          IDmodify: "",
          dateModify: "3/6/2017",
        });
      }

      this.show = true;

      if (CornyService.show) CornyService.forceRefreshSelect();
      this.filter("");
      this.filter1("");
      this.filter2("");
    });

  }

  showList1(data) {
    return data.Title;
  }
  filter1(data)//plantaze
  {
    this.searchList1 = this.parcels.filter(el => el.Title.toLowerCase().indexOf(data.toLowerCase()) != -1);
    this.filterRules = this.rules.filter(el => el.parcelID.filter(elem => elem.toLowerCase().indexOf(data.toLowerCase()) != -1).length != 0);
  }
  showList2(data) {
    return data.Title;
  }
  filter2(data)//kulture
  {
    this.searchList2 = this.crops.filter(el => el.Title.toLowerCase().indexOf(data.toLowerCase()) != -1);

    this.filterRules = this.rules.filter(el => el.culture.filter(elem => elem.toLowerCase().indexOf(data.toLowerCase()) != -1).length != 0);
  }
  filterUndo() {
    this.filter("");
    this.filter1("");
    this.filter2("");
    this.filterRules = this.rules;
  }
}
