import React from 'react';
import styled from 'styled-components';
import { Chapter } from '../../types';

const ChapterList = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChapterTitle = styled.h3`
  color: #333;
  margin-bottom: 16px;
  font-size: 18px;
`;

const ChapterItem = styled.div<{ $active: boolean }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: ${(props) => (props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5')};
  color: ${(props) => (props.$active ? '#fff' : '#333')};
  
  &:hover {
    transform: translateX(4px);
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px dashed #667eea;
  border-radius: 8px;
  background: transparent;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 12px;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

interface ChapterManagerProps {
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  onAddChapter: () => void;
}

const ChapterManager: React.FC<ChapterManagerProps> = ({ chapters, activeChapterId, onSelectChapter, onAddChapter }) => {
  return (
    <ChapterList>
      <ChapterTitle>章节归档</ChapterTitle>
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          $active={chapter.id === activeChapterId}
          onClick={() => onSelectChapter(chapter.id)}
        >
          {chapter.title || '未命名章节'}
        </ChapterItem>
      ))}
      <AddButton onClick={onAddChapter}>+ 添加新章节</AddButton>
    </ChapterList>
  );
};

export default ChapterManager;
