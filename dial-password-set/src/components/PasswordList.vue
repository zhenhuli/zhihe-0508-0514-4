<template>
  <div class="password-list card">
    <header class="card-header">
      <p class="card-header-title">已保存的密码组合</p>
    </header>
    <div class="card-content">
      <div v-if="savedPasswords.length === 0" class="notification is-info is-light">
        暂无保存的密码组合
      </div>
      
      <div v-else class="saved-passwords">
        <div 
          v-for="password in savedPasswords" 
          :key="password.id"
          class="password-item box"
        >
          <div class="content">
            <div class="is-flex is-justify-content-space-between is-align-items-center">
              <div>
                <p class="title is-6">{{ password.name }}</p>
                <p class="subtitle is-7">
                  创建于: {{ new Date(password.createdAt).toLocaleString('zh-CN') }}
                </p>
              </div>
              <button 
                class="button is-danger is-small"
                @click="handleDelete(password.id)"
              >
                删除
              </button>
            </div>
            <div class="password-combination">
              <span class="tag is-primary is-medium">
                {{ password.combination.join(' - ') }}
              </span>
            </div>
            <div class="settings-info mt-2">
              <span class="tag is-light is-small">
                转盘数: {{ password.settings.dialCount }}</span>
              <span class="tag is-light is-small">
                刻度数: {{ password.settings.scaleCount }}</span>
              <span class="tag is-light is-small">
                阻尼: {{ password.settings.damping.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  savedPasswords: { type: Array, required: true }
})

const emit = defineEmits(['delete'])

const handleDelete = (id) => {
  emit('delete', id)
}
</script>

<style scoped>
.password-list {
  margin-bottom: 20px;
}

.password-item {
  margin-bottom: 10px;
}

.password-combination {
  margin: 10px 0;
}

.settings-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
