import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore({
    id: 'categories',
    state: () => ({
        isPaused: false,
        updateFrequency: 2,
        currentDataPoint: null,
        numberOfCategories: 6,
        categories: {
            0: 'sewer_and_water',
            1: 'power',
            2: 'roads_and_bridges',
            3: 'medical',
            4: 'buildings',
            5: 'shake_intensity',
        },
        categoriesEnum: {
            sewer_and_water: 0,
            power: 1,
            roads_and_bridges: 2,
            medical: 3,
            buildings: 4,
            shake_intensity: 5,
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
        // Map of selected categories allowing us to have multipile selected at once
        selectedCategories: {
            0: true,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
        },
    }),
    getters: {},
    actions: {
        setSelectedCategory(category) {
            this.state.selectedCategory = category
        },
    },
})
