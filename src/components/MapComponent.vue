<template>
    <div id="main__map"></div>
</template>

<script setup>
import 'echarts'
import { onMounted, watch } from 'vue'
import geoJson from '@/assets/geoJson.json'
import * as echarts from 'echarts'
import { useAreasStore } from '@/stores/areas'
import { useCategoriesStore } from '../stores/categories'

let keys = []
let myChart = null
let areas = []
let i = -1

const categoriesStore = useCategoriesStore()
const areaStore = useAreasStore()
    


keys = Object.keys(areaStore.reports).sort((a, b) => {
    return new Date(a) - new Date(b)
})

let option = {
    title: {
        text: 'Areas',
        left: '0',
    },
    aria: {
        enabled: true,
    },
    visualMap: {
        left: 'right',
        min: 0,
        max: 10,
        inRange: {
            color: ['#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
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
            emphasis: {
                label: {
                    show: true,
                },
            },
            data: [],
            label: {
                show: true,
                position: 'top',
                color: 'black',
                fontSize: 10,
            },
        },
    ],
}

watch(categoriesStore.selectedCategories, (newVal, oldVal) => {
    console.log('hej')
})

onMounted(() => {
    let chartDom = document.getElementById('main__map')
    myChart = echarts.init(chartDom, 'dark')
    echarts.registerMap('USA', geoJson)

    myChart.setOption(option)
    myChart.on('click', (params) => {
        let id = getAreaId(params.name)
        if (id) {
            if (id === areaStore.selectedArea) {
                areaStore.selectedArea = 1
            } else {
                areaStore.selectedArea = id
            }
        }
    })
    updateChartTimer()
})
watch(categoriesStore.selectedCategories, (newVal, oldVal) => {
    console.log("Updated Chart")
    updateChart(keys[i])
})

   
// Add values from this.reports to this.option.series[0].data
const updateChart = (date) => {
    
    // Extract data from current time
    option.series[0].data.forEach((oldReport) => {
        oldReport.itemStyle = { decal: { symbol: 'none' } }
    })

    let newReports = []
    areaStore.reports[date].forEach((newReport) => {
        // Set necessary variables
        let id          = parseFloat(newReport.loc)
        let location    = getAreaName(id)
        let value       = getValue(newReport)
        // If value does not exist, skip to next entry
        if (value === -1) {
            return
        }
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
        // Add new data to chart
        option.series[0].data = newReports
        myChart.setOption(option)
        // Assign data to option
    })
}
const getAreaId = (name) => {
    for (let area of areas) {
        if (area.name == name) {
            return area.id
        }
    }
}

const getAreaName = (id) => {
    for (let area of areaStore.areas) {
        if (area.id == id) {
            return area.name
        }
    }
}
//Update chart every second
const updateChartTimer = () => {
    let j = 0
    setInterval(() => {
        if (!categoriesStore.isPaused && !(j % categoriesStore.updateFrequency)) {
            i++
            updateChart(keys[i])
        }
        j++
    }, 100)
}

// Get value for currently selected category
const getValue = (entry) => {
    let value = 0
    let count = 0
    for (let k = 0; k < 6; k++) {
        if (categoriesStore.selectedCategories[k]) {
            count++
            value += entry[categoriesStore.categories[k]]
        }
    }
    if (count === 0) return -1
    return value / count
}
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
