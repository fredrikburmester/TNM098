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
import { useCategoriesStore } from '../stores/categories'

export default defineComponent({
    name: 'HelloWorld',
    provide: {
        [THEME_KEY]: 'light',
    },
    data() {
        return {
            loading: true,
            option: [],
            opacity: 0.2,
            keys: [],
            myChart: null,
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas', 'reports', 'perLineData', 'selectedArea', 'areaNames']),
        ...mapWritableState(useCategoriesStore, ['categories', 'selectedCategories', 'categoryNames', 'updateFreq', 'isPaused']),
    },
    mounted() {
        let chartDom = document.getElementById('main__map')
        this.myChart = echarts.init(chartDom, 'dark')
        echarts.registerMap('USA', geoJson)

        this.keys = Object.keys(this.reports).sort((a, b) => {
            return new Date(a) - new Date(b)
        })

        console.log(this.areas)
        console.log(this.reports)

        this.option = {
            title: {
                text: 'Areas',
                left: '0',
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                formatter: function(params) {
                    return  params.name + ': ' + params.value.toFixed(1)
                }
            },
            aria: {
                enabled: true,
            },
            visualMap: {
                left: 'right',
                min: 0,
                max: 10,
                inRange: {
                    color: [ '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
                },
                text: ['High', 'Low'],
                calculable: true,
            },
            series: [
                {
                    name: 'BABA',
                    type: 'map',
                    roam: false,
                    map: 'USA',
                    emphasis: { label: { 
                        show: true,
                        } 
                    },
                    data: [],
                },
            ],
        }
        this.myChart.setOption(this.option)
        this.myChart.on('click', (params) => {
            let id = this.getAreaId(params.name)
            if (id) {
                if (id === this.selectedArea) {
                    this.selectedArea = 1
                } else {
                    this.selectedArea = id
                }
            }
            //console.log(this.selectedArea)
        })
        this.updateChartTimer()
    },
    methods: {
        // Add values from this.reports to this.option.series[0].data
        updateChart(date) {

            // Extract data from current time
            this.option.series[0].data.forEach((oldReport) => {
                oldReport.itemStyle = { decal: { symbol: 'none' }}
            })

            let newReports = []
            this.reports[date].forEach((newReport) => {
                // Set necessary variables
                let id = parseFloat(newReport.loc)
                let location = this.getAreaName(id)
                let value = this.getValue(newReport)
                // If value does not exist, skip to next entry
                if (value === -1) return
                // If value for region does not exist, add it
                if (newReports.findIndex((item) => item.name === location) === -1) {
                    newReports.push({
                        name: location,
                        value: value,
                        itemStyle: { decal: { symbol: 'none' } },
                    })
                } else {
                    // If value for region does exist, add new value to it and then split it
                    newReports.find((item) => item.name === location).itemStyle = { decal: { symbol: 'none' } }
                    newReports.find((item) => item.name === location).value += value
                    newReports.find((item) => item.name === location).value /= 2
                }
            })

            // Add new data to chart
            this.option.series[0].data = newReports

            // Assign data to option
            this.myChart.setOption(this.option)
        },

        getAreaId(name) {
            for (let area of this.areas) {
                if (area.name == name) {
                    return area.id
                }
            }
        },

        getAreaName(id) {
            for (let area of this.areas) {
                if (area.id == id) {
                    return area.name
                }
            }
        },
        //Update chart every second
        updateChartTimer() {
            let i = -1
                setInterval(() => {
                if(!this.isPaused){
                    i++
                    this.updateChart(this.keys[i])
                }
                }, this.updateFreq)
        },

        // Get value for currently selected category
        getValue(entry) {
            let value = 0
            let count = 0
            for (let i = 0; i < 6; i++) {
                if (this.selectedCategories[i]) {
                    count++
                    value += entry[this.categories[i]]
                }
            }
            if (count === 0) return -1
            return value / count
        },
    },
})
</script>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    /* background-color: white; */
}
#main__map {
    height: 500px;
    width: 100%;
    background-color: gray;
}
</style>
