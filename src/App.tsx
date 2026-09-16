import React, { useState, useEffect } from 'react';

// === ТИПИ ===
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

export type WeekType = 'all' | 'A' | 'B';

export interface ScheduleItem {
  id: string;
  day: 'Понеділок' | 'Вівторок' | 'Середа' | 'Четвер' | 'П’ятниця';
  lessonNumber: number;
  subject: string;
  room: string;
  time: string;
  weekType: WeekType; // 'all' - щотижня, 'A' - зелений, 'B' - червоний
}

// === РОЗКЛАД ДЗВІНКІВ ===
const DEFAULT_BELLS: Record<number, string> = {
  1: '08:30 - 09:15',
  2: '09:25 - 10:10',
  3: '10:30 - 11:15',
  4: '11:45 - 12:30',
  5: '12:40 - 13:25',
  6: '13:35 - 14:20',
  7: '14:30 - 15:15',
};

// === SVG ІКОНКИ ===
const Icons = {
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  CheckList: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

// === API СЕРВІС ===
const API_URL = 'https://69ad3080b50a169ec87ed7a6.mockapi.io/usersnvk';

const registerUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Помилка реєстрації');
  return response.json();
};

const loginUser = async (email: string, pass: string): Promise<User> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Помилка завантаження даних користувачів');
  const users: User[] = await response.json();
  const user = users.find(
    (u: User) => u.email.toLowerCase() === email.toLowerCase() && String(u.password) === String(pass)
  );
  if (!user) throw new Error('Невірний email або пароль');
  return user;
};

