import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'

import { useNavigate, useParams } from 'react-router-dom'

type Celular = {
  usuario: string
  imei: string
  modelo: string
}

const criarCelulares = (): Celular[] =>
  Array.from({ length: 10 }, () => ({
    usuario: '',
    imei: '',
    modelo: '',
  }))

function PT04() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [celulares, setCelulares] = useState<Celular[]>(
    criarCelulares,
  )

  const [responsavel, setResponsavel] = useState('')
  const [data, setData] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const atualizarCelular = (
    index: number,
    campo: keyof Celular,
    valor: string,
  ) => {
    setCelulares((atual) =>
      atual.map((celular, i) =>
        i === index
          ? {
              ...celular,
              [campo]: valor,
            }
          : celular,
      ),
    )
  }

  const salvarRascunho = () => {
    if (!id) return

    const dados = {
      celulares,
      responsavel,
      data,
      observacoes,
      status: 'rascunho',
    }

    localStorage.setItem(
      `auditoria_${id}_pt04`,
      JSON.stringify(dados),
    )

    alert('PT04 salvo como rascunho.')
  }

  const finalizar = () => {
    if (!id) return

    const dados = {
      celulares,
      responsavel,
      data,
      observacoes,
      status: 'finalizado',
    }

    localStorage.setItem(
      `auditoria_${id}_pt04`,
      JSON.stringify(dados),
    )

    alert('PT04 finalizado.')
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600 }}
          >
            Papel de Trabalho 04
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Conferência Celulares
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

      {/* Introdução */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Numeração de linhas Corporativas
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Informe os dados dos aparelhos e usuários
            vinculados às linhas corporativas.
          </Typography>
        </CardContent>
      </Card>

      {/* Tabela de celulares */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Cabeçalho da tabela */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '80px 1fr 1fr 1fr',
              gap: 2,
              mb: 2,
              px: 1,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              Linha
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>
              Usuário
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>
              IMEI
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>
              Modelo Aparelho
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {celulares.map((celular, index) => (
            <Box
              key={index}
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  '80px 1fr 1fr 1fr',
                gap: 2,
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  px: 1,
                  fontWeight: 500,
                }}
              >
                Linha{' '}
                {String(index + 1).padStart(2, '0')}:
              </Typography>

              <TextField
                size="small"
                fullWidth
                value={celular.usuario}
                onChange={(e) =>
                  atualizarCelular(
                    index,
                    'usuario',
                    e.target.value,
                  )
                }
                placeholder="Usuário"
              />

              <TextField
                size="small"
                fullWidth
                value={celular.imei}
                onChange={(e) =>
                  atualizarCelular(
                    index,
                    'imei',
                    e.target.value,
                  )
                }
                placeholder="IMEI"
              />

              <TextField
                size="small"
                fullWidth
                value={celular.modelo}
                onChange={(e) =>
                  atualizarCelular(
                    index,
                    'modelo',
                    e.target.value,
                  )
                }
                placeholder="Modelo do aparelho"
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Levantamento */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Levantamento
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Levantamento realizado por"
                value={responsavel}
                onChange={(e) =>
                  setResponsavel(e.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={data}
                onChange={(e) =>
                  setData(e.target.value)
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Observações
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={5}
            value={observacoes}
            onChange={(e) =>
              setObservacoes(e.target.value)
            }
            placeholder="Informe observações relevantes da conferência..."
          />
        </CardContent>
      </Card>

      {/* Botões */}
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
          onClick={salvarRascunho}
        >
          Salvar rascunho
        </Button>

        <Button
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={finalizar}
        >
          Finalizar PT04
        </Button>
      </Box>
    </Box>
  )
}

export default PT04