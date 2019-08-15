import { Component, OnInit, ElementRef, ComponentRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from "app/appConfig";
import { CornyService } from "./corny.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-corny',
  templateUrl: './corny.component.html',
  styleUrls: ['./corny.component.css'],
  providers: [CornyService]
})
export class CornyComponent {

  private imagePath = AppConfig.WEB_API + "/images/corny.png"
  private ind: number = -1;
  private msgs: Array<Show | Redirect | OpenPopup | ClosePopup | Click | ShowGif | HideGif>;
  private message: String = "";
  private show: String = "Show";
  private redirect: String = "Redirect";
  private openPopup: String = "OpenPopup";
  private closePopup: String = "ClosePopup";
  private clickButton: String = "Click";
  private showGifAnimation: String = "ShowGif";
  private hideGifAnimation: String = "hideGif";
  private gifClass: String = "gif";
  private overall: JQuery;
  private flag: boolean = true;
  private gifPath;

  constructor(private service: CornyService, private router: Router) {
    this.setUpMessages();

    this.setupGif();
  }

  setupGif() {
    let userType: String = localStorage.getItem("userType");

    if (userType == "Vlasnik" || userType == "Korisnik") {
      this.gifPath = AppConfig.WEB_API + "/images/draw-gif.gif";
    }
  }

  next() {
    if (this.ind != -1) this.removeSelector();

    this.ind++;

    if (this.ind != this.msgs.length) this.nextStep(true);

  }

  prevous() {
    if (this.ind != this.msgs.length) this.removeSelector();

    this.ind--;

    if (this.ind != -1) this.nextStep(false);
  }

  nextStep(flag) {
    this.removeSelector();

    if (this.msgs[this.ind].type == this.show) this.showNewMessage();
    else if (this.msgs[this.ind].type == this.redirect) this.redirectTo(flag);
    else if (this.msgs[this.ind].type == this.openPopup) this.showPopup(flag);
    else if (this.msgs[this.ind].type == this.showGifAnimation) this.showGif(flag);
    else if (this.msgs[this.ind].type == this.hideGifAnimation) this.hideGif(flag);
    else if (this.msgs[this.ind].type == this.closePopup) {
      if (flag) this.hidePopup(flag);
      else {
        while (this.msgs[this.ind].type != this.openPopup) this.ind--;
        this.prevous();
      }
    }
    else this.clickOnButton(flag);
  }

  showGif(flag) {
    if (flag) {
      this.addGif();
      this.next();
    }
    else {
      this.removeGif();
      this.prevous();
    }
  }

  hideGif(flag) {
    if (flag) {
      this.removeGif();
      this.next();
    }
    else {
      this.addGif();
      this.prevous();
    }
  }

  removeGif() {
    $("." + this.gifClass).css("display", "none");
  }

  addGif() {
    let tmp: ShowGif | HideGif = <ShowGif | HideGif>this.msgs[this.ind];

    var gif = $("." + this.gifClass);
    var target = $(tmp.elementSelector);

    gif.css({
      width: target.outerWidth(),
      height: target.outerHeight(),
      top: target.offset().top,
      left: target.offset().left,
      position: "absolute",
      "z-index": 99999,
      display: "block"
    });

    gif.attr("src", this.gifPath + "?" + Math.random());
  }

  clickOnButton(flag) {

    let tmp: Click = <Click>this.msgs[this.ind];

    if (flag) {
      if (tmp.next != undefined) $(tmp.next).click();
      setTimeout(() => {
        this.next();
      }, 1000);
    }
    else {
      if (tmp.prevous != undefined) $(tmp.prevous).click();
      setTimeout(() => {
        this.prevous();
      }, 1000);
    }
  }

  showPopup(flag) {
    let tmp: OpenPopup = <OpenPopup>this.msgs[this.ind];

    if (flag) {
      $(tmp.popupSelector)[0].click();

      setTimeout(() => {
        this.next();
      }, 300);
    }
    else {
      $(".close")[0].click();

      setTimeout(() => {
        this.prevous();
      }, 300);
    }
  }

  hidePopup(flag) {
    let tmp: ClosePopup = <ClosePopup>this.msgs[this.ind];

    if (flag) {
      $(".close")[0].click();

      setTimeout(() => {
        this.next();
      }, 300);
    }
    else {
      $(tmp.popupSelector)[0].click();

      setTimeout(() => {
        this.prevous();
      }, 300);
    }
  }

  scrollSelector(selector) {
    try {
      $(window).scrollTop(0);

      var screenHeight = $(window).height();

      var itemTop = $(selector).offset().top;
      var itemBottom = itemTop + $(selector).height();

      var menuHeight = $('.navbar-fixed-top').height();
      var offset = 50;

      if (itemBottom > screenHeight) {
        $(window).scrollTop(itemTop - menuHeight - offset);
      }
    }
    catch (err) { }
  }

  showNewMessage() {
    let tmp: Show = <Show>this.msgs[this.ind];

    this.scrollSelector(tmp.elementSelector);

    try {
      this.showSelector(tmp.elementSelector, this.ind);
    } catch (err) { }
    this.message = tmp.message;
  }

  redirectTo(flag) {
    let tmp: Redirect = <Redirect>this.msgs[this.ind];
    let url: string = this.router.url;

    if (flag) {
      if (tmp.nextPath != undefined) this.router.navigate([tmp.nextPath]);
      setTimeout(() => {
        if (tmp.nextPath == undefined || url.indexOf("pravila") != -1 || tmp.nextPath.indexOf("pravila") == -1) this.next();
      }, 300);
    }
    else {
      if (tmp.prevousPath != undefined) this.router.navigate([tmp.prevousPath]);
      setTimeout(() => {
        if (tmp.prevousPath == undefined || url.indexOf("pravila") != -1 || tmp.prevousPath.indexOf("pravila") == -1) this.prevous();
      }, 300);
    }
  }

  removeSelector() {
    try {
      this.overall.remove();
    }
    catch (err) { };
  }

  public refreshSelector() {
    try {
      let tmp: Redirect = <Redirect>this.msgs[this.ind];

      if (tmp.nextPath.indexOf("pravila") != -1) this.next();
      else this.prevous();
    }
    catch (err) { }
  }

  showSelector(elSelector, ind) {
    var newElement = $("<span></span>");
    setTimeout(() => {

      var target = $(elSelector);

      var flag = $("#sidebar-wrapper").find(elSelector).length == 0;
      var flag2 = $(".modal-content").find(elSelector).length != 0;
      var flag3 = $(".toggled").find(elSelector).length != 0;

      var offset = 15;

      newElement.addClass("cornySelect");
      newElement.css({
        width: target.outerWidth(),
        height: target.outerHeight(),
        top: flag3 ? target.offset().top - offset : target.offset().top,
        left: flag3 ? target.offset().left + offset : target.offset().left,
        position: flag ? 'absolute' : 'fixed',
        'z-index': flag2 ? 10000 : 500
      });

      if (this.ind == ind && CornyService.show) newElement.appendTo("body");

      this.overall = newElement;
    }, 300);
  }

  close() {
    this.removeSelector();

    CornyService.destroyMe();
    this.service.setShow(false).subscribe();

    if (this.flag) {
      this.router.navigate([localStorage.getItem("userType") + "/_blank"]);

      setTimeout(() => {
        this.router.navigate([(<Redirect>this.msgs[0]).nextPath]);
      }, 0);
    }
  }

  setUpMessages() {
    var type = localStorage.getItem("userType");

    if (type == "Vlasnik") {
      this.fillOwners();
    }
    else if (type == "Korisnik")
      this.fillUsers();
    else if (type == "Agronom") {
      this.fillAgro();
    }
    else {
      this.fillAdmin();
    }
  }

