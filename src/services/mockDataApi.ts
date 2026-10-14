import type {
  Role,
  User,
  Course,
  TimetableSession,
  AttendanceSession,
  Assignment,
  Exam,
  CourseGrade,
  StudentFee,
  Receipt,
  ServiceRequest,
  StudyDocument,
  ChatMessage,
  NotificationItem,
  Department,
  Room,
  GradePackage,
  GradeScaleRow
} from '../types';

// Helper to simulate network latency
const delay = (ms: number = 220) => new Promise(resolve => setTimeout(resolve, ms));

// ================= INITIAL FAKE DATABASE =================
const DB_USERS: Record<Role, User> = {
  student: {
    id: 'usr_std_01',
    name: 'Ahmed Mohamed Hassan',
    short: 'AH',
    role: 'student',
    roleLabel: 'Student',
    meta: 'Level 3 · Computer Science',
    email: 'ahmed.hassan@fcai.bsu.edu.eg',
    phone: '+20 102 345 6789',
    nationalId: '30302152201234',
    studentCode: '2021170045',
    department: 'Computer Science',
    academicLevel: 'Level 3 · Junior',
    academicStatus: 'Active',
    gpa: 3.42,
    completedCredits: 74,
    totalCredits: 132,
    birthDate: '2003-02-15',
    gender: 'Male',
    academicYear: '2026/2027',
    isFirstLogin: false
  },
  doctor: {
    id: 'usr_doc_01',
    name: 'Dr. Mona Abdelrahman',
    short: 'MA',
    role: 'doctor',
    roleLabel: 'Doctor / Instructor',
    meta: 'Associate Professor · Computer Science Dept.',
    email: 'mona.abdelrahman@fcai.bsu.edu.eg',
    phone: '+20 111 888 4422',
    department: 'Computer Science',
    academicStatus: 'Active'
  },
  ta: {
    id: 'usr_ta_01',
    name: 'Eng. Youssef Khaled',
    short: 'YK',
    role: 'ta',
    roleLabel: 'Teaching Assistant',
    meta: 'Teaching Assistant · Computer Science Dept.',
    email: 'youssef.khaled@fcai.bsu.edu.eg',
    phone: '+20 122 777 9911',
    department: 'Computer Science',
    academicStatus: 'Active'
  },
  admin: {
    id: 'usr_adm_01',
    name: 'Tarek Fathy',
    short: 'TF',
    role: 'admin',
    roleLabel: 'College Admin',
    meta: 'Dean Executive Administration',
    email: 'tarek.fathy@fcai.bsu.edu.eg',
    phone: '+20 100 555 1212',
    department: 'Faculty Administration',
    academicStatus: 'Active'
  },
  employee: {
    id: 'usr_emp_01',
    name: 'Salma Ibrahim',
    short: 'SI',
    role: 'employee',
    roleLabel: 'Employee',
    meta: 'Senior Officer · Student Affairs Dept.',
    email: 'salma.ibrahim@fcai.bsu.edu.eg',
    phone: '+20 106 333 7744',
    department: 'Student Affairs',
    academicStatus: 'Active'
  }
};

let DB_COURSES: Course[] = [
  {
    id: 'CS301',
    code: 'CS301',
    name: 'Design & Analysis of Algorithms',
    creditHours: 3,
    department: 'Computer Science',
    doctor: 'Dr. Mona Abdelrahman',
    ta: 'Eng. Youssef Khaled',
    section: 'S3',
    attendancePercent: 92,
    publishedGrade: null,
    colorIndex: 1,
    schedule: 'Sun 10:00–12:00 · Tue 12:00–14:00 (Sec)',
    room: 'Hall A-101',
    capacity: 65,
    availableSeats: 4,
    prerequisites: ['CS204 Data Structures']
  },
  {
    id: 'AI302',
    code: 'AI302',
    name: 'Machine Learning Fundamentals',
    creditHours: 3,
    department: 'Artificial Intelligence',
    doctor: 'Dr. Khaled Elsayed',
    ta: 'Eng. Nour Hesham',
    section: 'S1',
    attendancePercent: 88,
    publishedGrade: null,
    colorIndex: 2,
    schedule: 'Mon 09:00–11:00 · Wed 11:00–13:00 (Sec)',
    room: 'Hall B-204',
    capacity: 60,
    availableSeats: 2,
    prerequisites: ['MATH201 Linear Algebra', 'CS102 Python']
  },
  {
    id: 'IS305',
    code: 'IS305',
    name: 'Database Systems II',
    creditHours: 3,
    department: 'Information Systems',
    doctor: 'Dr. Hanan Fouad',
    ta: 'Eng. Omar Tamer',
    section: 'S2',
    attendancePercent: 95,
    publishedGrade: 'A-',
    colorIndex: 3,
    schedule: 'Sun 13:00–15:00 · Thu 09:00–11:00 (Sec)',
    room: 'Hall A-203',
    capacity: 70,
    availableSeats: 8,
    prerequisites: ['IS201 Database Systems I']
  },
  {
    id: 'CS305',
    code: 'CS305',
    name: 'Operating Systems Internals',
    creditHours: 3,
    department: 'Computer Science',
    doctor: 'Dr. Amr Shaker',
    ta: 'Eng. Mariam Adel',
    section: 'S3',
    attendancePercent: 71,
    publishedGrade: null,
    colorIndex: 4,
    schedule: 'Tue 09:00–11:00 · Wed 14:00–16:00 (Sec)',
    room: 'Hall C-110',
    capacity: 60,
    availableSeats: 0, // Full capacity demo
    prerequisites: ['CS201 Computer Architecture']
  },
  {
    id: 'IT311',
    code: 'IT311',
    name: 'Computer Networks & Protocols',
    creditHours: 3,
    department: 'Information Technology',
    doctor: 'Dr. Rania Mostafa',
    ta: 'Eng. Karim Ashraf',
    section: 'S4',
    attendancePercent: 84,
    publishedGrade: null,
    colorIndex: 5,
    schedule: 'Mon 12:00–14:00 · Thu 12:00–14:00 (Sec)',
    room: 'Hall B-102',
    capacity: 60,
    availableSeats: 6,
    prerequisites: ['IT201 Telecommunications']
  },
  {
    id: 'HU301',
    code: 'HU301',
    name: 'Technical Writing & Academic Ethics',
    creditHours: 2,
    department: 'Humanities',
    doctor: 'Dr. Noha Galal',
    ta: '—',
    section: '—',
    attendancePercent: 90,
    publishedGrade: null,
    colorIndex: 7,
    schedule: 'Wed 09:00–11:00',
    room: 'Hall D-001',
    capacity: 120,
    availableSeats: 22,
    prerequisites: []
  }
];

let DB_AVAILABLE_OFFERINGS: Course[] = [
  ...DB_COURSES,
  {
    id: 'CS310',
    code: 'CS310',
    name: 'Software Engineering Principles',
    creditHours: 3,
    department: 'Computer Science',
    doctor: 'Dr. Sherif Zaki',
    ta: 'Eng. Aya Samir',
    section: 'S1',
    attendancePercent: 0,
    publishedGrade: null,
    colorIndex: 6,
    schedule: 'Tue 14:00–16:00 · Thu 10:00–12:00',
    room: 'Hall C-102',
    capacity: 60,
    availableSeats: 12,
    prerequisites: ['CS202 Object-Oriented Programming']
  },
  {
    id: 'AI306',
    code: 'AI306',
    name: 'Natural Language Processing',
    creditHours: 3,
    department: 'Artificial Intelligence',
    doctor: 'Dr. Waleed Nabil',
    ta: 'Eng. Nour Hesham',
    section: 'S2',
    attendancePercent: 0,
    publishedGrade: null,
    colorIndex: 2,
    schedule: 'Wed 10:00–12:00 · Sun 15:00–17:00',
    room: 'Hall B-201',
    capacity: 45,
    availableSeats: 5,
    prerequisites: ['AI302 Machine Learning']
  }
];

let DB_TIMETABLE: TimetableSession[] = [
  { id: 'tt1', courseCode: 'CS301', courseName: 'Design & Analysis of Algorithms', sessionType: 'Lecture', instructor: 'Dr. Mona Abdelrahman', room: 'Hall A-101', day: 'Sunday', startTime: '10:00', endTime: '12:00', colorClass: 'ev-1' },
  { id: 'tt2', courseCode: 'IS305', courseName: 'Database Systems II', sessionType: 'Lecture', instructor: 'Dr. Hanan Fouad', room: 'Hall A-203', day: 'Sunday', startTime: '13:00', endTime: '15:00', colorClass: 'ev-3' },
  { id: 'tt3', courseCode: 'AI302', courseName: 'Machine Learning', sessionType: 'Lecture', instructor: 'Dr. Khaled Elsayed', room: 'Hall B-204', day: 'Monday', startTime: '09:00', endTime: '11:00', colorClass: 'ev-2' },
  { id: 'tt4', courseCode: 'IT311', courseName: 'Computer Networks', sessionType: 'Lecture', instructor: 'Dr. Rania Mostafa', room: 'Hall B-102', day: 'Monday', startTime: '12:00', endTime: '14:00', colorClass: 'ev-5' },
  { id: 'tt5', courseCode: 'CS305', courseName: 'Operating Systems', sessionType: 'Lecture', instructor: 'Dr. Amr Shaker', room: 'Hall C-110', day: 'Tuesday', startTime: '09:00', endTime: '11:00', colorClass: 'ev-4' },
  { id: 'tt6', courseCode: 'CS301', courseName: 'Algorithms Lab Section', sessionType: 'Section', instructor: 'Eng. Youssef Khaled', room: 'Lab 3-West', day: 'Tuesday', startTime: '12:00', endTime: '14:00', colorClass: 'ev-1' },
  { id: 'tt7', courseCode: 'HU301', courseName: 'Technical Writing', sessionType: 'Lecture', instructor: 'Dr. Noha Galal', room: 'Hall D-001', day: 'Wednesday', startTime: '09:00', endTime: '11:00', colorClass: 'ev-7' },
  { id: 'tt8', courseCode: 'AI302', courseName: 'Machine Learning Lab', sessionType: 'Section', instructor: 'Eng. Nour Hesham', room: 'Lab AI-1', day: 'Wednesday', startTime: '11:00', endTime: '13:00', colorClass: 'ev-2' },
  { id: 'tt9', courseCode: 'CS305', courseName: 'Operating Systems Lab', sessionType: 'Section', instructor: 'Eng. Mariam Adel', room: 'Lab 2-East', day: 'Wednesday', startTime: '14:00', endTime: '16:00', colorClass: 'ev-4' },
  { id: 'tt10', courseCode: 'IS305', courseName: 'Database Section', sessionType: 'Section', instructor: 'Eng. Omar Tamer', room: 'Lab 4-North', day: 'Thursday', startTime: '09:00', endTime: '11:00', colorClass: 'ev-3' },
  { id: 'tt11', courseCode: 'IT311', courseName: 'Networks Lab Section', sessionType: 'Section', instructor: 'Eng. Karim Ashraf', room: 'Lab 1-South', day: 'Thursday', startTime: '12:00', endTime: '14:00', colorClass: 'ev-5' }
];

let DB_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  { id: 'as1', courseCode: 'CS301', courseName: 'Algorithms', date: 'Oct 11, 2026', sessionType: 'Lecture', time: '10:00 - 12:00', status: 'Present', checkInTime: '10:04 AM', room: 'Hall A-101' },
  { id: 'as2', courseCode: 'IS305', courseName: 'Database Systems II', date: 'Oct 11, 2026', sessionType: 'Lecture', time: '13:00 - 15:00', status: 'Present', checkInTime: '13:02 AM', room: 'Hall A-203' },
  { id: 'as3', courseCode: 'CS305', courseName: 'Operating Systems', date: 'Oct 06, 2026', sessionType: 'Lecture', time: '09:00 - 11:00', status: 'Absent', room: 'Hall C-110' },
  { id: 'as4', courseCode: 'CS305', courseName: 'Operating Systems Lab', date: 'Oct 07, 2026', sessionType: 'Section', time: '14:00 - 16:00', status: 'Late', checkInTime: '14:22 PM', room: 'Lab 2-East' },
  { id: 'as5', courseCode: 'AI302', courseName: 'Machine Learning', date: 'Oct 05, 2026', sessionType: 'Lecture', time: '09:00 - 11:00', status: 'Present', checkInTime: '09:01 AM', room: 'Hall B-204' },
  { id: 'as6', courseCode: 'IT311', courseName: 'Computer Networks', date: 'Oct 05, 2026', sessionType: 'Lecture', time: '12:00 - 14:00', status: 'Excused', room: 'Hall B-102' }
];

