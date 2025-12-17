<template>
    <div class="flex flex-col h-full">
        <div class="flex-1 flex flex-col items-center justify-center  px-6">
            <!-- Green message card -->
            <div class="bg-[#80BA41] mt-4 text-white xs:px-16 px-6 xs:py-6 py-5 rounded-lg xs:max-w-80 max-w-72 text-center mb-8">
                <p class="xs:text-[16px] text-sm xs:leading-5 leading-5  mb-4">
                    What would you like me to call you, friend ? 
                </p>
                <p class="xs:text-[16px] text-sm xs:leading-5 leading-4">
                    You don’t have to use your real name if you’re not comfortable. This is a safe, judgment‑free space.
                </p>
            </div>

            <!-- Form container -->
            <div class="flex flex-col gap-3 w-full bg-[#2558A6] xs:max-w-80 max-w-72 space-y-3 rounded-xl px-6 py-8 mb-10 xs:mb-0">
                <div class="flex flex-col gap-1.5">
                     <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs " for="name">Anonymous Name</label>
                <input 
                    type="text" 
                    id="name"
                    class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-xs  focus:outline-none bg-gray-100 focus:ring-2 focus:ring-[#80BA41] "
                >
                </div>
               
                <div class="flex flex-col gap-1.5">
                    <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs " for="email">Email</label>
                <input 
                    type="email" 
                    id="email"
                   
                    class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41]"
                >
                </div>
                
                <div class="flex flex-col gap-1.5">
                    <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs "for="password">Password</label>
                <input 
                    type="password" 
                    id="password"
                    
                    class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41]"
                >
                </div>
                
                
                <button class="w-full bg-[#80BA41] text-white xs:py-3 py-2.5 rounded-lg xs:text-sm text-xs font-semibold hover:bg-[#6fa535] transition-colors mt-2 ">
                    Create Account
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'auth'
})
</script>