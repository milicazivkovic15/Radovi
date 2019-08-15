export class Crops 
{
   edit:boolean;
   old:string;
   Title:string;
   ID:number
   subCrops: Crops[]=[];
    constructor(Title:string,ID:number) 
    {
        this.ID=ID;
        this.Title=Title;
    }
}