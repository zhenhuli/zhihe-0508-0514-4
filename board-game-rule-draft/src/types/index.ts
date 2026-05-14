export interface RuleSection {
  id: string;
  title: string;
  content: string;
}

export interface FlowDiagram {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Chapter {
  id: string;
  title: string;
  sections: RuleSection[];
  diagrams: FlowDiagram[];
}
