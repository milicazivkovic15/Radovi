#!/bin/bash

b=`whoami`

ps -o stat,pid > izlaz
grep -E  "Ss" izlaz > izlaz2

grep -E  "T" izlaz >> izlaz2

grep -E  "S\+" izlaz >> izlaz2
grep -E  -v "STAT" izlaz2 > izlaz3
awk '{print $2}' izlaz3 >izlaz4

lista=`cat izlaz4`

rm izlaz
rm izlaz2
rm izlaz3
rm izlaz4

for i in $lista
do
kill -KILL -$i
done 

