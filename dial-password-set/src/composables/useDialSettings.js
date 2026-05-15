import { ref, computed } from 'vue'

export function useDialSettings() {
  const dialCount = ref(3)
  const scaleCount = ref(10)
  const damping = ref(0.15)

  const scaleMarks = computed(() => {
    const marks = []
    for (let i = 0; i < scaleCount.value; i++) {
      marks.push(i)
    }
    return marks
  })

  const setDialCount = (count) => {
    dialCount.value = Math.max(1, Math.min(10, count))
  }

  const setScaleCount = (count) => {
    scaleCount.value = Math.max(2, Math.min(100, count))
  }

  const setDamping = (value) => {
    damping.value = Math.max(0, Math.min(1, value))
  }

  const resetSettings = () => {
    dialCount.value = 3
    scaleCount.value = 10
    damping.value = 0.15
  }

  const getSettings = () => ({
    dialCount: dialCount.value,
    scaleCount: scaleCount.value,
    damping: damping.value
  })

  return {
    dialCount,
    scaleCount,
    damping,
    scaleMarks,
    setDialCount,
    setScaleCount,
    setDamping,
    resetSettings,
    getSettings
  }
}
