// Constants
const MAP_ID = 'map';
const MAP_DEFAULT_LATLONG = [25, 20];
const MAP_DEFAULT_ZOOM = 3;
const MAP_MAX_ZOOM = 19;
const GEOJSON_PATH = '../data/2023d-combined-simplified.json';
const GEOJSON_TZID = 'tzid';
const TILES_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILES_COPYRIGHT_URL = 'http://www.openstreetmap.org/copyright';
const TILES_ATTRIBUTION = `&copy; <a href="${TILES_COPYRIGHT_URL}">OpenStreetMap</a>`;

// Styles
const ZONE_STYLE_DEFAULT = {
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    dashArray: '3',
    fillColor: '#fd8d3c',
    fillOpacity: 0.1,
};
const ZONE_STYLE_HOVER = {
    color: '#666666',
    weight: 5,
    // opacity: 1,
    dashArray: '',
    // fillColor: '#fd8d3c',
    fillOpacity: 0.3,
};
const ZONE_STYLE_SELECTED = {
    // color: '#666666',
    weight: 5,
    // opacity: 1,
    dashArray: '',
    fillColor: '#0000ff',
    fillOpacity: 0.3,
};

// Selectors
let autoDetectedTimeZoneEl = document.getElementById('auto-detected-time-zone');
let selectedTimeZoneEl = document.getElementById('selected-time-zone');
let selectedTimeZoneCopyBtn = document.getElementById('selected-time-zone-copy-btn');
let hoveredTimeZoneEl = document.getElementById('hovered-time-zone');

// Variables
let autoDetectedTimeZone;
let map;
let geoJsonLayer, tileLayer;
let selectedZoneLayer;

init();

async function init() {
    // Auto-detect time zone
    autoDetectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (autoDetectedTimeZone) {
        autoDetectedTimeZoneEl.innerText = autoDetectedTimeZone;
        selectedTimeZoneEl.value = autoDetectedTimeZone;
    }

    // Set up copy button click event
    selectedTimeZoneCopyBtn.onclick = async () => {
        selectedTimeZoneEl.select();
        await navigator.clipboard.writeText(selectedTimeZoneEl.value);
    };

    map = L.map(MAP_ID).setView(MAP_DEFAULT_LATLONG, MAP_DEFAULT_ZOOM);

    // Create map tile layer
    tileLayer = L.tileLayer(TILES_URL, {
        maxZoom: MAP_MAX_ZOOM,
        attribution: TILES_ATTRIBUTION,
    }).addTo(map);

    // Create GeoJson layer
    let response = await fetch(GEOJSON_PATH);
    let json = await response.json();
    geoJsonLayer = L.geoJson(json, {
        style: _feature => ZONE_STYLE_DEFAULT,
        onEachFeature: initFeature,
    }).addTo(map);
}

function initFeature(_feature, zoneLayer) {
    // Set up zone layer events
    zoneLayer.on({
        mouseover: hoverOnZone,
        mouseout: hoverOffZone,
        click: clickZone,
    });

    if (zoneLayer.feature.properties[GEOJSON_TZID] == autoDetectedTimeZone) {
        clickZoneLayer(zoneLayer);
    } else {
        zoneLayer.bringToBack();
    }
}

function hoverOnZone(event) {
    let zoneLayer = event.target;

    hoveredTimeZoneEl.innerText = zoneLayer.feature.properties[GEOJSON_TZID];

    if (zoneLayer == selectedZoneLayer) {
        return;
    }

    zoneLayer.setStyle(ZONE_STYLE_HOVER);
    zoneLayer.bringToFront();
}

function hoverOffZone(event) {
    let zoneLayer = event.target;
    if (zoneLayer == selectedZoneLayer) {
        return;
    }

    geoJsonLayer.resetStyle(zoneLayer);
    zoneLayer.bringToBack();
}

function clickZone(event) {
    let zoneLayer = event.target;
    clickZoneLayer(zoneLayer);
}

function clickZoneLayer(zoneLayer) {
    // Reset the old selected layer
    if (selectedZoneLayer && selectedZoneLayer != zoneLayer) {
        geoJsonLayer.resetStyle(selectedZoneLayer);
        selectedZoneLayer.bringToBack();
    }

    zoneLayer.setStyle(ZONE_STYLE_SELECTED);
    zoneLayer.bringToFront();
    selectedZoneLayer = zoneLayer;
    selectedTimeZoneEl.value = zoneLayer.feature.properties[GEOJSON_TZID];
    map.fitBounds(zoneLayer.getBounds());
}
