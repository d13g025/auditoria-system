import { Box } from '@mui/material'
import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Home from './pages/Home'
import Auditorias from './pages/Auditorias'
import NovaAuditoria from './pages/NovaAuditoria'
import Auditoria from './pages/Auditoria'
import PT01 from './pages/PT01'
import PT02 from './pages/PT02'
import PT03 from './pages/PT03'
import PT04 from './pages/PT04'
import PT05 from './pages/PT05'
import PT06 from './pages/PT06'
import PT07 from './pages/PT07'
import PT08 from './pages/PT08'
import PT09 from './pages/PT09'
import PT10 from './pages/PT10'
import PT11 from './pages/PT11'
import PT12 from './pages/PT12'

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '240px',
        }}
      >
        <Header />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: 4,
          }}
            >
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/auditorias"
              element={<Auditorias />}
            />

            <Route
              path="/auditorias/nova"
              element={<NovaAuditoria />}
            />

            <Route
              path="/auditorias/:id"
              element={<Auditoria />}
            />

            <Route
              path="/auditorias/:id/pt/01"
              element={<PT01 />}
            />

            <Route
              path="/auditorias/:id/pt/02"
              element={<PT02 />}
            />

            <Route
              path="/auditorias/:id/pt/03"
              element={<PT03 />}
            />
            <Route
              path="/auditorias/:id/pt/04"
              element={<PT04 />}
            />
            <Route
              path="/auditorias/:id/pt/05"
              element={<PT05 />}
            />
            <Route
              path="/auditorias/:id/pt/06"
              element={<PT06 />}
            />
            <Route
              path="/auditorias/:id/pt/07"
              element={<PT07 />}
            />
            <Route
              path="/auditorias/:id/pt/08"
              element={<PT08 />}
            />
            <Route
              path="/auditorias/:id/pt/09"
              element={<PT09 />}
            />
            <Route
              path="/auditorias/:id/pt/10"
              element={<PT10 />}
            />
            <Route
              path="/auditorias/:id/pt/11"
              element={<PT11 />}
            />
            <Route
              path="/auditorias/:id/pt/12"
              element={<PT12 />}
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}


export default App