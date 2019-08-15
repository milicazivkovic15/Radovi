import { Component, OnInit, style, state, animate, transition, trigger } from '@angular/core';
import { ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, ViewChild, AfterViewInit } from '@angular/core';
import { PopupInteface } from './popup-inteface';
import * as $ from 'jquery';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css'],
  animations: [
    trigger('background', [
      state('inactive', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive => active', animate('150ms ease-in')),
      transition('active => inactive', animate('150ms ease-out'))
    ]),
    trigger('popup', [
      state('inactive', style({
        opacity: 0,
        top: -10
      })),
      state('active', style({
        opacity: 1,
        top: 20
      })),
      transition('inactive => active', animate('150ms ease-in')),
      transition('active => inactive', animate('150ms ease-out'))
    ])
  ]
})

export class PopupWindowComponent implements OnInit, AfterViewInit {

  @ViewChild('target', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {

  }

  private title: String = '';
  private content: String = '';
  private me: ComponentRef<PopupWindowComponent> = null;
  private child: ComponentRef<PopupInteface>;
  private state: string = 'active';

  ngOnInit() {
    this.setupPositions();
  }

  ngAfterViewInit() {
    this.state = 'active';
  }

  setReference(me: ComponentRef<PopupWindowComponent>) {
    this.me = me;
  }

  setTitle(title: string) {
    this.title = title;
  }

  addContent(cmp: Type<{}>) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(cmp);
    this.child = <ComponentRef<PopupInteface>>this.container.createComponent(factory);
    this.child.instance.setClose(this.hide.bind(this.me.instance));
    this.child.changeDetectorRef.detectChanges();
  }

  setContent(json) {
    this.child.instance.setContent(json);
  }

  hide() {
    this.state = 'inactive';
    setTimeout(() => { this.me.destroy(); }, 200);
  }

  setCallback(callback) {
    this.child.instance.setCallback(callback);
  }

  setupPositions() {
    //let body:HTMLElement = document.querySelector("body");

    //let scrollPos = $("body").scrollTop();

    //let marginLeft:string=(Math.round((body.offsetWidth - Number.parseInt($("#window").css("width")))/2))+"px";
    //let scroll: string = scrollPos + 10+"px";
    //$("body").animate({"scrollTop":scrollPos},"slow");
    //$("#window").css("left",marginLeft);


    let height: string = this.getMaxHeight() + "px"
    $("#background").css("height", height);
  }

  getMaxHeight(): number {
    if ($('.bg').height() != undefined) return $('.bg').height() + $("#foot").outerHeight();
    else return $('footer').offset().top + $('footer').outerHeight();
  }
}
