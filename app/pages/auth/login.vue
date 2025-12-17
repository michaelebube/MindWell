<template>
    
        
    <div class="flex flex-col h-full">
        <div class="flex-1 flex flex-col items-center justify-center  px-6">
            <!-- Green message card -->
            <div class="bg-[#80BA41] mt-4 text-[#FBFBFB]/90 xs:px-2 px-6 xs:py-10  py-5 rounded-lg xs:max-w-80 max-w-72 text-center mb-8 flex flex-col gap-2">
                <p class="xs:text-[16px] text-sm xs:leading-5 leading-5  mb-4">
                   Welcome back! 


                </p>
                <p>
                    We’re glad to see you again. Log in to continue your journey toward better mental health — your space is safe and judgment-free.
                </p>
                
            </div>

            <!-- Form container -->
            <div class="flex flex-col gap-3 w-full bg-[#2558A6] xs:max-w-80 max-w-72 space-y-3 rounded-xl px-6 py-8 mb-10 xs:mb-0">
               
                <div class="flex flex-col gap-1.5">
                    <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs " for="email">Email</label>
                <input 
                    type="email" 
                    id="email"
                    autocomplete="off"
                    class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-[#80BA41] text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41]"
                >
                </div>
                
                <div class="flex flex-col gap-1.5">
                    <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs "for="password">Password</label>
                <input 
                    type="password" 
                    id="password"
                    autocomplete="new-password"
                    class="w-full xs:px-4 px-3 xs:py-3 py-2.5 text-[#80BA41] border border-gray-300 rounded-lg xs:text-sm text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41] mb-5"
                >
                </div>
                
                
                <div>
                    <button class="w-full bg-[#80BA41] text-white xs:py-3 py-2.5 rounded-lg xs:text-sm text-xs font-semibold hover:bg-[#6fa535] transition-colors mt-2 mb-5">
                    Log in
                </button>
                 <div class="">
                    <p class=" text-center text-sm font-light text-[#FBFBFB]/70">Can't remember your password?</p>
                <NuxtLink href="/forgot-password" class="text-[#80BA41] font-light flex items-center justify-center ">Reset</NuxtLink>
                </div>
                </div>
                
                
               
                
            </div>
        </div>
    </div>
</template>




<script setup>
definePageMeta({
    layout: 'auth'
})
</script>