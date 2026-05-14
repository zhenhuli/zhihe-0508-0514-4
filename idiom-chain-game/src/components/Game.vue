<template>
  <div class="game-screen">
    <div class="header">
      <button class="back-btn" @click="$emit('back')">← 返回</button>
      <div class="stats">
        <span class="score">得分: {{ score }}</span>
        <span class="combo">连击: {{ combo }}</span>
      </div>
    </div>

    <div class="timer-container">
      <div class="timer-bar" :style="{ width: timerPercent + '%', background: timerColor }"></div>
      <span class="timer-text">{{ timeLeft }}s</span>
    </div>

    <div class="idiom-display">
      <div class="current-idiom">
        <span class="label">系统接龙:</span>
        <span class="idiom-word">{{ currentIdiom }}</span>
      </div>
      <div class="hint">
        请用 "<span class="highlight">{{ lastChar }}</span>" 字开头接龙
      </div>
    </div>

    <div class="input-area">
      <input 
        v-model="userInput"
        type="text"
        class="idiom-input"
        placeholder="请输入成语..."
        @keyup.enter="submitAnswer"
        :disabled="isAnswering"
        autocomplete="off"
      />
      <button class="submit-btn" @click="submitAnswer" :disabled="isAnswering">
        提交
      </button>
    </div>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <div class="actions">
      <button class="action-btn" @click="showWrongBook = true">
        📚 错题本 ({{ wrongAnswers.length }})
      </button>
      <button class="action-btn hint-btn" @click="giveHint">
        💡 提示
      </button>
    </div>

    <div v-if="showWrongBook" class="modal-overlay" @click="showWrongBook = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>📚 错题本</h3>
          <button class="close-btn" @click="showWrongBook = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="wrongAnswers.length === 0" class="empty">
            还没有错题，继续加油！
          </div>
          <div v-else class="wrong-list">
            <div v-for="(item, index) in wrongAnswers" :key="index" class="wrong-item">
              <div class="wrong-word">{{ item.word }}</div>
              <div class="wrong-meaning">{{ item.meaning }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="gameOver" class="modal-overlay">
      <div class="modal game-over-modal">
        <div class="modal-header">
          <h3>🎮 游戏结束</h3>
        </div>
        <div class="modal-body">
          <div class="final-score">
            <div class="score-label">最终得分</div>
            <div class="score-value">{{ score }}</div>
          </div>
          <div class="game-stats">
            <div class="stat-item">
              <span class="stat-value">{{ correctCount }}</span>
              <span class="stat-label">答对</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ wrongCount }}</span>
              <span class="stat-label">答错</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ maxCombo }}</span>
              <span class="stat-label">最高连击</span>
            </div>
          </div>
          <button class="restart-btn" @click="restartGame">
            再来一局
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomIdiom, getIdiomByLastChar, getIdiomMeaning, isValidIdiom } from '../data/idioms.js';

