document.addEventListener('alpine:init', () => {
    console.log('Alpine is initializing...')
    Alpine.data('combined', () => ({
        open: false,
        night: Alpine.$persist(true),
        toggle() {
            this.open = ! this.open
        },
    }))
})
