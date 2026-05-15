<template>
  <div class="container">
    <nav class="nav-extended" style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); margin-bottom: 30px;">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo center" style="font-size: 1.8rem;">🎎 古风服饰配色搭配器</a>
      </div>
    </nav>

    <div class="row">
      <div class="col s12 m6">
        <div class="card">
          <div class="card-content">
            <span class="card-title center-align" style="color: #8B4513; font-weight: 500;">
              <i class="material-icons left">palette</i>配色选择
            </span>
            
            <div class="section">
              <h6 style="color: #5D4037; font-weight: 500;">衣身配色</h6>
              <div class="color-palette">
                <button 
                  v-for="color in bodyColors" 
                  :key="color.name"
                  class="color-btn btn-floating"
                  :class="{ active: selectedBody === color.hex }"
                  :style="{ backgroundColor: color.hex }"
                  @click="selectedBody = color.hex"
                  :title="color.name"
                ></button>
              </div>
              <div class="input-field">
                <input 
                  type="color" 
                  v-model="selectedBody" 
                  id="bodyColor"
                  class="color-input"
                >
                <label for="bodyColor">自定义衣身颜色</label>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <h6 style="color: #5D4037; font-weight: 500;">镶边配色</h6>
              <div class="color-palette">
                <button 
                  v-for="color in borderColors" 
                  :key="color.name"
                  class="color-btn btn-floating"
                  :class="{ active: selectedBorder === color.hex }"
                  :style="{ backgroundColor: color.hex }"
                  @click="selectedBorder = color.hex"
                  :title="color.name"
                ></button>
              </div>
              <div class="input-field">
                <input 
                  type="color" 
                  v-model="selectedBorder" 
                  id="borderColor"
                  class="color-input"
                >
                <label for="borderColor">自定义镶边颜色</label>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <h6 style="color: #5D4037; font-weight: 500;">刺绣配色</h6>
              <div class="color-palette">
                <button 
                  v-for="color in embroideryColors" 
                  :key="color.name"
                  class="color-btn btn-floating"
                  :class="{ active: selectedEmbroidery === color.hex }"
                  :style="{ backgroundColor: color.hex }"
                  @click="selectedEmbroidery = color.hex"
                  :title="color.name"
                ></button>
              </div>
              <div class="input-field">
                <input 
                  type="color" 
                  v-model="selectedEmbroidery" 
                  id="embroideryColor"
                  class="color-input"
                >
                <label for="embroideryColor">自定义刺绣颜色</label>
              </div>
            </div>

            <div class="section center-align">
              <div class="input-field">
                <input 
                  type="text" 
                  v-model="templateName" 
                  id="templateName"
                  placeholder="为这套配色命名..."
                >
                <label for="templateName">模板名称</label>
              </div>
              <button 
                class="btn waves-effect waves-light" 
                style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);"
                @click="saveTemplate"
              >
                <i class="material-icons left">save</i>保存配色模板
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col s12 m6">
        <div class="card">
          <div class="card-content">
            <span class="card-title center-align" style="color: #8B4513; font-weight: 500;">
              <i class="material-icons left">visibility</i>穿搭预览
            </span>
            
            <div class="costume-preview center-align">
              <svg viewBox="0 0 200 280" class="costume-svg">
                <path 
                  d="M100 20 L60 60 L40 70 L30 120 L35 250 L80 260 L100 270 L120 260 L165 250 L170 120 L160 70 L140 60 Z" 
                  :fill="selectedBody"
                  stroke="#333"
                  stroke-width="1"
                />
                <path 
                  d="M100 20 L100 270 M60 60 L140 60" 
                  :stroke="selectedBorder"
                  stroke-width="4"
                  fill="none"
                />
                <path 
                  d="M40 70 L30 120 L35 250 M160 70 L170 120 L165 250" 
                  :stroke="selectedBorder"
                  stroke-width="3"
                  fill="none"
                />
                <circle cx="85" cy="100" r="8" :fill="selectedEmbroidery" />
                <circle cx="115" cy="100" r="8" :fill="selectedEmbroidery" />
                <path 
                  d="M75 130 Q100 110 125 130 Q100 150 75 130" 
                  :fill="selectedEmbroidery"
                />
                <path 
                  d="M75 170 Q100 150 125 170 Q100 190 75 170" 
                  :fill="selectedEmbroidery"
                />
                <path 
                  d="M75 210 Q100 190 125 210 Q100 230 75 210" 
                  :fill="selectedEmbroidery"
                />
              </svg>
            </div>

            <div class="color-info">
              <div class="chip" :style="{ backgroundColor: selectedBody, color: getContrastColor(selectedBody) }">
                衣身: {{ selectedBody }}
              </div>
              <div class="chip" :style="{ backgroundColor: selectedBorder, color: getContrastColor(selectedBorder) }">
                镶边: {{ selectedBorder }}
              </div>
              <div class="chip" :style="{ backgroundColor: selectedEmbroidery, color: getContrastColor(selectedEmbroidery) }">
                刺绣: {{ selectedEmbroidery }}
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <span class="card-title" style="color: #8B4513; font-weight: 500;">
              <i class="material-icons left">bookmark</i>已保存的配色模板
            </span>
            
            <div v-if="savedTemplates.length === 0" class="center-align grey-text">
              <p>暂无保存的配色模板</p>
            </div>
            
            <div class="collection">
              <div 
                v-for="(template, index) in savedTemplates" 
                :key="index"
                class="collection-item avatar"
              >
                <div class="color-preview-circle" :style="{ backgroundColor: template.body }"></div>
                <span class="title">{{ template.name }}</span>
                <p>
                  <span class="color-dot" :style="{ backgroundColor: template.body }"></span>衣身
                  <span class="color-dot" :style="{ backgroundColor: template.border }"></span>镶边
                  <span class="color-dot" :style="{ backgroundColor: template.embroidery }"></span>刺绣
                </p>
                <button 
                  class="btn-small secondary-content waves-effect"
                  style="background: #8B4513;"
                  @click="applyTemplate(template)"
                >
                  <i class="material-icons">apply</i>
                </button>
                <button 
                  class="btn-small secondary-content waves-effect red"
                  style="margin-right: 50px;"
                  @click="deleteTemplate(index)"
                >
                  <i class="material-icons">delete</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const selectedBody = ref('#8B4513')
