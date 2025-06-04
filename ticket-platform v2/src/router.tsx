import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import VenuePage from './pages/VenuePage';
import AuthCallback from './pages/AuthCallback';
import EventsPage from './pages/EventsPage';
import AboutUsPage from './pages/AboutUsPage';
import CareerPage from './pages/CareerPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchResultsPage />,
      },
      {
        path: 'category/:categoryId',
        element: <CategoryPage />,
      },
      {
        path: 'venue/:venueId',
        element: <VenuePage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'about-us',
        element: <AboutUsPage />,
      },
      {
        path: 'career',
        element: <CareerPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      }
    ],
  },
]);

export default router; 