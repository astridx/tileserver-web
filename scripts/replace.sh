#!/bin/bash
#
# Makes sure that the correct 
# - hostname 
# and the current versions of 
# - carto and 
# - l10n 
# are being displayed.
#

CARTO_VERSION=$(git -C /srv/tile/openstreetmap-carto-de/ describe --tags)
l10n_VERSION=$(git -C /srv/tile/sources/osml10n describe --tags)

cd /srv/tile/site/

if [ $HOSTNAME == 'bullseye' ]
then
  sed -i "s/VITE_NAVIGATION_LIST/\<li\>\<a href='https\:\/\/localhost\:8443\?server\=localhost\&folder\=\'\>Server\: localhost, Folder\: \<\/a\>\<\/li\> \<li\>\<a href='https\:\/\/localhost\:8443\?server\=localhost\&folder\=osmhrb\'\>Server\: localhost, Folder\: osmhrb\<\/a\>\<\/li\>/g" index.html
else
  sed -i "s/VITE_NAVIGATION_LIST/\<li\>\<a href='https\:\/\/ptolemy\.openstreetmap.de\?server\=ptolemy\&folder\=\'\>Server\: ptolemy, Folder\: \<\/a\>\<\/li\> \<li\>\<a href='https\:\/\/ptolemy\.openstreetmap.de\?server\=ptolemy\&folder\=osmhrb\'\>Server\: ptolemy, Folder\: osmhrb\<\/a\>\<\/li\>\<li\>\<a href='https\:\/\/tile\.openstreetmap.de\?server\=tile\&folder\=\'\>Server\: tile, Folder\: \<\/a\>\<\/li\> \<li\>\<a href='https\:\/\/tile\.openstreetmap.de\?server\=tile\&folder\=osmhrb\'\>Server\: tile, Folder\: osmhrb\<\/a\>\<\/li\>/g" index.html
fi

cd /srv/tile/site/assets

sed -i "s/VITE_OSML10N_VERSION/${l10n_VERSION}/g" *.js
sed -i "s/VITE_OPENSTREETMAP_CARTO_DE_VERSION/${CARTO_VERSION}/g" *.js

if [ $HOSTNAME == 'bullseye' ]
then
  sed -i "s/VITE_HOSTNAME/localhost\:8443/g" *.js
else
  sed -i "s/VITE_HOSTNAME/${HOSTNAME}\.openstreetmap\.de/g" *.js
fi
