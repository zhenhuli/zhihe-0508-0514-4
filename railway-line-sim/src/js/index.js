import '../css/main.styl';

class RailwaySimulator {
  constructor() {
    this.stations = [];
    this.connections = [];
    this.trains = [];
    this.stationCounter = 0;
    this.trainCounter = 0;
    this.isConnectMode = false;
    this.isTrainMode = false;
    this.selectedStation = null;
    this.draggedStation = null;
    this.trainPathStations = [];
    
    this.canvas = document.getElementById('canvas');
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateStationList();
  }

  bindEvents() {
    document.getElementById('addStationBtn').addEventListener('click', () => this.addStation());
    document.getElementById('connectModeBtn').addEventListener('click', () => this.toggleConnectMode());
    document.getElementById('addTrainBtn').addEventListener('click', () => this.toggleTrainMode());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
    
    document.getElementById('toggleToolbar').addEventListener('click', () => this.toggleToolbar());
    document.getElementById('togglePanel').addEventListener('click', () => this.togglePanel());
    
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
  }

  toggleToolbar() {
    const toolbar = document.getElementById('floatingToolbar');
    toolbar.classList.toggle('collapsed');
  }

  togglePanel() {
    const panel = document.getElementById('floatingPanel');
    panel.classList.toggle('collapsed');
  }

  addStation(x, y, name) {
    const rect = this.canvas.getBoundingClientRect();
    const stationX = x || rect.width / 2 + (Math.random() - 0.5) * 200;
    const stationY = y || rect.height / 2 + (Math.random() - 0.5) * 200;
    const stationName = name || `站点${++this.stationCounter}`;
    
    const station = {
      id: Date.now(),
      name: stationName,
      x: stationX,
      y: stationY
    };
    
    this.stations.push(station);
    this.renderStation(station);
    this.updateStationList();
  }

