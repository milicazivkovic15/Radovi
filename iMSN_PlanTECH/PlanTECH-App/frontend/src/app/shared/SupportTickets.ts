export class SupportTickets
{
    ID: string;
    fullName: string;
    date: Date;
    text: string;
    shortText: string;

    constructor(fullName:string,ID:string,date:Date,text:string) 
    {
        this.fullName=fullName;
        this.ID=ID;
        this.date=date;
        this.text=text;
        if(text.length>30)
        {
            this.shortText=text.substring(0,30)+"...";
        }
        else
        {
            this.shortText=text;
        }
    }

}