let DB_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a3',
    courseCode: 'CS301',
    courseName: 'Design & Analysis of Algorithms',
    title: 'Assignment 3: Dynamic Programming Applications',
    description: 'Implement dynamic programming solutions in C++ or Python for 0/1 Knapsack, LCS, and Matrix Chain Multiplication. Include benchmarks and theoretical recurrence.',
    scope: 'Course-wide',
    dueDate: 'Oct 18, 2026 · 11:59 PM',
    totalMarks: 15,
    status: 'Pending',
    attachedInstructions: 'FCAI_CS301_Assignment3_Specification.pdf'
  },
  {
    id: 'a2',
    courseCode: 'CS305',
    courseName: 'Operating Systems Internals',
    title: 'Lab Practical 2: Process Synchronization (POSIX Mutex)',
    description: 'Implement the Dining Philosophers and Producer-Consumer models using POSIX threads, condition variables, and semaphores with zero deadlocks.',
    scope: 'Section S3 (TA)',
    dueDate: 'Oct 14, 2026 · 10:00 AM',
    totalMarks: 10,
    status: 'Submitted',
    grade: 'Under Review',
    feedback: 'Submitted on time. Awaiting evaluation by Eng. Mariam Adel.',
    submittedFiles: [{ name: 'ahmed_2021170045_lab2_sync.tar.gz', size: '2.4 MB', date: 'Oct 12, 2026 · 08:30 PM' }],
    submittedAt: 'Oct 12, 2026 · 08:30 PM'
  },
  {
    id: 'a1',
    courseCode: 'AI302',
    courseName: 'Machine Learning Fundamentals',
    title: 'Assignment 1: Gradient Descent & Loss Optimization',
    description: 'Derive batch vs stochastic gradient descent cost formulas and benchmark convergence rates across multiple learning rate hyper-parameters.',
    scope: 'Course-wide',
    dueDate: 'Sep 28, 2026 · 11:59 PM',
    totalMarks: 10,
    status: 'Graded',
    grade: '10 / 10',
    feedback: 'Flawless derivations and well-commented matplotlib comparison curves.',
    submittedFiles: [{ name: 'ahmed_hassan_ai302_ass1.ipynb', size: '1.8 MB', date: 'Sep 27, 2026 · 04:12 PM' }],
    submittedAt: 'Sep 27, 2026 · 04:12 PM'
  },
  {
    id: 'a4',
    courseCode: 'IT311',
    courseName: 'Computer Networks',
    title: 'Wireshark Lab 1: TCP Handshake Analysis',
    description: 'Capture and inspect TCP 3-way handshake packet sequence and analyze flow control window scaling.',
    scope: 'Section S4 (TA)',
    dueDate: 'Sep 25, 2026 · 11:59 PM',
    totalMarks: 10,
    status: 'Graded',
    grade: '9 / 10',
    feedback: 'Very thorough capture analysis. Minor omission on SYN-ACK timestamp option.',
    submittedAt: 'Sep 24, 2026'
  },
  {
    id: 'a5',
    courseCode: 'IS305',
    courseName: 'Database Systems II',
    title: 'ER Diagram to Relational Schema Normalization',
    description: 'Convert enhanced ER diagram with specialization hierarchies into 3NF relational schemas.',
    scope: 'Course-wide',
    dueDate: 'Sep 20, 2026 · 11:59 PM',
    totalMarks: 15,
    status: 'Graded',
    grade: '14 / 15',
    feedback: 'Correct primary and composite foreign key mappings.',
    submittedAt: 'Sep 19, 2026'
  }
];

let DB_EXAMS: Exam[] = [
  {
    id: 'e1',
    courseCode: 'CS301',
    courseName: 'Design & Analysis of Algorithms',
    title: 'Algorithms Midterm Assessment',
    type: 'Midterm',
    startTime: '2026-10-18T10:00:00',
    endTime: '2026-10-18T11:30:00',
    durationMinutes: 60,
    questionCount: 4,
    totalMarks: 20,
    status: 'Available',
    instructions: [
      'This exam comprises randomized Multiple Choice, True/False, and Short Answer questions.',
      'Once started, the countdown timer will continue even if you close the tab.',
      'Only ONE submission attempt is permitted.',
      'Calculators and reference materials are not allowed.'
    ],
    rules: [
      'Do not switch browser tabs or minimize the test window.',
      'Short Answer responses are subject to subsequent instructor verification.',
      'Make sure you have a reliable network connection before starting.'
    ],
    questions: [
      {
        id: 'q1',
        type: 'MCQ',
        prompt: 'What is the worst-case asymptotic time complexity of the standard randomized QuickSort algorithm?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correctOptionIndex: 1,
        marks: 4
      },
      {
        id: 'q2',
        type: 'TrueFalse',
        prompt: 'Dynamic Programming is applicable only when sub-problems are independent and non-overlapping.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
        marks: 3
      },
      {
        id: 'q3',
        type: 'MCQ',
        prompt: 'Which data structure allows Dijkstra’s algorithm to achieve O((V + E) log V) running time?',
        options: ['Binary Search Tree', 'Fibonacci or Binary Min-Heap', 'Disjoint Set (Union-Find)', 'Hash Map with chaining'],
        correctOptionIndex: 1,
        marks: 5
      },
      {
        id: 'q4',
        type: 'ShortAnswer',
        prompt: 'State the recurrence equation for the standard 0/1 Knapsack problem with n items and capacity W.',
        marks: 8
      }
    ]
  },
  {
    id: 'e2',
    courseCode: 'AI302',
    courseName: 'Machine Learning',
    title: 'Machine Learning Online Quiz 1',
    type: 'Quiz',
    startTime: '2026-10-02T10:00:00',
    endTime: '2026-10-02T10:30:00',
    durationMinutes: 25,
    questionCount: 10,
    status: 'Completed',
    score: 18,
    totalMarks: 20,
    instructions: [],
    rules: []
  },
  {
    id: 'e3',
    courseCode: 'CS305',
    courseName: 'Operating Systems',
    title: 'OS Practical Lab Examination',
    type: 'Practical Exam',
    startTime: '2026-11-04T12:00:00',
    endTime: '2026-11-04T13:30:00',
    durationMinutes: 90,
    questionCount: 3,
    totalMarks: 20,
    status: 'Upcoming',
    instructions: ['In-person lab session in Lab 2-East.'],
    rules: ['Terminal shell access provided.']
  }
];

let DB_STUDENT_FEES: StudentFee[] = [
  {
    id: 'f1',
    feeType: 'Tuition Fee — Fall Semester 2026',
    academicYear: '2026/2027',
    semester: 'Fall 2026',
    originalAmount: 8500,
    discount: 850, // Academic excellence discount
    finalAmount: 7650,
    dueDate: 'Oct 20, 2026',
    status: 'Unpaid'
  },
  {
    id: 'f2',
    feeType: 'Technology & Digital Services Fee',
    academicYear: '2026/2027',
    semester: 'Fall 2026',
    originalAmount: 1200,
    discount: 0,
    finalAmount: 1200,
    dueDate: 'Sep 25, 2026',
    status: 'Paid',
    paymentDate: 'Sep 22, 2026',
    transactionRef: 'FWY-78891023',
    provider: 'Fawry Electronic Payment'
  },
  {
    id: 'f3',
    feeType: 'Tuition Fee — Spring Semester 2026',
    academicYear: '2025/2026',
    semester: 'Spring 2026',
    originalAmount: 8000,
    discount: 800,
    finalAmount: 7200,
    dueDate: 'Feb 15, 2026',
    status: 'Paid',
    paymentDate: 'Feb 10, 2026',
    transactionRef: 'FWY-65412988',
    provider: 'Fawry Electronic Payment'
  }
];

let DB_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'REQ-24117',
    type: 'Transcript',
    department: 'Student Affairs',
    subject: 'Official English Academic Transcript for Embassy',
    description: 'Requesting an official certified English transcript with university stamp for embassy visa application.',
    submittedDate: 'Oct 04, 2026',
    status: 'In Progress',
    handlerName: 'Salma Ibrahim',
    studentName: 'Ahmed Mohamed Hassan',
    studentCode: '2021170045'
  },
  {
    id: 'REQ-24089',
    type: 'Certificate',
    department: 'Student Affairs',
    subject: 'Proof of Enrollment Certificate (Health Insurance)',
    description: 'Need certified student status letter addressed to the Egyptian Health Insurance Organization.',
    submittedDate: 'Sep 28, 2026',
    status: 'Resolved',
    handlerName: 'Salma Ibrahim',
    resolvedDate: 'Oct 01, 2026',
    resolutionNotes: 'Certificate printed, stamped, and ready for pickup from Student Affairs Counter 3.',
    studentName: 'Ahmed Mohamed Hassan',
    studentCode: '2021170045'
  },
  {
    id: 'REQ-24128',
    type: 'Student Card',
    department: 'Student Affairs',
    subject: 'ID Card Replacement (Lost)',
    description: 'My smart ID card was lost on campus near Building B.',
    submittedDate: 'Oct 06, 2026',
    status: 'Pending',
    studentName: 'Omar Khaled Fathy',
    studentCode: '2022170033'
  }
];

let DB_STUDY_DOCUMENTS: StudyDocument[] = [
  {
    id: 'doc-algo',
    title: 'CS301_Lecture4_Dynamic_Programming.pdf',
    uploadDate: 'Oct 08, 2026',
    fileSize: '4.8 MB',
    pageCount: 38,
    summary: 'Covers optimal substructure, overlapping subproblems, memoization vs bottom-up tabulation, with Knapsack and Matrix Chain Multiplication proofs.'
  },
  {
    id: 'doc-os',
    title: 'CS305_Chapter5_CPU_Scheduling_Mechanisms.pdf',
    uploadDate: 'Oct 02, 2026',
    fileSize: '6.2 MB',
    pageCount: 52,
    summary: 'In-depth analysis of FCFS, SJF, Shortest Remaining Time First, Priority Scheduling, Round Robin, and Multi-level Feedback Queues with Gantt charts.'
  }
];

let DB_PDF_CHATS: Record<string, ChatMessage[]> = {
  'doc-algo': [
    {
      id: 'c1',
      sender: 'student',
      text: 'What are the two key properties required for dynamic programming to apply?',
      timestamp: '10:14 AM'
    },
    {
      id: 'c2',
      sender: 'ai',
      text: 'According to page 4 of the uploaded document, Dynamic Programming requires two fundamental properties:\n1. **Optimal Substructure**: An optimal solution to the overall problem contains within it optimal solutions to subproblems.\n2. **Overlapping Subproblems**: The recursive space contains a relatively small number of distinct subproblems that are solved repeatedly rather than generating new subproblems.',
      timestamp: '10:14 AM',
      citation: 'Page 4, Section 4.2'
    }
  ]
};

