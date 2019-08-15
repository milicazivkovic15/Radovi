export class ValidationAccount
{
    
    fullName:string;
    imgUrl:string;
    ID:string;
    username:string;
    phone:string;
    email:string;
    type:string;
    
    constructor(fullName:string,imgUrl:string,ID:string,username:string,phone:string,email:string,type:string) 
    {
        this.fullName=fullName;
        this.imgUrl=imgUrl;
        this.ID=ID;
        this.email=email;
        this.username=username;
        this.phone=phone!='undefined'?phone:'-';
        this.type=type;
    }
}