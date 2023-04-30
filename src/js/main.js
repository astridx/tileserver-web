import '../scss/styles.scss';
import * as helper from './helpers';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ.js';
import { fromLonLat } from 'ol/proj.js';
import { getRenderPixel } from 'ol/render';
import ContextMenu from 'ol-contextmenu';
import imgUrl from '../images/osm_logo.png'

const HOSTNAME = import.meta.env.VITE_HOSTNAME || import.meta.env.VITE_HOSTNAME_STANDARD;
const OSML10N_VERSION = import.meta.env.VITE_OSML10N_VERSION || '1.0';
const OPENSTREETMAP_CARTO_DE_VERSION = import.meta.env.VITE_OPENSTREETMAP_CARTO_DE_VERSION || '1.0';

const baseUrl = import.meta.env.BASE_URL;
let navListprod = document.getElementById('nav-list-prod');
let navListvagrant = document.getElementById('nav-list-vagrant');

navListprod.style.display = import.meta.env.VITE_STYLE_DISPLAY_PROD;
navListvagrant.style.display = import.meta.env.VITE_STYLE_DISPLAY_VAGRANT;

const serverFolderListprod = [
    { server: 'tile', folder: '' },
    { server: 'tile', folder: 'osmhrb' },
    { server: 'ptolemy', folder: '' },
    { server: 'ptolemy', folder: 'osmhrb' },
];

serverFolderListprod.map(
    function ({server, folder}) {
        let listelement = document.createElement("li");
        let linkelement = document.createElement("a");
        linkelement.href = baseUrl + 'index.html?server=' + server + '&folder=' + folder;
        if (folder == '') {
            linkelement.innerHTML = 'Subdomain: ' + server;
        }else {
            linkelement.innerHTML = 'Subdomain: ' + server + '</br> Unterverzeichnis: ' + folder;            
        }
        listelement.appendChild(linkelement);
        navListprod.appendChild(listelement);
    }
);

const serverFolderListvagrant = [
    { server: 'localhost', folder: '' },
    { server: 'localhost', folder: 'osmhrb' },
];

serverFolderListvagrant.map(
    function ({server, folder}) {
        let listelement = document.createElement("li");
        let linkelement = document.createElement("a");
        linkelement.href = baseUrl + 'index.html?server=' + server + '&folder=' + folder;
        if (folder == '') {
            linkelement.innerHTML = 'Subdomain: ' + server;
        }else {
            linkelement.innerHTML = 'Subdomain: ' + server + '</br> Unterverzeichnis: ' + folder;            
        }
        listelement.appendChild(linkelement);
        navListvagrant.appendChild(listelement);
    }
);

const server = helper.getGETParameter('server') !== null ? helper.getGETParameter('server') : import.meta.env.VITE_HOSTNAME_STANDARD;
const folder = helper.getGETParameter('folder') !== null && helper.getGETParameter('folder') !== ''  ? '/' + helper.getGETParameter('folder') + '/' : '/';


const osm = new TileLayer({
    source: new OSM(),
});

const tileUrl = 'https://' + server + folder + '{z}/{x}/{y}.png';
const heading = 'https://' + HOSTNAME + folder + '{z}/{x}/{y}.png';

sessionStorage.setItem("tileUrl", tileUrl);

document.getElementById('logo').src = imgUrl;
document.getElementById('header-h1').innerHTML = heading;
document.getElementById('header-p').innerHTML = '(Auswahl: ' + tileUrl + ')';

document.getElementById('main-carto').innerHTML = OSML10N_VERSION;
document.getElementById('main-local').innerHTML = OPENSTREETMAP_CARTO_DE_VERSION;
document.getElementById('hostname').innerHTML = 'Server: ' + HOSTNAME + ', Folder: ' + folder;

const defaultStyle = new TileLayer({
    source: new XYZ({
        attributions: [
            '| © sobuskutkowacy pola OpenStreetMap. | © OpenStreetMap Mitwirkende.',
        ],
        url: tileUrl,
        maxZoom: 20,
    }),
});

const map = new Map({
    layers: [osm, defaultStyle],
    target: 'map',
    view: new View({
        center: fromLonLat([10.33649, 51.006271]),
        projection: 'EPSG:3857',
        zoom: 6,
        maxZoom: 20,
        constrainResolution: true,
    })
});

const swipe = document.getElementById('swipe');

defaultStyle.on('prerender', function (event) {
    const ctx = event.context;
    const mapSize = map.getSize();
    const width = mapSize[0] * (swipe.value / 100);
    const tl = getRenderPixel(event, [width, 0]);
    const tr = getRenderPixel(event, [mapSize[0], 0]);
    const bl = getRenderPixel(event, [width, mapSize[1]]);
    const br = getRenderPixel(event, mapSize);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.closePath();
    ctx.clip();
});

defaultStyle.on('postrender', function (event) {
    const ctx = event.context;
    ctx.restore();
});

swipe.addEventListener('input', function () {
    map.render();
});

var contextmenu = new ContextMenu({
    width: 170,
    defaultItems: false,
    items: [
        {
            text: 'Kachelinfo',
            classname: 'open_tile_cb',
            callback: helper.open_tile_cb,
        },
    ],
});
map.addControl(contextmenu);

let currZoom = map.getView().getZoom();
document.getElementById('zoomlevel').innerHTML = 'Zoom: ' + currZoom;
sessionStorage.setItem("zoomlevel", currZoom);
map.on('moveend', function (e) {
    var newZoom = map.getView().getZoom();
    if (currZoom != newZoom) {
        document.getElementById('zoomlevel').innerHTML = 'Zoom: ' + newZoom;
        sessionStorage.setItem("zoomlevel", newZoom);
        currZoom = newZoom;
    }
});
