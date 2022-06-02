<script>
import 'echarts'
import { defineComponent, watch } from 'vue'
import { useAreasStore } from '@/stores/areas'
import { useCategoriesStore } from '@/stores/categories'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
    name: 'HeatMap',

    components: {},
    setup() {
        const areasStore = useAreasStore()
        const categoriesStore = useCategoriesStore()
        const keys = Object.keys(areasStore.reports).sort((a, b) => {
            return new Date(a) - new Date(b)
        })

        const categoryNames = Object.values(categoriesStore.categoryNames)
        const getDataPerLocation = (location) => {
            let data = []
            let dataPerLocation = areasStore.perLineData.filter((report) => report.location == location)
            let previousDatetime = null
            let count = 1
            for (let i in dataPerLocation) {
                const report = dataPerLocation[i]

                if (i == 0) {
                    Object.keys(pastReport).forEach((key) => {
                        data.push([report.datetime, 0, parseFloat(report[key]) || 0])
                    })
                    continue
                }

                const pastReport = dataPerLocation[i - 1]
                if (report.datetime == previousDatetime) {
                    count++
                    Object.keys(pastReport).forEach((key) => {
                        pastReport[key] += report[key]
                    })
                } else if (count) {
                    Object.keys(pastReport).forEach((key) => {
                        pastReport[key] = pastReport[key] / count
                    })
                } else {
                    Object.keys(pastReport).forEach((key) => {
                        data.push([report.datetime, 0, parseFloat(report[key]) || 0])
                    })
                }

                previousDatetime = report.datetime
            }
            console.log(data)
            return data
        }

        const getOptionsPerArea = (area) => {
            return {
                tooltip: {
                    position: 'top',
                },
                toolbox: {},
                dataset: {
                    source: getDataPerLocation(area),
                },
                dataZoom: [
                    {
                        type: 'inside',
                    },
                    {
                        type: 'slider',
                        top: '70%',
                    },
                ],
                grid: {
                    height: '50%',
                    top: '10%',
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    splitArea: {
                        show: false,
                    },
                    axisLabel: {
                        formatter: function (value) {
                            return value // `${new Date(value).getFullYear()}/${new Date(value).getMonth() + 1}/${new Date(value).getDate()}`
                        },
                    },
                },
                yAxis: {
                    type: 'category',
                    data: categoryNames,
                    splitArea: {
                        show: true,
                    },
                },
                visualMap: {
                    min: 0,
                    max: 10,
                    calculable: true,
                    orient: 'vertical',
                    right: '5%',
                    bottom: '40%',
                    inRange: {
                        color: ['#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'], //From smaller to bigger value ->
                    },
                },
                series: [
                    {
                        name: 'Heat Map',
                        type: 'heatmap',
                        label: {
                            show: false,
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            }
        }

        var myChart1
        let numberOfDataPointsToShow = 100
        let i = 1
        let option1

        watch(
            () => areasStore.selectedArea,
            (val) => {
                console.log('hej', val)

                option1 = getOptionsPerArea(areasStore.selectedArea)

                if (i < numberOfDataPointsToShow) {
                    option1.xAxis.data = keys.slice(0, i)
                } else {
                    option1.xAxis.data = keys.slice(i - numberOfDataPointsToShow, i)
                }

                myChart1.setOption(option1)
            }
        )

        watch(categoriesStore.selectedCategories, async (newVal, oldVal) => {
            const activeCategories = Object.values(newVal)
            let shownCategories = []
            for (let i in activeCategories) {
                if (activeCategories[i]) {
                    shownCategories.push(categoryNames[i])
                }
            }
            option1.yAxis.data = shownCategories
            myChart1.setOption(option1)
        })

        onMounted(() => {
            let chartDom1 = document.getElementById('main__heatmap_1')
            option1 = getOptionsPerArea(areasStore.selectedArea)
            myChart1 = echarts.init(chartDom1, 'dark')
            myChart1.setOption(option1)

            let j = 0
            setInterval(() => {
                if (!categoriesStore.isPaused && !(j % categoriesStore.updateFrequency)) {
                    categoriesStore.currentDataPoint = keys[i]
                    if (i < numberOfDataPointsToShow) {
                        option1.xAxis.data = keys.slice(0, i)
                    } else {
                        option1.xAxis.data = keys.slice(i - numberOfDataPointsToShow, i)
                    }
                    myChart1.setOption(option1)
                    i++
                }
                j++
            }, 100)
        })

        const getAreaName = (area) => {
            for (let a of areasStore.areas) {
                if (a.id == area) return a.name
            }
        }

        return { getAreaName, areasStore }
    },
})
</script>

<template>
    <div>
        <div id="main__heatmap_1" class="main__heatmap"></div>
    </div>
</template>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
.main__heatmap {
    width: 100%;
    height: 300px;
}
#loading-spinner {
    position: absolute;
    top: 30%;
    left: 50%;
}
</style>
