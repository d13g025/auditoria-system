import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
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
  email: string
  usuario: string
}

type PT12Data = {
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
  email: '',
  usuario: '',
})

function PT12() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [registros, setRegistros] = useState<Registro[]>(
    Array.from({ length: 10 }, (_, index) => criarLinha(index + 1)),
  )
  const [responsavel, setResponsavel] = useState('')
  const [data, setData] = useState('')
  const [resultado, setResultado] = useState<Resultado>('De acordo')
  const [observacoes, setObservacoes] = useState('')
  const [providenciaAplicada, setProvidenciaAplicada] = useState('')

  useEffect(() => {
    if (!id) return

    const salvo = localStorage.getItem(`auditoria_${id}_pt12`)
    if (!salvo) return

    try {
      const dados: PT12Data = JSON.parse(salvo)

      if (dados.registros) setRegistros(dados.registros)
      if (dados.responsavel) setResponsavel(dados.responsavel)
      if (dados.data) setData(dados.data)
      if (dados.resultado) setResultado(dados.resultado)
      if (dados.observacoes) setObservacoes(dados.observacoes)
      if (dados.providenciaAplicada) {
        setProvidenciaAplicada(dados.providenciaAplicada)
      }
    } catch {
      console.error('Erro ao carregar PT12.')
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

    const dados: PT12Data = {
      registros,
      responsavel,
      data,
      resultado,
      observacoes,
      providenciaAplicada,
      status,
    }

    localStorage.setItem(`auditoria_${id}_pt12`, JSON.stringify(dados))

    alert(
      status === 'rascunho'
        ? 'PT12 salvo como rascunho.'
        : 'PT12 finalizado.',
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
            Papel de Trabalho 12
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conferência E-mail Corporativo
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
            Listagem de E-mails Corporativos
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Confira os endereços de e-mail corporativos e o respectivo usuário.
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 850 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 50px',
                  gap: 1.5,
                  alignItems: 'center',
                  mb: 1,
                  px: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  E-mail
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Usuário
                </Typography>

                <Box />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {registros.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 50px',
                    gap: 1.5,
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <TextField
                    size="small"
                    type="email"
                    value={item.email}
                    onChange={(e) =>
                      atualizarRegistro(item.id, 'email', e.target.value)
                    }
                    placeholder="e-mail corporativo"
                  />

                  <TextField
                    size="small"
                    value={item.usuario}
                    onChange={(e) =>
                      atualizarRegistro(item.id, 'usuario', e.target.value)
                    }
                    placeholder="Usuário"
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
            <option value="De acordo">De acordo</option>
            <option value="Parcialmente de acordo">
              Parcialmente de acordo
            </option>
            <option value="Desacordo">Desacordo</option>
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
          Finalizar PT12
        </Button>
      </Box>
    </Box>
  )
}

export default PT12
