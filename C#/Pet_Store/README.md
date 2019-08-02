# Pet Store

![GUI](https://github.com/milicazivkovic15/Radovi/blob/master/C%23/Pet_Store/Pet_Store/Images/home-poster)


Pokretanje
1) u Visual Studio otvoriti "File->Open->Project/Solution" i izabrati Pet_Store.sln
2) u cmd pokrenuti
	2.1) SQLLocalDB create MSSQLLocalDB
	2.2) SQLLocalDB start MSSQLLocalDB
3) u Microsoft SQL Server Management Studio za "Server name" uneti 
	(localdb)\MSSQLLocalDB
4) Attach - ovati fajl "pet_store.mdf" (odkloniti .log fajl)
5) u Visual Studio proveriti "Server Explorer -> Data Connections" da li je baza konektovana. Ako nije : desni klik na pet_storeConnectionString -> "Refresh"
6)u Visual Studio kliknuti na dugme "IIS Express"

Na kraju ne zaboraviti da u cmd-u pokrenete komandu
	SQLLocalDB stop MSSQLLocalDB
