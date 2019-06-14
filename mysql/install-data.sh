#!/bin/bash
path=$WORK_PATH
files=$(ls $path)
filenames=
for filename in $files
do
 filenames=$filenames"source $WORK_PATH/$filename;\n"
done
echo -e $filenames
echo "====>auto run mysql script..."
mysql -uroot -p$MYSQL_ROOT_PASSWORD <<EOF
$filenames
EOF