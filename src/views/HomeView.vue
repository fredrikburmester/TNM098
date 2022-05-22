<template>
    <div v-if="!loading" class="grid grid-rows-2 p-4" style="background-color: #100c2a">
        <div class="grid grid-cols-3 gap-4">
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
        <div>
            <HeatMap />
            <!-- <CandleChart /> -->
        </div>
    </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import MapComponent from '../components/MapComponent.vue'
import OptionsComponent from '../components/OptionsComponent.vue'
import PriorityList from '../components/PriorityList.vue'
import geoJson from '@/assets/geoJson.json'
import { useAreasStore } from '@/stores/areas'
import CandleChart from '../components/CandleChart.vue'
import HeatMap from '../components/HeatMap.vue'

export default {
    components: { MapComponent, OptionsComponent, PriorityList, CandleChart, HeatMap },
    props: {},
    data() {
        return {
            loading: true,
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas', 'reports', 'perLineData', 'areaNames']),
    },
    async mounted() {
        let local_areas = []
        let local_area_names = []

        for (let area of geoJson.features) {
            let id = area.properties.loc
            let name = area.properties.name

            local_area_names.push({ id: id, name: name })

            local_areas.push({
                id,
                name,
                color: this.generateRandomColor(),
                priority: 0,
                reports: [],
            })
        }

        console.log(local_area_names)

        let lines
        await fetch('mc1-reports-data.txt')
            .then((res) => res.text())
            .then((data) => {
                lines = data.split('\n')
            })

        this.perLineData = lines.map((line) => {
            let obj = {}
            let parts = line.split(',')
            obj.datetime = parts[0]
            obj.sewer_and_water = parts[1]
            obj.power = parts[2]
            obj.roads_and_bridges = parts[3]
            obj.medical = parts[4]
            obj.buildings = parts[5]
            obj.shake_intensity = parts[6]
            obj.location = parts[7]

            return obj
        })

        // sort this.perLineData based on datetime
        this.perLineData.sort((a, b) => {
            return new Date(a.datetime) - new Date(b.datetime)
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
            let loc = parseInt(report_data[7]) || -1

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
