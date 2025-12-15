export const mockUsers = {
  completedTeacher: {
    id: "1",
    email: "teacher@gurucool.com",
    password: "Teacher123",
    name: "John Doe",
    role: "teacher" as const,
    status: "approved" as const,
    profileCompleted: true,
    firstTimeuser: true,
    avatar: "/avatars/teacher.jpg",
    createdAt: "2024-01-01",
    country: "India",
    phone: "+91 98765 43210",
    schoolName: "Delhi Public School",
    gender: "Male",
  },

  // Teacher with incomplete profile
  incompleteTeacher: {
    id: "2",
    email: "newteacher@gurucool.com",
    password: "Teacher123",
    name: "Jane Smith",
    role: "teacher" as const,
    status: "approved" as const,
    profileCompleted: false,
    avatar: "/avatars/teacher2.jpg",
    createdAt: "2024-01-15",
  },

  // School Admin with completed profile
  completedSchoolAdmin: {
    id: "3",
    email: "admin@school.com",
    password: "Admin123",
    name: "Robert Johnson",
    role: "school_admin" as const,
    status: "approved" as const,
    profileCompleted: true,
    avatar: "/avatars/admin.jpg",
    createdAt: "2024-01-01",
  },

  // School Admin with incomplete profile
  incompleteSchoolAdmin: {
    id: "4",
    email: "newadmin@school.com",
    password: "Admin123",
    name: "Sarah Williams",
    role: "school_admin" as const,
    status: "approved" as const,
    profileCompleted: false,
    avatar: "/avatars/admin2.jpg",
    createdAt: "2024-01-15",
  },

  // School Admin pending approval
  pendingSchoolAdmin: {
    id: "5",
    email: "pending@school.com",
    password: "Admin123",
    name: "Michael Brown",
    role: "school_admin" as const,
    status: "pending" as const,
    profileCompleted: true,
    avatar: "/avatars/admin3.jpg",
    createdAt: "2024-01-20",
  },
  completedSchoolAdminRejected: {
    id: "3",
    email: "admit@school.com",
    password: "Admin123",
    name: "Robert Johnson",
    role: "school_admin" as const,
    status: "rejected" as const,
    profileCompleted: true,
    avatar: "/avatars/admin.jpg",
    createdAt: "2024-01-01",
  },
  completedAdmin: {
    id: "6",
    email: "admin@gurucool.com",
    password: "Admin123",
    name: "Robert Johnson",
    role: "admin" as const,
    status: "approved" as const,
    profileCompleted: true,
    avatar: "/avatars/admin.jpg",
    createdAt: "2024-01-01",
  },
};

export type MockUser = typeof mockUsers.completedTeacher;

// Helper function to find user by credentials
export const findUserByCredentials = (email: string, password: string) => {
  return Object.values(mockUsers).find(
    (user) => user.email === email && user.password === password
  );
};

export type TeacherStatus = "active" | "suspended";

export interface TeacherCertificate {
  id: string;
  name: string;
  fileName: string;
  uploadDate: string;
  type: "optional" | "earned";
}

export interface TeacherBadge {
  id: string;
  name: string;
  description: string;
  earnedDate: string;
  imageUrl: string;
}

export interface TeacherAssessment {
  id: string;
  title: string;
  status: "completed" | "in_progress";
  score: number;
  attempts: number;
  lastAttempt: string;
}

// Badge Approval Types
export type BadgeApprovalStatus = "pending" | "approved" | "rejected";

export interface BadgeSubmissionAnswer {
  questionId: string;
  questionText: string;
  questionType: "mcq" | "short_answer" | "audio" | "video";

  // For MCQ
  selectedOption?: string;
  correctOption?: string;
  isCorrect?: boolean;

  // For Short Answer
  answerText?: string;
  aiScore?: number;
  aiEvaluation?: string;

  // For Audio
  audioUrl?: string;
  audioTranscript?: string;
  audioDuration?: number;
  audioScore?: number;
  audioEvaluation?: string;

  // For Video
  videoUrl?: string;
  videoSummary?: string;
  videoDuration?: number;
  videoScore?: number;
  videoEvaluation?: string;
}

export interface BadgeApproval {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhoto?: string;

  pdTitle: string;
  pdId: string;
  assessmentDate: string;
  submittedAt: string;

  badgeName: string;
  badgeDescription: string;
  badgeCriteria: string;

  scores: {
    mcq: number;
    shortAnswer: number;
    audio: number;
    video: number;
    overall: number;
  };

  answers: BadgeSubmissionAnswer[];

  status: BadgeApprovalStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  adminComment?: string;
}

export interface TeacherDirectoryEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profilePhoto?: string;
  status: TeacherStatus;
  country: string;
  countryId: string;
  gender: string;
  schoolId: string;
  teachingExperience: string;
  gradeLevels: string[];
  subjects: string[];
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced";
  currentSchool: string;
  joinDate: string;
  totalPdCompleted: number;
  totalBadgesEarned: number;
  pdHours: number;
  latestPd?: string;
  lastActive: string;
  emailVerified: boolean;
  suspensionNote?: string;
  certificates: TeacherCertificate[];
  badges: TeacherBadge[];
  assessments: TeacherAssessment[];
  // Add this if you want to track approval status:
  approvalStatus?: "approved" | "pending" | "rejected";
}

const defaultCertificates: TeacherCertificate[] = [
  {
    id: "cert-001",
    name: "B.Ed Certificate",
    fileName: "bed_certificate.pdf",
    uploadDate: "2024-03-20",
    type: "optional",
  },
  {
    id: "cert-002",
    name: "CTET Qualified",
    fileName: "ctet_certificate.pdf",
    uploadDate: "2024-03-20",
    type: "optional",
  },
];

const defaultBadges: TeacherBadge[] = [
  {
    id: "badge-001",
    name: "Classroom Management Expert",
    description: "Mastered classroom management fundamentals",
    earnedDate: "2024-10-12",
    imageUrl: "/badges/classroom-management.png",
  },
  {
    id: "badge-002",
    name: "Tech-Savvy Educator",
    description: "Demonstrated technology integration skills",
    earnedDate: "2024-09-28",
    imageUrl: "/badges/tech-educator.png",
  },
];

