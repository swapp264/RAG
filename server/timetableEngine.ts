import { STRUCTURED_TIMETABLES } from './seedData.ts';
import { TimetableSchedule, TimetableSlot } from './types.ts';

const DAYS_OF_WEEK: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function resolveTimetableQuery(params: {
  query: string;
  department?: string;
  semester?: string;
  referenceDate?: Date;
}): {
  matched: boolean;
  day?: string;
  slots: TimetableSlot[];
  summary: string;
  schedule?: TimetableSchedule;
} {
  const queryLower = params.query.toLowerCase();
  const refDate = params.referenceDate || new Date('2026-09-30T10:00:00'); // Default to Fall 2026 Wednesday
  const currentDayIndex = refDate.getDay();
  const currentDayName = DAYS_OF_WEEK[currentDayIndex];

  // Check if query is about timetable
  const isTimetableQuery = 
    queryLower.includes('timetable') ||
    queryLower.includes('schedule') ||
    queryLower.includes('class') ||
    queryLower.includes('lecture') ||
    queryLower.includes('period') ||
    queryLower.includes('dbms') ||
    queryLower.includes('operating systems') ||
    queryLower.includes('free period') ||
    queryLower.includes('after lunch') ||
    queryLower.includes('tomorrow') ||
    queryLower.includes('monday') ||
    queryLower.includes('tuesday') ||
    queryLower.includes('wednesday') ||
    queryLower.includes('thursday') ||
    queryLower.includes('friday');

  if (!isTimetableQuery) {
    return { matched: false, slots: [], summary: '' };
  }

  // Find schedule
  const targetDept = params.department || 'Computer Engineering';
  const targetSem = params.semester || 'Semester 5';

  const schedule = STRUCTURED_TIMETABLES.find(
    (s) => (s.department === targetDept || targetDept === 'All') && (s.semester === targetSem || targetSem === 'All')
  ) || STRUCTURED_TIMETABLES[0];

  if (!schedule) {
    return { matched: false, slots: [], summary: '' };
  }

  // Determine target day
  let targetDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | null = null;

  if (queryLower.includes('monday')) targetDay = 'Monday';
  else if (queryLower.includes('tuesday')) targetDay = 'Tuesday';
  else if (queryLower.includes('wednesday')) targetDay = 'Wednesday';
  else if (queryLower.includes('thursday')) targetDay = 'Thursday';
  else if (queryLower.includes('friday')) targetDay = 'Friday';
  else if (queryLower.includes('tomorrow')) {
    const nextDayIndex = (currentDayIndex + 1) % 7;
    const nextDay = DAYS_OF_WEEK[nextDayIndex];
    if (nextDay === 'Saturday' || nextDay === 'Sunday') {
      targetDay = 'Monday'; // next working day
    } else {
      targetDay = nextDay as any;
    }
  } else if (queryLower.includes('today')) {
    if (currentDayName === 'Saturday' || currentDayName === 'Sunday') {
      targetDay = 'Monday';
    } else {
      targetDay = currentDayName as any;
    }
  }

  // If no day specified, check specific subject questions like "which professor teaches DBMS"
  if (!targetDay) {
    // Subject specific lookup
    if (queryLower.includes('dbms')) {
      const dbmsSlots = schedule.slots.filter((s) => s.subjectCode.startsWith('CS501'));
      return {
        matched: true,
        slots: dbmsSlots,
        summary: `DBMS (CS501) is taught by Dr. Arvind K. Sharma (Head of Department) with lab sessions co-instructed by Prof. Meera Nair. Lectures are held in Room 302 on Monday (09:00 AM), Tuesday (11:15 AM), and Thursday (10:00 AM).`,
        schedule,
      };
    }
    if (queryLower.includes('os') || queryLower.includes('operating system')) {
      const osSlots = schedule.slots.filter((s) => s.subjectCode.startsWith('CS502'));
      return {
        matched: true,
        slots: osSlots,
        summary: `Operating Systems (CS502) is taught by Prof. Rajesh Verma in Room 302 (Mon 10:00 AM, Wed 09:00 AM, Thu 11:15 AM) and Lab 2 on Tuesday afternoon.`,
        schedule,
      };
    }
    if (queryLower.includes('cn') || queryLower.includes('computer network')) {
      const cnSlots = schedule.slots.filter((s) => s.subjectCode.startsWith('CS503'));
      return {
        matched: true,
        slots: cnSlots,
        summary: `Computer Networks (CS503) is taught by Prof. Sneha Kulkarni in Room 302 (Mon 11:15 AM, Tue 10:00 AM, Fri 09:00 AM) and Lab 3 on Wednesday afternoon.`,
        schedule,
      };
    }
    if (queryLower.includes('ai') || queryLower.includes('machine learning')) {
      const aiSlots = schedule.slots.filter((s) => s.subjectCode.startsWith('CS505'));
      return {
        matched: true,
        slots: aiSlots,
        summary: `Artificial Intelligence & Machine Learning (CS505) is taught by Dr. Priyanka Sen in Room 302 (Wed 10:00 AM, Thu 09:00 AM, Fri 11:15 AM) and Lab 6 on Thursday afternoon.`,
        schedule,
      };
    }

    // Default to current working day
    targetDay = (currentDayName === 'Saturday' || currentDayName === 'Sunday') ? 'Monday' : (currentDayName as any);
  }

  const activeDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' = targetDay || 'Monday';

  // Filter slots for activeDay
  let daySlots = schedule.slots.filter((s) => s.day === activeDay);

  // Sub-filters: "after lunch", "first lecture", "free period"
  if (queryLower.includes('after lunch')) {
    daySlots = daySlots.filter((s) => s.startTime.includes('01:') || s.startTime.includes('03:'));
  } else if (queryLower.includes('first lecture') || queryLower.includes('first class')) {
    daySlots = daySlots.slice(0, 1);
  } else if (queryLower.includes('free period') || queryLower.includes('free time')) {
    const freeSlots = daySlots.filter((s) => s.type === 'Break' || s.subjectCode === 'FREE');
    return {
      matched: true,
      day: activeDay,
      slots: freeSlots,
      summary: `On ${activeDay}, free/break intervals are: Morning Tea Break (11:00 AM - 11:15 AM), Lunch Break (12:15 PM - 01:15 PM)${activeDay === 'Wednesday' ? ', and Library / Free Study Period (03:15 PM - 04:15 PM)' : ''}.`,
      schedule,
    };
  }

  return {
    matched: true,
    day: activeDay,
    slots: daySlots,
    summary: `Schedule for ${activeDay} (${schedule.department}, ${schedule.semester}): ${daySlots.length} sessions scheduled.`,
    schedule,
  };
}
