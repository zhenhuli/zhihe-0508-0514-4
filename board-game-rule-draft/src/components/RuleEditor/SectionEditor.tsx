import React from 'react';
import styled from 'styled-components';
import { RuleSection } from '../../types';

const EditorContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.input`
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 0;
  margin-bottom: 16px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #667eea;
  }
`;

const SectionContent = styled.textarea`
  width: 100%;
  min-height: 150px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #667eea;
  }
`;

interface SectionEditorProps {
  section: RuleSection;
  onUpdate: (id: string, field: 'title' | 'content', value: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  return (
    <EditorContainer>
      <SectionTitle
        type="text"
        value={section.title}
        onChange={(e) => onUpdate(section.id, 'title', e.target.value)}
        placeholder="输入小节标题..."
      />
      <SectionContent
        value={section.content}
        onChange={(e) => onUpdate(section.id, 'content', e.target.value)}
        placeholder="在这里编写规则内容..."
      />
    </EditorContainer>
  );
};

export default SectionEditor;
