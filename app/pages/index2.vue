<template>
  <div class="min-h-screen overflow-hidden bg-[#fafbf8] font-sans text-[#18332d]">
    <SplashScreen v-if="showSplash" />
    <div v-else class="relative isolate min-h-screen">
      <div
        class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(128,186,65,.7)_1.35px,transparent_2px)] bg-size-[28px_28px] opacity-[0.23]"
        aria-hidden="true"
      ></div>
      <header
        class="relative z-10 mx-auto flex min-h-16 max-w-280 items-center gap-3 px-4 sm:min-h-22 sm:max-w-310 sm:gap-14 sm:px-[34px] md:max-w-[1320px] md:px-[42px] xl:min-h-[100px] xl:max-w-[1440px] xl:gap-[72px] xl:px-[54px]"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-[13px] font-bold text-[#003f36] no-underline sm:gap-1 sm:text-base xl:gap-1 xl:text-lg"
          aria-label="MindWell home"
        >
          <img
            :src="logo"
            alt=""
            class="h-6 w-6 object-contain sm:h-[48px] sm:w-[48px] xl:h-[60px] xl:w-[60px]"
          />
          <span>MindWell</span>
        </NuxtLink>
        <nav
          class="hidden gap-7 sm:flex sm:gap-[38px] xl:gap-12 mx-auto -tran"
          aria-label="Main navigation"
        >
          <a
            href="#features"
            class="text-[10px] text-[#52645d] no-underline sm:text-xs xl:text-[13px]"
            >Features</a
          >
          <a href="#about" class="text-[10px] text-[#52645d] no-underline sm:text-xs xl:text-[13px]"
            >Campus Wellness</a
          >
        </nav>
        <div class="ml-auto flex items-center gap-2 sm:gap-3 xl:gap-4">
          <NuxtLink
            to="/login"
            class="text-[10px] text-[#52645d] no-underline sm:text-xs xl:text-[13px]"
            >Sign in</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="rounded-full bg-[#003f36] px-3 py-2 text-[10px] font-semibold text-white no-underline sm:px-5 sm:py-3 sm:text-xs xl:px-6 xl:py-3.5 xl:text-[13px]"
            >Get Started</NuxtLink
          >
        </div>
      </header>

      <main class="relative z-10">
        <section
          class="mx-auto max-w-[1120px] px-4 py-[34px] text-center sm:max-w-[1240px] sm:px-[34px] sm:py-[62px] md:max-w-[1320px] md:px-[42px] md:pb-14 md:pt-[68px] xl:max-w-[1440px] xl:px-[54px] xl:py-[86px]"
          id="about"
        >
          <p
            class="mb-[13px] text-[10px] font-semibold uppercase tracking-[.06em] text-[#80ba41] sm:mb-[18px] sm:text-[13px] xl:mb-[22px] xl:text-sm"
          >
            Your campus wellness companion
          </p>
          <h1
            class="mx-auto max-w-[330px] text-[25px] leading-[1.15] tracking-[-.02em] text-[#003f36] sm:max-w-[790px] sm:text-[clamp(40px,4.2vw,64px)] md:max-w-[850px] xl:max-w-[1000px] xl:text-[clamp(52px,4.4vw,76px)]"
          >
            A safe space for your mind on campus.
          </h1>
          <p
            class="mx-auto mb-5 mt-3 max-w-[330px] text-[9px] leading-[1.55] text-[#6f7e77] sm:mb-7 sm:mt-[22px] sm:max-w-[700px] sm:text-sm sm:leading-[1.7] xl:mb-[34px] xl:mt-[26px] xl:max-w-[820px] xl:text-base"
          >
            MindWell is a companion to help you understand, care for, and strengthen your mental
            health. Create an account to get started.
          </p>
          <div class="flex items-center justify-center gap-3 sm:gap-4 xl:gap-5">
            <NuxtLink
              to="/register"
              class="rounded-full bg-[#003f36] px-4 py-2 text-[10px] font-semibold text-white no-underline sm:px-[22px] sm:py-3 sm:text-[13px] xl:px-[26px] xl:py-3.5 xl:text-sm"
              >Get Started</NuxtLink
            >
            <NuxtLink
              to="/login"
              class="rounded-full border border-[#a5b7ae] px-4 py-2 text-[10px] font-semibold text-[#003f36] no-underline sm:px-[22px] sm:py-3 sm:text-[13px] xl:px-[26px] xl:py-3.5 xl:text-sm"
              >Sign in</NuxtLink
            >
          </div>

          <div
            class="mx-auto mt-[25px] max-w-[640px] rounded-[10px] border border-[#ebefea] bg-white p-[11px] text-left shadow-[0_12px_28px_rgba(0,63,54,.07)] sm:mt-10 sm:max-w-[800px] sm:rounded-[13px] sm:p-[15px] xl:mt-[52px] xl:max-w-[980px] xl:rounded-[15px] xl:p-[18px]"
            aria-label="MindWell chat preview"
          >
            <div
              class="flex items-center gap-2 px-[3px] pb-2.5 text-[#003f36] sm:gap-[11px] sm:px-[5px] sm:pb-[13px] xl:gap-[13px] xl:px-[7px] xl:pb-4"
            >
              <span
                class="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#edf6e6] text-[10px] text-[#80ba41] sm:h-[30px] sm:w-[30px] sm:text-[13px] xl:h-9 xl:w-9 xl:text-[15px]"
                >✦</span
              >
              <div>
                <strong class="block text-[8px] leading-[1.2] sm:text-[11px] xl:text-[13px]"
                  >MindWell AI</strong
                ><small
                  class="block text-[7px] leading-[1.2] text-[#96a39d] sm:text-[9px] xl:text-[10px]"
                  >Here for you</small
                >
              </div>
              <span
                class="ml-auto h-[5px] w-[5px] rounded-full bg-[#80ba41] sm:h-[7px] sm:w-[7px] xl:h-2 xl:w-2"
              ></span>
            </div>
            <div
              class="min-h-[74px] rounded-md bg-[#f7f8f5] p-[9px] sm:min-h-[105px] sm:p-3 xl:min-h-[130px] xl:p-[15px]"
            >
              <span class="block text-right text-[7px] text-[#a2aaa4] sm:text-[9px] xl:text-[10px]"
                >10:24 AM</span
              >
              <p
                class="ml-auto mt-2 w-fit max-w-[72%] rounded-[7px] bg-white px-2 py-1.5 text-[8px] leading-[1.45] text-[#819087] sm:mt-[11px] sm:rounded-[9px] sm:px-[11px] sm:py-2 sm:text-[10px] xl:mt-[13px] xl:rounded-[10px] xl:px-[13px] xl:py-2.5 xl:text-xs"
              >
                Hi there, I'm listening.
              </p>
              <p
                class="mt-2 w-fit max-w-[72%] rounded-[7px] bg-[#003f36] px-2 py-1.5 text-[8px] leading-[1.45] text-white sm:mt-[11px] sm:rounded-[9px] sm:px-[11px] sm:py-2 sm:text-[10px] xl:mt-[13px] xl:rounded-[10px] xl:px-[13px] xl:py-2.5 xl:text-xs"
              >
                I’m here if you need to talk through anything.
              </p>
            </div>
          </div>
        </section>

        <section
          class="mx-auto grid max-w-[1120px] grid-cols-3 gap-2 px-3 pb-7 sm:max-w-[1240px] sm:gap-[18px] sm:px-[34px] sm:pb-[58px] md:max-w-[1320px] md:px-[42px] xl:max-w-[1440px] xl:gap-[22px] xl:px-[54px] xl:pb-[70px]"
          id="features"
        >
          <article
            class="min-h-[142px] rounded-[9px] border border-[#eef0ec] bg-white p-3 shadow-[0_7px_17px_rgba(0,63,54,.04)] sm:min-h-[178px] sm:rounded-[11px] sm:p-[22px_18px] xl:min-h-[215px] xl:rounded-[13px] xl:p-7"
          >
            <span
              class="mb-2 grid h-6 w-6 place-items-center rounded-md bg-[#edf6e6] text-[11px] text-[#80ba41] sm:mb-[15px] sm:h-[30px] sm:w-[30px] sm:text-sm xl:mb-[19px] xl:h-9 xl:w-9 xl:text-base"
              >▣</span
            >
            <h2 class="mb-1 text-[9px] text-[#003f36] sm:mb-2 sm:text-sm xl:mb-2.5 xl:text-[17px]">
              Secure &amp; Private
            </h2>
            <p
              class="text-[7px] leading-[1.55] text-[#6f7e77] sm:text-[10px] sm:leading-[1.65] xl:text-xs xl:leading-[1.7]"
            >
              Your privacy is our priority. Your thoughts stay safe and confidential.
            </p>
          </article>
          <article
            class="min-h-[142px] rounded-[9px] border border-[#eef0ec] bg-white p-3 shadow-[0_7px_17px_rgba(0,63,54,.04)] sm:min-h-[178px] sm:rounded-[11px] sm:p-[22px_18px] xl:min-h-[215px] xl:rounded-[13px] xl:p-7"
          >
            <span
              class="mb-2 grid h-6 w-6 place-items-center rounded-md bg-[#edf6e6] text-[11px] text-[#80ba41] sm:mb-[15px] sm:h-[30px] sm:w-[30px] sm:text-sm xl:mb-[19px] xl:h-9 xl:w-9 xl:text-base"
              >✣</span
            >
            <h2 class="mb-1 text-[9px] text-[#003f36] sm:mb-2 sm:text-sm xl:mb-2.5 xl:text-[17px]">
              Culturally Aware AI
            </h2>
            <p
              class="text-[7px] leading-[1.55] text-[#6f7e77] sm:text-[10px] sm:leading-[1.65] xl:text-xs xl:leading-[1.7]"
            >
              Get support that understands your experiences, culture, and campus life.
            </p>
          </article>
          <article
            class="min-h-[142px] rounded-[9px] border border-[#eef0ec] bg-white p-3 shadow-[0_7px_17px_rgba(0,63,54,.04)] sm:min-h-[178px] sm:rounded-[11px] sm:p-[22px_18px] xl:min-h-[215px] xl:rounded-[13px] xl:p-7"
          >
            <span
              class="mb-2 grid h-6 w-6 place-items-center rounded-md bg-[#edf6e6] text-[11px] text-[#80ba41] sm:mb-[15px] sm:h-[30px] sm:w-[30px] sm:text-sm xl:mb-[19px] xl:h-9 xl:w-9 xl:text-base"
              >♡</span
            >
            <h2 class="mb-1 text-[9px] text-[#003f36] sm:mb-2 sm:text-sm xl:mb-2.5 xl:text-[17px]">
              24/7 Support
            </h2>
            <p
              class="text-[7px] leading-[1.55] text-[#6f7e77] sm:text-[10px] sm:leading-[1.65] xl:text-xs xl:leading-[1.7]"
            >
              Talk whenever you need to. A supportive space is always available.
            </p>
          </article>
        </section>

        <section
          class="mx-auto mb-5 max-w-[1120px] rounded-lg bg-[#003f36] px-[18px] py-8 text-center text-white sm:mb-[42px] sm:max-w-[1240px] sm:rounded-xl sm:px-[30px] sm:py-12 md:max-w-[1320px] xl:mb-[52px] xl:max-w-[1440px] xl:rounded-[14px] xl:px-9 xl:py-[60px]"
        >
          <h2
            class="mx-auto mb-3.5 max-w-[310px] text-[17px] leading-[1.3] sm:mb-5 sm:max-w-[440px] sm:text-[27px] xl:mb-6 xl:max-w-[540px] xl:text-[33px]"
          >
            You don't have to carry campus stress alone.
          </h2>
          <NuxtLink
            to="/register"
            class="inline-block rounded-full bg-white px-[17px] py-2 text-[9px] font-semibold text-[#003f36] no-underline sm:px-[23px] sm:py-[11px] sm:text-xs xl:px-7 xl:py-[13px] xl:text-sm"
            >Connect with MindWell</NuxtLink
          >
        </section>
      </main>

      <footer
        class="relative z-10 mx-auto max-w-[1120px] items-start gap-[22px] border-t border-[#edf0ec] px-4 py-5 text-[9px] text-[#748078] sm:max-w-[1240px] sm:flex-nowrap sm:gap-[100px] sm:px-[34px] sm:py-8 sm:text-[11px] md:max-w-[1320px] md:px-[42px] xl:max-w-[1440px] xl:gap-[125px] xl:px-[54px] xl:py-10 xl:text-[13px]"
      >
        <div class="flex flex-wrap items-start gap-[22px] sm:flex-nowrap sm:gap-[100px]">
          <div class="mr-auto flex flex-col gap-1">
            <strong class="text-xs text-[#003f36] sm:text-[15px] xl:text-[17px]">MindWell</strong
            ><span>Your campus wellness companion.</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <a href="#features" class="text-inherit no-underline">Features</a
            ><a href="#about" class="text-inherit no-underline">About</a
            ><a href="#" class="text-inherit no-underline">Help</a>
          </div>
          <div class="flex flex-col gap-1.5">
            <a href="#" class="text-inherit no-underline">Privacy Policy</a
            ><a href="#" class="text-inherit no-underline">Terms of Service</a>
          </div>
        </div>

        <small
          class="mt-2 w-full self-end text-[8px] sm:mt-10 sm:w-auto sm:text-[10px] xl:text-[11px]"
          >© 2026 MindWell. All rights reserved.</small
        >
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '../assets/svg/logo.svg'

const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false
  }, 3000)
})
</script>