let DB_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Assignment Due Tomorrow',
    message: 'CS301 Assignment 3: Dynamic Programming is due tomorrow at 11:59 PM.',
    date: '12 minutes ago',
    unread: true,
    icon: 'clipboard',
    tone: 'b-warning',
    link: '#/student/assignments/a3'
  },
  {
    id: 'n2',
    title: 'New Course Grade Published',
    message: 'IS305 Database Systems II: Midterm grade has been verified and published.',
    date: '2 hours ago',
    unread: true,
    icon: 'award',
    tone: 'b-success',
    link: '#/student/grades'
  },
  {
    id: 'n3',
    title: 'Tuition Fee Due Soon',
    message: 'Fall 2026 Tuition Fee (EGP 7,650) is due by October 20, 2026 via Fawry.',
    date: 'Yesterday at 04:30 PM',
    unread: true,
    icon: 'wallet',
    tone: 'b-danger',
    link: '#/student/fees'
  },
  {
    id: 'n4',
    title: 'Online Quiz Scheduled',
    message: 'CS301 Algorithms Quiz 1 opens Wednesday, October 14 at 10:00 AM.',
    date: 'Yesterday at 11:00 AM',
    unread: true,
    icon: 'fileText',
    tone: 'b-info',
    link: '#/student/exams'
  },
  {
    id: 'n5',
    title: 'Service Request In Progress',
    message: 'REQ-24117 (Official English Transcript) assigned to Salma Ibrahim.',
    date: 'Oct 05, 2026',
    unread: true,
    icon: 'inbox',
    tone: 'b-info',
    link: '#/student/requests'
  },
  {
    id: 'n6',
    title: 'Course Registration Confirmed',
    message: 'Enrollment confirmed for CS305 Operating Systems (Section S3).',
    date: 'Sep 28, 2026',
    unread: false,
    icon: 'plusSquare',
    tone: 'b-success',
    link: '#/student/courses'
  }
];

let DB_GRADE_PACKAGES: GradePackage[] = [
  {
    id: 'gp1',
    courseCode: 'CS204',
    courseName: 'Data Structures',
    leadDoctor: 'Dr. Mona Abdelrahman',
    enrolledStudents: 52,
    submissionTime: 'Oct 07, 11:30 AM',
    status: 'Doctor Submitted',
    averageGrade: '84.6% (B+)',
    failuresCount: 2
  },
  {
    id: 'gp2',
    courseCode: 'IT201',
    courseName: 'Computer Architecture',
    leadDoctor: 'Dr. Waleed Nabil',
    enrolledStudents: 48,
    submissionTime: 'Oct 06, 04:15 PM',
    status: 'Doctor Submitted',
    averageGrade: '78.2% (B)',
    failuresCount: 3
  },
  {
    id: 'gp3',
    courseCode: 'CS412',
    courseName: 'Compiler Design',
    leadDoctor: 'Dr. Amr Shaker',
    enrolledStudents: 38,
    submissionTime: 'Oct 05, 02:00 PM',
    status: 'Draft',
    averageGrade: '71.5% (C+)',
    failuresCount: 5,
    auditNotes: 'Returned to Draft by College Admin: Practical component scale mismatch. Please recalculate out of 20 marks.'
  }
];

const DB_DEPARTMENTS: Department[] = [
  { id: 'CS', code: 'CS', name: 'Computer Science', type: 'Academic', description: 'Computing, Software Engineering & Systems', head: 'Prof. Dr. Ahmed Mansour', officeLocation: 'Building A, Room 302', staffCount: 44, doctorsCount: 18, tasCount: 26, studentsCount: 580, coursesCount: 34, permissions: ['Courses.Manage', 'Grades.Submit', 'Exams.Control'] },
  { id: 'AI', code: 'AI', name: 'Artificial Intelligence', type: 'Academic', description: 'Machine Learning, Deep Learning & Robotics', head: 'Prof. Dr. Khaled Fawzy', officeLocation: 'Building B, Room 201', staffCount: 30, doctorsCount: 12, tasCount: 18, studentsCount: 420, coursesCount: 24, permissions: ['Courses.Manage', 'Grades.Submit'] },
  { id: 'IS', code: 'IS', name: 'Information Systems', type: 'Academic', description: 'Enterprise Systems, Database Architecture & BI', head: 'Prof. Dr. Hoda Salem', officeLocation: 'Building A, Room 205', staffCount: 24, doctorsCount: 10, tasCount: 14, studentsCount: 310, coursesCount: 20, permissions: ['Courses.Manage', 'Grades.Submit'] },
  { id: 'IT', code: 'IT', name: 'Information Technology', type: 'Academic', description: 'Networking, Cloud Infrastructure & Cybersecurity', head: 'Prof. Dr. Sameh Taha', officeLocation: 'Building B, Room 104', staffCount: 22, doctorsCount: 8, tasCount: 14, studentsCount: 230, coursesCount: 18, permissions: ['Courses.Manage', 'Grades.Submit'] },
  { id: 'SA', code: 'SA', name: 'Student Affairs', type: 'Administrative', description: 'Student Enrollment, Certificates & Academic Standing', head: 'Mr. Mahmoud Fathy', officeLocation: 'Ground Floor, Administration Office', staffCount: 8, employeesCount: 8, permissions: ['ServiceRequests.View', 'ServiceRequests.Process', 'ServiceRequests.Reject', 'Students.ViewBasic'] },
  { id: 'FA', code: 'FA', name: 'Financial Affairs', type: 'Administrative', description: 'Tuition Fees, Exemptions & Fawry Reconciliations', head: 'Mrs. Nevine Refaat', officeLocation: 'Ground Floor, Treasury', staffCount: 6, employeesCount: 6, permissions: ['Fees.Manage', 'Payments.Verify', 'Discounts.Apply'] },
  { id: 'EX', code: 'EX', name: 'Examinations Control', type: 'Administrative', description: 'Control Unit, Exams Scheduling & Tabulation', head: 'Prof. Dr. Tarek Amin', officeLocation: 'Building C, Control Center', staffCount: 5, employeesCount: 5, permissions: ['Exams.Schedule', 'Grades.Audit'] }
];

const DB_ROOMS: Room[] = [
  { id: 'r1', name: 'Lecture Hall A-101', type: 'Hall', capacity: 150, building: 'Faculty Main', floor: 'Floor 1', equipment: ['Smart Projector', 'Mic System', 'Air Conditioned', 'Tiered Seating'], mapCoordinates: { x: 45, y: 35 }, latitude: 29.0768, longitude: 31.0975, active: true },
  { id: 'r2', name: 'Lecture Hall B-204', type: 'Hall', capacity: 120, building: 'Faculty Main', floor: 'Floor 2', equipment: ['Laser Display', 'Audio System', 'Podium PC'], mapCoordinates: { x: 145, y: 35 }, latitude: 29.0772, longitude: 31.0981, active: true },
  { id: 'r3', name: 'Lecture Hall C-110', type: 'Hall', capacity: 100, building: 'Building C', floor: 'Floor 1', equipment: ['4K Projector', 'Surround Audio'], mapCoordinates: { x: 45, y: 85 }, latitude: 29.0765, longitude: 31.0969, active: true },
  { id: 'r4', name: 'AI Lab 3-West', type: 'Lab', capacity: 40, building: 'Faculty Main', floor: 'Floor 3', equipment: ['40x RTX 4080 Workstations', 'Dual Monitors', 'Fiber 1Gbps', 'Interactive Whiteboard'], mapCoordinates: { x: 145, y: 85 }, latitude: 29.0775, longitude: 31.0972, active: true },
  { id: 'r5', name: 'Software Lab 2-East', type: 'Lab', capacity: 40, building: 'Faculty Main', floor: 'Floor 2', equipment: ['40x Core i7 Workstations', 'Local Git Server', 'Dual Projectors'], mapCoordinates: { x: 95, y: 60 }, latitude: 29.0778, longitude: 31.0976, active: true }
];

const DB_GRADE_SCALE: GradeScaleRow[] = [
  { letter: 'A+', points: 4.0, minPercent: 95, maxPercent: 100, minMarks: 95, maxMarks: 100, description: 'Distinction / Excellent' },
  { letter: 'A', points: 3.7, minPercent: 90, maxPercent: 94, minMarks: 90, maxMarks: 94, description: 'Excellent' },
  { letter: 'B+', points: 3.3, minPercent: 85, maxPercent: 89, minMarks: 85, maxMarks: 89, description: 'Very Good High' },
  { letter: 'B', points: 3.0, minPercent: 80, maxPercent: 84, minMarks: 80, maxMarks: 84, description: 'Very Good' },
  { letter: 'C+', points: 2.7, minPercent: 75, maxPercent: 79, minMarks: 75, maxMarks: 79, description: 'Good High' },
  { letter: 'C', points: 2.4, minPercent: 70, maxPercent: 74, minMarks: 70, maxMarks: 74, description: 'Good' },
  { letter: 'D+', points: 2.0, minPercent: 65, maxPercent: 69, minMarks: 65, maxMarks: 69, description: 'Pass High' },
  { letter: 'D', points: 1.5, minPercent: 60, maxPercent: 64, minMarks: 60, maxMarks: 64, description: 'Pass' },
  { letter: 'F', points: 0.0, minPercent: 0, maxPercent: 59, minMarks: 0, maxMarks: 59, description: 'Fail' }
];

