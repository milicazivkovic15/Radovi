import { Component, OnInit } from '@angular/core';
import { EditRulesService } from '../edit-rules.service';
import { Cult } from '../add-rule/Cult';
import { Selected, Rule } from '../../Rule';
import { Validation } from '../../Validation';

declare var swal: any;

@Component({
  selector: 'app-add-rule-agr',
  templateUrl: './add-rule-agr.component.html',
  providers: [EditRulesService],

  styleUrls: ['./add-rule-agr.component.css']
})
export class AddRuleAgrComponent implements OnInit {
  datepickerOpts = {
    startDate: new Date(),
    autoclose: true,
    todayBtn: 'linked', language: localStorage.getItem("lang") == "sr" ? 'sr-latin' : 'en-GB',
    todayHighlight: true,

    assumeNearbyYear: true,
    format: 'd MM yyyy', icon: 'fa fa-calendar'
  }
  private rule: Rule = new Rule();
  private parcels: any = [];
  private cultures: Cult[] = [];
  private sign: string;
  private callback;
  private close;
  private rules;
  private priority: number;
  private view1;
  private view;
  private all;
  private all1;

  constructor(private service: EditRulesService) { }



  changeDate(tmp) {
    if (tmp.day1 == undefined) tmp.day1 = new Date(Date.now());
    if (tmp.day2 == undefined) tmp.day2 = new Date(Date.now());
  }


