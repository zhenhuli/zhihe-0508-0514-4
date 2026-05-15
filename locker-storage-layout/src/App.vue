<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">储物柜布局规划模拟器</h1>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">网格设置</h5>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">行数</label>
            <input type="number" class="form-control" v-model.number="rows" min="1" max="20">
          </div>
          <div class="col-md-3">
            <label class="form-label">列数</label>
            <input type="number" class="form-control" v-model.number="cols" min="1" max="20">
          </div>
          <div class="col-md-2">
            <label class="form-label">分类标注</label>
            <select class="form-select" v-model="selectedCategory">
              <option value="">未分类</option>
              <option value="clothes">衣物</option>
              <option value="shoes">鞋子</option>
              <option value="documents">文件</option>
              <option value="misc">杂物</option>
            </select>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button class="btn btn-warning me-2" @click="applyCategory" :disabled="selectedCells.length === 0 || !selectedCategory">应用分类</button>
            <button class="btn btn-primary me-2" @click="resetGrid">重置网格</button>
            <button class="btn btn-success me-2" @click="mergeCells" :disabled="selectedCells.length < 2">合并选中</button>
            <button class="btn btn-danger" @click="unmergeCell" :disabled="selectedCells.length !== 1 || !cells[selectedCells[0]]?.merged">取消合并</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">图例说明</h5>
        <div class="d-flex flex-wrap gap-3">
          <span class="badge bg-primary">未分类</span>
          <span class="badge" style="background-color: #2196f3;">衣物</span>
          <span class="badge" style="background-color: #e91e63;">鞋子</span>
          <span class="badge" style="background-color: #4caf50;">文件</span>
          <span class="badge" style="background-color: #ff9800;">杂物</span>
          <span class="badge" style="background-color: #9c27b0;">合并区域</span>
        </div>
        <p class="mt-2 mb-0 text-muted small">
          操作提示：点击格子选中/取消，Shift+点击多选；选中后点击"应用分类"标注用途；需选矩形区域才能合并；已选中{{ selectedCells.length }}个格子
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div 
          class="locker-grid" 
          :style="{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 80px)`
          }"
        >
          <template v-for="(cell, index) in cells" :key="index">
            <div
              v-if="!cell.hidden"
              class="locker-cell"
              :class="[
                cell.category,
                { selected: selectedCells.includes(index), merged: cell.merged }
              ]"
              :style="getCellStyle(cell)"
              @click="handleCellClick(index, $event)"
            >
              <span class="category-badge" v-if="cell.category">{{ getCategoryLabel(cell.category) }}</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="mt-4 text-center">
      <button class="btn btn-info me-2" @click="exportLayout">导出布局</button>
      <button class="btn btn-warning" @click="importLayout">导入布局</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const rows = ref(4)
const cols = ref(4)
const selectedCells = ref([])
const selectedCategory = ref('')
const cells = ref([])

const categories = {
  clothes: '衣物',
  shoes: '鞋子',
  documents: '文件',
  misc: '杂物'
}

const getCategoryLabel = (cat) => categories[cat] || ''

const initGrid = () => {
  cells.value = Array.from({ length: rows.value * cols.value }, (_, i) => ({
    id: i,
    category: '',
    merged: false,
    hidden: false,
    colSpan: 1,
    rowSpan: 1
  }))
  selectedCells.value = []
}

onMounted(() => {
  initGrid()
})

watch([rows, cols], () => {
  initGrid()
})

const handleCellClick = (index, event) => {
  if (cells.value[index].hidden) return

  if (event.shiftKey) {
    if (selectedCells.value.includes(index)) {
      selectedCells.value = selectedCells.value.filter(i => i !== index)
    } else {
      selectedCells.value.push(index)
    }
  } else {
    if (selectedCells.value.includes(index)) {
      selectedCells.value = selectedCells.value.filter(i => i !== index)
    } else {
      selectedCells.value = [index]
    }
  }
}

const applyCategory = () => {
  if (selectedCells.value.length === 0 || !selectedCategory.value) return
  
  selectedCells.value.forEach(index => {
    cells.value[index].category = selectedCategory.value
  })
}

const resetGrid = () => {
  if (confirm('确定要重置网格吗？所有设置将丢失。')) {
    initGrid()
  }
}

const getCellStyle = (cell) => {
  if (cell.colSpan > 1 || cell.rowSpan > 1) {
    return {
      gridColumn: `span ${cell.colSpan}`,
      gridRow: `span ${cell.rowSpan}`
    }
  }
  return {}
}

const mergeCells = () => {
  if (selectedCells.value.length < 2) return

  const positions = selectedCells.value.map(index => ({
    index,
    row: Math.floor(index / cols.value),
    col: index % cols.value
  }))

  const minRow = Math.min(...positions.map(p => p.row))
  const maxRow = Math.max(...positions.map(p => p.row))
  const minCol = Math.min(...positions.map(p => p.col))
  const maxCol = Math.max(...positions.map(p => p.col))

  const expectedCount = (maxRow - minRow + 1) * (maxCol - minCol + 1)
  if (selectedCells.value.length !== expectedCount) {
    alert('请选择矩形区域进行合并')
    return
  }

  const firstIndex = minRow * cols.value + minCol
  cells.value[firstIndex].merged = true
  cells.value[firstIndex].colSpan = maxCol - minCol + 1
  cells.value[firstIndex].rowSpan = maxRow - minRow + 1

  selectedCells.value.forEach(index => {
    if (index !== firstIndex) {
      cells.value[index].hidden = true
    }
  })

  selectedCells.value = []
}

const unmergeCell = () => {
  if (selectedCells.value.length !== 1) return
  
  const mergedIndex = selectedCells.value[0]
  const cell = cells.value[mergedIndex]
  
  if (!cell.merged) return
  
  const startRow = Math.floor(mergedIndex / cols.value)
  const startCol = mergedIndex % cols.value
  
  for (let r = 0; r < cell.rowSpan; r++) {
    for (let c = 0; c < cell.colSpan; c++) {
      const index = (startRow + r) * cols.value + (startCol + c)
      cells.value[index].hidden = false
      cells.value[index].merged = false
      cells.value[index].colSpan = 1
      cells.value[index].rowSpan = 1
    }
  }
  
  selectedCells.value = []
}

const exportLayout = () => {
  const layout = {
    rows: rows.value,
    cols: cols.value,
    cells: cells.value
  }
  const data = JSON.stringify(layout, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'locker-layout.json'
  a.click()
  URL.revokeObjectURL(url)
}

const importLayout = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const layout = JSON.parse(event.target.result)
          rows.value = layout.rows
          cols.value = layout.cols
          cells.value = layout.cells
          alert('布局导入成功！')
        } catch (err) {
          alert('导入失败，文件格式错误')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}
</script>