  fillAdmin() {
    if (localStorage.getItem("lang") === "sr") {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Admin/novi-korisnici',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser',
        message: 'Ovo je tvoja početna stranica sa koje možeš odobriti prisutp korisnicima na sajt. Najpre proveri uplatnicu koju su poslali kako bi bio siguran da su izvrsili uplatu!'
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser .btn-primary',
        message: 'Klikom na ovo dugme možeš pogledati uplatnicu korisnika.'
      }, {
        type: this.openPopup,
        popupSelector: '#cornyAddUser .btn-primary',
      }, {
        type: this.show,
        elementSelector: '.modal-content',
        message: 'Ovo je uplatnica koju je korisnik poslao.'
      }, {
        type: this.closePopup,
        popupSelector: '#cornyAddUser .btn-primary',
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser .btn-success',
        message: 'možeš odobriti pristup korisniku ako je sve u redu sa uplatnicom klikom na dugme...'
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser .btn-danger',
        message: 'a možeš i odbiti zahtev za otvaranje naloga.'
      }, {
        type: this.redirect,
        nextPath: '/Admin/dodaj-korisnika',
        prevousPath: '/Admin/novi-korisnici',
      }, {
        type: this.show,
        elementSelector: '#cornyAddAgro',
        message: 'Ovo je stranica ti omogućava otvaranje naloga agronomima ili novog Administratora. Oni će nam pomoci u definisanju pravila i dodavanje kultura...'
      }, {
        type: this.redirect,
        nextPath: '/Admin/izmena-podataka',
        prevousPath: '/Admin/dodaj-korisnika',
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard',
        message: 'Odavde imas pristup podacima svih korisnika. Imas mogućnost izmene njihovih podataka u koliko je to neophodno.'
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard #searchBox',
        message: 'možeš izvrsiti pretragu korisnika po imenu i prezimenu, korisničkom imenu ili e-mailu...'
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard select',
        message: '... kao i sortiranje po odredjenim kriterijumima u rastucem i opadajucem redosledu.'
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard .btn-primary',
        message: 'Klini na dugme kako bi izmenio podatke o korisniku.'
      }, {
        type: this.redirect,
        nextPath: '/Admin/tehnicka-podrska',
        prevousPath: '/Admin/izmena-podataka',
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard',
        message: 'Tvoj zadatak je da olaksas korisnicima koriscenje sajta. Ova strana ti omogućava da odgovoris korisnicima na postavljena pitanja.'

      }, {
        type: this.show,
        elementSelector: '.noPaddingCard .btn-primary',
        message: 'Klini kako bi odgovorio!'

      }, {
        type: this.openPopup,
        popupSelector: '.noPaddingCard .btn-primary',
      }, {
        type: this.show,
        elementSelector: '#qu',
        message: 'Pazljivo procitaj pitanje korisnika...'
      }, {
        type: this.show,
        elementSelector: '#msg',
        message: '...unesi tekst koji cemo poslati korisnuku.'
      }, {
        type: this.closePopup,
        popupSelector: '.noPaddingCard .btn-primary',
      }, {
        type: this.redirect,
        nextPath: '/Admin/profil',
        prevousPath: '/Admin/tehnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'Na svom profilu možeš promeniti svoje podatke ili lozinku'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'To bi bilo to. Nadam se da sam ti pomogao, zapamti uvek mogu ponovo da te provedem kroz sajt ukoliko to pozelis.'

      }

      ];
    }
    else {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Admin/novi-korisnici',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser',
        message: 'This is your home page on which you can grant access to users on this site. But first check the deposit slip that they have sent to make sure they have committed the payment!'
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser .btn-primary',
        message: 'By clicking on this button you can see the users deposit slip.'
      }, {
        type: this.openPopup,
        popupSelector: '#cornyAddUser .btn-primary',
      }, {
        type: this.show,
        elementSelector: '.modal-content',
        message: 'This is the deposit slip that the user has sent.'
      }, {
        type: this.closePopup,
        popupSelector: '#cornyAddUser .btn-primary',
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser .btn-success',
        message: 'You can grant access to the user if everything is fine with the deposit slip by clicking the button...'
      }, {
        type: this.show,
        elementSelector: '#cornyAddUser .btn-danger',
        message: 'or you can decline the request for opening an account.'
      }, {
        type: this.redirect,
        nextPath: '/Admin/dodaj-korisnika',
        prevousPath: '/Admin/novi-korisnici',
      }, {
        type: this.show,
        elementSelector: '#cornyAddAgro',
        message: 'This page allows you to open an account with agronomists or administrator. They will help us with defining the rules and adding culture...'
      }, {
        type: this.redirect,
        nextPath: '/Admin/izmena-podataka',
        prevousPath: '/Admin/dodaj-korisnika',
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard',
        message: 'From here you have access to data of all users. You can change their data if it’s necessary.'
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard #searchBox',
        message: 'You can search for users by their first and last names, usernames or e-mails...'
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard select',
        message: '... and also sort by certain criteria in a growing and decreasing order.'
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard .btn-primary',
        message: 'Click the button to change user data.'
      }, {
        type: this.redirect,
        nextPath: '/Admin/tehnicka-podrska',
        prevousPath: '/Admin/izmena-podataka',
      }, {
        type: this.show,
        elementSelector: '.noPaddingCard',
        message: 'Your job is to facilitate the use of the site for users. This page allows you to answer questions to users.'

      }, {
        type: this.show,
        elementSelector: '.noPaddingCard .btn-primary',
        message: 'Click to answer!'

      }, {
        type: this.openPopup,
        popupSelector: '.noPaddingCard .btn-primary',
      }, {
        type: this.show,
        elementSelector: '#qu',
        message: 'Read the users question carefully...'
      }, {
        type: this.show,
        elementSelector: '#msg',
        message: '...type in text you want send to the user.'
      }, {
        type: this.closePopup,
        popupSelector: '.noPaddingCard .btn-primary',
      }, {
        type: this.redirect,
        nextPath: '/Admin/profil',
        prevousPath: '/Admin/tehnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'You can change your data and password on your profile'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'That’s it. I hope I helped you, remember I can always guide you through the site if you want.'

      }

      ];
    }
  }

  fillAgro() {
    if (localStorage.getItem("lang") === "sr") {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Agronom/izmena-pravila',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#rule',
        message: 'Ovo je tvoja početna stranica. Ovde su prikazana sva pravila koje su kreirali agronomi sistema, a možeš da kreiras nova pravila koja će primenjivati svi korisnici.'
      }, {
        type: this.show,
        elementSelector: '.pera',
        message: 'Mozeš izvršiti pretragu pravila po uslovu ili kulturi'
      }, {
        type: this.show,
        elementSelector: '#iz',
        message: 'Na ovom dugmetu ćeš moći da izmeniš pravilo'
      }, {
        type: this.show,
        elementSelector: '#del',
        message: 'Ovo dugme omogućuje brisanje pravila'
      }, {
        type: this.show,
        elementSelector: '#addRule',
        message: 'Dodajmo novo pravilo'
      }, {
        type: this.openPopup,
        popupSelector: '#addRule',
      }, {
        type: this.show,
        elementSelector: '#prvi',
        message: 'Ovde možeš izabrati kulture za koje važi pravilo'
      }, {
        type: this.show,
        elementSelector: '#dalje',
        message: 'Klikom na dugme nastavljaš definisanje pravila'
      }, {
        type: this.clickButton,
        next: '#prvi .next',
        prevous: '#drugi .previous'
      }, {
        type: this.show,
        elementSelector: '#drugi',
        message: 'Ovde možeš podesiti pravilo'
      }, {
        type: this.show,
        elementSelector: '#drugi1',
        message: 'Izaberi ili izbriši uslov'
      }, {
        type: this.show,
        elementSelector: '#drugi2',
        message: 'Ovde možeš postaviti operaciju'
      }, {
        type: this.show,
        elementSelector: '#drugi3',
        message: 'nakon odabira operacije postavi koliko će vaziti to pravilo'
      }, {
        type: this.show,
        elementSelector: '#addRequi',
        message: 'klikom na dugme možeš dodati još uslova i operacija'
      }, {
        type: this.show,
        elementSelector: '#nazad',
        message: 'klikom na dugme možeš se vratiti korak unazad'
      }, {
        type: this.show,
        elementSelector: '#napred1',
        message: 'klikom na dugme možeš nastaviti definisanje pravila'
      }, {
        type: this.clickButton,
        next: '#drugi .next',
        prevous: '#treci .previous'
      }, {
        type: this.show,
        elementSelector: '#treci',
        message: 'Ovde možeš zadati akciju'
      }, {
        type: this.show,
        elementSelector: '#message',
        message: 'Ovde možeš zadati akciju koju je neophodno preduzeti nakon ispunjenja pravila'
      }, {
        type: this.show,
        elementSelector: '#izbor',
        message: 'odaberi prioritet pravila'
      }, {
        type: this.show,
        elementSelector: '#prev',
        message: 'klikom na dugme mozete se vratiti korak unazad'
      }, {
        type: this.show,
        elementSelector: '#btn',
        message: 'klikom na dugme dodajete prethodno definisano pravilo'
      }, {
        type: this.closePopup,
        popupSelector: '#addRule',
      }, {
        type: this.redirect,
        nextPath: '/Agronom/izmena-kultura',
        prevousPath: '/Agronom/izmena-pravila',
      }, {
        type: this.show,
        elementSelector: '#look',
        message: 'Pregled i izmena kultura se nalaze ovde...'
      }, {
        type: this.show,
        elementSelector: '#agrAdd ',
        message: 'Dodavanje nove kulture koju će u nadalje koristiti korisnici sistema... Naziv kulture koju dodaješ mora se razlikovati od svih kultura koje se vec nalaze u sistemu.'
      }, {
        type: this.show,
        elementSelector: '#addSubID ',
        message: 'Svaka kultura moze imati i svoju podvrstu. Dodavanje podvrste neke kulture možeš izvršiti na ovoj kartici.'
      }, {
        type: this.show,
        elementSelector: '#cul ',
        message: '...najpre izaberi kulturu za koju zelis da dodas podvrstu...'
      }, {
        type: this.show,
        elementSelector: '#subcrops ',
        message: '...unesi naziv podvrste kulture...'
      }, {
        type: this.show,
        elementSelector: '#manuf ',
        message: '...i odaberi poroizvodjaca te podvrste ili u koliko ne postoji takav dobavljac unesi naziv dobavljaca i mi cemo ga dodati.'
      }, {
        type: this.show,
        elementSelector: '#addSub ',
        message: 'Klikom na ovo dugme dodaje se nova podvrsta za izabranu kulturu...'
      }, {
        type: this.show,
        elementSelector: '#look .btn-primary ',
        message: '...i možeš je pronaci klikom na ovo dugme odgovarajuce kulture za koju si dodao/la podvrstu kulture.'
      }, {
        type: this.redirect,
        nextPath: '/Agronom/korisnicka-podrska',
        prevousPath: '/Agronom/izmena-kultura',
      }, {
        type: this.show,
        elementSelector: '#supp ',
        message: 'U koliko imas problema sa sajtom obratiti se nasim administratorima sajta. Oni će se pobrinuti da ti u najbrzem roku odgovore na e-mail.'
      }, {
        type: this.redirect,
        nextPath: '/Agronom/profil',
        prevousPath: '/Agronom/korisnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'Na svom profilu možeš promeniti svoje podatke ili lozinku'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'To bi bilo to. Nadam se da sam ti pomogao, zapamti uvek mogu ponovo da te provedem kroz sajt ukoliko to pozelis.'

      }];
    }
    else {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Agronom/izmena-pravila',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#rule',
        message: 'This is your home page. Here are all the rules created by the agronomist system, and you can create new rules that will apply for all users.'
      }, {
        type: this.show,
        elementSelector: '.pera',
        message: 'You can perform a search of rules by cultures and conditions'
      }, {
        type: this.show,
        elementSelector: '#iz',
        message: 'By clicking this button you will be able to change the rule...'
      }, {
        type: this.show,
        elementSelector: '#del',
        message: 'By clicking this button the rules are deleted'
      }, {
        type: this.show,
        elementSelector: '#addRule',
        message: 'Let’s add a new rule'
      }, {
        type: this.openPopup,
        popupSelector: '#addRule',
      }, {
        type: this.show,
        elementSelector: '#prvi',
        message: 'Here you can choose cultures for which the rule applies to'
      }, {
        type: this.show,
        elementSelector: '#dalje',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#prvi .next',
        prevous: '#drugi .previous'
      }, {
        type: this.show,
        elementSelector: '#drugi',
        message: 'Each rule is defined by conditions, here you define conditions...'
      }, {
        type: this.show,
        elementSelector: '#drugi1',
        message: 'Here you can choose the type of the condition'
      }, {
        type: this.show,
        elementSelector: '#drugi2',
        message: 'after choosing the type of the condition here you can pick a relation that will apply for it'
      }, {
        type: this.show,
        elementSelector: '#drugi3',
        message: '...after choosing a relation put a period in which the condition will apply to'
      }, {
        type: this.show,
        elementSelector: '#addRequi',
        message: 'By clicking this button you can add a new condition'
      }, {
        type: this.show,
        elementSelector: '#nazad',
        message: 'By clicking this button you can return a step back'
      }, {
        type: this.show,
        elementSelector: '#napred1',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#drugi .next',
        prevous: '#treci .previous'
      }, {
        type: this.show,
        elementSelector: '#treci',
        message: 'Here you can write a notification and choose a priority of the rule'
      }, {
        type: this.show,
        elementSelector: '#message',
        message: 'Here you can write the action that is necessary to be taken after the fulfilment of the conditions of the rule'
      }, {
        type: this.show,
        elementSelector: '#izbor',
        message: '...choose priority of the rule...'
      }, {
        type: this.show,
        elementSelector: '#prev',
        message: 'By clicking this button you can return a step back'
      }, {
        type: this.show,
        elementSelector: '#btn',
        message: 'By clicking this button the previously defined rule is created'
      }, {
        type: this.closePopup,
        popupSelector: '#addRule',
      }, {
        type: this.redirect,
        nextPath: '/Agronom/izmena-kultura',
        prevousPath: '/Agronom/izmena-pravila',
      }, {
        type: this.show,
        elementSelector: '#look',
        message: 'View and change of culture are here...'
      }, {
        type: this.show,
        elementSelector: '#agrAdd ',
        message: 'Adding new culture that will further be used by users of the system…Name of the culture that you are adding has to be different from already existing ones in the system.'
      }, {
        type: this.show,
        elementSelector: '#addSubID ',
        message: 'Every culture can have its subspecies. You can add subspecies of some culture on this card.'
      }, {
        type: this.show,
        elementSelector: '#cul ',
        message: '...first you choose culture you want to add subspecies for...'
      }, {
        type: this.show,
        elementSelector: '#subcrops ',
        message: '...name the subspecies culture...'
      }, {
        type: this.show,
        elementSelector: '#manuf ',
        message: '...and choose the manufacturer of that subspecies or if there is no manufacturer name the supplier and we will add him.'
      }, {
        type: this.show,
        elementSelector: '#addSub ',
        message: 'By clicking on this button you add new subspecies for selected culture...'
      }, {
        type: this.show,
        elementSelector: '#look .btn-primary ',
        message: '...and you can find it by clicking on this button of appropriate culture for which you added the subspecies culture.'
      }, {
        type: this.redirect,
        nextPath: '/Agronom/korisnicka-podrska',
        prevousPath: '/Agronom/izmena-kultura',
      }, {
        type: this.show,
        elementSelector: '#supp ',
        message: 'If you have any problems with the site talk to the administrators of the site. They will make sure to respond to your e-mail as soon as possible.'
      }, {
        type: this.redirect,
        nextPath: '/Agronom/profil',
        prevousPath: '/Agronom/korisnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'You can change your data and password on your profile'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'That’s it. I hope I helped you, remember I can always guide you through the site if you want.'

      }];
    }
  }
  fillUsers() {
    if (localStorage.getItem("lang") === "sr") {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Korisnik/plantaze',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#content',
        message: 'Ovo je tvoja početna stranica. Odavde možeš da pregledaš sve tvoje plantaže. Klikom na neku od plantaža možeš da pregledaš podatke plantaže...'
      }, {
        type: this.show,
        elementSelector: '#search',
        message: '...ili pretražuj plantaže po nazivu iz menija i izaberi plantažu za pregled'
      }, {
        type: this.show,
        elementSelector: '#newPlot',
        message: 'Klikom na ovo dugme kreiraš novu plantažu...'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/plantaze/nova',
        prevousPath: '/Korisnik/plantaze',
      }, {
        type: this.showGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.show,
        elementSelector: '.fakeCardWithMargin',
        message: '...za kreiranje plantaže potrebno je da uneseš grafički prikaz plantaže...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...počni sa crtanjem plantaže. U koliko želiš da obrišeš koordinatu koju si zabeležio klikni desni klik i ona će nestati. Da završiš crtanje poligona plantaže klikni na početnu tačku obeleženu žutim kružićem...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...za lakšu orjentaciju pretražuj mapu po lokacijama...'
      }, {
        type: this.show,
        elementSelector: '#res',
        message: '...u svakom trenutku možeš obrisati ceo poligon plantaže koju si iscrtao/la i kreneš ponovo...'
      }, {
        type: this.show,
        elementSelector: '#fakeCard',
        message: '...potrebno je da uneseš i podatke o plantaži...'
      }, {
        type: this.show,
        elementSelector: '#cul',
        message: '... i ako već postoje posađene kulture na plantaži zabeleži i to...'
      }, {
        type: this.show,
        elementSelector: '#sens',
        message: '...poveži plantažu sa senzorima u okolini...'
      }, {
        type: this.show,
        elementSelector: '#add',
        message: '... nakon unošenja ovih podataka potreban je još jedan klik na ovo dugme i plantaža će biti dodata.'
      }, {
        type: this.show,
        elementSelector: '#newSensor',
        message: 'Dodavanje novog mernog uređaja vrši se klikom na ovo dugme...'
      }, {
        type: this.hideGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/plantaze/novi-senzor',
        prevousPath: '/Korisnik/plantaze/nova',
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...zabeleži lokaciju mernog uređaja...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...možeš pretražiti lokaciju na mapi...'
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...unesi osnovne podatke o mernom uređaju...'
      }, {
        type: this.show,
        elementSelector: '#parcel',
        message: '...možeš ga povezati sa plantažama na samom početku. Ovo možeš uraditi i kasnije...'
      }, {
        type: this.show,
        elementSelector: '#addSen',
        message: 'Klikom na ovo dugme merni uređaj je dodat.'
      }, {
        type: this.show,
        elementSelector: '.plan',
        message: 'Klikom na na neku od plantaža možeš pregledati njene podatke...'
      }, {
        type: this.openPopup,
        popupSelector: '.plan',
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/plantaze/plantaza',
        prevousPath: '/Korisnik/plantaze/novi-senzor',
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...ovo je kartica sa osnovnim podacima o plantaži...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...grafički prikaz plantaže...'
      }, {
        type: this.show,
        elementSelector: '#work',
        message: '...u ovoj tabeli zabeleži svako korisno obaveštenje koje si dobio kako bi vlasnik plantaže uvideo izvršenju radnju nad plantažom...'
      }, {
        type: this.show,
        elementSelector: '#weather',
        message: '...u svakom trenutku možeš pregledati vremensku prognozu na lokaciji na kojoj se nalazi plantaža...'
      }, {
        type: this.show,
        elementSelector: '#graphic',
        message: '...izborom mernog uređaja sa plantaže možeš pratiti trenutna merenja na plantaži.'
      }, {
        type: this.show,
        elementSelector: '#change',
        message: 'Klikom na dugme izmeni možeš menjati podatke na plantaži.'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/obavestenja',
        prevousPath: '/Korisnik/plantaze/plantaza',
      }, {
        type: this.show,
        elementSelector: '#external-events',
        message: 'Ovo su tvoja obaveštenja! Obaveštenje možeš prevući na kalendar u koliko želis da te potsetimo za obaveštenje određenog datuma.'
      }, {
        type: this.show,
        elementSelector: '.input-group',
        message: 'Možes i sam napraviti potsetnik sa određenim prioriteton i prevući ga na kalendar...'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/izmena-pravila',
        prevousPath: '/Korisnik/obavestenja',
      }, {
        type: this.show,
        elementSelector: '#rule',
        message: 'Ovde su prikazana sva pravila koje su kreirali agronomi sistema i sva pravila koje si sam definisao/la.'
      }, {
        type: this.show,
        elementSelector: '.pera',
        message: 'Mozeš izvršiti pretragu pravila po uslovu,kulturi ili plantaži'
      }, {
        type: this.show,
        elementSelector: '#iz',
        message: 'Klikom na ovo dugme ćeš moći da izmeniš pravilo'
      }, {
        type: this.show,
        elementSelector: '#del',
        message: 'Klikom na ovo dugme pravilo se briše'
      }, {
        type: this.show,
        elementSelector: '#addRule',
        message: 'Dodajmo novo pravilo'
      }, {
        type: this.openPopup,
        popupSelector: '#addRule',
      }, {
        type: this.show,
        elementSelector: '#prvi',
        message: 'Ovde možeš izabrati kulture za koje važi pravilo'
      }, {
        type: this.show,
        elementSelector: '#dalje',
        message: 'Klikom na dugme nastavljaš definisanje pravila'
      }, {
        type: this.clickButton,
        next: '#prvi .next',
        prevous: '#drugi .previous'
      }, {
        type: this.show,
        elementSelector: '#drugi',
        message: 'Svako pravilo definisano je uslovima, ovde definišeš uslove...'
      }, {
        type: this.show,
        elementSelector: '#drugi1',
        message: 'Ovde možeš izabrati tip uslov'
      }, {
        type: this.show,
        elementSelector: '#drugi2',
        message: '...nakon odabira tipa uslova ovde možeš postaviti relaciju koja će važiti za njega'
      }, {
        type: this.show,
        elementSelector: '#drugi3',
        message: '...nakon odabira relacije postavi u kom periodu će važiti uslov...'
      }, {
        type: this.show,
        elementSelector: '#addRequi',
        message: 'klikom na dugme možeš dodati još uslova'
      }, {
        type: this.show,
        elementSelector: '#nazad',
        message: 'klikom na dugme možeš se vratiti korak unazad'
      }, {
        type: this.show,
        elementSelector: '#napred1',
        message: 'klikom na dugme možeš nastaviti definisanje pravila'
      }, {
        type: this.clickButton,
        next: '#drugi .next',
        prevous: '#treci .previous'
      }, {
        type: this.show,
        elementSelector: '#treci',
        message: 'Ovde možeš postaviti limit na kojim plantažama će važiti pravilo'
      }, {
        type: this.show,
        elementSelector: '#tabla',
        message: '...ovde možeš izabrati plantaže..'
      }, {
        type: this.show,
        elementSelector: '#pred',
        message: 'klikom na dugme možeš se vratiti korak unazad'
      }, {
        type: this.show,
        elementSelector: '#sled',
        message: 'klikom na dugme možeš nastaviti definisanje pravila'
      }, {
        type: this.clickButton,
        next: '#treci .next',
        prevous: '#cetvrti .previous'
      }, {
        type: this.show,
        elementSelector: '#cetvrti',
        message: 'Ovde možeš postaviti obaveštenje i prioritet pravila'
      }, {
        type: this.show,
        elementSelector: '#message',
        message: 'Ovde možeš zadati akciju koju je neophodno preduzeti nakon ispunjenja uslova pravila'
      }, {
        type: this.show,
        elementSelector: '#izbor',
        message: '...odaberi prioritet pravila...'
      }, {
        type: this.show,
        elementSelector: '#prev',
        message: 'klikom na dugme mozete se vratiti korak unazad'
      }, {
        type: this.show,
        elementSelector: '#btn',
        message: 'klikom na dugme kreira se prethodno definisano pravilo'
      }, {
        type: this.closePopup,
        popupSelector: '#addRule',
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/nove-kulture',
        prevousPath: '/Korisnik/izmena-pravila',
      }, {
        type: this.show,
        elementSelector: '#look',
        message: 'Pregled kultura se nalaze ovde...'
      }, {
        type: this.show,
        elementSelector: '#addSubID ',
        message: 'Svaka kultura može imati i svoju podvrstu. Dodavanje podvrste neke kulture možeš izvršiti na ovoj kartici.'
      }, {
        type: this.show,
        elementSelector: '#cul ',
        message: '...najpre izaberi kulturu za koju želiš da dodaš podvrstu...'
      }, {
        type: this.show,
        elementSelector: '#subCrop ',
        message: '...unesi naziv podvrste kulture.'
      }, {
        type: this.show,
        elementSelector: '#addSub ',
        message: 'Klikom na ovo dugme dodaje se nova podvrsta za izabranu kulturu...'
      }, {
        type: this.show,
        elementSelector: '#look .btn-primary ',
        message: '...i možeš je pronaći klikom na ovo dugme odgovarajuće kulture za koju si dodao/la podvrstu kulture.'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/tehnicka-podrska',
        prevousPath: '/Korisnik/nove-kulture',
      }, {
        type: this.show,
        elementSelector: '#supp ',
        message: 'U koliko imaš problema sa sajtom obratiti se našim administratorima sajta. Oni će se pobrinuti da ti u najbržem roku odgovore na e-mail.'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/profil',
        prevousPath: '/Korisnik/tehnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'Na svom profilu možeš promeniti svoje podatke ili lozinku'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'To bi bilo to. Nadam se da sam ti pomogao, zapamti uvek mogu ponovo da te provedem kroz sajt ukoliko to poželiš.'

      }];
    }
    else {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Korisnik/plantaze',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#content',
        message: 'This is your home page. Here you can look at your plantations. By clicking on one of the plantations you can view their data...'
      }, {
        type: this.show,
        elementSelector: '#search',
        message: '...or search for plantations by their names from menu and choose the plantation to view it'
      }, {
        type: this.show,
        elementSelector: '#newPlot',
        message: 'By clicking on this button you create a new plantation...'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/plantaze/nova',
        prevousPath: '/Korisnik/plantaze',
      }, {
        type: this.showGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.show,
        elementSelector: '.fakeCardWithMargin',
        message: '...to create a plantation you need to make a graphic view of the plantation...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...start drawing the plantation. If you want to erase the coordinate you drew just right click and it will disappear. To finish drawing the polygon plantation click on the starting dot that’s marked with a yellow circle...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...for easier orientation search the map by locations...'
      }, {
        type: this.show,
        elementSelector: '#res',
        message: '...you can erase the whole polygon plantation you drew in any moment and start a new one...'
      }, {
        type: this.show,
        elementSelector: '#fakeCard',
        message: '...you need to put data for plantation too...'
      }, {
        type: this.show,
        elementSelector: '#cul',
        message: '... and if there are already planted cultures on the plantation note it down...'
      }, {
        type: this.show,
        elementSelector: '#sens',
        message: '...connect the plantation with sensors nearby...'
      }, {
        type: this.show,
        elementSelector: '#add',
        message: '... after adding this data you need to click this button once more I the plantation will be added.'
      }, {
        type: this.show,
        elementSelector: '#newSensor',
        message: 'Adding a new measuring device is done by clicking on this button...'
      }, {
        type: this.hideGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/plantaze/novi-senzor',
        prevousPath: '/Korisnik/plantaze/nova',
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...note down the location of the measuring device...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...you can search for the location on the map...'
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...put basic data for the measuring device...'
      }, {
        type: this.show,
        elementSelector: '#parcel',
        message: '...you can connect it with plantations at the very beginning. You can do this latter...'
      }, {
        type: this.show,
        elementSelector: '#addSen',
        message: 'By clicking this button the measuring device is added.'
      }, {
        type: this.show,
        elementSelector: '.plan',
        message: 'By clicking on a plantation you can view its data...'
      }, {
        type: this.openPopup,
        popupSelector: '.plan',

      }, {
        type: this.redirect,
        nextPath: '/Korisnik/plantaze/plantaza',
        prevousPath: '/Korisnik/plantaze/novi-senzor',
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...this is the card with basic data about the plantation...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...graphic view of the plantation...'
      }, {
        type: this.show,
        elementSelector: '#work',
        message: '...on this chart write down every useful notification you got so that the owner of the plantation can see the completed work on the plantation...'
      }, {
        type: this.show,
        elementSelector: '#weather',
        message: '...you can view the weather forecast for the location where the plantation is at any time...'
      }, {
        type: this.show,
        elementSelector: '#graphic',
        message: '...choosing the measuring device on the plantation you can track current measuring on the plantation.'
      }, {
        type: this.show,
        elementSelector: '#change',
        message: 'By clicking the button change you can change the data of the plantation.'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/obavestenja',
        prevousPath: '/Korisnik/plantaze/plantaza',
      }, {
        type: this.show,
        elementSelector: '#external-events',
        message: 'This is your notice! Notice you can drag the calendar in much want to remind you to notice a certain date.'
      }, {
        type: this.show,
        elementSelector: '.input-group',
        message: ' You can make a reminder of certain prioriteton and drag it to your calendar...'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/izmena-pravila',
        prevousPath: '/Korisnik/obavestenja',
      }, {
        type: this.show,
        elementSelector: '#rule',
        message: 'Here are all the rules created by the agronomist system and all the rule you have created.'
      }, {
        type: this.show,
        elementSelector: '.pera',
        message: 'You can perform a search of rules by cultures,conditions and plantations'
      }, {
        type: this.show,
        elementSelector: '#iz',
        message: 'By clicking this button you will be able to change the rule...'
      }, {
        type: this.show,
        elementSelector: '#del',
        message: 'By clicking this button the rules are deleted'
      }, {
        type: this.show,
        elementSelector: '#addRule',
        message: 'Let’s add a new rule'
      }, {
        type: this.openPopup,
        popupSelector: '#addRule',
      }, {
        type: this.show,
        elementSelector: '#prvi',
        message: 'Here you can choose cultures for which the rule applies to'
      }, {
        type: this.show,
        elementSelector: '#dalje',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#prvi .next',
        prevous: '#drugi .previous'
      }, {
        type: this.show,
        elementSelector: '#drugi',
        message: 'Each rule is defined by conditions, here you define conditions...'
      }, {
        type: this.show,
        elementSelector: '#drugi1',
        message: 'Here you can choose the type of the condition'
      }, {
        type: this.show,
        elementSelector: '#drugi2',
        message: '...after choosing the type of the condition here you can pick a relation that will apply for it'
      }, {
        type: this.show,
        elementSelector: '#drugi3',
        message: '...after choosing a relation put a period in which the condition will apply to...'
      }, {
        type: this.show,
        elementSelector: '#addRequi',
        message: 'By clicking this button you can add a new condition'
      }, {
        type: this.show,
        elementSelector: '#nazad',
        message: 'By clicking this button you can return a step back'
      }, {
        type: this.show,
        elementSelector: '#napred1',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#drugi .next',
        prevous: '#treci .previous'
      }, {
        type: this.show,
        elementSelector: '#treci',
        message: 'Here you can put a limit on which plantations the rule will apply on a...'
      }, {
        type: this.show,
        elementSelector: '#sled',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#treci .next',
        prevous: '#cetvrti .previous'
      }, {
        type: this.show,
        elementSelector: '#cetvrti',
        message: '...Here you can write a notification and choose a priority of the rule...'
      }, {
        type: this.show,
        elementSelector: '#btn',
        message: 'By clicking this button the previously defined rule is created '
      }, {
        type: this.closePopup,
        popupSelector: '#addRule',
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/nove-kulture',
        prevousPath: '/Korisnik/izmena-pravila',
      }, {
        type: this.show,
        elementSelector: '#look',
        message: 'View of culture is found here...'
      }, {
        type: this.show,
        elementSelector: '#addSubID ',
        message: 'Every culture can have its subspecies. You can add subspecies of some culture on this card.'
      }, {
        type: this.show,
        elementSelector: '#cul ',
        message: '...first you choose culture you want to add subspecies for...'
      }, {
        type: this.show,
        elementSelector: '#subCrop ',
        message: '...name the subspecies culture.'
      }, {
        type: this.show,
        elementSelector: '#addSub ',
        message: 'By clicking on this button you add new subspecies for selected culture...'
      }, {
        type: this.show,
        elementSelector: '#look .btn-primary ',
        message: '...and you can find it by clicking on this button of appropriate culture for which you added the subspecies culture.'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/tehnicka-podrska',
        prevousPath: '/Korisnik/nove-kulture',
      }, {
        type: this.show,
        elementSelector: '#supp ',
        message: 'If you have any problems with the site talk to the administrators of the site. They will make sure to respond to your e-mail as soon as possible.'
      }, {
        type: this.redirect,
        nextPath: '/Korisnik/profil',
        prevousPath: '/Korisnik/tehnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'You can change your data and password on your profile'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'That’s it. I hope I helped you, remember I can always guide you through the site if you want.'

      }];
    }
  }
  fillOwners() {
    if (localStorage.getItem("lang") === "sr") {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#content',
        message: 'Ovo je tvoja početna stranica. Odavde možeš da pregledaš sve tvoje plantaže. Klikom na neku od plantaža možeš da pregledaš podatke plantaže...'
      }, {
        type: this.show,
        elementSelector: '#search',
        message: '...ili pretražuj plantaže po nazivu iz menija i izaberi plantažu za pregled'
      }, {
        type: this.show,
        elementSelector: '#newPlot',
        message: 'Klikom na ovo dugme kreiraš novu plantažu...'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze/nova',
        prevousPath: '/Vlasnik/plantaze',
      }, {
        type: this.showGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.show,
        elementSelector: '.fakeCardWithMargin',
        message: '...za kreiranje plantaže potrebno je da uneseš grafički prikaz plantaže...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...počni sa crtanjem plantaže. U koliko želiš da obrišeš koordinatu koju si zabeležio klikni desni klik i ona će nestati. Da završiš crtanje poligona plantaže klikni na početnu tačku obeleženu žutim kružićem...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...za lakšu orjentaciju pretražuj mapu po lokacijama...'
      }, {
        type: this.show,
        elementSelector: '#res',
        message: '...u svakom trenutku možeš obrisati ceo poligon plantaže koju si iscrtao/la i kreneš ponovo...'
      }, {
        type: this.show,
        elementSelector: '#fakeCard',
        message: '...potrebno je da uneseš i podatke o plantaži...'
      }, {
        type: this.show,
        elementSelector: '#cul',
        message: '... i ako već postoje posađene kulture na plantaži zabeleži i to...'
      }, {
        type: this.show,
        elementSelector: '#sens',
        message: '...poveži plantažu sa senzorima u okolini...'
      }, {
        type: this.show,
        elementSelector: '#add',
        message: '... nakon unošenja ovih podataka potreban je još jedan klik na ovo dugme i plantaža će biti dodata.'
      }, {
        type: this.show,
        elementSelector: '#newSensor',
        message: 'Dodavanje novog mernog uređaja vrši se klikom na ovo dugme...'
      }, {
        type: this.hideGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze/novi-senzor',
        prevousPath: '/Vlasnik/plantaze/nova',
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...zabeleži lokaciju mernog uređaja...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...možeš pretražiti lokaciju na mapi...'
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...unesi osnovne podatke o mernom uređaju...'
      }, {
        type: this.show,
        elementSelector: '#parcel',
        message: '...možeš ga povezati sa plantažama na samom početku. Ovo možeš uraditi i kasnije...'
      }, {
        type: this.show,
        elementSelector: '#addSen',
        message: 'Klikom na ovo dugme merni uređaj je dodat.'
      }, {
        type: this.show,
        elementSelector: '.plan',
        message: 'Klikom na na neku od plantaža možeš pregledati njene podatke...'
      }, {
        type: this.openPopup,
        popupSelector: '.plan',
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze/plantaza',
        prevousPath: '/Vlasnik/plantaze',
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...ovo je kartica sa osnovnim podacima o plantaži...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...grafički prikaz plantaže...'
      }, {
        type: this.show,
        elementSelector: '#work',
        message: '...u ovoj tabeli zabeleži svako korisno obaveštenje koje si dobio kako bi vlasnik plantaže uvideo izvršenju radnju nad plantažom...'
      }, {
        type: this.show,
        elementSelector: '#weather',
        message: '...u svakom trenutku možeš pregledati vremensku prognozu na lokaciji na kojoj se nalazi plantaža...'
      }, {
        type: this.show,
        elementSelector: '#graphic',
        message: '...izborom mernog uređaja sa plantaže možeš pratiti trenutna merenja na plantaži.'
      }, {
        type: this.show,
        elementSelector: '#change',
        message: 'Klikom na dugme izmeni možeš menjati podatke na plantaži.'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/obavestenja',
        prevousPath: '/Vlasnik/plantaze/plantaza',
      }, {
        type: this.show,
        elementSelector: '#external-events',
        message: 'Ovo su tvoja obavestenja! Obavestenje mozes prevuci na kalendar u koliko zelis da te potsetimo za obavestenje odredjenog datuma.'
      }, {
        type: this.show,
        elementSelector: '.input-group',
        message: 'Mozes i sam napraviti potsetnik sa odredjenim prioriteton i prevuci ga na kalendar...'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/izmena-pravila',
        prevousPath: '/Vlasnik/obavestenja',
      }, {
        type: this.show,
        elementSelector: '#rule',
        message: 'Ovde su prikazana sva pravila koje su kreirali agronomi sistema i sva pravila koje si sam definisao/la.'
      }, {
        type: this.show,
        elementSelector: '.pera',
        message: 'Mozeš izvršiti pretragu pravila po uslovu,kulturi ili plantaži'
      }, {
        type: this.show,
        elementSelector: '#iz',
        message: 'Klikom na ovo dugme možes da izmeniš pravilo'
      }, {
        type: this.show,
        elementSelector: '#del',
        message: 'Klikom na ovo dugme pravilo se briše'
      }, {
        type: this.show,
        elementSelector: '#addRule',
        message: 'Dodajmo novo pravilo'
      }, {
        type: this.openPopup,
        popupSelector: '#addRule',
      }, {
        type: this.show,
        elementSelector: '#prvi',
        message: 'Ovde možeš izabrati kulture za koje važi pravilo'
      }, {
        type: this.show,
        elementSelector: '#dalje',
        message: 'Klikom na dugme nastavljaš definisanje pravila'
      }, {
        type: this.clickButton,
        next: '#prvi .next',
        prevous: '#drugi .previous'
      }, {
        type: this.show,
        elementSelector: '#drugi',
        message: '... definišeš uslove...'
      }, {
        type: this.show,
        elementSelector: '#drugi1',
        message: 'Ovde možeš izabrati tip uslov'
      }, {
        type: this.show,
        elementSelector: '#drugi2',
        message: '...nakon odabira tipa uslova postaviti relaciju uslova'
      }, {
        type: this.show,
        elementSelector: '#drugi3',
        message: '...kao i period u kome će važiti uslov...'
      }, {
        type: this.show,
        elementSelector: '#addRequi',
        message: 'klikom na dugme možeš dodati još uslova'
      }, {
        type: this.show,
        elementSelector: '#nazad',
        message: 'klikom na dugme možeš se vratiti korak unazad'
      }, {
        type: this.show,
        elementSelector: '#napred1',
        message: '... nastaviti definisanje pravila...'
      }, {
        type: this.clickButton,
        next: '#drugi .next',
        prevous: '#treci .previous'
      }, {
        type: this.show,
        elementSelector: '#treci',
        message: '... postavi limit na kojim plantažama će važiti pravilo'
      }, {
        type: this.show,
        elementSelector: '#sled',
        message: '...nastaviti definisanje pravila...'
      }, {
        type: this.clickButton,
        next: '#treci .next',
        prevous: '#cetvrti .previous'
      }, {
        type: this.show,
        elementSelector: '#cetvrti',
        message: '... postaviti obaveštenje i prioritet pravila'
      }, {
        type: this.show,
        elementSelector: '#btn',
        message: 'klikom na dugme kreira se prethodno definisano pravilo'
      }, {
        type: this.closePopup,
        popupSelector: '#addRule',
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/nove-kulture',
        prevousPath: '/Vlasnik/izmena-pravila',
      }, {
        type: this.show,
        elementSelector: '#look',
        message: 'Pregled kultura se nalaze ovde...'
      }, {
        type: this.show,
        elementSelector: '#addSubID ',
        message: 'Svaka kultura može imati i svoju podvrstu. Dodavanje podvrste neke kulture možeš izvršiti na ovoj kartici.'
      }, {
        type: this.show,
        elementSelector: '#cul ',
        message: '...najpre izaberi kulturu za koju želiš da dodaš podvrstu...'
      }, {
        type: this.show,
        elementSelector: '#subCrop ',
        message: '...unesi naziv podvrste kulture.'
      }, {
        type: this.show,
        elementSelector: '#addSub ',
        message: 'Klikom na ovo dugme dodaje se nova podvrsta za izabranu kulturu...'
      }, {
        type: this.show,
        elementSelector: '#look .btn-primary ',
        message: '...i možeš je pronaći klikom na ovo dugme odgovarajuće kulture za koju si dodao/la podvrstu kulture.'
      },
      {
        type: this.redirect,
        nextPath: '/Vlasnik/dodaj-korisnika',
        prevousPath: '/Vlasnik/nove-kulture',
      }, {
        type: this.show,
        elementSelector: '#permisije',
        message: 'Na ovoj kartici možeš promeniti permisije svojim zaposlenima... Permisije za pregledanje i primanje obaveštenja na određenim plantažama, izmenu plantaža ili izmenu i dodavanje pravila..'
      }, {
        type: this.show,
        elementSelector: '#registruj ',
        message: 'Zaposli prijavljenog korisnika sa određenim permisijama na nekoj od plantaža...sve sto je potrebno da uneses njegov e-mail ili korisničko ime'
      },

      {
        type: this.redirect,
        nextPath: '/Vlasnik/korisnicka-podrska',
        prevousPath: '/Vlasnik/dodaj-korisnika',
      }, {
        type: this.show,
        elementSelector: '#supp ',
        message: 'U koliko imaš problema sa sajtom obratiti se našim administratorima sajta. Oni će se pobrinuti da ti u najbržem roku odgovore na e-mail.'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/profil',
        prevousPath: '/Vlasnik/korisnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'Na svom profilu možeš promeniti svoje podatke ili lozinku...'

      }, {
        type: this.show,
        elementSelector: '#myPlotlyDiv',
        message: '...prati obavljene akcije na plantažama svojih zaposlenih...'

      }, {
        type: this.show,
        elementSelector: '#pak',
        message: '...pratiti stanje paketa.'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'To bi bilo to. Nadam se da sam ti pomogao, zapamti uvek mogu ponovo da te provedem kroz sajt ukoliko to pozeliš.'
      }];
    }
    else {
      this.msgs = [{
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze',
        prevousPath: undefined,
      }, {
        type: this.show,
        elementSelector: '#content',
        message: 'This is your home page. Here you can look at your plantations. By clicking on one of the plantations you can view their data...'
      }, {
        type: this.show,
        elementSelector: '#search',
        message: '...or search for plantations by their names from menu and choose the plantation to view it'
      }, {
        type: this.show,
        elementSelector: '#newPlot',
        message: 'By clicking on this button you create a new plantation...'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze/nova',
        prevousPath: '/Vlasnik/plantaze',
      }, {
        type: this.showGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.show,
        elementSelector: '.fakeCardWithMargin',
        message: '...to create a plantation you need to make a graphic view of the plantation...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...start drawing the plantation. If you want to erase the coordinate you drew just right click and it will disappear. To finish drawing the polygon plantation click on the starting dot that’s marked with a yellow circle...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...for easier orientation search the map by locations...'
      }, {
        type: this.show,
        elementSelector: '#res',
        message: '...you can erase the whole polygon plantation you drew in any moment and start a new one...'
      }, {
        type: this.show,
        elementSelector: '#fakeCard',
        message: '...you need to put data for plantation too...'
      }, {
        type: this.show,
        elementSelector: '#cul',
        message: '... and if there are already planted cultures on the plantation note it down...'
      }, {
        type: this.show,
        elementSelector: '#sens',
        message: '...connect the plantation with sensors nearby...'
      }, {
        type: this.show,
        elementSelector: '#add',
        message: '... after adding this data you need to click this button once more I the plantation will be added.'
      }, {
        type: this.show,
        elementSelector: '#newSensor',
        message: 'Adding a new measuring device is done by clicking on this button...'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze/novi-senzor',
        prevousPath: '/Vlasnik/plantaze',
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...note down the location of the measuring device...'
      }, {
        type: this.show,
        elementSelector: '#search2',
        message: '...you can search for the location on the map...'
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...put basic data for the measuring device...'
      }, {
        type: this.show,
        elementSelector: '#parcel',
        message: '...you can connect it with plantations at the very beginning. You can do this latter...'
      }, {
        type: this.show,
        elementSelector: '#addSen',
        message: 'By clicking this button the measuring device is added.'
      }, {
        type: this.show,
        elementSelector: '.plan',
        message: 'By clicking on a plantation you can view its data...'
      }, {
        type: this.openPopup,
        popupSelector: '.plan',
      }, {
        type: this.hideGifAnimation,
        elementSelector: 'ng2-map'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/plantaze/plantaza',
        prevousPath: '/Vlasnik/plantaze/nova',
      }, {
        type: this.show,
        elementSelector: '#data',
        message: '...this is the card with basic data about the plantation...'
      }, {
        type: this.show,
        elementSelector: 'ng2-map',
        message: '...graphic view of the plantation...'
      }, {
        type: this.show,
        elementSelector: '#work',
        message: '...on this chart write down every useful notification you got so that the owner of the plantation can see the completed work on the plantation...'
      }, {
        type: this.show,
        elementSelector: '#weather',
        message: '...you can view the weather forecast for the location where the plantation is at any time...'
      }, {
        type: this.show,
        elementSelector: '#graphic',
        message: '...choosing the measuring device on the plantation you can track current measuring on the plantation.'
      }, {
        type: this.show,
        elementSelector: '#change',
        message: 'By clicking the button change you can change the data of the plantation.'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/obavestenja',
        prevousPath: '/Vlasnik/plantaze/plantaza',
      }, {
        type: this.show,
        elementSelector: '#external-events',
        message: 'This is your notice! Notice you can drag the calendar in much want to remind you to notice a certain date.'
      }, {
        type: this.show,
        elementSelector: '.input-group',
        message: ' You can make a reminder of certain prioriteton and drag it to your calendar...'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/izmena-pravila',
        prevousPath: '/Vlasnik/obavestenja',
      }, {
        type: this.show,
        elementSelector: '#rule',
        message: 'Here are all the rules created by the agronomist system and all the rule you have created.'
      }, {
        type: this.show,
        elementSelector: '.pera',
        message: 'You can perform a search of rules by cultures,conditions and plantations'
      }, {
        type: this.show,
        elementSelector: '#iz',
        message: 'By clicking this button you will be able to change the rule...'
      }, {
        type: this.show,
        elementSelector: '#del',
        message: 'By clicking this button the rules are deleted'
      }, {
        type: this.show,
        elementSelector: '#addRule',
        message: 'Let’s add a new rule'
      }, {
        type: this.openPopup,
        popupSelector: '#addRule',
      }, {
        type: this.show,
        elementSelector: '#prvi',
        message: 'Here you can choose cultures for which the rule applies to'
      }, {
        type: this.show,
        elementSelector: '#dalje',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#prvi .next',
        prevous: '#drugi .previous'
      }, {
        type: this.show,
        elementSelector: '#drugi',
        message: 'Each rule is defined by conditions, here you define conditions...'
      }, {
        type: this.show,
        elementSelector: '#drugi1',
        message: 'Here you can choose the type of the condition'
      }, {
        type: this.show,
        elementSelector: '#drugi2',
        message: '...after choosing the type of the condition here you can pick a relation that will apply for it'
      }, {
        type: this.show,
        elementSelector: '#drugi3',
        message: '...after choosing a relation put a period in which the condition will apply to...'
      }, {
        type: this.show,
        elementSelector: '#addRequi',
        message: 'By clicking this button you can add a new condition'
      }, {
        type: this.show,
        elementSelector: '#nazad',
        message: 'By clicking this button you can return a step back'
      }, {
        type: this.show,
        elementSelector: '#napred1',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#drugi .next',
        prevous: '#treci .previous'
      }, {
        type: this.show,
        elementSelector: '#treci',
        message: ' Here you can put a limit on which plantations the rule will apply on a...'
      }, {
        type: this.show,
        elementSelector: '#tabla',
        message: '...Here you can choose plantations..'
      }, {
        type: this.show,
        elementSelector: '#pred',
        message: 'By clicking this button you can return a step back'
      }, {
        type: this.show,
        elementSelector: '#sled',
        message: 'By clicking this button you continue defining the rule'
      }, {
        type: this.clickButton,
        next: '#treci .next',
        prevous: '#cetvrti .previous'
      }, {
        type: this.show,
        elementSelector: '#cetvrti',
        message: 'Here you can write a notification and choose a priority of the rule'
      }, {
        type: this.show,
        elementSelector: '#message',
        message: 'Here you can write the action that is necessary to be taken after the fulfilment of the conditions of the rule'
      }, {
        type: this.show,
        elementSelector: '#izbor',
        message: '...choose priority of the rule...'
      }, {
        type: this.show,
        elementSelector: '#prev',
        message: 'By clicking this button you can return a step back'
      }, {
        type: this.show,
        elementSelector: '#btn',
        message: 'By clicking this button the previously defined rule is created '
      }, {
        type: this.closePopup,
        popupSelector: '#addRule',
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/nove-kulture',
        prevousPath: '/Vlasnik/izmena-pravila',
      }, {
        type: this.show,
        elementSelector: '#look',
        message: 'View of culture is found here...'
      }, {
        type: this.show,
        elementSelector: '#addSubID ',
        message: 'Every culture can have its subspecies. You can add subspecies of some culture on this card.'
      }, {
        type: this.show,
        elementSelector: '#cul ',
        message: '...first you choose culture you want to add subspecies for...'
      }, {
        type: this.show,
        elementSelector: '#subCrop ',
        message: '...name the subspecies culture.'
      }, {
        type: this.show,
        elementSelector: '#addSub ',
        message: 'By clicking on this button you add new subspecies for selected culture...'
      }, {
        type: this.show,
        elementSelector: '#look .btn-primary ',
        message: '...and you can find it by clicking on this button of appropriate culture for which you added the subspecies culture.'
      },
      {
        type: this.redirect,
        nextPath: '/Vlasnik/dodaj-korisnika',
        prevousPath: '/Vlasnik/nove-kulture',
      }, {
        type: this.show,
        elementSelector: '#permisije',
        message: 'On this card you can change permissions of your employees... Permissions for reviewing and receiving notifications on certain plantations, editing plantations or editing and adding rules...'
      }, {
        type: this.show,
        elementSelector: '#registruj ',
        message: 'Hire a registered user with certain permissions on some plantations...what the input needs to be is either their e-mail or username'
      },

      {
        type: this.redirect,
        nextPath: '/Vlasnik/korisnicka-podrska',
        prevousPath: '/Vlasnik/dodaj-korisnika',
      }, {
        type: this.show,
        elementSelector: '#supp ',
        message: 'If you have any problems with the site talk to the administrators of the site. They will make sure to respond to your e-mail as soon as possible.'
      }, {
        type: this.redirect,
        nextPath: '/Vlasnik/profil',
        prevousPath: '/Vlasnik/korisnicka-podrska',
      }, {
        type: this.show,
        elementSelector: '#prof',
        message: 'You can change your data and password on your profile...'

      }, {
        type: this.show,
        elementSelector: '#myPlotlyDiv',
        message: '...follow finished actions of your employers on the plantations...'

      }, {
        type: this.show,
        elementSelector: '#pak',
        message: '...follow the condition of the package.'

      }, {
        type: this.show,
        elementSelector: '#tut',
        message: 'That’s it. I hope I helped you, remember I can always guide you through the site if you want.'
      }];
    }
  }
}

interface Redirect {
  nextPath: string;
  prevousPath: string;
  type: String;
}

interface Show {
  elementSelector: String;
  message: String;
  type: String;
}

interface OpenPopup {
  type: String;
  popupSelector: String;
}

interface ClosePopup {
  type: String;
  popupSelector: String;
}

interface Click {
  type: String;
  next: String;
  prevous: String;
}

interface ShowGif {
  type: String;
  elementSelector: String;
}

interface HideGif {
  type: String;
  elementSelector: String;
}