  ngOnInit() {
    this.service.getUserParcels().subscribe(data => {
      if (data != null) {
        this.parcels = data.parcels;

        this.parcels.forEach(el => { el.View = true });
      }

    });
    this.service.getCrops().subscribe(data => {
      if (data != null) {
        data.crops.forEach(el => {
          this.cultures.push(new Cult(el.ID, el.Title, false));
        });
      }
    });

    this.view = false;
    if (localStorage.getItem("lang") === "sr")
      this.all = "Ništa";
    else
      this.all = "Noting"

    this.view1 = true;
    if (localStorage.getItem("lang") === "sr")
      this.all1 = "Sve";
    else
      this.all1 = "All"

    this.cultures.forEach(el => {
      el.Check = false;
    });
    this.rule.requirement.push(new Selected(1, 1, 0, 0, 0, 1));












    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    //var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function () {
      // if(animating) return false;
      // animating = true;

      current_fs = $(this).parent();
      next_fs = $(this).parent().next();

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({ opacity: 0 }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale current_fs down to 80%
          scale = 1 - (1 - now) * 0.2;
          //2. bring next_fs from the right(50%)
          left = (now * 50) + "%";
          //3. increase opacity of next_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({ 'transform': 'scale(' + scale + ')' });
          next_fs.css({ 'left': left, 'opacity': opacity });
        },
        duration: 800,
        complete: function () {
          current_fs.hide();
          //	animating = false;
        },

      });
    });

    $(".previous").click(function () {
      // if(animating) return false;
      // animating = true;
      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate({ opacity: 0 }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale previous_fs from 80% to 100%
          scale = 0.8 + (1 - now) * 0.2;
          //2. take current_fs to the right(50%) - from 0%
          left = ((1 - now) * 50) + "%";
          //3. increase opacity of previous_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({ 'left': left });
          previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
        },
        duration: 800,
        complete: function () {
          current_fs.hide();
          //	animating = false;
        },

      });
    });

    $(".submit").click(function () {
      return false;
    });
  }

  setContent(json: any) {
    this.rules = json;
  }

  setCallback(callback: any) {
    this.callback = callback;
  }

  addRule() {
    Validation.clearOnValid();
    var flg = false;
    var m = true;
    var txt = "";

    if (localStorage.getItem("lang") == "sr") txt = "Greška u koracima:";
    else txt = "Error in steps:"
    this.rule.culture = [];
    this.cultures.forEach(el => {
      if (el.Check == true) {
        this.rule.culture.push(el.ID + "");
        flg = true;
      }
    });

    if (flg == false) {
      txt += " 1";

      if (localStorage.getItem("lang") === "sr")
        Validation.newMessageBefore("cult", "Morate izabrati barem jednu kulturu!", "ku");
      else
        Validation.newMessageBefore("cult", "You must select at least one culture!", "ku");

    }
    this.rule.defaultRule = true;

    this.parcels.forEach(el => {
      if (el.View == true)
        this.rule.parcelID.push(el.ID);
    });
    var string = "";
    string += this.rule.parcelID.length;
    this.rule.parcelID.forEach(element => {
      string += " " + element;
    });
    string += " " + this.rule.culture.length;
    this.rule.culture.forEach(element => {
      string += " " + element;
    });
    string += " " + this.rule.requirement.length;
    var i = -1;
    this.rule.requirement.forEach(element => {
      i++;
      if (this.valid(element, i) && flg && m) {

        string += " " + element.Value;
        if (element.Value != 6) {
          if (element.Value != 1 && element.Value < 6)
            string += " " + element.Time;
          element.operation.forEach(el => {
            string += " " + el.Value;
            string += " " + el.number1;
            if (el.Value == 5 || el.Value == 6)
              string += " " + el.number2;
          });
          string += " " + element.numberOfDay;
        }
        else {
          var day1 = element.day1.getFullYear() + "-" + element.day1.getMonth() + "-" + element.day1.getDate();
          var day2 = element.day2.getFullYear() + "-" + element.day2.getMonth() + "-" + element.day2.getDate();
          string += " " + day1 + " " + day2;
        }
      }
      else {
        flg = false;
        if (!this.valid(element, i)) txt += " 2";
      }
    });
    if (this.rule.message == "" || this.rule.message == undefined) {
      txt += " 3";
      m = false;
      if (localStorage.getItem("lang") === "sr")
        Validation.newMessageBefore("message", "Morate uneti akciju!", "ak");
      else
        Validation.newMessageBefore("message", "You must enter the action!", "ak");

    }
    if (flg && m) {
      this.callback(string, this.rule, this.priority);
      if (localStorage.getItem("lang") === "sr")
        swal("Uspesno!", "Uspešno ste dodali pravilo", "success");
      else
        swal("Successful!", "Successfully added rule", "success");
      this.close();

    } else {
      if (localStorage.getItem("lang") === "sr")
        swal("Greška!", txt, "error");
      else
        swal("Error!", txt, "error");
    }
  }
  priorityChange(value, color) {
    this.priority = value;

    $("#btn").css('background-color', color);
  }
  setClose(callback: any) {
    this.close = callback;
  }
  change() {

    this.parcels.forEach(el => {
      el.View = this.view;
    });
    this.view = !this.view;

  }
  check() {
    setTimeout(() => {

      var v = 0;
      this.parcels.forEach(el => {
        if (el.View) v++;
      });
      if (localStorage.getItem("lang") === "sr") {
        if (v == this.parcels.length) {
          this.view = false;
          this.all = "Ništa";
        }
        else if (v == 0) {
          this.view = true;
          this.all = "Sve";
        }
      }
      else {
        if (v == this.parcels.length) {
          this.view = false;
          this.all = "Nothing";
        }
        else if (v == 0) {
          this.view = true;
          this.all = "All";
        }
      }
    }, 50);
  }


  changeC() {

    this.cultures.forEach(el => {
      el.Check = this.view1;
    });
    this.view1 = !this.view1;

  }
  checkC() {
    setTimeout(() => {

      var v = 0;
      this.cultures.forEach(el => {
        if (el.Check) v++;
      });
      if (localStorage.getItem("lang") === "sr") {
        if (v == this.cultures.length) {
          this.view1 = false;
          this.all1 = "Ništa";
        }
        else if (v == 0) {
          this.view1 = true;
          this.all1 = "Sve";
        }
      }
      else {
        if (v == this.cultures.length) {
          this.view1 = false;
          this.all1 = "Nothing";
        }
        else if (v == 0) {
          this.view1 = true;
          this.all1 = "All";
        }
      }
    }, 50);
  }
  addRequirement() {
    this.rule.requirement.push(new Selected(1, 1, 0, 0, 0, 1));
  }
  deleteRequirement(item) {
    var requ = this.rule.requirement;
    this.rule.requirement = [];
    requ.forEach(element => {
      if (element != item) {
        this.rule.requirement.push(element);
      }
    });
  }
  changeSign(value, item) {
    if (value == 1)
      item.sign = "%";
    if (value == 5)
      item.sign = "%";
    if (value == 2)
      item.sign = "°C";
    if (value == 3)
      item.sign = "mm/h"
    if (value == 4)
      item.sign = "km/h";
    if (value == 7)
      item.sign = "meq/100g";
    if (value == 8)
      item.sign = "mg/kg";
    if (value == 9)
      item.sign = "mg/kg";
    if (value == 10)
      item.sign = "pH";
    if (value == 11)
      item.sign = "meq/100g";

  }


  valid(r: Selected, i) {
    var f = true;
    if (r.Value == 1 || r.Value == 2) {
      if (r.operation[0].number1 < 0 || r.operation[0].number1 > 100) {
        if (localStorage.getItem("lang") === "sr")
          Validation.newMessageBefore("val" + i, "Vrednost mora biti u opsegu 0-100", "us");
        else
          Validation.newMessageBefore("val" + i, "The value should be in the range 0-100", "us");
        f = false
      }
      if (r.operation[0].number2 < 0 || r.operation[0].number2 > 100) {
        if (localStorage.getItem("lang") === "sr")
          Validation.newMessageBefore("val2" + i, "Vrednost mora biti u opsegu 0-100", "us");
        else
          Validation.newMessageBefore("val2" + i, "The value should be in the range 0-100", "us");
        f = false
      }
    }
    else if (r.Value == 10) {
      if (r.operation[0].number1 < 0 || r.operation[0].number1 > 14) {
        if (localStorage.getItem("lang") === "sr")
          Validation.newMessageBefore("val" + i, "Vrednost mora biti u opsegu 0-14", "us");
        else
          Validation.newMessageBefore("val" + i, "The value should be in the range 0-14", "us");
        f = false
      }
      if (r.operation[0].number2 < 0 || r.operation[0].number2 > 14) {
        if (localStorage.getItem("lang") === "sr")
          Validation.newMessageBefore("val2" + i, "Vrednost mora biti u opsegu 0-14", "us");
        else
          Validation.newMessageBefore("val2" + i, "The value should be in the range 0-14", "us");
        f = false
      }

    }
    if (r.numberOfDay > 4 || r.numberOfDay < 0) {
      if (localStorage.getItem("lang") === "sr")
        Validation.newMessageBefore("day" + i, "Vrednost mora biti u opsegu 0-4", "us");
      else
        Validation.newMessageBefore("day" + i, "The value should be in the range 0-4", "us");
      f = false;
    }
    return f;
  }
}
