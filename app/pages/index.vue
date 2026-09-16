<template>
  <div class="landing-page min-h-screen overflow-hidden bg-[#fafbf8] text-[#18332d]">
    <ClientOnly>
      <Transition name="splash-fade" mode="out-in">
        <SplashScreen v-if="showSplash" key="splash" @ready="startSplashTimer" />
        <div v-else key="landing" class="relative isolate min-h-screen">
          <div
            class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(128,186,65,.7)_1.35px,transparent_2px)] bg-size-[28px_28px] opacity-[0.23]"
            aria-hidden="true"
          ></div>
          <div
            class="relative z-10 bg-[#ecfdf5] px-4 py-2 text-center text-[10px] leading-4 text-[#064e3b] sm:text-xs"
          >
            <span aria-hidden="true">♡</span>
            In immediate distress or need urgent human support? Tap for
            <NuxtLink to="/sos" class="font-semibold underline underline-offset-2"
              >free, confidential crisis lines</NuxtLink
            >.
          </div>
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
                class="h-6 w-6 object-contain sm:h-20 sm:w-20 md:h-24 md:w-24 xl:h-30 xl:w-30"
              />
            </NuxtLink>
            <nav
              class="absolute left-1/2 hidden -translate-x-1/2 gap-7 sm:flex sm:gap-[38px] xl:gap-12"
              aria-label="Main navigation"
            >
              <a
                href="#features"
                class="text-[10px] text-[#52645d] no-underline sm:text-xs xl:text-[13px]"
                >Features</a
              >
              <a
                href="#about"
                class="text-[10px] text-[#52645d] no-underline sm:text-xs xl:text-[13px]"
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
              class="mx-auto max-w-[1120px] px-4 py-7 text-center sm:max-w-[1240px] sm:px-[34px] sm:py-11 md:max-w-[1320px] md:px-[42px] md:py-12 xl:max-w-[1440px] xl:px-[54px] xl:py-24"
              id="about"
            >
              <p
                class="mb-[13px] text-[10px] font-semibold uppercase tracking-[.06em] text-[#80ba41] sm:mb-[18px] sm:text-[13px] xl:mb-[22px] xl:text-sm"
              >
                Your campus wellness companion
              </p>
              <h1
                class="mx-auto max-w-[330px] font-display text-[27px] font-bold leading-[1.1] tracking-[-.02em] text-[#003f36] sm:max-w-[790px] sm:text-[clamp(40px,4.2vw,64px)] md:max-w-[850px] xl:max-w-[1050px] xl:text-[clamp(54px,4.5vw,78px)]"
              >
                A safe space for your mind on campus.
              </h1>
              <p
                class="mx-auto mb-5 mt-3 max-w-[330px] text-[10px] leading-[1.55] text-[#6f7e77] sm:mb-6 sm:mt-4 sm:max-w-[700px] sm:text-sm sm:leading-[1.7] xl:mb-7 xl:mt-5 xl:max-w-[820px] xl:text-base"
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
                class="mx-auto mt-6 max-w-[640px] rounded-[10px] border border-[#ebefea] bg-white p-[11px] text-left shadow-[0_12px_28px_rgba(0,63,54,.07)] sm:mt-7 sm:max-w-[800px] sm:rounded-[13px] sm:p-[15px] xl:mt-12 xl:max-w-[1040px] xl:rounded-[15px] xl:p-[20px]"
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
                  <span
                    class="block text-right text-[7px] text-[#a2aaa4] sm:text-[9px] xl:text-[10px]"
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
                    {{
                      activePrompt ? activePrompt : 'I’m here if you need to talk through anything.'
                    }}
                  </p>
                  <div
                    v-if="isTyping"
                    class="mt-2 w-fit rounded-[7px] bg-white px-3 py-2 text-[#80ba41]"
                    aria-label="MindWell is typing"
                  >
                    <span class="animate-pulse">•••</span>
                  </div>
                  <p
                    v-else-if="reply"
                    class="mt-2 w-fit max-w-[85%] rounded-[7px] bg-white px-2 py-1.5 text-[8px] leading-[1.45] text-[#819087] sm:text-[10px] xl:text-xs"
                  >
                    {{ reply }}
                  </p>
                </div>
                <div class="mt-3 flex flex-wrap gap-2" aria-label="Conversation starters">
                  <button
                    v-for="prompt in prompts"
                    :key="prompt"
                    type="button"
                    class="rounded-full border border-[#cfe6d8] bg-[#ecfdf5] px-3 py-1.5 text-[9px] text-[#064e3b] transition hover:bg-[#d1fae5] focus:outline-none focus:ring-2 focus:ring-[#80ba41] sm:text-[10px]"
                    @click="selectPrompt(prompt)"
                  >
                    {{ prompt }}
                  </button>
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
                <h2
                  class="mb-1 text-[9px] text-[#003f36] sm:mb-2 sm:text-sm xl:mb-2.5 xl:text-[17px]"
                >
                  Secure &amp; Private
                </h2>
                <p
                  class="text-[7px] leading-[1.55] text-[#6f7e77] sm:text-[10px] sm:leading-[1.65] xl:text-xs xl:leading-[1.7]"
                >
                  Zero university administration access. No student ID required to check in.
                </p>
              </article>
              <article
                class="min-h-[142px] rounded-[9px] border border-[#eef0ec] bg-white p-3 shadow-[0_7px_17px_rgba(0,63,54,.04)] sm:min-h-[178px] sm:rounded-[11px] sm:p-[22px_18px] xl:min-h-[215px] xl:rounded-[13px] xl:p-7"
              >
                <span
                  class="mb-2 grid h-6 w-6 place-items-center rounded-md bg-[#edf6e6] text-[11px] text-[#80ba41] sm:mb-[15px] sm:h-[30px] sm:w-[30px] sm:text-sm xl:mb-[19px] xl:h-9 xl:w-9 xl:text-base"
                  >✣</span
                >
                <h2
                  class="mb-1 text-[9px] text-[#003f36] sm:mb-2 sm:text-sm xl:mb-2.5 xl:text-[17px]"
                >
                  Culturally Aware AI
                </h2>
                <p
                  class="text-[7px] leading-[1.55] text-[#6f7e77] sm:text-[10px] sm:leading-[1.65] xl:text-xs xl:leading-[1.7]"
                >
                  Support that understands hostel dynamics, exam stress, and cultural or family
                  expectations.
                </p>
              </article>
              <article
                class="min-h-[142px] rounded-[9px] border border-[#eef0ec] bg-white p-3 shadow-[0_7px_17px_rgba(0,63,54,.04)] sm:min-h-[178px] sm:rounded-[11px] sm:p-[22px_18px] xl:min-h-[215px] xl:rounded-[13px] xl:p-7"
              >
                <span
                  class="mb-2 grid h-6 w-6 place-items-center rounded-md bg-[#edf6e6] text-[11px] text-[#80ba41] sm:mb-[15px] sm:h-[30px] sm:w-[30px] sm:text-sm xl:mb-[19px] xl:h-9 xl:w-9 xl:text-base"
                  >♡</span
                >
                <h2
                  class="mb-1 text-[9px] text-[#003f36] sm:mb-2 sm:text-sm xl:mb-2.5 xl:text-[17px]"
                >
                  24/7 Support
                </h2>
                <p
                  class="text-[7px] leading-[1.55] text-[#6f7e77] sm:text-[10px] sm:leading-[1.65] xl:text-xs xl:leading-[1.7]"
                >
                  Instant conversational support at 2 AM, when campus counseling centers and clinics
                  are closed.
                </p>
              </article>
            </section>

            <section
              class="mx-auto max-w-[1120px] px-4 pb-7 sm:max-w-[1240px] sm:px-[34px] sm:pb-10 md:max-w-[1320px] md:px-[42px] xl:max-w-[1440px] xl:px-[54px]"
              aria-labelledby="steps-title"
            >
              <div class="border-y border-[#dfe9e2] py-5 sm:py-7">
                <p
                  id="steps-title"
                  class="mb-5 text-[10px] font-semibold uppercase tracking-[.06em] text-[#80ba41] sm:mb-6 sm:text-xs"
                >
                  A calmer next step
                </p>
                <div class="grid gap-5 sm:grid-cols-3 sm:gap-0">
                  <article
                    v-for="(step, index) in steps"
                    :key="step.number"
                    class="relative sm:px-6"
                    :class="{ 'sm:border-l sm:border-[#dfe9e2]': index > 0 }"
                  >
                    <div class="flex items-center gap-3">
                      <span
                        class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d1fae5] text-xs font-semibold text-[#064e3b]"
                        >{{ step.number }}</span
                      >
                      <h3 class="font-display text-sm font-semibold text-[#003f36] sm:text-base">
                        {{ step.title }}
                      </h3>
                    </div>
                    <p class="mt-2 pl-11 text-[10px] leading-[1.6] text-[#6f7e77] sm:text-xs">
                      {{ step.description }}
                    </p>
                  </article>
                </div>
              </div>
            </section>

            <section
              class="mx-auto max-w-[1120px] px-4 pb-7 sm:max-w-[1240px] sm:px-[34px] sm:pb-10 md:max-w-[1320px] md:px-[42px] xl:max-w-[1440px] xl:px-[54px]"
              aria-labelledby="faq-title"
            >
              <h2
                id="faq-title"
                class="mb-4 font-display text-xl font-bold text-[#003f36] sm:text-3xl"
              >
                Frequently Asked Questions
              </h2>
              <div
                class="divide-y divide-[#eef0ec] rounded-[10px] border border-[#eef0ec] bg-white px-4 shadow-[0_7px_17px_rgba(0,63,54,.04)] sm:px-6"
              >
                <article v-for="(item, index) in faqs" :key="item.question">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between gap-4 py-4 text-left text-xs font-semibold text-[#003f36] sm:text-sm"
                    :aria-expanded="openFaq === index"
                    @click="openFaq = openFaq === index ? -1 : index"
                  >
                    {{ item.question }}
                    <span class="text-lg font-normal" aria-hidden="true">{{
                      openFaq === index ? '−' : '+'
                    }}</span>
                  </button>
                  <p
                    v-if="openFaq === index"
                    class="pb-4 pr-8 text-[10px] leading-[1.65] text-[#6f7e77] sm:text-xs"
                  >
                    {{ item.answer }}
                  </p>
                </article>
              </div>
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
            class="relative z-10 mx-auto flex max-w-[1120px] flex-col gap-4 border-t-2 border-[#cbded3] px-4 py-5 text-[9px] text-[#748078] sm:max-w-[1240px] sm:gap-5 sm:px-[34px] sm:py-6 sm:text-[11px] md:max-w-[1320px] md:px-[42px] xl:max-w-[1440px] xl:px-[54px] xl:py-7 xl:text-[13px]"
          >
            <div
              class="grid w-full grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1.5fr)_auto_auto] sm:gap-12 xl:gap-24"
            >
              <div class="flex flex-col gap-1">
                <strong class="text-xs text-[#003f36] sm:text-[15px] xl:text-[17px]"
                  >MindWell</strong
                ><span>Your campus wellness companion.</span>
                <p
                  class="mt-2 max-w-[300px] text-[8px] leading-[1.6] text-[#748078] sm:text-[10px]"
                >
                  MindWell is an AI-powered conversational wellness companion. In life-threatening
                  emergencies, please contact local emergency medical services or a crisis helpline
                  immediately.
                </p>
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
              class="w-full border-t border-[#e1ebe5] pt-3 text-[8px] text-[#748078] sm:text-[10px] xl:text-[11px]"
              >© 2026 MindWell. All rights reserved.</small
            >
          </footer>
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import logo from '../assets/svg/logo.svg'

const hasSeenSplash =
  import.meta.client && sessionStorage.getItem('mindwell-splash-seen') === 'true'
const showSplash = ref(!hasSeenSplash)
const activePrompt = ref('')
const reply = ref('')
const isTyping = ref(false)
const openFaq = ref(-1)
let typingTimer: ReturnType<typeof setTimeout> | undefined
let splashTimer: ReturnType<typeof setTimeout> | undefined

const prompts = [
  'Overwhelmed by exams & deadlines',
  'Roommate / hostel friction',
  'Need to vent about family expectations',
]

const steps = [
  {
    number: '1',
    title: 'Vent Without Filter',
    description: 'Type out whatever is overwhelming you in an anonymous space.',
  },
  {
    number: '2',
    title: 'Untangle Your Thoughts',
    description:
      'Talk through what is bothering you with an AI that listens and asks calm, grounding questions.',
  },
  {
    number: '3',
    title: 'Gain Perspective',
    description: 'Walk away feeling unburdened and clear on your next step.',
  },
]

const faqs = [
  {
    question: 'Will my university or lecturers ever see my conversations?',
    answer:
      'No. Your conversations are private and are not shared with your university administration or lecturers.',
  },
  {
    question: 'Is MindWell a substitute for clinical therapy?',
    answer:
      'No. MindWell is a conversational companion for daily wellness, not diagnostic psychotherapy or a replacement for professional care.',
  },
  {
    question: 'Can I delete my chat data permanently?',
    answer: 'Yes. You can delete your chat data permanently from your account settings.',
  },
  {
    question: 'What happens when I start a conversation?',
    answer:
      'You choose what to share. MindWell listens, asks gentle questions, and helps you reflect without judging or rushing you.',
  },
  {
    question: 'What if I need urgent human help?',
    answer:
      'MindWell cannot provide emergency care. Use the crisis lines in the top bar or contact local emergency medical services immediately.',
  },
]

function selectPrompt(prompt: string) {
  activePrompt.value = prompt
  reply.value = ''
  isTyping.value = true
  if (typingTimer) clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    reply.value = prompt.includes('exams')
      ? 'That is a lot to hold at once. What feels most urgent right now: the workload, the fear of falling behind, or getting started?'
      : prompt.includes('Roommate')
        ? 'Living closely with someone can make small tensions feel huge. What happened, and what would feeling more comfortable at home look like?'
        : 'Family expectations can sit heavily alongside campus life. You can take this one piece at a time. What part feels hardest today?'
    isTyping.value = false
  }, 900)
}

function startSplashTimer() {
  splashTimer = setTimeout(() => {
    showSplash.value = false
  }, 1200)
}

if (import.meta.client && !hasSeenSplash) {
  sessionStorage.setItem('mindwell-splash-seen', 'true')
}

onBeforeUnmount(() => {
  if (typingTimer) clearTimeout(typingTimer)
  if (splashTimer) clearTimeout(splashTimer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');

.landing-page {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

.landing-page :deep(.font-display) {
  font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}

.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.45s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}
</style>
