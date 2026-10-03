import { Box, Typography } from '@mui/material'

function Header() {
  return (
    <Box
      sx={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600 }}
      >
        Início
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Diego Araujo
      </Typography>
    </Box>
  )
}

export default Header