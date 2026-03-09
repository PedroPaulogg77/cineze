export type LeadGratuito = {
  nome: string;
  email: string;
  telefone: string;
  segmento: string;
  cidade: string;
  como_chegam: string;
  presenca_digital: string;
  investiu_trafego: string;
  maior_desafio: string;
  meta_clientes: string;
  urgencia: string;
  contexto_livre: string;
};

export interface DiagnosticoConteudo {
  score: number;
  temperatura: 'QUENTE' | 'MORNO' | 'FRIO';
  isPremium: boolean;
  perfil: string;
  produto: string;
  whatsapp1: string;
  whatsapp2: string;
  objecoes: string[];
  situacaoAtual: string;
  gargalo: string;
  custo: string;
  oportunidade: string;
  recomendacao: string;
}
