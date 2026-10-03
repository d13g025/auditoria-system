import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

const auditorias = [
  {
    filial: 'Cianorte',
    periodo: 'Set/2026',
    progresso: '7/12 PTs',
  },
  {
    filial: 'Maringá',
    periodo: 'Set/2026',
    progresso: '4/12 PTs',
  },
  {
    filial: 'Umuarama',
    periodo: 'Ago/2026',
    progresso: '9/12 PTs',
  },
]

function Home() {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, mb: 1 }}
      >
        Olá, Diego!
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Bem-vindo ao Sistema de Auditoria.
      </Typography>

      {/* RESUMO */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
          mb: 4,
        }}
      >
        <Card>
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Auditorias
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: 600 }}
            >
              12
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Em andamento
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: 600 }}
            >
              3
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Concluídas
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: 600 }}
            >
              9
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* AUDITORIAS EM ANDAMENTO */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600 }}
        >
          Auditorias em andamento
        </Typography>

        <Button variant="outlined">
          Ver todas
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filial</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Progresso</TableCell>
              <TableCell align="right">Ação</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {auditorias.map((auditoria) => (
              <TableRow key={`${auditoria.filial}-${auditoria.periodo}`}>
                <TableCell>
                  {auditoria.filial}
                </TableCell>

                <TableCell>
                  {auditoria.periodo}
                </TableCell>

                <TableCell>
                  {auditoria.progresso}
                </TableCell>

                <TableCell align="right">
                  <Button size="small">
                    Abrir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Home