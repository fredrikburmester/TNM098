import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        authenticated: useLocalStorage('authenticated', false),
    }),
    hydrate(storeState) {
        storeState.authenticated = useLocalStorage('authenticated', false)
    },
    getters: {
        isAuthenticated: (state) => state.authenticated,
    },
    actions: {

    },
})
