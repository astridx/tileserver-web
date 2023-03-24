# Entwurf

Demo https://astridx.github.io/tileserver-web/

## Vite mit Bootstrap 5 aufgesetzt
https://getbootstrap.com/docs/5.2/getting-started/vite/

## OpenLayers mit Swipe Module
- https://github.com/openlayers/ol-vite in angepasster Form
- https://openlayers.org/en/latest/examples/layer-swipe.html anstelle des Layer Controls

## Kontextmenu
https://github.com/jonataswalker/ol-contextmenu

## Favicon
https://www.npmjs.com/package/vite-plugin-favicons-inject

# Todo
- robot.txt
- build-skripte in package.json 
- Daten aus Ansible

- Wie kommt die fertige Website im Verzeichnis `/src/dist/` in Dokumentroot des Webservers? Eine Möglichkeit:

```
checkout_dir="${HOME}/html/xxx"
repo_url='https://github.com/giggls/tileserver-web'

if [ ! -d "${checkout_dir}" ]; then
mkdir -p "${checkout_dir}" && git clone "${repo_url}" "${checkout_dir}"
  else
cd "${checkout_dir}" && git pull
fi
```