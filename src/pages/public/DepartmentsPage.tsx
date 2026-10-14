import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PublicHeader } from '../../components/common/PublicHeader';
import { PublicFooter } from '../../components/common/PublicFooter';
import { BottomNav } from '../../components/layout/BottomNav';
import { MobileDrawer } from '../../components/layout/MobileDrawer';
import { ScrollToTop } from '../../components/common/ScrollToTop';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';

interface DepartmentDetail {
  code: string;
  name: string;
  arabicName: string;
  badge: string;
  icon: string;
  headline: string;
  description: string;
  headOfDept: string;
  creditHours: string;
  studentCount: string;
  tracks: { title: string; desc: string; coreCourses: string[] }[];
  labs: { name: string; specs: string }[];
  careers: string[];
}

export const DepartmentsPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [selectedDept, setSelectedDept] = useState<'CS' | 'AI' | 'IS' | 'IT'>('CS');

  const deptData: Record<'CS' | 'AI' | 'IS' | 'IT', DepartmentDetail> = {
    CS: {
      code: 'CS',
      name: 'Computer Science',
      arabicName: 'علوم الحاسب',
      badge: 'Core Computational Foundation',
      icon: 'cpu',
      headline: 'Architecting High-Performance Algorithms & Scalable Distributed Operating Systems',
      description: 'The Computer Science department delivers mastery over computational theory, compiler construction, POSIX multi-threaded programming, systems architecture, and distributed database clustering. Students build operating system kernels, write compilers from scratch, and engineer high-throughput cloud engines.',
      headOfDept: 'Prof. Dr. Sameh Abdel-Rahman (Dean & Head of CS)',
      creditHours: '140 Credit Hours · 8 Semesters',
      studentCount: '1,420 Enrolled Students',
      tracks: [
        {
          title: 'Systems & Concurrent Architecture',
          desc: 'POSIX threads, mutex synchronization, semaphore primitives, kernel memory managers, and file systems.',
          coreCourses: ['CS301 Operating Systems II', 'CS402 Distributed Systems', 'CS304 Compiler Design', 'CS205 Computer Architecture']
        },
        {
          title: 'Advanced Algorithms & HPC',
          desc: 'Graph optimization algorithms, NP-complete reduction, parallel computing via CUDA and OpenMP clusters.',
          coreCourses: ['CS202 Data Structures', 'CS303 Design & Analysis of Algorithms', 'CS405 High Performance Computing']
        },
        {
          title: 'Software Engineering & Enterprise DevOps',
          desc: 'Microservice mesh architectures, CI/CD pipelines, container orchestration, design patterns, and clean code.',
          coreCourses: ['CS306 Software Engineering', 'CS408 Cloud Computing & DevOps', 'CS499 Graduation Project']
        }
      ],
      labs: [
        { name: 'Turing Supercomputing Cluster Lab', specs: '32-Node Linux High-Performance Grid with InfiniBand interconnects' },
        { name: 'Systems Programming & POSIX Lab', specs: '60 Dell Workstations configured with customized Arch & Debian toolchains' },
        { name: 'Algorithmic Problem-Solving Arena', specs: 'High-speed competitive programming arena with private test runners' }
      ],
      careers: ['Distributed Systems Engineer', 'Systems Programmer (C/C++/Rust)', 'Compiler Engineer', 'Cloud Infrastructure Architect', 'DevOps & SRE Specialist']
    },
    AI: {
      code: 'AI',
      name: 'Artificial Intelligence',
      arabicName: 'الذكاء الاصطناعي',
      badge: 'Cognitive Computing & Autonomous Systems',
      icon: 'sparkles',
      headline: 'Deep Learning, Computer Vision, Generative AI & Autonomous Robotics',
      description: 'The flagship Artificial Intelligence department focuses on foundational neural networks, computer vision, natural language processing, LLM fine-tuning, and robotic perception. Students build end-to-end transformers, deploy edge vision models, and design intelligent decision-support agents.',
      headOfDept: 'Prof. Dr. Hend Mahmoud (Vice Dean for Academic Affairs)',
      creditHours: '140 Credit Hours · 8 Semesters',
      studentCount: '1,150 Enrolled Students',
      tracks: [
        {
          title: 'Deep Learning & Neural Architectures',
          desc: 'Backpropagation mathematics, CNNs, Transformers, attention mechanisms, diffusion models, and PyTorch.',
          coreCourses: ['AI301 Machine Learning Fundamentals', 'AI302 Deep Learning & Neural Nets', 'AI401 Generative AI & LLMs']
        },
        {
          title: 'Computer Vision & Edge Perception',
          desc: 'Real-time object detection (YOLOv10), semantic segmentation, 3D point clouds, medical image classification.',
          coreCourses: ['AI305 Computer Vision', 'AI406 Edge AI & Embedded Vision', 'AI410 Medical Image Processing']
        },
        {
          title: 'Robotics & Natural Language Processing',
          desc: 'ROS2 middleware, SLAM navigation, Arabic NLP semantic parsing, sentiment analysis, speech synthesis.',
          coreCourses: ['AI308 Natural Language Processing', 'AI404 Autonomous Robotics & SLAM', 'AI499 AI Capstone Project']
        }
      ],
      labs: [
        { name: 'Lovelace Neural AI Supercluster', specs: '8x NVIDIA RTX A6000 Ada GPU Nodes dedicated to student model training' },
        { name: 'Robotics & Sensor Fusion Testing Arena', specs: 'Indoor LiDAR SLAM test tracks and robotic arms equipped with depth sensors' },
        { name: 'Vision & Perception Research Lab', specs: 'Industrial 4K high-speed cameras, stereo vision rigs, and edge Jetson rigs' }
      ],
      careers: ['Deep Learning Research Engineer', 'Computer Vision Specialist', 'NLP / LLM Applications Engineer', 'Autonomous Robotics Engineer', 'AI Solutions Architect']
    },
    IS: {
      code: 'IS',
      name: 'Information Systems',
      arabicName: 'نظم المعلومات',
      badge: 'Enterprise Architecture & Big Data Engines',
      icon: 'database',
      headline: 'Enterprise Database Engines, Business Intelligence, Fawry FinTech & ERP Scale',
      description: 'The Information Systems department prepares digital leaders capable of designing relational and NoSQL warehouse architectures, big data pipelines, supply-chain ERP systems, and modern FinTech integrations. Students master transactional integrity, dimensional modeling, and decision analytics.',
      headOfDept: 'Assoc. Prof. Dr. Khaled Mostafa (Head of IS)',
      creditHours: '140 Credit Hours · 8 Semesters',
      studentCount: '890 Enrolled Students',
      tracks: [
        {
          title: 'Database Engineering & Modern Warehouses',
          desc: 'PostgreSQL internal tuning, indexing strategies, Snowflake data lakes, dimensional modeling, ACID compliance.',
          coreCourses: ['IS201 Database Management Systems', 'IS302 Advanced Databases & Tuning', 'IS403 Data Warehousing']
        },
        {
          title: 'Business Intelligence & Decision Analytics',
          desc: 'Predictive data mining, executive dashboard design, ETL pipeline automation, big data spark processing.',
          coreCourses: ['IS305 Business Intelligence', 'IS404 Big Data Technologies (Hadoop & Spark)', 'IS308 Knowledge Management']
        },
        {
          title: 'Enterprise Architecture & FinTech Systems',
          desc: 'ERP implementations, electronic payment gateways (Fawry, Stripe), e-commerce workflows, service orchestration.',
          coreCourses: ['IS307 Enterprise Resource Planning', 'IS409 Financial Information Systems', 'IS499 IS Capstone Project']
        }
      ],
      labs: [
        { name: 'Codd Enterprise Data Lab', specs: 'Dedicated enterprise PostgreSQL and Oracle Database test server instances' },
        { name: 'BI & Analytics Visualization Center', specs: 'Dual-monitor high-resolution analyst workstations with Tableau & PowerBI' },
        { name: 'FinTech & Electronic Integration Sandbox', specs: 'Isolated staging API gateway simulating live Fawry payment webhooks' }
      ],
      careers: ['Enterprise Data Architect', 'Database Administrator (DBA)', 'Business Intelligence Analyst', 'FinTech Systems Engineer', 'Data Warehouse Engineer']
    },
    IT: {
      code: 'IT',
      name: 'Information Technology',
      arabicName: 'تكنولوجيا المعلومات',
      badge: 'Cyber Defense & Cloud Infrastructure',
      icon: 'shieldCheck',
      headline: 'Cybersecurity Penetration Testing, Cloud Microservices & Industrial IoT',
      description: 'The Information Technology department safeguards the cyber infrastructure of tomorrow. Students undergo intense training in ethical hacking, penetration testing, cryptographic protocols, cloud networking, and industrial IoT telemetry. Certified lab environments allow realistic red-team vs. blue-team simulations.',
      headOfDept: 'Assoc. Prof. Dr. Yasser El-Sayed (Head of IT)',
      creditHours: '140 Credit Hours · 8 Semesters',
      studentCount: '780 Enrolled Students',
      tracks: [
        {
          title: 'Offensive Cybersecurity & Penetration Testing',
          desc: 'Vulnerability assessment, exploit development, reverse engineering, web application security (OWASP Top 10).',
          coreCourses: ['IT301 Network Security Fundamentals', 'IT304 Ethical Hacking & Pentesting', 'IT402 Digital Forensics']
        },
        {
          title: 'Cloud Networking & Virtualized Infrastructure',
          desc: 'Software-defined networking (SDN), Kubernetes clusters, BGP routing protocols, zero-trust network architectures.',
          coreCourses: ['IT202 Computer Networks II', 'IT303 Cloud Infrastructure & Virtualization', 'IT405 Modern SDN Networks']
        },
        {
          title: 'Internet of Things (IoT) & Smart Grid Telemetry',
          desc: 'Embedded microcontrollers, MQTT publish-subscribe brokers, cryptographic sensor nodes, edge computing.',
          coreCourses: ['IT306 IoT Sensor Networks', 'IT408 Industrial Cyber-Physical Systems', 'IT499 IT Capstone Project']
        }
      ],
      labs: [
        { name: 'Shannon Cyber Defense Range', specs: 'Isolated air-gapped network for simulated cyberwarfare, malware analysis & defense' },
        { name: 'Cisco Networking & Routing Academy', specs: 'Physical rack with enterprise Cisco Catalyst switches and modular routers' },
        { name: 'IoT Telemetry & Embedded Lab', specs: 'ESP32, Raspberry Pi 5, LoRaWAN gateways, and wireless sensor motes' }
      ],
      careers: ['Cybersecurity Penetration Tester', 'SOC Analyst / Incident Responder', 'Cloud Security Architect', 'Network Operations Specialist', 'IoT Solutions Engineer']
    }
  };

  const active = deptData[selectedDept];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020b17] text-slate-800 dark:text-slate-100 overflow-x-clip transition-colors duration-300">
      <PublicHeader activeNav="departments" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-14 overflow-hidden">
        {/* Ambient Neon Blue Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] -top-28 -left-20 bg-blue-500/15 dark:bg-cyan-500/15" />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[130px] top-1/2 -right-20 bg-cyan-400/15 dark:bg-blue-600/15" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-400/30 text-cyan-600 dark:text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Icon name="layers" size="sm" />
            <span>FCAI BENI SUEF UNIVERSITY · ACADEMIC STRUCTURE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Academic Specializations &amp;{' '}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#0284c7] bg-clip-text text-transparent">
              Departments
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Four specialized faculties engineered to meet national accreditation and international Silicon Valley standards under Academic Bylaw 2026/2027.
          </p>

          {/* Department Selector Pills with Neon Blue Active Glow */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            {(['CS', 'AI', 'IS', 'IT'] as const).map(code => {
              const d = deptData[code];
              const isCurrent = selectedDept === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedDept(code)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    isCurrent
                      ? 'cta-primary scale-105 shadow-lg'
                      : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-cyan-500/25 hover:border-cyan-400/50'
                  }`}
                >
                  <Icon name={d.icon} size="sm" />
                  <span>{d.code} · {d.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Department Showcase */}
      <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={selectedDept}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-10"
          >
            {/* Header Banner Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-400/30">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-cyan-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#38bdf8] flex items-center justify-center text-[#021024] shadow-lg shadow-sky-500/25 font-black text-2xl">
                    {active.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {active.name}
                      </h2>
                      <span className="text-base text-slate-400 dark:text-cyan-300/80 font-bold">
                        ({active.arabicName})
                      </span>
                    </div>
                    <span className="text-xs text-cyan-600 dark:text-cyan-300 font-semibold tracking-wide">
                      {active.badge}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Icon name="award" size="sm" className="inline mr-1 text-cyan-500" />
                    {active.creditHours}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Icon name="users" size="sm" className="inline mr-1 text-cyan-500" />
                    {active.studentCount}
                  </span>
                </div>
              </div>

              {/* Department Vision */}
              <div className="py-6 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-cyan-100">
                  {active.headline}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                  {active.description}
                </p>
                <div className="pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Leadership: <span className="text-slate-800 dark:text-white font-bold">{active.headOfDept}</span>
                </div>
              </div>
            </div>

            {/* Curriculum Tracks */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon name="book" size="md" className="text-cyan-500" />
                <span>Specialized Curriculum Tracks</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {active.tracks.map((track, i) => (
                  <div key={i} className="card p-6 flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 flex items-center justify-center font-bold text-sm mb-4">
                        0{i + 1}
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                        {track.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {track.desc}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-cyan-500/20">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Core Semester Courses
                      </span>
                      {track.coreCourses.map((c, ci) => (
                        <div key={ci} className="text-xs text-slate-700 dark:text-cyan-200 flex items-center gap-1.5 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialized Labs & Career Paths */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Specialized Labs */}
              <div className="card p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="terminal" size="md" className="text-cyan-500" />
                  <span>Research &amp; Instructional Labs</span>
                </h3>
                <div className="space-y-3">
                  {active.labs.map((lab, li) => (
                    <div key={li} className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-cyan-500/20">
                      <b className="text-sm text-slate-900 dark:text-white block">{lab.name}</b>
                      <span className="text-xs text-slate-500 dark:text-slate-300 mt-1 block">{lab.specs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Paths */}
              <div className="card p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon name="briefcase" size="md" className="text-cyan-500" />
                  <span>Graduate Career Pathways</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {active.careers.map((career, ci) => (
                    <span
                      key={ci}
                      className="px-4 py-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-400/30 text-xs font-bold text-cyan-800 dark:text-cyan-200"
                    >
                      {career}
                    </span>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Looking to explore course catalog?</span>
                    <b className="text-sm text-slate-900 dark:text-white">View active student course offerings</b>
                  </div>
                  <a
                    href={isAuthenticated ? `#/${role}/courses` : '#/login'}
                    className="cta-primary px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md whitespace-nowrap active:scale-95 cursor-pointer"
                  >
                    {isAuthenticated ? 'Open Course Catalog' : 'Sign In to View Courses'}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
      <BottomNav activePath="departments" />
      <MobileDrawer activePath="departments" />
      <ScrollToTop />
    </div>
  );
};
