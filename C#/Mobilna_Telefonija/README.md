# Mobilna Telefonija

Pokretanje
1) u Visual Studio otvoriti "File->Open->Project/Solution" i izabrati MilicaZivkovic.sln
2) u cmd pokrenuti
	2.1) SQLLocalDB create telefonija
	2.2) SQLLocalDB start telefonija
3) u Microsoft SQL Server Management Studio za "Server name" uneti 
	(localdb)\telefonija
4) otvoriti fajl "createDatabase.sql" i kliknuti na "Execute"
5) u Visual Studio kliknuti na dugme "Start"

Na kraju ne zaboraviti da u cmd-u pokrenete komandu
	SQLLocalDB stop telefonija