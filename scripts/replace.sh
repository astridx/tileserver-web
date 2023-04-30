#!/bin/bash
#
# Makes sure that the correct 
# - hostname 
# and the current versions of 
# - carto and 
# - l10n 
# are being displayed.
#

# https://stackoverflow.com/posts/73100228/revisions
git config --global --add safe.directory /srv/tile/openstreetmap-carto-de
git config --global --add safe.directory /srv/tile/sources/osml10n

CARTO_VERSION=$(git -C /srv/tile/openstreetmap-carto-de/ describe --tags)
l10n_VERSION=$(git -C /srv/tile/sources/osml10n describe --tags)

cd /srv/tile/site/assets


if [ $HOSTNAME == 'bullseye' ]
then
sudo sed -i "s/VITE_HOSTNAME/localhost/g" *
sudo sed -i "s/nav-list-prod/nav-list-vagrant/g" *
sudo sed -i "s/VITE_HOSTNAME_STANDARD/localhost/g" *
else
sudo sed -i "s/VITE_HOSTNAME/${HOSTNAME}\.openstreetmap\.de/g" *
sudo sed -i "s/VITE_HOSTNAME_STANDARD/tile\.openstreetmap\.de/g" *
fi


sudo sed -i "s/VITE_OSML10N_VERSION/${l10n_VERSION}/g" *
sudo sed -i "s/VITE_OPENSTREETMAP_CARTO_DE_VERSION/${CARTO_VERSION}/g" *

git config --global --unset safe.directory /srv/tile/openstreetmap-carto-de
git config --global --unset safe.directory /srv/tile/sources/osml10n
