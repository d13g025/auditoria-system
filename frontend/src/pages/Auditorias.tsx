import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { useNavigate } from 'react-router-dom'

const auditorias = [
  {
    filial: 'Cianorte',
    periodo: 'Set/2026',
    auditor: 'Diego',
    progresso: '7 / 12',
    status: 'Em andamento',
  },
  {
    filial: 'Maringá',
    periodo: 'Set/2026',
    auditor: 'Diego',
    progresso: '4 / 12',
    status: 'Em andamento',
  },
  {
    filial: 'Umuarama',
    periodo: 'Ago/2026',
    auditor: 'Diego',
    progresso: '9 / 12',
    status: 'Em andamento',
  },
  {
    filial: 'Cascavel',
    periodo: 'Jul/2026',
    auditor: 'Diego',
    progresso: '12 / 12',
    status: 'Concluída',
  },
]

function Auditorias() {
    const navigate = useNavigate()

  return (
     <Box>
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
        }}
        >
        <Typography
            variant="h4"
            sx={{ fontWeight: 600 }}
        >
            Auditorias
        </Typography>

        <Button
            variant="contained"
            onClick={() => navigate('/auditorias/nova')}
        >
            + Nova auditoria
        </Button>
        </Box>

        <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
        >
        Gerencie as auditorias realizadas e em andamento.
    </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filial</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Auditor</TableCell>
              <TableCell>Progresso</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {auditorias.map((auditoria) => (
              <TableRow
                key={`${auditoria.filial}-${auditoria.periodo}`}
              >
                <TableCell>
                  {auditoria.filial}
                </TableCell>

                <TableCell>
                  {auditoria.periodo}
                </TableCell>

                <TableCell>
                  {auditoria.auditor}
                </TableCell>

                <TableCell>
                  {auditoria.progresso}
                </TableCell>

                <TableCell>
                  {auditoria.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Auditorias