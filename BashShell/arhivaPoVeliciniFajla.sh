#!/bin/bash

if [ $# != 2 ]
then
	echo ne
	exit
fi

if [ ! -d $1 ]
then
	echo ne
	exit
fi

if [ ! -d $2 ]
then
	mkdir $2
fi

mkdir $2/manji
mkdir $2/srednji
mkdir $2/veci

all=$(find $1 -maxdepth 2 -type f) 

for i in $all
do
	velicina=$(du $i)
	size=$(echo $velicina | awk '{print $1}')
	echo $i -  $size
	if [ $size -lt 100 ]
	then
		cp "$i" $2/manji
	elif [ $size -lt 1000 ]
	then
		cp "$i" $2/srednji
	
	else
		cp "$i" $2/veci
	fi
done
