export class Selected1{
    Value:number;
    number1:any;
    number2:any;
    
    constructor(Value:number,n1:any,n2:any){
       
        this.Value=Value;
        this.number1=n1;
        this.number2=n2;
    }
}
export class Selected{
    // static ID:number;
    // idReq:number;
    Value:number; //uslov
    operation: Selected1[]=[]; //operacija
    sign:string; //% ,stepeni...
    numberOfDay:number; 
    day1:any; //od do datuma
    day2:any;
    
    Time:number=1; //proslost ili buducnost
    constructor(Value:number, operationValue:number,n1:number,n2:number,day:number,time:number){
        this.Value=Value;
        this.operation.push(new Selected1(operationValue,n1,n2));
        this.sign="%";
        this.numberOfDay=day;
        this.Time=time;
       
    }
}

export class Rule
{
    OWNER:any;
     IDowner:any;
    IDmodify:any;
    dateModify:any;
   
    ID: number;
    culture: string[]=[];
    requirement: Selected[]=[];
    message: string;
    defaultRule:boolean;
    data:string;
    oldString:string;
    parcelID: string[]=[];
    priority:number;
    constructor()//ID:string,name: string,culture: string,requirement: string,operation: string,value: number,message:string,parcelID:number,defaultRule:boolean) 
    {
    //     this.ID = ID;
    //     this.name = name;
    //     this.culture = culture;
    //     this.requirement = requirement;
    //     this.operation = operation;
    //     this.value = value;
    //     this.message = message;
    //     this.defaultRule = defaultRule;
    //    // this.ownerUsername = ownerUsername;
    //    // this.parcelName=parcelName;
    //     this.parcelID=parcelID;
    }

}