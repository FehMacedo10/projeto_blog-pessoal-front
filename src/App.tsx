import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/cadastro/Cadastro';


function App() { 
  return (
    <>
      <AuthProvider> 
        <BrowserRouter>
          <Navbar />
          <div className='min-h-[80vh]'>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/home' element={<Home />} />
              <Route path='/cadastro' element={<Cadastro />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
} // O componente App é o componente principal da aplicação

export default App;