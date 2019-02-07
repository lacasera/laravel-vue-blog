const eventBus = {
    install(Vue, options) {
        Vue.prototype.$eventBus = new Vue({
            methods: {
                signUp() {
                   this.$emit('sign-up')
                },
                signIn() {
                    this.$emit('sign-in')
                },
                search(value) {
                    this.$emit('search', value)
                }
            }
        })

    }
}

export default eventBus