import * as $ from 'jquery';

export class Validation {
    private static patterns: any = {
        username: new RegExp(/^[a-z0-9šđčćž]{4,16}$/i),//{8,16}
        pass: new RegExp(/^(?=.*?[A-ZŠĐČĆŽa-z])(?=(.*[a-zšđčćž]){1,})(?=(.*[\d]){0,})(?=(.*[\_\*\@\-\!\?]){0,})(?!.*\s).{4,16}$/),//{8,16}
        // ^(?=.*?[A-ZŠĐČĆŽ])(?=(.*[a-zšđčćž]){1,})(?=(.*[\d]){1,})(?=(.*[\_\*\@\-\!\?]){1,})(?!.*\s).{8,16}$
        alpha: new RegExp(/^[a-z_'&šđčćž]+$/i),
        alnum: new RegExp(/^[\w'&]+$/),
        number: new RegExp(/^(-?)((\d+)|(\d+).(\d*))$/),
        zip: new RegExp(/(^\d{5,9}$)|(^\d{5}-\d{4}$)/),
        currency: new RegExp(/^[$]?\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$/),
        year: new RegExp(/(^(19|20)\d{2})$/),
        phone: new RegExp(/(^[0-9\-\+\/]{8,15}$)|(^$)/),
        email: new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i),
        url: new RegExp(/^(([httpY|https]+):)(\/{2})([0-9.\-A-Za-z]+)\.([0-9.\-A-Za-z]+)\.([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/),
        date: new RegExp(/^(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December|(0?\d{1})|(10|11|12))(-|\s|\/|\.)(0?[1-9]|(1|2)[0-9]|3(0|1))(-|\s|\/|\.|,\s)(19|20)?\d\d$/i),
        ip: new RegExp(/^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}))|:)))(%.+)?\s*)$/i),
        usernameOrEmail: new RegExp(/(^[a-z0-9šđčćž]{8,16}$)|(^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$)/i)
    };
    private static className: string = "errorStyle";
    private static beforeClassName: string = "beforeErrorStyle";
    private static bubblePrefix: string = "bubble-";
    private static fakeBubbleClassName: string = "fake-bubble";
    private static errorIDs: string[] = [];
    private static beforeIDs: string[] = [];
    private static latestMessage: JQuery;

    private static clearPrevous() {
        if (this.latestMessage) this.hideTooltip();

        this.errorIDs.forEach(ID => {
            this.clearAll(ID);
        });

        this.errorIDs = [];

        this.beforeIDs.forEach(ID => {
            $("#" + ID).removeClass(this.beforeClassName);
        });

        this.beforeIDs = [];
    }

    private static clearAll(ID) {
        let element: JQuery = $("#" + ID);

        element.removeClass(this.className);
        element.unbind("focusin");
        element.unbind("focusout");
    }

    public static validate(IDs: string[]): boolean {
        this.clearPrevous();

        let flag: boolean = true;
        let first: string = undefined;

        IDs.forEach(ID => {
            if (!this.validateElement(ID)) {
                if (first == undefined) first = ID;

                flag = false;
                this.setDesign(ID);
            }
        });

        if (!flag) this.showInitialTooltip(first);
        return flag;
    }

    private static validateElement(ID: string): boolean {
        let element: JQuery = $("#" + ID);

        let text: string = element.val();

        let patternType: string = element.attr("pattern-type");

        if (patternType) {
            let pattern: RegExp = this.patterns[patternType];

            if (pattern) {
                return pattern.test(text);
            }
            else {
                if (patternType === 'custom') {
                    var patternString = element.attr("pattern");

                    if (patternString) {
                        pattern = new RegExp(patternString);

                        return pattern.test(text);
                    }
                    else {
                        throw "Uz atribut 'pattern-type' na elementu " + ID + " morate proslediti i atribut 'pattern'";
                    }
                }
                else if (patternType.startsWith("same")) {
                    let secondID = patternType.substr(5);
                    let el2: JQuery = $("#" + secondID);
                    let text2: String = el2.val();
                    return text == text2;
                }
                else {
                    throw "Atribut 'pattern-type' na elementu " + ID + " mora da ima određenu vrednosti";
                }
            }
        }
        else {
            throw "Atribut 'pattern-type' ne postoji na elementu " + ID;
        }
    }

    public static clearOnValid() {
        this.clearPrevous();
    }

    public static newMessage(ID: string, message: string) {
        this.clearAll(ID);

        this.errorIDs.push(ID);

        let element: JQuery = $("#" + ID);

        element.addClass(this.className);

        element.focusin(() => {
            element.removeClass(this.className);
            this.showTooltip(ID, message);
        });

        element.focusout(() => {
            element.addClass(this.className);
            this.hideTooltip();
        });
    }

    public static newMessageBefore(ID: string, message: string, beforeID: string) {
        this.clearAll(ID);

        this.errorIDs.push(ID);
        this.beforeIDs.push(beforeID);

        let element: JQuery = $("#" + ID);
        let before: JQuery = $("#" + beforeID);

        element.addClass(this.className);
        before.addClass(this.beforeClassName);

        element.focusin(() => {
            element.removeClass(this.className);
            before.removeClass(this.beforeClassName);
            this.showTooltip(ID, message);
        });

        element.focusout(() => {
            element.addClass(this.className);
            before.addClass(this.beforeClassName);
            this.hideTooltip();
        });
    }

    private static setDesign(ID: string) {
        this.errorIDs.push(ID);

        let element: JQuery = $("#" + ID);

        element.addClass(this.className);

        element.focusin(() => {
            element.removeClass(this.className);
            this.showTooltip(ID);
        });

        element.focusout(() => {
            if (this.validateElement(ID)) {
                this.errorIDs = this.errorIDs.filter(el => el != ID);
                this.clearAll(ID);
            }
            else {
                element.addClass(this.className);
            }

            this.hideTooltip();
        });
    }

    private static showInitialTooltip(ID: String) {
        let element: JQuery = $("#" + ID);
        element.focus();
    }

    private static showTooltip(ID: String, msg?: string) {
        let element: JQuery = $("#" + ID);
        let lang: string = localStorage.getItem("lang");
        let attribute: string = "message-" + lang;

        let message: string = msg != undefined ? msg : element.attr(attribute);
        let position: string = element.attr("message-position");

        if (message) {
            if (position != undefined) {
                if ($(window).width() < 768 && (position == "left" || position == "right")) position = "top";

                this.latestMessage = $("<span></span>");
                this.latestMessage.addClass(this.bubblePrefix + position);
                this.latestMessage.html(message);
                this.latestMessage.appendTo("body");

                setTimeout(() => {
                    let pos: any = this.getPositions(ID, position, message);
                    pos["position"] = 'absolute';
                    pos["z-index"] = "10000";

                    this.latestMessage.css(pos);
                    $(window).scroll();
                }, 300);
            }
            else {
                throw "Element " + ID + " nema atribut 'message-position'";
            }
        }
        else {
            throw "Element " + ID + " nema atribut '" + attribute + "' sa porukom";
        }
    }

    private static createFakeBubble(): JQuery {
        let tmpFake: JQuery = $("<span></span>");

        tmpFake.addClass(this.className);
        tmpFake.addClass(this.fakeBubbleClassName);

        tmpFake.appendTo("body");

        return tmpFake;
    }

    private static getPositions(ID: String, position: String, message: string): any {
        let element: JQuery = $("#" + ID);
        let bubble: JQuery = $("." + this.bubblePrefix + position);

        let fakeBubble: JQuery = $("." + this.fakeBubbleClassName);
        if (fakeBubble.length == 0) fakeBubble = this.createFakeBubble();

        fakeBubble.html(message);

        let rect: any = {};
        rect.left = element.offset().left;
        rect.top = element.offset().top;
        rect.width = element.outerWidth();
        rect.height = element.outerHeight();
        let bHeight: number = fakeBubble.outerHeight();
        let bWidth: number = fakeBubble.outerWidth();
        let offsetLeft: number = 40;
        let offsetRight: number = 20;
        let offsetBottom: number = 30;
        let offsetTop: number = 30;
        let offset = 10;
        let ret: any = {
            top: -1,
            left: -1,
            width: bWidth + 20,
            height: bHeight + 20
        };

        if (position == "top") {
            ret.left = (rect.left + rect.width / 2 - bWidth / 2) + "px";
            ret.top = (rect.top - bHeight - offsetTop - offset) + "px";
        }
        else if (position == "bottom") {
            ret.left = (rect.left + rect.width / 2 - bWidth / 2) + "px";
            ret.top = (rect.top + rect.height + offsetBottom - offset) + "px";
        }
        else if (position == "left") {
            ret.top = (rect.top + rect.height / 2 - bHeight / 2 - offset) + "px";
            ret.left = (rect.left - bWidth - offsetLeft) + "px";
        }
        else if (position == "right") {
            ret.top = (rect.top + rect.height / 2 - bHeight / 2 - offset) + "px";
            ret.left = (rect.left + rect.width + offsetRight) + "px";
        }
        else {
            throw "Element sa ID-em " + ID + " ima nepoznatu vrednost atributa 'message-position'";
        }

        return ret;
    }

    private static hideTooltip() {
        this.latestMessage.remove();
    }
}