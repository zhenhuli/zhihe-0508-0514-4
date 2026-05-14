import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ToolButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  background: ${(props) =>
    props.variant === 'primary'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : '#f0f0f0'};
  color: ${(props) => (props.variant === 'primary' ? '#fff' : '#333')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

interface ToolbarProps {
  onAddSection: () => void;
  onAddDiagram: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddSection, onAddDiagram, onTogglePreview, isPreviewMode }) => {
  return (
    <ToolbarContainer>
      <ToolButton onClick={onAddSection}>+ 添加规则分区</ToolButton>
      <ToolButton onClick={onAddDiagram}>+ 插入流程图</ToolButton>
      <ToolButton variant="primary" onClick={onTogglePreview}>
        {isPreviewMode ? '✏️ 编辑模式' : '📖 预览模式'}
      </ToolButton>
    </ToolbarContainer>
  );
};

export default Toolbar;
