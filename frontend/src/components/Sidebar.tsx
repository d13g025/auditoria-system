import {
  DashboardOutlined,
  AssignmentOutlined,
  DescriptionOutlined,
  BarChartOutlined,
  SettingsOutlined,
} from '@mui/icons-material'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isInicio = location.pathname === '/'
  const isAuditorias = location.pathname.startsWith('/auditorias')

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: '#111827',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* LOGO / TÍTULO */}
      <Box
        sx={{
          height: 100,
          display: 'flex',
          alignItems: 'center',
          px: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600 }}
        >
          AUDITORIA
        </Typography>
      </Box>

      {/* MENU */}
      <List sx={{ px: 1 }}>

        {/* INÍCIO */}
      <ListItemButton
        selected={isInicio}
        onClick={() => navigate('/')}
        sx={{
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        }}
>
          <ListItemIcon sx={{ color: 'white' }}>
            <DashboardOutlined />
          </ListItemIcon>

          <ListItemText primary="Início" />
        </ListItemButton>


        {/* AUDITORIAS */}
        <ListItemButton
          selected={isAuditorias}
          onClick={() => navigate('/auditorias')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <AssignmentOutlined />
          </ListItemIcon>

          <ListItemText primary="Auditorias" />
        </ListItemButton>


        {/* RELATÓRIOS */}
        <ListItemButton>
          <ListItemIcon sx={{ color: 'white' }}>
            <DescriptionOutlined />
          </ListItemIcon>

          <ListItemText primary="Relatórios" />
        </ListItemButton>


        {/* DASHBOARD */}
        <ListItemButton>
          <ListItemIcon sx={{ color: 'white' }}>
            <BarChartOutlined />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>


        {/* CONFIGURAÇÕES */}
        <ListItemButton>
          <ListItemIcon sx={{ color: 'white' }}>
            <SettingsOutlined />
          </ListItemIcon>

          <ListItemText primary="Configurações" />
        </ListItemButton>

      </List>

      {/* USUÁRIO */}
      <Box
        sx={{
          marginTop: 'auto',
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography variant="body2">
          Diego Araujo
        </Typography>

        <Typography
          variant="caption"
          sx={{ opacity: 0.6 }}
        >
          Auditor
        </Typography>
      </Box>
    </Box>
  )
}

export default Sidebar