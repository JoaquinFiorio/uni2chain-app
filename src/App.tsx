import './styles/App.css'
import AnimatedBackground from './components/AnimatedBackground'
import { NavProvider } from './context/NavContext'
import { UserProvider } from './context/UserContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NodesPage from './pages/NodesPage'
import Soluciones from './pages/Soluciones'
import ComingSoon from './pages/ComingSoon'
import Login from './pages/Login'
import TopNavbar from './components/TopNavbar'
import Footer from './components/Footer'
import Tokenomics from './pages/Tokenomics'
import Swap from './pages/Swap'
import Community from './pages/Community'

function App() {
  return (
    <UserProvider>
      <NavProvider>
        <BrowserRouter>
          <TopNavbar />
          <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
              <AnimatedBackground />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nodes" element={<NodesPage />} />
                <Route path="/tokenomics" element={<Tokenomics />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/soluciones" element={<Soluciones />} />
                <Route path="/login" element={<Login />} />
                {/* Rutas para páginas que aún no están implementadas */}
                <Route path="/community" element={<Community />} />
                <Route path="/users" element={<ComingSoon />} />
                <Route path="/briefcase" element={<ComingSoon />} />
                <Route path="/anchor" element={<ComingSoon />} />
                <Route path="/raspi" element={<ComingSoon />} />
                <Route path="/register" element={<ComingSoon />} />
                <Route path="/reset-password" element={<ComingSoon />} />
                {/* Alias para otras rutas posibles */}
                <Route path="/lamp" element={<Soluciones />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </NavProvider>
    </UserProvider>
  )
}

export default App
