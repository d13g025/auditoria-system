import { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

type Resultado =
  | ''
  | 'acordo'
  | 'parcial'
  | 'desacordo'

type Amostra = {
  numeroNF: string
  localizado: string
  er: string
  data: string
  assinatura: string
  rg: string
  confOpe: string
}

function criarAmostra(): Amostra {
  return {
    numeroNF: '',
    localizado: '',
    er: '',
    data: '',
    assinatura: '',
    rg: '',
    confOpe: '',
  }
}

function contarCorretos(
  amostras: Amostra[],
  campo: keyof Amostra,
) {
  return amostras.filter((amostra) => {
    const valor = amostra[campo]
      .toString()
      .toLowerCase()

    return valor === 'sim' || valor === 'ok'
  }).length
}

function calcularPercentual(
  corretos: number,
  total: number,
) {
  if (!total) {
    return 0
  }

  return (corretos / total) * 100
}

function formatarPercentual(valor: number) {
  return `${valor.toFixed(2).replace('.', ',')}%`
}

function PT03() {
  const [amostras, setAmostras] = useState<
    Amostra[]
  >(
    Array.from(
      { length: 30 },
      criarAmostra,
    ),
  )

  const [periodoInicio, setPeriodoInicio] =
    useState('')

  const [periodoFim, setPeriodoFim] =
    useState('')

  const [totalNF, setTotalNF] =
    useState('')

  const [totalManifestadas, setTotalManifestadas] =
    useState('')

  const [resultado, setResultado] =
    useState<Resultado>('')

  const [observacoes, setObservacoes] =
    useState('')

  const [arquivo, setArquivo] =
    useState<File | null>(null)

  const atualizarAmostra = (
    index: number,
    campo: keyof Amostra,
    valor: string,
  ) => {
    setAmostras((atuais) =>
      atuais.map((amostra, i) =>
        i === index
          ? {
              ...amostra,
              [campo]: valor,
            }
          : amostra,
      ),
    )
  }

  const corretosLocalizados =
    contarCorretos(
      amostras,
      'localizado',
    )

  const corretosData =
    contarCorretos(
      amostras,
      'data',
    )

  const corretosAssinatura =
    contarCorretos(
      amostras,
      'assinatura',
    )

  const corretosRG =
    contarCorretos(
      amostras,
      'rg',
    )

  const corretosConfOpe =
    contarCorretos(
      amostras,
      'confOpe',
    )

  const totalAmostra = amostras.length

  const percentualLocalizado =
    calcularPercentual(
      corretosLocalizados,
      totalAmostra,
    )

  const percentualData =
    calcularPercentual(
      corretosData,
      totalAmostra,
    )

  const percentualAssinatura =
    calcularPercentual(
      corretosAssinatura,
      totalAmostra,
    )

  const percentualRG =
    calcularPercentual(
      corretosRG,
      totalAmostra,
    )

  const percentualConfOpe =
    calcularPercentual(
      corretosConfOpe,
      totalAmostra,
    )

  const numeroTotalNF =
    Number(totalNF) || 0

  const numeroManifestadas =
    Number(totalManifestadas) || 0

  const numeroNaoManifestadas = Math.max(
    numeroTotalNF - numeroManifestadas,
    0,
  )

  const percentualManifestada =
    numeroTotalNF > 0
      ? (numeroManifestadas /
          numeroTotalNF) *
        100
      : 0

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
          PT 03 — Amostragem Canhotos NF
        </Typography>

        <Typography color="text.secondary">
          Conferência dos canhotos e manifestação
          das notas fiscais.
        </Typography>
      </Box>

      {/* Manifestação */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Manifestação das Notas Fiscais
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Informe o período completo analisado
            e o resumo da manifestação das NF-es
            de venda.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Início do período"
              type="date"
              value={periodoInicio}
              onChange={(event) =>
                setPeriodoInicio(
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
              label="Fim do período"
              type="date"
              value={periodoFim}
              onChange={(event) =>
                setPeriodoFim(
                  event.target.value,
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(4, 1fr)',
              gap: 2,
            }}
          >
            <TextField
              label="Total de NF-es (venda)"
              type="number"
              value={totalNF}
              onChange={(event) =>
                setTotalNF(
                  event.target.value,
                )
              }
            />

            <TextField
              label="Total NFe manifestadas (confirmação)"
              type="number"
              value={totalManifestadas}
              onChange={(event) =>
                setTotalManifestadas(
                  event.target.value,
                )
              }
            />

            <TextField
              label="Total NFe não manifestadas"
              value={
                numeroNaoManifestadas || ''
              }
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                % Manifestada
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                {formatarPercentual(
                  percentualManifestada,
                )}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Amostragem */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Amostragem dos Canhotos
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Amostra de 30 notas fiscais.
          </Typography>

          <TableContainer
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: 1,
            }}
          >
            <Table
              size="small"
              sx={{
                minWidth: 1000,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Número NF</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Localizado?</strong>
                  </TableCell>

                  <TableCell>
                    <strong>E/R</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Data</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Assinatura</strong>
                  </TableCell>

                  <TableCell>
                    <strong>RG</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Conf. Ope.</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {amostras.map(
                  (amostra, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          minWidth: 130,
                        }}
                      >
                        <TextField
                          size="small"
                          value={
                            amostra.numeroNF
                          }
                          onChange={(event) =>
                            atualizarAmostra(
                              index,
                              'numeroNF',
                              event.target
                                .value,
                            )
                          }
                          placeholder={`${String(
                            index + 1,
                          ).padStart(2, '0')}`}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          minWidth: 130,
                        }}
                      >
                        <FormControl
                          size="small"
                          fullWidth
                        >
                          <Select
                            value={
                              amostra.localizado
                            }
                            displayEmpty
                            onChange={(event) =>
                              atualizarAmostra(
                                index,
                                'localizado',
                                event.target
                                  .value,
                              )
                            }
                          >
                            <MenuItem value="">
                              -
                            </MenuItem>

                            <MenuItem value="sim">
                              SIM
                            </MenuItem>

                            <MenuItem value="nao">
                              NÃO
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell
                        sx={{
                          minWidth: 100,
                        }}
                      >
                        <FormControl
                          size="small"
                          fullWidth
                        >
                          <Select
                            value={
                              amostra.er
                            }
                            displayEmpty
                            onChange={(event) =>
                              atualizarAmostra(
                                index,
                                'er',
                                event.target
                                  .value,
                              )
                            }
                          >
                            <MenuItem value="">
                              -
                            </MenuItem>

                            <MenuItem value="E">
                              E
                            </MenuItem>

                            <MenuItem value="R">
                              R
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell
                        sx={{
                          minWidth: 130,
                        }}
                      >
                        <FormControl
                          size="small"
                          fullWidth
                        >
                          <Select
                            value={
                              amostra.data
                            }
                            displayEmpty
                            onChange={(event) =>
                              atualizarAmostra(
                                index,
                                'data',
                                event.target
                                  .value,
                              )
                            }
                          >
                            <MenuItem value="">
                              -
                            </MenuItem>

                            <MenuItem value="sim">
                              SIM
                            </MenuItem>

                            <MenuItem value="nao">
                              NÃO
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell
                        sx={{
                          minWidth: 130,
                        }}
                      >
                        <FormControl
                          size="small"
                          fullWidth
                        >
                          <Select
                            value={
                              amostra.assinatura
                            }
                            displayEmpty
                            onChange={(event) =>
                              atualizarAmostra(
                                index,
                                'assinatura',
                                event.target
                                  .value,
                              )
                            }
                          >
                            <MenuItem value="">
                              -
                            </MenuItem>

                            <MenuItem value="sim">
                              SIM
                            </MenuItem>

                            <MenuItem value="nao">
                              NÃO
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell
                        sx={{
                          minWidth: 100,
                        }}
                      >
                        <FormControl
                          size="small"
                          fullWidth
                        >
                          <Select
                            value={amostra.rg}
                            displayEmpty
                            onChange={(event) =>
                              atualizarAmostra(
                                index,
                                'rg',
                                event.target
                                  .value,
                              )
                            }
                          >
                            <MenuItem value="">
                              -
                            </MenuItem>

                            <MenuItem value="sim">
                              SIM
                            </MenuItem>

                            <MenuItem value="nao">
                              NÃO
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell
                        sx={{
                          minWidth: 130,
                        }}
                      >
                        <FormControl
                          size="small"
                          fullWidth
                        >
                          <Select
                            value={
                              amostra.confOpe
                            }
                            displayEmpty
                            onChange={(event) =>
                              atualizarAmostra(
                                index,
                                'confOpe',
                                event.target
                                  .value,
                              )
                            }
                          >
                            <MenuItem value="">
                              -
                            </MenuItem>

                            <MenuItem value="sim">
                              SIM
                            </MenuItem>

                            <MenuItem value="nao">
                              NÃO
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Resumo */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            Resumo da amostragem
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(5, 1fr)',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Localizado
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                {formatarPercentual(
                  percentualLocalizado,
                )}
              </Typography>

              <Typography variant="body2">
                {corretosLocalizados}/30
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Data
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                {formatarPercentual(
                  percentualData,
                )}
              </Typography>

              <Typography variant="body2">
                {corretosData}/30
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Assinatura
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                {formatarPercentual(
                  percentualAssinatura,
                )}
              </Typography>

              <Typography variant="body2">
                {corretosAssinatura}/30
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                RG
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                {formatarPercentual(
                  percentualRG,
                )}
              </Typography>

              <Typography variant="body2">
                {corretosRG}/30
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Conf. Ope.
              </Typography>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600 }}
              >
                {formatarPercentual(
                  percentualConfOpe,
                )}
              </Typography>

              <Typography variant="body2">
                {corretosConfOpe}/30
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Resultado */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            Resultado da conferência
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="resultado-pt03">
              Resultado
            </InputLabel>

            <Select
              labelId="resultado-pt03"
              label="Resultado"
              value={resultado}
              onChange={(event) =>
                setResultado(
                  event.target
                    .value as Resultado,
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
        </CardContent>
      </Card>

      {/* Observações */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            Observações
          </Typography>

          <TextField
            label="Observações da conferência"
            multiline
            minRows={4}
            value={observacoes}
            onChange={(event) =>
              setObservacoes(
                event.target.value,
              )
            }
            fullWidth
          />
        </CardContent>
      </Card>

      {/* Evidência */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Evidências
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Anexe, se necessário, os canhotos
            utilizados na amostra.
          </Typography>

          <Button
            variant="outlined"
            component="label"
          >
            Anexar arquivo

            <input
              type="file"
              hidden
              multiple
              onChange={(event) => {
                setArquivo(
                  event.target.files?.[0] ??
                    null,
                )
              }}
            />
          </Button>

          {arquivo && (
            <Typography
              variant="body2"
              sx={{ mt: 1 }}
            >
              📎 {arquivo.name}
            </Typography>
          )}
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
          Finalizar PT 03
        </Button>
      </Box>
    </Box>
  )
}

export default PT03