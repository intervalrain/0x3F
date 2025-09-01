export interface Problem {
  id: string;
  topicId: number;
  chapterId?: string;
  subsectionId?: string;
  number: string;
  title: string;
  url: string;
  difficulty?: number;
  completed: boolean;
  completedAt?: string;
}

export interface Subsection {
  id: string;
  title: string;
  problems: Problem[];
}

export interface Chapter {
  id: string;
  title: string;
  subsections: Subsection[];
}

export interface TopicProgress {
  topicId: number;
  chapters: Chapter[];
  problems: Problem[]; // For backward compatibility
}