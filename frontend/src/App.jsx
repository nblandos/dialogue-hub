import { Route, Routes } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import SchedulePage from './pages/booking/SchedulePage';
import MenuPage from './pages/menu/MenuPage';

function App() {
  return (
    <div className="flex flex-col grow container mx-auto">
      <Header />
      <Routes>
        {/* path to schedule timeslot page is / as I think it should be the default page */}
        <Route path="/" element={<SchedulePage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </div>
  );
}

export default App;
