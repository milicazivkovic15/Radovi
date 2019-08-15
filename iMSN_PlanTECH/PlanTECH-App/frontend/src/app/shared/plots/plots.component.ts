import { Component, OnInit, ViewChild, AfterViewInit, style, OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from "@angular/router";
@Component({
  selector: 'app-plots',
  templateUrl: './plots.component.html',
  styleUrls: ['./plots.component.css']
})
export class PlotsComponent implements OnInit, AfterContentInit {

  private sideMenuHeight;

  constructor(private router: Router) {

    this.sideMenuHeight = $(window).height();

    router.events.subscribe(data => {
      this.setSideMenuHeight();
    });
  };

  setSideMenuHeight() {
    var scrollPos = $(window).scrollTop() + $(window).height();
    var offset = Math.round($(".bg").outerHeight());

    var diff = offset - scrollPos;

    $("#sidebar-wrapper").height(diff < 0 ? this.sideMenuHeight + diff - 10 : this.sideMenuHeight);
  }

  ngAfterContentInit() {
    setTimeout(() => {
      $('body').scrollTop($('body').scrollTop());
      $('html').scrollTop($('html').scrollTop());
      $(window).scrollTop($(window).scrollTop());
    }, 1000);
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if ($(".toggled").length != 0) {
        $(".fakeCardWithSideMenu").addClass("notransition");
        $(".fakeCardWithSideMenu").addClass("toggledCard");
      }
    });
  }


  @ViewChild("side") sideMenu;

  private open: boolean = false;

  setActive(data) {
    this.sideMenu.setActive(data);
  }

  setNewName(name, ID) {
    this.sideMenu.setNewName(ID, name);
  }

  refreshMenu(ID) {
    this.sideMenu.refreshMenu(ID);
  }
}