const defaultAssessments: TeacherAssessment[] = [
  {
    id: "pd-001",
    title: "Inclusive Classrooms",
    status: "completed",
    score: 88,
    attempts: 1,
    lastAttempt: "2024-10-04",
  },
  {
    id: "pd-002",
    title: "AI Collaboration Essentials",
    status: "completed",
    score: 91,
    attempts: 1,
    lastAttempt: "2024-11-01",
  },
];

export const teacherDirectory: TeacherDirectoryEntry[] = [
  // 5 approved teachers
  {
    id: "teacher-001",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@school.edu",
    phone: "+91 98765 43210",
    address: "123, Green Park, New Delhi, 110016",
    profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg",
    status: "active",
    approvalStatus: "approved",
    subjects: ["Mathematics", "Physics"],
    proficiencyLevel: "Advanced",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2024-03-15",
    totalPdCompleted: 14,
    totalBadgesEarned: 9,
    pdHours: 62,
    latestPd: "AI Collaboration",
    lastActive: "Today",
    emailVerified: true,
    certificates: [
      ...defaultCertificates,
      {
        id: "cert-003",
        name: "Classroom Management Expert",
        fileName: "classroom_mgmt_cert.pdf",
        uploadDate: "2024-11-25",
        type: "earned",
      },
      {
        id: "cert-004",
        name: "Differentiated Learning Champion",
        fileName: "diff_learning_cert.pdf",
        uploadDate: "2024-11-24",
        type: "earned",
      },
    ],
    badges: [
      ...defaultBadges,
      {
        id: "badge-003",
        name: "Inclusion Advocate",
        description: "Excellence in inclusive education practices",
        earnedDate: "2024-11-20",
        imageUrl: "/badges/inclusion-advocate.png",
      },
    ],
    assessments: [
      ...defaultAssessments,
      {
        id: "pd-003",
        title: "Differentiated Instruction",
        status: "completed",
        score: 94,
        attempts: 1,
        lastAttempt: "2024-11-18",
      },
    ],
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "8 years",
    gradeLevels: ["9", "10", "11", "12"],
  },
  {
    id: "teacher-002",
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun.mehta@school.edu",
    phone: "+91 98234 11223",
    address: "45, Punjabi Bagh, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "active",
    approvalStatus: "approved",
    subjects: ["Chemistry", "Biology"],
    proficiencyLevel: "Advanced",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2023-07-11",
    totalPdCompleted: 11,
    totalBadgesEarned: 7,
    pdHours: 54,
    latestPd: "STEM Innovation",
    lastActive: "2h ago",
    emailVerified: true,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Male",
    schoolId: "school-001",
    teachingExperience: "6 years",
    gradeLevels: ["11", "12"],
  },
  {
    id: "teacher-003",
    firstName: "Meera",
    lastName: "Kapoor",
    email: "meera.kapoor@school.edu",
    phone: "+91 98111 54789",
    address: "19, Kailash Colony, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/women/3.jpg",
    status: "active",
    approvalStatus: "approved",
    subjects: ["English", "Drama"],
    proficiencyLevel: "Advanced",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2022-01-09",
    totalPdCompleted: 9,
    totalBadgesEarned: 5,
    pdHours: 41,
    latestPd: "Assessment Design",
    lastActive: "Yesterday",
    emailVerified: true,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "10 years",
    gradeLevels: ["9", "10"],
  },
  {
    id: "teacher-004",
    firstName: "Dev",
    lastName: "Rao",
    email: "dev.rao@school.edu",
    phone: "+91 98456 12098",
    address: "10, Vasant Kunj, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "active",
    approvalStatus: "approved",
    subjects: ["Computer Science"],
    proficiencyLevel: "Intermediate",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2024-01-12",
    totalPdCompleted: 6,
    totalBadgesEarned: 4,
    pdHours: 29,
    latestPd: "AI Literacy",
    lastActive: "Today",
    emailVerified: true,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Male",
    schoolId: "school-001",
    teachingExperience: "4 years",
    gradeLevels: ["11", "12"],
  },
  {
    id: "teacher-005",
    firstName: "Saanvi",
    lastName: "Iyer",
    email: "saanvi.iyer@school.edu",
    phone: "+91 99771 55660",
    address: "56, Defence Colony, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/women/5.jpg",
    status: "active",
    approvalStatus: "approved",
    subjects: ["History", "Civics"],
    proficiencyLevel: "Intermediate",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2023-02-21",
    totalPdCompleted: 8,
    totalBadgesEarned: 6,
    pdHours: 36,
    latestPd: "Heritage Storytelling",
    lastActive: "3h ago",
    emailVerified: true,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "5 years",
    gradeLevels: ["9", "10"],
  },

  // 5 pending teachers
  {
    id: "teacher-006",
    firstName: "Kabir",
    lastName: "Singh",
    email: "kabir.singh@school.edu",
    phone: "+91 98989 22211",
    address: "89, Rohini Sector 8, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/men/6.jpg",
    status: "active",
    approvalStatus: "pending",
    subjects: ["Economics"],
    proficiencyLevel: "Intermediate",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2024-05-18",
    totalPdCompleted: 4,
    totalBadgesEarned: 3,
    pdHours: 18,
    latestPd: "Financial Literacy",
    lastActive: "4d ago",
    emailVerified: false,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Male",
    schoolId: "school-001",
    teachingExperience: "3 years",
    gradeLevels: ["11", "12"],
  },
  {
    id: "teacher-007",
    firstName: "Anika",
    lastName: "Roy",
    email: "anika.roy@school.edu",
    phone: "+91 98123 77890",
    address: "78, Greater Kailash, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/women/7.jpg",
    status: "active",
    approvalStatus: "pending",
    subjects: ["Art", "Design"],
    proficiencyLevel: "Advanced",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2021-11-03",
    totalPdCompleted: 12,
    totalBadgesEarned: 8,
    pdHours: 58,
    latestPd: "Creative Studios",
    lastActive: "Today",
    emailVerified: true,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "7 years",
    gradeLevels: ["9", "10", "11", "12"],
  },
  {
    id: "teacher-008",
    firstName: "Raghav",
    lastName: "Nair",
    email: "raghav.nair@school.edu",
    phone: "+91 99333 70012",
    address: "22, Model Town, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/men/8.jpg",
    status: "active",
    approvalStatus: "pending",
    subjects: ["Geography", "Environmental Science"],
    proficiencyLevel: "Advanced",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2020-08-29",
    totalPdCompleted: 15,
    totalBadgesEarned: 10,
    pdHours: 64,
    latestPd: "Climate Action Labs",
    lastActive: "Today",
    emailVerified: true,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Male",
    schoolId: "school-001",
    teachingExperience: "9 years",
    gradeLevels: ["11", "12"],
  },
  {
    id: "teacher-009",
    firstName: "Simran",
    lastName: "Kaur",
    email: "simran.kaur@school.edu",
    phone: "+91 98765 12345",
    address: "101, Hauz Khas, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/women/9.jpg",
    status: "active",
    approvalStatus: "pending",
    subjects: ["Political Science"],
    proficiencyLevel: "Intermediate",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2022-09-10",
    totalPdCompleted: 5,
    totalBadgesEarned: 2,
    pdHours: 20,
    latestPd: "Civic Engagement",
    lastActive: "Yesterday",
    emailVerified: false,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "2 years",
    gradeLevels: ["11", "12"],
  },
  {
    id: "teacher-010",
    firstName: "Rahul",
    lastName: "Verma",
    email: "rahul.verma@school.edu",
    phone: "+91 98888 77665",
    address: "55, Janakpuri, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/men/10.jpg",
    status: "active",
    approvalStatus: "pending",
    subjects: ["Business Studies"],
    proficiencyLevel: "Beginner",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2023-03-05",
    totalPdCompleted: 3,
    totalBadgesEarned: 1,
    pdHours: 12,
    latestPd: "Entrepreneurship Basics",
    lastActive: "Today",
    emailVerified: false,
    certificates: defaultCertificates,
    badges: defaultBadges,
    assessments: defaultAssessments,
    country: "India",
    countryId: "IN",
    gender: "Male",
    schoolId: "school-001",
    teachingExperience: "1 year",
    gradeLevels: ["11", "12"],
  },

  // 5 rejected teachers
  {
    id: "teacher-011",
    firstName: "Neha",
    lastName: "Gupta",
    email: "neha.gupta@school.edu",
    phone: "+91 98765 11122",
    address: "12, Lajpat Nagar, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/women/11.jpg",
    status: "suspended",
    approvalStatus: "rejected",
    subjects: ["Psychology"],
    proficiencyLevel: "Intermediate",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2024-02-10",
    totalPdCompleted: 2,
    totalBadgesEarned: 0,
    pdHours: 8,
    latestPd: "SEL Basics",
    lastActive: "2w ago",
    emailVerified: false,
    certificates: [],
    badges: [],
    assessments: [],
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "1 year",
    gradeLevels: ["11", "12"],
    suspensionNote: "Application rejected due to incomplete documents.",
  },
  {
    id: "teacher-012",
    firstName: "Vikram",
    lastName: "Patel",
    email: "vikram.patel@school.edu",
    phone: "+91 98123 44556",
    address: "34, Karol Bagh, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/men/12.jpg",
    status: "suspended",
    approvalStatus: "rejected",
    subjects: ["Accountancy"],
    proficiencyLevel: "Beginner",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2023-12-01",
    totalPdCompleted: 1,
    totalBadgesEarned: 0,
    pdHours: 4,
    latestPd: "Data-Driven Instruction",
    lastActive: "3w ago",
    emailVerified: false,
    certificates: [],
    badges: [],
    assessments: [],
    country: "India",
    countryId: "IN",
    gender: "Male",
    schoolId: "school-001",
    teachingExperience: "1 year",
    gradeLevels: ["11", "12"],
    suspensionNote: "Rejected after background verification.",
  },
  {
    id: "teacher-013",
    firstName: "Ayesha",
    lastName: "Khan",
    email: "ayesha.khan@school.edu",
    phone: "+91 99555 66778",
    address: "88, Saket, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/women/13.jpg",
    status: "suspended",
    approvalStatus: "rejected",
    subjects: ["French"],
    proficiencyLevel: "Intermediate",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2024-04-15",
    totalPdCompleted: 0,
    totalBadgesEarned: 0,
    pdHours: 0,
    latestPd: "",
    lastActive: "1m ago",
    emailVerified: false,
    certificates: [],
    badges: [],
    assessments: [],
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "2 years",
    gradeLevels: ["9", "10"],
    suspensionNote: "Rejected due to invalid qualification.",
  },
  {
    id: "teacher-014",
    firstName: "Ritesh",
    lastName: "Jain",
    email: "ritesh.jain@school.edu",
    phone: "+91 98444 33221",
    address: "77, Pitampura, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/men/14.jpg",
    status: "suspended",
    approvalStatus: "rejected",
    subjects: ["Physical Education"],
    proficiencyLevel: "Beginner",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2022-06-20",
    totalPdCompleted: 0,
    totalBadgesEarned: 0,
    pdHours: 0,
    latestPd: "",
    lastActive: "2m ago",
    emailVerified: false,
    certificates: [],
    badges: [],
    assessments: [],
    country: "India",
    countryId: "IN",
    gender: "Male",
    schoolId: "school-001",
    teachingExperience: "1 year",
    gradeLevels: ["9", "10"],
    suspensionNote: "Rejected due to missing references.",
  },
  {
    id: "teacher-015",
    firstName: "Sunita",
    lastName: "Mishra",
    email: "sunita.mishra@school.edu",
    phone: "+91 99321 55678",
    address: "101, Dwarka, New Delhi",
    profilePhoto: "https://randomuser.me/api/portraits/women/15.jpg",
    status: "suspended",
    approvalStatus: "rejected",
    subjects: ["Music"],
    proficiencyLevel: "Intermediate",
    currentSchool: "Delhi Public School, RK Puram",
    joinDate: "2023-10-05",
    totalPdCompleted: 0,
    totalBadgesEarned: 0,
    pdHours: 0,
    latestPd: "",
    lastActive: "1m ago",
    emailVerified: false,
    certificates: [],
    badges: [],
    assessments: [],
    country: "India",
    countryId: "IN",
    gender: "Female",
    schoolId: "school-001",
    teachingExperience: "2 years",
    gradeLevels: ["9", "10"],
    suspensionNote: "Application rejected after interview.",
  },
];

