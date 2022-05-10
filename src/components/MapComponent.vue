<template>
    <div id="main__map"></div>
</template>

<script>
import 'echarts'
import { THEME_KEY } from 'vue-echarts'
import { defineComponent } from 'vue'
import geoJson from '@/assets/geoJson.json'
import * as echarts from 'echarts'
import { useAreasStore } from '@/stores/areas'
import { mapWritableState } from 'pinia'

export default defineComponent({
    name: 'HelloWorld',
    provide: {
        [THEME_KEY]: 'light',
    },
    data() {
        return {
            loading: false,
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas', 'reports', 'perLineData', 'selectedArea', 'areaNames']),
    },
    mounted() {
        let chartDom = document.getElementById('main__map')
        let myChart = echarts.init(chartDom, 'dark')
        echarts.registerMap('USA', geoJson)

        console.log(this.areas)

        let option = {
            title: {
                text: 'Areas',
                left: '0',
            },
            visualMap: {
                left: 'right',
                dimension: 1,
                min: 0,
                max: 18,
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                },
                text: ['High', 'Low'],
                calculable: true,
                outOfRange: {
                    color: 'blue',
                },
            },
            series: [
                {
                    name: 'USA PopEstimates',
                    type: 'map',
                    roam: true,
                    map: 'USA',
                    emphasis: {
                        label: {
                            show: true,
                        },
                    },
                    data: this.areas,
                },
            ],
        }

        myChart.setOption(option)

        myChart.on('click', (params) => {
            let id = this.getAreaId(params.name)

            if (id) {
                if (id === this.selectedArea) {
                    this.selectedArea = 0
                } else {
                    this.selectedArea = id
                }
            }

            console.log(this.selectedArea)
        })
    },
    methods: {
        generateRandomHexColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16)
        },
        getAreaId(name) {
            for (let area of this.areas) {
                if (area.name == name) {
                    return area.id
                }
            }
        },
    },
})
</script>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
#main__map {
    height: 500px;
    width: 100%;
    background-color: gray;
}
</style>
