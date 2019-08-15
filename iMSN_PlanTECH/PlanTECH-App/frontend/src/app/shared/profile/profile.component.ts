import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, AfterViewInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { ProfileService } from './profile.service';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from 'app/default/login/login.service';
import { User } from '../User';
import { AppConfig } from "app/appConfig";
import { CornyService } from "app/shared/corny/corny.service";
import { PlotlyComponent } from "app/shared/plotly/plotly.component";
import { Validation } from '../Validation';
import { PopupWindowComponent } from "app/shared/popup-window/popup-window.component";
import { TypeChangeComponent } from "app/shared/profile/type-change/type-change.component";
import { TranslateService } from "ng2-translate";

declare var sha1: any;
declare var swal: any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [CornyService]
})
export class ProfileComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    @ViewChild("chart") chart: PlotlyComponent;

    private user: User = new User();
    private password: string = "";
    private newPass: string = "";
    private pass2: string = "";
    private err: string = "";
    private err1: string = "";
    private path: string = AppConfig.Path + "/images/user.svg";
    private flag: boolean = true;
    private changePass: boolean = false;
    private type: string = "password";
    private type1: string = "password";
    private type2: string = "password";
    private parcels: number;
    private sensors: number;
    private workers: number;
    private owner: boolean = false;
    private userFlag: boolean = false;
    private imgPath: string;
    private paymentType;
    private userPass: string;
    private works: any[] = [];
    private workersDoughnutChartLabels: string[] = [];
    private workersDoughnutChartData: number[] = [];
    private parcelsDoughnutChartLabels: string[] = [];
    private parcelsDoughnutChartData: number[] = [];
    private sensorsDoughnutChartLabels: string[] = [];
    private sensorsDoughnutChartData: number[] = [];
    private chartType: string = 'doughnut';
    private colors: any[] = [{ backgroundColor: ['#438eb8', "#d3d3d3"] }];
    private options = {
        animation: {
            duration: 0
        }, tooltips: {
            custom: (tooltip) => {
                if (!tooltip) return;
                else if (tooltip.body == undefined) return tooltip;
                else {
                    var text = tooltip.body[0].lines[0];
                    if (this.paymentType != 3 && text.indexOf("senzora") == -1 && text.indexOf("sensors") == -1) return tooltip;
                    else if (text.indexOf("slobodnih") == -1 && text.indexOf("empty") == -1) return tooltip;

                    var ind = text.lastIndexOf(":");
                    var first = text.substring(0, ind + 1);
                    tooltip.body[0].lines[0] = first + " ∞";

                    return tooltip;
                }
            }
        }
    };
    private pathPart: string = AppConfig.Path;
    private active: string = '';
    private changeFlag: boolean = false;

    changeLang(ind) {
        this.changeFlag = !this.changeFlag;

        if (this.changeFlag) {
            $(".lang:not(.activeL)").animate({ bottom: "31px" }, 200);
        }
        else {
            $(".lang:not(.activeL)").animate({ bottom: "0px" }, 200);


            setTimeout(() => {
                var flag = false;

                if (this.active == "sr" && ind == 1) {
                    this.active = "en";
                    flag = true;
                }
                else if (this.active == "en" && ind == 0) {
                    this.active = "sr"
                    flag = true;
                }

                if (flag) {
                    this.translate.use(this.active);
                    localStorage.setItem("lang", this.active);

                    var url = this.router.url;

                    this.router.navigate([localStorage.getItem("userType") + "/_blank"]);

                    setTimeout(() => {
                        this.router.navigate([url]);
                    }, 0);
                }
            }, 250);

        }
    }

    quit(OwnerID) {
        this.serviceProfile.deleteJob(OwnerID).subscribe();

        this.works = this.works.filter(el => el.OwnerID != OwnerID);
    }

    showChangeType() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(PopupWindowComponent);
        const ref = this.viewContainerRef.createComponent(factory);
        ref.instance.setReference(ref);
        ref.instance.setTitle(localStorage.getItem("lang") === "sr" ? 'Promena paketa' : 'Packet change');
        ref.instance.addContent(TypeChangeComponent);
        ref.instance.setContent({});
        ref.changeDetectorRef.detectChanges();

    }

    private showButton = false;

    constructor(private router: Router, private cornyService: CornyService, private service: LoginService, private serviceProfile: ProfileService, private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef, private translate: TranslateService) {
        this.active = localStorage.getItem("lang");


        this.owner = localStorage.getItem("userType") === "Vlasnik";
        if (this.owner) {
            this.imgPath = AppConfig.Path + "/images/cenovnik/tip_" + localStorage.getItem("paymentType") + "_" + localStorage.getItem("lang") + ".png";

            this.showButton = localStorage.getItem("paymentType") != '3';
        }

        this.userFlag = localStorage.getItem("userType") === "Korisnik";
        if (this.userFlag) {
            this.showButton = true;
            this.imgPath = AppConfig.Path + "/images/cenovnik/tip_0_" + localStorage.getItem("lang") + ".png";
        }

        if (localStorage.getItem("userType") === "Vlasnik" || localStorage.getItem("userType") === "Korisnik") {
            this.serviceProfile.getAllWorks().subscribe(data => {
                this.works = data;

                if (this.works.length == 0 && CornyService.show) {

                }
            });
        }

        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                $(".hoverChart").remove();
            }
        });
    }

    private height;
    private width;
    private sizeCheckInterval;
    private flagInterval: boolean = false;

    ngAfterContentInit() {
        let element = document.getElementsByTagName("body")[0];

        this.height = element.offsetHeight
        this.width = element.offsetWidth;

        this.sizeCheckInterval = setInterval(() => {
            let h = element.offsetHeight;
            let w = element.offsetWidth;
            if (((h !== this.height) || (w !== this.width)) && this.flagInterval) {
                this.height = h;
                this.width = w;
                this.draw(false);
            }
        }, 500);
    }

    ngOnDestroy() {
        clearInterval(this.sizeCheckInterval);
    }

    private toDoData: any[];

    ngAfterViewInit() {
        this.serviceProfile.getToDos().subscribe(data => {
            this.toDoData = [];

            var colors = ['#ff3333', '#33ff33', '#438eb8', '#ffff33'];
            var i = 0;

            data.forEach(el => {
                var tmp = this.toDoData.find(e => e.UserID == el.UserID);
                el.height = 0.99;
                var t = {
                    height: 0.01,
                    color: 'rgb(238, 238, 238)'
                };

                if (tmp) {
                    el.color = tmp.color;
                    tmp.jobs.push(el);
                    tmp.jobs.push(t);
                }
                else {
                    el.color = colors[i];

                    tmp = {
                        UserID: el.UserID,
                        Name: el.Name,
                        jobs: [el, t],
                        color: colors[i],
                    };

                    i = (i + 1) % colors.length;
                    this.toDoData.push(tmp);
                }
            });

            this.toDoData.sort((el1, el2) => {
                return el2.jobs.length - el1.jobs.length;
            });

            if (this.toDoData.length == 0 && CornyService.show) {
                this.toDoData = [{
                    Name: 'Aca Ilić',
                    UserID: '1',
                    color: '#438eb8',
                    jobs: [{
                        height: 0.99,
                        color: '#ff3333'
                    }, {
                        height: 0.01
                    }, {
                        height: 0.99,
                        color: '#ff3333'
                    }, {
                        height: 0.01
                    }]
                }, {
                    Name: 'Dušica Todorović',
                    UserID: '2',
                    color: '#ff3333',
                    jobs: [{
                        height: 0.99,
                        color: '#ff3333'
                    }, {
                        height: 0.01
                    }]
                }];
            }

            this.setLayout();
            this.setData();
        });
    }

    setData() {

        var names = [];

        var max = -1;
        var t = "";
        this.toDoData.forEach(el => {
            names.push(t + el.Name + t);
            el.jobs.pop();
            el.jobs[el.jobs.length - 1].height = 1;
            if (max < el.jobs.length) max = el.jobs.length;
            t += " ";
        });

        this.toDoData.forEach(el => {
            for (var i = 0; i < (max - el.jobs.length) / 2; i++)
                el.jobs.push({
                    height: 1,
                    color: 'rgba(0,0,0,0)'
                });
        });

        for (var i = 0; i < max; i++) {
            var trace = {
                x: names,
                y: [],
                hoverinfo: 'none',
                type: 'bar',
                marker: {
                    color: [],
                },
            };

            this.toDoData.forEach(el => {
                trace.y.push(el.jobs.length > i ? el.jobs[i].height : undefined);
                trace.marker.color.push(el.jobs.length > i ? el.jobs[i].color : undefined);
            });

            this.chartData.push(trace);
        }

        this.draw(true);
    }

    draw(flag) {
        if (this.chartData.length > 0) {
            var myPlot = this.chart.drawChart(this.chartData, this.layout);

            $('.hoverChart').remove();

            if (flag) {
                setTimeout(() => {
                    $(myPlot).find(".points").each((y, el1) => {
                        $(el1).find(".point").each((x, el2) => {
                            var tmp = $(el2);
                            var left = tmp.offset().left;
                            var top = tmp.offset().top;
                            var height = tmp[0].getBoundingClientRect().height;
                            var width = tmp[0].getBoundingClientRect().width;

                            try {
                                var text = this.toDoData[x].jobs[y].Title;

                                if (text != undefined) $("<div class='hoverChart' data-toggle='tooltip' data-placement='auto' title='" + text + "' style='position:absolute; top: " + top + "px; left:" + left + "px; height: " + height + "px; width:" + width + "px'></div>").appendTo("body");

                            }
                            catch (err) { console.log(err, x, y) }
                        });
                    });
                    this.flagInterval = true;
                }, 1000);
            }
            else {
                $(myPlot).find(".points").each((y, el1) => {
                    $(el1).find(".point").each((x, el2) => {
                        var tmp = $(el2);

                        var left = tmp.offset().left;
                        var top = tmp.offset().top;
                        var height = tmp[0].getBoundingClientRect().height;
                        var width = tmp[0].getBoundingClientRect().width;

                        try {
                            var text = this.toDoData[x].jobs[y].Title;

                            if (text != undefined) $("<div class='hoverChart' data-toggle='tooltip' data-placement='auto' title='" + text + "' style='position:absolute; top: " + top + "px; left:" + left + "px; height: " + height + "px; width:" + width + "px'></div>").appendTo("body");

                        }
                        catch (err) { }
                    });
                });
            }

        }
    }

    private element: any;
    private chartData: any[] = [];
    private layout: any;

    setLayout() {
        if (localStorage.getItem("lang") === "sr") {
            this.layout = {
                showlegend: false,
                barmode: 'stack',
                title: 'Broj završenih zadataka radnika',
                xaxis: {
                    fixedrange: true,
                    title: "Ime radnika"
                },
                yaxis: {
                    tickformat: 'd',
                    fixedrange: true,
                    title: "Broj zadataka"
                }
            };
        }
        else {
            this.layout = {
                showlegend: false,
                barmode: 'stack',
                title: 'Number of completed tasks per workers',
                xaxis: {
                    fixedrange: true,
                    title: "Name of worker"
                },
                yaxis: {
                    tickformat: 'd',
                    fixedrange: true,
                    title: "Number of tasks"
                }
            };
        }
    }

    showCorny() {
        CornyService.showCorny();
        this.cornyService.setShow(true).subscribe();
    }

    ngOnInit() {
        this.service.validateToken().subscribe(data => {
            let status: boolean = data.tokenStatus;

            if (!status) {
                localStorage.removeItem('key');
                localStorage.removeItem('userType');
                this.router.navigate(['../PlanTECH']);
            }
        });
        this.refresh();
    }
    mouseup(id) {
        if (id == 1)
            this.type1 = "password";
        else if (id == 2)
            this.type2 = "password";
        else
            this.type = "password";

    }
    mousedown(id) {
        if (id == 1)
            this.type1 = "text";
        else if (id == 2)
            this.type2 = "text";
        else
            this.type = "text";
    }
    change() {
        this.flag = false;
    }
    saveChanges() {
        if (Validation.validate(["fname", "lname", "username", "Email", "phone"])) {
            this.serviceProfile.changeUser(this.user).subscribe(data => {
                if (!data) {
                    if (localStorage.getItem("lang") === "sr") {
                        Validation.newMessage("username", "Takvo korisničko ime već postoji!");
                    }
                    else {
                        Validation.newMessage("username", "This username already exists!");
                    }
                }
                else {
                    Validation.clearOnValid();

                    this.changePass = false;
                    this.flag = true;

                    if (localStorage.getItem("lang") === "sr") {
                        swal("Sacuvano!", "Uspešno ste sačuvali izmene!", "success");
                    }
                    else {
                        swal("Saved!", "You have successfully saved changes!", "success");
                    }
                    this.refresh();
                }
            });
        }
    }
    fail() {
        this.flag = true;
        if (localStorage.getItem("lang") === "sr") {
            swal("Otkazano!", "Sve izmene izbrisane!", "success");
        }
        else {
            swal("Canceled!", "All changes removed!", "success");
        }
        this.refresh();
    }
    flip(bool) {
        this.err = "";
        this.err1 = "";
        this.password = "";
        this.newPass = "";
        this.pass2 = "";

        if (this.changePass != bool) {
            this.changePass = bool;

            $(".li").toggleClass("active");
            $(".myDIV").toggleClass("border");
            $("#notActive").toggleClass("notActive");
        }
    }
    savePass() {
        if (Validation.validate(["curr", "siff"])) {
            if (this.userPass == sha1(this.password)) {
                if (this.newPass == this.pass2) {
                    this.user.password = this.newPass;
                    this.serviceProfile.changeUser(this.user).subscribe(data => {
                        if (localStorage.getItem("lang") === "sr") {
                            swal("Sacuvano!", "Uspešno ste izmenili lozinku!", "success");
                        }
                        else {
                            swal("Saved!", "You have successfully changed the password!", "success");
                        }
                        this.refresh();
                    });
                }
                else {
                    if (localStorage.getItem("lang") === "sr") {
                        Validation.newMessage("siff2", "Ponovljena lozinka nije jednaka unetoj lozinci!")
                    }
                    else {
                        Validation.newMessage("siff2", "Repeated password is not the same password inputed!")
                    }
                }
            }
            else {
                if (localStorage.getItem("lang") === "sr") {
                    Validation.newMessage("curr", "Trenutna lozinka je pogrešna!")
                }
                else {
                    Validation.newMessage("curr", "Current password is wrong!")
                }
            }
        }
    }

    private show: boolean = false;

    refresh() {
        this.serviceProfile.getUser(localStorage.getItem("key")).subscribe(data => {

            this.user.ID = data.user.ID;

            this.user.fname = data.user.Fname;
            this.user.lname = data.user.Lname;
            this.user.username = data.user.Username;
            this.user.email = data.user.email;
            this.user.phone = data.user.Phone;
            this.userPass = data.user.Password;
            this.user.password = "";
        });
        this.serviceProfile.getNumbers(localStorage.getItem("key")).subscribe(data => {
            this.workers = data.workers;
            this.parcels = data.parcels;
            this.sensors = data.sensors;

            var lang = localStorage.getItem("lang");
            var paymentType = Number.parseInt(localStorage.getItem("paymentType"));

            this.paymentType = paymentType;

            var max = paymentType == 3 ? 99 : paymentType == 2 ? 5 : 1;
            if (max == 99 && this.workers > 30) max = 500;
            this.workersDoughnutChartData = [this.workers, max - this.workers];

            max = paymentType == 3 ? 99 : paymentType * 5;
            if (max == 99 && this.parcels > 50) max = 500;
            this.parcelsDoughnutChartData = [this.parcels, max - this.parcels];

            max = 99;
            if (max == 99 && this.sensors > 50) max = 500;
            this.sensorsDoughnutChartData = [this.sensors, max - this.sensors];

            if (lang === "sr") {
                this.workersDoughnutChartLabels = ['Broj radnika', 'Broj slobodnih radnih mesta'];
                this.parcelsDoughnutChartLabels = ['Broj plantaža', 'Broj slobodnih plantaža'];
                this.sensorsDoughnutChartLabels = ['Broj senzora', 'Broj slobodnih senzora'];
            }
            else {
                this.workersDoughnutChartLabels = ['Number of workers', 'Number of empty working places'];
                this.parcelsDoughnutChartLabels = ['Number of plantations', 'Number of empty places for plantages'];
                this.sensorsDoughnutChartLabels = ['Number of sensors', 'Number of empty places for sensors'];
            }

            this.show = true;
        });
    }
}
