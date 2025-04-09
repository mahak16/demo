export interface Topic {
  id: string;
  name: string;
  confidence: number;
  timeSpent: number;
  priority: 'low' | 'medium' | 'high';
}

export interface StudyPlan {
  topics: Topic[];
  recommendations: string[];
  totalHours: number;
}
