<template>
    <div id="header" class="">
        <h1 class="text-white text-3xl text-bold">{{ getAreaName(areasStore.selectedArea) }}</h1>
        <p class="text-white">{{ formatDateTime(categoriesStore.currentDataPoint) }}</p>
        <button class="btn btn-sm btn-error my-4" @click="pause">Pause</button>
    </div>
</template>

<script setup>
import { useAreasStore } from '../stores/areas'
import { useCategoriesStore } from '../stores/categories'

const areasStore = useAreasStore()
const categoriesStore = useCategoriesStore()

const pause = () => {
    console.log('pause')
    categoriesStore.isPaused = !categoriesStore.isPaused
}
const getAreaName = (id) => {
    console.log(areasStore.areas)
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
