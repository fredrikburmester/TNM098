<script>
// import 'echarts'
import { defineComponent } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import * as echarts from 'echarts'
import { useAreasStore } from '@/stores/areas'

import { mapWritableState } from 'pinia'

export default defineComponent({
    name: 'HeatMap',
    data() {
        return {
            loading: true,
            option: [],
            opacity: 0.2,
            keys: [],
            myChart: null,
            legendData: [],
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas', 'reports', 'perLineData', 'selectedArea', 'areaNames']),
        ...mapWritableState(useCategoriesStore, ['categories', 'selectedCategory', 'categoryNames', 'categoriesEnum']),
    },
    mounted() {
        let chartDom = document.getElementById('main__linechart2')
        this.myChart = echarts.init(chartDom)

        this.keys = Object.keys(this.reports).sort((a, b) => {
            return new Date(a) - new Date(b)
        })

        this.legendData = Object.values(this.categoryNames)

        this.option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(0,0,0,0.2)',
                        width: 1,
                        type: 'solid',
                    },
                },
            },
            legend: {
                data: this.legendData,
            },
            singleAxis: {
                top: 50,
                bottom: 50,
                axisTick: {},
                axisLabel: {},
                type: 'time',
                axisPointer: {
                    animation: true,
                    label: {
                        show: true,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        opacity: 0.2,
                    },
                },
            },
            series: [
                {
                    type: 'themeRiver',
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.8)',
                        },
                    },
                    data: [['2015/11/08', 10, 'DQ']],
                },
            ],
        }

        this.myChart.setOption(this.option)

        console.log(this.getDataPerCategory(this.categoriesEnum.sewer_and_water))

        this.run()
    },
    methods: {
        getDataPerLocation(location) {
            let result = []

            for (let i = 0; i < this.perLineData.length; i++) {
                if (this.perLineData[i].location == location) {
                    if (i > 0 && this.perLineData[i].datetime == this.perLineData[i - 1].datetime) {
                        try {
                            result[i - 1].sewer_and_water = (this.perLineData[i].sewer_and_water + this.perLineData[i - 1].sewer_and_water) / 2
                            result[i - 1].power = (this.perLineData[i].power + this.perLineData[i - 1].power) / 2
                            result[i - 1].roads_and_bridges = (this.perLineData[i].roads_and_bridges + this.perLineData[i - 1].roads_and_bridges) / 2
                            result[i - 1].medical = (this.perLineData[i].medical + this.perLineData[i - 1].medical) / 2
                            result[i - 1].buildings = (this.perLineData[i].buildings + this.perLineData[i - 1].buildings) / 2
                            result[i - 1].shake_intensity = (this.perLineData[i].shake_intensity + this.perLineData[i - 1].shake_intensity) / 2
                        } catch (e) {
                            console.log(e)
                        }
                    } else {
                        result.push(this.perLineData[i])
                    }
                }
            }
            return result
        },
        run() {
            const sewer_and_water_Data = this.getDataPerCategory(0)
            const power_Data = this.getDataPerCategory(1)
            const roads_and_bridges_Data = this.getDataPerCategory(2)
            const medical_Data = this.getDataPerCategory(3)
            const buildings_Data = this.getDataPerCategory(4)
            const shake_intensity_Data = this.getDataPerCategory(5)

            let dataSets = [sewer_and_water_Data, power_Data, roads_and_bridges_Data, medical_Data, buildings_Data, shake_intensity_Data]

            console.log(dataSets)

            let currentData = []

            let i = 0
            let j = 0
            setInterval(() => {
                for (let dataSet of dataSets) {
                    if (dataSet[j].datetime == this.keys[i]) {
                        currentData.push(dataSet[j])
                        j++
                    } else {
                        // currentData.push(null)
                    }
                }

                console.log(currentData)

                this.option.series[0].data = currentData
                    .map((report) => {
                        if (report == null) {
                            return null
                        } else {
                            return parseFloat(report.sewer_and_water)
                        }
                    })
                    .slice(i - 10, i)

                this.myChart.setOption(this.option)

                i++
            }, 1000)
        },
        getDataPerCategory(category) {
            let data = this.perLineData.map((report) => {
                return [report.datetime, parseFloat(report[this.categories[category]]), this.categoryNames[category]]
            })
            return data
        },
    },
})
</script>

<template>
    <div>
        <div id="main__linechart2"></div>
    </div>
</template>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
#main__linechart2 {
    height: 500px;
    width: 100%;
}
#loading-spinner {
    position: absolute;
    top: 30%;
    left: 50%;
}
</style>
