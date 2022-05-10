import { defineStore } from 'pinia'

export const useAreasStore = defineStore({
    id: 'areas',
    state: () => ({
        areaNames: {},
        areas: [],
        selectedArea: 1,
        reports: null,
        perLineData: null,
    }),
    getters: {},
    actions: {},
})
