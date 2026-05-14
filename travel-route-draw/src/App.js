import React, { useState, useRef, useEffect } from 'react';

function App() {
  const canvasRef = useRef(null);
  const mapBackgroundRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [currentRouteName, setCurrentRouteName] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerNote, setMarkerNote] = useState('');
  const [markerName, setMarkerName] = useState('');
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff6b6b');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState('draw');

  const generateMapBackground = () => {
    const greenAreas = [];
    for (let i = 0; i < 20; i++) {
      greenAreas.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: 30 + Math.random() * 50,
        rotation: Math.random() * Math.PI
      });
    }
    return { greenAreas };
  };

  useEffect(() => {
    mapBackgroundRef.current = generateMapBackground();
    const savedRoutes = localStorage.getItem('travelRoutes');
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawMapBackground(ctx);
    
    paths.forEach(path => {
      drawPath(ctx, path.points, path.color, path.size);
    });
    
    if (currentPath.length > 0) {
      drawPath(ctx, currentPath, brushColor, brushSize);
    }
    
    markers.forEach((marker, index) => {
      drawMarker(ctx, marker, index === selectedMarker);
    });
  }, [paths, currentPath, markers, selectedMarker]);

  const drawMapBackground = (ctx) => {
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const bg = mapBackgroundRef.current;
    if (!bg) return;
    
    ctx.strokeStyle = '#c5e1a5';
    ctx.lineWidth = 1;
    bg.greenAreas.forEach(area => {
      ctx.beginPath();
      ctx.ellipse(area.x, area.y, area.r, area.r * 0.6, area.rotation, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(197, 225, 165, 0.3)';
      ctx.fill();
      ctx.stroke();
    });
    
    ctx.fillStyle = '#81d4fa';
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.bezierCurveTo(200, 280, 400, 320, 600, 290);
    ctx.bezierCurveTo(700, 270, 800, 310, 900, 280);
    ctx.lineTo(900, 310);
    ctx.bezierCurveTo(800, 340, 700, 300, 600, 320);
    ctx.bezierCurveTo(400, 350, 200, 310, 0, 330);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#a5d6a7';
    ctx.beginPath();
    ctx.ellipse(200, 150, 80, 60, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(650, 400, 100, 70, -0.2, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawPath = (ctx, points, color, size) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const drawMarker = (ctx, marker, isSelected) => {
    const { x, y, name } = marker;
    
    ctx.beginPath();
    ctx.arc(x, y, isSelected ? 14 : 12, 0, 2 * Math.PI);
    ctx.fillStyle = isSelected ? '#ff5252' : '#ff6b6b';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    if (name) {
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(name, x, y - 20);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    const coords = getCoordinates(e);
    
    if (tool === 'marker') {
      setMarkerName('');
      setMarkerNote('');
      setMarkers([...markers, { ...coords, name: '', note: '' }]);
      setSelectedMarker(markers.length);
      setShowMarkerModal(true);
    } else {
      setIsDrawing(true);
      setCurrentPath([coords]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool !== 'draw') return;
    const coords = getCoordinates(e);
    setCurrentPath(prev => [...prev, coords]);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length > 1) {
      setPaths(prev => [...prev, { points: currentPath, color: brushColor, size: brushSize }]);
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleCanvasClick = (e) => {
    if (tool === 'select') {
      const coords = getCoordinates(e);
      const clickedIndex = markers.findIndex(marker => {
        const dx = marker.x - coords.x;
        const dy = marker.y - coords.y;
        return Math.sqrt(dx * dx + dy * dy) < 15;
      });
      
      if (clickedIndex !== -1) {
        setSelectedMarker(clickedIndex);
        setMarkerName(markers[clickedIndex].name);
        setMarkerNote(markers[clickedIndex].note);
        setShowMarkerModal(true);
      } else {
        setSelectedMarker(null);
      }
    }
  };

  const saveMarkerInfo = () => {
    if (selectedMarker !== null) {
      const newMarkers = [...markers];
      newMarkers[selectedMarker] = {
        ...newMarkers[selectedMarker],
        name: markerName,
        note: markerNote
      };
      setMarkers(newMarkers);
    }
    setShowMarkerModal(false);
  };

  const deleteMarker = () => {
    if (selectedMarker !== null) {
      const newMarkers = markers.filter((_, index) => index !== selectedMarker);
      setMarkers(newMarkers);
      setSelectedMarker(null);
      setShowMarkerModal(false);
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setMarkers([]);
    setSelectedMarker(null);
  };

  const undoLastPath = () => {
    if (paths.length > 0) {
      setPaths(prev => prev.slice(0, -1));
    }
  };

  const saveRoute = () => {
    if (!currentRouteName.trim()) {
      window.alert('请输入路线名称');
      return;
    }
    const newRoute = {
      id: Date.now(),
      name: currentRouteName,
      paths,
      markers,
      createdAt: new Date().toLocaleString()
    };
    const newRoutes = [...routes, newRoute];
    setRoutes(newRoutes);
    localStorage.setItem('travelRoutes', JSON.stringify(newRoutes));
    setCurrentRouteName('');
    window.alert('路线保存成功！');
  };

  const loadRoute = (route) => {
    setPaths(route.paths);
    setMarkers(route.markers);
    setCurrentRouteName(route.name);
    setSelectedMarker(null);
  };

  const deleteRoute = (routeId) => {
    if (window.confirm('确定要删除这条路线吗？')) {
      const newRoutes = routes.filter(r => r.id !== routeId);
      setRoutes(newRoutes);
      localStorage.setItem('travelRoutes', JSON.stringify(newRoutes));
    }
  };

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#2d3436'];

  return (
    <div className="min-vh-100 bg-light-blue">
      <header className="bg-white shadow-2 pa3">
        <h1 className="f2 fw7 dark-gray ma0 tc">🗺️ 旅行路线手绘规划</h1>
        <p className="f5 gray tc mt2 mb0">在地图上自由绘制你的旅行轨迹，记录美好旅程</p>
      </header>

      <div className="flex flex-wrap">
        <div className="w-100 w-20-l pa3">
          <div className="bg-white br3 shadow-5 pa4">
            <h3 className="f5 fw6 dark-gray mt0 mb3">🎨 工具箱</h3>
            
            <div className="mb4">
              <p className="f6 fw5 silver mb2">工具选择</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTool('draw')}
                  className={`f6 link dim br2 ph3 pv2 mb2 dib ${
                    tool === 'draw' ? 'bg-blue white' : 'bg-light-gray dark-gray'
                  }`}
                >
                  ✏️ 绘制
                </button>
                <button
                  onClick={() => setTool('marker')}
                  className={`f6 link dim br2 ph3 pv2 mb2 dib ${
                    tool === 'marker' ? 'bg-blue white' : 'bg-light-gray dark-gray'
                  }`}
                >
                  📍 标记
                </button>
                <button
                  onClick={() => setTool('select')}
                  className={`f6 link dim br2 ph3 pv2 mb2 dib ${
                    tool === 'select' ? 'bg-blue white' : 'bg-light-gray dark-gray'
                  }`}
                >
                  👆 选择
                </button>
              </div>
            </div>

            <div className="mb4">
              <p className="f6 fw5 silver mb2">画笔颜色</p>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={`w2 h2 br-100 ba bw2 ${
                      brushColor === color ? 'b--dark-blue' : 'b--light-gray'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mb4">
              <p className="f6 fw5 silver mb2">画笔粗细: {brushSize}px</p>
              <input
                type="range"
                min="1"
                max="10"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-100"
              />
            </div>

            <div className="mb4">
              <p className="f6 fw5 silver mb2">操作</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={undoLastPath}
                  className="f6 link dim br2 ph3 pv2 mb2 dib bg-orange white"
                  disabled={paths.length === 0}
                >
                  ↩️ 撤销
                </button>
                <button
                  onClick={clearCanvas}
                  className="f6 link dim br2 ph3 pv2 mb2 dib bg-red white"
                >
                  🗑️ 清空
                </button>
              </div>
            </div>

            <hr className="ba b--light-gray mv4" />

            <div>
              <h3 className="f5 fw6 dark-gray mt0 mb3">💾 保存路线</h3>
              <input
                type="text"
                placeholder="输入路线名称..."
                value={currentRouteName}
                onChange={(e) => setCurrentRouteName(e.target.value)}
                className="w-100 pa2 mb2 ba b--light-gray br2 f6"
              />
              <button
                onClick={saveRoute}
                className="w-100 f6 link dim br2 ph3 pv2 dib bg-green white"
              >
                保存当前路线
              </button>
            </div>
          </div>
        </div>

        <div className="w-100 w-60-l pa3 tc">
          <div className="dib br3 shadow-5 overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleCanvasClick}
              className="cursor-crosshair"
              style={{ cursor: tool === 'draw' ? 'crosshair' : tool === 'marker' ? 'cell' : 'pointer' }}
            />
          </div>
          <p className="f6 silver mt3">
            💡 提示: 选择"绘制"工具在地图上自由画线，选择"标记"工具点击添加地点标记
          </p>
        </div>

        <div className="w-100 w-20-l pa3">
          <div className="bg-white br3 shadow-5 pa4">
            <h3 className="f5 fw6 dark-gray mt0 mb3">📋 我的路线</h3>
            
            {routes.length === 0 ? (
              <p className="f6 silver i">暂无保存的路线</p>
            ) : (
              <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                {routes.map(route => (
                  <div
                    key={route.id}
                    className="pa3 mb3 bg-light-gray br2"
                  >
                    <p className="f6 fw6 dark-gray ma0">{route.name}</p>
                    <p className="f7 silver ma0 mt1">{route.createdAt}</p>
                    <p className="f7 dark-gray ma0 mt1">
                      📍 {route.markers.length} 个地点 | ✏️ {route.paths.length} 条路径
                    </p>
                    <div className="flex gap-2 mt2">
                      <button
                        onClick={() => loadRoute(route)}
                        className="f7 link dim br1 ph2 pv1 dib bg-blue white"
                      >
                        加载
                      </button>
                      <button
                        onClick={() => deleteRoute(route.id)}
                        className="f7 link dim br1 ph2 pv1 dib bg-red white"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {markers.length > 0 && (
            <div className="bg-white br3 shadow-5 pa4 mt4">
              <h3 className="f5 fw6 dark-gray mt0 mb3">📍 途经地点</h3>
              <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
                {markers.map((marker, index) => (
                  <div
                    key={index}
                    className={`pa2 mb2 br2 ${
                      selectedMarker === index ? 'bg-light-blue' : 'bg-light-gray'
                    }`}
                  >
                    <p className="f6 fw6 dark-gray ma0">
                      {marker.name || `地点 ${index + 1}`}
                    </p>
                    {marker.note && (
                      <p className="f7 silver ma0 mt1 i truncate">{marker.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showMarkerModal && (
        <div className="fixed top-0 left-0 w-100 h-100 bg-black-50 flex items-center justify-center z-9999">
          <div className="bg-white br3 shadow-5 pa4 w-90 w-30-l">
            <h3 className="f5 fw6 dark-gray mt0 mb3">📍 编辑地点信息</h3>
            
            <div className="mb3">
              <label className="f6 fw5 silver db mb2">地点名称</label>
              <input
                type="text"
                placeholder="例如：长城"
                value={markerName}
                onChange={(e) => setMarkerName(e.target.value)}
                className="w-100 pa2 ba b--light-gray br2 f6"
                autoFocus
              />
            </div>
            
            <div className="mb4">
              <label className="f6 fw5 silver db mb2">旅途备注</label>
              <textarea
                placeholder="记录这里的美好回忆..."
                value={markerNote}
                onChange={(e) => setMarkerNote(e.target.value)}
                className="w-100 pa2 ba b--light-gray br2 f6 h4"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={saveMarkerInfo}
                className="f6 link dim br2 ph3 pv2 dib bg-blue white"
              >
                保存
              </button>
              <button
                onClick={deleteMarker}
                className="f6 link dim br2 ph3 pv2 dib bg-red white"
              >
                删除
              </button>
              <button
                onClick={() => setShowMarkerModal(false)}
                className="f6 link dim br2 ph3 pv2 dib bg-gray white"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
