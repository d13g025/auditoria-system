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
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

import { useNavigate, useParams } from 'react-router-dom'

type PosicaoOC = {
  id: number
  oc: string
  carregado: string
  chegouDestino: string
  horarioPreenchimento: string
  observacoes: string
}

const QUANTIDADE_PADRAO_OCS = 30

const criarPosicao = (id: number): PosicaoOC => ({
  id,
  oc: '',
  carregado: '',
  chegouDestino: '',
  horarioPreenchimento: '',
  observacoes: '',
})

const criarPosicoes = (quantidade: number): PosicaoOC[] =>
  Array.from({ length: quantidade }, (_, index) =>
    criarPosicao(index + 1),
  )

const ehCorreto = (valor: string): boolean => {
  const normalizado = valor.trim().toLowerCase()

  return normalizado === 'sim' || normalizado === 'ok'
}

const calcularPercentual = (
  corretos: number,
  total: number,
): string => {
  if (total === 0) return '0%'

  return `${((corretos / total) * 100).toFixed(2).replace('.', ',')}%`
}

function PT07() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [posicoes, setPosicoes] = useState<PosicaoOC[]>(
    criarPosicoes(QUANTIDADE_PADRAO_OCS),
  )

  const [periodoInicio, setPeriodoInicio] = useState('')
  const [periodoFim, setPeriodoFim] = useState('')

  const [resultado, setResultado] =
    useState('De acordo')

  const [observacoes, setObservacoes] = useState('')
  const [providenciaAplicada, setProvidenciaAplicada] =
    useState('')

  // ============================================================
  // CARREGAR DADOS SALVOS
  // ============================================================

  useEffect(() => {
    if (!id) return

    const salvo = localStorage.getItem(
      `auditoria_${id}_pt07`,
    )

    if (!salvo) return

    try {
      const dados = JSON.parse(salvo)

      if (Array.isArray(dados.posicoes) && dados.posicoes.length > 0) {
        setPosicoes(dados.posicoes)
      }

      if (dados.periodoInicio) {
        setPeriodoInicio(dados.periodoInicio)
      }

      if (dados.periodoFim) {
        setPeriodoFim(dados.periodoFim)
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
      console.error('Erro ao carregar PT07.')
    }
  }, [id])

  // ============================================================
  // ATUALIZAR LINHA
  // ============================================================

  const atualizarPosicao = (
    posicaoId: number,
    campo: keyof PosicaoOC,
    valor: string,
  ) => {
    setPosicoes((atual) =>
      atual.map((posicao) =>
        posicao.id === posicaoId
          ? {
              ...posicao,
              [campo]: valor,
            }
          : posicao,
      ),
    )
  }

  // ============================================================
  // ADICIONAR LINHA
  // ============================================================

  const adicionarPosicao = () => {
    const novoId =
      posicoes.length > 0
        ? Math.max(
            ...posicoes.map(
              (posicao) => posicao.id,
            ),
          ) + 1
        : 1

    setPosicoes((atual) => [
      ...atual,
      criarPosicao(novoId),
    ])
  }

  // ============================================================
  // REMOVER LINHA
  // ============================================================

  const removerPosicao = (posicaoId: number) => {
    setPosicoes((atual) =>
      atual.filter(
        (posicao) =>
          posicao.id !== posicaoId,
      ),
    )
  }

  // ============================================================
  // RESUMO DOS CRITÉRIOS
  //
  // Cada critério possui sua própria totalidade e percentual.
  // Não existe percentual geral somando os três critérios.
  // ============================================================

  const totalOCs = posicoes.length

  const corretosCarregado = posicoes.filter(
    (posicao) => ehCorreto(posicao.carregado),
  ).length

  const corretosDestino = posicoes.filter(
    (posicao) => ehCorreto(posicao.chegouDestino),
  ).length

  const corretosHorario = posicoes.filter(
    (posicao) => ehCorreto(posicao.horarioPreenchimento),
  ).length

  // ============================================================
  // SALVAR
  // ============================================================

  const salvar = (
    status: 'rascunho' | 'finalizado',
  ) => {
    if (!id) return

    const dados = {
      posicoes,
      periodoInicio,
      periodoFim,
      resultado,
      observacoes,
      providenciaAplicada,
      status,
    }

    localStorage.setItem(
      `auditoria_${id}_pt07`,
      JSON.stringify(dados),
    )

    alert(
      status === 'rascunho'
        ? 'PT07 salvo como rascunho.'
        : 'PT07 finalizado.',
    )
  }

  // ============================================================
  // TELA
  // ============================================================

  return (
    <Box>
      {/* ======================================================
          CABEÇALHO
      ====================================================== */}

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
            Papel de Trabalho 07
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Conferência Posição OC
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

      {/* ======================================================
          PERÍODO ANALISADO
      ====================================================== */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Período Analisado
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 2,
            }}
          >
            <TextField
              label="Data inicial"
              type="date"
              value={periodoInicio}
              onChange={(e) =>
                setPeriodoInicio(
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
              label="Data final"
              type="date"
              value={periodoFim}
              onChange={(e) =>
                setPeriodoFim(
                  e.target.value,
                )
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

      {/* ======================================================
          CONFERÊNCIA POSIÇÃO OC
      ====================================================== */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Conferência Posição OC
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            São consideradas 30 OCs por padrão.
            Quando a população disponível possuir
            menos OCs, serão utilizadas apenas as OCs
            existentes.
            Nos critérios Carregado, Chegou ao Destino
            e Horário de Preenchimento, os valores
            SIM ou OK são considerados corretos.
          </Typography>

          {/* Cabeçalho */}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '100px 1fr 1fr 1.2fr 2fr 50px',
              gap: 2,
              alignItems: 'center',
              px: 1,
              mb: 1,
            }}
          >
            <Typography
              sx={{ fontWeight: 600 }}
            >
              OC
            </Typography>

            <Typography
              sx={{ fontWeight: 600 }}
            >
              Carregado
            </Typography>

            <Typography
              sx={{ fontWeight: 600 }}
            >
              Chegou ao Destino
            </Typography>

            <Typography
              sx={{ fontWeight: 600 }}
            >
              Horário Preenchimento
            </Typography>

            <Typography
              sx={{ fontWeight: 600 }}
            >
              Observações
            </Typography>

            <Box />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Linhas */}

          {posicoes.map((posicao) => (
            <Box
              key={posicao.id}
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  '100px 1fr 1fr 1.2fr 2fr 50px',
                gap: 2,
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <TextField
                size="small"
                value={posicao.oc}
                onChange={(e) =>
                  atualizarPosicao(
                    posicao.id,
                    'oc',
                    e.target.value,
                  )
                }
                placeholder="OC"
              />

              <TextField
                size="small"
                value={posicao.carregado}
                onChange={(e) =>
                  atualizarPosicao(
                    posicao.id,
                    'carregado',
                    e.target.value,
                  )
                }
                placeholder="SIM / OK"
              />

              <TextField
                size="small"
                value={
                  posicao.chegouDestino
                }
                onChange={(e) =>
                  atualizarPosicao(
                    posicao.id,
                    'chegouDestino',
                    e.target.value,
                  )
                }
                placeholder="SIM / OK"
              />

              <TextField
                size="small"
                value={
                  posicao.horarioPreenchimento
                }
                onChange={(e) =>
                  atualizarPosicao(
                    posicao.id,
                    'horarioPreenchimento',
                    e.target.value,
                  )
                }
                placeholder="SIM / OK"
              />

              <TextField
                size="small"
                value={
                  posicao.observacoes
                }
                onChange={(e) =>
                  atualizarPosicao(
                    posicao.id,
                    'observacoes',
                    e.target.value,
                  )
                }
                placeholder="Observações"
              />

              <Button
                color="error"
                onClick={() =>
                  removerPosicao(
                    posicao.id,
                  )
                }
                disabled={
                  posicoes.length === 1
                }
                sx={{
                  minWidth: 40,
                  width: 40,
                }}
              >
                <DeleteOutlinedIcon />
              </Button>
            </Box>
          ))}

          {/* ==================================================
              RESUMO DA TABELA
          ================================================== */}

          <Divider sx={{ mt: 3, mb: 2 }} />

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Resumo da Conferência
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                '2fr 1fr 1fr 1fr',
              gap: 2,
              px: 1,
              py: 1.5,
              borderRadius: 1,
              bgcolor: 'action.hover',
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              Critério
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>
              Corretos
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>
              Total
            </Typography>

            <Typography sx={{ fontWeight: 600 }}>
              Percentual
            </Typography>

            <Typography>
              Carregado
            </Typography>

            <Typography>
              {corretosCarregado}
            </Typography>

            <Typography>
              {totalOCs}
            </Typography>

            <Typography>
              {calcularPercentual(
                corretosCarregado,
                totalOCs,
              )}
            </Typography>

            <Typography>
              Chegou ao Destino
            </Typography>

            <Typography>
              {corretosDestino}
            </Typography>

            <Typography>
              {totalOCs}
            </Typography>

            <Typography>
              {calcularPercentual(
                corretosDestino,
                totalOCs,
              )}
            </Typography>

            <Typography>
              Horário de Preenchimento
            </Typography>

            <Typography>
              {corretosHorario}
            </Typography>

            <Typography>
              {totalOCs}
            </Typography>

            <Typography>
              {calcularPercentual(
                corretosHorario,
                totalOCs,
              )}
            </Typography>
          </Box>

          {/* Adicionar linha */}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={adicionarPosicao}
            >
              Adicionar linha
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ======================================================
          RESULTADO
      ====================================================== */}

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
                e.target.value,
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

      {/* ======================================================
          OBSERVAÇÕES
      ====================================================== */}

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

      {/* ======================================================
          PROVIDÊNCIA APLICADA
      ====================================================== */}

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

      {/* ======================================================
          AÇÕES
      ====================================================== */}

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
          Finalizar PT07
        </Button>
      </Box>
    </Box>
  )
}

export default PT07
