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
            data: [],
        }
    },
    computed: {
        ...mapWritableState(useAreasStore, ['areas', 'reports', 'perLineData', 'selectedArea', 'areaNames']),
        ...mapWritableState(useCategoriesStore, ['categories', 'selectedCategory', 'categoryNames', 'categoriesEnum', 'selectedCategories']),
    },
    mounted() {
        let chartDom = document.getElementById('main__linechart2')
        this.myChart = echarts.init(chartDom)
        this.data = this.getDataPerLocation(this.selectedArea)
        this.option = {
            scales: {
                yAxes: [
                    {
                        display: true,
                        stacked: true,
                        ticks: {
                            min: 0, // minimum value
                            max: 10, // maximum value
                        },
                    },
                ],
            },
            xAxis: {
                data: [],
            },
            yAxis: {},
            series: [
                {
                    type: 'candlestick',
                    data: [],
                },
            ],
        }

        this.myChart.setOption(this.option)

        this.run2()
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
        getAllReportsPerLocation(location) {
            let result = []

            for (let i = 0; i < this.perLineData.length; i++) {
                if (this.perLineData[i].location == location) {
                    result.push(this.perLineData[i])
                }
            }
            return result
        },
        run() {
            const data = this.data
            const dates = Object.keys(this.reports).sort((a, b) => {
                return new Date(a) - new Date(b)
            })

            let currentDates = []
            let currentData = []

            let i = 0
            let j = 0
            setInterval(() => {
                const currentDateTime = dates[i]
                currentDates.push(currentDateTime)

                if (data[j].datetime == currentDateTime) {
                    const datapoint = parseFloat(data[j][this.categories[this.selectedCategory]])
                    currentData.push([datapoint, datapoint, datapoint, datapoint])
                    j++
                } else {
                    currentData.push([])
                }

                this.option.series[0].data = currentData.slice(i - 20, i)

                if (i < 20) {
                    this.option.xAxis.data = currentDates.slice(0, i)
                } else {
                    this.option.xAxis.data = currentDates.slice(i - 20, i)
                }

                this.myChart.setOption(this.option)

                i++
            }, 1000)
        },
        run2() {
            const dates = Object.keys(this.reports).sort((a, b) => {
                return new Date(a) - new Date(b)
            })

            let currentData = []
            let currentDates = []

            let i = 0
            setInterval(() => {
                const currentDateTime = dates[i]
                currentDates.push(currentDateTime)

                const currentReports = this.reports[currentDateTime]

                let lowValue = null
                let highValue = null
                for (let i = 0; i < currentReports.length; i++) {
                    const r = currentReports[i]

                    if (r.loc != this.selectedArea) {
                        continue
                    }

                    let value = parseInt(r[this.categories[this.selectedCategory]])

                    if (value > 0) {
                        if (i == 0) {
                            lowValue = value
                            highValue = value
                        } else {
                            if (value < lowValue) {
                                lowValue = value
                            }
                            if (value > highValue) {
                                highValue = value
                            }
                        }
                    }
                }

                if (lowValue != null && highValue != null) {
                    if (lowValue != highValue) {
                        let medianValue = (highValue + lowValue) / 2

                        if (medianValue >= 1 && medianValue <= 9) {
                            currentData.push([medianValue - 0.5, medianValue + 0.5, lowValue, highValue])
                        } else {
                            currentData.push([lowValue - 0.5, highValue + 0.5, lowValue - 0.5, highValue + 0.5])
                        }
                    } else {
                        currentData.push([lowValue - 0.5, highValue + 0.5, lowValue - 0.5, highValue + 0.5])
                    }
                } else {
                    currentData.push([])
                }

                this.option.series[0].data = currentData.slice(i - 20, i)
                if (i < 20) {
                    this.option.xAxis.data = currentDates.slice(0, i)
                } else {
                    this.option.xAxis.data = currentDates.slice(i - 20, i)
                }

                this.myChart.setOption(this.option)
                i++
            }, 1000)
        },
        getDataPerCategory(category) {
            let data = this.perLineData.map((report) => {
                return {
                    value: parseFloat(report[this.categories[category]]),
                    datetime: report.datetime,
                }
            })
            return data
        },
        getNumberOfReportsPerDataPoint(dateTime) {
            return this.reports[dateTime].length
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
