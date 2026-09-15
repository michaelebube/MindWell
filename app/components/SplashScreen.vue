<template>
  <div
    class="splash-screen relative min-h-screen w-screen overflow-hidden transition-opacity duration-300 tablet-lock-height"
    :class="isReady ? 'opacity-100' : 'opacity-0'"
    aria-hidden="true"
  >
    <div class="splash-blob splash-blob-mobile">
      <img :src="topSVG" alt="" width="166" height="172" class="block h-full w-full" />
    </div>
    <div class="splash-blob splash-blob-desktop">
      <img :src="topSVGLg" alt="" width="324" height="320" class="block h-full w-full" />
    </div>
    <!-- Background layer with opacity -->
    <div
      class="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>

    <div class="splash-logo">
      <img
        :src="logo"
        alt="MindWell Logo"
        width="420"
        height="420"
        class="h-auto w-auto md:h-[300px] md:w-[300px] lg:h-[420px] lg:w-[420px]"
      />
    </div>

    <div class="splash-wave splash-wave-mobile">
      <img :src="footerSVG" alt="" width="430" height="108" class="block h-auto w-full" />
    </div>

    <div class="splash-wave splash-wave-desktop">
      <img :src="footerSVGLg" alt="" width="1512" height="158" class="block h-auto w-full" />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['ready'])

import bgImg from '../assets/images/bgImage.png'
import logo from '../assets/svg/logo.svg'
import footerSVG from '../assets/svg/Blue-blob.svg'
import topSVG from '../assets/svg/green-blob.svg'
import topSVGLg from '../assets/svg/green_blob_big.svg'
import footerSVGLg from '../assets/svg/blue-blob_big.svg'

const isReady = ref(false)

onMounted(async () => {
  const assets = [bgImg, logo, footerSVG, topSVG, topSVGLg, footerSVGLg]

  await Promise.all(
    assets.map(async source => {
      const image = new Image()
      image.src = source
      if (image.decode) await image.decode().catch(() => undefined)
    })
  )

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isReady.value = true
      emit('ready')
    })
  })
})
</script>

<style scoped>
.splash-screen {
  background: #fafbf8;
}

.splash-blob,
.splash-logo,
.splash-wave {
  position: absolute;
  z-index: 10;
}

.splash-blob-mobile {
  top: -16px;
  right: -4px;
  width: 166px;
  height: 172px;
}

.splash-blob-desktop {
  top: -20px;
  right: -40px;
  display: none;
  width: 324px;
  height: 320px;
}

.splash-logo {
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-logo img {
  width: auto;
  height: auto;
}

.splash-wave-mobile {
  right: 0;
  bottom: -4px;
  width: 105%;
}

.splash-wave-desktop {
  right: 0;
  bottom: 0;
  display: none;
  width: 105%;
}

@media (min-width: 640px) {
  .splash-blob-mobile,
  .splash-wave-mobile {
    display: none;
  }

  .splash-wave-desktop {
    display: block;
  }
}

@media (min-width: 1024px) {
  .splash-blob-desktop {
    display: block;
  }

  .splash-wave-desktop {
    bottom: -24px;
  }
}

@media (min-width: 1280px) {
  .splash-wave-desktop {
    bottom: -48px;
  }
}
</style>
