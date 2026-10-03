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

type RegistroFalta = {
  id: number
  numeroNF: string
  produto: string
  dataDesc: string
  quantidadeFalta: string
  boletimEmitido: string
  dataEnvioBoletim: string
  diasAtraso: string
  boletimCorreto: string
}

type PT10Data = {
  registros: RegistroFalta[]
  responsavel: string
  data: string
  resultado: Resultado
  observacoes: string
  providenciaAplicada: string
  status: 'rascunho' | 'finalizado'
}

const criarLinha = (id: number): RegistroFalta => ({
  id,
  numeroNF: '',
  produto: '',
  dataDesc: '',
  quantidadeFalta: '',
  boletimEmitido: '',
  dataEnvioBoletim: '',
  diasAtraso: '',
  boletimCorreto: '',
})

function PT10() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [registros, setRegistros] = useState<
    RegistroFalta[]
  >(
    Array.from(
      { length: 20 },
      (_, index) => criarLinha(index + 1),
    ),
  )

  const [responsavel, setResponsavel] = useState('')
  const [data, setData] = useState('')

  const [resultado, setResultado] =
    useState<Resultado>('De acordo')

  const [observacoes, setObservacoes] = useState('')
  const [providenciaAplicada, setProvidenciaAplicada] =
    useState('')

  useEffect(() => {
    if (!id) return

    const salvo = localStorage.getItem(
      `auditoria_${id}_pt10`,
    )

    if (!salvo) return

    try {
      const dados: PT10Data = JSON.parse(salvo)

      if (dados.registros) {
        setRegistros(dados.registros)
      }

      if (dados.responsavel) {
        setResponsavel(dados.responsavel)
      }

      if (dados.data) {
        setData(dados.data)
      }

      if (dados.resultado) {
        setResultado(dados.resultado)
      }

      if (dados.observacoes) {
        setObservacoes(dados.observacoes)
      }

      if (dados.providenciaAplicada) {
        setProvidenciaAplicada(
          dados.providenciaAplicada,
        )
      }
    } catch {
      console.error('Erro ao carregar PT10.')
    }
  }, [id])

  const atualizarRegistro = (
    registroId: number,
    campo: keyof RegistroFalta,
    valor: string,
  ) => {
    setRegistros((atual) =>
      atual.map((registro) => {
        if (registro.id !== registroId) {
          return registro
        }

        return {
          ...registro,
          [campo]: valor,
        }
      }),
    )
  }

  const adicionarRegistro = () => {
    const novoId =
      registros.length > 0
        ? Math.max(
            ...registros.map(
              (registro) => registro.id,
            ),
          ) + 1
        : 1

    setRegistros((atual) => [
      ...atual,
      criarLinha(novoId),
    ])
  }

  const removerRegistro = (
    registroId: number,
  ) => {
    setRegistros((atual) =>
      atual.filter(
        (registro) =>
          registro.id !== registroId,
      ),
    )
  }

  const salvar = (
    status: 'rascunho' | 'finalizado',
  ) => {
    if (!id) return

    const dados: PT10Data = {
      registros,
      responsavel,
      data,
      resultado,
      observacoes,
      providenciaAplicada,
      status,
    }

    localStorage.setItem(
      `auditoria_${id}_pt10`,
      JSON.stringify(dados),
    )

    alert(
      status === 'rascunho'
        ? 'PT10 salvo como rascunho.'
        : 'PT10 finalizado.',
    )
  }

  return (
    <Box>
      {/* CABEÇALHO */}

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
            Papel de Trabalho 10
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Faltas de Produto
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate(`/auditorias/${id}`)
          }
        >
          Voltar
        </Button>
      </Box>

      {/* TABELA */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Análise das Faltas de Produto
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Analise as 20 notas selecionadas com falta
            de produto e confira se o boletim foi
            emitido e se o e-mail foi enviado.
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 1550 }}>
              {/* CABEÇALHO DA TABELA */}

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    '100px 180px 120px 120px 150px 130px 150px 170px 50px',
                  gap: 1.5,
                  alignItems: 'center',
                  mb: 1,
                  px: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Número NF
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Produto
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Data Desc.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Quant. Falta
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Boletim Emitido?
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Data Envio Bol.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Dias Atraso P/ Envio
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Boletim Emitido Correto?
                </Typography>

                <Box />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* LINHAS */}

              {registros.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      '100px 180px 120px 120px 150px 130px 150px 170px 50px',
                    gap: 1.5,
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <TextField
                    size="small"
                    value={item.numeroNF}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'numeroNF',
                        e.target.value,
                      )
                    }
                    placeholder="NF"
                  />

                  <TextField
                    size="small"
                    value={item.produto}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'produto',
                        e.target.value,
                      )
                    }
                    placeholder="Produto"
                  />

                  <TextField
                    size="small"
                    type="date"
                    value={item.dataDesc}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'dataDesc',
                        e.target.value,
                      )
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  <TextField
                    size="small"
                    type="number"
                    value={item.quantidadeFalta}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'quantidadeFalta',
                        e.target.value,
                      )
                    }
                    placeholder="Qtd."
                  />

                  <TextField
                    select
                    size="small"
                    value={item.boletimEmitido}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'boletimEmitido',
                        e.target.value,
                      )
                    }
                  >
                    <MenuItem value="">
                      Selecione
                    </MenuItem>

                    <MenuItem value="SIM">
                      SIM
                    </MenuItem>

                    <MenuItem value="NÃO">
                      NÃO
                    </MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    type="date"
                    value={item.dataEnvioBoletim}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'dataEnvioBoletim',
                        e.target.value,
                      )
                    }
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  <TextField
                    size="small"
                    type="number"
                    value={item.diasAtraso}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'diasAtraso',
                        e.target.value,
                      )
                    }
                    placeholder="Dias"
                  />

                  <TextField
                    select
                    size="small"
                    value={item.boletimCorreto}
                    onChange={(e) =>
                      atualizarRegistro(
                        item.id,
                        'boletimCorreto',
                        e.target.value,
                      )
                    }
                  >
                    <MenuItem value="">
                      Selecione
                    </MenuItem>

                    <MenuItem value="SIM">
                      SIM
                    </MenuItem>

                    <MenuItem value="NÃO">
                      NÃO
                    </MenuItem>
                  </TextField>

                  <Button
                    color="error"
                    onClick={() =>
                      removerRegistro(item.id)
                    }
                    disabled={registros.length === 1}
                    sx={{
                      minWidth: 40,
                      width: 40,
                    }}
                  >
                    <DeleteOutlinedIcon />
                  </Button>
                </Box>
              ))}

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={adicionarRegistro}
                >
                  Adicionar linha
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* LEVANTAMENTO */}

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
              onChange={(e) =>
                setResponsavel(e.target.value)
              }
            />

            <TextField
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
          </Box>
        </CardContent>
      </Card>

      {/* RESULTADO */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Resultado
          </Typography>

          <TextField
            select
            fullWidth
            label="Resultado da conferência"
            value={resultado}
            onChange={(e) =>
              setResultado(
                e.target.value as Resultado,
              )
            }
          >
            <MenuItem value="De acordo">
              De acordo
            </MenuItem>

            <MenuItem value="Parcialmente de acordo">
              Parcialmente de acordo
            </MenuItem>

            <MenuItem value="Desacordo">
              Desacordo
            </MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {/* OBSERVAÇÕES */}

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
            minRows={4}
            value={observacoes}
            onChange={(e) =>
              setObservacoes(e.target.value)
            }
            placeholder="Informe observações da conferência..."
          />
        </CardContent>
      </Card>

      {/* PROVIDÊNCIA */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Providência Aplicada
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={providenciaAplicada}
            onChange={(e) =>
              setProvidenciaAplicada(
                e.target.value,
              )
            }
            placeholder="Descreva a providência aplicada..."
          />
        </CardContent>
      </Card>

      {/* BOTÕES */}

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
          onClick={() =>
            salvar('rascunho')
          }
        >
          Salvar rascunho
        </Button>

        <Button
          variant="contained"
          startIcon={
            <CheckCircleOutlineIcon />
          }
          onClick={() =>
            salvar('finalizado')
          }
        >
          Finalizar PT10
        </Button>
      </Box>
    </Box>
  )
}

export default PT10
