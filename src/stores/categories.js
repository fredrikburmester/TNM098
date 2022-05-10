import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore({
    id: 'categories',
    state: () => ({
        categories: {
            0: 'sewer_and_water',
            1: 'power',
            2: 'roads_and_bridges',
            3: 'medical',
            4: 'buildings',
            5: 'shake_intensity',
        },
        categoryNames: {
            0: 'Sewer and Water',
            1: 'Power',
            2: 'Roads and Bridges',
            3: 'Medical',
            4: 'Buildings',
            5: 'Shake Intensity',
        },
        shake_intensity: 0,
        sewer_and_water: 0,
        power: 0,
        roads_and_bridges: 0,
        medical: 0,
        buildings: 0,
        selectedCategory: 0,
    }),
    getters: {},
    actions: {
        setSelectedCategory(category) {
            this.state.selectedCategory = category
        },
    },
})
