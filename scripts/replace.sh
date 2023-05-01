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

sed -i "s/VITE_OSML10N_VERSION/${l10n_VERSION}/g" *
sed -i "s/VITE_OPENSTREETMAP_CARTO_DE_VERSION/${CARTO_VERSION}/g" *


cd /srv/tile/site/

if [ $HOSTNAME == 'bullseye' ]
then
    sed -i "s/VITE_NAVIGATION_LIST/HtmlFuerVagrantListe/g" index.html
else
    sed -i "s/VITE_NAVIGATION_LIST/HtmlFuerProdListe/g" index.html
fi


cd /srv/tile/site/assets

if [ $HOSTNAME == 'bullseye' ]
then
    sed -i "s/VITE_HOSTNAME/localhost\:8443/g" *
else
    sed -i "s/VITE_HOSTNAME/${HOSTNAME}\.openstreetmap\.de/g" *
fi
