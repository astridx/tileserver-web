#!/bin/sh
#
# Make sure that the correct 
# - hostname 
# and the current versions of 
# - carto and 
# - l10n 
# are being displayed.
#

# https://stackoverflow.com/posts/73100228/revisions
# git config --global --add safe.directory /srv/tile/openstreetmap-carto-de
# git config --global --add safe.directory /srv/tile/sources/osml10n

CARTO_VERSION=$(git -C /srv/tile/openstreetmap-carto-de/ describe --tags)
l10n_VERSION=$(git -C /srv/tile/sources/osml10n describe --tags)

cd /srv/tile/site/assets

sed -i 's/VITE_HOSTNAME/$HOSTNAME/g' *
sed -i 's/VITE_OSML10N_VERSION/$l10n_VERSION/g' *
sed -i 's/VITE_OPENSTREETMAP_CARTO_DE_VERSION/$CARTO_VERSION/g' *
