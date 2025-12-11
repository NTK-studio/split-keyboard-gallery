
var features = ['split', 'encoder', 'track', 'display', 'wireless'];


var mapKeyboard = function(keyboard) {
    return {
        name: keyboard.Name,
        minKeys: parseInt(keyboard.MinKeys),
        maxKeys: parseInt(keyboard.MaxKeys),
        website: keyboard.Website,
        note: keyboard.Note,
        // TODO error out on unknown features
        features: keyboard.Features.split(' ').filter(feature => features.includes(feature))
    }
}


document.addEventListener('alpine:init', () => {
    console.log('Alpine is initializing...');
    Alpine.data('combined', () => ({
        open: false,
        nameFilter: '',
        requiredFeatures: {
            split: false,
            encoder: false,
            track: false,
            display: false,
            wireless: false,
        },
        minKeys: 0,
        maxKeys: 150,
        night: Alpine.$persist(true),
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