export const teacherDirectoryMap = teacherDirectory.reduce((acc, teacher) => {
  acc[teacher.id] = teacher;
  return acc;
}, {} as Record<string, TeacherDirectoryEntry>);

// Mock Badge Approvals
export const badgeApprovals: BadgeApproval[] = [
  {
    id: "badge-approval-001",
    teacherId: "teacher-001",
    teacherName: "Priya Sharma",
    teacherEmail: "priya.sharma@school.edu",
    teacherPhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",

    pdTitle: "Classroom Management Fundamentals",
    pdId: "pd-001",
    assessmentDate: "2024-11-25",
    submittedAt: "2024-11-25T10:30:00Z",

    badgeName: "Classroom Management Expert",
    badgeDescription:
      "Mastered classroom management fundamentals and best practices",
    badgeCriteria:
      "Score 85% or above in all sections with practical application",

    scores: {
      mcq: 92,
      shortAnswer: 88,
      audio: 90,
      video: 87,
      overall: 89,
    },

    answers: [
      {
        questionId: "q1",
        questionText:
          "What is the primary goal of effective classroom management?",
        questionType: "mcq",
        selectedOption: "Creating a positive learning environment",
        correctOption: "Creating a positive learning environment",
        isCorrect: true,
      },
      {
        questionId: "q2",
        questionText:
          "Describe three strategies for managing diverse learning needs.",
        questionType: "short_answer",
        answerText:
          "1. Differentiated instruction tailored to student abilities 2. Flexible grouping strategies 3. Use of technology for personalized learning paths",
        aiScore: 88,
        aiEvaluation:
          "Strong understanding of differentiation strategies. Answer demonstrates practical knowledge.",
      },
      {
        questionId: "q3",
        questionText:
          "Explain how you would handle a disruptive student situation.",
        questionType: "audio",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        audioTranscript:
          "I would first address the behavior privately, understand the root cause, implement positive reinforcement strategies, and communicate with parents if needed.",
        audioDuration: 45,
        audioScore: 90,
        audioEvaluation:
          "Clear articulation of conflict resolution steps. Shows empathy and professional approach.",
      },
      {
        questionId: "q4",
        questionText: "Demonstrate a classroom transition routine.",
        questionType: "video",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        videoSummary:
          "Teacher demonstrated a 5-step transition routine using visual cues, timers, and positive reinforcement.",
        videoDuration: 120,
        videoScore: 87,
        videoEvaluation:
          "Good demonstration of classroom management techniques. Could improve pacing.",
      },
    ],

    status: "pending",
  },
  {
    id: "badge-approval-002",
    teacherId: "teacher-002",
    teacherName: "Arjun Mehta",
    teacherEmail: "arjun.mehta@school.edu",
    teacherPhoto:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",

    pdTitle: "Technology Integration in Teaching",
    pdId: "pd-002",
    assessmentDate: "2024-11-22",
    submittedAt: "2024-11-22T14:20:00Z",

    badgeName: "Tech-Savvy Educator",
    badgeDescription:
      "Demonstrated proficiency in educational technology integration",
    badgeCriteria:
      "Score 80% or above with practical tech integration examples",

    scores: {
      mcq: 95,
      shortAnswer: 91,
      audio: 89,
      video: 93,
      overall: 92,
    },

    answers: [
      {
        questionId: "q1",
        questionText: "Which tool is best for collaborative learning?",
        questionType: "mcq",
        selectedOption: "Google Workspace",
        correctOption: "Google Workspace",
        isCorrect: true,
      },
      {
        questionId: "q2",
        questionText: "How would you integrate AI tools in your lesson plan?",
        questionType: "short_answer",
        answerText:
          "AI tools can enhance personalized learning through adaptive assessments, provide instant feedback, and help create differentiated content for diverse learners.",
        aiScore: 91,
        aiEvaluation:
          "Excellent understanding of AI applications in education with practical examples.",
      },
    ],

    status: "pending",
  },
  {
    id: "badge-approval-003",
    teacherId: "teacher-004",
    teacherName: "Dev Rao",
    teacherEmail: "dev.rao@school.edu",
    teacherPhoto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",

    pdTitle: "Inclusive Education Practices",
    pdId: "pd-003",
    assessmentDate: "2024-11-20",
    submittedAt: "2024-11-20T09:15:00Z",

    badgeName: "Inclusion Advocate",
    badgeDescription: "Excellence in creating inclusive learning environments",
    badgeCriteria:
      "Demonstrate understanding of inclusive practices with 85%+ score",

    scores: {
      mcq: 88,
      shortAnswer: 85,
      audio: 87,
      video: 90,
      overall: 88,
    },

    answers: [
      {
        questionId: "q1",
        questionText: "What does Universal Design for Learning (UDL) mean?",
        questionType: "mcq",
        selectedOption: "Designing lessons accessible to all learners",
        correctOption: "Designing lessons accessible to all learners",
        isCorrect: true,
      },
    ],

    status: "pending",
  },
  {
    id: "badge-approval-004",
    teacherId: "teacher-005",
    teacherName: "Saanvi Iyer",
    teacherEmail: "saanvi.iyer@school.edu",
    teacherPhoto:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",

    pdTitle: "Assessment and Evaluation Strategies",
    pdId: "pd-004",
    assessmentDate: "2024-11-18",
    submittedAt: "2024-11-18T16:45:00Z",

    badgeName: "Assessment Expert",
    badgeDescription: "Mastered modern assessment techniques",
    badgeCriteria: "Score 85%+ with practical assessment examples",

    scores: {
      mcq: 94,
      shortAnswer: 92,
      audio: 91,
      video: 89,
      overall: 92,
    },

    answers: [],

    status: "approved",
    reviewedAt: "2024-11-19T10:00:00Z",
    reviewedBy: "admin-001",
    adminComment: "Excellent demonstration of assessment strategies. Approved.",
  },
  {
    id: "badge-approval-005",
    teacherId: "teacher-007",
    teacherName: "Anika Roy",
    teacherEmail: "anika.roy@school.edu",
    teacherPhoto:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",

    pdTitle: "Student Engagement Techniques",
    pdId: "pd-005",
    assessmentDate: "2024-11-15",
    submittedAt: "2024-11-15T11:30:00Z",

    badgeName: "Engagement Champion",
    badgeDescription: "Demonstrated advanced student engagement methods",
    badgeCriteria: "Score 85%+ with innovative engagement strategies",

    scores: {
      mcq: 78,
      shortAnswer: 75,
      audio: 80,
      video: 76,
      overall: 77,
    },

    answers: [],

    status: "rejected",
    reviewedAt: "2024-11-16T09:00:00Z",
    reviewedBy: "admin-001",
    adminComment:
      "Score below threshold. Please review engagement strategies and reattempt.",
  },
];

