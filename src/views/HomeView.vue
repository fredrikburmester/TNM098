<template>
    <div v-if="!loading" class="grid grid-rows-2">
        <div class="grid grid-cols-3">
            <div>
                <OptionsComponent />
            </div>
            <div>
                <MapComponent />
            </div>
            <div>
                <PriorityList />
            </div>
        </div>
        <div class="">
            <HeatMap />
        </div>
    </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import HeatMap from '../components/HeatMap.vue'
import MapComponent from '../components/MapComponent.vue'
import OptionsComponent from '../components/OptionsComponent.vue'
import PriorityList from '../components/PriorityList.vue'
import geoJson from '@/assets/geoJson.json'
import { useAreasStore } from '@/stores/areas'

export default {
    components: { HeatMap, MapComponent, OptionsComponent, PriorityList },
    props: {},
    data() {
        return {
            loading: true,
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas']),
    },
    mounted() {
        let local_areas = []
        console.log(geoJson)

        for (let area of geoJson.features) {
            let id = area.properties.loc
            let name = area.properties.name

            local_areas.push({
                id,
                name,
                color: this.generateRandomColor(),
                priority: 0,
            })
        }

        console.log(local_areas)
        this.areas = local_areas

        this.loading = false
    },
    methods: {
        generateRandomColor() {
            let letters = '0123456789ABCDEF'
            let color = '#'
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)]
            }
            return color
        },
    },
}
</script>

<style scoped></style>
