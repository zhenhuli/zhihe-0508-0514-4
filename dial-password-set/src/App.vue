<script setup>
import { ref, computed, watch } from 'vue'
import DialComponent from './components/DialComponent.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import PasswordList from './components/PasswordList.vue'
import { usePasswordStorage } from './composables/usePasswordStorage'

const { savedPasswords, savePassword, deletePassword } = usePasswordStorage()

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

const dialValues = ref([])
const passwordName = ref('')
const showSaveModal = ref(false)

const dials = computed(() => {
  return Array.from({ length: dialCount.value }, (_, i) => i)
})

const initDialValues = () => {
  dialValues.value = Array(dialCount.value).fill(0)
}

const handleValueChange = (index, value) => {
  dialValues.value[index] = value
}

const openSaveModal = () => {
  passwordName.value = `密码 ${savedPasswords.value.length + 1}`
  showSaveModal.value = true
}

const handleSavePassword = () => {
  if (passwordName.value.trim()) {
    savePassword(
      passwordName.value.trim(),
      [...dialValues.value],
      {
        dialCount: dialCount.value,
        scaleCount: scaleCount.value,
        damping: damping.value
      }
    )
    showSaveModal.value = false
    passwordName.value = ''
  }
}

const handleCloseModal = () => {
  showSaveModal.value = false
  passwordName.value = ''
}

const resetSettings = () => {
  dialCount.value = 3
  scaleCount.value = 10
  damping.value = 0.15
}

watch(dialCount, () => {
  initDialValues()
})

initDialValues()
</script>

<template>
  <div class="app-container">
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            🔐 圆盘密码自定义设置器
          </h1>
          <h2 class="subtitle">
            自定义密码位数、转盘刻度、转动阻尼效果
          </h2>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-4">
            <SettingsPanel 
              :dial-count="dialCount"
              :scale-count="scaleCount"
              :damping="damping"
              @update:dial-count="val => dialCount = val"
              @update:scale-count="val => scaleCount = val"
              @update:damping="val => damping = val"
              @reset="resetSettings"
            />
          </div>

          <div class="column is-8">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">密码转盘</p>
              </header>
              <div class="card-content">
                <div class="current-password has-text-centered mb-5">
                  <p class="heading">当前密码组合</p>
                  <p class="title is-3 has-text-primary">
                    {{ dialValues.join(' - ') }}
                  </p>
                </div>

                <div class="dials-container is-flex is-justify-content-center is-flex-wrap-wrap">
                  <DialComponent
                    v-for="(dial, index) in dials"
                    :key="index"
                    :size="180"
                    :scale-count="scaleCount"
                    :damping="damping"
                    :scale-marks="scaleMarks"
                    @value-change="(val) => handleValueChange(index, val)"
                  />
                </div>

                <div class="has-text-centered mt-5">
                  <button class="button is-primary is-large" @click="openSaveModal">
                    <span class="icon">
                      <i>💾</i>
                    </span>
                    <span>保存当前密码组合</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="columns mt-4">
          <div class="column is-12">
            <PasswordList 
              :saved-passwords="savedPasswords"
              @delete="deletePassword"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="modal" :class="{ 'is-active': showSaveModal }">
      <div class="modal-background" @click="handleCloseModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">保存密码组合</p>
          <button class="delete" @click="handleCloseModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">密码名称</label>
            <div class="control">
              <input 
                class="input" 
                type="text" 
                v-model="passwordName"
                placeholder="请输入密码名称"
                @keyup.enter="handleSavePassword"
              >
            </div>
          </div>
          <div class="notification is-info is-light">
            <p>当前密码组合: <strong>{{ dialValues.join(' - ') }}</strong></p>
            <p class="mt-2">
              转盘数: {{ dialCount }} | 
              刻度数: {{ scaleCount }} | 
              阻尼: {{ damping.toFixed(2) }}
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="handleSavePassword">保存</button>
          <button class="button" @click="handleCloseModal">取消</button>
        </footer>
      </div>
    </div>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>圆盘密码自定义设置器</strong> - Vue3 + Bulma
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.current-password {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.current-password .heading {
  color: rgba(255, 255, 255, 0.9);
}

.current-password .title {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dials-container {
  gap: 10px;
}

.hero.is-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
