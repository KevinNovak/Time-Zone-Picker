let zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Selectors
let selectedTimeZone = document.getElementById('selected-time-zone');
let hoveredTimeZone = document.getElementById('hovered-time-zone');
let selectedTimeZoneCopyBtn = document.getElementById('selected-time-zone-copy-btn');

// Set default value to current zone
if (zone) {
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
$('#map').on('map:value:changed', () => {
    let selectedValue = $('#map').data('timezonePicker').getValue()[0]?.timezone;
    if (selectedValue) {
        selectedTimeZone.value = selectedValue;
    }
});

selectedTimeZoneCopyBtn.onclick = () => {
    selectedTimeZone.select();
    document.execCommand('copy');
};
