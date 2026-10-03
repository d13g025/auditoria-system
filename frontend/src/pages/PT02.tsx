import { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

type Resultado =
  | ''
  | 'acordo'
  | 'parcial'
  | 'desacordo'

type Bloco = {
  id: number
  nome: string

  filialInicial: string
  filialFinal: string

  controleInicial: string
  controleFinal: string

  resultado: Resultado
  observacao: string

  arquivo: File | null
}

function calcularQuantidade(
  inicial: string,
  final: string,
) {
  if (!inicial || !final) {
    return ''
  }

  const numeroInicial = Number(inicial)
  const numeroFinal = Number(final)

  if (
    Number.isNaN(numeroInicial) ||
    Number.isNaN(numeroFinal)
  ) {
    return ''
  }

  if (numeroFinal < numeroInicial) {
    return ''
  }

  return String(
    numeroFinal - numeroInicial + 1,
  )
}

function PT02() {
  const [blocos, setBlocos] = useState<Bloco[]>([
    {
      id: 1,
      nome: '',
      filialInicial: '',
      filialFinal: '',
      controleInicial: '',
      controleFinal: '',
      resultado: '',
      observacao: '',
      arquivo: null,
    },
  ])

  const adicionarBloco = () => {
    if (blocos.length >= 5) {
      return
    }

    const novoId =
      Math.max(
        ...blocos.map((bloco) => bloco.id),
        0,
      ) + 1

    setBlocos([
      ...blocos,
      {
        id: novoId,
        nome: '',
        filialInicial: '',
        filialFinal: '',
        controleInicial: '',
        controleFinal: '',
        resultado: '',
        observacao: '',
        arquivo: null,
      },
    ])
  }

  const removerBloco = (id: number) => {
    if (blocos.length === 1) {
      return
    }

    setBlocos(
      blocos.filter(
        (bloco) => bloco.id !== id,
      ),
    )
  }

  const atualizarBloco = (
    id: number,
    campo: keyof Bloco,
    valor: string | File | null,
  ) => {
    setBlocos(
      blocos.map((bloco) =>
        bloco.id === id
          ? {
              ...bloco,
              [campo]: valor,
            }
          : bloco,
      ),
    )
  }

  const verificarNumeracao = (
    bloco: Bloco,
  ) => {
    const filialInicial = Number(
      bloco.filialInicial,
    )

    const filialFinal = Number(
      bloco.filialFinal,
    )

    const controleInicial = Number(
      bloco.controleInicial,
    )

    const controleFinal = Number(
      bloco.controleFinal,
    )

    if (
      !bloco.filialInicial ||
      !bloco.filialFinal ||
      !bloco.controleInicial ||
      !bloco.controleFinal
    ) {
      return null
    }

    if (
      Number.isNaN(filialInicial) ||
      Number.isNaN(filialFinal) ||
      Number.isNaN(controleInicial) ||
      Number.isNaN(controleFinal)
    ) {
      return null
    }

    const filialOk =
      filialInicial === controleInicial &&
      filialFinal === controleFinal

    return filialOk
  }

  return (
    <Box>
      {/* Cabeçalho */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          PT 02 — Formulário de Segurança
        </Typography>

        <Typography color="text.secondary">
          Conferência da sequência dos formulários
          de segurança com o controle interno.
        </Typography>
      </Box>

      {/* Blocos */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                Sequências de formulários
              </Typography>

              <Typography
                color="text.secondary"
              >
                Cadastre os blocos existentes na
                filial e compare com o controle
                interno.
              </Typography>
            </Box>

            {blocos.length < 5 && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={adicionarBloco}
              >
                Adicionar bloco
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: 3,
            }}
          >
            {blocos.map((bloco, index) => {
              const quantidadeFilial =
                calcularQuantidade(
                  bloco.filialInicial,
                  bloco.filialFinal,
                )

              const quantidadeControle =
                calcularQuantidade(
                  bloco.controleInicial,
                  bloco.controleFinal,
                )

              const numeracao =
                verificarNumeracao(bloco)

              return (
                <Box
                  key={bloco.id}
                  sx={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  {/* Cabeçalho do bloco */}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Bloco {String(index + 1).padStart(2, '0')}
                    </Typography>

                    {blocos.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() =>
                          removerBloco(
                            bloco.id,
                          )
                        }
                        aria-label="Remover bloco"
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    )}
                  </Box>

                  <TextField
                    label="Nome / identificação do bloco"
                    placeholder="Ex.: Formulários 001 a 050"
                    value={bloco.nome}
                    onChange={(event) =>
                      atualizarBloco(
                        bloco.id,
                        'nome',
                        event.target.value,
                      )
                    }
                    fullWidth
                    sx={{ mb: 3 }}
                  />

                  {/* Controle da filial */}

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Controle da filial
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1fr 1fr 1fr',
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Nº inicial"
                      type="number"
                      value={
                        bloco.filialInicial
                      }
                      onChange={(event) =>
                        atualizarBloco(
                          bloco.id,
                          'filialInicial',
                          event.target.value,
                        )
                      }
                    />

                    <TextField
                      label="Nº final"
                      type="number"
                      value={
                        bloco.filialFinal
                      }
                      onChange={(event) =>
                        atualizarBloco(
                          bloco.id,
                          'filialFinal',
                          event.target.value,
                        )
                      }
                    />

                    <TextField
                      label="Quantidade"
                      value={
                        quantidadeFilial
                      }
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Controle interno */}

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Controle interno
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1fr 1fr 1fr',
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Nº inicial"
                      type="number"
                      value={
                        bloco.controleInicial
                      }
                      onChange={(event) =>
                        atualizarBloco(
                          bloco.id,
                          'controleInicial',
                          event.target.value,
                        )
                      }
                    />

                    <TextField
                      label="Nº final"
                      type="number"
                      value={
                        bloco.controleFinal
                      }
                      onChange={(event) =>
                        atualizarBloco(
                          bloco.id,
                          'controleFinal',
                          event.target.value,
                        )
                      }
                    />

                    <TextField
                      label="Quantidade"
                      value={
                        quantidadeControle
                      }
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                    />
                  </Box>

                  {/* Resultado automático da comparação */}

                  {numeracao !== null && (
                    <Box sx={{ mt: 3 }}>
                      {numeracao ? (
                        <Chip
                          label="Numeração de acordo"
                          color="success"
                        />
                      ) : (
                        <Chip
                          label="Divergência na numeração"
                          color="warning"
                        />
                      )}
                    </Box>
                  )}

                  {/* Resultado do auditor */}

                  <FormControl
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    <InputLabel
                      id={`resultado-bloco-${bloco.id}`}
                    >
                      Resultado
                    </InputLabel>

                    <Select
                      labelId={`resultado-bloco-${bloco.id}`}
                      label="Resultado"
                      value={bloco.resultado}
                      onChange={(event) =>
                        atualizarBloco(
                          bloco.id,
                          'resultado',
                          event.target.value,
                        )
                      }
                    >
                      <MenuItem value="acordo">
                        De acordo
                      </MenuItem>

                      <MenuItem value="parcial">
                        Parcialmente de acordo
                      </MenuItem>

                      <MenuItem value="desacordo">
                        Em desacordo
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {/* Observação */}

                  <TextField
                    label="Observação"
                    multiline
                    minRows={3}
                    value={bloco.observacao}
                    onChange={(event) =>
                      atualizarBloco(
                        bloco.id,
                        'observacao',
                        event.target.value,
                      )
                    }
                    fullWidth
                    sx={{ mt: 2 }}
                  />

                  {/* Evidência */}

                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Evidência (opcional)
                    </Typography>

                    <Button
                      variant="outlined"
                      component="label"
                    >
                      Anexar arquivo

                      <input
                        type="file"
                        hidden
                        onChange={(event) => {
                          const arquivo =
                            event.target
                              .files?.[0] ??
                            null

                          atualizarBloco(
                            bloco.id,
                            'arquivo',
                            arquivo,
                          )
                        }}
                      />
                    </Button>

                    {bloco.arquivo && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        📎 {bloco.arquivo.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Observações gerais */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            Observações gerais
          </Typography>

          <TextField
            label="Observações da conferência"
            multiline
            minRows={4}
            fullWidth
          />
        </CardContent>
      </Card>

      {/* Providência */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            Providência aplicada
          </Typography>

          <TextField
            label="Providência aplicada"
            multiline
            minRows={4}
            fullWidth
          />
        </CardContent>
      </Card>

      {/* Ações */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          pb: 4,
        }}
      >
        <Button variant="outlined">
          Salvar rascunho
        </Button>

        <Button variant="contained">
          Finalizar PT 02
        </Button>
      </Box>
    </Box>
  )
}

export default PT02