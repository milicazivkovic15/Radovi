export class Notification
{
    parcelID : number;
    message: string;

    constructor(parcelID : number,message: string) 
    {
        this.parcelID = parcelID;
        this.message = message;
    }

}