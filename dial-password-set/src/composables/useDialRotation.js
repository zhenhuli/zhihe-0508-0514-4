import { ref, computed } from 'vue'

export function useDialRotation(damping = 0.1) {
  const rotation = ref(0)
  const isDragging = ref(false)
  const startAngle = ref(0)
  const startRotation = ref(0)
  const velocity = ref(0)
  const lastAngle = ref(0)
  const lastTime = ref(0)

  const getAngle = (event, centerX, centerY) => {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX
    const clientY = event.touches ? event.touches[0].clientY : event.clientY
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
  }

  const startDrag = (event, centerX, centerY) => {
    isDragging.value = true
    startAngle.value = getAngle(event, centerX, centerY)
    startRotation.value = rotation.value
    lastAngle.value = startAngle.value
    lastTime.value = Date.now()
    velocity.value = 0
  }

  const drag = (event, centerX, centerY) => {
    if (!isDragging.value) return
    
    const currentAngle = getAngle(event, centerX, centerY)
    let angleDiff = currentAngle - lastAngle.value
    
    if (angleDiff > 180) angleDiff -= 360
    if (angleDiff < -180) angleDiff += 360
    
    const now = Date.now()
    const timeDiff = now - lastTime.value
    if (timeDiff > 0) {
      velocity.value = angleDiff / timeDiff * 16
    }
    
    rotation.value = startRotation.value + (currentAngle - startAngle.value)
    lastAngle.value = currentAngle
    lastTime.value = now
  }

  const endDrag = () => {
    isDragging.value = false
    applyMomentum()
  }

  const applyMomentum = () => {
    if (Math.abs(velocity.value) < 0.1) return
    
    velocity.value *= (1 - damping)
    rotation.value += velocity.value
    
    requestAnimationFrame(applyMomentum)
  }

  const snapToNearest = (scaleCount) => {
    const step = 360 / scaleCount
    rotation.value = Math.round(rotation.value / step) * step
  }

  return {
    rotation,
    isDragging,
    startDrag,
    drag,
    endDrag,
    snapToNearest
  }
}
