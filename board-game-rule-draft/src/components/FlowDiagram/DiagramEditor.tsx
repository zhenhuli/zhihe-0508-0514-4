import React from 'react';
import styled from 'styled-components';
import { FlowDiagram } from '../../types';

const DiagramContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DiagramTitle = styled.input`
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 0;
  margin-bottom: 16px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #764ba2;
  }
`;

const DiagramDescription = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  outline: none;
  margin-bottom: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #764ba2;
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  border: 2px dashed #ddd;
`;

interface DiagramEditorProps {
  diagram: FlowDiagram;
  onUpdate: (id: string, field: 'title' | 'description' | 'imageUrl', value: string) => void;
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({ diagram, onUpdate }) => {
  return (
    <DiagramContainer>
      <DiagramTitle
        type="text"
        value={diagram.title}
        onChange={(e) => onUpdate(diagram.id, 'title', e.target.value)}
        placeholder="流程图标题..."
      />
      <DiagramDescription
        value={diagram.description}
        onChange={(e) => onUpdate(diagram.id, 'description', e.target.value)}
        placeholder="流程图说明..."
      />
      <ImagePreview>
        流程图占位 - 可拖拽或上传图片
      </ImagePreview>
    </DiagramContainer>
  );
};

export default DiagramEditor;
