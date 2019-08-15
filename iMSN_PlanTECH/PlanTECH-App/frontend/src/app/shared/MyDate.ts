export class MyDate implements Date
{
    private month = ["Jan", "Feb", "Mar", "Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"];   
    private fullMonth = ["Januar", "Februar", "Mart", "April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];   
    private days = ["Ponedeljak","Utorak","Sreda","Četvrtak","Petak","Subota","Nedelja"];
    private date:Date;

    constructor(date:any)
    {
        this.date = new Date(date);
    }

    toString(): string {
        return this.toDateString() + " " + this.toTimeString();
    }

    toMyString(): string {
        return this.date.getDate()+". "+this.month[this.date.getMonth()]+" "+this.date.getFullYear();
    }

    toDateString(): string {
        return this.days[this.date.getDay()]+" "+this.date.getDate()+". "+this.month[this.date.getMonth()]+" "+this.date.getFullYear();
    }
    toTimeString(): string {
        return this.date.getHours()+":"+this.date.getMinutes();
    }

    toLocaleString(locales?: any, options?: any) {
        return this.toTimeString();
    }
    toLocaleDateString(locales?: any, options?: any) {
        return this.toDateString();
    }
    toLocaleTimeString(locales?: any, options?: any) {
        return this.toTimeString();
    }
    valueOf(): number {
        return this.date.valueOf();
    }
    getTime(): number {
        return this.date.getTime();
    }
    getFullYear(): number {
        return this.date.getFullYear();
    }
    getUTCFullYear(): number {
        return this.date.getUTCFullYear();
    }
    getMonth(): number {
        return this.date.getMonth();
    }
    getMonthName(): string{
        return this.month[this.date.getMonth()];
    }
    getFullMonthName(): string{
        return this.fullMonth[this.date.getMonth()];
    }
    getUTCMonth(): number {
        return this.date.getUTCMinutes();
    }
    getDate(): number {
        return this.date.getDate();
    }
    getUTCDate(): number {
        return this.date.getUTCDate();
    }
    getDay(): number {
        return this.date.getDay();
    }
    getDayName(): string {
        return this.days[this.date.getDay()];
    }
    getUTCDay(): number {
        return this.date.getUTCDay();
    }
    getHours(): number {
        return this.date.getHours();
    }
    getUTCHours(): number {
        return this.date.getUTCHours();
    }
    getMinutes(): number {
        return this.date.getMinutes();
    }
    getUTCMinutes(): number {
        return this.date.getUTCMinutes();
    }
    getSeconds(): number {
        return this.date.getSeconds();
    }
    getUTCSeconds(): number {
        return this.date.getUTCSeconds();
    }
    getMilliseconds(): number {
        return this.date.getMilliseconds();
    }
    getUTCMilliseconds(): number {
        return this.date.getUTCMilliseconds();
    }
    getTimezoneOffset(): number {
        return this.date.getTimezoneOffset();
    }
    setTime(time: number): number {
        return this.date.setTime(time);
    }
    setMilliseconds(ms: number): number {
        return this.date.setMilliseconds(ms);
    }
    setUTCMilliseconds(ms: number): number {
        return this.date.setUTCMilliseconds(ms);
    }
    setSeconds(sec: number, ms?: number): number {
        return this.date.setSeconds(sec,ms);
    }
    setUTCSeconds(sec: number, ms?: number): number {
        return this.date.setUTCSeconds(sec,ms);
    }
    setMinutes(min: number, sec?: number, ms?: number): number {
        return this.date.setMinutes(min,sec,ms);
    }
    setUTCMinutes(min: number, sec?: number, ms?: number): number {
        return this.date.setUTCMinutes(min,sec,ms);
    }
    setHours(hours: number, min?: number, sec?: number, ms?: number): number {
        return this.date.setHours(hours,min,sec,ms);
    }
    setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number {
        return this.date.setUTCHours(hours,min,sec,ms);
    }
    setDate(date: number): number {
        return this.date.setDate(date);
    }
    setUTCDate(date: number): number {
        return this.date.setUTCDate(date);
    }
    setMonth(month: number, date?: number): number {
        return this.setMonth(month,date);
    }
    setUTCMonth(month: number, date?: number): number {
        return this.setUTCMonth(month,date);
    }
    setFullYear(year: number, month?: number, date?: number): number {
        return this.date.setFullYear(year,month,date);
    }
    setUTCFullYear(year: number, month?: number, date?: number): number {
        return this.date.setUTCFullYear(year,month,date);
    }
    toUTCString(): string {
        return this.toString();
    }
    toISOString(): string {
        return this.toString();
    }
    toJSON(key?: any): string {
        return this.date.toJSON(key);
    }

    [Symbol.toPrimitive](hint: any):any {
        if (hint=="string") return `${this.date}`;
        else if(hint == "number") return +this.date;
        else return this.date;
    }
}