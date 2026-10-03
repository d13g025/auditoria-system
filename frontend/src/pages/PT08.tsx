import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import { useNavigate, useParams } from 'react-router-dom'

type RegistroPedagio = {
  id: number
  oc: string
  carga: string
  status: string
  rota: string
  motivo: string
  rotaCorreta: string
  observacoes: string
}

const AMOSTRA_CANCELADOS = 10
const AMOSTRA_COMPRAS = 20

const criarRegistro = (id: number): RegistroPedagio => ({
  id,
  oc: '',
  carga: '',
  status: '',
  rota: '',
  motivo: '',
  rotaCorreta: '',
  observacoes: '',
})

const criarAmostra = (quantidade: number): RegistroPedagio[] =>
  Array.from({ length: quantidade }, (_, index) =>
    criarRegistro(index + 1),
  )

const ehCorreto = (valor: string): boolean => {
  const normalizado = valor.trim().toLowerCase()
  return normalizado === 'sim' || normalizado === 'ok'
}

const percentual = (corretos: number, total: number): string => {
  if (total === 0) return '0%'
  return `${((corretos / total) * 100).toFixed(2).replace('.', ',')}%`
}

function PT08() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [aba, setAba] = useState(0)

  const [cancelados, setCancelados] = useState<RegistroPedagio[]>(
    criarAmostra(AMOSTRA_CANCELADOS),
  )

  const [compras, setCompras] = useState<RegistroPedagio[]>(
    criarAmostra(AMOSTRA_COMPRAS),
  )

  const [periodoInicio, setPeriodoInicio] = useState('')
  const [periodoFim, setPeriodoFim] = useState('')

  const [resultado, setResultado] = useState('De acordo')
  const [observacoes, setObservacoes] = useState('')
  const [providenciaAplicada, setProvidenciaAplicada] = useState('')

  // ============================================================
  // CARREGAR DADOS SALVOS
  // ============================================================

  useEffect(() => {
    if (!id) return

    const salvo = localStorage.getItem(`auditoria_${id}_pt08`)
    if (!salvo) return

    try {
      const dados = JSON.parse(salvo)

      if (Array.isArray(dados.cancelados) && dados.cancelados.length > 0) {
        setCancelados(dados.cancelados)
      }

      if (Array.isArray(dados.compras) && dados.compras.length > 0) {
        setCompras(dados.compras)
      }

      if (dados.periodoInicio) setPeriodoInicio(dados.periodoInicio)
      if (dados.periodoFim) setPeriodoFim(dados.periodoFim)
      if (dados.resultado) setResultado(dados.resultado)
      if (dados.observacoes) setObservacoes(dados.observacoes)
      if (dados.providenciaAplicada) {
        setProvidenciaAplicada(dados.providenciaAplicada)
      }
    } catch {
      console.error('Erro ao carregar PT08.')
    }
  }, [id])

  // ============================================================
  // ATUALIZAR REGISTRO
  // ============================================================

  const atualizarRegistro = (
    tipo: 'cancelados' | 'compras',
    registroId: number,
    campo: keyof RegistroPedagio,
    valor: string,
  ) => {
    const setter = tipo === 'cancelados' ? setCancelados : setCompras

    setter((atual) =>
      atual.map((registro) =>
        registro.id === registroId
          ? { ...registro, [campo]: valor }
          : registro,
      ),
    )
  }

  // ============================================================
  // ADICIONAR / REMOVER
  // ============================================================

  const adicionarRegistro = (tipo: 'cancelados' | 'compras') => {
    const registros = tipo === 'cancelados' ? cancelados : compras
    const setter = tipo === 'cancelados' ? setCancelados : setCompras

    const novoId =
      registros.length > 0
        ? Math.max(...registros.map((registro) => registro.id)) + 1
        : 1

    setter((atual) => [...atual, criarRegistro(novoId)])
  }

  const removerRegistro = (
    tipo: 'cancelados' | 'compras',
    registroId: number,
  ) => {
    const setter = tipo === 'cancelados' ? setCancelados : setCompras

    setter((atual) =>
      atual.filter((registro) => registro.id !== registroId),
    )
  }

  // ============================================================
  // RESUMOS
  //
  // A planilha de origem define os campos, mas não define
  // critérios de conformidade para Status/Rota/Motivo.
  //
  // Por isso, nesta versão, o único critério percentual
  // explicitamente definido na fonte é "Rota correta?"
  // da aba de compras realizadas.
  // ============================================================

  const totalCancelados = cancelados.length
  const totalCompras = compras.length

  const corretosRotaCompras = compras.filter(
    (registro) => ehCorreto(registro.rotaCorreta),
  ).length

  // ============================================================
  // SALVAR
  // ============================================================

  const salvar = (status: 'rascunho' | 'finalizado') => {
    if (!id) return

    const dados = {
      cancelados,
      compras,
      periodoInicio,
      periodoFim,
      resultado,
      observacoes,
      providenciaAplicada,
      status,
    }

    localStorage.setItem(
      `auditoria_${id}_pt08`,
      JSON.stringify(dados),
    )

    alert(
      status === 'rascunho'
        ? 'PT08 salvo como rascunho.'
        : 'PT08 finalizado.',
    )
  }

  // ============================================================
  // RENDERIZAÇÃO DAS TABELAS
  // ============================================================

  const renderTabelaCancelados = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Amostra de 10 Pedágios Cancelados.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 1fr 1.2fr 1.5fr 2fr 50px',
          gap: 1.5,
          alignItems: 'center',
          px: 1,
          mb: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>OC</Typography>
        <Typography sx={{ fontWeight: 600 }}>Carga</Typography>
        <Typography sx={{ fontWeight: 600 }}>Status</Typography>
        <Typography sx={{ fontWeight: 600 }}>Rota</Typography>
        <Typography sx={{ fontWeight: 600 }}>Motivo</Typography>
        <Typography sx={{ fontWeight: 600 }}>Observações</Typography>
        <Box />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {cancelados.map((registro) => (
        <Box
          key={registro.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 1fr 1.2fr 1.5fr 2fr 50px',
            gap: 1.5,
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <TextField
            size="small"
            value={registro.oc}
            onChange={(e) =>
              atualizarRegistro('cancelados', registro.id, 'oc', e.target.value)
            }
            placeholder="OC"
          />

          <TextField
            size="small"
            value={registro.carga}
            onChange={(e) =>
              atualizarRegistro('cancelados', registro.id, 'carga', e.target.value)
            }
            placeholder="Carga"
          />

          <TextField
            size="small"
            value={registro.status}
            onChange={(e) =>
              atualizarRegistro('cancelados', registro.id, 'status', e.target.value)
            }
            placeholder="Status"
          />

          <TextField
            size="small"
            value={registro.rota}
            onChange={(e) =>
              atualizarRegistro('cancelados', registro.id, 'rota', e.target.value)
            }
            placeholder="Rota"
          />

          <TextField
            size="small"
            value={registro.motivo}
            onChange={(e) =>
              atualizarRegistro('cancelados', registro.id, 'motivo', e.target.value)
            }
            placeholder="Motivo"
          />

          <TextField
            size="small"
            value={registro.observacoes}
            onChange={(e) =>
              atualizarRegistro(
                'cancelados',
                registro.id,
                'observacoes',
                e.target.value,
              )
            }
            placeholder="Observações"
          />

          <Button
            color="error"
            onClick={() => removerRegistro('cancelados', registro.id)}
            disabled={cancelados.length === 1}
            sx={{ minWidth: 40, width: 40 }}
          >
            <DeleteOutlinedIcon />
          </Button>
        </Box>
      ))}

      <Divider sx={{ mt: 3, mb: 2 }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          Total da amostra: {totalCancelados}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => adicionarRegistro('cancelados')}
        >
          Adicionar linha
        </Button>
      </Box>
    </>
  )

  const renderTabelaCompras = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Amostra de 20 Pedágios Comprados/Confirmados.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 1fr 1.2fr 1.3fr 2fr 50px',
          gap: 1.5,
          alignItems: 'center',
          px: 1,
          mb: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>OC</Typography>
        <Typography sx={{ fontWeight: 600 }}>Carga</Typography>
        <Typography sx={{ fontWeight: 600 }}>Status</Typography>
        <Typography sx={{ fontWeight: 600 }}>Rota</Typography>
        <Typography sx={{ fontWeight: 600 }}>Rota correta?</Typography>
        <Typography sx={{ fontWeight: 600 }}>Observações</Typography>
        <Box />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {compras.map((registro) => (
        <Box
          key={registro.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 1fr 1.2fr 1.3fr 2fr 50px',
            gap: 1.5,
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <TextField
            size="small"
            value={registro.oc}
            onChange={(e) =>
              atualizarRegistro('compras', registro.id, 'oc', e.target.value)
            }
            placeholder="OC"
          />

          <TextField
            size="small"
            value={registro.carga}
            onChange={(e) =>
              atualizarRegistro('compras', registro.id, 'carga', e.target.value)
            }
            placeholder="Carga"
          />

          <TextField
            size="small"
            value={registro.status}
            onChange={(e) =>
              atualizarRegistro('compras', registro.id, 'status', e.target.value)
            }
            placeholder="Status"
          />

          <TextField
            size="small"
            value={registro.rota}
            onChange={(e) =>
              atualizarRegistro('compras', registro.id, 'rota', e.target.value)
            }
            placeholder="Rota"
          />

          <TextField
            size="small"
            value={registro.rotaCorreta}
            onChange={(e) =>
              atualizarRegistro(
                'compras',
                registro.id,
                'rotaCorreta',
                e.target.value,
              )
            }
            placeholder="SIM / OK"
          />

          <TextField
            size="small"
            value={registro.observacoes}
            onChange={(e) =>
              atualizarRegistro(
                'compras',
                registro.id,
                'observacoes',
                e.target.value,
              )
            }
            placeholder="Observações"
          />

          <Button
            color="error"
            onClick={() => removerRegistro('compras', registro.id)}
            disabled={compras.length === 1}
            sx={{ minWidth: 40, width: 40 }}
          >
            <DeleteOutlinedIcon />
          </Button>
        </Box>
      ))}

      <Divider sx={{ mt: 3, mb: 2 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 2,
          px: 1,
          py: 1.5,
          borderRadius: 1,
          bgcolor: 'action.hover',
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>Critério</Typography>
        <Typography sx={{ fontWeight: 600 }}>Corretos</Typography>
        <Typography sx={{ fontWeight: 600 }}>Total</Typography>
        <Typography sx={{ fontWeight: 600 }}>Percentual</Typography>

        <Typography>Rota correta?</Typography>
        <Typography>{corretosRotaCompras}</Typography>
        <Typography>{totalCompras}</Typography>
        <Typography>
          {percentual(corretosRotaCompras, totalCompras)}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => adicionarRegistro('compras')}
        >
          Adicionar linha
        </Button>
      </Box>
    </>
  )

  // ============================================================
  // TELA
  // ============================================================

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Papel de Trabalho 08
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Conferência Pedágio
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/auditorias/${id}`)}
        >
          Voltar
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Período Analisado
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
            }}
          >
            <TextField
              label="Data inicial"
              type="date"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Data final"
              type="date"
              value={periodoFim}
              onChange={(e) => setPeriodoFim(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Conferência de Pedágio
          </Typography>

          <Tabs
            value={aba}
            onChange={(_, novaAba) => setAba(novaAba)}
            sx={{ mb: 3 }}
          >
            <Tab label="Pedágios cancelados" />
            <Tab label="Compras realizadas" />
          </Tabs>

          {aba === 0 ? renderTabelaCancelados() : renderTabelaCompras()}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Resultado
          </Typography>

          <TextField
            select
            fullWidth
            label="Resultado da conferência"
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
          >
            <MenuItem value="De acordo">De acordo</MenuItem>
            <MenuItem value="Parcialmente de acordo">
              Parcialmente de acordo
            </MenuItem>
            <MenuItem value="Desacordo">Desacordo</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Observações
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Informe observações da conferência..."
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Providência Aplicada
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={providenciaAplicada}
            onChange={(e) => setProvidenciaAplicada(e.target.value)}
            placeholder="Descreva a providência aplicada..."
          />
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<SaveOutlinedIcon />}
          onClick={() => salvar('rascunho')}
        >
          Salvar rascunho
        </Button>

        <Button
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={() => salvar('finalizado')}
        >
          Finalizar PT08
        </Button>
      </Box>
    </Box>
  )
}

export default PT08