import { DocumentMetadata, TimetableSchedule } from './types.ts';

export interface SeedDocument {
  metadata: Omit<DocumentMetadata, 'chunkCount'>;
  content: string;
}

export const SEED_DOCUMENTS: SeedDocument[] = [
  {
    metadata: {
      id: 'doc-acad-cal-2026',
      title: 'Academic Calendar 2026–2027',
      category: 'Academic Calendar',
      department: 'All',
      semester: 'All',
      academicYear: '2026-2027',
      version: 'v2.1',
      effectiveDate: '2026-07-15',
      isOutdated: false,
      fileType: 'pdf',
      fileSize: 428000,
      uploadedAt: '2026-07-20T10:00:00Z',
      tags: ['academic', 'calendar', 'exams', 'holidays', 'semester dates'],
    },
    content: `# APEX INSTITUTE OF TECHNOLOGY & SCIENCE
## OFFICIAL ACADEMIC CALENDAR 2026–2027

### 1. Fall Semester 2026 Schedule
- **Commencement of Fall Semester Classes**: 10 August 2026
- **Last Date for Course Registration & Add/Drop**: 21 August 2026
- **Mid-Term Examination (Internal Assessment 1)**: 15 October 2026 to 22 October 2026
- **Diwali & Mid-Semester Recess**: 01 November 2026 to 08 November 2026
- **Classes Resume after Recess**: 09 November 2026
- **Practical & Laboratory Examinations**: 25 November 2026 to 02 December 2026
- **Last Teaching Day of Fall Semester**: 04 December 2026
- **End-Semester Theory Examinations**: 08 December 2026 to 23 December 2026
- **Semester Winter Break**: 24 December 2026 to 10 January 2027

### 2. Spring Semester 2027 Schedule
- **Commencement of Spring Semester Classes**: 11 January 2027
- **Annual TechFest (HackCampus & Aakriti 2027)**: 18 February 2027 to 20 February 2027
- **Mid-Term Examination (Spring)**: 08 March 2027 to 15 March 2027
- **End-Semester Examinations (Spring)**: 10 May 2027 to 25 May 2027
- **Summer Vacation & Internships**: 01 June 2027 to 31 July 2027

### 3. Official College Holidays (Fall 2026)
- **Independence Day**: 15 August 2026
- **Ganesh Chaturthi**: 14 September 2026
- **Gandhi Jayanti**: 02 October 2026
- **Dussehra (Vijayadashami)**: 20 October 2026
- **Diwali Break**: 01 November to 08 November 2026
- **Guru Nanak Jayanti**: 24 November 2026
- **Christmas Day**: 25 December 2026`,
  },
  {
    metadata: {
      id: 'doc-cs-timetable-sem5-2026',
      title: 'Computer Engineering Semester 5 Timetable & Faculty List (Fall 2026)',
      category: 'Timetable',
      department: 'Computer Engineering',
      semester: 'Semester 5',
      academicYear: '2026-2027',
      version: 'v1.4',
      effectiveDate: '2026-08-05',
      isOutdated: false,
      fileType: 'pdf',
      fileSize: 312000,
      uploadedAt: '2026-08-06T09:30:00Z',
      tags: ['timetable', 'computer engineering', 'sem 5', 'schedule', 'faculty', 'rooms'],
    },
    content: `# DEPARTMENT OF COMPUTER ENGINEERING
## WEEKLY TIMETABLE & FACULTY ALLOCATION — SEMESTER 5 (FALL 2026)
**Division**: 5-A & 5-B | **Classroom**: Room 302 (3rd Floor, Engineering Block)
**Class In-Charge**: Prof. Sneha Kulkarni | **Head of Department (HOD)**: Dr. Arvind K. Sharma

### 1. Weekly Class Schedule
| Day | Time Slot | Subject | Code | Room / Lab | Faculty / Instructor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Monday** | 09:00 AM – 10:00 AM | Database Management Systems (DBMS) | CS501 | Room 302 | Prof. Dr. Arvind K. Sharma |
| **Monday** | 10:00 AM – 11:00 AM | Operating Systems (OS) | CS502 | Room 302 | Prof. Rajesh Verma |
| **Monday** | 11:00 AM – 11:15 AM | *Morning Tea & Refreshment Break* | — | Campus Plaza | — |
| **Monday** | 11:15 AM – 12:15 PM | Computer Networks (CN) | CS503 | Room 302 | Prof. Sneha Kulkarni |
| **Monday** | 12:15 PM – 01:15 PM | *Lunch Break* | — | Cafeteria | — |
| **Monday** | 01:15 PM – 03:15 PM | DBMS Practical Lab (Batch B1: Lab 4 / Batch B2: Lab 5) | CS501L | Lab 4 / Lab 5 | Prof. Dr. Arvind K. Sharma & Prof. Meera Nair |
| **Monday** | 03:15 PM – 04:15 PM | Professional Ethics & Cyber Law | CS506 | Room 302 | Prof. Anjali Rao |
| **Tuesday** | 09:00 AM – 10:00 AM | Theory of Computation (TOC) | CS504 | Room 302 | Prof. Amit Deshmukh |
| **Tuesday** | 10:00 AM – 11:00 AM | Computer Networks (CN) | CS503 | Room 302 | Prof. Sneha Kulkarni |
| **Tuesday** | 11:15 AM – 12:15 PM | Database Management Systems (DBMS) | CS501 | Room 302 | Prof. Dr. Arvind K. Sharma |
| **Tuesday** | 01:15 PM – 03:15 PM | Operating Systems Lab (Lab 2) | CS502L | Lab 2 | Prof. Rajesh Verma |
| **Tuesday** | 03:15 PM – 04:15 PM | *Tutorial & Doubt Clearing Session* | — | Room 302 | All Faculty |
| **Wednesday** | 09:00 AM – 10:00 AM | Operating Systems (OS) | CS502 | Room 302 | Prof. Rajesh Verma |
| **Wednesday** | 10:00 AM – 11:00 AM | Artificial Intelligence & Machine Learning | CS505 | Room 302 | Dr. Priyanka Sen |
| **Wednesday** | 11:15 AM – 12:15 PM | Theory of Computation (TOC) | CS504 | Room 302 | Prof. Amit Deshmukh |
| **Wednesday** | 01:15 PM – 03:15 PM | Computer Networks Lab (Lab 3) | CS503L | Lab 3 | Prof. Sneha Kulkarni |
| **Wednesday** | 03:15 PM – 04:15 PM | Library / Free Study Period | — | Central Library | Self Study |
| **Thursday** | 09:00 AM – 10:00 AM | Artificial Intelligence & Machine Learning | CS505 | Room 302 | Dr. Priyanka Sen |
| **Thursday** | 10:00 AM – 11:00 AM | Database Management Systems (DBMS) | CS501 | Room 302 | Prof. Dr. Arvind K. Sharma |
| **Thursday** | 11:15 AM – 12:15 PM | Operating Systems (OS) | CS502 | Room 302 | Prof. Rajesh Verma |
| **Thursday** | 01:15 PM – 03:15 PM | AI/ML Mini Project & Coding Lab | CS505L | Lab 6 | Dr. Priyanka Sen |
| **Thursday** | 03:15 PM – 04:15 PM | Technical Seminar & Presentation | CS507 | Seminar Hall 1 | Prof. Rajesh Verma |
| **Friday** | 09:00 AM – 10:00 AM | Computer Networks (CN) | CS503 | Room 302 | Prof. Sneha Kulkarni |
| **Friday** | 10:00 AM – 11:00 AM | Theory of Computation (TOC) | CS504 | Room 302 | Prof. Amit Deshmukh |
| **Friday** | 11:15 AM – 12:15 PM | Artificial Intelligence & Machine Learning | CS505 | Room 302 | Dr. Priyanka Sen |
| **Friday** | 01:15 PM – 03:15 PM | Open Source Project Development Lab | CS508 | Innovation Hub | Dr. Arvind Sharma |
| **Friday** | 03:15 PM – 04:30 PM | Sports, Clubs & Co-Curricular Activities | — | Sports Grounds | Activity Incharge |

### 2. Faculty Contact & Cabin Directory
- **Dr. Arvind K. Sharma** — Head of Department & Professor (DBMS). Cabin: Room 301, 3rd Floor. Email: hod.cse@college.edu. Office hours: 03:30 PM – 05:00 PM (Mon–Thu).
- **Prof. Sneha Kulkarni** — Class In-Charge & Associate Professor (Computer Networks). Cabin: Room 305-A. Email: sneha.kulkarni@college.edu.
- **Prof. Rajesh Verma** — Assistant Professor (Operating Systems). Cabin: Room 305-C. Email: rajesh.verma@college.edu.
- **Prof. Amit Deshmukh** — Assistant Professor (Theory of Computation). Cabin: Room 306. Email: amit.deshmukh@college.edu.
- **Dr. Priyanka Sen** — Associate Professor (AI & Machine Learning). Cabin: Room 308. Email: priyanka.sen@college.edu.`,
  },
  {
    metadata: {
      id: 'doc-exam-rules-2026',
      title: 'Examination Regulations & Attendance Policy Handbook 2026',
      category: 'Attendance & Rules',
      department: 'All',
      semester: 'All',
      academicYear: '2026-2027',
      version: 'v3.0',
      effectiveDate: '2026-07-01',
      isOutdated: false,
      fileType: 'pdf',
      fileSize: 512000,
      uploadedAt: '2026-07-10T11:00:00Z',
      tags: ['attendance', 'rules', 'exam eligibility', 'detention', 'hall ticket', 'passing criteria'],
    },
    content: `# APEX INSTITUTE OF TECHNOLOGY
## EXAMINATION CODE & ATTENDANCE REGULATIONS HANDBOOK (2026–2027)

### 1. Mandatory Attendance Requirements
- **Standard Threshold**: Every student is strictly required to maintain a minimum aggregate attendance of **75% in each registered theory course, laboratory, and tutorial** to be eligible to appear for the End-Semester Examination.
- **Medical Condonation Policy**:
  - Attendance between **65% and 74.9%** may be condoned by the Academic Dean ONLY on genuine medical grounds or sanctioned institutional representation (such as university sports or approved competitions).
  - Medical certificates must be issued by a registered medical practitioner and submitted to the Department Office within **3 working days** of returning to campus, along with a written application signed by parents.
- **Critical Detention Rule**: Any student with attendance below **65% will be summarily detained** without exception. Detained students will not be issued Hall Tickets and must re-register for the course in the summer semester or next academic year.

### 2. Evaluation Scheme & Weightage
- **Continuous Internal Assessment (CIA)**: 40% Total Weightage
  - Mid-Term Examination 1: 20 Marks (Conducted in October)
  - Quizzes, Assignments, and Mini Projects: 10 Marks
  - Class Participation and Laboratory Performance: 10 Marks
- **End-Semester Examination (ESE)**: 60% Total Weightage
  - Comprehensive 3-hour written examination covering all syllabus units.
- **Passing Criteria**:
  - Minimum 40% marks required in the End-Semester Examination separately (24 out of 60 marks).
  - Minimum 40% aggregate overall (CIA + ESE combined, 40 out of 100 marks).

### 3. Examination Hall Protocol
- Students must carry their valid **Physical College ID Card** and **Printed Hall Ticket**. Digital IDs on mobile phones are strictly not permitted.
- Entry into the exam hall is closed **15 minutes** after the commencement of the exam.
- Electronic gadgets, smart watches, programmable calculators, and Bluetooth devices are strictly prohibited and will result in booking under the Malpractice Code (Category 1 Disciplinary Action).`,
  },
  {
    metadata: {
      id: 'doc-scholarship-guidelines-2026',
      title: 'State & Institutional Scholarships & Financial Aid Guidelines 2026–2027',
      category: 'Scholarships',
      department: 'All',
      semester: 'All',
      academicYear: '2026-2027',
      version: 'v1.1',
      effectiveDate: '2026-08-01',
      isOutdated: false,
      fileType: 'pdf',
      fileSize: 280000,
      uploadedAt: '2026-08-02T14:20:00Z',
      tags: ['scholarships', 'financial aid', 'merit', 'fee waiver', 'eligibility', 'documents'],
    },
    content: `# APEX INSTITUTE OF TECHNOLOGY
## SCHOLARSHIP SCHEMES & FINANCIAL AID GUIDELINES (2026–2027)

### 1. Institutional Merit Scholarships
- **President's Gold Merit Scholarship**:
  - **Eligibility**: Students securing **CGPA 9.20 and above** in the preceding academic year with no backlogs.
  - **Benefit**: **100% Tuition Fee Waiver** for the current academic year.
- **Dean's Excellence Scholarship**:
  - **Eligibility**: Students securing **CGPA 8.50 to 9.19** with no disciplinary warnings.
  - **Benefit**: **50% Tuition Fee Waiver**.

### 2. Need-Based Economic Weaker Section (EWS) Financial Aid
- **Eligibility**: Gross annual family income of parents/guardians from all sources must be less than **INR 5,00,000 (5 Lakhs per annum)**.
- **Benefit**: 60% tuition fee grant and free access to semester textbooks from the Book Bank.

### 3. Required Application Documents
To apply, submit one set of self-attested physical documents to **Counter No. 4 (Scholarship Cell, Admin Block)**:
1. Duly filled Scholarship Application Form (Form SCH-01, downloadable from student portal).
2. Grade cards / marksheets of the previous two semesters.
3. Original Income Certificate for FY 2025–26 issued by a competent authority (Tahsildar / Sub-Divisional Magistrate).
4. Domicile Certificate or Proof of Residence.
5. Copy of National Identity Proof (Aadhaar Card / Passport).
6. First page copy of student's personal Bank Passbook displaying Account Number and IFSC Code.
7. College Bonafide Certificate issued by the Academic Registrar.

### 4. Important Deadlines
- **Application Portal Opening**: 15 August 2026
- **Last Date for Form Submission**: **30 October 2026 by 05:00 PM**
- **Verification & Scrutiny Period**: 01 November to 15 November 2026
- **Disbursement of Scholarship Funds**: Direct bank transfer by 15 December 2026
- **Contact Incharge**: Prof. M. Ramanathan, Dean of Student Welfare (Email: scholarships@college.edu | Phone: Ext. 404).`,
  },
  {
    metadata: {
      id: 'doc-fee-structure-2026',
      title: 'Tuition & Hostel Fee Structure and Payment Schedule 2026–2027',
      category: 'Fees',
      department: 'All',
      semester: 'All',
      academicYear: '2026-2027',
      version: 'v1.0',
      effectiveDate: '2026-06-25',
      isOutdated: false,
      fileType: 'pdf',
      fileSize: 345000,
      uploadedAt: '2026-07-01T08:00:00Z',
      tags: ['fees', 'tuition', 'hostel', 'payment deadline', 'late fee', 'installments'],
    },
    content: `# APEX INSTITUTE OF TECHNOLOGY
## TUITION & HOSTEL FEE CIRCULAR — ACADEMIC YEAR 2026–2027

### 1. Fee Breakdown per Semester
- **Tuition Fee (Engineering Undergraduate)**: INR 85,000 per semester
- **Development & Laboratory Fee**: INR 12,000 per semester
- **Library & Internet Subscription**: INR 3,000 per semester
- **Examination Fee**: INR 2,500 per semester
- **Total Academic Fee**: **INR 1,02,500 per semester**

### 2. Hostel & Mess Charges (Optional Residential)
- **Double Occupancy AC Room**: INR 45,000 per semester
- **Triple Occupancy Non-AC Room**: INR 32,000 per semester
- **Mess Charges (4 meals daily, veg & non-veg options)**: INR 22,000 per semester
- **Hostel Caution Deposit (Refundable)**: INR 5,000 (one-time on admission)

### 3. Payment Deadlines & Late Penalties
- **Fall Semester Due Date**: **25 August 2026**
- **Grace Period (No Fine)**: Up to 31 August 2026
- **Late Fee Slab 1**: 01 September to 10 September 2026 — Fine of INR 100 per day.
- **Late Fee Slab 2**: 11 September to 20 September 2026 — Fixed fine of INR 2,500.
- **After 20 September 2026**: Student portal access is suspended and attendance tracking is frozen until full clearance.

### 4. Installment Facility
Students facing genuine financial constraints may request payment in **two equal installments (50% + 50%)**. The application must be countersigned by parents and submitted to the Finance Officer (Accounts Block, Ground Floor) before 15 August 2026.`,
  },
  {
    metadata: {
      id: 'doc-placement-manual-2026',
      title: 'Training & Placement Cell (T&P) Campus Recruitment Manual 2026–2027',
      category: 'Placements',
      department: 'All',
      semester: 'Semester 7',
      academicYear: '2026-2027',
      version: 'v2.0',
      effectiveDate: '2026-08-01',
      isOutdated: false,
      fileType: 'pdf',
      fileSize: 490000,
      uploadedAt: '2026-08-05T16:00:00Z',
      tags: ['placement', 'campus drives', 'jobs', 'internships', 'eligibility', 'tpo'],
    },
    content: `# APEX INSTITUTE OF TECHNOLOGY
## TRAINING & PLACEMENT CELL (T&P) — CAMPUS RECRUITMENT POLICY 2026–2027

### 1. Student Eligibility Criteria for Campus Drives
- **Minimum Academic CGPA**: Cumulative Grade Point Average of **6.50 or 65% aggregate** across all completed semesters.
- **Backlog Policy**:
  - Tier-1 Companies (CTC > 12 LPA): Zero backlogs (active or cleared history).
  - Standard Drives (CTC 5 to 12 LPA): Maximum 1 cleared backlog permitted; **zero active live backlogs allowed**.
- **Minimum Attendance in Placement Training**: 85% mandatory attendance in Soft Skills, Aptitude, and Mock Technical Interviews.

### 2. Dream Company & Placement Offer Rules
- **One Student, One Job Policy**: Once a student receives an offer with CTC up to 8 LPA, they are considered placed.
- **Dream Company Exception**: A placed student may appear for a "Dream Company" drive only if the offering CTC is at least **1.8x times** higher than their existing offer.
- **Super Dream Tier**: Companies offering CTC exceeding **20 LPA** are open to all eligible students regardless of previous offers.

### 3. Placement Calendar 2026–2027
- **Resume Verification & Portal Registration**: 01 August to 20 August 2026
- **Pre-Placement Talks & Mock Tests**: 25 August to 10 September 2026
- **Phase 1 Campus Hiring Drives (Dream Companies)**: 15 September to 30 November 2026
- **Phase 2 Mass & Core Engineering Drives**: 15 January to 15 April 2027
- **Key Visiting Recruiters**: Microsoft, Google, Amazon, Oracle, Cisco, TCS Digital, Infosys Springboard, L&T Technology Services, Deloitte, Accenture.
- **TPO Contact**: Prof. Meenakshi Sundaram, Head of Training & Placement. Cabin: T&P Suite, Level 1. Email: tpo@college.edu.`,
  },
  {
    metadata: {
      id: 'doc-events-techfest-2026',
      title: 'Annual TechFest & Cultural Festival Notice: Aakriti & HackCampus 2026',
      category: 'Events',
      department: 'All',
      semester: 'All',
      academicYear: '2026-2027',
      version: 'v1.0',
      effectiveDate: '2026-09-01',
      isOutdated: false,
      fileType: 'pdf',
      fileSize: 210000,
      uploadedAt: '2026-09-02T12:00:00Z',
      tags: ['events', 'hackathon', 'fest', 'cultural', 'aakriti', 'competitions'],
    },
    content: `# APEX INSTITUTE OF TECHNOLOGY
## ANNUAL CAMPUS FESTIVALS — AAKRITI & HACKCAMPUS 2026

### 1. Event Schedule & Highlights
- **HackCampus 2026 (36-Hour National Hackathon)**:
  - **Dates**: 18 November to 19 November 2026
  - **Venue**: Central Computing Center & Innovation Lab
  - **Themes**: Generative AI, Sustainable Smart Cities, Healthcare Robotics, Web3.
  - **Prize Pool**: Total Cash Prizes of INR 3,00,000 + Internship Opportunities with Sponsor Tech Firms.
  - **Team Size**: 2 to 4 students (inter-departmental teams allowed).
- **Aakriti 2026 (Inter-Collegiate Cultural Festival)**:
  - **Dates**: 20 November to 22 November 2026
  - **Venue**: Open Air Amphitheatre & Sports Arena
  - **Key Events**: Battle of the Bands, Fashion Symphony, Street Play, Group Choreography, Pro-Night Concert (Featuring renowned artists).

### 2. Registration & Attendance Credit
- Participating students receive **Duty Leave (Official Attendance OD)** for all scheduled class slots during fest days upon showing valid registration pass.
- Online Registration opens on **15 October 2026** at the official portal: campusfest.college.edu.
- Faculty Coordinator: Dr. Sandeep Kulkarni (Ext. 215). Student General Secretary: Rohan Mehta.`,
  },
  {
    metadata: {
      id: 'doc-old-exam-schedule-2025',
      title: 'OUTDATED: Fall 2025 Examination Schedule (Superseded by 2026 Calendar)',
      category: 'Exams',
      department: 'All',
      semester: 'All',
      academicYear: '2025-2026',
      version: 'v1.0-ARCHIVED',
      effectiveDate: '2025-10-01',
      isOutdated: true,
      supersededBy: 'doc-acad-cal-2026',
      fileType: 'pdf',
      fileSize: 185000,
      uploadedAt: '2025-10-02T10:00:00Z',
      tags: ['exams', 'outdated', 'archived', '2025'],
    },
    content: `# [OUTDATED NOTICE - SUPERSEDED]
## FALL 2025 EXAMINATION SCHEDULE (OLD ARCHIVE)
*Note: This document is superseded by Academic Calendar 2026–2027. Do not refer to these dates for current year examinations.*
- Old 2025 Exam Dates: Midterms were held on 10 October 2025. End-semesters were held on 01 December 2025.
- This notice is kept for archival verification only.`,
  },
];

