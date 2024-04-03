#
# Bash script to configure the database for development or production
#
#test if running bash as a different user works
sudo -u postgres bash -c : && RUNAS="sudo -u postgres"

echo "What will be the sammy password?"
read -s -p 'Password: ' password
echo
read -s -p 'Confirm Password: ' password2
echo

#Runs bash with commands between '_' as nobody if possible
$RUNAS bash<<_
echo "CREATE DATABASE qviewdev;" | psql
echo "CREATE USER sammy;" | psql
echo "ALTER USER sammy PASSWORD '$password';" | psql
echo "ALTER USER sammy WITH SUPERUSER;" | psql
_
#diesel migration run
#$RUNAS bash<<_
#echo "ALTER USER sammy with NOSUPERUSER;" | psql
#_


