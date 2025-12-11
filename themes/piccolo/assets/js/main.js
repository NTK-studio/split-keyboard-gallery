
var features = ['split', 'encoder', 'track', 'display', 'wireless'];
var layouts = ['ergo', 'ortho', 'traditional', 'other'];


var mapKeyboard = function(keyboard) {
    return {
        name: keyboard.Name,
        minKeys: parseInt(keyboard.MinKeys),
        maxKeys: parseInt(keyboard.MaxKeys),
        keysRange: (keyboard.MinKeys === keyboard.MaxKeys) ? `${keyboard.MinKeys}` : `${keyboard.MinKeys} - ${keyboard.MaxKeys}`,
        website: keyboard.Website,
        websiteShield: `https://img.shields.io/website?url=${encodeURIComponent(keyboard.Website)}`,
        openHardware: keyboard.Website.startsWith('https://github.com'),
        note: keyboard.Note,
        // TODO error out on unknown features
        features: keyboard.Features.split(' ').filter(feature => features.includes(feature)),
        // layout: (keyboard.Layout in layouts) ? keyboard.Layout : 'other',
        layout: (layouts.includes(keyboard.Layout)) ? keyboard.Layout : 'other',
        imageUrl: keyboard.ImageUrl,
        thumbUrl: keyboard.ThumbUrl,
    }
}


document.addEventListener('alpine:init', () => {
    console.log('Alpine is initializing...');
    Alpine.data('combined', () => ({
        open: false,
        nameFilter: '',
        requiredFeatures: {
            split: true,
            encoder: false,
            track: false,
            display: false,
            wireless: false,
        },
        consideredLayouts: {
            ergo: true,
            ortho: true,
            traditional: true,
            other: false,
        },
        openHardwareOnly: false,
        minKeys: 0,
        maxKeys: 150,
        night: Alpine.$persist(true),
        theme() {
            return this.night ? '🌒' : '🌤';
        },
        keyboardData: window.sourceKeyboardData.map(mapKeyboard),
        filteredData() {
            var ret = this.keyboardData;

            if (this.nameFilter !== '') {
                ret = ret.filter(keyboard => keyboard.name.toLowerCase().includes(this.nameFilter.toLowerCase()));
            }

            ret = ret.filter(keyboard => keyboard.maxKeys >= parseInt(this.minKeys));
            ret = ret.filter(keyboard => keyboard.minKeys <= parseInt(this.maxKeys));

            for (const [feature, required] of Object.entries(this.requiredFeatures)) {
                if (required) {
                    ret = ret.filter(keyboard => keyboard.features.includes(feature));
                }
            }

            for (const [layout, considered] of Object.entries(this.consideredLayouts)) {
                if (! considered) {
                    ret = ret.filter(keyboard => keyboard.layout !== layout);
                }
            }

            if (this.openHardwareOnly) {
                ret = ret.filter(keyboard => keyboard.openHardware);
            }


            console.log(ret);
            return ret;
        },
        resultCount() {
            return this.filteredData().length;
        },
        toggle() {
            this.open = ! this.open
        },
    }))
})