// Badge Approvals Map for quick lookup
export const badgeApprovalsMap = badgeApprovals.reduce((acc, approval) => {
  acc[approval.id] = approval;
  return acc;
}, {} as Record<string, BadgeApproval>);

export interface PdReference {
  id: string;
  title: string;
  url?: string;
  type?: "pdf" | "video" | "link" | "slides";
  description?: string;
}

export interface PdItem {
  id: string;
  title: string;
  description: string;
  competency: string; // e.g. "Classroom Management", "Assessment"
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  materials: PdReference[];
  createdAt: string;
  tags?: string[];
}

// PD Assignment types
export type PdAssignmentStatus =
  | "assigned"
  | "completed"
  | "failed"
  | "pending";

export interface PdAssignment {
  id: string;
  pdId: string;
  pdTitle: string;
  assignedToTeacherIds: string[]; // teacher ids
  assignToAllTeachers?: boolean;
  assignedBy?: string; // admin id
  assignedAt: string;
  dueDate?: string;
  status?: PdAssignmentStatus;
  notes?: string;
  notificationSent?: boolean;
}

// Mock PD Catalog
export const pdCatalog: PdItem[] = [
  {
    id: "pd-101",
    title: "Inclusive Classrooms: Strategies & Practices",
    description:
      "Practical strategies to design lessons and classroom environments that support all learners.",
    competency: "Inclusive Education",
    difficulty: "Intermediate",
    durationMinutes: 90,
    materials: [
      {
        id: "pd-101-ref-1",
        title: "Inclusive Practices Guide (PDF)",
        url: "https://example-files.online-convert.com/document/pdf/example.pdf",
        type: "pdf",
        description: "Comprehensive guide covering UDL and differentiation.",
      },
      {
        id: "pd-101-ref-2",
        title: "UDL Overview Video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        type: "video",
        description: "Short explainer on Universal Design for Learning.",
      },
    ],
    createdAt: "2024-03-10",
    tags: ["UDL", "differentiation", "accessibility"],
  },
  {
    id: "pd-102",
    title: "Technology Integration in Teaching",
    description:
      "How to choose and embed digital tools for collaboration, assessment and content creation.",
    competency: "Technology Integration",
    difficulty: "Beginner",
    durationMinutes: 60,
    materials: [
      {
        id: "pd-102-ref-1",
        title: "Google Workspace for Classrooms - Quick Start",
        url: "https://edu.google.com/",
        type: "link",
      },
      {
        id: "pd-102-ref-2",
        title: "Sample Lesson using EdTech (Slides)",
        url: "https://www.example.com/sample-slides",
        type: "slides",
      },
    ],
    createdAt: "2024-05-02",
    tags: ["edtech", "google-workspace"],
  },
  {
    id: "pd-103",
    title: "Assessment & Feedback Strategies",
    description:
      "Designing formative assessments and giving feedback that drives student growth.",
    competency: "Assessment",
    difficulty: "Advanced",
    durationMinutes: 120,
    materials: [
      {
        id: "pd-103-ref-1",
        title: "Formative Assessment Toolkit (PDF)",
        url: "https://example-files.online-convert.com/document/pdf/example.pdf",
        type: "pdf",
      },
    ],
    createdAt: "2024-02-14",
    tags: ["assessment", "feedback"],
  },
  {
    id: "pd-104",
    title: "Classroom Management Essentials",
    description:
      "Core principles and actionable routines for effective classroom management.",
    competency: "Classroom Management",
    difficulty: "Beginner",
    durationMinutes: 75,
    materials: [
      {
        id: "pd-104-ref-1",
        title: "Classroom Management Handbook",
        url: "https://www.example.com/classroom-management.pdf",
        type: "pdf",
        description:
          "Step-by-step guide to classroom routines and expectations.",
      },
      {
        id: "pd-104-ref-2",
        title: "Effective Routines Video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        type: "video",
      },
    ],
    createdAt: "2024-04-01",
    tags: ["management", "routines", "behavior"],
  },
  {
    id: "pd-105",
    title: "Differentiated Instruction Techniques",
    description:
      "Methods to tailor instruction for diverse learners and maximize engagement.",
    competency: "Instructional Strategies",
    difficulty: "Intermediate",
    durationMinutes: 100,
    materials: [
      {
        id: "pd-105-ref-1",
        title: "Differentiation in Practice (PDF)",
        url: "https://www.example.com/differentiation.pdf",
        type: "pdf",
      },
      {
        id: "pd-105-ref-2",
        title: "Case Studies: Differentiated Classrooms",
        url: "https://www.example.com/diff-case-studies",
        type: "link",
      },
    ],
    createdAt: "2024-03-22",
    tags: ["differentiation", "engagement"],
  },
  {
    id: "pd-106",
    title: "Project-Based Learning Foundations",
    description:
      "Explore the fundamentals of project-based learning and how to implement PBL in your classroom.",
    competency: "Active Learning",
    difficulty: "Beginner",
    durationMinutes: 80,
    materials: [
      {
        id: "pd-106-ref-1",
        title: "PBL Starter Guide",
        url: "https://www.example.com/pbl-guide.pdf",
        type: "pdf",
      },
      {
        id: "pd-106-ref-2",
        title: "PBL in Action (Video)",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        type: "video",
      },
    ],
    createdAt: "2024-05-10",
    tags: ["pbl", "active-learning", "projects"],
  },
  {
    id: "pd-107",
    title: "Social-Emotional Learning (SEL) Basics",
    description:
      "Introduction to SEL concepts and classroom strategies for supporting student well-being.",
    competency: "Social-Emotional Learning",
    difficulty: "Beginner",
    durationMinutes: 70,
    materials: [
      {
        id: "pd-107-ref-1",
        title: "SEL Activities Handbook",
        url: "https://www.example.com/sel-activities.pdf",
        type: "pdf",
      },
      {
        id: "pd-107-ref-2",
        title: "SEL Overview Video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        type: "video",
      },
    ],
    createdAt: "2024-04-18",
    tags: ["sel", "well-being", "student-support"],
  },
  {
    id: "pd-108",
    title: "Data-Driven Instruction",
    description:
      "Learn how to use student data to inform instruction and improve learning outcomes.",
    competency: "Data Literacy",
    difficulty: "Advanced",
    durationMinutes: 110,
    materials: [
      {
        id: "pd-108-ref-1",
        title: "Data-Driven Decision Making (PDF)",
        url: "https://www.example.com/data-driven.pdf",
        type: "pdf",
      },
      {
        id: "pd-108-ref-2",
        title: "Analyzing Assessment Data (Slides)",
        url: "https://www.example.com/data-slides",
        type: "slides",
      },
    ],
    createdAt: "2024-05-15",
    tags: ["data", "assessment", "instruction"],
  },
];

