<template>
  <div class="settings-panel card">
    <header class="card-header">
      <p class="card-header-title">转盘设置</p>
    </header>
    <div class="card-content">
      <div class="field">
        <label class="label">密码位数 (转盘数量)</label>
        <div class="control">
          <input 
            type="range" 
            class="slider is-fullwidth" 
            min="1" 
            max="10" 
            :value="dialCount"
            @input="updateDialCount"
          >
        </div>
        <p class="help is-info">当前: {{ dialCount }} 个转盘</p>
      </div>

      <div class="field">
        <label class="label">转盘刻度数量</label>
        <div class="control">
          <input 
            type="range" 
            class="slider is-fullwidth" 
            min="2" 
            max="50" 
            :value="scaleCount"
            @input="updateScaleCount"
          >
        </div>
        <p class="help is-info">当前: {{ scaleCount }} 个刻度</p>
      </div>

      <div class="field">
        <label class="label">转动阻尼系数</label>
        <div class="control">
          <input 
            type="range" 
            class="slider is-fullwidth" 
            min="0" 
            max="1" 
            step="0.05"
            :value="damping"
            @input="updateDamping"
          >
        </div>
        <p class="help is-info">当前: {{ damping.toFixed(2) }}</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-warning" @click="resetSettings">
            <span>重置默认</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dialCount: { type: Number, default: 3 },
  scaleCount: { type: Number, default: 10 },
  damping: { type: Number, default: 0.15 }
})

const emit = defineEmits(['update:dialCount', 'update:scaleCount', 'update:damping', 'reset'])

const updateDialCount = (e) => {
  emit('update:dialCount', parseInt(e.target.value))
}

const updateScaleCount = (e) => {
  emit('update:scaleCount', parseInt(e.target.value))
}

const updateDamping = (e) => {
  emit('update:damping', parseFloat(e.target.value))
}

const resetSettings = () => {
  emit('reset')
}
</script>

<style scoped>
.settings-panel {
  margin-bottom: 20px;
}

.slider {
  cursor: pointer;
}
</style>
