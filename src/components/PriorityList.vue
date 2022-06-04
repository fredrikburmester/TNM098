<template>
    <h1 class="text-white font-bold text-xl">Priority List</h1>
    <div id="main__priority_list"></div>
</template>

<script setup>
import 'echarts'
import * as echarts from 'echarts'
import { useAreasStore } from '@/stores/areas'
import { useCategoriesStore } from '../stores/categories'
import { watch } from 'vue'

import { onMounted } from 'vue'

const categoriesStore = useCategoriesStore()
const areaStore = useAreasStore()

let keys = []
let myChart = null
let areasAndScore = []
let areas = []
let latestKey = 0;

for (let area of areaStore.areas) {
    let obj = []
    obj.push(0)
    obj.push(area.name)
    areas.push(obj)
}

keys = Object.keys(areaStore.reports).sort((a, b) => {
    return new Date(a) - new Date(b)
})

const dimension = 0

let option = {
    grid: {
        top: 10,
        bottom: 30,
        left: 150,
        right: 80,
    },
    xAxis: {
        max: 10,
        axisLabel: {
            formatter: function (n) {
                return n
            },
        },
    },
    dataset: {
        source: areas,
    },
    yAxis: {
        type: 'category',
        inverse: true,
        max: 18,
        axisLabel: {
            show: true,
            fontSize: 14,
            formatter: (value) => {
                return value
            },
            rich: {
                flag: {
                    fontSize: 25,
                    padding: 1,
                },
            },
        },
    },
    series: [
        {
            realtimeSort: true,
            seriesLayoutBy: 'column',
            type: 'bar',
            itemStyle: {
                color: function (param) {
                    return param.value[1]
                },
            },
            encode: {
                x: dimension,
                y: 3,
            },
            label: {
                show: true,
                precision: 1,
                position: 'right',
                valueAnimation: true,
                fontFamily: 'monospace',
            },
        },
    ],
}

onMounted(() => {
    var chartDom = document.getElementById('main__priority_list')
    myChart = echarts.init(chartDom, 'dark')
    myChart.setOption(option)
    updateChartTimer()
})

watch(categoriesStore.selectedCategories, (newVal, oldVal) => {
    updateChart(null);
})

const updateChartTimer = () => {
    let i = -1
    let j = 0
    setInterval(() => {
        if (!categoriesStore.isPaused && !(j % categoriesStore.updateFrequency)) {
            i++
            updateChart(keys[i])
        }
        j++
    }, 100)
}

const updateChart = (key) => {
    if (key === null) {
        key = latestKey;
    }
    latestKey = key;    
    areasAndScore = []
    let numberOfReportsMap = {}
    let maxNumberOfReports = 0
    for (let area of areaStore.areas) {
        let score = 0
        let count = 0
        let relevantReports = areaStore.reports[key].filter((r) => r.loc === area.id)
        // Go through this relevantReport at location area.name and accumulate a score
        Object.keys(categoriesStore.categories).forEach((category) => {
            // Is this category toggled?
            if (categoriesStore.selectedCategories[category]) {
                relevantReports.forEach((report) => {
                    if (report[categoriesStore.categories[category]] != -1) {
                        score += report[categoriesStore.categories[category]]
                        count++
                    }
                })
            }
        })

        // Take the average
        if (count > 1) score = score / count

        // Save how many reports each area.id has, used for weighing later
        numberOfReportsMap[area.name] = relevantReports.length
        // Save the max number of reports, used for weighing later
        maxNumberOfReports = relevantReports.length > maxNumberOfReports ? relevantReports.length : maxNumberOfReports

        // Finally add to our areas and score array
        let obj = []
        obj.push(score)
        obj.push(area.name)
        areasAndScore.push(obj)
    }

    Object.keys(numberOfReportsMap).forEach((areaName) => {
        if (maxNumberOfReports !== 0) {
            // Calculate weight factor
            const weightFactor = 1 + numberOfReportsMap[areaName] / maxNumberOfReports
            // Make sure weight factor affects score for areaName
            let objIndex = areasAndScore.findIndex((e) => e[1] == areaName)
            areasAndScore[objIndex][0] *= weightFactor
            areasAndScore[objIndex][0] *= 0.5
        }
    })

    myChart.setOption({
        ...myChart.option,
        dataset: {
            source: areasAndScore,
        },
    })
}
</script>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
#main__priority_list {
    height: 500px;
    width: 100%;
}
</style>
