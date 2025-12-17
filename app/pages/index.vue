<template>
    <div class="relative">
        <SplashScreen v-if="showSplash" />
        <div v-else class="h-screen flex flex-col relative overflow-hidden">
            <!-- Background -->
            <div class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat" :style="{backgroundImage: `url(${bgImg})`}"></div>
            
            <!-- Logo -->
            <img class="xs:mt-6 mt-5 mx-auto xs:w-25 xs:h-25 w-20 h-20 relative z-10" :src="logo" alt="MindWell Logo">

            <!-- Chat bubbles section -->
            <div class="flex-1 xs:pt-10 pt-5 xs:space-y-7 space-y-5 relative z-10 overflow-y-auto">
                <div 
                    v-for="(statement, index) in displayedStatements" 
                    :key="index"
                    class="bg-[#80BA41] text-white xs:px-6 px-4 xs:py-3 py-2 rounded xs:max-w-64 max-w-56 xs:text-sm text-xs xs:leading-5 leading-4 font-medium"
                    :class="index % 2 === 0 ? 'rounded-tr-[40px] rounded-br-xl' : 'rounded-tl-[40px] rounded-bl-xl ml-auto'"
                >
                    {{ statement }}
                </div>
            </div>

            <!-- Bottom wave section with content -->
            <div class="relative mt-auto">
                <!-- Wave image -->
                <img 
                    :src="wave" 
                    alt="wave" 
                    class="absolute bottom-0 left-0 w-full h-auto"
                />
                
                <!-- Content on top of wave -->
                <div class="relative z-10 flex flex-col items-center justify-center xs:pb-13 pb-8">
                    <h1 class="text-white xs:text-[16px] text-[14px] font-semibold mb-4 flex items-center gap-2">
                        We are here to help
                        <span class="text-[16px] xs:text-[14px]"><img :src="huggingIcon" alt="Hugging Icon"></span>
                    </h1>
                    
                    <NuxtLink to="/register" class="bg-white text-[#80BA41] xs:px-6 px-5 xs:py-2 py-1.5 rounded-xl xs:text-sm text-xs font-semibold hover:bg-gray-50 transition-colors mb-2 shadow-lg">
                        Let's get started
                    </NuxtLink>
                    
                    <p class="text-white xs:text-sm text-xs">
                        Have an account?
                        <NuxtLink to="/login" class="text-[#80BA41] font-semibold ml-1">
                            Sign-in
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { $auth, $firestore } = useNuxtApp()
import logo from '../assets/svg/logo.svg'
import wave from '../assets/svg/wave.svg'
import bgImg from '../assets/images/bgImage.png'
import huggingIcon from '../assets/svg/noto_people-hugging.svg'



console.log($auth, $firestore)

const showSplash = ref(true)

onMounted(() => {
    // Set timeout to hide splash screen after 3 seconds
    setTimeout(() => {
        showSplash.value = false
    }, 3000)
    
    // Check screen size
    const checkScreenSize = () => {
        isSmallScreen.value = window.innerWidth <= 344 && window.innerHeight <= 600
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    onUnmounted(() => {
        window.removeEventListener('resize', checkScreenSize)
    })
})

const introductoryStatements = [
    "You’re Not Alone. Your Mental Health Matters.",
    "Take a Deep Breath. Start Your Journey to Wellness.",
    "Small Steps, Big Changes. Prioritize Your Mental Health.",
    "MindWell: Empowering Your Mental Wellness Journey.",
    "Your Mind, Your Wellbeing. We're Here to Help.",
]
// Computed to show 3 messages on small screens, 5 on others
const isSmallScreen = ref(false)

const displayedStatements = computed(() => {
    return isSmallScreen.value ? introductoryStatements.slice(0, 4) : introductoryStatements
})

</script>