// ================= IN-MEMORY MOCK DATA SERVICE =================
export const mockDataApi = {
  // ---- Auth & Identity ----
  async getCurrentUser(role: Role = 'student'): Promise<User> {
    await delay(120);
    return { ...DB_USERS[role] };
  },

  async login(creds: { role: Role; id?: string; password?: string; email?: string }): Promise<User> {
    await delay(280);
    const user = DB_USERS[creds.role];
    if (creds.password === 'error_trigger') {
      throw new Error('Invalid credentials');
    }
    return { ...user };
  },

  async updatePassword(_oldPw: string, _newPw: string): Promise<boolean> {
    await delay(300);
    DB_USERS.student.isFirstLogin = false;
    return true;
  },

  // ---- Student Portal ----
  async getStudentDashboard() {
    await delay(180);
    return {
      student: DB_USERS.student,
      kpis: {
        gpa: 3.42,
        attendance: 87,
        coursesCount: DB_COURSES.length,
        upcomingExams: 2,
        pendingAssignments: DB_ASSIGNMENTS.filter(a => a.status === 'Pending').length,
        unpaidFees: DB_STUDENT_FEES.filter(f => f.status === 'Unpaid').length,
        unreadNotifs: DB_NOTIFICATIONS.filter(n => n.unread).length
      },
      todaySchedule: DB_TIMETABLE.slice(0, 2),
      pendingAssignments: DB_ASSIGNMENTS.filter(a => a.status === 'Pending').slice(0, 3),
      attendanceAlerts: DB_COURSES.filter(c => c.attendancePercent < 75),
      recentNotifs: DB_NOTIFICATIONS.slice(0, 3)
    };
  },

  async getStudentProfile(): Promise<User> {
    await delay(150);
    return { ...DB_USERS.student };
  },

  async updateStudentProfile(patch: { phone?: string; email?: string }): Promise<User> {
    await delay(250);
    if (patch.phone) DB_USERS.student.phone = patch.phone;
    if (patch.email) DB_USERS.student.email = patch.email;
    return { ...DB_USERS.student };
  },

  async getAcademicInfo() {
    await delay(180);
    return {
      student: DB_USERS.student,
      semesters: [
        { term: 'Fall 2026 (Current)', gpa: 3.42, credits: 17, status: 'Active' },
        { term: 'Spring 2025/2026', gpa: 3.34, credits: 18, status: 'Completed' },
        { term: 'Fall 2025/2026', gpa: 3.51, credits: 18, status: 'Completed' },
        { term: 'Spring 2024/2025', gpa: 3.28, credits: 18, status: 'Completed' }
      ]
    };
  },

  async getMyCourses(): Promise<Course[]> {
    await delay(160);
    return [...DB_COURSES];
  },

  async getCourseRegistrationOfferings(): Promise<{
    activeSemester: string;
    isPeriodOpen: boolean;
    registeredCount: number;
    maxCredits: number;
    currentCredits: number;
    offerings: Course[];
  }> {
    await delay(200);
    const currentCredits = DB_COURSES.reduce((sum, c) => sum + c.creditHours, 0);
    return {
      activeSemester: 'Fall 2026',
      isPeriodOpen: true,
      registeredCount: DB_COURSES.length,
      maxCredits: 18,
      currentCredits,
      offerings: DB_AVAILABLE_OFFERINGS
    };
  },

  async registerCourse(courseId: string): Promise<{
    success: boolean;
    message: string;
    ruleChecks: { rule: string; passed: boolean; message: string }[];
  }> {
    await delay(350);
    const target = DB_AVAILABLE_OFFERINGS.find(c => c.id === courseId);
    if (!target) {
      return {
        success: false,
        message: 'Course offering not found.',
        ruleChecks: []
      };
    }

    const isAlreadyEnrolled = DB_COURSES.some(c => c.id === courseId);
    const currentCredits = DB_COURSES.reduce((sum, c) => sum + c.creditHours, 0);
    const willExceedCreditLimit = currentCredits + target.creditHours > 18;
    const hasSeats = (target.availableSeats ?? 0) > 0;

    const ruleChecks = [
      { rule: '1. Registration Period', passed: true, message: 'Fall 2026 registration is currently active.' },
      { rule: '2. Course Offering Availability', passed: true, message: `${target.code} is open for Fall 2026.` },
      { rule: '3. Academic Prerequisites', passed: true, message: 'All prerequisite courses passed with grade C or higher.' },
      { rule: '4. Semester Credit Load Limit (Max 18 CH)', passed: !willExceedCreditLimit, message: willExceedCreditLimit ? `Adding ${target.creditHours} CH would exceed your limit (${currentCredits + target.creditHours} > 18 CH).` : `Credit load will be ${currentCredits + target.creditHours} / 18 CH.` },
      { rule: '5. Timetable Schedule Conflicts', passed: true, message: 'No lecture or lab section clashes detected.' },
      { rule: '6. Seat Capacity', passed: hasSeats, message: hasSeats ? `${target.availableSeats} seats remaining.` : 'Course section is at maximum capacity (0 seats).' },
      { rule: '7. Student Academic Status', passed: true, message: 'Student status is Active (Good standing).' },
      { rule: '8. Existing Course Enrollment', passed: !isAlreadyEnrolled, message: isAlreadyEnrolled ? 'Already registered in this course.' : 'Not previously registered.' }
    ];

    const canRegister = ruleChecks.every(r => r.passed);
    if (canRegister) {
      DB_COURSES.push({ ...target, attendancePercent: 100, publishedGrade: null });
      if (target.availableSeats) target.availableSeats -= 1;
      return {
        success: true,
        message: `Successfully registered for ${target.code} ${target.name}.`,
        ruleChecks
      };
    } else {
      return {
        success: false,
        message: 'Registration validation failed. Please check the rules below.',
        ruleChecks
      };
    }
  },

  async dropCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    await delay(300);
    const index = DB_COURSES.findIndex(c => c.id === courseId);
    if (index >= 0) {
      const dropped = DB_COURSES[index];
      DB_COURSES.splice(index, 1);
      const offering = DB_AVAILABLE_OFFERINGS.find(c => c.id === courseId);
      if (offering && offering.availableSeats !== undefined) {
        offering.availableSeats += 1;
      }
      return { success: true, message: `Course ${dropped.code} has been successfully dropped.` };
    }
    return { success: false, message: 'Course not found in registered courses.' };
  },

  async getTimetable(): Promise<TimetableSession[]> {
    await delay(160);
    return [...DB_TIMETABLE];
  },

  async getExamSchedule(): Promise<Exam[]> {
    await delay(180);
    return [...DB_EXAMS];
  },

  async getAttendanceOverview() {
    await delay(200);
    return {
      overallPercentage: 87,
      attendedSessions: 28,
      absentSessions: 4,
      lateSessions: 2,
      excusedSessions: 1,
      courses: DB_COURSES.map(c => ({
        code: c.code,
        name: c.name,
        percent: c.attendancePercent,
        doctor: c.doctor,
        section: c.section
      })),
      history: DB_ATTENDANCE_SESSIONS
    };
  },

  async verifyQrAttendance(
    token: string,
    coords: { lat: number; lng: number }
  ): Promise<{ success: boolean; state: string; message: string; session?: any }> {
    await delay(450);

    // Geofence check around Beni Suef campus (~29.0768, 31.0975)
    const campusLat = 29.0768;
    const campusLng = 31.0975;
    const distanceKm = Math.sqrt(Math.pow(coords.lat - campusLat, 2) + Math.pow(coords.lng - campusLng, 2)) * 111;

    if (token === 'EXPIRED') {
      return { success: false, state: 'Expired QR', message: 'The QR token rotated after 5 seconds. Please scan the current code.' };
    }
    if (token === 'INVALID') {
      return { success: false, state: 'Invalid QR', message: 'QR code does not correspond to an authorized FCAI lecture.' };
    }
    if (distanceKm > 0.15) { // outside 150m
      return { success: false, state: 'Outside 100-meter geofence', message: `Your current GPS position is ${Math.round(distanceKm * 1000)}m away from Hall A-101. Must be within 100m.` };
    }

    const sessionInfo = {
      courseCode: 'CS301',
      courseName: 'Design & Analysis of Algorithms',
      room: 'Hall A-101',
      sessionType: 'Lecture',
      doctor: 'Dr. Mona Abdelrahman',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today, Oct 14, 2026'
    };

    // Record attendance
    DB_ATTENDANCE_SESSIONS.unshift({
      id: `as_${Date.now()}`,
      courseCode: 'CS301',
      courseName: 'Algorithms',
      date: 'Oct 14, 2026',
      sessionType: 'Lecture',
      time: '10:00 - 12:00',
      status: 'Present',
      checkInTime: sessionInfo.checkInTime,
      room: 'Hall A-101'
    });

    return {
      success: true,
      state: 'Attendance successful',
      message: 'Verified! You are officially marked Present.',
      session: sessionInfo
    };
  },

  async getAssignments(statusFilter?: string): Promise<Assignment[]> {
    await delay(160);
    if (!statusFilter || statusFilter === 'all') return [...DB_ASSIGNMENTS];
    return DB_ASSIGNMENTS.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
  },

  async getAssignment(id: string): Promise<Assignment | null> {
    await delay(150);
    const a = DB_ASSIGNMENTS.find(item => item.id === id);
    return a ? { ...a } : null;
  },

  async submitAssignment(id: string, fileName: string): Promise<Assignment> {
    await delay(400);
    const a = DB_ASSIGNMENTS.find(item => item.id === id);
    if (!a) throw new Error('Assignment not found');
    a.status = 'Submitted';
    a.submittedAt = new Date().toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    a.submittedFiles = [{ name: fileName, size: '2.1 MB', date: a.submittedAt }];
    a.feedback = 'Submission received. Instructor evaluation pending.';
    return { ...a };
  },

  async getExams(): Promise<Exam[]> {
    await delay(160);
    return [...DB_EXAMS];
  },

  async getExam(id: string): Promise<Exam | null> {
    await delay(180);
    const e = DB_EXAMS.find(item => item.id === id);
    return e ? { ...e } : null;
  },

  async submitExam(
    id: string,
    answers: Record<string, string | number>
  ): Promise<{ score: number; total: number; pendingShortAnswers: boolean }> {
    await delay(450);
    const exam = DB_EXAMS.find(e => e.id === id);
    if (!exam) throw new Error('Exam not found');

    let autoScore = 0;
    let totalMarks = exam.totalMarks || 20;
    let hasShortAnswer = false;

    if (exam.questions) {
      exam.questions.forEach(q => {
        const ans = answers[q.id];
        if (q.type === 'MCQ' || q.type === 'TrueFalse') {
          if (ans !== undefined && Number(ans) === q.correctOptionIndex) {
            autoScore += q.marks;
          }
        } else if (q.type === 'ShortAnswer') {
          hasShortAnswer = true;
        }
      });
    }

    exam.status = hasShortAnswer ? 'Result Pending' : 'Completed';
    exam.score = autoScore;
    exam.hasPendingShortAnswers = hasShortAnswer;

    return {
      score: autoScore,
      total: totalMarks,
      pendingShortAnswers: hasShortAnswer
    };
  },

  async getGrades(): Promise<{
    currentSemesterGpa: number;
    cumulativeGpa: number;
    courses: CourseGrade[];
  }> {
    await delay(200);
    const courseGrades: CourseGrade[] = [
      {
        courseCode: 'CS301',
        courseName: 'Design & Analysis of Algorithms',
        creditHours: 3,
        components: [
          { name: 'Midterm', obtained: 18, max: 20 },
          { name: 'Practical Lab', obtained: 19, max: 20 },
          { name: 'Coursework / Assignments', obtained: 15, max: 15 },
          { name: 'Final Examination', obtained: 42, max: 45 }
        ],
        totalMarks: 94,
        letterGrade: 'A',
        gradePoints: 3.7,
        isPublished: true
      },
      {
        courseCode: 'IS305',
        courseName: 'Database Systems II',
        creditHours: 3,
        components: [
          { name: 'Midterm', obtained: 17, max: 20 },
          { name: 'Practical Lab', obtained: 18, max: 20 },
          { name: 'Coursework', obtained: 14, max: 15 },
          { name: 'Final Exam', obtained: 40, max: 45 }
        ],
        totalMarks: 89,
        letterGrade: 'B+',
        gradePoints: 3.3,
        isPublished: true
      },
      {
        courseCode: 'AI302',
        courseName: 'Machine Learning Fundamentals',
        creditHours: 3,
        components: [
          { name: 'Midterm', obtained: 19, max: 20 },
          { name: 'Practical', obtained: 20, max: 20 },
          { name: 'Coursework', obtained: 10, max: 10 },
          { name: 'Final Exam', obtained: 46, max: 50 }
        ],
        totalMarks: 95,
        letterGrade: 'A+',
        gradePoints: 4.0,
        isPublished: true
      }
    ];

    return {
      currentSemesterGpa: 3.65,
      cumulativeGpa: 3.42,
      courses: courseGrades
    };
  },

  async getFees(): Promise<{
    unpaidTotal: number;
    paidTotal: number;
    currentSemesterTotal: number;
    fees: StudentFee[];
  }> {
    await delay(180);
    const unpaidTotal = DB_STUDENT_FEES.filter(f => f.status === 'Unpaid').reduce((s, f) => s + f.finalAmount, 0);
    const paidTotal = DB_STUDENT_FEES.filter(f => f.status === 'Paid').reduce((s, f) => s + f.finalAmount, 0);
    return {
      unpaidTotal,
      paidTotal,
      currentSemesterTotal: 7650,
      fees: [...DB_STUDENT_FEES]
    };
  },

  async payFeeFawry(feeId: string): Promise<{ success: boolean; transactionRef: string; paymentDate: string }> {
    await delay(800); // simulate payment gateway roundtrip
    const fee = DB_STUDENT_FEES.find(f => f.id === feeId);
    if (!fee) throw new Error('Fee record not found');
    const transactionRef = `FWY-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const paymentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    fee.status = 'Paid';
    fee.paymentDate = paymentDate;
    fee.transactionRef = transactionRef;
    fee.provider = 'Fawry Electronic Payment';

    return {
      success: true,
      transactionRef,
      paymentDate
    };
  },

  async getReceipt(feeId: string): Promise<Receipt> {
    await delay(180);
    const fee = DB_STUDENT_FEES.find(f => f.id === feeId) || DB_STUDENT_FEES[1];
    return {
      receiptNumber: `REC-BSU-2026-${fee.id.toUpperCase()}`,
      issueDate: fee.paymentDate || 'Oct 14, 2026',
      amount: fee.finalAmount,
      currency: 'EGP',
      feeType: fee.feeType,
      paymentDate: fee.paymentDate || 'Oct 14, 2026',
      paymentStatus: 'Official Paid & Reconciled',
      studentName: DB_USERS.student.name,
      studentCode: DB_USERS.student.studentCode!,
      nationalId: DB_USERS.student.nationalId!,
      department: DB_USERS.student.department!,
      paymentMethod: fee.provider || 'Fawry Verified Gateway'
    };
  },

  async getServiceRequests(): Promise<ServiceRequest[]> {
    await delay(170);
    return [...DB_SERVICE_REQUESTS];
  },

  async createServiceRequest(req: {
    type: ServiceRequest['type'];
    department: string;
    subject: string;
    description: string;
    otherDescription?: string;
    attachmentName?: string;
  }): Promise<ServiceRequest> {
    await delay(320);
    const newReq: ServiceRequest = {
      id: `REQ-${Math.floor(24100 + Math.random() * 900)}`,
      type: req.type,
      department: req.department,
      subject: req.subject,
      description: req.description,
      otherDescription: req.otherDescription,
      attachmentName: req.attachmentName,
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending',
      studentName: DB_USERS.student.name,
      studentCode: DB_USERS.student.studentCode
    };
    DB_SERVICE_REQUESTS.unshift(newReq);
    return newReq;
  },

  async cancelServiceRequest(id: string): Promise<boolean> {
    await delay(200);
    const req = DB_SERVICE_REQUESTS.find(r => r.id === id);
    if (req && req.status === 'Pending') {
      req.status = 'Cancelled';
      return true;
    }
    return false;
  },

  async getStudyDocuments(): Promise<StudyDocument[]> {
    await delay(160);
    return [...DB_STUDY_DOCUMENTS];
  },

  async uploadStudyPdf(title: string, size: string): Promise<StudyDocument> {
    await delay(400);
    const newDoc: StudyDocument = {
      id: `doc-${Date.now()}`,
      title,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      fileSize: size,
      pageCount: Math.floor(15 + Math.random() * 35),
      summary: 'Uploaded course material PDF for private AI study tutoring.'
    };
    DB_STUDY_DOCUMENTS.unshift(newDoc);
    DB_PDF_CHATS[newDoc.id] = [];
    return newDoc;
  },

  async getPdfChat(docId: string): Promise<ChatMessage[]> {
    await delay(120);
    return DB_PDF_CHATS[docId] || [];
  },

  async sendPdfChatMessage(docId: string, text: string): Promise<ChatMessage> {
    await delay(480);
    const qLower = text.toLowerCase();
    let replyText = '';
    let citation: string | undefined = 'Page 6, Section 2';

    if (qLower.includes('summarize')) {
      replyText = 'Based on the uploaded document, this chapter introduces dynamic programming by contrasting it with divide-and-conquer. It details how storing intermediate solutions in a memoization table avoids exponential tree expansions, proving runtime speedups on both Knapsack and shortest path graphs.';
      citation = 'Pages 1–12 (Executive Summary)';
    } else if (qLower.includes('knapsack') || qLower.includes('algorithm')) {
      replyText = 'According to Theorem 3.1 in the uploaded PDF, the 0/1 Knapsack recurrence is given by:\n`dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt[i-1]] + val[i-1])` for `w >= wt[i-1]`. The document notes this produces pseudo-polynomial time complexity O(n·W).';
      citation = 'Page 14, Theorem 3.1';
    } else if (qLower.includes('question') || qLower.includes('exam')) {
      replyText = 'Expected questions drawn directly from this document:\n1. Prove why greedy choice fails for 0/1 Knapsack but succeeds for Fractional Knapsack (Page 18).\n2. Write the bottom-up table construction for Matrix Chain Multiplication with dimension array p = [10, 20, 30, 40] (Page 24).';
      citation = 'Page 36, Review Exercises';
    } else {
      replyText = "I couldn't find this information in the uploaded document. As the FCAI Study Assistant, I am strictly constrained to answer queries using the uploaded document's contents only.";
      citation = undefined;
    }

    const aiMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citation
    };

    if (!DB_PDF_CHATS[docId]) DB_PDF_CHATS[docId] = [];
    DB_PDF_CHATS[docId].push({
      id: `std_${Date.now() - 1}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    DB_PDF_CHATS[docId].push(aiMessage);

    return aiMessage;
  },

  // ---- Doctor / Instructor Portal ----
  async getDoctorDashboard() {
    await delay(190);
    return {
      doctor: DB_USERS.doctor,
      kpis: {
        offeringsCount: 4,
        studentsCount: 180,
        pendingSubmissions: 23,
        averageAttendance: 82,
        upcomingExams: 2
      },
      pendingGradingQueue: [
        { course: 'CS301 · Algorithms', examTitle: 'Midterm Assessment', pendingCount: 37, totalCount: 64, progress: 42 }
      ],
      gradeWorkflowPackages: DB_GRADE_PACKAGES
    };
  },

  async getDoctorOfferings(): Promise<Course[]> {
    await delay(160);
    return DB_COURSES.filter(c => c.doctor.includes('Mona'));
  },

  async getDoctorCourseDetail(courseCode: string) {
    await delay(200);
    const course = DB_COURSES.find(c => c.code === courseCode) || DB_COURSES[0];
    return {
      course,
      sections: [
        { name: 'Section S1', ta: 'Eng. Youssef Khaled', studentsCount: 22, room: 'Lab 3-West', schedule: 'Tue 12:00–14:00' },
        { name: 'Section S2', ta: 'Eng. Nour Hesham', studentsCount: 21, room: 'Lab 2-East', schedule: 'Wed 10:00–12:00' },
        { name: 'Section S3', ta: 'Eng. Youssef Khaled', studentsCount: 21, room: 'Lab 3-West', schedule: 'Thu 14:00–16:00' }
      ],
      students: [
        { code: '2021170045', name: 'Ahmed Mohamed Hassan', section: 'S3', att: 92, status: 'Active', grade: '94 / 100' },
        { code: '2021170112', name: 'Mariam Ahmed Saeed', section: 'S1', att: 96, status: 'Active', grade: '98 / 100' },
        { code: '2022170033', name: 'Omar Khaled Fathy', section: 'S2', att: 74, status: 'Active', grade: '72 / 100' }
      ]
    };
  },

  async getDoctorLectureSession(courseCode: string) {
    await delay(180);
    const course = DB_COURSES.find(c => c.code === courseCode) || DB_COURSES[0];
    return {
      course,
      sessionDate: 'Today, Oct 14, 2026',
      scheduledTime: '10:00 – 12:00',
      room: 'Hall A-101',
      presentCount: 54,
      absentCount: 10,
      totalCount: 64,
      liveCheckIns: [
        { name: 'Ahmed Mohamed Hassan', code: '2021170045', time: '10:04 AM' },
        { name: 'Mariam Ahmed Saeed', code: '2021170112', time: '10:05 AM' },
        { name: 'Omar Khaled Fathy', code: '2022170033', time: '10:08 AM' }
      ],
      roster: [
        { code: '2021170045', name: 'Ahmed Mohamed Hassan', status: 'Present', time: '10:04 AM', method: 'QR Mobile' },
        { code: '2021170112', name: 'Mariam Ahmed Saeed', status: 'Present', time: '10:05 AM', method: 'QR Mobile' },
        { code: '2022170033', name: 'Omar Khaled Fathy', status: 'Late', time: '10:22 AM', method: 'Manual' },
        { code: '2021170078', name: 'Hana Mostafa Kamal', status: 'Absent', time: '—', method: '—' }
      ]
    };
  },

  async updateRosterAttendance(studentCode: string, newStatus: 'Present' | 'Absent' | 'Late' | 'Excused'): Promise<boolean> {
    await delay(120);
    return true;
  },

  async getDoctorSubmissions() {
    await delay(170);
    return [
      { id: 'sub1', studentCode: '2021170045', studentName: 'Ahmed Mohamed Hassan', assignment: 'Assignment 3: Dynamic Programming', file: 'ahmed_hassan_algo_ass3.zip', date: 'Oct 08, 09:14 PM', grade: 15, maxGrade: 15, status: 'Graded', feedback: 'Excellent memoized implementations.' },
      { id: 'sub2', studentCode: '2021170112', studentName: 'Mariam Ahmed Saeed', assignment: 'Assignment 3: Dynamic Programming', file: 'mariam_saeed_ass3.zip', date: 'Oct 09, 02:45 PM', grade: null, maxGrade: 15, status: 'Pending Review', feedback: '' },
      { id: 'sub3', studentCode: '2022170033', studentName: 'Omar Khaled Fathy', assignment: 'Assignment 3: Dynamic Programming', file: 'omar_fathy_solution.pdf', date: 'Oct 09, 08:10 PM', grade: null, maxGrade: 15, status: 'Pending Review', feedback: '' }
    ];
  },

  async gradeSubmission(subId: string, marks: number, feedback: string): Promise<boolean> {
    await delay(250);
    return true;
  },

  async getDoctorGradebook(courseCode: string) {
    await delay(190);
    return {
      courseCode,
      courseName: 'Design & Analysis of Algorithms',
      components: [
        { name: 'Midterm', max: 20 },
        { name: 'Practical', max: 20 },
        { name: 'Coursework', max: 15 },
        { name: 'Final', max: 45 }
      ],
      students: [
        { code: '2021170045', name: 'Ahmed Mohamed Hassan', attendancePercent: 96, midterm: 18, practical: 19, coursework: 15, final: 42, total: 94, letter: 'A' },
        { code: '2021170112', name: 'Mariam Ahmed Saeed', attendancePercent: 100, midterm: 19, practical: 20, coursework: 15, final: 44, total: 98, letter: 'A+' },
        { code: '2022170033', name: 'Omar Khaled Fathy', attendancePercent: 88, midterm: 14, practical: 15, coursework: 12, final: 32, total: 73, letter: 'C+' }
      ]
    };
  },

  async submitCourseOfferingGrades(courseCode: string): Promise<GradePackage> {
    await delay(350);
    let pkg = DB_GRADE_PACKAGES.find(p => p.courseCode === courseCode);
    if (!pkg) {
      pkg = {
        id: `gp_${Date.now()}`,
        courseCode,
        courseName: 'Design & Analysis of Algorithms',
        leadDoctor: 'Dr. Mona Abdelrahman',
        enrolledStudents: 64,
        submissionTime: new Date().toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'Doctor Submitted',
        averageGrade: '88.4% (A-)',
        failuresCount: 1
      };
      DB_GRADE_PACKAGES.push(pkg);
    } else {
      pkg.status = 'Doctor Submitted';
      pkg.submissionTime = new Date().toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
    return { ...pkg };
  },

  async getDoctorQuestionBanks() {
    await delay(180);
    return [
      { id: 'qb1', name: 'Algorithms Bank 2026', courseCode: 'CS301', questionCount: 45, activeCount: 42, usedInExam: true },
      { id: 'qb2', name: 'Data Structures Core Bank', courseCode: 'CS204', questionCount: 60, activeCount: 60, usedInExam: true },
      { id: 'qb3', name: 'Graph Theory & Network Flows', courseCode: 'CS301', questionCount: 25, activeCount: 25, usedInExam: false }
    ];
  },

  async gradeShortAnswer(examId: string, studentCode: string, marks: number, feedback: string) {
    await delay(300);
    return { success: true, marks, feedback };
  },

  // ---- Teaching Assistant Portal ----
  async getTaDashboard() {
    await delay(170);
    return {
      ta: DB_USERS.ta,
      kpis: {
        assignedSections: 3,
        todaySessions: 2,
        pendingSubmissions: 14,
        gradesToEnter: 8
      },
      todaySessions: [
        { courseCode: 'CS301', section: 'Section S3', time: '12:00 – 14:00', room: 'Lab 3-West' },
        { courseCode: 'CS305', section: 'Section S3', time: '14:00 – 16:00', room: 'Lab 2-East' }
      ]
    };
  },

  async getTaAssignedSections() {
    await delay(150);
    return [
      { id: 'sec1', courseCode: 'CS301', courseName: 'Design & Analysis of Algorithms', sectionName: 'Section S3', enrolled: 21, room: 'Lab 3-West', schedule: 'Tue 12:00–14:00' },
      { id: 'sec2', courseCode: 'CS305', courseName: 'Operating Systems Internals', sectionName: 'Section S3', enrolled: 21, room: 'Lab 2-East', schedule: 'Wed 14:00–16:00' },
      { id: 'sec3', courseCode: 'CS301', courseName: 'Design & Analysis of Algorithms', sectionName: 'Section S1', enrolled: 22, room: 'Lab 3-West', schedule: 'Thu 14:00–16:00' }
    ];
  },

  // ---- College Admin Portal ----
  async getAdminDashboard() {
    await delay(200);
    return {
      kpis: {
        studentsCount: 1540,
        facultyCount: 120, // 48 Doctors, 72 TAs
        offeringsCount: 95,
        todayAttendance: 91,
        openServiceRequests: 34,
        unpaidFeesCount: 412
      },
      enrollmentByLevel: [
        { label: 'Level 1 (Freshman)', count: 460 },
        { label: 'Level 2 (Sophomore)', count: 410 },
        { label: 'Level 3 (Junior)', count: 380 },
        { label: 'Level 4 (Senior)', count: 290 }
      ],
      attendanceTrend: [
        { week: 'Week 1', lectures: 94, labs: 88 },
        { week: 'Week 2', lectures: 92, labs: 86 },
        { week: 'Week 3', lectures: 89, labs: 85 },
        { week: 'Week 4', lectures: 91, labs: 87 }
      ],
      pendingGradePackages: DB_GRADE_PACKAGES.filter(p => p.status === 'Doctor Submitted')
    };
  },

  async getAdminStudents(query?: string) {
    await delay(180);
    const sampleStudents = [
      { code: '2021170045', name: 'Ahmed Mohamed Hassan', nationalId: '30302152201234', department: 'Computer Science', level: 'Level 3', status: 'Active', gpa: 3.42, accountStatus: 'Active' },
      { code: '2021170112', name: 'Mariam Ahmed Saeed', nationalId: '30301102203311', department: 'Artificial Intelligence', level: 'Level 3', status: 'Active', gpa: 3.81, accountStatus: 'Active' },
      { code: '2022170033', name: 'Omar Khaled Fathy', nationalId: '30405052204517', department: 'Information Systems', level: 'Level 2', status: 'Active', gpa: 2.95, accountStatus: 'Active' },
      { code: '2020170219', name: 'Nourhan Tarek Ali', nationalId: '30208212201876', department: 'Information Technology', level: 'Level 4', status: 'On Leave', gpa: 3.10, accountStatus: 'Active' },
      { code: '2023170501', name: 'Youssef Ibrahim Nabil', nationalId: '30509012205542', department: 'Computer Science', level: 'Level 1', status: 'Active', gpa: 3.55, accountStatus: 'Active' },
      { code: '2021170078', name: 'Hana Mostafa Kamal', nationalId: '30303182209981', department: 'Computer Science', level: 'Level 3', status: 'Suspended', gpa: 1.84, accountStatus: 'Deactivated' }
    ];
    if (!query) return sampleStudents;
    const q = query.toLowerCase();
    return sampleStudents.filter(s => s.name.toLowerCase().includes(q) || s.code.includes(q) || s.department.toLowerCase().includes(q));
  },

  async updateStudentAccountStatus(code: string, newStatus: string) {
    await delay(220);
    return { success: true, code, status: newStatus };
  },

  async getAdminDepartments(): Promise<Department[]> {
    await delay(160);
    return [...DB_DEPARTMENTS];
  },

  async getAdminRooms(): Promise<Room[]> {
    await delay(160);
    return [...DB_ROOMS];
  },

  async getAdminGradePackages(): Promise<GradePackage[]> {
    await delay(180);
    return [...DB_GRADE_PACKAGES];
  },

  async approveGradePackage(courseCode: string): Promise<GradePackage> {
    await delay(320);
    const pkg = DB_GRADE_PACKAGES.find(p => p.courseCode === courseCode);
    if (!pkg) throw new Error('Package not found');
    pkg.status = 'Published';
    return { ...pkg };
  },

  async rejectGradePackage(courseCode: string, auditReason: string): Promise<GradePackage> {
    await delay(320);
    const pkg = DB_GRADE_PACKAGES.find(p => p.courseCode === courseCode);
    if (!pkg) throw new Error('Package not found');
    pkg.status = 'Draft';
    pkg.auditNotes = `Returned to Draft: ${auditReason}`;
    return { ...pkg };
  },

  async getAdminGradeScale(): Promise<GradeScaleRow[]> {
    await delay(140);
    return [...DB_GRADE_SCALE];
  },

  async getAdminServiceRequests(): Promise<ServiceRequest[]> {
    await delay(170);
    return [...DB_SERVICE_REQUESTS];
  },

  async processAdminServiceRequest(
    id: string,
    action: 'In Progress' | 'Resolved' | 'Rejected' | 'Cancelled',
    notes?: string
  ): Promise<ServiceRequest> {
    await delay(300);
    const req = DB_SERVICE_REQUESTS.find(r => r.id === id);
    if (!req) throw new Error('Request not found');
    req.status = action;
    if (action === 'Resolved') {
      req.resolvedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      req.resolutionNotes = notes || 'Fulfilled and signed by the College Administration.';
    } else if (action === 'Rejected') {
      req.rejectionReason = notes || 'Documentation incomplete.';
    }
    return { ...req };
  },

  async generateStudentFees(year: string, term: string, level: string): Promise<{ affectedStudents: number; generatedCount: number; skippedCount: number }> {
    await delay(600); // simulate batch job
    return {
      affectedStudents: 380,
      generatedCount: 380,
      skippedCount: 14 // idempotent: already generated
    };
  },

  // ---- Employee Portal ----
  async getEmployeeDashboard() {
    await delay(180);
    return {
      employee: DB_USERS.employee,
      department: 'Student Affairs',
      permissions: ['ServiceRequests.View', 'ServiceRequests.Process', 'ServiceRequests.Reject', 'Students.ViewBasic'],
      kpis: {
        pendingInQueue: 12,
        inProgress: 6,
        resolvedThisWeek: 34,
        deptStaffCount: 8
      },
      queue: DB_SERVICE_REQUESTS
    };
  },

  async getDoctorReports(courseCode: string = 'CS301') {
    await delay(190);
    return {
      courseCode,
      courseName: 'Design & Analysis of Algorithms',
      totalEnrolled: 64,
      attendanceRate: 88.5,
      averageGrade: 83.2,
      passedCount: 61,
      failedCount: 3,
      gradeDistribution: [
        { letter: 'A+', count: 8, pct: 12.5 },
        { letter: 'A', count: 14, pct: 21.9 },
        { letter: 'B+', count: 18, pct: 28.1 },
        { letter: 'B', count: 12, pct: 18.8 },
        { letter: 'C+', count: 6, pct: 9.4 },
        { letter: 'C', count: 3, pct: 4.7 },
        { letter: 'F', count: 3, pct: 4.7 }
      ],
      attendanceByWeek: [
        { week: 'W1', present: 62, absent: 2 },
        { week: 'W2', present: 60, absent: 4 },
        { week: 'W3', present: 58, absent: 6 },
        { week: 'W4', present: 57, absent: 7 },
        { week: 'W5', present: 59, absent: 5 },
        { week: 'W6', present: 55, absent: 9 }
      ]
    };
  },

  async getTaSectionAttendance(sectionId: string = 'sec1') {
    await delay(160);
    return {
      sectionId,
      sectionName: 'Section S3 · Design & Analysis of Algorithms',
      room: 'Lab 3-West',
      schedule: 'Tue 12:00 – 14:00',
      totalEnrolled: 21,
      presentCount: 19,
      absentCount: 2,
      roster: [
        { code: '2021170045', name: 'Ahmed Mohamed Hassan', status: 'Present', time: '12:04 PM', method: 'QR Check-in' },
        { code: '2021170112', name: 'Mariam Ahmed Saeed', status: 'Present', time: '12:06 PM', method: 'QR Check-in' },
        { code: '2022170033', name: 'Omar Khaled Fathy', status: 'Late', time: '12:28 PM', method: 'Manual Entry' },
        { code: '2021170078', name: 'Hana Mostafa Kamal', status: 'Absent', time: '—', method: '—' },
        { code: '2023170501', name: 'Youssef Ibrahim Nabil', status: 'Present', time: '12:02 PM', method: 'QR Check-in' }
      ]
    };
  },

  async getTaSectionSubmissions(sectionId: string = 'sec1') {
    await delay(160);
    return [
      { id: 'sub_ta_01', studentCode: '2021170045', studentName: 'Ahmed Mohamed Hassan', task: 'Lab Exercise 4: Graphs DFS/BFS', submittedDate: 'Oct 11, 2026', grade: 10, maxGrade: 10, status: 'Graded', notes: 'Well organized code and tests.' },
      { id: 'sub_ta_02', studentCode: '2021170112', studentName: 'Mariam Ahmed Saeed', task: 'Lab Exercise 4: Graphs DFS/BFS', submittedDate: 'Oct 12, 2026', grade: null, maxGrade: 10, status: 'Pending', notes: '' },
      { id: 'sub_ta_03', studentCode: '2022170033', studentName: 'Omar Khaled Fathy', task: 'Lab Exercise 4: Graphs DFS/BFS', submittedDate: 'Oct 12, 2026', grade: null, maxGrade: 10, status: 'Pending', notes: '' }
    ];
  },

  async saveTaSectionGrade(subId: string, grade: number, notes?: string): Promise<boolean> {
    await delay(200);
    return true;
  },

  async getAdminFaculty() {
    await delay(180);
    return [
      { id: 'fac1', name: 'Dr. Mona Abdelrahman', role: 'Doctor / Instructor', title: 'Associate Professor', department: 'Computer Science', email: 'mona.abdelrahman@fcai.bsu.edu.eg', phone: '+20 111 888 4422', status: 'Active', offeringsCount: 4 },
      { id: 'fac2', name: 'Dr. Samy Mahmoud', role: 'Doctor / Instructor', title: 'Full Professor & Dept Chair', department: 'Information Systems', email: 'samy.mahmoud@fcai.bsu.edu.eg', phone: '+20 100 222 3344', status: 'Active', offeringsCount: 3 },
      { id: 'fac3', name: 'Dr. Rania Ezzat', role: 'Doctor / Instructor', title: 'Assistant Professor', department: 'Artificial Intelligence', email: 'rania.ezzat@fcai.bsu.edu.eg', phone: '+20 120 444 5566', status: 'Active', offeringsCount: 3 },
      { id: 'fac4', name: 'Eng. Youssef Khaled', role: 'Teaching Assistant', title: 'Lead TA', department: 'Computer Science', email: 'youssef.khaled@fcai.bsu.edu.eg', phone: '+20 122 777 9911', status: 'Active', offeringsCount: 3 },
      { id: 'fac5', name: 'Eng. Nour Hesham', role: 'Teaching Assistant', title: 'TA', department: 'Computer Science', email: 'nour.hesham@fcai.bsu.edu.eg', phone: '+20 114 999 0011', status: 'Active', offeringsCount: 2 },
      { id: 'fac6', name: 'Salma Ibrahim', role: 'Employee', title: 'Senior Affairs Officer', department: 'Student Affairs', email: 'salma.ibrahim@fcai.bsu.edu.eg', phone: '+20 106 333 7744', status: 'Active', offeringsCount: 0 }
    ];
  },

  async getAdminCourses() {
    await delay(180);
    return [
      { code: 'CS101', name: 'Introduction to Computer Science', department: 'Computer Science', creditHours: 3, level: 'Level 1', prerequisites: [], elective: false },
      { code: 'CS102', name: 'Structured Programming', department: 'Computer Science', creditHours: 3, level: 'Level 1', prerequisites: ['CS101'], elective: false },
      { code: 'CS204', name: 'Data Structures', department: 'Computer Science', creditHours: 3, level: 'Level 2', prerequisites: ['CS102'], elective: false },
      { code: 'CS301', name: 'Design & Analysis of Algorithms', department: 'Computer Science', creditHours: 3, level: 'Level 3', prerequisites: ['CS204'], elective: false },
      { code: 'CS305', name: 'Operating Systems Internals', department: 'Computer Science', creditHours: 3, level: 'Level 3', prerequisites: ['CS204'], elective: false },
      { code: 'AI302', name: 'Machine Learning Fundamentals', department: 'Artificial Intelligence', creditHours: 3, level: 'Level 3', prerequisites: ['CS204'], elective: false },
      { code: 'IS305', name: 'Database Systems II', department: 'Information Systems', creditHours: 3, level: 'Level 3', prerequisites: ['CS102'], elective: false },
      { code: 'IT303', name: 'Computer Networks & Security', department: 'Information Technology', creditHours: 3, level: 'Level 3', prerequisites: ['CS204'], elective: false }
    ];
  },

  async getAdminCourseOfferings() {
    await delay(180);
    return [
      { code: 'CS301', name: 'Design & Analysis of Algorithms', term: 'Fall 2026', doctor: 'Dr. Mona Abdelrahman', enrolled: 64, capacity: 80, sectionsCount: 3, status: 'Open', schedule: 'Sun 10:00–12:00 (Hall A-101)' },
      { code: 'IS305', name: 'Database Systems II', term: 'Fall 2026', doctor: 'Dr. Samy Mahmoud', enrolled: 58, capacity: 70, sectionsCount: 3, status: 'Open', schedule: 'Mon 08:00–10:00 (Hall B-202)' },
      { code: 'AI302', name: 'Machine Learning Fundamentals', term: 'Fall 2026', doctor: 'Dr. Rania Ezzat', enrolled: 62, capacity: 65, sectionsCount: 3, status: 'Open', schedule: 'Tue 10:00–12:00 (Hall A-101)' },
      { code: 'CS305', name: 'Operating Systems Internals', term: 'Fall 2026', doctor: 'Dr. Mona Abdelrahman', enrolled: 60, capacity: 70, sectionsCount: 3, status: 'Open', schedule: 'Wed 12:00–14:00 (Hall C-303)' }
    ];
  },

  async getAdminAcademicStructure() {
    await delay(150);
    return {
      currentYear: '2026/2027',
      currentSemester: 'Fall Semester',
      semesters: [
        { name: 'Fall 2026', startDate: '2026-10-01', endDate: '2027-01-20', status: 'Active (Ongoing)' },
        { name: 'Spring 2027', startDate: '2027-02-15', endDate: '2027-06-10', status: 'Upcoming' },
        { name: 'Summer 2027', startDate: '2027-07-01', endDate: '2027-08-25', status: 'Planned' }
      ],
      levels: [
        { level: 'Level 1 (Freshman)', minCredits: 0, maxCredits: 33, totalStudents: 460 },
        { level: 'Level 2 (Sophomore)', minCredits: 34, maxCredits: 67, totalStudents: 410 },
        { level: 'Level 3 (Junior)', minCredits: 68, maxCredits: 101, totalStudents: 380 },
        { level: 'Level 4 (Senior)', minCredits: 102, maxCredits: 136, totalStudents: 290 }
      ],
      creditRules: {
        normalMinCredits: 12,
        normalMaxCredits: 18,
        honorMaxCredits: 21,
        probationMaxCredits: 12,
        minGpaHonor: 3.0,
        probationGpaThreshold: 2.0
      }
    };
  },

  async getAdminFeesOverview() {
    await delay(180);
    return {
      totalInvoiced: 4850000,
      totalCollected: 3820000,
      unpaidBalance: 1030000,
      collectionRate: 78.8,
      definitions: [
        { id: 'fd_tuition', name: 'Standard Academic Tuition', amount: 6500, term: 'Fall 2026', appliesTo: 'All Levels' },
        { id: 'fd_tech', name: 'Technology & AI Labs Fee', amount: 800, term: 'Fall 2026', appliesTo: 'All Levels' },
        { id: 'fd_union', name: 'Student Union & Activities', amount: 350, term: 'Fall 2026', appliesTo: 'All Levels' },
        { id: 'fd_medical', name: 'Institutional Medical Insurance', amount: 500, term: 'Annual 2026/27', appliesTo: 'Level 1 only' }
      ],
      recentTransactions: [
        { ref: 'FWY-98214412', student: 'Ahmed Mohamed Hassan', code: '2021170045', amount: 7650, date: 'Oct 08, 2026', provider: 'Fawry Verified', status: 'Reconciled' },
        { ref: 'FWY-74829103', student: 'Mariam Ahmed Saeed', code: '2021170112', amount: 7650, date: 'Oct 09, 2026', provider: 'Fawry Verified', status: 'Reconciled' },
        { ref: 'FWY-66381902', student: 'Youssef Ibrahim Nabil', code: '2023170501', amount: 8150, date: 'Oct 11, 2026', provider: 'Fawry Verified', status: 'Reconciled' }
      ]
    };
  },

  async getAdminRegulations() {
    await delay(160);
    return [
      { id: 'reg1', title: 'Faculty Bylaws: Credit Hour Regulations', version: 'v3.2', effectiveYear: '2024–Present', status: 'Active (Primary)', pages: 58, description: 'Formal regulations governing course registration, prerequisites, graduation criteria, GPA calculation, and probation.' },
      { id: 'reg2', title: '75% Compulsory Attendance Policy & Deprivation Rules', version: 'v2.1', effectiveYear: '2023–Present', status: 'Active', pages: 12, description: 'Statutory regulation mandating that students who miss >= 25% of sessions without dean-approved excuse receive an Fw (Deprived from Exam).' },
      { id: 'reg3', title: 'Examination & Grading Standard Operating Procedures', version: 'v4.0', effectiveYear: '2025–Present', status: 'Active', pages: 34, description: 'Rules governing midterm assessments, practical exams, double-blind final exam grading, and committee approvals.' },
      { id: 'reg4', title: 'Tuition Fees and Refund Policy', version: 'v1.5', effectiveYear: '2022–Present', status: 'Active', pages: 16, description: 'Rules on institutional payment schedules, Fawry reconciliation, installment criteria, and drop-refund schedules.' }
    ];
  },

  async getAdminReportsData() {
    await delay(220);
    return {
      facultySummary: {
        totalStudents: 1540,
        activeRate: 98.2,
        averageFacultyGpa: 3.18,
        averageAttendanceFacultyWide: 89.4,
        graduatedLastCohort: 278
      },
      departmentComparison: [
        { dept: 'Computer Science', students: 580, avgGpa: 3.25, attRate: 91.2 },
        { dept: 'Artificial Intelligence', students: 420, avgGpa: 3.32, attRate: 92.5 },
        { dept: 'Information Systems', students: 310, avgGpa: 3.08, attRate: 86.8 },
        { dept: 'Information Technology', students: 230, avgGpa: 3.12, attRate: 88.0 }
      ],
      honorRollCount: 312,
      academicProbationCount: 42
    };
  },

  // ---- Notifications ----
  async getNotifications(): Promise<NotificationItem[]> {
    await delay(140);
    return [...DB_NOTIFICATIONS];
  },

  async markNotificationRead(id: string): Promise<boolean> {
    await delay(100);
    const n = DB_NOTIFICATIONS.find(item => item.id === id);
    if (n) n.unread = false;
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    await delay(150);
    DB_NOTIFICATIONS.forEach(n => { n.unread = false; });
    return true;
  },

  // ---- Screen 5: Account & Credentials ----
  async getAccountSecurity() {
    await delay(140);
    return {
      identifier: 'ahmed.hassan@fcai.bsu.edu.eg',
      username: '2021170045',
      nationalId: '30302152201234',
      status: 'Active (Verified Institutional)',
      lastPasswordChange: '2026-09-15',
      twoFactorStatus: 'Enforced by Faculty Policy (App Session)',
      activeSessions: [
        { device: 'Chrome / Windows 11 (Current)', ip: '192.168.1.45', lastActive: 'Just now' },
        { device: 'Safari / iOS Mobile', ip: '10.20.4.112', lastActive: '2 hours ago' }
      ]
    };
  },

  async changeAccountPassword(oldPw: string, newPw: string) {
    await delay(280);
    return { success: true, message: 'Password updated successfully' };
  },

  // ---- Screens 6 & 7: Account Management & Creation ----
  async getUserAccounts(filter?: string) {
    await delay(160);
    const users = [
      { id: 'usr_01', code: '2021170045', name: 'Ahmed Mohamed Hassan', role: 'Student', email: 'ahmed.hassan@fcai.bsu.edu.eg', status: 'Active', department: 'Computer Science', lastLogin: 'Today, 10:14 AM' },
      { id: 'usr_02', code: '2021170112', name: 'Mariam Ahmed Saeed', role: 'Student', email: 'mariam.saeed@fcai.bsu.edu.eg', status: 'Active', department: 'Artificial Intelligence', lastLogin: 'Today, 09:30 AM' },
      { id: 'usr_03', code: 'DOC-102', name: 'Dr. Mona Abdelrahman', role: 'Doctor / Instructor', email: 'mona.abdelrahman@fcai.bsu.edu.eg', status: 'Active', department: 'Computer Science', lastLogin: 'Today, 11:00 AM' },
      { id: 'usr_04', code: 'TA-204', name: 'Eng. Youssef Khaled', role: 'Teaching Assistant', email: 'youssef.khaled@fcai.bsu.edu.eg', status: 'Active', department: 'Computer Science', lastLogin: 'Yesterday, 04:12 PM' },
      { id: 'usr_05', code: 'EMP-301', name: 'Salma Ibrahim', role: 'Employee', email: 'salma.ibrahim@fcai.bsu.edu.eg', status: 'Active', department: 'Student Affairs', lastLogin: 'Today, 08:00 AM' },
      { id: 'usr_06', code: 'ADM-001', name: 'Tarek Fathy', role: 'College Admin', email: 'tarek.fathy@fcai.bsu.edu.eg', status: 'Active', department: 'Dean Office', lastLogin: 'Today, 07:45 AM' },
      { id: 'usr_07', code: '2021170078', name: 'Hana Mostafa Kamal', role: 'Student', email: 'hana.mostafa@fcai.bsu.edu.eg', status: 'Deactivated', department: 'Computer Science', lastLogin: 'Oct 02, 2026' }
    ];
    if (!filter) return users;
    const q = filter.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(q) || u.code.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  },

  async createStudentAccount(data: any) {
    await delay(320);
    return { success: true, studentCode: `2026${Math.floor(100000 + Math.random() * 900000)}`, tempPassword: 'Bsu@' + Math.floor(1000 + Math.random() * 9000) };
  },

  // ---- Screen 14: Course Details ----
  async getCourseDetails(code: string) {
    await delay(160);
    const course = DB_COURSES.find(c => c.code === code) || DB_COURSES[0];
    return {
      ...course,
      syllabus: [
        { week: 'Week 1', topic: 'Algorithm Complexity, Asymptotic Notation & Big-O' },
        { week: 'Week 2', topic: 'Divide and Conquer: Karatsuba & Strassen' },
        { week: 'Week 3-4', topic: 'Dynamic Programming: Memoization & Tabulation' },
        { week: 'Week 5', topic: '0/1 Knapsack & Matrix Chain Multiplication' },
        { week: 'Week 6-7', topic: 'Greedy Algorithms: Huffman Codes & Matroids' },
        { week: 'Week 8', topic: 'Midterm Examination' },
        { week: 'Week 9-11', topic: 'Graph Theory: Shortest Paths & Max Flow' },
        { week: 'Week 12', topic: 'NP-Completeness & Approximation' }
      ],
      sections: [
        { name: 'Section S1', ta: 'Eng. Youssef Khaled', room: 'Lab 3-West', time: 'Sun 12:00–14:00', seats: '22 / 25' },
        { name: 'Section S2', ta: 'Eng. Nour Hesham', room: 'Lab 2-East', time: 'Mon 10:00–12:00', seats: '21 / 25' },
        { name: 'Section S3', ta: 'Eng. Youssef Khaled', room: 'Lab 3-West', time: 'Tue 12:00–14:00', seats: '21 / 25' }
      ]
    };
  },

  // ---- Screen 18: Assignment Details & Submission ----
  async getAssignmentDetails(id: string) {
    await delay(150);
    return {
      id,
      courseCode: 'CS301',
      courseName: 'Design & Analysis of Algorithms',
      title: 'Assignment 3: Dynamic Programming Implementations',
      dueDate: 'Oct 20, 2026 · 11:59 PM',
      maxGrade: 15,
      weight: '15% of Coursework',
      instructions: 'Implement both memoized (top-down) and bottom-up solutions for the 0/1 Knapsack Problem and Matrix Chain Multiplication in Python or C++. Provide runtime benchmark graphs and test scripts.',
      attachedTemplate: 'assignment_3_skeleton_v2.zip',
      previousSubmission: {
        file: 'ahmed_hassan_algo_ass3.zip',
        submittedAt: 'Oct 14, 2026 · 04:30 PM',
        fileSize: '2.4 MB',
        grade: null,
        feedback: null
      }
    };
  },

  // ---- Screen 19: Learning Materials ----
  async getLearningMaterials(courseCode: string = 'CS301') {
    await delay(160);
    return [
      { id: 'm1', course: 'CS301', week: 'Week 1', title: 'Lecture 1: Asymptotic Analysis & Recurrences', file: 'CS301_Lecture_01_Slides.pdf', size: '3.8 MB', uploadDate: 'Oct 01, 2026' },
      { id: 'm2', course: 'CS301', week: 'Week 2', title: 'Lecture 2: Divide and Conquer Algorithms', file: 'CS301_Lecture_02_Divide_Conquer.pdf', size: '4.2 MB', uploadDate: 'Oct 08, 2026' },
      { id: 'm3', course: 'CS301', week: 'Week 3', title: 'Lecture 3: Dynamic Programming Fundamentals', file: 'CS301_Lecture_03_Dynamic_Programming.pdf', size: '5.1 MB', uploadDate: 'Oct 12, 2026' },
      { id: 'm4', course: 'CS301', week: 'Week 4', title: 'Lab 4 Manual: Graph Algorithms in C++', file: 'Lab_04_Graphs_Manual.pdf', size: '1.9 MB', uploadDate: 'Oct 13, 2026' }
    ];
  },

  // ---- Screen 22: Exam Result ----
  async getExamResult(examId: string) {
    await delay(180);
    return {
      examId,
      examTitle: 'Algorithms Midterm Assessment',
      courseCode: 'CS301',
      submittedAt: 'Oct 14, 2026 · 11:42 AM',
      status: 'Result Published',
      autoScore: 14,
      autoMax: 15,
      shortAnswerScore: 4,
      shortAnswerMax: 5,
      totalScore: 18,
      maxScore: 20,
      percentage: '90.0%',
      feedback: 'Excellent work on memoization proofs. Counterexample was completely accurate.'
    };
  },

  // ---- Screen 26: GPA History ----
  async getStudentGpaHistory() {
    await delay(150);
    return {
      cumulativeGpa: 3.42,
      totalCredits: 74,
      totalPoints: 253.08,
      semesters: [
        { term: 'Fall 2024 (Level 1)', gpa: 3.30, credits: 18, points: 59.4, retakenCourses: 0 },
        { term: 'Spring 2025 (Level 1)', gpa: 3.45, credits: 18, points: 62.1, retakenCourses: 0 },
        { term: 'Fall 2025 (Level 2)', gpa: 3.50, credits: 19, points: 66.5, retakenCourses: 0 },
        { term: 'Spring 2026 (Level 2)', gpa: 3.44, credits: 19, points: 65.36, retakenCourses: 0 },
        { term: 'Fall 2026 (Level 3 - Current)', gpa: 3.65, credits: 18, points: 65.7, retakenCourses: 0, status: 'In Progress' }
      ]
    };
  },

  // ---- Screen 36: University Documents ----
  async getUniversityDocuments() {
    await delay(160);
    return [
      { id: 'ud1', title: 'Official Enrollment Certificate (Arabic)', issueDate: 'Oct 02, 2026', status: 'Certified & Signed', type: 'Enrollment', file: 'bsu_enrollment_cert_2026.pdf' },
      { id: 'ud2', title: 'Official Academic Transcript (English)', issueDate: 'Sep 28, 2026', status: 'Certified & Signed', type: 'Transcript', file: 'bsu_transcript_74cr_signed.pdf' },
      { id: 'ud3', title: 'Military Service Proof Letter', issueDate: 'Aug 15, 2026', status: 'Issued', type: 'Military', file: 'bsu_military_postponement.pdf' }
    ];
  },

  // ---- Screens 37 & 38: Messages & Conversations ----
  async getConversations() {
    await delay(150);
    return [
      { id: 'c1', name: 'Dr. Mona Abdelrahman', role: 'Doctor · Algorithms', lastMessage: 'Office hours tomorrow are moved to 1:00 PM in Room B-314.', time: '11:20 AM', unread: true },
      { id: 'c2', name: 'Eng. Youssef Khaled', role: 'TA · Section S3', lastMessage: 'Your Lab 4 submission has been reviewed and graded.', time: 'Yesterday', unread: false },
      { id: 'c3', name: 'Student Affairs Office', role: 'Administration', lastMessage: 'Your official transcript is ready for collection at the counter.', time: 'Oct 11', unread: false }
    ];
  },

  async getMessages(convId: string) {
    await delay(120);
    return [
      { id: 'm1', sender: 'them', text: 'Hello Ahmed, regarding your question on Knapsack problem memoization.', time: '10:30 AM' },
      { id: 'm2', sender: 'me', text: 'Yes Dr. Mona, should we handle negative values as edge cases?', time: '10:32 AM' },
      { id: 'm3', sender: 'them', text: 'In standard 0/1 Knapsack weights and values are positive integers, but you can throw an exception for negatives.', time: '10:35 AM' },
      { id: 'm4', sender: 'them', text: 'Office hours tomorrow are moved to 1:00 PM in Room B-314.', time: '11:20 AM' }
    ];
  },

  async sendMessage(convId: string, text: string) {
    await delay(200);
    return { id: `m_${Date.now()}`, sender: 'me', text, time: 'Just now' };
  },

  // ---- Screens 65 & 66: Announcements & Instructor Schedule ----
  async getInstructorAnnouncements() {
    await delay(140);
    return [
      { id: 'an1', course: 'CS301 · Algorithms', title: 'Midterm Exam Venue Announcement', text: 'The midterm assessment will be held in Hall A-101 and Hall B-202 on Sunday Oct 25 at 10:00 AM. Please bring your national ID.', date: 'Today, 10:00 AM' },
      { id: 'an2', course: 'CS305 · Operating Systems', title: 'Assignment 2 Due Date Extension', text: 'Deadline extended by 48 hours until Wednesday Oct 21.', date: 'Oct 12, 2026' }
    ];
  },

  async getInstructorSchedule() {
    await delay(150);
    return [
      { day: 'Sunday', time: '10:00 – 12:00', course: 'CS301 · Algorithms', room: 'Hall A-101', type: 'Lecture' },
      { day: 'Tuesday', time: '10:00 – 12:00', course: 'AI302 · Machine Learning', room: 'Hall A-101', type: 'Lecture' },
      { day: 'Wednesday', time: '12:00 – 14:00', course: 'CS305 · Operating Systems', room: 'Hall C-303', type: 'Lecture' }
    ];
  },

  // ---- Screens 102-106: SuperAdmin & System Configuration ----
  async getSuperAdminRoles() {
    await delay(160);
    return [
      { id: 'r_std', name: 'Student', count: 1540, desc: 'Learners enrolled in faculty credit hour degree programs', perms: 18 },
      { id: 'r_doc', name: 'Doctor / Instructor', count: 48, desc: 'Tenured faculty and course professors', perms: 32 },
      { id: 'r_ta', name: 'Teaching Assistant', count: 72, desc: 'Lab instructors and practical graders', perms: 22 },
      { id: 'r_adm', name: 'College Admin', count: 12, desc: 'Faculty executive governance and Dean office', perms: 64 },
      { id: 'r_emp', name: 'Employee', count: 28, desc: 'Student Affairs, Youth Care, and administrative officers', perms: 15 },
      { id: 'r_sadm', name: 'SuperAdmin', count: 3, desc: 'System administrators and DevOps controllers', perms: 106 }
    ];
  },

  async getSuperAdminSystemConfig() {
    await delay(150);
    return {
      facultyName: 'Faculty of Computers & Artificial Intelligence',
      university: 'Beni Suef University',
      currentYear: '2026/2027',
      currentSemester: 'Fall 2026',
      maintenanceMode: false,
      allowRegistration: true,
      attendanceQrRefreshIntervalSeconds: 5,
      geofenceThresholdMeters: 50,
      autoDropRefundDays: 14,
      aiTutorPdfSizeLimitMb: 10
    };
  },

  async saveSuperAdminSystemConfig(cfg: any) {
    await delay(250);
    return { success: true, cfg };
  },

  async getSuperAdminSecurityConfig() {
    await delay(150);
    return {
      minPasswordLength: 8,
      requireSpecialChar: true,
      requireNumbers: true,
      maxFailedAttempts: 5,
      sessionTimeoutMinutes: 120,
      allowConcurrentLogins: false,
      enforcePasswordRotationDays: 90
    };
  },

  async getSuperAdminIntegrations() {
    await delay(160);
    return [
      { id: 'int_fawry', name: 'Fawry Electronic Payment Gateway', status: 'Connected', endpoint: 'https://api.fawry.com/payments/v2', latency: '42ms', lastSync: '2 mins ago' },
      { id: 'int_bsu_sis', name: 'BSU Central SIS Student Sync', status: 'Connected', endpoint: 'https://sis.bsu.edu.eg/api/v1/fcai', latency: '65ms', lastSync: '10 mins ago' },
      { id: 'int_gemini', name: 'AI Tutor & RAG Embeddings Service', status: 'Connected', endpoint: 'https://generativelanguage.googleapis.com', latency: '120ms', lastSync: 'Real-time' },
      { id: 'int_sms', name: 'Institutional SMS / WhatsApp Gateway', status: 'Connected', endpoint: 'https://gateway.smsmisr.com/api', latency: '88ms', lastSync: '1 hour ago' }
    ];
  },

  async getSuperAdminAuditLogs(query?: string) {
    await delay(180);
    const logs = [
      { id: 'lg_101', timestamp: '2026-10-14 11:45:12', actor: 'Tarek Fathy (Admin)', action: 'GRADE_PACKAGE_APPROVE', resource: 'Course CS301 (Algorithms)', result: 'SUCCESS', ip: '192.168.1.10' },
      { id: 'lg_102', timestamp: '2026-10-14 11:20:05', actor: 'Dr. Mona Abdelrahman', action: 'GRADE_PACKAGE_SUBMIT', resource: 'Course CS301 (Algorithms)', result: 'SUCCESS', ip: '192.168.1.54' },
      { id: 'lg_103', timestamp: '2026-10-14 10:48:30', actor: 'Ahmed Mohamed Hassan', action: 'FAWRY_PAYMENT_VERIFIED', resource: 'Fee REC-BSU-2026-F1 (7650 EGP)', result: 'SUCCESS', ip: '197.35.12.98' },
      { id: 'lg_104', timestamp: '2026-10-14 10:04:15', actor: 'Ahmed Mohamed Hassan', action: 'QR_ATTENDANCE_CHECKIN', resource: 'Lecture CS301 (Hall A-101)', result: 'SUCCESS', ip: '10.20.4.112' },
      { id: 'lg_105', timestamp: '2026-10-14 09:15:22', actor: 'Salma Ibrahim (Employee)', action: 'SERVICE_REQUEST_RESOLVED', resource: 'Request REQ-24101 (Transcript)', result: 'SUCCESS', ip: '192.168.1.88' },
      { id: 'lg_106', timestamp: '2026-10-14 08:30:00', actor: 'System Scheduler', action: 'IDEMPOTENT_FEE_BILLING', resource: '380 Student Accounts', result: 'SUCCESS', ip: '127.0.0.1' }
    ];
    if (!query) return logs;
    const q = query.toLowerCase();
    return logs.filter(l => l.actor.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q));
  }
};