// === ГОЛОВНИЙ КОМПОНЕНТ ===
const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme_mode');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme_mode', nextTheme);
  };

  const isDark = theme === 'dark';
  const currentStyles = getThemeStyles(isDark);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_school_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Local Storage Key per Email
  const userKey = currentUser ? currentUser.email.toLowerCase() : 'guest';
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  useEffect(() => {
    if (currentUser) {
      const savedSchedule = localStorage.getItem(`schedule_${userKey}`);
      const savedHomeworks = localStorage.getItem(`homeworks_${userKey}`);
      setSchedule(savedSchedule ? JSON.parse(savedSchedule) : []);
      setHomeworks(savedHomeworks ? JSON.parse(savedHomeworks) : []);
    }
  }, [userKey, currentUser]);

  const updateSchedule = (newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
    if (currentUser) {
      localStorage.setItem(`schedule_${userKey}`, JSON.stringify(newSchedule));
    }
  };

  const updateHomeworks = (newHomeworks: Homework[]) => {
    setHomeworks(newHomeworks);
    if (currentUser) {
      localStorage.setItem(`homeworks_${userKey}`, JSON.stringify(newHomeworks));
    }
  };

  // Навігація
  const [activeDay, setActiveDay] = useState<ScheduleItem['day']>('Понеділок');
  const [activeTab, setActiveTab] = useState<'schedule' | 'homework'>('schedule');

  // Поля уроку
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonNumber, setLessonNumber] = useState(1);
  const [lessonSubject, setLessonSubject] = useState('');
  const [lessonRoom, setLessonRoom] = useState('');
  const [lessonTime, setLessonTime] = useState(DEFAULT_BELLS[1]);
  const [lessonWeekType, setLessonWeekType] = useState<WeekType>('all');

  // Поля ДЗ
  const [hwSubject, setHwSubject] = useState('');
  const [hwTask, setHwTask] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');

  const handleLessonNumberChange = (num: number) => {
    setLessonNumber(num);
    if (DEFAULT_BELLS[num]) {
      setLessonTime(DEFAULT_BELLS[num]);
    }
  };

  // Auth
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      let user: User;
      if (isRegister) {
        user = await registerUser({ name, email, password, phone });
      } else {
        user = await loginUser(email, password);
      }
      setCurrentUser(user);
      localStorage.setItem('current_school_user', JSON.stringify(user));
    } catch (err: any) {
      setErrorMsg(err.message || 'Сталася помилка');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('current_school_user');
    setSchedule([]);
    setHomeworks([]);
  };

  // Збереження уроку
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonSubject) return;

    if (editingLessonId) {
      const updated = schedule.map((item: ScheduleItem) =>
        item.id === editingLessonId
          ? {
              ...item,
              day: activeDay,
              lessonNumber,
              subject: lessonSubject,
              room: lessonRoom,
              time: lessonTime,
              weekType: lessonWeekType,
            }
          : item
      );
      updateSchedule(updated);
      cancelEditing();
    } else {
      const newItem: ScheduleItem = {
        id: Date.now().toString(),
        day: activeDay,
        lessonNumber,
        subject: lessonSubject,
        room: lessonRoom,
        time: lessonTime,
        weekType: lessonWeekType,
      };

      updateSchedule([...schedule, newItem]);
      resetLessonForm(lessonNumber + 1);
    }
  };

  const startEditLesson = (item: ScheduleItem) => {
    setEditingLessonId(item.id);
    setLessonNumber(item.lessonNumber);
    setLessonSubject(item.subject);
    setLessonRoom(item.room);
    setLessonTime(item.time || DEFAULT_BELLS[item.lessonNumber] || '');
    setLessonWeekType(item.weekType || 'all');
  };

  const cancelEditing = () => {
    setEditingLessonId(null);
    resetLessonForm(lessonNumber);
  };

  const resetLessonForm = (nextNum: number) => {
    setLessonSubject('');
    setLessonRoom('');
    setLessonNumber(nextNum);
    setLessonTime(DEFAULT_BELLS[nextNum] || '');
    setLessonWeekType('all');
  };

  const deleteScheduleItem = (id: string) => {
    if (editingLessonId === id) cancelEditing();
    updateSchedule(schedule.filter((item: ScheduleItem) => item.id !== id));
  };

  // ДЗ
  const addHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwSubject || !hwTask) return;

    const newHw: Homework = {
      id: Date.now().toString(),
      subject: hwSubject,
      task: hwTask,
      dueDate: hwDueDate,
      completed: false,
    };

    updateHomeworks([...homeworks, newHw]);
    setHwSubject('');
    setHwTask('');
    setHwDueDate('');
  };

  const toggleHomework = (id: string) => {
    updateHomeworks(
      homeworks.map((hw: Homework) => (hw.id === id ? { ...hw, completed: !hw.completed } : hw))
    );
  };

  const deleteHomework = (id: string) => {
    updateHomeworks(homeworks.filter((hw: Homework) => hw.id !== id));
  };

  if (!currentUser) {
    return (
      <div style={currentStyles.authContainer}>
        <div style={currentStyles.authCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={currentStyles.brandLogo}>STUDY HUB</div>
            <button onClick={toggleTheme} style={currentStyles.btnThemeToggle} title="Змінити тему">
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          <h2 style={currentStyles.authTitle}>{isRegister ? 'Створити акаунт' : 'Увійти в щоденник'}</h2>
          {errorMsg && <div style={currentStyles.error}>{errorMsg}</div>}

          <form onSubmit={handleAuth} style={currentStyles.form}>
            {isRegister && (
              <>
                <input
                  type="text"
                  placeholder="Ім’я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={currentStyles.input}
                />
                <input
                  type="text"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={currentStyles.input}
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={currentStyles.input}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={currentStyles.input}
            />
            <button type="submit" style={currentStyles.btnPrimary}>
              {isRegister ? 'Зареєструватися' : 'Увійти'}
            </button>
          </form>

          <p onClick={() => setIsRegister(!isRegister)} style={currentStyles.toggleText}>
            {isRegister ? 'Вже маєте акаунт? Увійти' : 'Немає акаунту? Створити'}
          </p>
        </div>
      </div>
    );
  }

  const days: ScheduleItem['day'][] = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця'];
  
  // Групуємо уроки за номером уроку для гарного відображення варіантів А / В
  const daySchedule = schedule.filter((s: ScheduleItem) => s.day === activeDay);
  const lessonNumbers = Array.from(new Set(daySchedule.map((s) => s.lessonNumber))).sort((a, b) => a - b);

  return (
    <div style={currentStyles.appContainer}>
      <header style={currentStyles.header}>
        <div style={currentStyles.headerInfo}>
          <span style={currentStyles.headerBadge}>STUDY HUB</span>
          <h1 style={currentStyles.headerTitle}>{currentUser.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
          <button onClick={toggleTheme} style={currentStyles.btnThemeToggle} title="Переключити тему">
            {isDark ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button onClick={handleLogout} style={currentStyles.btnLogout} title="Вийти з акаунту">
            <Icons.LogOut />
            <span>Вийти</span>
          </button>
        </div>
      </header>

      <nav style={currentStyles.tabNav}>
        <button
          onClick={() => setActiveTab('schedule')}
          style={activeTab === 'schedule' ? currentStyles.activeTab : currentStyles.tab}
        >
          <Icons.Calendar />
          <span>Розклад</span>
        </button>
        <button
          onClick={() => setActiveTab('homework')}
          style={activeTab === 'homework' ? currentStyles.activeTab : currentStyles.tab}
        >
          <Icons.CheckList />
          <span>Завдання</span>
        </button>
      </nav>

      <main style={currentStyles.content}>
        {activeTab === 'schedule' ? (
          <div>
            {/* Дні тижня */}
            <div style={currentStyles.daySelector}>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setActiveDay(day);
                    if (editingLessonId) cancelEditing();
                  }}
                  style={activeDay === day ? currentStyles.activeDayBtn : currentStyles.dayBtn}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Форма додавання / редагування уроку */}
            <form onSubmit={handleScheduleSubmit} style={currentStyles.cardForm}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={currentStyles.formTitle}>
                  {editingLessonId ? 'Редагувати урок' : `Новий урок (${activeDay})`}
                </h4>
                {editingLessonId && (
                  <button type="button" onClick={cancelEditing} style={currentStyles.btnCancel}>
                    <Icons.Close /> Скасувати
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="№"
                  value={lessonNumber}
                  onChange={(e) => handleLessonNumberChange(Number(e.target.value))}
                  style={{ ...currentStyles.input, width: '60px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Назва предмета"
                  value={lessonSubject}
                  onChange={(e) => setLessonSubject(e.target.value)}
                  style={currentStyles.input}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Кабінет (напр. 204)"
                  value={lessonRoom}
                  onChange={(e) => setLessonRoom(e.target.value)}
                  style={{ ...currentStyles.input, flex: 1 }}
                />
                <input
                  type="text"
                  placeholder="Час (08:30 - 09:15)"
                  value={lessonTime}
                  onChange={(e) => setLessonTime(e.target.value)}
                  style={{ ...currentStyles.input, flex: 1.3 }}
                />
              </div>

              {/* Вибір Зеленого / Червоного тижня */}
              <div style={{ marginBottom: '12px' }}>
                <label style={currentStyles.labelLabel}>Тиждень чисельника/знаменника:</label>
                <div style={currentStyles.weekTypeSelector}>
                  <button
                    type="button"
                    onClick={() => setLessonWeekType('all')}
                    style={lessonWeekType === 'all' ? currentStyles.weekBtnActiveAll : currentStyles.weekBtn}
                  >
                    Щотижня
                  </button>
                  <button
                    type="button"
                    onClick={() => setLessonWeekType('A')}
                    style={lessonWeekType === 'A' ? currentStyles.weekBtnActiveA : currentStyles.weekBtn}
                  >
                    А (Зелений)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLessonWeekType('B')}
                    style={lessonWeekType === 'B' ? currentStyles.weekBtnActiveB : currentStyles.weekBtn}
                  >
                    В (Червоний)
                  </button>
                </div>
              </div>

              <button type="submit" style={editingLessonId ? currentStyles.btnSave : currentStyles.btnPrimary}>
                {editingLessonId ? (
                  'Зберегти зміни'
                ) : (
                  <>
                    <Icons.Plus /> Додати в розклад
                  </>
                )}
              </button>
            </form>

            {/* Список уроків */}
            <div style={currentStyles.list}>
              {lessonNumbers.length === 0 ? (
                <div style={currentStyles.emptyState}>Розклад на цей день порожній</div>
              ) : (
                lessonNumbers.map((num) => {
                  const itemsForNum = daySchedule.filter((item) => item.lessonNumber === num);
                  const firstItem = itemsForNum[0];

                  return (
                    <div key={num} style={currentStyles.cardItem}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                        <div style={currentStyles.lessonNumBadge}>{num}</div>
                        
                        <div style={{ flex: 1 }}>
                          {/* Рендеримо всі уроки на цей час (якщо їх 2 — А і В) */}
                          {itemsForNum.map((item) => (
                            <div key={item.id} style={currentStyles.lessonRow}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                {item.weekType === 'A' && (
                                  <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '15px' }}>A:</span>
                                )}
                                {item.weekType === 'B' && (
                                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '15px' }}>B:</span>
                                )}
                                <span style={currentStyles.subjectTitle}>{item.subject}</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {item.room && <span style={currentStyles.roomBadge}>{item.room}</span>}
                                <button
                                  onClick={() => startEditLesson(item)}
                                  style={currentStyles.btnAction}
                                  title="Редагувати"
                                >
                                  <Icons.Edit />
                                </button>
                                <button
                                  onClick={() => deleteScheduleItem(item.id)}
                                  style={{ ...currentStyles.btnAction, color: '#f43f5e' }}
                                  title="Видалити"
                                >
                                  <Icons.Trash />
                                </button>
                              </div>
                            </div>
                          ))}

                          {firstItem.time && (
                            <div style={currentStyles.metaInfo}>{firstItem.time}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Форма ДЗ */}
            <form onSubmit={addHomework} style={currentStyles.cardForm}>
              <h4 style={currentStyles.formTitle}>Додати домашнє завдання</h4>
              <input
                type="text"
                placeholder="Предмет"
                value={hwSubject}
                onChange={(e) => setHwSubject(e.target.value)}
                style={{ ...currentStyles.input, marginBottom: '8px' }}
                required
              />
              <textarea
                placeholder="Що саме задано?"
                value={hwTask}
                onChange={(e) => setHwTask(e.target.value)}
                style={{ ...currentStyles.input, height: '70px', marginBottom: '8px', resize: 'vertical' }}
                required
              />
              <input
                type="date"
                value={hwDueDate}
                onChange={(e) => setHwDueDate(e.target.value)}
                style={{ ...currentStyles.input, marginBottom: '12px' }}
              />
              <button type="submit" style={currentStyles.btnPrimary}>
                <Icons.Plus /> Зберегти завдання
              </button>
            </form>

            {/* Список ДЗ */}
            <div style={currentStyles.list}>
              {homeworks.length === 0 ? (
                <div style={currentStyles.emptyState}>Усі завдання виконано!</div>
              ) : (
                homeworks.map((hw: Homework) => (
                  <div key={hw.id} style={{ ...currentStyles.cardItem, opacity: hw.completed ? 0.5 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={hw.completed}
                        onChange={() => toggleHomework(hw.id)}
                        style={currentStyles.checkbox}
                      />
                      <div>
                        <div
                          style={{
                            ...currentStyles.subjectTitle,
                            textDecoration: hw.completed ? 'line-through' : 'none',
                          }}
                        >
                          {hw.subject}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: isDark ? '#cbd5e1' : '#475569',
                            marginTop: '2px',
                            textDecoration: hw.completed ? 'line-through' : 'none',
                          }}
                        >
                          {hw.task}
                        </div>
                        {hw.dueDate && <div style={currentStyles.dateBadge}>До: {hw.dueDate}</div>}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHomework(hw.id)}
                      style={{ ...currentStyles.btnAction, color: '#f43f5e' }}
                      title="Видалити"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// === ДИНАМІЧНІ СТИЛІ ===
function getThemeStyles(isDark: boolean): { [key: string]: React.CSSProperties } {
  return {
    appContainer: {
      maxWidth: '440px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: isDark ? '#0f172a' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#0f172a',
      minHeight: '100vh',
      paddingBottom: '24px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: isDark ? '#1e293b' : '#ffffff',
      padding: '16px 20px',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    headerInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    headerBadge: {
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '1px',
      color: isDark ? '#818cf8' : '#4f46e5',
      textTransform: 'uppercase',
    },
    headerTitle: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 600,
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    btnThemeToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark ? '#334155' : '#f1f5f9',
      color: isDark ? '#f8fafc' : '#0f172a',
      border: 'none',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    btnLogout: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: isDark ? '#334155' : '#f1f5f9',
      color: isDark ? '#94a3b8' : '#475569',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      cursor: 'pointer',
    },
    tabNav: {
      display: 'flex',
      background: isDark ? '#1e293b' : '#ffffff',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    tab: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      padding: '14px',
      border: 'none',
      background: 'none',
      color: isDark ? '#64748b' : '#94a3b8',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
    },
    activeTab: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      padding: '14px',
      border: 'none',
      background: 'none',
      color: isDark ? '#818cf8' : '#4f46e5',
      borderBottom: isDark ? '2px solid #6366f1' : '2px solid #4f46e5',
      fontWeight: 600,
      fontSize: '14px',
    },
    content: {
      padding: '16px',
    },
    daySelector: {
      display: 'flex',
      gap: '6px',
      marginBottom: '16px',
    },
    dayBtn: {
      flex: 1,
      padding: '10px 0',
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
      borderRadius: '8px',
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#94a3b8' : '#64748b',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 500,
    },
    activeDayBtn: {
      flex: 1,
      padding: '10px 0',
      border: isDark ? '1px solid #6366f1' : '1px solid #4f46e5',
      borderRadius: '8px',
      background: isDark ? '#6366f1' : '#4f46e5',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 600,
    },
    cardForm: {
      background: isDark ? '#1e293b' : '#ffffff',
      padding: '16px',
      borderRadius: '12px',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      marginBottom: '16px',
    },
    formTitle: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 600,
      color: isDark ? '#cbd5e1' : '#334155',
    },
    labelLabel: {
      fontSize: '12px',
      color: isDark ? '#94a3b8' : '#64748b',
      display: 'block',
      marginBottom: '6px',
    },
    weekTypeSelector: {
      display: 'flex',
      gap: '6px',
    },
    weekBtn: {
      flex: 1,
      padding: '8px 0',
      borderRadius: '6px',
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
      background: isDark ? '#0f172a' : '#f8fafc',
      color: isDark ? '#94a3b8' : '#64748b',
      fontSize: '12px',
      cursor: 'pointer',
    },
    weekBtnActiveAll: {
      flex: 1,
      padding: '8px 0',
      borderRadius: '6px',
      border: '1px solid #6366f1',
      background: '#6366f1',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    weekBtnActiveA: {
      flex: 1,
      padding: '8px 0',
      borderRadius: '6px',
      border: '1px solid #22c55e',
      background: '#22c55e',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    weekBtnActiveB: {
      flex: 1,
      padding: '8px 0',
      borderRadius: '6px',
      border: '1px solid #ef4444',
      background: '#ef4444',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
      background: isDark ? '#0f172a' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontSize: '16px', // 16px щоб iPhone не зумив
      boxSizing: 'border-box',
      outline: 'none',
    },
    btnPrimary: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      padding: '11px',
      background: isDark ? '#6366f1' : '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '14px',
    },
    btnSave: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      padding: '11px',
      background: '#10b981',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '14px',
    },
    btnCancel: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: 'none',
      border: 'none',
      color: isDark ? '#94a3b8' : '#64748b',
      fontSize: '12px',
      cursor: 'pointer',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    cardItem: {
      background: isDark ? '#1e293b' : '#ffffff',
      padding: '12px 14px',
      borderRadius: '10px',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    lessonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '4px',
    },
    lessonNumBadge: {
      width: '28px',
      height: '28px',
      borderRadius: '6px',
      background: isDark ? '#334155' : '#e0e7ff',
      color: isDark ? '#818cf8' : '#4f46e5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 700,
      fontSize: '13px',
      marginTop: '2px',
    },
    subjectTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    roomBadge: {
      fontSize: '12px',
      color: isDark ? '#94a3b8' : '#64748b',
      background: isDark ? '#0f172a' : '#f1f5f9',
      padding: '2px 6px',
      borderRadius: '4px',
    },
    metaInfo: {
      fontSize: '12px',
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: '4px',
    },
    btnAction: {
      background: 'none',
      border: 'none',
      color: isDark ? '#94a3b8' : '#64748b',
      padding: '4px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      accentColor: isDark ? '#6366f1' : '#4f46e5',
      cursor: 'pointer',
      marginTop: '3px',
    },
    dateBadge: {
      fontSize: '11px',
      color: '#f43f5e',
      marginTop: '4px',
      fontWeight: 500,
    },
    emptyState: {
      textAlign: 'center',
      color: isDark ? '#64748b' : '#94a3b8',
      padding: '32px 0',
      fontSize: '14px',
    },
    authContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: isDark ? '#0f172a' : '#f1f5f9',
      padding: '16px',
    },
    authCard: {
      width: '100%',
      maxWidth: '360px',
      background: isDark ? '#1e293b' : '#ffffff',
      padding: '28px',
      borderRadius: '16px',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    brandLogo: {
      fontSize: '12px',
      fontWeight: 800,
      color: isDark ? '#6366f1' : '#4f46e5',
      letterSpacing: '2px',
    },
    authTitle: {
      textAlign: 'center',
      marginTop: 0,
      marginBottom: '20px',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontSize: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    toggleText: {
      marginTop: '20px',
      color: isDark ? '#818cf8' : '#4f46e5',
      textAlign: 'center',
      cursor: 'pointer',
      fontSize: '13px',
    },
    error: {
      color: '#f43f5e',
      fontSize: '13px',
      background: isDark ? '#881337' : '#ffe4e6',
      padding: '8px 12px',
      borderRadius: '6px',
      marginBottom: '12px',
      textAlign: 'center',
    },
  };
}

export default App;