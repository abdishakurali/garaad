export interface StudentFeedbackMine {
  id: number;
  lesson: string;
  rating: number;
  difficulty: string;
  what_helped: string;
  what_confused: string;
  want_more_of: string;
  is_public: boolean;
  submitted_at: string;
}

export interface PublicStudentFeedback {
  first_name: string;
  lesson: string;
  rating: number;
  what_helped: string;
  submitted_at: string;
}