// Structured timetable schedules for direct lookups
export const STRUCTURED_TIMETABLES: TimetableSchedule[] = [
  {
    department: 'Computer Engineering',
    semester: 'Semester 5',
    academicYear: '2026-2027',
    division: '5-A',
    slots: [
      // Monday
      { day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Database Management Systems (DBMS)', subjectCode: 'CS501', professor: 'Dr. Arvind K. Sharma', room: 'Room 302', type: 'Lecture' },
      { day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Operating Systems (OS)', subjectCode: 'CS502', professor: 'Prof. Rajesh Verma', room: 'Room 302', type: 'Lecture' },
      { day: 'Monday', startTime: '11:00 AM', endTime: '11:15 AM', subject: 'Morning Tea Break', subjectCode: 'BREAK', professor: '—', room: 'Campus Plaza', type: 'Break' },
      { day: 'Monday', startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Computer Networks (CN)', subjectCode: 'CS503', professor: 'Prof. Sneha Kulkarni', room: 'Room 302', type: 'Lecture' },
      { day: 'Monday', startTime: '12:15 PM', endTime: '01:15 PM', subject: 'Lunch Break', subjectCode: 'LUNCH', professor: '—', room: 'Cafeteria', type: 'Break' },
      { day: 'Monday', startTime: '01:15 PM', endTime: '03:15 PM', subject: 'DBMS Practical Lab (Batch B1/B2)', subjectCode: 'CS501L', professor: 'Dr. Arvind K. Sharma & Prof. Meera Nair', room: 'Lab 4 / Lab 5', type: 'Lab' },
      { day: 'Monday', startTime: '03:15 PM', endTime: '04:15 PM', subject: 'Professional Ethics & Cyber Law', subjectCode: 'CS506', professor: 'Prof. Anjali Rao', room: 'Room 302', type: 'Lecture' },

      // Tuesday
      { day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Theory of Computation (TOC)', subjectCode: 'CS504', professor: 'Prof. Amit Deshmukh', room: 'Room 302', type: 'Lecture' },
      { day: 'Tuesday', startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Computer Networks (CN)', subjectCode: 'CS503', professor: 'Prof. Sneha Kulkarni', room: 'Room 302', type: 'Lecture' },
      { day: 'Tuesday', startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Database Management Systems (DBMS)', subjectCode: 'CS501', professor: 'Dr. Arvind K. Sharma', room: 'Room 302', type: 'Lecture' },
      { day: 'Tuesday', startTime: '01:15 PM', endTime: '03:15 PM', subject: 'Operating Systems Lab', subjectCode: 'CS502L', professor: 'Prof. Rajesh Verma', room: 'Lab 2', type: 'Lab' },
      { day: 'Tuesday', startTime: '03:15 PM', endTime: '04:15 PM', subject: 'Tutorial & Doubt Clearing Session', subjectCode: 'TUT', professor: 'Faculty Team', room: 'Room 302', type: 'Tutorial' },

      // Wednesday
      { day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Operating Systems (OS)', subjectCode: 'CS502', professor: 'Prof. Rajesh Verma', room: 'Room 302', type: 'Lecture' },
      { day: 'Wednesday', startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Artificial Intelligence & Machine Learning', subjectCode: 'CS505', professor: 'Dr. Priyanka Sen', room: 'Room 302', type: 'Lecture' },
      { day: 'Wednesday', startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Theory of Computation (TOC)', subjectCode: 'CS504', professor: 'Prof. Amit Deshmukh', room: 'Room 302', type: 'Lecture' },
      { day: 'Wednesday', startTime: '01:15 PM', endTime: '03:15 PM', subject: 'Computer Networks Lab', subjectCode: 'CS503L', professor: 'Prof. Sneha Kulkarni', room: 'Lab 3', type: 'Lab' },
      { day: 'Wednesday', startTime: '03:15 PM', endTime: '04:15 PM', subject: 'Library / Free Study Period', subjectCode: 'FREE', professor: 'Self Study', room: 'Central Library', type: 'Break' },

      // Thursday
      { day: 'Thursday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Artificial Intelligence & Machine Learning', subjectCode: 'CS505', professor: 'Dr. Priyanka Sen', room: 'Room 302', type: 'Lecture' },
      { day: 'Thursday', startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Database Management Systems (DBMS)', subjectCode: 'CS501', professor: 'Dr. Arvind K. Sharma', room: 'Room 302', type: 'Lecture' },
      { day: 'Thursday', startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Operating Systems (OS)', subjectCode: 'CS502', professor: 'Prof. Rajesh Verma', room: 'Room 302', type: 'Lecture' },
      { day: 'Thursday', startTime: '01:15 PM', endTime: '03:15 PM', subject: 'AI/ML Mini Project & Coding Lab', subjectCode: 'CS505L', professor: 'Dr. Priyanka Sen', room: 'Lab 6', type: 'Lab' },
      { day: 'Thursday', startTime: '03:15 PM', endTime: '04:15 PM', subject: 'Technical Seminar & Presentation', subjectCode: 'CS507', professor: 'Prof. Rajesh Verma', room: 'Seminar Hall 1', type: 'Lecture' },

      // Friday
      { day: 'Friday', startTime: '09:00 AM', endTime: '10:00 AM', subject: 'Computer Networks (CN)', subjectCode: 'CS503', professor: 'Prof. Sneha Kulkarni', room: 'Room 302', type: 'Lecture' },
      { day: 'Friday', startTime: '10:00 AM', endTime: '11:00 AM', subject: 'Theory of Computation (TOC)', subjectCode: 'CS504', professor: 'Prof. Amit Deshmukh', room: 'Room 302', type: 'Lecture' },
      { day: 'Friday', startTime: '11:15 AM', endTime: '12:15 PM', subject: 'Artificial Intelligence & Machine Learning', subjectCode: 'CS505', professor: 'Dr. Priyanka Sen', room: 'Room 302', type: 'Lecture' },
      { day: 'Friday', startTime: '01:15 PM', endTime: '03:15 PM', subject: 'Open Source Project Development Lab', subjectCode: 'CS508', professor: 'Dr. Arvind K. Sharma', room: 'Innovation Hub', type: 'Lab' },
      { day: 'Friday', startTime: '03:15 PM', endTime: '04:30 PM', subject: 'Sports, Clubs & Co-Curricular', subjectCode: 'SPORTS', professor: 'Activity Incharge', room: 'Sports Grounds', type: 'Break' },
    ],
  },
];
