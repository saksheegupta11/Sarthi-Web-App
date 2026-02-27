# Specification

## Summary
**Goal:** Build "Sarthi," an AI-based educational and career guidance web app with Internet Identity authentication, a dashboard, career quiz, scholarships, internships, mock tests, an AI chatbot, and a user profile section — using a React + TypeScript frontend and a single Motoko backend actor.

**Planned changes:**
- Internet Identity authentication: login/logout flow, unauthenticated users see only the landing page, authenticated principal used for all user data
- Dashboard: welcome message with user's name, five feature cards (Career Quiz, Scholarships, Internships, Mock Test, AI Chatbot), top nav with Sarthi logo and profile icon
- Career Quiz module: 10+ MCQ questions, backend scoring logic returning recommended stream, subjects, and future scope; results saved per user
- Scholarship section: 10+ pre-seeded entries (government/private) with name, eligibility, Apply Now link (new tab), save/bookmark per user
- Internship section: 8+ pre-seeded entries filterable by domain (Engineering, Medical, Commerce, Arts), View Details link (new tab), save/bookmark per user
- Mock Test module: subject selector (4+ subjects), timed 10+ MCQ per subject, score/correct answers/performance rating on submission, results saved per user
- AI Chatbot: chat UI using Hugging Face Inference API, persistent chat history per user stored in backend, sidebar for previous sessions, new session support, loading indicator
- Profile section: avatar (initial-based), edit form (name, DOB, institution, class/year — no email/phone), saved collections tab (scholarships, internships, colleges) with remove option, language selector (English/Hindi), light/dark mode toggle, logout
- Motoko backend actor: quiz questions, quiz results, scholarship/internship/college static data, save/unsave collections, mock test results, chat history — all keyed by principal
- Deep teal and saffron/amber visual theme, responsive layout (mobile ≥375px, desktop ≥1024px), dark mode support

**User-visible outcome:** Students can log in with Internet Identity, explore and take a career quiz, browse scholarships and internships, attempt mock tests, chat with an AI assistant, and manage their profile and saved collections — all within a cohesive, mobile-friendly interface.
