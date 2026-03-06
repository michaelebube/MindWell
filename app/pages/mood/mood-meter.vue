<template>
  <div class="min-h-screen relative flex sm:flex-1 flex-col">
    <div
      class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>

    <!-- Header -->
    <div
      class="flex items-center justify-between xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 px-4 pt-8 pb-2 z-10"
    >
      <button aria-label="Go Back" @click="goBack">
        <div
          class="bg-[#1565C0] md:w-12 md:h-11 xl:h-13 xl:w-14 w-8 h-7 rounded-lg flex items-center justify-center cursor-pointer"
        >
          <img :src="backArrowIcon" alt="Back Arrow" class="w-9 h-9 md:w-10 md:h-10 p-2" />
        </div>
      </button>

      <img
        :src="logo"
        alt="MindWell Logo"
        class="-mr-2 w-20 h-20 md:h-28 md:w-28 xl:w-32 xl:h-32"
      />
    </div>

    <!-- Main content -->
    <main
      class="z-10 px-10 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-10 flex flex-col sm:flex-1 items-center justify-center gap-5 sm:mb-10 xl:mb-16"
    >
      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div
          class="w-10 h-10 border-4 border-[#80BA41] border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="text-[#80BA41] mt-4 text-sm">Loading your mood data...</p>
      </div>

      <template v-else>
        <img :src="moodMeterIcon" alt="Check" class="w-10 h-10 md:w-14 md:h-14 -mt-10 md:-mt-16" />
        <!-- Today's Mood -->

        <div
          class="bg-[#FBFBFB] rounded-[10px] shadow-2xl px-10 py-3 lg:px-14 lg:py-4 text-center w-full max-w-md"
        >
          <p class="text-[#80BA41] text-xs xs:text-sm lg:text-base font-medium">Today's Mood</p>
          <p class="text-[#2558A6] text-sm xs:text-base lg:text-lg font-semibold">
            {{ todayMoodLabel }}
          </p>
        </div>

        <!-- Mood Chart Card -->
        <div
          class="bg-[#FBFBFB] rounded-[10px] shadow-2xl px-6 py-5 lg:px-10 lg:py-7 w-full max-w-md"
        >
          <p class="text-[#2558A6] text-center text-sm xs:text-base lg:text-lg font-semibold mb-3">
            Mood Chart
          </p>

          <!-- Period Dropdown -->
          <div class="relative flex justify-center mb-4">
            <button
              class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs xs:text-sm text-gray-700 shadow-sm"
              @click="dropdownOpen = !dropdownOpen"
            >
              {{ selectedPeriodLabel }}
              <svg
                class="w-3 h-3 transition-transform"
                :class="{ 'rotate-180': dropdownOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <Transition name="fade">
              <div
                v-if="dropdownOpen"
                class="absolute top-full mt-1 bg-[#80BA41] rounded-lg shadow-lg z-20 min-w-40 py-1 overflow-hidden"
              >
                <button
                  v-for="period in periods"
                  :key="period.days"
                  class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#6fa535] transition-colors"
                  @click="selectPeriod(period.days)"
                >
                  {{ period.label }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Donut Chart -->
          <div v-if="moodDistribution.length > 0" class="flex justify-center items-center">
            <div class="w-48 h-48 xs:w-56 xs:h-56 lg:w-64 lg:h-64">
              <Doughnut :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <!-- No data state -->
          <div v-else class="text-center py-8">
            <p class="text-gray-400 text-sm">No mood data for this period</p>
          </div>
        </div>

        <!-- AI Generated Mood Insight -->
        <div
          class="bg-[#FBFBFB] rounded-[10px] shadow-2xl px-6 py-5 lg:px-10 lg:py-7 w-full max-w-md text-center"
        >
          <p class="text-[#80BA41] text-sm xs:text-base lg:text-lg font-semibold mb-3">
            Mood Insight
          </p>

          <div v-if="moodInsight" class="space-y-2">
            <p
              v-for="(line, idx) in moodInsightLines"
              :key="idx"
              class="text-[#2558A6] text-xs xs:text-sm lg:text-base"
            >
              {{ line }}
            </p>
          </div>

          <p v-else class="text-gray-400 text-sm">Log more moods to get personalized insights</p>
        </div>
      </template>
    </main>

    <!-- Bottom wave decorations -->
    <img
      class="absolute bottom-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="bottomBlueBlob"
      alt=""
    />

    <img
      class="absolute bottom-0 right-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="rightSideBlue"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Timestamp } from 'firebase/firestore'
import bgImg from '../../assets/images/bgImage.png'
import moodMeterIcon from '../../assets/svg/mood-meter.svg'
import logo from '../../assets/svg/logo.svg'
import backArrowIcon from '../../assets/svg/back-arrow.svg'

import bottomBlueBlob from '../../assets/svg/bottomBlueSVG.svg'
import rightSideBlue from '../../assets/svg/rightSideBlue.svg'

definePageMeta({
  layout: 'app',
})

const router = useRouter()
const { $auth } = useNuxtApp()
const { getLatestMoodLog, getMoodLogsByDays } = useMoodLog()

const isLoading = ref(true)
const dropdownOpen = ref(false)
const selectedDays = ref(7)
const todayMoodLabel = ref('—')
const moodInsight = ref('')

interface MoodCount {
  mood: string
  count: number
  percentage: number
}

ChartJS.register(ArcElement, Tooltip, Legend)

const moodDistribution = ref<MoodCount[]>([])

const moodColorMap: Record<string, string> = {
  Happy: '#80BA41',
  Sad: '#DD0025',
  Neutral: '#99A1AF',
  'Not sure': '#99A1AF',
}

const periods = [
  { days: 7, label: 'Last 7 days' },
  { days: 30, label: 'Last 30 days' },
  { days: 90, label: 'Last 90 days' },
  { days: 180, label: 'Last 180 days' },
  { days: 360, label: 'Last 360 days' },
]

const selectedPeriodLabel = computed(() => {
  return periods.find(p => p.days === selectedDays.value)?.label || 'Last 7 days'
})

const moodInsightLines = computed(() => {
  return moodInsight.value.split('\n').filter(line => line.trim())
})

// Chart.js data and options
const chartData = computed(() => ({
  labels: moodDistribution.value.map(m => m.mood),
  datasets: [
    {
      data: moodDistribution.value.map(m => m.count),
      backgroundColor: moodDistribution.value.map(m => moodColorMap[m.mood] || '#9CA3AF'),
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '55%',
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 16,
        font: { size: 12, family: 'Poppins' },
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const total = ctx.dataset.data.reduce((s: number, v: number) => s + v, 0)
          const pct = Math.round((ctx.parsed / total) * 100)
          return ` ${ctx.label}: ${pct}%`
        },
      },
    },
  },
}

const loadMoodData = async () => {
  try {
    const logs = await getMoodLogsByDays(selectedDays.value)

    if (logs.length === 0) {
      moodDistribution.value = []
      return
    }

    // Count moods
    const counts: Record<string, number> = {}
    for (const log of logs) {
      const mood = log.mood || 'Not sure'
      counts[mood] = (counts[mood] || 0) + 1
    }

    const total = logs.length
    moodDistribution.value = Object.entries(counts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error loading mood data:', error)
    moodDistribution.value = []
  }
}

const loadMoodInsight = () => {
  if (moodDistribution.value.length === 0) {
    moodInsight.value = ''
    return
  }
  moodInsight.value = generateLocalInsight()
}

const generateLocalInsight = (): string => {
  const lines: string[] = []
  const dayLabel = selectedDays.value === 7 ? '7 days' : `${selectedDays.value} days`
  lines.push(`Here's a look at how you've been feeling over the past ${dayLabel}:`)

  for (const item of moodDistribution.value) {
    const timesLabel = item.count === 1 ? 'once' : `${item.count} times`
    const moodLower = item.mood.toLowerCase()
    lines.push(`You felt ${moodLower} ${timesLabel}`)
  }

  lines.push(`Thanks for checking in with your emotions — you're doing great by staying aware.`)
  return lines.join('\n')
}

const selectPeriod = async (days: number) => {
  selectedDays.value = days
  dropdownOpen.value = false
  await loadMoodData()
  loadMoodInsight()
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  try {
    // Load today's mood
    const latest = await getLatestMoodLog()
    if (latest) {
      const logDate = latest.createdAt?.toDate ? latest.createdAt.toDate() : new Date()
      const today = new Date()
      if (logDate.toDateString() === today.toDateString()) {
        todayMoodLabel.value = latest.mood
      } else {
        todayMoodLabel.value = 'Not logged yet'
      }
    } else {
      todayMoodLabel.value = 'Not logged yet'
    }

    // Load chart data
    await loadMoodData()
    loadMoodInsight()
  } catch (error) {
    console.error('Error initializing mood meter:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
