#!/bin/bash

if [ $# != 2 ]
then
	echo "Pogresan broj argumenata!"
else

dir=$1
com=$2

if [ $2 = "-d" ]
then
	echo "Da li ste sigurni da zelite da obrisete instalaciju $dir? (d/n)"
	read odg
	if [ $odg = "d" ]
	then
		echo	OBRISI
	fi

else
	cd ..
	ls | grep -E "*\.c" >fajl1
	cprog=`cat $fajl1`
	echo "cprog"
	for i in cprog
	do
		exe_fajl=`awk -F"." '{ print $1 ".exe" }'`
		gcc -o $exe_fajl $i
	done

	if [ -d $dir ]
	then
	echo "Vec postoji"
	else
	mkdir $dir
	fi
	
	cd $dir
	
	if [ -d src ]
	then
	echo "Vec postoji"
	else
	mkdir src
	fi
	
	if [ -d bin ]
	then
	echo "Vec postoji"
	else
	mkdir bin 
	fi
	
	if [ -d include ]
	then
	echo "Vec postoji"
	else
	mkdir include
	fi
	
	if [ -d etc ]
	then
	echo "Vec postoji"
	else
	mkdir etc
	fi
	
	cd ..
	fajlovi=`ls`
	tren=`pwd`
	
	for i in fajlovi
	do
	case $i in
	*\.c)
		cp $i $tren/$dir/src/$i
		;;
	*\.exe)
		cp $i $tren/$dir/bin/$i
		;;
	*\.h)
		cp $i $tren/$dir/include/$i
		;;
	esac
	done
	
	
fi
fi
