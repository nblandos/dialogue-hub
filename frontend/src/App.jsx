import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/header/Header';
import SchedulePage from './pages/booking/SchedulePage';
import ConfirmationPage from './pages/booking/ConfirmationPage';
import BookingSuccessPage from './pages/booking/BookingSuccessPage';
import MenuPage from './pages/menu/MenuPage';
import TrainingPage from './pages/training/TrainingPage';
import HomePage from './pages/home/HomePage';
import Footer from './components/footer/Footer';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="container mx-auto flex grow flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<SchedulePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/success" element={<BookingSuccessPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/training" element={<TrainingPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
