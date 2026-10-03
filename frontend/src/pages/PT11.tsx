import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import { useNavigate, useParams } from 'react-router-dom'

type Resultado =
  | 'De acordo'
  | 'Parcialmente de acordo'
  | 'Desacordo'

type Registro = {
  id: number
  numeroNFe: string
  dataNFe: string
  operacao: string
  numeroMDFe: string
  dataMDFe: string
}

type PT11Data = {
  registros: Registro[]
  responsavel: string
  data: string
  resultado: Resultado
  observacoes: string
  providenciaAplicada: string
  status: 'rascunho' | 'finalizado'
}

const criarLinha = (id: number): Registro => ({
  id,
  numeroNFe: '',
  dataNFe: '',
  operacao: 'S',
  numeroMDFe: '',
  dataMDFe: '',
})

function PT11() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [registros, setRegistros] = useState<Registro[]>(
    Array.from({ length: 20 }, (_, index) => criarLinha(index + 1)),
  )
  const [responsavel, setResponsavel] = useState('')
  const [data, setData] = useState('')
  const [resultado, setResultado] = useState<Resultado>('De acordo')
  const [observacoes, setObservacoes] = useState('')
  const [providenciaAplicada, setProvidenciaAplicada] = useState('')

  useEffect(() => {
    if (!id) return

    const salvo = localStorage.getItem(`auditoria_${id}_pt11`)
    if (!salvo) return

    try {
      const dados: PT11Data = JSON.parse(salvo)

      if (dados.registros) setRegistros(dados.registros)
      if (dados.responsavel) setResponsavel(dados.responsavel)
      if (dados.data) setData(dados.data)
      if (dados.resultado) setResultado(dados.resultado)
      if (dados.observacoes) setObservacoes(dados.observacoes)
      if (dados.providenciaAplicada) {
        setProvidenciaAplicada(dados.providenciaAplicada)
      }
    } catch {
      console.error('Erro ao carregar PT11.')
    }
  }, [id])

  const atualizarRegistro = (
    registroId: number,
    campo: keyof Registro,
    valor: string,
  ) => {
    setRegistros((atual) =>
      atual.map((registro) =>
        registro.id === registroId
          ? { ...registro, [campo]: valor }
          : registro,
      ),
    )
  }

  const adicionarRegistro = () => {
    const novoId =
      registros.length > 0
        ? Math.max(...registros.map((registro) => registro.id)) + 1
        : 1

    setRegistros((atual) => [...atual, criarLinha(novoId)])
  }

  const removerRegistro = (registroId: number) => {
    setRegistros((atual) =>
      atual.filter((registro) => registro.id !== registroId),
    )
  }

  const salvar = (status: 'rascunho' | 'finalizado') => {
    if (!id) return

    const dados: PT11Data = {
      registros,
      responsavel,
      data,
      resultado,
      observacoes,
      providenciaAplicada,
      status,
    }

    localStorage.setItem(`auditoria_${id}_pt11`, JSON.stringify(dados))

    alert(
      status === 'rascunho'
        ? 'PT11 salvo como rascunho.'
        : 'PT11 finalizado.',
    )
  }

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
            Papel de Trabalho 11
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conferência Emissão/Encerramento MDF-e
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
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Amostragem Emissão/Encerramento MDF-e
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Confira as NF-e selecionadas e verifique a emissão e o encerramento
            do MDF-e correspondente.
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 1100 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 140px 120px 140px 140px 50px',
                  gap: 1.5,
                  alignItems: 'center',
                  mb: 1,
                  px: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Nº NF-e
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Data NF-e
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Operação
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Nº MDF-e
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Data MDF-e
                </Typography>
                <Box />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {registros.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '120px 140px 120px 140px 140px 50px',
                    gap: 1.5,
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <TextField
                    size="small"
                    value={item.numeroNFe}
                    onChange={(e) =>
                      atualizarRegistro(item.id, 'numeroNFe', e.target.value)
                    }
                    placeholder="NF-e"
                  />

                  <TextField
                    size="small"
                    type="date"
                    value={item.dataNFe}
                    onChange={(e) =>
                      atualizarRegistro(item.id, 'dataNFe', e.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  <TextField
                    select
                    size="small"
                    value={item.operacao}
                    onChange={(e) =>
                      atualizarRegistro(item.id, 'operacao', e.target.value)
                    }
                  >
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="E">E</MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    value={item.numeroMDFe}
                    onChange={(e) =>
                      atualizarRegistro(item.id, 'numeroMDFe', e.target.value)
                    }
                    placeholder="MDF-e"
                  />

                  <TextField
                    size="small"
                    type="date"
                    value={item.dataMDFe}
                    onChange={(e) =>
                      atualizarRegistro(item.id, 'dataMDFe', e.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  <Button
                    color="error"
                    onClick={() => removerRegistro(item.id)}
                    disabled={registros.length === 1}
                    sx={{ minWidth: 40, width: 40 }}
                  >
                    <DeleteOutlinedIcon />
                  </Button>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={adicionarRegistro}
                sx={{ mt: 1 }}
              >
                Adicionar linha
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Levantamento
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 2,
            }}
          >
            <TextField
              label="Levantamento realizado por"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            />

            <TextField
              label="Data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
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
            onChange={(e) => setResultado(e.target.value as Resultado)}
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
          Finalizar PT11
        </Button>
      </Box>
    </Box>
  )
}

export default PT11