// quick lookup map
export const pdCatalogMap = pdCatalog.reduce((acc, pd) => {
  acc[pd.id] = pd;
  return acc;
}, {} as Record<string, PdItem>);

// Mock PD Assignments
export const pdAssignments: PdAssignment[] = [
  {
    id: "assign-001",
    pdId: "pd-102",
    pdTitle: "Technology Integration in Teaching",
    assignedToTeacherIds: ["teacher-001", "teacher-002"],
    assignedBy: "admin-001",
    assignedAt: "2024-11-20T09:00:00Z",
    dueDate: "2024-12-05",
    status: "assigned",
    notificationSent: true,
    notes: "Focus on collaborative tools for next term.",
  },
  {
    id: "assign-002",
    pdId: "pd-101",
    pdTitle: "Inclusive Classrooms: Strategies & Practices",
    assignedToTeacherIds: [], // assigned to all
    assignToAllTeachers: true,
    assignedBy: "admin-001",
    assignedAt: "2024-11-22T14:00:00Z",
    dueDate: "2024-12-20",
    status: "assigned",
    notificationSent: true,
    notes: "Assign to whole staff for school-wide inclusion initiative.",
  },
  {
    id: "assign-003",
    pdId: "pd-103",
    pdTitle: "Assessment & Feedback Strategies",
    assignedToTeacherIds: ["teacher-005"],
    assignedBy: "admin-002",
    assignedAt: "2024-11-18T16:30:00Z",
    dueDate: "2024-12-01",
    status: "pending",
    notificationSent: false,
    notes: "Pilot group assignment.",
  },
];

