    export type RAGSettings = {
  model: string;

  temperature: number;
  maxTokens: number;

  topK: number;

  showSources: boolean;
};

export const DEFAULT_SETTINGS: RAGSettings = {
  model: "phi3",

  temperature: 0.1,
  maxTokens: 400,

  topK: 25,

  showSources: true,
};