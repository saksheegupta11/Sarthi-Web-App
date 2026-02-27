import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CareerQuiz from './pages/CareerQuiz';
import CareerQuizResult from './pages/CareerQuizResult';
import Scholarships from './pages/Scholarships';
import Internships from './pages/Internships';
import MockTest from './pages/MockTest';
import MockTestResult from './pages/MockTestResult';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Landing page (public)
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// Authenticated layout route
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const dashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

const careerQuizRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/career-quiz',
  component: CareerQuiz,
});

const careerQuizResultRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/career-quiz/result',
  component: CareerQuizResult,
});

const scholarshipsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/scholarships',
  component: Scholarships,
});

const internshipsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/internships',
  component: Internships,
});

const mockTestRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/mock-test',
  component: MockTest,
});

const mockTestResultRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/mock-test/result',
  component: MockTestResult,
});

const chatbotRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/chatbot',
  component: Chatbot,
});

const profileRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/profile',
  component: Profile,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  authLayoutRoute.addChildren([
    dashboardRoute,
    careerQuizRoute,
    careerQuizResultRoute,
    scholarshipsRoute,
    internshipsRoute,
    mockTestRoute,
    mockTestResultRoute,
    chatbotRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
