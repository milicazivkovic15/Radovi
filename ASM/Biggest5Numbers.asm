;Problem - Asembler
;Napisati asemblerski program kojim se prvo unosi broj n, gde n iz N, n ≤ 10, a program zatim ispisuje
;najvecih 5 prirodnih brojeva manjih od 1000 koji imaju n razlicitih prostih cinilaca.

extern printf, scanf

section data
	poruka  db  "%d",10,0
	poruka1 db  "MIN je : %d",10,0
	poruka2 db  "MAX je : %d",10,0
	poruka3 db  "Nema prostih brojeva u nizu",10,0
	const   dd  4						;za konstante deklarisemo kao dd jer je to int.

section .bss
	n     resd 1						;broj clanova niza (unosi se sa tastature)
	niz   resd 30						;niz brojeva unetih sa tastature [30]-max 30
	nizp  resd 30						;podniz niza : niz prostih brojeva niza niz. :D
	min   resd 1						
	max   resd 1

section .text
	global main

main:
	enter 0,0
	pusha							;rutina

	
	push n
	push poruka
	call scanf
	add esp,8						;ucitavanje broja n na steku ide sve obrnuto 


	mov ebx,niz						;u jednom od akumulatora smestam adresu 0-og clana niza.
	mov ecx,0						;brojac i=0

while_unos:
	cmp ecx,[n]						;uslov while petlje za izlazak i=n, [n]-znaci da se uzima vrednost sa adrese n	
	jnl end_while					;ako nije manje (>= je) onda izadji

	pusha							;else : ucitavaj clanove niza .
	push ebx
	push poruka
	call scanf
	add esp,8

	add ebx,4						;pomeri pokazivac u nizu za 4 bajta(int)
	inc ecx							;uvecaj i
	jmp while_unos					;vrati se na pocetak petlje
	

end_while:							;kada i=n nastavi sa radom
	mov ecx,0						;brojac=0	
	mov esi,0						;pokazivac na trenutni clan niza
	mov edi,0						;pokazivac na trenutni clan nizap

while:
	cmp ecx,[n]
	jnl end							;ako je brojac stigao do kraja niza(nije manji->= je) izadji

	mov ebx,[niz+esi]				;pokazivac na prvi clan niza i pokazivac na trenutni clan niza saberi i smesti u ebx
	call prost

	cmp eax,1
	jne preskoci_if					;ispitaj da li je taj broj prost ako nije jednak 1=prost, onda preskoci if naredbu
	
	mov dword[nizp+edi],ebx			;else u nizp dodaj taj prost broj
	add edi,4						;nizp[edi]=niz[brojac] i pokazivac edi nizap pomeri za 4 mesta (int)

preskoci_if:						;ako broj nije prost
	add esi,4
	inc ecx							;pokazivac esi niza pomeri za 4(int) i brojac++
	
	jmp while						;vrati se na pocetak petlje

end:								;brojac stigao do kraja niza
	mov eax,edi						;u eax stavi poslednji pokazivac za poslednji clan nizap (int) kako bi ga podelili sa 4 i utvrdili broj clanova nizap
	mov edx,0						;drugi deo registra eax (u registru edx) koji sluzi za ostatak pri deljenju postavimo na 0
	div dword[const]				;delimo sa 4

	cmp eax,0					;u eax nam je broj clanova nizap
	jne not_end						;ako nije jednako nuli onda ima prostih brojeva i idemo na not_end
	
	push poruka3					;else
	call printf
	add esp,4						;ako nizp nema ni jedan clan (tj edi/4=0) stampaj poruku nema prostih brojeva

	jmp exit						;idi na kraj programa

not_end:							;postoje prosti brojevi
	mov ebx,[nizp]					;u ebx pokazivac na prvi clan nizap
	mov dword[min],ebx 				;min=nizp[0]
	mov dword [max],ebx				;max=nizp[0]
	mov ecx,1						;brojac=1
	mov esi,4 						;pomeri pokazivac na sledeci clan niza za 4 bajta (int)


while_min_max:
	cmp ecx,eax						;poredi brojac i broj clanova nizap (uslov while petlje)
	jge end_min_max					;ko je >= izadji
	
	mov ebx, [nizp+esi]				;u ebx trenutan clan niza
	cmp dword[min],ebx				;poredi min i nizp[brojac]
	jle by1							;ako je <= izadji

	mov dword [min],ebx				;else min=nizp[brojac]

by1:								;ako je nizp[brojac]>=min nastavi sa radom
	cmp dword [max],ebx				;poredi max i nizp[brojac]
	jge by2							;ako je >= izadji
	
	mov dword [max],ebx

by2:								;ako je nizp[brojac]<=max nastavi sa radom
	add esi,4						;pomeri pokazivac na sledeci clan nizap (int)
	inc ecx							;brojac++
	jmp while_min_max				;vrati se na pocetak petlje

end_min_max:
	
	push dword[min]
	push poruka1
	call printf
	add esp,8

	push dword[max]
	push poruka2
	call printf
	add esp,8						;ispisi min i max sa steka 

exit:
	popa
	mov eax,0
	leave
	ret
	
	section .text
	global prost					;rutina


prost:

	push ebx						;je trenutni clan niza. (broj)	
	push ecx						;cinilac
	push edx						;ostatak pri deljenju (drugi deo registra eax)
	push esi						
	push edi						;ova dva ne koristimo . na stek ubacujem sve registre osim onog na kome je srajnji rezultat (eax)

	mov ecx,2

do:
	cmp ecx,ebx						;poredim cinilac i trenutni clan niza
	jge end23						;ako je >= izadji

	mov eax,ebx 					;u akumulator smestam trenutni clan niza
	mov edx,0 						;cistim registar edx u kome ce biti ostatak pri deljenju
	div ecx							;delim akumulator sa ciniocem

	cmp edx,0						;da li je ostatak pri deljenju sa ciniocem 0
	je end23						;ako jeste izadji

	inc ecx							;cinilac++
	jmp do							; vrati se na pocetak petlje

end23:								;petlja je zavrsena stigli smo do kraja petlje ili smo nasli broj koji je deli nas broj i petlja je prekinuta
	cmp ecx, ebx 					;poredimo cinilac i clan niza ako su jenaki znaci da je petlja prosla do kraja i broj je prost
	jne nije_prost					;ako nisu jednaki izadji
	
	mov eax,1
	jmp theend						;else u akumulator smesti 1 (sto oznacava br je prost)---->return 1

nije_prost:
	mov eax,0						;ako cinilac i br nisu jednaki znaci da se petlja zavrsila pre vremena nasla je broj sa kojim je deljiv i broj nije prost.

theend: 
	pop edi
	pop esi
	pop edx
	pop ecx
	pop ebx 						;potrebno je informacije sa streka pistati u obrnutom redu.
	ret
