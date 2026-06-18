import {
  GoogleGenAI,
  createPartFromUri,
} from "@google/genai"
import "dotenv/config"
import { GoogleRepository } from "./googleRepository"
import { errorMessage } from "../errors/errorMessage"

export class GoogleService {
  constructor(private GoogleRepository: GoogleRepository) { }

  obterSchemaDRE(tipoDRE: string) {
    if (tipoDRE === 'MENSAL' || tipoDRE === 'ANUAL') {
      return {
        type: 'OBJECT',
        properties: {
          empresa: { type: 'STRING' },
          periodo: { type: 'STRING', description: `Periodo do exercício. Ex: "${tipoDRE}"` },
          linhas_dre: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                mes: { type: 'STRING', description: 'Mês referente à linha da DRE. Ex: "Julho", "Agosto", "Setembro"' },
                conta: { type: 'STRING', description: 'Nome da linha contábil. Ex: Receita Bruta, Receitas de Vendas, Tributos s/ Faturamento, Custo das Mercadorias Vendidas' },
                valor: { type: 'NUMBER', description: 'Valor numérico correspondente da conta' },
                operacao: { type: 'STRING', description: 'Indica se o valor é positivo ou negativo. Ex: "+", "-" ou "="' }
              },
              required: ['mes', 'conta', 'valor', 'operacao']
            }
          },
          despesas: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                valor_total_despesas: { type: 'NUMBER', description: 'Soma total dos valores de "DESPESAS OPERACIONAIS", "CUSTOS" "DEDUÇÕES DA RECEITA BRUTA" e "DESPESA COM TRIBUTOS SOBRE O LUCRO"' }
              },
              required: ['valor_total_despesas']
            }
          },
          lucro_liquido: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                valor: { type: 'NUMBER', description: 'Valor do lucro líquido.' }
              },
              required: ['valor']
            }
          }
        },
        required: ['empresa', 'periodo', 'linhas_dre', 'despesas', 'lucro_liquido']
      }
    } else if (tipoDRE === 'MENSAL+') {
      return {
        type: 'OBJECT',
        properties: {
          empresa: { type: 'STRING' },
          periodo: { type: 'STRING' },
          periodicidade: { type: 'STRING', description: `Periodo do exercício. Ex: "${tipoDRE}"` },
          linhas_dre: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                conta: { type: 'STRING', description: 'Nome da linha contábil. Ex: Venda de Mercadorias' },
                operacao: { type: 'STRING', description: 'Sinal contábil: "+", "-" ou "="' },
                valores_por_coluna: {
                  type: 'ARRAY',
                  description: 'Lista contendo o valor de cada mês e do total para esta conta.',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      coluna: { type: 'STRING', description: 'Nome do mês ou identificador da coluna. Ex: Jul, Ago, Set' },
                      valor: { type: 'NUMBER', description: 'Valor numérico naquela coluna específica.' }
                    },
                    required: ['coluna', 'valor']
                  }
                }
              },
              required: ['conta', 'operacao', 'valores_por_coluna']
            }
          }
        },
        required: ['empresa', 'periodo', 'periodicidade', 'linhas_dre']
      }
    }
  }

  escolherModeloIA(tipoDRE: string, tentativas: number) {
    if (tipoDRE === 'MENSAL+' && tentativas == 1) {
      return 'gemini-2.5-flash'
    } else if (tipoDRE === 'MENSAL' || tipoDRE === 'ANUAL') {
      return 'gemini-3.1-flash-lite'
    } else if (tipoDRE === 'MENSAL+' && tentativas == 2) {
      return 'gemini-3.5-flash'
    }
  }

  escolherPrompt(tipoDRE: string) {
    if (tipoDRE === 'MENSAL+') {
      return `Você é um especialista em engenharia de dados e contabilidade de alta precisão. Analise o documento de DRE anexo.
      Siga estas instruções estritas para extrair os dados coluna por coluna (mês a mês):
      1. LEITURA VERTICAL E HORIZONTAL: Para cada linha/conta encontrada na DRE, você deve olhar horizontalmente e extrair o valor de CADA coluna de período disponível (ex: Jul, Ago, Set, Out, Nov) bem como a coluna de 'Total'. 
      2. PROCESSAMENTO MULTIPÁGINAS DINÂMICO: Processe TODAS as páginas do documento, do início ao fim absoluto, independentemente de quantas páginas o arquivo possua (seja 1, 4, 10 ou mais). Continue a varredura sequencialmente pelas quebras de página até encontrar a última linha de totalizadores (como "Lucro Líquido do Período" ou dados informativos finais). Não interrompa a extração antes do fim do arquivo.
      3. DETALHAMENTO COMPLETO: Não ignore subcontas, deduções ou despesas detalhadas apenas por estarem em texto normal ou sem negrito. Mantenha a ordem exata das contas conforme aparecem no documento original.
      4. MAPEAMENTO DE VALORES: Insira cada coluna identificada dentro da lista 'valores_por_coluna', associando o nome identificador da coluna (ex: "Jul", "Ago") ao seu respectivo valor numérico. Se em algum mês/coluna o valor for nulo, invisível ou vazio, envie como 0.`;
    } else if (tipoDRE === 'MENSAL' || tipoDRE === 'ANUAL') {
      return `Você é um especialista em contabilidade. Analise o documento de DRE anexo.
      Extraia os dados financeiros estruturados, identificando o nome da empresa, o período do exercício e uma lista contendo todas as linhas da DRE com suas respectivas contas e valores numéricos.
      Caso o nome da empresa não esteja explicitamente indicado no documento, Coloque o Mes ou o Ano baseado no contexto da DRE lida como (ex: Mensal/nome do mês, Anual/nome do ano, Anual, ou Mensal).
      ATENÇÃO: É fundamental que você capture absolutamente todas as linhas do relatório. Não ignore os subitens, deduções ou contas operacionais detalhadas apenas por estarem em texto comum extraia tanto os títulos em negrito quanto as partes e linhas que NÃO estão em negrito. Não altere o valor caso seja negativo exemplo: se a linha for "Despesas Operacionais -5.000", envie o valor como -5000. Não confunda com os parenteses que está na frente dos nomes das contas.`;
    }
  }

  async executarComOutroModelo<T>(processarPDF: (tentativa: number) => Promise<T>, tentativas: number = 2, tentativaAtual: number = 1, tempoEsepera: number = 3500): Promise<T> {
    try {
      return await processarPDF(tentativaAtual);
    } catch (error: any) {
      console.log(error)
      const ErroTemporario = error.status === 503 || error.status === 429;

      if (ErroTemporario && tentativas > 0) {
        console.warn(
          `Erro ${error.status} detectado. Aguardando ${tempoEsepera / 1000}s antes de tentar novamente... Tentativas restantes: ${tentativas}`
        );

        await new Promise((resolve) => setTimeout(resolve, tempoEsepera));

        return await this.executarComOutroModelo(processarPDF, tentativas - 1, tempoEsepera * 2, tentativaAtual + 1);
      }
      throw new Error('Atualmente enfrentando alta demanda, tente novamente mais tarde.')
    }
  }

  async processarPDF(pdf: Express.Multer.File, empresaId: string, statusCode: number = 200) {

    if (!pdf) {
      throw new errorMessage('Nenhum arquivo PDF foi enviado.', 400)
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })

    const fileBlob = new Blob([(pdf.buffer as any)], { type: `${pdf.mimetype}` })

    const myfile = await ai.files.upload({
      file: fileBlob,
      config: {
        mimeType: pdf.mimetype,
        displayName: pdf.originalname,
      }
    })

    let getFile = await ai.files.get({ name: myfile.name })
    while (getFile.state === 'PROCESSING') {
      console.log(`Status atual: ${getFile.state}`)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      getFile = await ai.files.get({ name: myfile.name })
    }

    if (getFile.state === 'FAILED') {
      throw new Error('Falha no processamento do arquivo pelo Google.')
    }

    const idenficarTipoDRE = await this.identificarTipoDRE(pdf)
    const promptText = this.escolherPrompt(idenficarTipoDRE.tipo_dre) as string
    const response = await this.executarComOutroModelo(async (tentativa) => {
      return await ai.models.generateContent({
        model: this.escolherModeloIA(idenficarTipoDRE.tipo_dre, tentativa) as string,
        contents: [promptText, createPartFromUri(myfile.uri, myfile.mimeType)],
        config: {
          responseMimeType: 'application/json',
          responseSchema: this.obterSchemaDRE(idenficarTipoDRE.tipo_dre)
        }
      })
    }, 2, 1, 3500)


    const resultadoFinanceiro = JSON.parse(response.text as string)
    return await this.GoogleRepository.salvarDRE(empresaId, resultadoFinanceiro)
  }

  async identificarTipoDRE(pdf: Express.Multer.File) {

    if (!pdf) {
      throw new errorMessage('Nenhum arquivo PDF foi enviado.', 400)
    }

    const promptText = `Você é um especialista em contabilidade. Analise o documento de DRE anexo.
    Identifique a PERIODICIDADE do documento analisando os cabeçalhos das colunas (ex: se apresentar meses isolados como 'Jul', 'Ago', a periodicidade é 'MENSAL+'; se apresentar fechamento do ano ou 'Exercício de X', é 'anual'). Classifique estritamente como: "MENSAL", "MENSAL+", "TRIMESTRAL", "SEMESTRAL" ou "ANUAL".`

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })

    const fileBlob = new Blob([pdf.buffer], { type: `${pdf.mimetype}` })

    const myfile = await ai.files.upload({
      file: fileBlob,
      config: {
        mimeType: pdf.mimetype,
        displayName: pdf.originalname,
      }
    })

    let getFile = await ai.files.get({ name: myfile.name })
    while (getFile.state === 'PROCESSING') {
      console.log(`Status atual: ${getFile.state}`)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      getFile = await ai.files.get({ name: myfile.name })
    }

    if (getFile.state === 'FAILED') {
      throw new Error('Falha no processamento do arquivo pelo Google.')
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [createPartFromUri(myfile.uri, myfile.mimeType),
        promptText],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            tipo_dre: { type: 'STRING', description: 'periodo do documento. EX: MENSAL, SEMESTRAL, TRIMESTRAL ou ANUAL.' }
          },
          required: ['tipo_dre']
        }
      }
    })

    const resultadoPeriodo = JSON.parse(response.text as string)
    return resultadoPeriodo
  }

  async buscarDREPorEmpresa(empresaId: string) {
    if (!empresaId) {
      throw new errorMessage('Nenhum ID de empresa foi fornecido.', 400)
    }

    const resultado = await this.GoogleRepository.buscarDREPorEmpresa(empresaId)
    if (!resultado || resultado.length === 0) {
      throw new errorMessage('Nenhum DRE encontrado para a empresa fornecida.', 404)
    }

    return resultado
  }

  async buscarTodosDREs() {
    const resultado = await this.GoogleRepository.buscarTodosDREs()
    if (!resultado || resultado.length === 0) {
      throw new errorMessage('Nenhum DRE encontrado.', 404)
    }
    return resultado
  }
}