  renderStation(station) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'station');
    group.setAttribute('data-id', station.id);
    group.setAttribute('transform', `translate(${station.x}, ${station.y})`);
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '15');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('y', '35');
    text.textContent = station.name;
    
    group.appendChild(circle);
    group.appendChild(text);
    this.canvas.appendChild(group);
  }

  updateStationPosition(stationId, x, y) {
    const station = this.stations.find(s => s.id === stationId);
    if (station) {
      station.x = x;
      station.y = y;
      const group = this.canvas.querySelector(`[data-id="${stationId}"]`);
      if (group) {
        group.setAttribute('transform', `translate(${x}, ${y})`);
      }
      this.updateConnections();
      this.updateTrains();
    }
  }

  toggleConnectMode() {
    this.isTrainMode = false;
    this.trainPathStations = [];
    this.isConnectMode = !this.isConnectMode;
    this.selectedStation = null;
    
    const btn = document.getElementById('connectModeBtn');
    const trainBtn = document.getElementById('addTrainBtn');
    
    btn.classList.toggle('active', this.isConnectMode);
    trainBtn.classList.remove('active');
    this.canvas.classList.toggle('connect-mode', this.isConnectMode);
    this.canvas.classList.remove('train-mode');
    
    this.clearStationSelection();
  }

  toggleTrainMode() {
    this.isConnectMode = false;
    this.selectedStation = null;
    this.isTrainMode = !this.isTrainMode;
    this.trainPathStations = [];
    
    const btn = document.getElementById('addTrainBtn');
    const connectBtn = document.getElementById('connectModeBtn');
    
    btn.classList.toggle('active', this.isTrainMode);
    connectBtn.classList.remove('active');
    this.canvas.classList.toggle('train-mode', this.isTrainMode);
    this.canvas.classList.remove('connect-mode');
    
    this.clearStationSelection();
  }

  clearStationSelection() {
    this.canvas.querySelectorAll('.station').forEach(s => {
      s.classList.remove('selected', 'highlight');
    });
  }

  onMouseDown(e) {
    const stationGroup = e.target.closest('.station');
    
    if (stationGroup) {
      const stationId = parseInt(stationGroup.getAttribute('data-id'));
      
      if (this.isConnectMode) {
        this.handleStationClickForConnection(stationId, stationGroup);
      } else if (this.isTrainMode) {
        this.handleStationClickForTrain(stationId, stationGroup);
      } else {
        this.draggedStation = stationId;
        stationGroup.classList.add('selected');
      }
    }
  }

  handleStationClickForConnection(stationId, stationGroup) {
    if (!this.selectedStation) {
      this.selectedStation = stationId;
      stationGroup.classList.add('selected');
    } else if (this.selectedStation !== stationId) {
      this.connectStations(this.selectedStation, stationId);
      this.selectedStation = null;
      this.clearStationSelection();
    }
  }

  handleStationClickForTrain(stationId, stationGroup) {
    const index = this.trainPathStations.indexOf(stationId);
    
    if (index !== -1) {
      this.trainPathStations = this.trainPathStations.slice(0, index + 1);
      this.highlightTrainPathStations();
    } else {
      this.trainPathStations.push(stationId);
      stationGroup.classList.add('highlight');
      
      if (this.trainPathStations.length >= 2) {
        this.addTrainPath();
      }
    }
  }

  highlightTrainPathStations() {
    this.clearStationSelection();
    this.trainPathStations.forEach(id => {
      const group = this.canvas.querySelector(`[data-id="${id}"]`);
      if (group) group.classList.add('highlight');
    });
  }

  addTrainPath() {
    const trainName = `G${++this.trainCounter}00`;
    const train = {
      id: Date.now(),
      name: trainName,
      stations: [...this.trainPathStations]
    };
    
    this.trains.push(train);
    this.renderTrain(train);
    
    this.trainPathStations = [];
    this.clearStationSelection();
    this.isTrainMode = false;
    document.getElementById('addTrainBtn').classList.remove('active');
    this.canvas.classList.remove('train-mode');
  }

  onMouseMove(e) {
    if (this.draggedStation) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.updateStationPosition(this.draggedStation, x, y);
    }
  }

  onMouseUp(e) {
    if (this.draggedStation) {
      const group = this.canvas.querySelector(`[data-id="${this.draggedStation}"]`);
      if (group) group.classList.remove('selected');
      this.draggedStation = null;
    }
  }

  connectStations(stationId1, stationId2) {
    const exists = this.connections.some(c => 
      (c.from === stationId1 && c.to === stationId2) ||
      (c.from === stationId2 && c.to === stationId1)
    );
    
    if (!exists) {
      const connection = {
        id: Date.now(),
        from: stationId1,
        to: stationId2
      };
      this.connections.push(connection);
      this.renderConnection(connection);
    }
  }

  renderConnection(connection) {
    const fromStation = this.stations.find(s => s.id === connection.from);
    const toStation = this.stations.find(s => s.id === connection.to);
    
    if (fromStation && toStation) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('class', 'rail-line');
      line.setAttribute('data-id', connection.id);
      
      const path = this.generateCurvePath(fromStation, toStation);
      line.setAttribute('d', path);
      
      this.canvas.insertBefore(line, this.canvas.firstChild);
    }
  }

  generateCurvePath(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const cx1 = from.x + dx * 0.3;
    const cy1 = from.y + dy * 0.3 - dist * 0.1;
    const cx2 = from.x + dx * 0.7;
    const cy2 = from.y + dy * 0.7 - dist * 0.1;
    
    return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
  }

  updateConnections() {
    this.connections.forEach(connection => {
      const line = this.canvas.querySelector(`.rail-line[data-id="${connection.id}"]`);
      if (line) {
        const fromStation = this.stations.find(s => s.id === connection.from);
        const toStation = this.stations.find(s => s.id === connection.to);
        if (fromStation && toStation) {
          const path = this.generateCurvePath(fromStation, toStation);
          line.setAttribute('d', path);
        }
      }
    });
  }

  renderTrain(train) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'train-group');
    group.setAttribute('data-id', train.id);
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'train-path');
    
    const points = train.stations.map(id => this.stations.find(s => s.id === id));
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    path.setAttribute('d', d);
    
    group.appendChild(path);
    
    if (points.length >= 2) {
      const midIndex = Math.floor(points.length / 2);
      const p1 = points[midIndex - 1];
      const p2 = points[midIndex];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 - 15;
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('class', 'train-label');
      label.setAttribute('x', midX);
      label.setAttribute('y', midY);
      label.setAttribute('text-anchor', 'middle');
      label.textContent = train.name;
      
      group.appendChild(label);
    }
    
    this.canvas.insertBefore(group, this.canvas.querySelector('.station'));
  }

  updateTrains() {
    this.trains.forEach(train => {
      const group = this.canvas.querySelector(`.train-group[data-id="${train.id}"]`);
      if (group) {
        const points = train.stations.map(id => this.stations.find(s => s.id === id));
        const path = group.querySelector('.train-path');
        const label = group.querySelector('.train-label');
        
        if (path && points.every(p => p)) {
          const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          path.setAttribute('d', d);
        }
        
        if (label && points.length >= 2) {
          const midIndex = Math.floor(points.length / 2);
          const p1 = points[midIndex - 1];
          const p2 = points[midIndex];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2 - 15;
          label.setAttribute('x', midX);
          label.setAttribute('y', midY);
        }
      }
    });
  }

  deleteStation(stationId) {
    this.stations = this.stations.filter(s => s.id !== stationId);
    this.connections = this.connections.filter(c => 
      c.from !== stationId && c.to !== stationId
    );
    this.trains = this.trains.filter(t => 
      !t.stations.includes(stationId)
    );
    
    const stationGroup = this.canvas.querySelector(`[data-id="${stationId}"]`);
    if (stationGroup) stationGroup.remove();
    
    this.canvas.querySelectorAll('.rail-line').forEach(line => {
      const id = parseInt(line.getAttribute('data-id'));
      if (!this.connections.find(c => c.id === id)) {
        line.remove();
      }
    });
    
    this.canvas.querySelectorAll('.train-group').forEach(group => {
      const id = parseInt(group.getAttribute('data-id'));
      if (!this.trains.find(t => t.id === id)) {
        group.remove();
      }
    });
    
    this.updateStationList();
  }

  updateStationList() {
    const listContainer = document.getElementById('stationList');
    listContainer.innerHTML = '';
    
    this.stations.forEach(station => {
      const item = document.createElement('div');
      item.className = 'station-list-item';
      item.innerHTML = `
        <span>${station.name}</span>
        <button class="delete-btn" data-id="${station.id}">×</button>
      `;
      
      item.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteStation(station.id);
      });
      
      listContainer.appendChild(item);
    });
  }

  clearAll() {
    this.stations = [];
    this.connections = [];
    this.trains = [];
    this.stationCounter = 0;
    this.trainCounter = 0;
    this.selectedStation = null;
    this.draggedStation = null;
    this.isConnectMode = false;
    this.isTrainMode = false;
    this.trainPathStations = [];
    
    this.canvas.innerHTML = '';
    this.updateStationList();
    
    document.getElementById('connectModeBtn').classList.remove('active');
    document.getElementById('addTrainBtn').classList.remove('active');
    this.canvas.classList.remove('connect-mode', 'train-mode');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RailwaySimulator();
});
