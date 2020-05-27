// Selectors
let selectedTimeZone = document.getElementById('selected-time-zone');
let autoDetectedTimeZone = document.getElementById('auto-detected-time-zone');
let hoveredTimeZone = document.getElementById('hovered-time-zone');
let selectedTimeZoneCopyBtn = document.getElementById('selected-time-zone-copy-btn');

// Auto-detect time zone
let zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (zone) {
    autoDetectedTimeZone.innerText = zone;
    selectedTimeZone.value = zone;
}

// Set up map
$('#map').timezonePicker({
    // Disable select box
    selectBox: false,
    // Disable quick link
    quickLink: [],
    // Disable default hover text
    showHoverText: false,
    // Custom hover function
    hoverText: function (e, data) {
        hoveredTimeZone.innerText = data.timezone;
        return;
    },
    defaultValue: { value: zone, attribute: 'timezone' },
});

// Set up map listener
$('#map').on('map:value:changed', function () {
    let selected = $('#map').data('timezonePicker').getValue()[0];
    if (selected && selected.timezone) {
        selectedTimeZone.value = selected.timezone;
    }
});

selectedTimeZoneCopyBtn.onclick = function () {
    selectedTimeZone.select();
    document.execCommand('copy');
};
