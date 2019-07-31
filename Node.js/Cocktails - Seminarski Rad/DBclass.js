var exports = module.exports = {};


exports.DBclass = class DBclass
{
	constructor()
	{
		this.conn=require('sqlite-sync');
		this.conn.connect('./cocktails.db');
	}
        
        insertCocktails(name,description,pictures,ingredients,price)
        {
            
var sql = "INSERT INTO cocktails(`name`,`description`,`pictures`,`price`,`ingredients`) VALUES ('"+name+"','"+description+"','"+pictures+"','"+price+"','"+ingredients+"')";
  
        this.conn.run(sql);
        };
	 deleteCocktails(id)
        {
            
var sql = "Delete from cocktails where id="+id;
  
        this.conn.run(sql);
        };
        
	 updateCocktails(name,description,ingredients )
        {
            
var sql = "Update cocktails set ingredients='"+ingredients+"', description='"+description+"' where id="+name;
  
        this.conn.run(sql);
        };
	kill()
	{
		this.conn.close();
	};
	
	getCocktails(name)
	{
            var sql;
                if (name==="")
		sql = "Select * from cocktails";
                else sql = 'Select * from cocktails where name="'+name+'"'+'order by id desc';
		
		var result = this.conn.run(sql);
		
		return result;
	};
	
};