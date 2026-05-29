import {
  GoogleGenAI,
  createPartFromUri,
} from "@google/genai"
import "dotenv/config"
import { GoogleRepository } from "./googleRepository"
import { errorMessage } from "../errors/errorMessage"

export class GoogleService {
  constructor(private GoogleRepository: GoogleRepository) { }

  async processarPDF(pdf: Express.Multer.File) {

    if (!pdf) {
      throw new errorMessage('Nenhum arquivo PDF foi enviado.', 400)
    }

    const promptText = `Você é um especialista em contabilidade. Analise o documento de DRE anexo.
    Extraia os dados financeiros estruturados, identificando o nome da empresa, o período do exercício e uma lista contendo todas as linhas da DRE com suas respectivas contas e valores numéricos.
    ATENÇÃO: É fundamental que você capture absolutamente todas as linhas do relatório. Não ignore os subitens, deduções ou contas operacionais detalhadas apenas por estarem em texto comum extraia tanto os títulos em negrito quanto as partes e linhas que NÃO estão em negrito.`

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
            empresa: { type: 'STRING' },
            periodo: { type: 'STRING' },
            linhas_dre: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  conta: { type: 'STRING', description: 'Nome da linha contábil. Ex: Receita Bruta, Receitas de Vendas, Tributos s/ Faturamento, Custo das Mercadorias Vendidas' },
                  valor: { type: 'NUMBER', description: 'Valor numérico correspondente da conta' },
                  operacao: { type: 'STRING', description: 'Indica se o valor é positivo ou negativo. Ex: "+", "-" ou "="' }
                },
                required: ['conta', 'valor', 'operacao']
              }
            }
          },
          required: ['empresa', 'periodo', 'linhas_dre']
        }
      }
    })

    const resultadoFinanceiro = JSON.parse(response.text as string)
    console.log(resultadoFinanceiro)
    return resultadoFinanceiro
  }
}