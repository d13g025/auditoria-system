import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'

function NovaAuditoria() {
  const navigate = useNavigate()

  const [filial, setFilial] = useState('')
  const [mesReferencia, setMesReferencia] = useState('')
  const [dataAuditoria, setDataAuditoria] = useState('')
  const [periodoInicio, setPeriodoInicio] = useState('')
  const [periodoFim, setPeriodoFim] = useState('')
  const [auditor, setAuditor] = useState('Diego Araujo')
  const [tipo, setTipo] = useState('presencial')

  useEffect(() => {
    if (!dataAuditoria) {
      return
    }

    const [ano, mes, dia] = dataAuditoria
      .split('-')
      .map(Number)

    const dataInicio = new Date(
      ano,
      mes - 1 - 6,
      dia,
    )

    const formatarData = (data: Date) => {
      const ano = data.getFullYear()
      const mes = String(data.getMonth() + 1).padStart(2, '0')
      const dia = String(data.getDate()).padStart(2, '0')

      return `${ano}-${mes}-${dia}`
    }

    setPeriodoInicio(formatarData(dataInicio))
    setPeriodoFim(dataAuditoria)

    const mesFormatado = String(mes).padStart(2, '0')

    setMesReferencia(`${ano}-${mesFormatado}`)
  }, [dataAuditoria])

  const criarAuditoria = () => {
    const novaAuditoria = {
      id: crypto.randomUUID(),
      filial,
      mesReferencia,
      dataAuditoria,
      periodoInicio,
      periodoFim,
      auditor,
      tipo,
      status: 'Em andamento',
      criadaEm: new Date().toISOString(),
    }

    localStorage.setItem(
      `auditoria_${novaAuditoria.id}`,
      JSON.stringify(novaAuditoria),
    )

    navigate(`/auditorias/${novaAuditoria.id}`)
  }

  return (
    <Box>
      {/* CABEÇALHO */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Nova auditoria
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mb: 4,
        }}
      >
        Informe os dados iniciais da auditoria.
      </Typography>

      {/* FORMULÁRIO */}
      <Box
        sx={{
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* FILIAL */}
        <TextField
          label="Filial"
          placeholder="Ex.: Cianorte"
          value={filial}
          onChange={(event) => setFilial(event.target.value)}
          fullWidth
        />

        {/* MÊS DE REFERÊNCIA */}
        <TextField
          label="Mês de referência"
          type="month"
          value={mesReferencia}
          onChange={(event) => setMesReferencia(event.target.value)}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        {/* DATA DA AUDITORIA */}
        <TextField
          label="Data da auditoria"
          type="date"
          value={dataAuditoria}
          onChange={(event) => setDataAuditoria(event.target.value)}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        {/* PERÍODO AUDITADO */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Período auditado
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <TextField
              label="Data inicial"
              type="date"
              value={periodoInicio}
              onChange={(event) =>
                setPeriodoInicio(event.target.value)
              }
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Data final"
              type="date"
              value={periodoFim}
              onChange={(event) =>
                setPeriodoFim(event.target.value)
              }
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>
        </Box>

        {/* AUDITOR */}
        <TextField
          label="Auditor"
          value={auditor}
          onChange={(event) => setAuditor(event.target.value)}
          fullWidth
        />

        {/* TIPO DE AUDITORIA */}
        <FormControl fullWidth>
          <InputLabel id="tipo-auditoria-label">
            Tipo de auditoria
          </InputLabel>

          <Select
            labelId="tipo-auditoria-label"
            label="Tipo de auditoria"
            value={tipo}
            onChange={(event) => setTipo(event.target.value)}
          >
            <MenuItem value="presencial">
              Presencial
            </MenuItem>

            <MenuItem value="remota">
              Remota
            </MenuItem>
          </Select>
        </FormControl>

        {/* BOTÕES */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/auditorias')}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={criarAuditoria}
          >
            Criar auditoria
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default NovaAuditoria