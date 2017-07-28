#! /bin/sh

file="readme.md"

if [ -f "$file" ]
then
	echo "$file 找到."
else
	>&2 echo "$file 未找到.请注意文件名大小写!"
	exit 1
fi
