#!/bin/bash

if [ $# != 1 ]
then 
	echo ne
fi

fajl=$1
extenzija=${fajl##*.}

if [ "$extenzija" != "txt" ] || [ ! -f $1 ] 
then
	echo ne
	exit
fi
touch "broj.txt"


while read line;
do
ime=$(echo $line | awk '{ print $2 }' | grep -E "^[a-z]{1}[a-z]{4,10}$")
mail=$(echo $line | awk '{ print $3 }' | grep -E "^[a-z]{1}[a-zA-Z0-9\!\#\*\+\-]{1,10}@[a-zA-Z0-9]{2,7}.(([a-zA-Z]{2}.[a-zA-Z]{2})|([a-zA-Z]{3}))$")

if [ "$ime" != "" ] && [ "$mail" != "" ]
then 

	br=0
	br1=0
	ext1=$(echo $line | awk '{ print $4 }')
	ext2=$(echo $line | awk '{ print $5 }')
	all=$(find $(pwd) -maxdepth 1 -type f -name "*.$ext1" -o -name "*.$ext2")
	
	
	mkdir $(pwd)/$ime
	for i in $all
	do
		cp "$i" "$(pwd)/$ime"
	
		if [ "${i##*.}" == "$ext1" ]
		then
			br=$((br+1))
		else
			br1=$((br1+1))
		fi
	done
	echo "$ime $mail $ext1 = $br $ext2 = $br1" >> broj.txt
fi
done < $1
