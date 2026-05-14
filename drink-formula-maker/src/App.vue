<template>
  <div class="container py-5">
    <header class="text-center mb-5">
      <h1 class="display-4 fw-bold mb-3">
        <i class="bi bi-cup-straw text-danger me-2"></i>
        奶茶特调配方创作
      </h1>
      <p class="text-muted">打造专属于你的美味配方</p>
    </header>

    <div class="row">
      <div class="col-lg-8">
        <div class="card p-4 mb-4">
          <h3 class="mb-4">
            <i class="bi bi-palette text-primary me-2"></i>
            创作你的配方
          </h3>

          <div class="mb-4">
            <h5 class="mb-3">选择茶底</h5>
            <div class="row g-3">
              <div v-for="tea in teaBases" :key="tea.id" class="col-md-4">
                <div 
                  class="card tea-base-card p-3 text-center h-100"
                  :class="{ selected: selectedTea?.id === tea.id }"
                  @click="selectTea(tea)"
                >
                  <img :src="tea.image" :alt="tea.name" class="img-fluid rounded mb-2" style="height: 80px; object-fit: cover;">
                  <h6 class="mb-1">{{ tea.name }}</h6>
                  <small class="text-muted">{{ tea.description }}</small>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h5 class="mb-3">选择小料 (多选)</h5>
            <div class="row g-3">
              <div v-for="topping in toppings" :key="topping.id" class="col-md-3">
                <div 
                  class="card topping-card p-3 text-center h-100"
                  :class="{ selected: selectedToppings.some(t => t.id === topping.id) }"
                  @click="toggleTopping(topping)"
                >
                  <img :src="topping.image" :alt="topping.name" class="img-fluid rounded mb-2" style="height: 60px; object-fit: cover;">
                  <h6 class="mb-1">{{ topping.name }}</h6>
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-6">
              <h5 class="mb-3">选择甜度</h5>
              <div class="d-flex flex-wrap gap-2">
                <button 
                  v-for="sweet in sweetnessLevels" 
                  :key="sweet"
                  class="btn"
                  :class="selectedSweetness === sweet ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="selectedSweetness = sweet"
                >
                  {{ sweet }}
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <h5 class="mb-3">选择冰度</h5>
              <div class="d-flex flex-wrap gap-2">
                <button 
                  v-for="ice in iceLevels" 
                  :key="ice"
                  class="btn"
                  :class="selectedIce === ice ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="selectedIce = ice"
                >
                  {{ ice }}
                </button>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h5 class="mb-3">配方名称</h5>
            <input 
              type="text" 
              class="form-control form-control-lg" 
              v-model="formulaName"
              placeholder="给你的特调起个名字..."
            >
          </div>

          <div class="mb-4">
            <h5 class="mb-3">选择分类</h5>
            <select class="form-select" v-model="selectedCategory">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="d-grid gap-2">
            <button class="btn btn-primary btn-lg" @click="saveFormula" :disabled="!canSave">
              <i class="bi bi-save me-2"></i>
              保存配方
            </button>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card formula-card p-4 mb-4 sticky-top" style="top: 20px;">
          <h4 class="mb-4">
            <i class="bi bi-eye me-2"></i>
            配方预览
          </h4>
          
          <div v-if="selectedTea" class="mb-3">
            <h6>茶底</h6>
            <p class="mb-1 fw-bold">{{ selectedTea.name }}</p>
          </div>
          <div v-else class="text-white-50 mb-3">
            <p>请选择茶底</p>
          </div>

          <div v-if="selectedToppings.length > 0" class="mb-3">
            <h6>小料</h6>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="t in selectedToppings" :key="t.id" class="badge bg-light text-dark">
                {{ t.name }}
              </span>
            </div>
          </div>

          <div class="mb-3">
            <h6>甜度 / 冰度</h6>
            <p class="mb-1">{{ selectedSweetness }} / {{ selectedIce }}</p>
          </div>


        </div>

        <div class="card p-4">
          <h4 class="mb-4">
            <i class="bi bi-grid text-info me-2"></i>
            分类筛选
          </h4>
          <div class="d-flex flex-wrap gap-2">
            <button 
              class="btn btn-sm"
              :class="filterCategory === '全部' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="filterCategory = '全部'"
            >
              全部
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat"
              class="btn btn-sm"
              :class="filterCategory === cat ? 'btn-primary' : 'btn-outline-secondary'"
              @click="filterCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <h3 class="mb-4">
        <i class="bi bi-collection text-warning me-2"></i>
        我的收藏配方
      </h3>

      <div v-if="filteredFormulas.length === 0" class="empty-state">
        <i class="bi bi-inbox"></i>
        <h5>暂无收藏配方</h5>
        <p>开始创作你的第一个专属配方吧！</p>
      </div>

      <div v-else class="row g-4">
        <div v-for="(formula, index) in filteredFormulas" :key="index" class="col-md-6 col-lg-4">
          <div class="card p-4 h-100">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="mb-1">{{ formula.name }}</h5>
                <span class="category-tag">{{ formula.category }}</span>
              </div>
              <button class="btn btn-sm btn-outline-danger" @click="deleteFormula(index)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            
            <div class="mb-3">
              <p class="mb-1"><strong>茶底：</strong>{{ formula.teaBase.name }}</p>
              <p class="mb-1"><strong>小料：</strong>
                <span v-if="formula.toppings.length === 0">无</span>
                <span v-else>
                  <span v-for="(t, i) in formula.toppings" :key="i">
                    {{ t.name }}<span v-if="i < formula.toppings.length - 1">、</span>
                  </span>
                </span>
              </p>
              <p class="mb-1"><strong>甜度：</strong>{{ formula.sweetness }}</p>
              <p class="mb-1"><strong>冰度：</strong>{{ formula.ice }}</p>
            </div>

            <div class="text-end">
              <small class="text-muted">{{ formula.date }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const teaBases = ref([
  { id: 1, name: '红茶', description: '浓郁香醇', image: 'https://picsum.photos/id/225/200/200' },
  { id: 2, name: '绿茶', description: '清新爽口', image: 'https://picsum.photos/id/165/200/200' },
  { id: 3, name: '乌龙茶', description: '回甘悠长', image: 'https://picsum.photos/id/1060/200/200' },
  { id: 4, name: '茉莉绿茶', description: '花香四溢', image: 'https://picsum.photos/id/1080/200/200' },
  { id: 5, name: '普洱茶', description: '醇厚温润', image: 'https://picsum.photos/id/431/200/200' },
  { id: 6, name: '四季春茶', description: '清香怡人', image: 'https://picsum.photos/id/129/200/200' }
])

const toppings = ref([
  { id: 1, name: '珍珠', image: 'https://picsum.photos/id/292/200/200' },
  { id: 2, name: '椰果', image: 'https://picsum.photos/id/488/200/200' },
  { id: 3, name: '布丁', image: 'https://picsum.photos/id/291/200/200' },
  { id: 4, name: '仙草', image: 'https://picsum.photos/id/312/200/200' },
  { id: 5, name: '芋圆', image: 'https://picsum.photos/id/365/200/200' },
  { id: 6, name: '红豆', image: 'https://picsum.photos/id/139/200/200' },
  { id: 7, name: '芝士奶盖', image: 'https://picsum.photos/id/306/200/200' },
  { id: 8, name: '奥利奥', image: 'https://picsum.photos/id/493/200/200' }
])

const sweetnessLevels = ['无糖', '三分糖', '五分糖', '七分糖', '全糖']
const iceLevels = ['去冰', '少冰', '正常冰', '多冰', '热饮']
const categories = ['经典系列', '创意特调', '清爽系列', '浓郁系列', '果味系列']

const selectedTea = ref(null)
const selectedToppings = ref([])
const selectedSweetness = ref('五分糖')
const selectedIce = ref('正常冰')
const formulaName = ref('')
const selectedCategory = ref('经典系列')
const filterCategory = ref('全部')
const savedFormulas = ref([])

const canSave = computed(() => {
  return selectedTea.value && formulaName.value.trim()
})

const filteredFormulas = computed(() => {
  if (filterCategory.value === '全部') {
    return savedFormulas.value
  }
  return savedFormulas.value.filter(f => f.category === filterCategory.value)
})

const selectTea = (tea) => {
  selectedTea.value = tea
}

const toggleTopping = (topping) => {
  const index = selectedToppings.value.findIndex(t => t.id === topping.id)
  if (index > -1) {
    selectedToppings.value.splice(index, 1)
  } else {
    selectedToppings.value.push(topping)
  }
}

const saveFormula = () => {
  if (!canSave.value) return
  
  const formula = {
    name: formulaName.value.trim(),
    teaBase: selectedTea.value,
    toppings: [...selectedToppings.value],
    sweetness: selectedSweetness.value,
    ice: selectedIce.value,
    category: selectedCategory.value,
    date: new Date().toLocaleDateString('zh-CN')
  }
  
  savedFormulas.value.unshift(formula)
  saveToLocalStorage()
  
  formulaName.value = ''
  selectedToppings.value = []
  selectedSweetness.value = '五分糖'
  selectedIce.value = '正常冰'
  selectedCategory.value = '经典系列'
  
  alert('配方保存成功！')
}

const deleteFormula = (index) => {
  if (confirm('确定要删除这个配方吗？')) {
    const realIndex = savedFormulas.value.findIndex(f => 
      filteredFormulas.value[index] === f
    )
    savedFormulas.value.splice(realIndex, 1)
    saveToLocalStorage()
  }
}

const saveToLocalStorage = () => {
  localStorage.setItem('drinkFormulas', JSON.stringify(savedFormulas.value))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('drinkFormulas')
  if (saved) {
    savedFormulas.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadFromLocalStorage()
})
</script>
