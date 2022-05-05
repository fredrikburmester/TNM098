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
        ...mapWritableState(useAreasStore, ['areas', 'reports']),
    },
    async mounted() {
        let local_areas = []

        for (let area of geoJson.features) {
            let id = area.properties.loc
            let name = area.properties.name

            local_areas.push({
                id,
                name,
                color: this.generateRandomColor(),
                priority: 0,
                reports: [],
            })
        }

        let lines
        await fetch('mc1-reports-data.txt')
            .then((res) => res.text())
            .then((data) => {
                lines = data.split('\n')
            })

        let reports = {}

        for (let r of lines) {
            let report_data = r.split(',')

            let date = report_data[0]
            let sewer_and_water = parseFloat(report_data[1] || -1)
            let power = parseFloat(report_data[2] || -1)
            let roads_and_bridges = parseFloat(report_data[3] || -1)
            let medical = parseFloat(report_data[4] || -1)
            let buildings = parseFloat(report_data[5] || -1)
            let shake_intensity = parseFloat(report_data[6] || -1)
            let loc = report_data[7]

            let report = {
                sewer_and_water,
                power,
                roads_and_bridges,
                medical,
                buildings,
                shake_intensity,
                loc,
            }

            if (reports[date]) {
                reports[date].push(report)
            } else {
                reports[date] = [report]
            }
        }

        this.reports = reports
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