// helper: create mock assignment (updates in-memory array)
export const createPdAssignmentMock = (params: {
  pdId: string;
  teacherIds?: string[];
  assignToAll?: boolean;
  assignedBy?: string;
  dueDate?: string;
  notes?: string;
}): PdAssignment => {
  const id = `assign-${Math.random().toString(36).slice(2, 9)}`;
  const pd = pdCatalogMap[params.pdId];
  const entry: PdAssignment = {
    id,
    pdId: params.pdId,
    pdTitle: pd ? pd.title : params.pdId,
    assignedToTeacherIds: params.teacherIds ?? [],
    assignToAllTeachers: params.assignToAll,
    assignedBy: params.assignedBy ?? "admin-001",
    assignedAt: new Date().toISOString(),
    dueDate: params.dueDate,
    status: "assigned",
    notificationSent: false,
    notes: params.notes,
  };
  pdAssignments.push(entry);
  return entry;
};

// helper: mock school data
export interface SchoolInfo {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  principalName: string;
  totalTeachers: number;
  logo?: string;
  totalStudents: number;
}

export const mockSchool: SchoolInfo = {
  id: "school-001",
  name: "Delhi Public School, RK Puram",
  address: "Sector 12, RK Puram, New Delhi, 110022",
  contactEmail: "contact@dpsrkpuram.edu.in",
  contactPhone: "+91 11 2614 1234",
  establishedYear: 1972,
  principalName: "Dr. Anjali Verma",
  logo: "/logos/dpsrkpuram.png",
  totalTeachers: 150,
  totalStudents: 2500,
};

export interface Country {
  id: string; // ISO 3166-1 alpha-2 code
  label: string;
  flag: string;
}

