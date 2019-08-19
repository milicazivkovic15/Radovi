#!/bin/bash

if [ $# != 2 ]
then
echo "Nedovoljan broj argumenata."
exit 1
else
cd $1
ls | grep -E "$(printf $1)" | sort -d >fajl1

awk '{print $0 "_" NR}' fajl1 > fajl2

cat fajl2 >  > fajl3

direkt=`cat fajl3`

for i in $direk
do
mkdir $i
done

cat fajl2 

fi


