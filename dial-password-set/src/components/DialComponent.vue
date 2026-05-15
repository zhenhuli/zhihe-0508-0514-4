<template>
  <div class="dial-container" ref="containerRef">
    <div class="dial-base" :style="{ width: size + 'px', height: size + 'px' }">
      <div 
        class="dial"
        :style="{ transform: `rotate(${rotation}deg)` }"
        @mousedown="handleMouseDown"
        @touchstart="handleMouseDown"
      >
        <div class="dial-face">
          <div 
            v-for="mark in scaleMarks" 
            :key="mark"
            class="scale-mark"
            :style="{ transform: `rotate(${mark * (360 / scaleCount)}deg)` }"
          >
            <span class="mark-number">{{ mark }}</span>
          </div>
          <div class="dial-center"></div>
        </div>
      </div>
    </div>
    <div class="dial-indicator"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDialRotation } from '../composables/useDialRotation'

const props = defineProps({
  size: { type: Number, default: 200 },
  scaleCount: { type: Number, default: 10 },
  damping: { type: Number, default: 0.15 },
  scaleMarks: { type: Array, required: true }
})

const emit = defineEmits(['rotate', 'value-change'])

const containerRef = ref(null)
const { rotation, startDrag, drag, endDrag, snapToNearest } = useDialRotation(props.damping)

const getCenter = () => {
  if (!containerRef.value) return { x: 0, y: 0 }
  const rect = containerRef.value.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

const handleMouseDown = (e) => {
  e.preventDefault()
  const center = getCenter()
  startDrag(e, center.x, center.y)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('touchmove', handleMouseMove)
  window.addEventListener('touchend', handleMouseUp)
}

const getCurrentValue = () => {
  const normalizedRotation = ((rotation.value % 360) + 360) % 360
  const step = 360 / props.scaleCount
  return Math.round((360 - normalizedRotation) / step) % props.scaleCount
}

const handleMouseMove = (e) => {
  const center = getCenter()
  drag(e, center.x, center.y)
  emit('rotate', rotation.value)
  emit('value-change', getCurrentValue())
}

const handleMouseUp = () => {
  snapToNearest(props.scaleCount)
  endDrag()
  emit('value-change', getCurrentValue())
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleMouseMove)
  window.removeEventListener('touchend', handleMouseUp)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleMouseMove)
  window.removeEventListener('touchend', handleMouseUp)
})
</script>

<style scoped>
.dial-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.dial-base {
  position: relative;
  border-radius: 50%;
  background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.dial {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: grab;
  transition: box-shadow 0.2s;
  user-select: none;
}

.dial:active {
  cursor: grabbing;
}

.dial-face {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
}

.scale-mark {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  transform-origin: center;
}

.scale-mark::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 12px;
  background: #4a90d9;
  border-radius: 2px;
}

.mark-number {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.dial-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(145deg, #4a90d9, #357abd);
  box-shadow: 
    0 2px 8px rgba(74, 144, 217, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

.dial-indicator {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 12px solid #e74c3c;
  filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.5));
}
</style>
