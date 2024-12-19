import { Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import SchedulePage from './pages/booking/SchedulePage';
import ConfirmationPage from './pages/booking/ConfirmationPage';
import MenuPage from './pages/menu/MenuPage';

function App() {
  return (
    <div className="container mx-auto flex grow flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </div>
  );
}

export default App;
