export interface Topic {
  id: string;
  name: string;
  confidence: number;
  timeSpent: number;
  priority: 'high' | 'medium' | 'low';
}

export interface StudyPlan {
  topics: Topic[];
  recommendations: string[];
  totalHours: number;
}