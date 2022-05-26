<template>
    <div id="header" class="">
        <h1 class="text-white text-3xl text-bold">{{ getAreaName(areasStore.selectedArea) }}</h1>
        <p class="text-white">{{ formatDateTime(categoriesStore.currentDataPoint) }}</p>
        <button class="btn btn-sm text-white my-4" :style="categoriesStore.isPaused ? 'background-color: red' : 'background-color: green'" @click="pause">
            Pause
        </button>
        <p class="text-white">Speed: {{ categoriesStore.updateFrequency }}s</p>
        <input id="updatefreq" v-model="categoriesStore.updateFrequency" type="range" name="updatefreq" min="1" max="10" />
    </div>
</template>

<script setup>
import { useAreasStore } from '../stores/areas'
import { useCategoriesStore } from '../stores/categories'

const areasStore = useAreasStore()
const categoriesStore = useCategoriesStore()

const pause = () => {
    categoriesStore.isPaused = !categoriesStore.isPaused
}
const getAreaName = (id) => {
    return areasStore.areas.find((area) => area.id === id).name
}

const formatDateTime = (datetime) => {
    if (datetime == null) return ''
    return new Date(datetime).toLocaleString()
}
</script>

<style scoped>
#header {
    height: 100px;
}
</style>
