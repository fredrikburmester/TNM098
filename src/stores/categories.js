import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore({
    id: 'categories',
    state: () => ({
        categories: ['shake_intensity', 'sewer_and_water', 'power', 'roads_and_bridges', 'medical', 'buildings', 'selectedCategory'],
        shake_intensity: 0,
        sewer_and_water: 0,
        power: 0,
        roads_and_bridges: 0,
        medical: 0,
        buildings: 0,
        selectedCategory: '',
    }),
    getters: {},
    actions: {},
})
