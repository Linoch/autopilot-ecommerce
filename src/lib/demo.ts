export type CanalId = "shopee" | "mercado-livre" | "instagram" | "whatsapp";

export const canais: Array<{
  id: CanalId;
  nome: string;
  sigla: string;
  cor: string;
  vendas: number;
  pedidos: number;
  participacao: number;
  status: "online" | "sync";
  automacoes: string[];
}> = [
  {
    id: "shopee",
    nome: "Shopee",
    sigla: "S",
    cor: "shopee",
    vendas: 6210,
    pedidos: 94,
    participacao: 80,
    status: "online",
    automacoes: ["Publicação de anúncios", "Atualização de estoque", "Resposta automática"],
  },
  {
    id: "mercado-livre",
    nome: "Mercado Livre",
    sigla: "M",
    cor: "ml",
    vendas: 5880,
    pedidos: 71,
    participacao: 60,
    status: "online",
    automacoes: ["Publicação de anúncios", "Etiquetas de envio", "Perguntas respondidas por IA"],
  },
  {
    id: "instagram",
    nome: "Instagram",
    sigla: "IG",
    cor: "ig",
    vendas: 3940,
    pedidos: 58,
    participacao: 40,
    status: "online",
    automacoes: ["Posts automáticos", "Respostas no direct", "Catálogo sincronizado"],
  },
  {
    id: "whatsapp",
    nome: "WhatsApp",
    sigla: "W",
    cor: "wa",
    vendas: 2390,
    pedidos: 24,
    participacao: 25,
    status: "sync",
    automacoes: ["Atendimento 24h", "Carrinho abandonado", "Confirmação de pedido"],
  },
];

export const pedidos = [
  { id: "#48210", cliente: "Camila Andrade", canal: "Shopee", valor: 189.9, status: "Aguardando envio", data: "hoje, 09:12" },
  { id: "#48209", cliente: "Rafaela Farias", canal: "WhatsApp", valor: 349.0, status: "Pago", data: "hoje, 08:47" },
  { id: "#48208", cliente: "Thiago Menezes", canal: "Mercado Livre", valor: 97.5, status: "Enviado", data: "ontem, 21:33" },
  { id: "#48207", cliente: "Bruna Lopes", canal: "Instagram", valor: 259.9, status: "Pago", data: "ontem, 18:02" },
  { id: "#48206", cliente: "Diego Martins", canal: "Shopee", valor: 74.9, status: "Entregue", data: "ontem, 14:20" },
  { id: "#48205", cliente: "Fernanda Reis", canal: "Mercado Livre", valor: 412.0, status: "Aguardando envio", data: "ontem, 11:05" },
];

export const estoque = [
  { sku: "TCL-001", produto: "Tênis Corrida Leve Pro", quantidade: 42, minimo: 15, canais: 4 },
  { sku: "MOC-220", produto: "Mochila Urbana Impermeável", quantidade: 9, minimo: 12, canais: 3 },
  { sku: "FON-115", produto: "Fone Bluetooth Compact", quantidade: 128, minimo: 30, canais: 4 },
  { sku: "CAM-330", produto: "Camiseta Dry Fit Preta", quantidade: 3, minimo: 20, canais: 2 },
  { sku: "GAR-540", produto: "Garrafa Térmica 1L", quantidade: 67, minimo: 25, canais: 4 },
];

export const conversasDemo = [
  { cliente: "Camila Andrade", canal: "instagram", tempo: "há 2 min", texto: "Qual o prazo de entrega para São Paulo?", status: "resolvido" },
  { cliente: "Rafaela Farias", canal: "whatsapp", tempo: "há 14 min", texto: "Gostaria de trocar o tamanho 38 por 40.", status: "humano" },
  { cliente: "Thiago Menezes", canal: "shopee", tempo: "há 31 min", texto: "O cupom ORBITA10 ainda vale?", status: "resolvido" },
];

export const planos = [
  {
    id: "essencial",
    nome: "Essencial",
    preco: 149,
    itens: ["2 canais conectados", "Chatbot 24h", "50 gerações de IA/mês"],
  },
  {
    id: "crescer",
    nome: "Crescer",
    preco: 349,
    itens: ["Canais ilimitados", "Chatbot + IA de conteúdo", "500 gerações de IA/mês"],
  },
  {
    id: "escala",
    nome: "Escala",
    preco: 790,
    itens: ["Tudo do Crescer", "API + integrações", "Gerações ilimitadas"],
  },
];

export const brl = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
