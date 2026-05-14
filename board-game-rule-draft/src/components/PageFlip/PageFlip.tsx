import React, { useState } from 'react';
import styled from 'styled-components';
import { Chapter } from '../../types';

const BookContainer = styled.div`
  perspective: 2000px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const Book = styled.div`
  position: relative;
  width: 100%;
  min-height: 600px;
  transform-style: preserve-3d;
`;

const Page = styled.div<{ $isFlipped: boolean; $index: number }>`
  position: absolute;
  width: 100%;
  min-height: 600px;
  background: #fff;
  border-radius: 0 12px 12px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform-origin: left center;
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform: rotateY(${(props) => (props.$isFlipped ? -180 : 0)}deg);
  z-index: ${(props) => 100 - props.$index};
  backface-visibility: hidden;
`;

const PageContent = styled.div`
  padding: 40px;
  height: 100%;
  overflow-y: auto;
  max-height: 600px;
`;

const PageTitle = styled.h2`
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #667eea;
`;

const SectionTitle = styled.h3`
  color: #555;
  margin: 20px 0 12px;
  font-size: 18px;
`;

const SectionText = styled.p`
  color: #666;
  line-height: 1.8;
  margin-bottom: 16px;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 16px;
`;

const NavButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface PageFlipProps {
  chapters: Chapter[];
}

const PageFlip: React.FC<PageFlipProps> = ({ chapters }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = chapters.length || 1;

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // const currentChapter = chapters[currentPage] || { id: '1', title: '预览章节', sections: [], diagrams: [] };

  return (
    <BookContainer>
      <Book>
        {chapters.map((chapter, index) => (
          <Page key={chapter.id} $isFlipped={index < currentPage} $index={index}>
            <PageContent>
              <PageTitle>{chapter.title || '未命名章节'}</PageTitle>
              {chapter.sections.map((section) => (
                <div key={section.id}>
                  <SectionTitle>{section.title || '未命名小节'}</SectionTitle>
                  <SectionText>{section.content || '暂无内容'}</SectionText>
                </div>
              ))}
              {chapter.diagrams.map((diagram) => (
                <div key={diagram.id}>
                  <SectionTitle>📊 {diagram.title || '流程图'}</SectionTitle>
                  <SectionText>{diagram.description || '暂无说明'}</SectionText>
                </div>
              ))}
            </PageContent>
          </Page>
        ))}
      </Book>
      <NavButtons>
        <NavButton onClick={handlePrevPage} disabled={currentPage === 0}>
          ← 上一页
        </NavButton>
        <span style={{ display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 600 }}>
          第 {currentPage + 1} / {totalPages} 页
        </span>
        <NavButton onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          下一页 →
        </NavButton>
      </NavButtons>
    </BookContainer>
  );
};

export default PageFlip;
