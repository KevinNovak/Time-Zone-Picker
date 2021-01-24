// Selectors
let autoDetectedTimeZone = document.getElementById('auto-detected-time-zone');
let selectedTimeZone = document.getElementById('selected-time-zone');
let selectedTimeZoneCopyBtn = document.getElementById('selected-time-zone-copy-btn');
let hoveredTimeZone = document.getElementById('hovered-time-zone');
let utcstring = (x) => {return (x >=0 ? " UTC+" : " UTC")};


// Auto-detect time zone
let stdData = Intl.DateTimeFormat().resolvedOptions();
let stdOffset = - new Date().getTimezoneOffset()/60;
if (stdData) {
    autoDetectedTimeZone.innerText = stdData.timeZone + utcstring(stdOffset) + stdOffset;
    selectedTimeZone.value = stdData.timeZone + utcstring(stdOffset) + stdOffset;
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
        hoveredTimeZone.innerText = data.timezone + utcstring(data.offset) + data.offset;
        return;
    }
});

// Set up map listener
$('#map').on('map:value:changed', function () {
    let selected = $('#map').data('timezonePicker').getValue()[0];
    if (selected && selected.timezone) {
        selectedTimeZone.value = selected.timezone + utcstring(selected.offset) + selected.offset;;
    }
});


function copy(){
    selectedTimeZone.select();
    selectedTimeZone.setSelectionRange(0, 99999);
    document.execCommand('copy');
}