const selectedBorder = ref('#FFD700')
const selectedEmbroidery = ref('#DC143C')
const templateName = ref('')
const savedTemplates = ref([])

const bodyColors = [
  { name: '深棕', hex: '#8B4513' },
  { name: '枣红', hex: '#8B0000' },
  { name: '藏青', hex: '#191970' },
  { name: '墨绿', hex: '#2F4F4F' },
  { name: '靛蓝', hex: '#4B0082' },
  { name: '驼色', hex: '#C19A6B' },
  { name: '月白', hex: '#F0F8FF' },
  { name: '粉红', hex: '#FFB6C1' }
]

const borderColors = [
  { name: '金色', hex: '#FFD700' },
  { name: '银色', hex: '#C0C0C0' },
  { name: '赤金', hex: '#FF6347' },
  { name: '翠绿', hex: '#228B22' },
  { name: '宝蓝', hex: '#4169E1' },
  { name: '紫色', hex: '#800080' },
  { name: '橙色', hex: '#FF8C00' },
  { name: '黑色', hex: '#000000' }
]

const embroideryColors = [
  { name: '大红', hex: '#DC143C' },
  { name: '明黄', hex: '#FFD700' },
  { name: '桃红', hex: '#FF69B4' },
  { name: '草绿', hex: '#7CFC00' },
  { name: '天蓝', hex: '#87CEEB' },
  { name: '紫罗兰', hex: '#EE82EE' },
  { name: '橙色', hex: '#FFA500' },
  { name: '白色', hex: '#FFFFFF' }
]

const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

const saveTemplate = () => {
  if (!templateName.value.trim()) {
    templateName.value = `配色方案 ${savedTemplates.value.length + 1}`
  }
  savedTemplates.value.push({
    name: templateName.value,
    body: selectedBody.value,
    border: selectedBorder.value,
    embroidery: selectedEmbroidery.value
  })
  localStorage.setItem('costumeTemplates', JSON.stringify(savedTemplates.value))
  templateName.value = ''
}

const applyTemplate = (template) => {
  selectedBody.value = template.body
  selectedBorder.value = template.border
  selectedEmbroidery.value = template.embroidery
}

const deleteTemplate = (index) => {
  savedTemplates.value.splice(index, 1)
  localStorage.setItem('costumeTemplates', JSON.stringify(savedTemplates.value))
}

onMounted(() => {
  const saved = localStorage.getItem('costumeTemplates')
  if (saved) {
    savedTemplates.value = JSON.parse(saved)
  }
})
</script>

<style scoped>
.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 15px 0;
}

.color-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: all 0.3s;
}

.color-btn.active {
  border: 3px solid #333;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.color-input {
  height: 50px !important;
  padding: 5px !important;
  cursor: pointer;
}

.costume-preview {
  padding: 20px;
  background: linear-gradient(135deg, #f5f5dc 0%, #fff8dc 100%);
  border-radius: 8px;
  margin: 20px 0;
}

.costume-svg {
  width: 200px;
  height: 280px;
}

.color-info {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.color-preview-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid #ddd;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 5px;
  border: 1px solid #ccc;
}

.chip {
  font-weight: 500;
}

.collection-item {
  min-height: 70px !important;
}
</style>
