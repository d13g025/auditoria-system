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

type Resultado = '' | 'acordo' | 'parcial' | 'desacordo'

type Cartao = {
  id: number
  nome: string
  saldoSistema: string
  saldoFisico: string
  resultado: Resultado
  observacao: string
}

function calcularDiferenca(
  sistema: string,
  fisico: string,
) {
  if (!sistema || !fisico) {
    return ''
  }

  const valorSistema = Number(
    sistema.replace(',', '.'),
  )

  const valorFisico = Number(
    fisico.replace(',', '.'),
  )

  if (
    Number.isNaN(valorSistema) ||
    Number.isNaN(valorFisico)
  ) {
    return ''
  }

  return (valorFisico - valorSistema).toFixed(2)
}

function formatarDiferenca(valor: string) {
  if (!valor) {
    return '-'
  }

  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function diferencaEhZero(valor: string) {
  if (!valor) {
    return false
  }

  return Number(valor) === 0
}

function PT01() {
  const [saldoDinheiroSistema, setSaldoDinheiroSistema] =
    useState('')

  const [saldoDinheiroFisico, setSaldoDinheiroFisico] =
    useState('')

  const [resultadoDinheiro, setResultadoDinheiro] =
    useState<Resultado>('')

  const [observacaoDinheiro, setObservacaoDinheiro] =
    useState('')

  const [cartoes, setCartoes] = useState<Cartao[]>([
    {
      id: 1,
      nome: '',
      saldoSistema: '',
      saldoFisico: '',
      resultado: '',
      observacao: '',
    },
  ])

  const [arquivo, setArquivo] =
    useState<File | null>(null)

  const [resultadoExtrato, setResultadoExtrato] =
    useState<Resultado>('')

  const [observacaoExtrato, setObservacaoExtrato] =
    useState('')

  const [fechamentos, setFechamentos] =
    useState(
      Array.from({ length: 6 }, () => ({
        mesReferencia: '',
        prazoEnvio: '',
        dataEnviada: '',
      })),
    )

  const [observacoesGerais, setObservacoesGerais] =
    useState('')

  const [providencia, setProvidencia] =
    useState('')

  const diferencaDinheiro =
    calcularDiferenca(
      saldoDinheiroSistema,
      saldoDinheiroFisico,
    )

  const adicionarCartao = () => {
    if (cartoes.length >= 4) {
      return
    }

    const novoId =
      Math.max(
        ...cartoes.map((cartao) => cartao.id),
        0,
      ) + 1

    setCartoes([
      ...cartoes,
      {
        id: novoId,
        nome: '',
        saldoSistema: '',
        saldoFisico: '',
        resultado: '',
        observacao: '',
      },
    ])
  }

  const removerCartao = (id: number) => {
    if (cartoes.length === 1) {
      return
    }

    setCartoes(
      cartoes.filter(
        (cartao) => cartao.id !== id,
      ),
    )
  }

  const atualizarCartao = (
    id: number,
    campo: keyof Cartao,
    valor: string,
  ) => {
    setCartoes(
      cartoes.map((cartao) =>
        cartao.id === id
          ? {
              ...cartao,
              [campo]: valor,
            }
          : cartao,
      ),
    )
  }

  const atualizarFechamento = (
    index: number,
    campo:
      | 'mesReferencia'
      | 'prazoEnvio'
      | 'dataEnviada',
    valor: string,
  ) => {
    setFechamentos((atuais) =>
      atuais.map((fechamento, i) =>
        i === index
          ? {
              ...fechamento,
              [campo]: valor,
            }
          : fechamento,
      ),
    )
  }

  const calcularDiasAtraso = (
    prazo: string,
    enviado: string,
  ) => {
    if (!prazo || !enviado) {
      return ''
    }

    const dataPrazo = new Date(`${prazo}T00:00:00`)
    const dataEnviado = new Date(
      `${enviado}T00:00:00`,
    )

    const diferenca =
      dataEnviado.getTime() -
      dataPrazo.getTime()

    const dias = Math.ceil(
      diferenca /
        (1000 * 60 * 60 * 24),
    )

    return String(Math.max(0, dias))
  }

  const obterSituacaoFechamento = (
    prazo: string,
    enviado: string,
  ) => {
    if (!prazo || !enviado) {
      return ''
    }

    const atraso = Number(
      calcularDiasAtraso(
        prazo,
        enviado,
      ),
    )

    return atraso > 0
      ? 'Em atraso'
      : 'Dentro do prazo'
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
          PT 01 — Conferência Caixa Financeiro
        </Typography>

        <Typography color="text.secondary">
          Conferência dos saldos de caixa,
          lançamentos e fechamento mensal.
        </Typography>
      </Box>

      {/* 1. Saldos */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            1. Conferência dos saldos
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Compare os saldos apresentados no
            sistema com a conferência física.
          </Typography>

          {/* Dinheiro */}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Caixa em dinheiro
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap: 2,
            }}
          >
            <TextField
              label="Saldo do sistema"
              type="number"
              value={saldoDinheiroSistema}
              onChange={(event) =>
                setSaldoDinheiroSistema(
                  event.target.value,
                )
              }
              slotProps={{
                htmlInput: {
                  step: '0.01',
                },
              }}
            />

            <TextField
              label="Saldo físico"
              type="number"
              value={saldoDinheiroFisico}
              onChange={(event) =>
                setSaldoDinheiroFisico(
                  event.target.value,
                )
              }
              slotProps={{
                htmlInput: {
                  step: '0.01',
                },
              }}
            />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Diferença
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                {formatarDiferenca(
                  diferencaDinheiro,
                )}
              </Typography>

              {diferencaEhZero(
                diferencaDinheiro,
              ) && (
                <Chip
                  label="Sem diferença"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="resultado-dinheiro-label">
                Resultado
              </InputLabel>

              <Select
                labelId="resultado-dinheiro-label"
                label="Resultado"
                value={resultadoDinheiro}
                onChange={(event) =>
                  setResultadoDinheiro(
                    event.target.value as Resultado,
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
          </Box>

          <TextField
            label="Observação"
            multiline
            minRows={2}
            value={observacaoDinheiro}
            onChange={(event) =>
              setObservacaoDinheiro(
                event.target.value,
              )
            }
            fullWidth
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 4 }} />

          {/* Cartões */}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600 }}
              >
                Caixa cartão
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Adicione somente os cartões existentes
                na filial.
              </Typography>
            </Box>

            {cartoes.length < 4 && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={adicionarCartao}
              >
                Adicionar cartão
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {cartoes.map((cartao, index) => {
              const diferenca =
                calcularDiferenca(
                  cartao.saldoSistema,
                  cartao.saldoFisico,
                )

              return (
                <Box
                  key={cartao.id}
                  sx={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    p: 3,
                  }}
                >
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
                      sx={{ fontWeight: 600 }}
                    >
                      Cartão {index + 1}
                    </Typography>

                    {cartoes.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() =>
                          removerCartao(
                            cartao.id,
                          )
                        }
                        aria-label="Remover cartão"
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    )}
                  </Box>

                  <TextField
                    label="Nome do cartão"
                    placeholder="Ex.: Comercial"
                    value={cartao.nome}
                    onChange={(event) =>
                      atualizarCartao(
                        cartao.id,
                        'nome',
                        event.target.value,
                      )
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(3, 1fr)',
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Saldo do sistema"
                      type="number"
                      value={
                        cartao.saldoSistema
                      }
                      onChange={(event) =>
                        atualizarCartao(
                          cartao.id,
                          'saldoSistema',
                          event.target.value,
                        )
                      }
                      slotProps={{
                        htmlInput: {
                          step: '0.01',
                        },
                      }}
                    />

                    <TextField
                      label="Saldo físico"
                      type="number"
                      value={
                        cartao.saldoFisico
                      }
                      onChange={(event) =>
                        atualizarCartao(
                          cartao.id,
                          'saldoFisico',
                          event.target.value,
                        )
                      }
                      slotProps={{
                        htmlInput: {
                          step: '0.01',
                        },
                      }}
                    />

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Diferença
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {formatarDiferenca(
                          diferenca,
                        )}
                      </Typography>

                      {diferencaEhZero(
                        diferenca,
                      ) && (
                        <Chip
                          label="Sem diferença"
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Box>

                  <FormControl
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    <InputLabel
                      id={`resultado-cartao-${cartao.id}`}
                    >
                      Resultado
                    </InputLabel>

                    <Select
                      labelId={`resultado-cartao-${cartao.id}`}
                      label="Resultado"
                      value={cartao.resultado}
                      onChange={(event) =>
                        atualizarCartao(
                          cartao.id,
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

                  <TextField
                    label="Observação"
                    multiline
                    minRows={2}
                    value={cartao.observacao}
                    onChange={(event) =>
                      atualizarCartao(
                        cartao.id,
                        'observacao',
                        event.target.value,
                      )
                    }
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </Box>
              )
            })}
          </Box>
        </CardContent>
      </Card>

      {/* 2. Extrato */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            2. Conferência dos lançamentos
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Anexe o extrato utilizado na
            conferência dos lançamentos.
          </Typography>

          <Button
            variant="outlined"
            component="label"
          >
            Anexar extrato Excel

            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={(event) => {
                const arquivoSelecionado =
                  event.target.files?.[0] ?? null

                setArquivo(
                  arquivoSelecionado,
                )
              }}
            />
          </Button>

          {arquivo && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Arquivo anexado:
              </Typography>

              <Typography
                sx={{
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                📎 {arquivo.name}
              </Typography>
            </Box>
          )}

          <FormControl
            fullWidth
            sx={{ mt: 3 }}
          >
            <InputLabel id="resultado-extrato-label">
              Resultado
            </InputLabel>

            <Select
              labelId="resultado-extrato-label"
              label="Resultado"
              value={resultadoExtrato}
              onChange={(event) =>
                setResultadoExtrato(
                  event.target.value as Resultado,
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

          <TextField
            label="Observação"
            multiline
            minRows={3}
            value={observacaoExtrato}
            onChange={(event) =>
              setObservacaoExtrato(
                event.target.value,
              )
            }
            fullWidth
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* 3. Fechamentos */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            3. Fechamento dos últimos 6 meses
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Registre o prazo e a data de envio
            dos fechamentos mensais.
          </Typography>

          {fechamentos.map(
            (fechamento, index) => {
              const atraso =
                calcularDiasAtraso(
                  fechamento.prazoEnvio,
                  fechamento.dataEnviada,
                )

              const situacao =
                obterSituacaoFechamento(
                  fechamento.prazoEnvio,
                  fechamento.dataEnviada,
                )

              return (
                <Box
                  key={index}
                  sx={{ mb: 3 }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1.5 }}
                  >
                    Fechamento {index + 1}
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1fr 1fr 1fr 1fr',
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Mês de referência"
                      type="month"
                      value={
                        fechamento.mesReferencia
                      }
                      onChange={(event) =>
                        atualizarFechamento(
                          index,
                          'mesReferencia',
                          event.target.value,
                        )
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />

                    <TextField
                      label="Prazo para envio"
                      type="date"
                      value={
                        fechamento.prazoEnvio
                      }
                      onChange={(event) =>
                        atualizarFechamento(
                          index,
                          'prazoEnvio',
                          event.target.value,
                        )
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />

                    <TextField
                      label="Data enviada"
                      type="date"
                      value={
                        fechamento.dataEnviada
                      }
                      onChange={(event) =>
                        atualizarFechamento(
                          index,
                          'dataEnviada',
                          event.target.value,
                        )
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                    />

                    <Box>
                      <TextField
                        label="Dias de atraso"
                        value={atraso}
                        fullWidth
                        slotProps={{
                          input: {
                            readOnly: true,
                          },
                        }}
                      />

                      {situacao && (
                        <Chip
                          label={situacao}
                          color={
                            situacao ===
                            'Dentro do prazo'
                              ? 'success'
                              : 'error'
                          }
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              )
            },
          )}
        </CardContent>
      </Card>

      {/* 4. Observações */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            4. Observações gerais
          </Typography>

          <TextField
            label="Observações da conferência"
            multiline
            minRows={4}
            value={observacoesGerais}
            onChange={(event) =>
              setObservacoesGerais(
                event.target.value,
              )
            }
            fullWidth
          />
        </CardContent>
      </Card>

      {/* 5. Providência */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            5. Providência aplicada
          </Typography>

          <TextField
            label="Providência aplicada"
            multiline
            minRows={4}
            value={providencia}
            onChange={(event) =>
              setProvidencia(
                event.target.value,
              )
            }
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
          Finalizar PT 01
        </Button>
      </Box>
    </Box>
  )
}

export default PT01