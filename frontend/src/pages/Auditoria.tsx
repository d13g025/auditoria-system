import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'

type AuditoriaData = {
  id: string
  filial: string
  mesReferencia: string
  dataAuditoria: string
  periodoInicio: string
  periodoFim: string
  auditor: string
  tipo: string
  status: string
  criadaEm: string
}

type PapelTrabalho = {
  numero: number
  nome: string
}

const papeisTrabalho: PapelTrabalho[] = [
  {
    numero: 1,
    nome: 'Conferência Caixa Financeiro',
  },
  {
    numero: 2,
    nome: 'Formulário de Segurança',
  },
  {
    numero: 3,
    nome: 'Amostragem Canhotos NF',
  },
  {
    numero: 4,
    nome: 'Conferência Celulares',
  },
  {
    numero: 5,
    nome: 'Conferência Estoque Lacres',
  },
  {
    numero: 6,
    nome: 'Conferência Estoque Aditivo',
  },
  {
    numero: 7,
    nome: 'Conferência Posição OC',
  },
  {
    numero: 8,
    nome: 'Conferência Pedágio',
  },
  {
    numero: 9,
    nome: 'Verificação Usuário',
  },
  {
    numero: 10,
    nome: 'Faltas de Produto',
  },
  {
    numero: 11,
    nome: 'Emissão de MDF-e',
  },
  {
    numero: 12,
    nome: 'Conferência E-mail Corporativo',
  },
]

function formatarData(data: string) {
  if (!data) {
    return '-'
  }

  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

function formatarMes(mesReferencia: string) {
  if (!mesReferencia) {
    return '-'
  }

  const [ano, mes] = mesReferencia.split('-')

  const data = new Date(
    Number(ano),
    Number(mes) - 1,
  )

  return data.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

function Auditoria() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [auditoria, setAuditoria] =
    useState<AuditoriaData | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    const dados = localStorage.getItem(
      `auditoria_${id}`,
    )

    if (!dados) {
      return
    }

    const auditoriaSalva: AuditoriaData =
      JSON.parse(dados)

    setAuditoria(auditoriaSalva)
  }, [id])

  if (!auditoria) {
    return (
      <Box>
        <Typography variant="h5">
          Auditoria não encontrada.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Cabeçalho da auditoria */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Auditoria — {auditoria.filial}
          </Typography>

          <Typography color="text.secondary">
            {formatarMes(auditoria.mesReferencia)}
          </Typography>
        </Box>

        <Chip
          label={auditoria.status}
          color="primary"
        />
      </Box>

      {/* Informações da auditoria */}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
            }}
          >
            Informações da auditoria
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap: 3,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Filial
              </Typography>

              <Typography>
                {auditoria.filial}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Mês de referência
              </Typography>

              <Typography>
                {formatarMes(
                  auditoria.mesReferencia,
                )}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Data da auditoria
              </Typography>

              <Typography>
                {formatarData(
                  auditoria.dataAuditoria,
                )}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Período auditado
              </Typography>

              <Typography>
                {formatarData(
                  auditoria.periodoInicio,
                )}{' '}
                →{' '}
                {formatarData(
                  auditoria.periodoFim,
                )}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Auditor
              </Typography>

              <Typography>
                {auditoria.auditor}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Tipo
              </Typography>

              <Typography>
                {auditoria.tipo === 'presencial'
                  ? 'Presencial'
                  : 'Remota'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Papéis de trabalho */}

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Papéis de trabalho
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Selecione um papel de trabalho para
        iniciar a análise.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
      {papeisTrabalho.map((papel) => (
        <Card
          key={papel.numero}
          onClick={() => {
            if (!id) {
              return
            }

            if (papel.numero === 1) {
              navigate(`/auditorias/${id}/pt/01`)
            }

            if (papel.numero === 2) {
              navigate(`/auditorias/${id}/pt/02`)
            }
            if (papel.numero === 3) {
              navigate(`/auditorias/${id}/pt/03`)
            }
            if (papel.numero === 4) {
              navigate(`/auditorias/${id}/pt/04`)
            }
            if (papel.numero === 5) {
            navigate(`/auditorias/${id}/pt/05`)
          }
            if (papel.numero === 6) {
            navigate(`/auditorias/${id}/pt/06`)
          }
            if (papel.numero === 7) {
            navigate(`/auditorias/${id}/pt/07`)
          }
            if (papel.numero === 8) {
            navigate(`/auditorias/${id}/pt/08`)
          }
            if (papel.numero === 9) {
            navigate(`/auditorias/${id}/pt/09`)
          }
            if (papel.numero === 10) {
            navigate(`/auditorias/${id}/pt/10`)
          }
            if (papel.numero === 11) {
            navigate(`/auditorias/${id}/pt/11`)
          }
            if (papel.numero === 12) {
            navigate(`/auditorias/${id}/pt/12`)
          }
          }}
          sx={{
            cursor: 'pointer',
          }}
        >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:last-child': {
                  pb: 2,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    minWidth: 56,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    PT {String(papel.numero).padStart(2, '0')}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {papel.nome}
                </Typography>
              </Box>

              <Chip
                label="Não iniciado"
                variant="outlined"
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default Auditoria