export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface Homework {
  id: string;
  subject: string;
  task: string;
  dueDate: string;
  completed: boolean;
}

export interface ScheduleItem {
  id: string;
  day: 'Понеділок' | 'Вівторок' | 'Середа' | 'Четвер' | 'П’ятниця';
  lessonNumber: number;
  subject: string;
  room: string;
  time: string;
}