export const countries: Country[] = [
  { id: "IN", label: "India", flag: "🇮🇳" },
  { id: "US", label: "United States", flag: "🇺🇸" },
  { id: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { id: "CA", label: "Canada", flag: "🇨🇦" },
  { id: "AU", label: "Australia", flag: "🇦🇺" },
  { id: "AF", label: "Afghanistan", flag: "🇦🇫" },
  { id: "AL", label: "Albania", flag: "🇦🇱" },
  { id: "DZ", label: "Algeria", flag: "🇩🇿" },
  { id: "AD", label: "Andorra", flag: "🇦🇩" },
  { id: "AO", label: "Angola", flag: "🇦🇴" },
  { id: "AG", label: "Antigua and Barbuda", flag: "🇦🇬" },
  { id: "AR", label: "Argentina", flag: "🇦🇷" },
  { id: "AM", label: "Armenia", flag: "🇦🇲" },
  { id: "AT", label: "Austria", flag: "🇦🇹" },
  { id: "AZ", label: "Azerbaijan", flag: "🇦🇿" },
  { id: "BS", label: "Bahamas", flag: "🇧🇸" },
  { id: "BH", label: "Bahrain", flag: "🇧🇭" },
  { id: "BD", label: "Bangladesh", flag: "🇧🇩" },
  { id: "BB", label: "Barbados", flag: "🇧🇧" },
  { id: "BY", label: "Belarus", flag: "🇧🇾" },
  { id: "BE", label: "Belgium", flag: "🇧🇪" },
  { id: "BZ", label: "Belize", flag: "🇧🇿" },
  { id: "BJ", label: "Benin", flag: "🇧🇯" },
  { id: "BT", label: "Bhutan", flag: "🇧🇹" },
  { id: "BO", label: "Bolivia", flag: "🇧🇴" },
  { id: "BA", label: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { id: "BW", label: "Botswana", flag: "🇧🇼" },
  { id: "BR", label: "Brazil", flag: "🇧🇷" },
  { id: "BN", label: "Brunei", flag: "🇧🇳" },
  { id: "BG", label: "Bulgaria", flag: "🇧🇬" },
  { id: "BF", label: "Burkina Faso", flag: "🇧🇫" },
  { id: "BI", label: "Burundi", flag: "🇧🇮" },
  { id: "KH", label: "Cambodia", flag: "🇰🇭" },
  { id: "CM", label: "Cameroon", flag: "🇨🇲" },
  { id: "CV", label: "Cape Verde", flag: "🇨🇻" },
  { id: "CF", label: "Central African Republic", flag: "🇨🇫" },
  { id: "TD", label: "Chad", flag: "🇹🇩" },
  { id: "CL", label: "Chile", flag: "🇨🇱" },
  { id: "CN", label: "China", flag: "🇨🇳" },
  { id: "CO", label: "Colombia", flag: "🇨🇴" },
  { id: "KM", label: "Comoros", flag: "🇰🇲" },
  { id: "CG", label: "Congo", flag: "🇨🇬" },
  { id: "CD", label: "Congo (DRC)", flag: "🇨🇩" },
  { id: "CR", label: "Costa Rica", flag: "🇨🇷" },
  { id: "CI", label: "Côte d’Ivoire", flag: "🇨🇮" },
  { id: "HR", label: "Croatia", flag: "🇭🇷" },
  { id: "CU", label: "Cuba", flag: "🇨🇺" },
  { id: "CY", label: "Cyprus", flag: "🇨🇾" },
  { id: "CZ", label: "Czechia", flag: "🇨🇿" },
  { id: "DK", label: "Denmark", flag: "🇩🇰" },
  { id: "DJ", label: "Djibouti", flag: "🇩🇯" },
  { id: "DM", label: "Dominica", flag: "🇩🇲" },
  { id: "DO", label: "Dominican Republic", flag: "🇩🇴" },
  { id: "EC", label: "Ecuador", flag: "🇪🇨" },
  { id: "EG", label: "Egypt", flag: "🇪🇬" },
  { id: "SV", label: "El Salvador", flag: "🇸🇻" },
  { id: "GQ", label: "Equatorial Guinea", flag: "🇬🇶" },
  { id: "ER", label: "Eritrea", flag: "🇪🇷" },
  { id: "EE", label: "Estonia", flag: "🇪🇪" },
  { id: "SZ", label: "Eswatini", flag: "🇸🇿" },
  { id: "ET", label: "Ethiopia", flag: "🇪🇹" },
  { id: "FJ", label: "Fiji", flag: "🇫🇯" },
  { id: "FI", label: "Finland", flag: "🇫🇮" },
  { id: "FR", label: "France", flag: "🇫🇷" },
  { id: "GA", label: "Gabon", flag: "🇬🇦" },
  { id: "GM", label: "Gambia", flag: "🇬🇲" },
  { id: "GE", label: "Georgia", flag: "🇬🇪" },
  { id: "DE", label: "Germany", flag: "🇩🇪" },
  { id: "GH", label: "Ghana", flag: "🇬🇭" },
  { id: "GR", label: "Greece", flag: "🇬🇷" },
  { id: "GD", label: "Grenada", flag: "🇬🇩" },
  { id: "GT", label: "Guatemala", flag: "🇬🇹" },
  { id: "GN", label: "Guinea", flag: "🇬🇳" },
  { id: "GW", label: "Guinea-Bissau", flag: "🇬🇼" },
  { id: "GY", label: "Guyana", flag: "🇬🇾" },
  { id: "HT", label: "Haiti", flag: "🇭🇹" },
  { id: "HN", label: "Honduras", flag: "🇭🇳" },
  { id: "HU", label: "Hungary", flag: "🇭🇺" },
  { id: "IS", label: "Iceland", flag: "🇮🇸" },
  { id: "ID", label: "Indonesia", flag: "🇮🇩" },
  { id: "IR", label: "Iran", flag: "🇮🇷" },
  { id: "IQ", label: "Iraq", flag: "🇮🇶" },
  { id: "IE", label: "Ireland", flag: "🇮🇪" },
  { id: "IL", label: "Israel", flag: "🇮🇱" },
  { id: "IT", label: "Italy", flag: "🇮🇹" },
  { id: "JM", label: "Jamaica", flag: "🇯🇲" },
  { id: "JP", label: "Japan", flag: "🇯🇵" },
  { id: "JO", label: "Jordan", flag: "🇯🇴" },
  { id: "KZ", label: "Kazakhstan", flag: "🇰🇿" },
  { id: "KE", label: "Kenya", flag: "🇰🇪" },
  { id: "KI", label: "Kiribati", flag: "🇰🇮" },
  { id: "KP", label: "North Korea", flag: "🇰🇵" },
  { id: "KR", label: "South Korea", flag: "🇰🇷" },
  { id: "KW", label: "Kuwait", flag: "🇰🇼" },
  { id: "KG", label: "Kyrgyzstan", flag: "🇰🇬" },
  { id: "LA", label: "Laos", flag: "🇱🇦" },
  { id: "LV", label: "Latvia", flag: "🇱🇻" },
  { id: "LB", label: "Lebanon", flag: "🇱🇧" },
  { id: "LS", label: "Lesotho", flag: "🇱🇸" },
  { id: "LR", label: "Liberia", flag: "🇱🇷" },
  { id: "LY", label: "Libya", flag: "🇱🇾" },
  { id: "LI", label: "Liechtenstein", flag: "🇱🇮" },
  { id: "LT", label: "Lithuania", flag: "🇱🇹" },
  { id: "LU", label: "Luxembourg", flag: "🇱🇺" },
  { id: "MG", label: "Madagascar", flag: "🇲🇬" },
  { id: "MW", label: "Malawi", flag: "🇲🇼" },
  { id: "MY", label: "Malaysia", flag: "🇲🇾" },
  { id: "MV", label: "Maldives", flag: "🇲🇻" },
  { id: "ML", label: "Mali", flag: "🇲🇱" },
  { id: "MT", label: "Malta", flag: "🇲🇹" },
  { id: "MH", label: "Marshall Islands", flag: "🇲🇭" },
  { id: "MR", label: "Mauritania", flag: "🇲🇷" },
  { id: "MU", label: "Mauritius", flag: "🇲🇺" },
  { id: "MX", label: "Mexico", flag: "🇲🇽" },
  { id: "FM", label: "Micronesia", flag: "🇫🇲" },
  { id: "MD", label: "Moldova", flag: "🇲🇩" },
  { id: "MC", label: "Monaco", flag: "🇲🇨" },
  { id: "MN", label: "Mongolia", flag: "🇲🇳" },
  { id: "ME", label: "Montenegro", flag: "🇲🇪" },
  { id: "MA", label: "Morocco", flag: "🇲🇦" },
  { id: "MZ", label: "Mozambique", flag: "🇲🇿" },
  { id: "MM", label: "Myanmar", flag: "🇲🇲" },
  { id: "NA", label: "Namibia", flag: "🇳🇦" },
  { id: "NR", label: "Nauru", flag: "🇳🇷" },
  { id: "NP", label: "Nepal", flag: "🇳🇵" },
  { id: "NL", label: "Netherlands", flag: "🇳🇱" },
  { id: "NZ", label: "New Zealand", flag: "🇳🇿" },
  { id: "NI", label: "Nicaragua", flag: "🇳🇮" },
  { id: "NE", label: "Niger", flag: "🇳🇪" },
  { id: "NG", label: "Nigeria", flag: "🇳🇬" },
  { id: "MK", label: "North Macedonia", flag: "🇲🇰" },
  { id: "NO", label: "Norway", flag: "🇳🇴" },
  { id: "OM", label: "Oman", flag: "🇴🇲" },
  { id: "PK", label: "Pakistan", flag: "🇵🇰" },
  { id: "PW", label: "Palau", flag: "🇵🇼" },
  { id: "PS", label: "Palestine", flag: "🇵🇸" },
  { id: "PA", label: "Panama", flag: "🇵🇦" },
  { id: "PG", label: "Papua New Guinea", flag: "🇵🇬" },
  { id: "PY", label: "Paraguay", flag: "🇵🇾" },
  { id: "PE", label: "Peru", flag: "🇵🇪" },
  { id: "PH", label: "Philippines", flag: "🇵🇭" },
  { id: "PL", label: "Poland", flag: "🇵🇱" },
  { id: "PT", label: "Portugal", flag: "🇵🇹" },
  { id: "QA", label: "Qatar", flag: "🇶🇦" },
  { id: "RO", label: "Romania", flag: "🇷🇴" },
  { id: "RU", label: "Russia", flag: "🇷🇺" },
  { id: "RW", label: "Rwanda", flag: "🇷🇼" },
  { id: "KN", label: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { id: "LC", label: "Saint Lucia", flag: "🇱🇨" },
  { id: "VC", label: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { id: "WS", label: "Samoa", flag: "🇼🇸" },
  { id: "SM", label: "San Marino", flag: "🇸🇲" },
  { id: "ST", label: "Sao Tome and Principe", flag: "🇸🇹" },
  { id: "SA", label: "Saudi Arabia", flag: "🇸🇦" },
  { id: "SN", label: "Senegal", flag: "🇸🇳" },
  { id: "RS", label: "Serbia", flag: "🇷🇸" },
  { id: "SC", label: "Seychelles", flag: "🇸🇨" },
  { id: "SL", label: "Sierra Leone", flag: "🇸🇱" },
  { id: "SG", label: "Singapore", flag: "🇸🇬" },
  { id: "SK", label: "Slovakia", flag: "🇸🇰" },
  { id: "SI", label: "Slovenia", flag: "🇸🇮" },
  { id: "SB", label: "Solomon Islands", flag: "🇸🇧" },
  { id: "SO", label: "Somalia", flag: "🇸🇴" },
  { id: "ZA", label: "South Africa", flag: "🇿🇦" },
  { id: "ES", label: "Spain", flag: "🇪🇸" },
  { id: "LK", label: "Sri Lanka", flag: "🇱🇰" },
  { id: "SD", label: "Sudan", flag: "🇸🇩" },
  { id: "SR", label: "Suriname", flag: "🇸🇷" },
  { id: "SE", label: "Sweden", flag: "🇸🇪" },
  { id: "CH", label: "Switzerland", flag: "🇨🇭" },
  { id: "SY", label: "Syria", flag: "🇸🇾" },
  { id: "TW", label: "Taiwan", flag: "🇹🇼" },
  { id: "TJ", label: "Tajikistan", flag: "🇹🇯" },
  { id: "TZ", label: "Tanzania", flag: "🇹🇿" },
  { id: "TH", label: "Thailand", flag: "🇹🇭" },
  { id: "TL", label: "Timor-Leste", flag: "🇹🇱" },
  { id: "TG", label: "Togo", flag: "🇹🇬" },
  { id: "TO", label: "Tonga", flag: "🇹🇴" },
  { id: "TT", label: "Trinidad and Tobago", flag: "🇹🇹" },
  { id: "TN", label: "Tunisia", flag: "🇹🇳" },
  { id: "TR", label: "Turkey", flag: "🇹🇷" },
  { id: "TM", label: "Turkmenistan", flag: "🇹🇲" },
  { id: "TV", label: "Tuvalu", flag: "🇹🇻" },
  { id: "UG", label: "Uganda", flag: "🇺🇬" },
  { id: "UA", label: "Ukraine", flag: "🇺🇦" },
  { id: "AE", label: "United Arab Emirates", flag: "🇦🇪" },
  { id: "UY", label: "Uruguay", flag: "🇺🇾" },
  { id: "UZ", label: "Uzbekistan", flag: "🇺🇿" },
  { id: "VU", label: "Vanuatu", flag: "🇻🇺" },
  { id: "VA", label: "Vatican City", flag: "🇻🇦" },
  { id: "VE", label: "Venezuela", flag: "🇻🇪" },
  { id: "VN", label: "Vietnam", flag: "🇻🇳" },
  { id: "YE", label: "Yemen", flag: "🇾🇪" },
  { id: "ZM", label: "Zambia", flag: "🇿🇲" },
  { id: "ZW", label: "Zimbabwe", flag: "🇿🇼" },
];
