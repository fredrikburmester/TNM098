import { defineStore } from 'pinia'

export const useAreasStore = defineStore({
    id: 'areas',
    state: () => ({
        areas: [],
        selectedArea: '',
    }),
    getters: {},
    actions: {},
})
