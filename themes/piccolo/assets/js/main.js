
var features = ['split', 'encoder', 'track', 'display', 'wireless'];
var layouts = ['ergo', 'dish', 'ortho', 'traditional', 'other'];
var availabilities = ['source', 'kit', 'assembled', 'massproduced', 'unavailable']

var permalinkedKeys = [
    'nameFilter',
    'features',
    'layouts',
    'availability',
    'sortedBy',
    'sortedDir',
    'minKeys',
    'maxKeys'
]

var getPermalinkedKeys = function(source) {
    var obj = {};
    for (const key of permalinkedKeys) {
        // check if the key is there in the source
        if (key in source) {
            obj[key] = source[key];
        }
    }
    return obj;
}

var fixAvailabilities = function(options) {
    // check if the array is empty
    if (options.length === 0) {
        return ['unavailable'];
    } else if (options.includes('unavailable') && options.length > 1) {
        return ['unavailable'];
    } else {
        return options;
    }
}

var readPermalink = function() {
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("permalink")) {
        var encoded = searchParams.get("permalink");
        if (typeof encoded === 'string' && encoded.length > 0) {
            var decoded = atob(encoded);
            parsed = JSON.parse(decoded);
            if (typeof parsed === 'object' && parsed !== null) {
                return getPermalinkedKeys(parsed);
            }
        }
    }
    return {}
}


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
        availabilities: fixAvailabilities(keyboard.Availability.split(' ').filter(av => availabilities.includes(av))),
        // layout: (keyboard.Layout in layouts) ? keyboard.Layout : 'other',
        layout: (layouts.includes(keyboard.Layout)) ? keyboard.Layout : 'other',
        imageUrl: keyboard.ImageUrl,
        thumbUrl: keyboard.ThumbUrl,
        bigThumbUrl: keyboard.BigThumbUrl,
    }
}

var keyboardData = window.sourceKeyboardData.map(mapKeyboard);
var minKeys = Math.min(...keyboardData.map(kb => kb.minKeys));
var maxKeys = Math.max(...keyboardData.map(kb => kb.maxKeys));

// console.log(`Minimum keys across all keyboards: ${minKeys}`);

var actualSortValue = function(keyboard, sortedBy, sortedDir) {
    if (sortedBy === 'featuresCount') {
        return keyboard.features.length;
    }
    if (sortedBy === 'availability') {
        return keyboard.availabilities.filter(av => av != 'unavailable').length;
    }
    if (sortedBy === 'keys' && sortedDir > 0) {
        return keyboard.minKeys;
    }
    if (sortedBy === 'keys' && sortedDir < 0) {
        return keyboard.maxKeys;
    }
    return keyboard[sortedBy];
}


document.addEventListener('alpine:init', () => {
    // console.log('Alpine is initializing...');

    var permalinkData = readPermalink();
    console.log('Permalink data:', permalinkData);

    Alpine.data('combined', () => (Object.assign({
        nameFilter: '',
        features: {
            split: true,
            encoder: null,
            track: null,
            display: null,
            wireless: null,
        },
        filterClass(filterVal) {
            if (filterVal === true) {
                return 'yes';
            } else if (filterVal === false) {
                return 'no';
            } else {
                return 'maybe';
            }
        },
        toggleFeature(feature) {
            var current = this.features[feature];
            if (current === true) {
                this.features[feature] = false;
            } else if (current === false) {
                this.features[feature] = null;
            } else {
                this.features[feature] = true;
            }
        },
        layouts: {
            ergo: true,
            dish: true,
            ortho: true,
            traditional: true,
            other: false,
        },
        toggleLayout(layout) {
            var current = this.layouts[layout];
            if (current === true) {
                this.layouts[layout] = false;
            } else {
                this.layouts[layout] = true;
            }
        },
        availability: {
            source: null,
            kit: null,
            assembled: null,
            massproduced: null,
            unavailable: false,
        },
        toggleAvailability(option) {
            var current = this.availability[option];
            if (current === true) {
                this.availability[option] = false;
            } else if (current === false) {
                this.availability[option] = null;
            } else {
                this.availability[option] = true;
            }
        },
        sortedBy: 'name',
        sortedDir: 1,
        sortBy(field) {
            if (this.sortedBy === field) {
                this.sortedDir = this.sortedDir * -1;
            } else {
                this.sortedBy = field;
                this.sortedDir = 1;
            }
        },
        openHardwareOnly: false,
        minKeys: minKeys,
        maxKeys: maxKeys,
        night: Alpine.$persist(true),
        theme() {
            return this.night ? '🌒' : '🌤';
        },
        permalink(dataProxy) {
            var obj = getPermalinkedKeys(dataProxy);

            // console.log(JSON.stringify(obj))
            var encoded = btoa(JSON.stringify(obj))
            // console.log(encoded)
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set("permalink", encoded);
            var basePath = window.location.toString().replace(window.location.search, "")
            return `${basePath}?${searchParams.toString()}`;
        },
        keyboardData: keyboardData,
        filteredData() {
            var ret = this.keyboardData;

            if (this.nameFilter !== '') {
                ret = ret.filter(keyboard => keyboard.name.toLowerCase().includes(this.nameFilter.toLowerCase()));
            }

            ret = ret.filter(keyboard => keyboard.maxKeys >= parseInt(this.minKeys));
            ret = ret.filter(keyboard => keyboard.minKeys <= parseInt(this.maxKeys));

            for (const [av, flt] of Object.entries(this.availability)) {
                if (flt === true) {
                    ret = ret.filter(keyboard => keyboard.availabilities.includes(av));
                } else if (flt === false) {
                    ret = ret.filter(keyboard => !keyboard.availabilities.includes(av));
                }
            }

            for (const [feature, flt] of Object.entries(this.features)) {
                if (flt === true) {
                    ret = ret.filter(keyboard => keyboard.features.includes(feature));
                } else if (flt === false) {
                    ret = ret.filter(keyboard => !keyboard.features.includes(feature));
                }
            }

            for (const [layout, considered] of Object.entries(this.layouts)) {
                if (! considered) {
                    ret = ret.filter(keyboard => keyboard.layout !== layout);
                }
            }

            if (this.openHardwareOnly) {
                ret = ret.filter(keyboard => keyboard.openHardware);
            }

            ret = ret.sort((a, b) => {
                let valA = actualSortValue(a, this.sortedBy, this.sortedDir);
                let valB = actualSortValue(b, this.sortedBy, this.sortedDir);

                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) {
                    return -1 * this.sortedDir;
                } else if (valA > valB) {
                    return 1 * this.sortedDir;
                } else {
                    return 0;
                }
            });

            return ret;
        },
        resultCount() {
            return this.filteredData().length;
        },
    }, permalinkData)))
})
