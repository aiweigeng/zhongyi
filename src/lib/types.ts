export type TcmCategory = "herbs" | "meridians" | "formulas" | "diagnosis" | "classics";

export type KnowledgeCard = {
  id: string;
  type: TcmCategory;
  title: string;
  cn: string;
  pinyin?: string;
  summary: string;
  tags: string[];
  nature?: string;
  flavor?: string;
  meridians?: string[];
  role?: string;
  visual: string;
};

export type LearningModule = {
  id: TcmCategory;
  title: string;
  cn: string;
  subtitle: string;
  summary: string;
  sampleItems: string[];
  tags: string[];
};

export type ConceptRelation = {
  from: string;
  to: string;
  label: string;
};

export type TcmLearningData = {
  sources: Array<{
    label: string;
    url: string;
    note: string;
  }>;
  modules: LearningModule[];
  cards: KnowledgeCard[];
  relationships: ConceptRelation[];
};
