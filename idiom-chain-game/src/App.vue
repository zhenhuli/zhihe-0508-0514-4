<template>
  <div class="game-container">
    <Game v-if="gameStarted" @back="goBack" />
    <div v-else class="start-screen">
      <h1 class="title">🎯 成语接龙</h1>
      <p class="subtitle">挑战你的成语储备，看看谁是成语大王！</p>
      
      <div class="difficulty-select">
        <h3>选择难度</h3>
        <div class="difficulty-buttons">
          <button 
            class="diff-btn" 
            :class="{ active: difficulty === 'easy' }"
            @click="difficulty = 'easy'"
          >
            <span class="diff-icon">🌱</span>
            <span class="diff-name">入门</span>
            <span class="diff-desc">20秒答题</span>
          </button>
          <button 
            class="diff-btn" 
            :class="{ active: difficulty === 'hard' }"
            @click="difficulty = 'hard'"
          >
            <span class="diff-icon">🔥</span>
            <span class="diff-name">进阶</span>
            <span class="diff-desc">10秒答题</span>
          </button>
        </div>
      </div>
      
      <button class="start-btn" @click="startGame">
        开始游戏
      </button>
      
      <button class="idiom-book-btn" @click="showIdiomBook = true">
        📚 查看成语题库
      </button>
      
      <div class="rules">
        <h4>📖 游戏规则</h4>
        <ul>
          <li>系统会随机给出一个成语</li>
          <li>你需要用成语的最后一个字作为开头接龙</li>
          <li>在规定时间内完成答题</li>
          <li>答错的成语会被记录到错题本</li>
        </ul>
      </div>
    </div>

    <div v-if="showIdiomBook" class="modal-overlay" @click="showIdiomBook = false">
      <div class="modal idiom-book-modal" @click.stop>
        <div class="modal-header">
          <h3>📚 成语题库</h3>
          <button class="close-btn" @click="showIdiomBook = false">×</button>
        </div>
        <div class="modal-body">
          <div class="idiom-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: idiomTab === 'easy' }"
              @click="idiomTab = 'easy'"
            >
              🌱 入门题库 ({{ easyIdioms.length }})
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: idiomTab === 'hard' }"
              @click="idiomTab = 'hard'"
            >
              🔥 进阶题库 ({{ hardIdioms.length }})
            </button>
          </div>
          <div class="idiom-list">
            <div 
              v-for="(idiom, index) in currentIdiomList" 
              :key="index" 
              class="idiom-item"
            >
              <div class="idiom-word">{{ idiom.word }}</div>
              <div class="idiom-meaning">{{ idiom.meaning }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Game from './components/Game.vue';
import { easyIdioms, hardIdioms } from './data/idioms.js';

export default {
  name: 'App',
  components: {
    Game
  },
  data() {
    return {
      gameStarted: false,
      difficulty: 'easy',
      showIdiomBook: false,
      idiomTab: 'easy',
      easyIdioms,
      hardIdioms
    };
  },
  computed: {
    currentIdiomList() {
      return this.idiomTab === 'easy' ? this.easyIdioms : this.hardIdioms;
    }
  },
  methods: {
    startGame() {
      this.gameStarted = true;
    },
    goBack() {
      this.gameStarted = false;
    }
  },
  provide() {
    return {
      difficulty: this.difficulty
    };
  }
};
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 600px;
}

.start-screen {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 40px;
  box-shadow: var(--shadow);
  text-align: center;
}

.title {
  font-size: 42px;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.subtitle {
  color: var(--text-light);
  margin-bottom: 30px;
  font-size: 16px;
}

.difficulty-select h3 {
  margin-bottom: 20px;
  color: var(--text-color);
}

.difficulty-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

.diff-btn {
  flex: 1;
  max-width: 180px;
  padding: 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: white;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.diff-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.diff-btn.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(118, 75, 162, 0.1));
}

.diff-icon {
  font-size: 32px;
}

.diff-name {
  font-weight: bold;
  font-size: 18px;
  color: var(--text-color);
}

.diff-desc {
  font-size: 14px;
  color: var(--text-light);
}

.start-btn {
  width: 100%;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 30px;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.rules {
  text-align: left;
  padding: 20px;
  background: var(--bg-color);
  border-radius: var(--border-radius);
}

.rules h4 {
  margin-bottom: 12px;
  color: var(--text-color);
}

.rules ul {
  list-style: none;
}

.rules li {
  padding: 6px 0;
  padding-left: 24px;
  position: relative;
  color: var(--text-light);
}

.rules li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--success-color);
  font-weight: bold;
}

.idiom-book-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  color: var(--primary-color);
  background: white;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 30px;
}

.idiom-book-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-color);
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--bg-color);
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--border-color);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.idiom-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
  font-weight: bold;
}

.tab-btn:hover {
  border-color: var(--primary-color);
}

.tab-btn.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(118, 75, 162, 0.1));
  color: var(--primary-color);
}

.idiom-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.idiom-item {
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.idiom-word {
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 6px;
  font-size: 16px;
}

.idiom-meaning {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.5;
}
</style>
