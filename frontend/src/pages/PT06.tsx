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

type Produto = 'Diesel' | 'Gasolina'
type Volume = 300 | 500
type SituacaoCaixa = 'Fechada' | 'Aberta'

type EstoqueAditivo = {
  id: number
  produto: Produto
  volume: Volume
  lote: string
  validade: string
  situacao: SituacaoCaixa
  quantidadeFrascos: string
  mlPorFrasco: string
}

const criarLinha = (id: number): EstoqueAditivo => ({
  id,
  produto: 'Diesel',
  volume: 500,
  lote: '',
  validade: '',
  situacao: 'Fechada',
  quantidadeFrascos: '',
  mlPorFrasco: '',
})

function PT06() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [itens, setItens] = useState<EstoqueAditivo[]>([
    criarLinha(1),
    criarLinha(2),
    criarLinha(3),
  ])

  const [estoqueSistemaDiesel, setEstoqueSistemaDiesel] =
    useState('')

  const [estoqueSistemaGasolina, setEstoqueSistemaGasolina] =
    useState('')

  const [responsavel, setResponsavel] = useState('')
  const [data, setData] = useState('')
  const [observacoes, setObservacoes] = useState('')

  useEffect(() => {
    if (!id) return

    const salvo = localStorage.getItem(
      `auditoria_${id}_pt06`,
    )

    if (!salvo) return

    try {
      const dados = JSON.parse(salvo)

      if (dados.itens) {
        setItens(dados.itens)
      }

      if (dados.estoqueSistemaDiesel) {
        setEstoqueSistemaDiesel(
          dados.estoqueSistemaDiesel,
        )
      }

      if (dados.estoqueSistemaGasolina) {
        setEstoqueSistemaGasolina(
          dados.estoqueSistemaGasolina,
        )
      }

      if (dados.responsavel) {
        setResponsavel(dados.responsavel)
      }

      if (dados.data) {
        setData(dados.data)
      }

      if (dados.observacoes) {
        setObservacoes(dados.observacoes)
      }
    } catch {
      console.error('Erro ao carregar PT06.')
    }
  }, [id])

  const atualizarItem = (
    itemId: number,
    campo: keyof EstoqueAditivo,
    valor: string,
  ) => {
    setItens((atual) =>
      atual.map((item) => {
        if (item.id !== itemId) {
          return item
        }

        return {
          ...item,
          [campo]: valor,
        }
      }),
    )
  }

  const atualizarValidade = (
    itemId: number,
    valor: string,
  ) => {
    let numeros = valor.replace(/\D/g, '')

    if (numeros.length > 6) {
      numeros = numeros.slice(0, 6)
    }

    let formatado = numeros

    if (numeros.length > 2) {
      formatado =
        numeros.slice(0, 2) +
        '/' +
        numeros.slice(2)
    }

    atualizarItem(
      itemId,
      'validade',
      formatado,
    )
  }

  const adicionarItem = () => {
    const novoId =
      itens.length > 0
        ? Math.max(...itens.map((item) => item.id)) + 1
        : 1

    setItens((atual) => [
      ...atual,
      criarLinha(novoId),
    ])
  }

  const removerItem = (itemId: number) => {
    setItens((atual) =>
      atual.filter((item) => item.id !== itemId),
    )
  }

  const calcularLitros = (
    item: EstoqueAditivo,
  ): number => {
    const quantidade = Number(
      item.quantidadeFrascos,
    )

    const ml = Number(item.mlPorFrasco)

    if (
      !Number.isFinite(quantidade) ||
      !Number.isFinite(ml)
    ) {
      return 0
    }

    if (quantidade <= 0 || ml <= 0) {
      return 0
    }

    return (quantidade * ml) / 1000
  }

  const totalDiesel = itens
    .filter((item) => item.produto === 'Diesel')
    .reduce(
      (total, item) =>
        total + calcularLitros(item),
      0,
    )

  const totalGasolina = itens
    .filter((item) => item.produto === 'Gasolina')
    .reduce(
      (total, item) =>
        total + calcularLitros(item),
      0,
    )

  const sistemaDiesel =
    Number(estoqueSistemaDiesel) || 0

  const sistemaGasolina =
    Number(estoqueSistemaGasolina) || 0

  const diferencaDiesel =
    totalDiesel - sistemaDiesel

  const diferencaGasolina =
    totalGasolina - sistemaGasolina

  const salvar = (
    status: 'rascunho' | 'finalizado',
  ) => {
    if (!id) return

    const dados = {
      itens,
      estoqueSistemaDiesel,
      estoqueSistemaGasolina,
      responsavel,
      data,
      observacoes,
      status,
    }

    localStorage.setItem(
      `auditoria_${id}_pt06`,
      JSON.stringify(dados),
    )

    alert(
      status === 'rascunho'
        ? 'PT06 salvo como rascunho.'
        : 'PT06 finalizado.',
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
            Papel de Trabalho 06
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Conferência Estoque de Aditivos
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

      {/* RESUMO */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Resumo do Estoque
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                border:
                  '1px solid #e5e7eb',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Diesel - Contagem
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                {totalDiesel.toFixed(3)} L
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                border:
                  '1px solid #e5e7eb',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Gasolina - Contagem
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                {totalGasolina.toFixed(3)} L
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                border:
                  '1px solid #e5e7eb',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Geral
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                {(totalDiesel + totalGasolina).toFixed(
                  3,
                )}{' '}
                L
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ESTOQUE */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Estoque de Aditivos
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Informe o estoque físico encontrado na
            filial, considerando lote, validade,
            situação da caixa e quantidade de produto.
          </Typography>

          <Box
            sx={{
              overflowX: 'auto',
            }}
          >
            <Box sx={{ minWidth: 1100 }}>
              {/* CABEÇALHO DA TABELA */}

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    '110px 90px 120px 130px 120px 110px 120px 100px 50px',
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
                  Produto
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Volume
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Lote
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Validade
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Caixa
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Frascos
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  ML/frasco
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  Total L
                </Typography>

                <Box />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* LINHAS */}

              {itens.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      '110px 90px 120px 130px 120px 110px 120px 100px 50px',
                    gap: 1.5,
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <TextField
                    select
                    size="small"
                    value={item.produto}
                    onChange={(e) =>
                      atualizarItem(
                        item.id,
                        'produto',
                        e.target.value,
                      )
                    }
                  >
                    <MenuItem value="Diesel">
                      Diesel
                    </MenuItem>

                    <MenuItem value="Gasolina">
                      Gasolina
                    </MenuItem>
                  </TextField>

                  <TextField
                    select
                    size="small"
                    value={item.volume}
                    onChange={(e) =>
                      atualizarItem(
                        item.id,
                        'volume',
                        e.target.value,
                      )
                    }
                  >
                    <MenuItem value={300}>
                      300 ml
                    </MenuItem>

                    <MenuItem value={500}>
                      500 ml
                    </MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    value={item.lote}
                    onChange={(e) =>
                      atualizarItem(
                        item.id,
                        'lote',
                        e.target.value,
                      )
                    }
                    placeholder="Lote"
                  />

                  {/* VALIDADE MM/AAAA */}

                  <TextField
                    size="small"
                    label="Validade"
                    placeholder="MM/AAAA"
                    value={item.validade}
                    onChange={(e) =>
                      atualizarValidade(
                        item.id,
                        e.target.value,
                      )
                    }
                  />

                  <TextField
                    select
                    size="small"
                    value={item.situacao}
                    onChange={(e) =>
                      atualizarItem(
                        item.id,
                        'situacao',
                        e.target.value,
                      )
                    }
                  >
                    <MenuItem value="Fechada">
                      Fechada
                    </MenuItem>

                    <MenuItem value="Aberta">
                      Aberta
                    </MenuItem>
                  </TextField>

                  <TextField
                    size="small"
                    type="number"
                    value={
                      item.quantidadeFrascos
                    }
                    onChange={(e) =>
                      atualizarItem(
                        item.id,
                        'quantidadeFrascos',
                        e.target.value,
                      )
                    }
                    placeholder="Qtd."
                  />

                  <TextField
                    size="small"
                    type="number"
                    value={item.mlPorFrasco}
                    onChange={(e) =>
                      atualizarItem(
                        item.id,
                        'mlPorFrasco',
                        e.target.value,
                      )
                    }
                    placeholder="ML"
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textAlign: 'right',
                    }}
                  >
                    {calcularLitros(item).toFixed(
                      3,
                    )}{' '}
                    L
                  </Typography>

                  <Button
                    color="error"
                    onClick={() =>
                      removerItem(item.id)
                    }
                    disabled={itens.length === 1}
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
                  onClick={adicionarItem}
                >
                  Adicionar linha
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* CONFERÊNCIA COM SISTEMA */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Conferência com o Sistema
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                border:
                  '1px solid #e5e7eb',
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Aditivo Diesel
              </Typography>

              <TextField
                fullWidth
                label="Sistema - Litros"
                type="number"
                value={
                  estoqueSistemaDiesel
                }
                onChange={(e) =>
                  setEstoqueSistemaDiesel(
                    e.target.value,
                  )
                }
              />

              <Typography
                sx={{
                  mt: 2,
                  fontWeight: 600,
                }}
              >
                Contagem:{' '}
                {totalDiesel.toFixed(3)} L
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Diferença:{' '}
                {diferencaDiesel.toFixed(3)} L
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                border:
                  '1px solid #e5e7eb',
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Aditivo Gasolina
              </Typography>

              <TextField
                fullWidth
                label="Sistema - Litros"
                type="number"
                value={
                  estoqueSistemaGasolina
                }
                onChange={(e) =>
                  setEstoqueSistemaGasolina(
                    e.target.value,
                  )
                }
              />

              <Typography
                sx={{
                  mt: 2,
                  fontWeight: 600,
                }}
              >
                Contagem:{' '}
                {totalGasolina.toFixed(3)} L
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Diferença:{' '}
                {diferencaGasolina.toFixed(3)} L
              </Typography>
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
              gridTemplateColumns:
                '2fr 1fr',
              gap: 2,
            }}
          >
            <TextField
              label="Levantamento realizado por"
              value={responsavel}
              onChange={(e) =>
                setResponsavel(
                  e.target.value,
                )
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
              setObservacoes(
                e.target.value,
              )
            }
            placeholder="Informe observações da conferência..."
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
          Finalizar PT06
        </Button>
      </Box>
    </Box>
  )
}

export default PT06