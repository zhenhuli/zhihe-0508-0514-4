import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Toolbar from './components/Toolbar/Toolbar';
import SectionEditor from './components/RuleEditor/SectionEditor';
import DiagramEditor from './components/FlowDiagram/DiagramEditor';
import ChapterManager from './components/Chapter/ChapterManager';
import PageFlip from './components/PageFlip/PageFlip';
import { Chapter, RuleSection, FlowDiagram } from './types';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const EditorArea = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  min-height: 600px;
`;

const ChapterTitleInput = styled.input`
  width: 100%;
  font-size: 24px;
  font-weight: 700;
  border: none;
  border-bottom: 3px solid #667eea;
  padding: 12px 0;
  margin-bottom: 24px;
  outline: none;
  color: #333;
`;

const PreviewArea = styled.div`
  padding: 24px;
`;

const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: generateId(),
      title: '第一章：游戏基础',
      sections: [
        {
          id: generateId(),
          title: '1.1 游戏目标',
          content: '玩家需要通过策略和运气，收集资源并建造建筑，最终达成胜利条件。',
        },
        {
          id: generateId(),
          title: '1.2 玩家人数',
          content: '本游戏支持2-4名玩家同时进行，建议游戏时间为60-90分钟。',
        },
      ],
      diagrams: [
        {
          id: generateId(),
          title: '游戏流程示意图',
          description: '展示从游戏开始到结束的完整流程',
          imageUrl: '',
        },
      ],
    },
    {
      id: generateId(),
      title: '第二章：游戏规则',
      sections: [
        {
          id: generateId(),
          title: '2.1 回合流程',
          content: '每个玩家按顺序执行自己的回合，包括抽牌、行动、结算三个阶段。',
        },
      ],
      diagrams: [],
    },
  ]);

  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: generateId(),
      title: `第${chapters.length + 1}章：新章节`,
      sections: [],
      diagrams: [],
    };
    setChapters([...chapters, newChapter]);
    setActiveChapterId(newChapter.id);
  };

  const handleUpdateChapterTitle = (value: string) => {
    setChapters(
      chapters.map((c) =>
        c.id === activeChapterId ? { ...c, title: value } : c
      )
    );
  };

  const handleAddSection = () => {
    const newSection: RuleSection = {
      id: generateId(),
      title: '',
      content: '',
    };
    setChapters(
      chapters.map((c) =>
        c.id === activeChapterId
          ? { ...c, sections: [...c.sections, newSection] }
          : c
      )
    );
  };

  const handleUpdateSection = (id: string, field: 'title' | 'content', value: string) => {
    setChapters(
      chapters.map((c) =>
        c.id === activeChapterId
          ? {
              ...c,
              sections: c.sections.map((s) =>
                s.id === id ? { ...s, [field]: value } : s
              ),
            }
          : c
      )
    );
  };

  const handleAddDiagram = () => {
    const newDiagram: FlowDiagram = {
      id: generateId(),
      title: '',
      description: '',
      imageUrl: '',
    };
    setChapters(
      chapters.map((c) =>
        c.id === activeChapterId
          ? { ...c, diagrams: [...c.diagrams, newDiagram] }
          : c
      )
    );
  };

  const handleUpdateDiagram = (id: string, field: 'title' | 'description' | 'imageUrl', value: string) => {
    setChapters(
      chapters.map((c) =>
        c.id === activeChapterId
          ? {
              ...c,
              diagrams: c.diagrams.map((d) =>
                d.id === id ? { ...d, [field]: value } : d
              ),
            }
          : c
      )
    );
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Header>
          <Title>🎲 桌游规则草稿编辑器</Title>
          <Subtitle>分区编写规则 · 插入流程图 · 分章节归档 · 模拟翻阅效果</Subtitle>
        </Header>

        {!isPreviewMode ? (
          <MainContent>
            <div>
              <ChapterManager
                chapters={chapters}
                activeChapterId={activeChapterId}
                onSelectChapter={setActiveChapterId}
                onAddChapter={handleAddChapter}
              />
            </div>
            <div>
              <Toolbar
                onAddSection={handleAddSection}
                onAddDiagram={handleAddDiagram}
                onTogglePreview={() => setIsPreviewMode(true)}
                isPreviewMode={isPreviewMode}
              />
              <EditorArea>
                <ChapterTitleInput
                  type="text"
                  value={activeChapter.title}
                  onChange={(e) => handleUpdateChapterTitle(e.target.value)}
                  placeholder="章节标题"
                />
                {activeChapter.sections.map((section) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdate={handleUpdateSection}
                  />
                ))}
                {activeChapter.diagrams.map((diagram) => (
                  <DiagramEditor
                    key={diagram.id}
                    diagram={diagram}
                    onUpdate={handleUpdateDiagram}
                  />
                ))}
              </EditorArea>
            </div>
          </MainContent>
        ) : (
          <PreviewArea>
            <Toolbar
              onAddSection={() => {}}
              onAddDiagram={() => {}}
              onTogglePreview={() => setIsPreviewMode(false)}
              isPreviewMode={isPreviewMode}
            />
            <PageFlip chapters={chapters} />
          </PreviewArea>
        )}
      </AppContainer>
    </>
  );
};

export default App;
