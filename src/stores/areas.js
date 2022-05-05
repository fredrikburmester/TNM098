import { defineStore } from 'pinia'

export const useAreasStore = defineStore({
    id: 'areas',
    state: () => ({
        areas: [],
        selectedArea: '',
        reports: null,
    }),
    getters: {},
    actions: {},
})