export default {
  name: 'Game',
  inject: ['difficulty'],
  data() {
    return {
      currentIdiom: '',
      userInput: '',
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      wrongCount: 0,
      timeLeft: 20,
      timer: null,
      message: '',
      messageType: '',
      usedIdioms: [],
      wrongAnswers: [],
      showWrongBook: false,
      isAnswering: false,
      gameOver: false
    };
  },
  computed: {
    lastChar() {
      return this.currentIdiom ? this.currentIdiom[this.currentIdiom.length - 1] : '';
    },
    timerPercent() {
      const maxTime = this.difficulty === 'easy' ? 20 : 10;
      return (this.timeLeft / maxTime) * 100;
    },
    timerColor() {
      if (this.timerPercent > 50) return 'var(--success-color)';
      if (this.timerPercent > 25) return 'var(--warning-color)';
      return 'var(--error-color)';
    }
  },
  mounted() {
    this.startNewGame();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    startNewGame() {
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.correctCount = 0;
      this.wrongCount = 0;
      this.usedIdioms = [];
      this.gameOver = false;
      this.message = '';
      const idiom = getRandomIdiom(this.difficulty);
      this.currentIdiom = idiom.word;
      this.usedIdioms.push(idiom.word);
      this.startTimer();
    },
    startTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timeLeft = this.difficulty === 'easy' ? 20 : 10;
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.handleTimeout();
        }
      }, 1000);
    },
    handleTimeout() {
      clearInterval(this.timer);
      this.combo = 0;
      this.wrongCount++;
      const meaning = getIdiomMeaning(this.currentIdiom, this.difficulty);
      if (!this.wrongAnswers.some(w => w.word === this.currentIdiom)) {
        this.wrongAnswers.push({ word: this.currentIdiom, meaning });
      }
      this.showMessage('时间到！游戏结束', 'error');
      setTimeout(() => {
        this.gameOver = true;
      }, 1500);
    },
    submitAnswer() {
      if (!this.userInput.trim() || this.isAnswering) return;
      
      this.isAnswering = true;
      const answer = this.userInput.trim();
      
      if (answer[0] !== this.lastChar) {
        this.handleWrongAnswer('开头字不对哦！');
        return;
      }
      
      if (!isValidIdiom(answer, this.difficulty)) {
        this.handleWrongAnswer('这不是一个有效的成语！');
        return;
      }
      
      if (this.usedIdioms.includes(answer)) {
        this.handleWrongAnswer('这个成语已经用过了！');
        return;
      }
      
      this.handleCorrectAnswer(answer);
    },
    handleWrongAnswer(msg) {
      this.combo = 0;
      this.wrongCount++;
      const meaning = getIdiomMeaning(this.currentIdiom, this.difficulty);
      if (!this.wrongAnswers.some(w => w.word === this.currentIdiom)) {
        this.wrongAnswers.push({ word: this.currentIdiom, meaning });
      }
      this.showMessage(msg, 'error');
      this.isAnswering = false;
      this.userInput = '';
    },
    handleCorrectAnswer(answer) {
      this.combo++;
      this.correctCount++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }
      const points = 10 + this.combo * 2;
      this.score += points;
      this.usedIdioms.push(answer);
      this.showMessage(`回答正确！+${points}分`, 'success');
      
      setTimeout(() => {
        const nextIdiom = getIdiomByLastChar(answer[answer.length - 1], this.usedIdioms, this.difficulty);
        
        if (!nextIdiom) {
          this.showMessage('恭喜！你赢了！', 'success');
          clearInterval(this.timer);
          setTimeout(() => {
            this.gameOver = true;
          }, 1500);
          return;
        }
        
        this.currentIdiom = nextIdiom.word;
        this.usedIdioms.push(nextIdiom.word);
        this.userInput = '';
        this.isAnswering = false;
        this.message = '';
        this.startTimer();
      }, 1000);
    },
    showMessage(msg, type) {
      this.message = msg;
      this.messageType = type;
    },
    giveHint() {
      const hint = getIdiomByLastChar(this.lastChar, this.usedIdioms, this.difficulty);
      if (hint) {
        this.showMessage(`提示：${hint.word[0]}...${hint.word[hint.word.length - 1]}`, 'hint');
      } else {
        this.showMessage('没有可用的提示了', 'hint');
      }
    },
    restartGame() {
      this.gameOver = false;
      this.showWrongBook = false;
      this.startNewGame();
    }
  }
};
</script>

<style scoped>
.game-screen {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  padding: 8px 16px;
  border: none;
  background: var(--bg-color);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-color);
  transition: var(--transition);
}

.back-btn:hover {
  background: var(--border-color);
}

.stats {
  display: flex;
  gap: 20px;
}

.score, .combo {
  font-weight: bold;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border-radius: 20px;
  font-size: 14px;
}

.timer-container {
  position: relative;
  height: 12px;
  background: var(--bg-color);
  border-radius: 6px;
  margin-bottom: 30px;
  overflow: hidden;
}

.timer-bar {
  height: 100%;
  transition: width 1s linear, background 0.3s;
  border-radius: 6px;
}

.timer-text {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: var(--text-color);
}

.idiom-display {
  text-align: center;
  margin-bottom: 30px;
}

.current-idiom {
  margin-bottom: 15px;
}

.label {
  color: var(--text-light);
  font-size: 14px;
  margin-right: 10px;
}

.idiom-word {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary-color);
}

.hint {
  font-size: 16px;
  color: var(--text-light);
}

.highlight {
  color: var(--error-color);
  font-weight: bold;
  font-size: 24px;
}

.input-area {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.idiom-input {
  flex: 1;
  padding: 16px 20px;
  font-size: 18px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.idiom-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.idiom-input:disabled {
  background: var(--bg-color);
  cursor: not-allowed;
}

.submit-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  text-align: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 20px;
}

.message.success {
  background: rgba(82, 196, 26, 0.1);
  color: var(--success-color);
}

.message.error {
  background: rgba(245, 34, 45, 0.1);
  color: var(--error-color);
}

.message.hint {
  background: rgba(250, 173, 20, 0.1);
  color: var(--warning-color);
}

.actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
}

.action-btn:hover {
  border-color: var(--primary-color);
  background: var(--bg-color);
}

.hint-btn {
  flex: none;
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
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
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
}

.close-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: var(--bg-color);
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.empty {
  text-align: center;
  color: var(--text-light);
  padding: 40px 0;
}

.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wrong-item {
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  border-left: 4px solid var(--error-color);
}

.wrong-word {
  font-weight: bold;
  color: var(--error-color);
  margin-bottom: 6px;
}

.wrong-meaning {
  font-size: 14px;
  color: var(--text-light);
}

.game-over-modal .final-score {
  text-align: center;
  margin-bottom: 30px;
}

.score-label {
  font-size: 18px;
  color: var(--text-light);
  margin-bottom: 10px;
}

.score-value {
  font-size: 64px;
  font-weight: bold;
  color: var(--primary-color);
}

.game-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: var(--text-color);
}

.stat-label {
  font-size: 14px;
  color: var(--text-light);
}

.restart-btn {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.restart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}
</style>
