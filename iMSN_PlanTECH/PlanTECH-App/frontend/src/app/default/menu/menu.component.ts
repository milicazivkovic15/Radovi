import { Component, OnInit, AfterViewInit, Inject, forwardRef } from '@angular/core';
import { MenuItem } from '../../shared/MenuItem';
import { Router } from '@angular/router';
import { AppConfig } from "app/appConfig";
import { TranslateService } from 'ng2-translate';
import { DefaultComponent } from '../default.component';
import { LoginService } from '../login/login.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-default-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements AfterViewInit {

  private pathPart: string = AppConfig.Path;
  private googlePlayLogo: string = AppConfig.Path + "/images/google-play.png";
  private appDownloadPath: string = AppConfig.Path + "/app/iMSN-App.apk";

  download() {
    window.open(this.appDownloadPath, '_blank');
  }

  setLanguage() {
    var lang = localStorage.getItem("lang");

    if (lang != null) {
      var ind;
      this.parent.setLanguage(lang);

      if (lang === "sr")
        ind = 0;
      else if (lang === "en")
        ind = 1;

      $(".lang").each((index, el) => {
        if (index == ind)
          el.dispatchEvent(new Event("click"));
      });
    }
  }

  ngAfterViewInit(): void {

    this.setScrollListener();
    this.setLanguage();
    var parent = this;

    $(window).resize(() => {
      $(window).scroll();
    });

    $(window).scroll(function () {
      try {
        var previewOffset = $("#preview").offset().top - 50;
        var loginOffset = $("#login").offset().top - 50;
        var priceOffset = $("#price").offset().top - 50;
        var scrollPosition = $("body").scrollTop();

        if (scrollPosition == 0) {
          $("#head").css("background", "transparent");
          setTimeout(() => {
            var tmp = $("#head");
            var p = tmp.parent;
            tmp.detach();
            tmp.appendTo("app-default-menu")
          }, 200);
        }
        else $("#head").css("background", "#14171c");

        if (scrollPosition < previewOffset) {
          $('.menuElement').removeClass("active");
        }

        if (scrollPosition > previewOffset) {
          $('.menuElement').removeClass("active");
          $('.preview').addClass("active");
        }

        if (scrollPosition > loginOffset) {
          $('.menuElement').removeClass("active");
          $('.login').addClass("active");
        }

        if (scrollPosition > priceOffset) {
          $('.menuElement').removeClass("active");
          $('.price').addClass("active");
        }

        var go = $('#go-top');
        var visible = $(document).height() - $('footer').height() - scrollPosition - $(window).height() - 35;

        if (visible < 0) {
          go.css({
            bottom: -visible
          });
        } else {
          go.css({
            bottom: 0
          });
        }
      }
      catch (err) { }
    });
  }

  private flag = true;

  collapse() {
    if ($(window).width() > 768) return;

    if (this.flag) $(".navbar-collapse").css({ 'position': 'absolute', 'visibility': 'hidden', 'display': 'block' });
    var optionHeight = $(".navbar-collapse").height();
    if (this.flag) $(".navbar-collapse").css({ 'position': 'static', 'visibility': 'visible', 'display': 'none' });

    $(".navbar-collapse").slideToggle('fast', function () {
      $(".navbar-collapse").toggleClass('in');

    });

    if (this.flag) {
      $("#intro").animate({ "margin-top": optionHeight + $("header").height() + "px" }, "fast");
      $(".lis").css("display", "block");
      setTimeout(() => {
        $("#tmpBg").css("z-index", "650");
      }, 200);
      //$("#tmpBg").animate({"height":"100px"});
      //$("#ul").css("width","100%");
      //$("#over").animate({"z-index":"450"},"slow");
    }
    else {
      $("#intro").animate({ "margin-top": "0px" }, "fast");
      $("#tmpBg").css("z-index", "-200");
      //$("#tmpBg").animate({"height":"0px"});
      //$("#over").animate({"z-index":"-200"},"slow");
      setTimeout(() => {
        $('.lis').css("display", "inline-block");
      }, 1000);
    }


    $("#ul").addClass("stickyNew");

    this.flag = !this.flag;
  }

  private items: MenuItem[] = [];
  private router: Router;
  private logoPath: string = AppConfig.Path + "/images/logo.png";

  constructor(private service: LoginService, router: Router, private translate: TranslateService, @Inject(forwardRef(() => DefaultComponent)) private parent: DefaultComponent) {
    this.router = router;

    this.items.push(new MenuItem('O nama', 'preview', ""));
    this.items.push(new MenuItem('Uloguj se', 'login', ""));
    this.items.push(new MenuItem('Cenovnik', 'price', ""));

    router.events.subscribe((val) => {
      if (val.url === "/PlanTECH") this.setLanguage();
    });
  }

  changeLang(ind) {
    $('.lang').removeClass("activeLang");

    $('.lang').each((i, el) => {
      if (i == ind) el.classList.add("activeLang");
    });

    if (ind == 0) {
      localStorage.setItem("lang", "sr");
      this.parent.setLanguage("sr");
    }
    else {
      localStorage.setItem("lang", "en");
      this.parent.setLanguage("en");
    }
  }

  change(item) {
    //$('a').removeClass('active');
    //$("." + item).addClass('active');
  }

  setScrollListener() {

    $("a").on('click', function (event) {

      if ($(this).hasClass("not")) return;

      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').clearQueue();
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 600, function () {
          // Add hash (#) to URL when done scrolling (default click behavior)
          history.pushState({}, "PlanTECH", "/PlanTECH");
        });
      } // End if
    });
  }
}
