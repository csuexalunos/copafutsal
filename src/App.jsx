import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Trophy,
  Users,
  Swords,
  ListOrdered,
  Camera,
  Video,
  Award,
  UserPlus,
  Eye,
  EyeOff,
  AlertTriangle,
  Radio,
  Dices,
  Download,
  MapPin,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  ShieldCheck,
  Plus,
  Lock,
  Unlock,
  Check,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  readKey, writeKey, cadastrarConta, entrarConta, sairConta, sessaoAtual, aoMudarSessao,
  criarPerfil, buscarPerfil, listarPerfis, atualizarPerfil, souAdmin, listarAdmins,
  promoverParaAdmin, subirArquivo, urlAssinada, contarPessoasInscritas, buscarCpfsDaTurma,
  registrarAcesso, contarAcessos,
} from "./lib/supabase.js";

// ---------------------------------------------------------------------------
// Copa de Ex-Alunos de Futsal — Colégio Santa Úrsula — 8ª Edição
// Redesign limpo e moderno: navy como base, laranja como único acento vivo,
// muito branco, cartões com sombra suave em vez de blocos de cor pesados.
// ---------------------------------------------------------------------------

const COLORS = {
  bg: "#0B0F1C", // fundo escuro — usado em toda a interface
  surface: "#141B2E", // cartões e painéis, um tom acima do fundo
  surfaceAlt: "#1B2338", // hover / itens de lista dentro de um cartão
  border: "#2A3350", // bordas sutis sobre fundo escuro
  ink: "#F4F6FB", // texto principal — claro sobre o fundo escuro
  slate: "#93A0BE", // texto secundário
  accent: "#FF6B35", // laranja — único acento vivo, usado com moderação
  accentSoft: "rgba(255,107,53,0.16)", // fundo de chip/ícone em laranja
  chipSoft: "rgba(255,255,255,0.06)", // fundo de chip/ícone neutro
  gold: "#F2B705", // dourado — reservado ao Hall da Fama / troféu
  goldSoft: "rgba(242,183,5,0.14)",
  card: "#141B2E",
  zebra: "#182036",
};

const EDITION = 8;
const EDITION_ROMAN = "VIII";

// Brasão oficial "Santa Úrsula Jogos Ex-Alunos", em base64 (comprimido)
// para não depender de link externo dentro do artifact.
const CSU_BADGE_IMG = "data:image/webp;base64,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";

// Turmas que disputaram a 7ª edição — tendem a repetir a cada ano.
// Fonte: Guia de Narração da Sétima Copa Ex-Alunos CSU.
const TURMAS_HISTORICAS = [
  { turma: "2022.1", apelido: "A Máquina do Tri" },
  { turma: "2007/06", apelido: "Tradição em Fusão" },
  { turma: "2009", apelido: "O Coletivo Tático" },
  { turma: "2020", apelido: "O Desafio do Encaixe" },
  { turma: "2010", apelido: "O Rei dos Vices" },
  { turma: "2014", apelido: "O Campeão Veterano" },
  { turma: "2013", apelido: "Intensidade da Roça" },
  { turma: "2001/02", apelido: "A Malandragem Clássica" },
  { turma: "2022.2", apelido: "Uchôa na Linha" },
  { turma: "2015", apelido: "Estilo Estudiantes" },
  { turma: "2003/04", apelido: "Memória e Artilharia" },
  { turma: "2019", apelido: "Confiança de Brasília" },
  { turma: "2021", apelido: "A Zebra Silenciosa" },
  { turma: "2018", apelido: "O Pacto de 3 Minutos" },
  { turma: "2012", apelido: "O Talento que Evapora" },
  { turma: "2016", apelido: "" },
];

// Elencos inscritos na edição de 2025 (fonte: PDF de inscrições enviado).
// Usado para pré-preencher os jogadores quando a turma é selecionada na
// inscrição — a pessoa pode apagar ou adicionar nomes livremente depois.
const ROSTERS_2025 = {
  "2012": [
    "Ib da Aldeia Breda", "Rodrigo Vilela Cortes", "Jose Agnaldo de Souza Araújo Neto",
    "Fábio Manoel Fragoso Bittencourt", "Francisco Hélio C. Jatoba Neto", "Thiago Lins Ramires",
    "Emmanoel Victor Esteves da Rocha", "Iago Gomes Vacchiano", "Murilo Correia Tenório de Albuquerque",
    "João Carlos Sampaio", "Vinicius Felino de Medeiros Nunes", "Henrique Vaz Ferreira Acioli",
    "José Jairo Melo Neto",
  ],
  "2018": [
    "Pedro Henrique dos Santos Maia", "Bernardo Terto de Lima", "Gustavo Pontes de Miranda Oliveira Filho",
    "Valter Souza Cassella", "Fernando Lessa Pereira de Melo", "Cleydson Villar Barbosa",
    "João Victor Porciuncula",
  ],
  "2015": [
    "Daniel Monteiro de Carvalho Filho", "Marcos Antônio Hermes Leandro Junior", "Gustavo Schausse Salgado",
    "Bruno Lins Soares Palmeira", "Lucas Rogério Sampaio Lima", "Renan Kayan Couto Silva",
    "Diogo Pitombeira Braga", "Lucas Mendes Rosa Peres",
  ],
  "2022.1": [
    "Marlon Vergetti Araújo", "Luciano Lucca Farias de Souza", "Luiz Eugênio Duarte Santos Neto",
    "Hugo Santos Ferro Cavalcante", "Pedro Assis Leite Nobre", "Gabriel Elias Calheiros de Paiva",
    "Caik Agra Toledo", "Lucca Borella Toledo Correia", "Pedro Teixeira dos Santos Soares",
    "Pedro Miguel Silva Couto", "Bruno Fernandes Calheiros Spencer Peixoto",
  ],
  "2022.2": [
    "Vinicius Almeida Griz", "Paulo Carvalho Daniel", "Ildo Raphael Caldeira Vasconcelos",
    "Rodrigo Nolasco Candido Uchoa", "Gabriel Bittencourt Nougaro", "Sérgio Rodrigues da Rocha Neto",
    "Mateus da Mota Lins Queiroga", "Heitir César Neves Sampaio", "Daniel Lucena dos Anjos",
  ],
  "2010": [
    "Fernando da Aldeia Breda", "João Pedro Guedes Araújo", "Arthur Magalhães Lima",
    "Lucas de Vasconcelos Carvalho", "Henry José Feiden Júnior", "Leonardo Tenório Monteiro",
    "Waldir Normande Guido", "Paulo Ernesto Firmiano e Silva", "Luiz André Muniz Oliveira",
    "Paulo Fernando Fraga de Castro Filho", "Rodrigo Houly de Carvalho",
  ],
  "2020": [
    "Luan Henrique Oliveira do Nascimento Lopes Netter", "Gabriel Verçosa Aragão", "Bernardo Torres de Souza",
    "Matheus Monteiro Pires Teixeira", "Eduardo Laranjeira Leahy", "Rodrigo Côelho Bringel Bezerra de Brito",
    "José Victor Gadelha Xavier Martins", "Kevin Medeiros de Souza", "Arthur Coelho Bringel Bezerra de Brito",
  ],
  // O PDF trazia uma segunda lista com o cabeçalho "Time 2020" repetido,
  // mas os nomes batem com os artilheiros/assistências já registrados da
  // Seleção 2019 no Hall da Fama — por isso reclassifiquei para 2019.
  "2019": [
    "Diego Estevão da Costa", "Artur Lucas Guedes de Souza", "Bernardo Tenório Valente",
    "Lucca Bezerra Moura Torres", "Raimundo Lukas Nogueira Mello", "Guilherme do Amaral Amorim Casado",
    "João Phillip Lima Lins de Paiva", "Christian Guedes Souto do Nascimento",
  ],
  "2001/02": [
    "Luiz Paulo Taboada", "Rafael Vilela Toledo", "Ycaro Farias Valença", "Lucas Pontes Duarte",
    "Pedro Thiago dos Santos Agra", "Gabriel Jose Pereira Costa", "Diogo Philip Silva Gueiros",
    "Paulo Henrique de Oliveira Firmino", "Emerson Melo Mota Ataíde", "Hugo Lyra Soriano",
    "Leonardo Edmundo Costa Esequiel", "Leandro Edmundo Costa Esequiel", "Cesário da Silva Souza",
    "Bernard Bomfim Correia",
  ],
  "2014": [
    "Lucas Alves Vieira de Souza", "Iury Simões de França Almeida", "Davi Fernandes Brandão Almeida",
    "Mateus Henrique do Nascimento Rocha", "Brunno Coradin Ziero", "João Augusto de Castro Silva Filho",
    "Luis Filipe de Barros Melo", "Raphael Pereira Lebre", "Leonardo Ramos Pimentel Santana",
    "Arthur de Sousa Lira", "Vinicius Moraes Cardoso",
  ],
  "2009": [
    "Elias Carlos de Oliveira Filho", "Diego José Uchôa Quintela", "Lucas Costa Russo",
    "Dylermando Sávio Aguiar Cunha", "José Paulo Cabral da Silva Filho", "Davi Falcão Bastos Beleza",
    "João Victor de Mesquita Mendonça", "Ronaldo Victor Lemos Fontes Silva", "Bruno Ramires Baracho",
    "Davi Vieira Barbosa",
  ],
  "2013": [
    "Lucas Martins da Costa Pereira", "João Carlos de Lima Sousa", "Victor César Lucena Jatobá",
    "Théo Costa Fortes Silveira Cavalcanti", "Pedro Henrique Vieira Rosa de Omena",
    "João Victor Magalhães Nunes Santos", "André Vaz Ferreira Acioli", "Italo Matheus Vieira Cabral",
    "Douglas de Carvalho Matos Barros", "Carlos Gustavo Ferreira Lima", "Victor Barbosa Martiniano Lins",
    "Matteus Lucas de Andrade Xavier",
  ],
  "2021": [
    "Pedro Vítor Rolemberg Leão", "Sérgio Ricardo Maciel Filho", "Caio Tenório Bentes",
    "Juan Henrique Almeida Bassoa", "Marcos Gerônimo Batinga de Oliveira Barbosa",
    "Felipe Oliveira Soares de Lima", "Pedro Marcellus de Carvalho Portella",
  ],
  // Junta as duas listas do PDF ("Time 2003/2004" e "Time 2003" em separado)
  // já que a turma histórica registrada no app é a fusão "2003/04".
  "2003/04": [
    "Thales Anderson Bastos Soares", "Fernando Nebson Falcão Tavares Júnior",
    "Carlos Eduardo Neto Muniz Farias", "Marcus Vinicyus Sousa Santos Guimarães",
    "Henrique Barreto Monteiro", "Bruno Lúcio de Oliveira", "Danny Charles Oliveira de Almeida Ventura",
    "Diego Marcel Cavalcante de Vasconcelos", "Leopoldo Marcílio Gonçalves Souza",
    "Henrique Emanoel Rocha Santos", "Túlio José Bastos Soares",
    "Gabriel Toledo Torres", "Marcelo Silva de Oliveira", "Rodrigo Teixeira Cavalcanti",
    "Fábio Coelho Santos", "Felipe Luciani Gomes de Lima", "Alexis Wanderley de Oliveira",
  ],
  "2007/06": [
    "Bruno Leite Setton", "Breno da Silveira Pacheco", "Jose Lucas Pacheco Rodrigues Lima",
    "Sidney Duarte Arruda Pimentel", "Luan Faraco Guimarães", "Hidelbrando Tenório de Albuquerque Neto",
    "Abílio Jorge Tenório Antunes de Mello", "Caio Magalhães Batista",
    "Eduardo Santos C. Albuquerque Cavalcanti", "Engels Barros de Castro", "Rodolfo Santos Bezerra",
    "Gabriel de França Ribeiro",
  ],
};

// Elencos detalhados (número, apelido, nome completo quando cruzado com a
// lista de inscrição, posição) — usados para preencher quem marcou o gol,
// deu assistência ou levou cartão nos jogos. `foto` fica null porque não
// temos os arquivos de foto de cada jogador — só o apelido/número/posição
// vêm do print do app; o nome completo é o cruzamento com a inscrição, e
// alguns poucos ficaram sem correspondência confirmada (nome null).
const ESCUDOS_TIMES = {
  "2016": "data:image/webp;base64,UklGRuRfAABXRUJQVlA4WAoAAAAQAAAAKwEAKwEAQUxQSBENAAAB8IVs27Op+f9d9/NMdezlHbtjeiyvmt577z2RxJjejMQ0eq+m90R8McWgCwnBEAy+vYsSxBQRiQQRGYYRGWQYHi5OTk72hVFjZu7rvGYxIiYgeHT46tWrVo0NA6RTAY4eKGm1Wo8ePiBy4NzL38CUJVfMmzHw8Tz7+KeBj3u7d9V6xV3dzw98PM0+fjzw8ccHr1qMmS2Zt/CogY8QwmhUaAsDpKN6TR0gGXQOqnZty4DIQnobPDrA0XjxI1fdhSmAKvde9uAlzQMQxQFnHNkUJuwEqLHXLoDu4+oaZ51+YDGAMOLvQNf8rdRiFPZRo0T4dTfwv9YBg5ZOahJBDOM3m0KMkdrwAYDGM28+bvK/iYCJsX/NgMh/hh47/4zmrJu9i95GHzR2ArXTMm4CRBEx+qR2RwNmZVux3oQ+/dcnO3VHNdcmIfRlo/Ohl4QDM2z0+Xc/evOXqn2qt4p9df0Tiy4an1UX0E+Vvd+cUdUehW1R+15vjd2G0JhP4+HLSQvM+ofZ9nv/ZxycT8fbzhMXY/RTY93rkdOzp9pctxd21jD6cw9n7KnaVJcnDQ/ukM73RoRBZ1/1CaD0Y8NYccm5Q8KQV3f0dLzUnCFNm6Ebuu7robdRgrpoOxhsG5wVjS3NdZWvqWmPCFCLSglqjEDcuiHW+F9DtbmlIQ+aV0bo/AWjt4mZUZZi2rEbjF2d0LNqSA6swEzAKHEDML7NgCGIiZpR6maGCcP9N9uiGUmMdrTrque+uuKLHzASafyw/Mt3L6p3WnUdSd7U4LPT6cbUUmKq0s1cn71luqmL5Kp957M1bPurWHKMHwqXfW01EmxsDu4uxv3x1E1Gks3umzmu4qph60n85lZPvU1NoiVLYo0vHFVsVDVSbra94qf6LnoSR2zyU1NnTUm8DvJT9Rcl7UZXnaO2YanrbvBScdbfxUi88b8LKy6qfIMTV1c9dBnd5gHrZq6HPlFxAaJfeGgJgg9Y5qHriF64zUOjTb1wgIeKLZgHDGvy0JQew4XKsQ46qoYT0Hiae6ZghheN6d75ygQ3in7nnXWoH4wNhXPeoMcPwsrg3DaNnpjjnfrdOFKbvNOK+kGY7J3jiX6InOWd+xA/CA975zvUD8pfnFPtxPxg7K73zSgURyqtvjkD8UTkMt/c5wvhYd/c7Y1HfXOcLyIX+6ZZ1BPKUN+EhdT8EHk5OLfuJ2oxRlGxdJmoiEiNjkbvhMFr2avEKJacGKOw1+1jgn8rs+fdeuvMcW/V6JcGmPWn3rteGjftvifvP6shOLpx4uyjp3+P9SlT9mzWP4xNRx43a3x98PpXIn0KtFvjju0A2h9EvwuuvxjRPiQbr500/4NX585+Yu3mr9Z2iIiaWR9S4SLfhcvB+oCpxCim25Yu39LZ07VuK/usEqOY9QGD+cH7w5aiv4tZjOxVutrXLn9h0YO3zpt79dwb71j0xid//2U3e1URtd9FWTkm+L+x22x/mUaAyPY1i68+YvLwproi/OZKQ8vow868+0/f1+gtarbfTAaHHFyC7AfTKIC1r370grbB1fD7F01jT7n7ky27uzqQqLY/lFUhC79Bf4uJAHR8ctVBTUXYa7V5VNtRF85b9MJ7S5Z/vWrVVyuXL1388C2XHHvg6Ja6sNe6P5z87AYAEdsP64scaOY3miigq69uawh7rgyZfu3rq39V9n/7mjeunT6sEvZYHXXqC2sVVHTfgKE50LixJ+6DCvDr4iOawx6LlkPmLt3CnlVijCIiumcRiTGKsuetn90ya1gRelen3vVPQMX2oXv7luYcCOOt1iG9TAy6Fh9SF/bYMuvJ9exRoqgZ+91MJYrRe8PLJ4wsQgihGDP3P4DoXlQODFn4KtK9pQcT4JMjG0Lvatuta+gtUYw+ahqjAXy/6ND6EEIoWu/4FRBDakSW5MGoHZhEga77R4fedYc+sQ1ARI2+rhIN6Hz7qMYQQqib9raAiCo9k/MgjOxAYP2pDSGEULQ90w5IVKO/qgiw++lDqiGE0HLpZhDrGh9ysXEdf51VhBDCkMvWAyJGPzcRYPNto0MIoTrnW75vDPl44rlFCKE46C1AxChFEwFWHF0NIYSZM0NmVk9bC0SjRE0Mtl7cELKz4aKtIELpqsDOO4fmRfPNu0CUUjYBHhqSD0131kCM0jYBe7AlD6rXdYMY5S4gtzVkwFGbQYzyF+g8s3Be6woQI4km8JfJnqveBmIk0wQeaXDb1B9QJamqbJ/ts+oiEJIr8FKjwyZuRI0Em7DjUHddDUKiBe4uXNX0Caok24TVQx3Vtp1I0iM9s9x0LgiJV7jVR8WjqJF8Ez6oOqj+SyIujPynxT1DNxBxotA+1jmtnQhuVPRw1xwQURypxnGOmYkprjThLLccgRrONOFCpxyPGO60yBUumYMYHo2c75BpiOFSi5zujsmmhlNNOMYZY3rMcKsJh7hicAeKY03jGEfUbURxrbK9yQ3FFwjOVf5Z8cICIu4V3nbCiUQcHJnrglbEPERkmgPqt5riYtPulvQtQXCy8l2RuguJuFm4JXGjTMxPRKYkrfgPiqPNfq1L2W0IrhaeSdhEBGcLhySr2GDqLdVfq6m6BsHdwqJEDRExfyG0pmkZgsPV1iTpMASXC8clqNhg6jPT7XXpuQDB6cK85NTvVPOaaU9Tam5FcLvwcGKautX8hsrgtNyF4HjhsaQ0dZt5Do0tKZlHxPXC/QmpazfznVmtKR3nIDg/cnMyih9MvWfWXk3FIQjuF45JxTLLAOXbRAwzIwOV1jTcTMwB4dEkFJuxHDA6qiloQ8lCYU4KnjTJhSUJqOvE8gCrNZXfTIRMjJxYfi9ZNghLS6/ageWC0d1QdlMRslGYXXZ3WcyJJ0quWI/mg7GpKLcWMzLSGFVus4g5ETmj3BYiOSG8VW5r0Zww2itl1qzkpTGizA5D8iJyZJndSMyNBWW2DMkL5csSKzZheWFsrZRXo+QGxpDyGoeSmcLB5XUMMTcil5XXzfkhPFperyO5oSwrr2/Q3DDWFWVV/QXLj/b6shpUyw+QwWX1B4zsNCaV1UFofijHlNUxOSKcXVZnIzlyfVnNzRHl4bJahObIG2X1fJ6sKKs3csRYXVbv5smasvowT/5SVkvyZE1ZLc2T78pqSZ58W1bvDqi8niNaXi/kyfKyWpQnr5bVDUiO3F9W5+eIcH1ZzUFz5Jyymojlh3J0WY0w8tNoK6uGXVh2wIiyqmzMD2NnQ1mFL9H8WF+U1vNIbghLQmnfQMyP+8vr+PyIXFBek5DcEA4or2bBMsMYXF7FptwwthblFd5D8kJZGUr8CmJeRBaU2YFIbhxTZk0RywpjeJmFv6M5YWwqSu1eJCeEl0KpT8uLyOnl1ixYRhjDyy2sQfPB+KEouVst5kPkwVDybUg+CIeVXbUDywWju77swrMmuSC8G0r/cLIhcmz5VTuwTKDWWH7hSZM8ED4ICWwjG2aloNiE5YDRXk1BuJGYA5GFIYnDzHJAGZ2G8ImJ/5TVIZEHkwHCUako1pp6z2xbJRXhFMR7kStCMqvbzXxn1t2YjnAV4jthQUhow24zz5n2NKck3IJ4TlgYklq/08xvprWmtIRrEb8JC0Ji69rNvGa6uyE14WzEa8IVIbmVzaY+U9tSSU+YhfhMmB5SvAL1mPBJSPIwFfOYDUtTuAHxlzA/JLr43tRbaj9UUhUmIt4SJod0L0B8JTwSEl5Zb+optc3VlIUxiDlKGBfSfgHRT5HLQ+qXIV5SlofkN+4w85FpR2P6wkTEXBRpCx48l+ihyKXBh88Q/SM8G5xYfIt4R1hVeCE0bEJ9o2xuCH4c2mXqGbOuEcGT40XNL6Y2IfjyYMS8YsK04M05iPnEhGODP09GzCMmHB88ehZi/jDhjODTU1DzhimnBa8eg6kv1Dgq+PWQiHpCscOCZ1s7ET8IOycE3w75nuiFyA/Dg3frVxLNAxZZWR/8W9yPavpUebgILj4dJHUCpwYvt/5ETFtky7jg5/p3MU2XKksbgqvPh5iqCNcEb4/+J6opUuV/44K/K/MgWnIi3FoJLh/3T5C0qLF2YvB6cXlENB0m2LWV4PjBb0O0NFiEpcOD8w9ZB2LlZwI/zAz+r5y1A8TKzQTaL6mELKy/oRvEyssEds9rCNnYfEs3iJaTCey+uSlkZdMNO0C0fFSg47qmkJ11Z6wDEysTE4MfLqoPWVocvgQQsXIwEeCTaZWQryPm/QSIWH8zEWDLzcND5lbanuwARLT/qAiw85mDKiGH66a90A5YFOt7KtGAjmdn1IV8rh60YB29Jar1FZMo9F5/74F1IbeL4Sc8v5E9ShRRs/1lpipR2OP6J48dVoRML4bMmL98K3tXEdF9FhFl71s+mTetpQi5X2lpO/ehj/+9o8Z+jjv+s+zhMw9sKcIAYlE3aPTUEy+989HFHyxdtmzpxx+8/exDd11x2sFjBtUVwY0AVlA4IKxSAABQxgCdASosASwBPjEWiUKiISEV/EVAIAMEtjd+Pkxu4rGa3Wb+n67SgHff7X+0v9z9zvhHnK7E/Vvyx/Zf+V/m/lF/u+vjon/PeeF45+d/5D+4/5H/h/3b///+T7q/2j/SfmR8iP0D/qvcA/i38q/wn9o/yX+//u3////n0/fsb7gv7b/n/+7/jP858Af59/W/9z/ev3x+X//Bf6H+0+5D+v/4H/jf4f/QfIB/Rv7n/wfz0+br/a+wL/n/9p7AH81/un/D/OL5Z/8v/5/8p/qv/z/0/sh/Yf/w/5T/V//3/hfYV/OP6//0v2a//X+6+gD/df/f2AP389gD99+5F/qn4pfs582++z7v/e/2k9B/xr5d+0f2/9oP7l/6v9b8aeMP0j+P/5/+C9Wf479pPxP9z/bz+6fNf9i/yv978T/yj9u/yn9t/HT9bvsF/Fv5p/hf71+1/92+DT6zsYtg/yn+79QX2P+c/4v+3f4v/cf270ef6b0G+vn+S/Nr/IfYB/RP6P/ov8J+6H+R//P2D/qv2H8kX8b/uf+d/ivgB/m39V/1f9u/eH/G/TB/A/8X/Df6v/1f7D//+8T83/uX/J/xf+s/93+n//////Qb+Tf0P/S/27/K/+P/Ff///7/c1/1/bl+0//a90T9bP+5+f7VfneNzesCiVlGUelk/r8OQsonDmxZWB/neN0JaDp5Yqg35cO4eVI3YpoQlf9ONEdtyFId6xS00zrQOEFGSr08NvEJ2yKjJfcTfTf44EFHkHT53gxXw+qo+xXf8YeXoqZidrLEcJ4U/F3jB2W0WufZ8kHCRPYD7Zvb1Udj7795gGjuCsc5sxdm86tx3uE6J+erEVzGO9Lyjb9CscXlsFKD8W5X3ciZo3DMVxxp1eYKGroZji9xI24SaoxbDiQJzHck1HxprWuoaHCKbx66nBnv8TJ+erPNPejR1zUb5517Q8o9WAqF/asXZFVmmO+yWG2+PG+CurcE/w0K25atBf5gWlV3znz6bEEqVQyjmP40aaUs881nF1LK9QloOn2qahmpm9heu4TfhayEqIaVUWLDIBphvzesrLrP5uvCVAlVYM3xcyh+FCDp87xug0l1o/1L3bD20/S0p6mQCsJqX09/3TGfa1Q7phPIsXm1HBy8/SvnOnzktB0+XxA59O25QaWoTjNC6sTQYDtz6P2Ed7iSxyBPfIE4lOaA0VW64F6HvB88BRYZj3bFIMnS6RL5amrg6fL4hHf1Ndv2w5uKz8HycdsaUWOhR+K8TL9jyE9GL62X9QDQpBtSdO4AjoypkmHnVwwlxhVbnQFacDS/tO1Es94EfEw0TENhQQ1ArRoIfZwai+tA1rlTh0MUvD+KUrPoBy3fsG5KkkBfGF68W7INNizEYyeGRnS2H7o/u2+H+Zq78OKx6LA32Fz6mEa8c0CvzeyhU+vVz5s4cSYEh/B82xonw3fQSJrxgK7ZwNut9jXcnsZdRbYtXB4DWnVuL6z0vEJcBVCfb3A+dnbr8iqJhQPixcSd9lu++dyX09ZeWZFYEuJ3RqUl8wxNH70/x+tyl2H3YTjcFo06h1v02SRrcnszl3xVL1Vvut7s3PcoFzOI1UifkBvCYw7jHEMM+aD3Fw4KdXIZWoIxUvqKqZmDs6LzFcZAlKepfw0fdsc2umZfYJpT/KN22T4WFGtOPa7CfjDyiTF1pOiFTL4+0IOMTt0TCyl3tbG2fc9iZICtjfNJC5u9jpXgyDnXlKEjd1227dlJlaOhzJakLiIHAZmySo/QhyTwyTg+H2AoDf7FEDHoOooFfR+ZmLV7bl6QXDsxfCG7HrKOM1sE3AtLOWWhdLJaEos38qXgVr9cCtMT9fjumkLwlV5rZp+AYTuJVFDGjppveu4S7P+gJ+eNsda3JfgVjeQickzn6U8BKy3jdCAhC9FJ6rGZ5QveUKqqNbQBfhh0hWmX2NjRj6KwIiGTzvlK4pxniy/OBiNz3UF+apW151y+zJJYloOnzPlWua1fYzbm/bIWYYh7Cc/mRK7krVm/4TYVsDqKCKBaO/qSylMk8SP0ehBdq2iqp0kXzHUeQdPtMStAie7y8xVExnx2/uHuPvRva5HWwIyPconQL8N/wwQUgaBDhR5BUAAD+/u4gQHBtj6JK/yO7HcQMzbSyMI0tEzv17qMRajJUdPA7XfkMk4jf8m0eTs5bIj27z7tbnpvnXk+jWnByFrC/FrzUA76nMiHAZFwJ2q6/dwq8XU4nkQL2Dpgy66pMlRCCjrKw0VUUIAhu/aq5o5gy9mIkZorniGFMx71SosjDgVWM1KKmdZDO7/jgTbsovCTHgM+Mp5jMu1kgvMLyve5xwf6OkSvPfqSv+SNWG7UZNEKpPh7TqeySJpDnhMKRkgzOGYpIvZZgcGoyeoHZ9DmW0ISdpbABv/vmwPIPWmvK7a9vw24DMrZqVQDjiw4+tuvLA/DyiTfTdxgMDQ1oHuVb/K0AAhzED78ufiJlI1e3VlaLnLd5jfwvAryKcUp39G3+urNewQEgvJjpGuP1ovUhgq7N2FUUxyiV5JdwxGvnd1ybtDGJE9acSCwmTJ+qIctUEaIJ+Y8CHbQF4UjKRdig2UqIRulA3PNzU75kLqDtZuck3O2kfW0KjexUy/4uydbjjpL4JKEuxbOsOrTQpV8zNSXTX/JmtR57wspIJDJlogtzbDn2Ofb9ZxW3n7j4xqEwWHne70FXa+rniek/nt4ypwz1Q7Y8jxVIlYQ1UGu3uGKN5rh6e0IeePC2CM1HS2aFXW61vEHbBF9pOFMQzziBynHLApKH74TGBvj9ojplZxc/tnU8dHuriYy+4KBYfKHZ82crb6FkLZF0ffkOyAhDyRXjbAnjvqAU/CPO32fXcJbD5StL7bWkAZLr34YtyNzKYdKjJeJK3dR7SHD/X4qpIqEILSmOusddPPgtOfcWknFsGXVBJbRb3F9BGG3xXr9JgcNKOKVcX4fbz6MAhwnM2P3FY0jAyTgdLRHS9Fg5iDrOCmtwMoNg5bePHXTsAHTwDmqiefbO51sG7yLPif1dI0yjx6g6KAZr9FlObsgZCwb9lZcfDl2wjPPQE3oQLdtqVPvhQW6uzUBtL7hUs+VUlfHvmAHvvqZED7xC9PkYo7JSrZRN9+O+EUkAnvjwuPAKB2SvDFwIV8rSV+nwaZGYXQ/CISMwIOpYU4vELEkPyv2Wr95/ukMA6i4UAzII14mI5snpSNFpewiP1htZOgrQgPpnqOlqPFe5vC8vK4AACC00/S3oGAKWvyej3VaVyVR+fmiMc+JgPN0ou2/N7WSY1hR5Xhjo7TdszzSUlw675lZj7nv7y/+rmidbuKJ1VlLYCheJ+5Y1sNaJclrL9Zg2AXuSRRj9svJaoa07B/YX+cDxvxBrFffCnAWrhgJwJ8DZAVNM/7lnE16PfmsY7OoczrvgEidv3L5LP+vr5lnG9fcJ/HBxT8GmFLEJd8JYxy2jLmqLKeJG+VilEy8837byB8WmrcsuOqoZvnz/t/fRqnY+3CUfxUTaYeAnMG3+yhs5DLh4r4jBBnHKRQLe5tTONla9vcCFuyCN5yg/c28NpCOQFh+UtMW5jSbJ/QBvRO7waDK/NMoZBOIL18WlUaB8LXn/6qTQZnwoeaKrjIl0t3dsQK6+ssQCFQv0zGrlUoY/CUKuRds4EfMAymC6O7X94A8fAJYP4fJzI1KA7uEpCWJHKt2gl43uABWrq3zd620s2ICTVEG5GBtcghnUkXtDseemWXfXu+IRdXFgCCcc1ZzgcVQd/GwdFIs6yTGboWXlNclDZ+cOxJ9YqqwCkNqpisfI7roX8THOn3Alo2dinVgOAcWkKTbztGlGAcd2rV0LgUCKUsiaV8wQj46HNAvDtQUb6kbfYoDHT5a7Xqs4ck+EmeXT717F7kn/ki+4dr4LsoRH/W74jCflqyzh3npMb31Xq7ot7gb2fKG2+hsCluBBNJ3dmB7WebjyyQhOr15kMBZagxEReQK/XeK0diMi6BPVE5hMzy0cuOP99GuWpps+9XDoPtMRe+vcUmnOySlcF+xvYx63p6bTaPniOF7D35je1B4GriGKzy/OyK8SaTwfiYs2szzF+vFQ1KeP44ZnNEZdzAhKKVnAYbIwZERzIXJO+uVCakFUYCBfFGii7PEgCws8zp+HzSl9Tf8DNziSGfXnt7rkyArZR9v4eB0gpk9tVeXThH6/7xxMc/V/4BfgHyfd8Mud1KNIcNquz4YVytbfuZBcPhcOlKx6Q89CI0TKxLqD5XCdTXUE17DAThQ3anc6eXXNpFmBRT+vVzFc8AiPwE2GcLVYBEmf+NjPa/kTdP9CDCrH9E9tBoUoVrEr0oncbEhm90ffKRwLAub2ik78gELs5OWHHhDGLgWNa7NNwTw4m25j2kkMiliw/gWjWzUEmS4Kbmc7kBjd+hz4iDRldgBFxRI3CvYsPBOEc+2YM7TbsHx8cQL5w5Ne6xyqFi8e7+HBvX+CAhjtl+vlv9iqKC9ZGT0BgUnsRAG1Akw+yuCVtDMCeOSz5tm3LjXBIKvSUi3Ft5xMs6Q6Zn/it7S0lnxRuC+LC39ems9es+ceSvhzQ84/00C2f0yCZ3zfvbDB8FIFLYdX9iipXlJeig9favIGcNp8WLUX2R2PgEfIg14VOeoztmqlZ0VBVEiQp25Y182CTQLql2PQ7xD0x1wuCmvHyDbpHG3CEuXH4BWc568tf48Exis+Ar/bMFGB9qS6ImkIOpydBW+35hTCM/sU9nVCTfvK8v1E8XqjdKOaW1hGiGJBueNngBHOiIiYFRED04PIzx757tLBrwr3rrws4sm53xdp39oJoNRwlmCHMRP4kdDKcOLssQp8QgjZeDVwyOlI3NHKTxmAOcQ8RXvydlQE+uHq/D5cQ64ra0XTKGDqt7fa0WOxk9DMgMR/Q3aC6y9cCLUblo/m+J+6/1mxkaTZuoYWV8g1nyKP1cMLQnDgxb+HAobo90NEAQ44KRlRAGruwILWPxOWzUTnUsD0Iwwz6zsQlKm9gwQsvI+IRfxyGUJO2dvDsOow8UYDL4xgkNqduqKKBjRW96vOQHpkL5V5ZIwBXsCGskJcKAcPvhdLp3+K1ccGCHIi3ydot7L+HyX30p8Mce3AxpomxzFmIENUktEgSvE4d6EMovFV6aGB0hxg6bM5DuI1sJwWW9gHuCeorT6TyW5wDrl82McXkrMpZ56S6CWNE/OwIFm33txFfKYlBiWczjI3vS0TMDEW7bIIvt3jFnrSUMH+S+GIguCDJy2d1gGtPy4EvCYbDHsOTUeh9PAR7+mvP98ztaV2HKyhzAadtQyL9P3jZfxmPCt2fZSP35LvRETrl31BuOKIEkV2bmBuqAbGRQPE89hrQBG8se8045vqvsqovJRktqYwIf3AE/FtCUCulhDqIPaP/TQc0QakDJG+NG3AoI1DXozef+M6RsmxdHV0J698Pdb9fj/y7tC13PEhBJ8QBsE8Wzi89XGgVTPZJay4rqVzHvGtK2SgdHihwgsxt30lazkGSfQkHAYeeoKLXzDAFR7cd4Y/JUTK4S+n4+r6viwKQ/Dn4sfLeOPMZrYKe3fRaya6i2/Bqf67ByHnSdOAzL59EJBP05pznZcSHnq2kRh/RuSJMxpCh90/Skl4cMKxUxVIv6p4Fwkz7vkatFi84ReH3PTyxudWl3xl5FGFHrQMgxfRySQF6hvPJq2ffY8upv1a72UyDkhynXfvmG8LA025+iugDWB/jQGrm7rUlyUDNR+QtBZG0F/cp4AGPiBnNKH1SjEw2g2ru5Lki/eapFK6qBSo/yA7x9Tjj3k96xIeB2oVnRPR4OQ2BvuethhdfmKEro9gHGLUq8W+GMmQr/+AFwPA7aU4QAA4szp7i2ZMWeBb2pD0hAtyJHzxqCjJmWNoVFwn19zFpEIJPHs9VV+/sby0EWEHLquIo3Mm1LwP80SMv+gBtYO86R0Bg9htj1QVuTEVdUcIyjE/N3X/rB8VOSVqfkcgz5fNP/ckA5aPJqqLwCMBeeHM1aV9txI2voiarZYSOozXZxlknTy6Nw48pI9S3Sa8r+PheLtci2Y5j+IPU+NKY8YgZCOvLqxZwAqK/Tdb8GkvBt4tz1mRBVXBcgPcUN5WnK609bZBaXcg9oBFfOcwdEJ7Q0WixTua3ymbYADh+63Y4z/bgiV+TNrXBLkp9AoOlba41/gRCL2DIKFdvbC+lQfxWXFhHI/nBaRdBHFRPmFVB8Mtjk5cJzgP3tK/wBgGlugHfxq2F8l78kat4Pb6JGp2ORirpO4FFjhMwP4qCtdiyRjLGY25BBohZWklvd/Id+YYQtjq6bNrbQphkM9ZirzNPdDPIipQWOkb6WfQxXS6pFhO3MKlzl0e9t5scZOeyzpWFOqyr4c+I9iIV8HzWQXonxRf/4OSFLX3Dxqf/Oamr1pvmFEkltlQ2YQQ8xFL2Z2Ynb6/ciPI3He9uKO3n1KYFRyDi42tBTsVwAxp7D6iTSevGUCuPqfyQEWsP8jY8jRuuSNT+mkVEThfrNMKevdDS43VDkHhlH2WQD+/6yk+Cd8FElrWF72rKkLwNjodIS/vDHnS1iWCSjIjmiygk+yZAhmAueFV4VDJzMxtDrxs/YT5lsS/e9MObaHUXuzIw+4q2WRYX4c5GGZ26mErDcf2S2V1mXyxdLoQn66Heiu4Lr9PHP4r37e7gdW3QSZ17i+IxamANiHQSV6SuaBGCIYCuHVAaKw+Aeir8eqRkcNR+ce31lnBRRdFJqqi0YH7DgFO8CYqhrM5HjnXxIBTJBwGkPlcatAsJ2q1Mp0vOPHd+tv6p9t7R7LKPKz38YsdWvEXcANo6WpCqB6MICC+EAe/+h2r8viQVnTAenqhcvXgTYMLFwFHgUn84txluzJw3vBCFThYNgZe394Ns56bvHdrAwKDW6Qe5DyIv2MMnjX9TvmzeCYVIxXajDtFgPEmZ5P/dExUt2rydqnLNKn8cZafPo5mDA6R9buHF/WZZK/A7UTiqiymY+U4BlRkO4IHNHEbTe8N8Lt9/Id7SrKX2jYKfdB+B9w6e2Y7ZL1oO1b86JOVGbxfuNjQGzZKEqtfADpeFlBKeDHlX0ph+1rB7cMmNtutzz8TK5qrGxBRliaIpG+nZ/WtkRYIClLKH4JRtlbVze/1N0JsbmmZxpB+Cac3G8Ex0i5hfIl6KBXwt0s7B9Tj+OYM5lI+sZJEgmZWDfsZrBnMHZDWOYr+PxxPuYv/hPia1GhWvAmAwQtq6DtiCAivzKRURvgU3GDFIQ/ggVfRpymTfinYioAjXfp9MBnGJ+RfqkDcHj1UjkWZW3doHJhNA+g0bhrMqBh4hLjW508GxySjYbQTft91CzMAd0mazk8aMo9RCPZEDHXclNRP9XQHZxEjeeSRlh3+AwhCjk/GKkAM2RTZ1sSWwePytbRWT8VCTA9e9vAnS9mEPRcdn8IW5wFBfILqkEQwuZN6clZ5SHMtahWiQabmfekWjGcOCCMOg/9QUxlMoUd89x287E6E3E0RFGJQcATTMPNYHm/Nwl2d32wVyt/qCYrrzeqDVqP6yYy3DM2oXB81bekt4lByJcohjSJTTwteq6/vfSh5u37HBqM8+inJCQMQpKnYuVkiNnkiZo8kn5ngakMqj21lumtsg0U7AiXMZcpllu0bRN6WMMJK/YNrjO6C3318vC4Qn0p5s98xKFp22pE50tRE/pwWf2LEd7JAPW3xxqG3EhN0wNj4170Ern1HOL4yHB2FYIBOaGb5se0cRZ/qEQPvOMnC/9frweWUpNYLxmXSn47F2S8mpCE7iL0Pjr/K4/bF/1kChyLcZ8qjjHX0BIsdhEXw9Z3YCdXcBBZAyCSReRLXzulKf+gtqQ7ZdNlGK3vluqmdfvlIgEikOaQtlFRsEhiMl314OayCTNQe0IgybP0U4QpGvNUUpGVoAFc8CRK15WF4SKOwH5uQxtx5EjD9a74drKR9N/Ynh8vbJbSKvbS5myj1os1Un9ZKnW9YBRjwzZYH2uyUzEksD8NbMTIr2+FfmONsFqgis6nId0BVQ3eQKPxVBo7R0osxctFeJlJ/ftvjTRW/RzpADMlGs6LFpCQQj1On7s5x74yXD1SyAqR56SeIOpynUgCpX9apVFi7gUNnB8gv+da9lHs451X8JcNB3J3AMUCjoRB9xMhlQolRCqBebSIAS5HlXA/LAD0XPRyPXBZGvduthc2iYW+N8u2cszjkpib2vcZZYqCwhmiJmxJgFMbxcqkPpg47TMC6ezRgSGZu7YcHbIjgEeBpMb4/A5YpB/lLAwCkAmJ4RHLTCf4DqmGRB6f1h2X4MTtTZXAQnbpAJkKNDAFxUAxVDWqoWpJMFLPgvTGNgmCt+G4augsRM2cMTOByh9F8cGEs2xMq4nW/AMLl1G8yitvbMcxXhu23q/mRTDxhtL069Y1MsVLI8IuPEct2xobliBPSB6kLMObuZbtVxb6aWuiDaJAE3kGBHvG9HLReIqtsh+fG1nxNIYrvr3gGGLPr6iL6CvVSgD4qvx9WE+TGPziWFCbMTrlM3FSyYXjoy+q1EvY8l0DNZV34dYTVFNYJ8HaLunNxC2Tl5xKcK9uNQfkl5KUIlWcfc3H4I5uRGFrN5+/QwAGymLBbwXruuBBVOAqqVe6l6R5OYarBlUzfN+xMNNYSs1lUJfyvVIGpoR8FecRfF7ZtP/ZSi+TlNGHVozPpTjPzu64jPbhCeH2TDvjWee9XzcCMgUwrgO7Sy53S1K483OISsU/kYlLcH3MV8lp3FSCsuvWzTmwbdfP+dNKF8gd9Mmo81dnCfENZviU7CQbj2SwuZ/LAis0iHTaqcZ9b6uud2JO/DICQgfsSHliPMemYjfP7830y3v8g4dpatPfeoE5HpEXywnWwIh+jk6QMwrC1E1SDYgfbyDTzVFonLzvNCVjeMRkNxv7e4qFCXSGeu8cKQ02ePKbJ29Y+sikKgXD7QqF37GJTq0rQzjZIhfUuxrjrZvcBuMNcXXoZ3QwUDAeQEHoj+9AOBeH1B3ZDn04YWwRCnd7WRRjLGOqlP0exeIeUulfXOU2Kl5VOP1e7eSYWJjfTmfhZQm/XbP3rebFz+zRL8nmDzo0MCCCTw+OUvrtuHtMRhAziJQAAC58ToNxVtuA2ulgV+JidjiRlCPC17/IgViI3JsaOzd2it5P5hyqeUlrMWY0i/fG7mOLS7HkWT2FgUuzmOmgK3tg/tqp9wr03XG3btFkaDEOf7yNLX88BWKLjV8IUqk2xW2RSHvaW6h7UZE6psP+q49NAFTkeyiP7FEn3SAzgpmnhoHh8C9VQuFlU6Ped5pnRNqZZw316sBASIeMhYw4qvp/uWNjFP1TemRcy1vQgtEPeDq/IDGcFznqs2dL7i9pB3/83yUKuUbVXdF6/VZRKU5m1i+3pLM92f1wig2khJNj/RReT1iJYb4c8+Gb+mJLe6VjrUcELJur80y8ve/AOo/780EbIWwCHQYZpxW3HKyOXvhie1bgcPVi4lsw9QoLGXoIWXHRp+0FxDHN6SU0w52C0JqC4renWIHUKpUUGN6FFBId9BJ/W5laG7NMj8jlzLtRJCvmM9tPRsj0fMiMw0KbXUnpFEuYwtFoHak4Ll8DmUJoi4IqZJ2t/B9b2GO6b4c4MmlH1YgyqV8IeqnIjLQk2fXIP14bQgYzbD2Y/AN9f7JmIonldsz0Ww97bl2tduMnv6CAIWVgaZt6dsHicDX+ehxyA0lMspGXE93hKYfvyeN5dgYyUX+ZepHLphV/81//EBAywF6Wcitj77QyxfiHceYCWvAqoRDbTwu0S32+3A+oO7iSYyvz9ioo9qgAF2NuhPuKBuovqBgFGXeH3sbhjSPMqLtBqreIfzeJDPwv98hKSvrIzrMDAkOEpjcS/L9BmNpa8KR5ks9WgbOsPKLBNkKewTcLo5JJOc+bSOb88dKSfiRmN+KOH3Gl7DQ3BHK3ilTwhs0SMFhMLrXLztbDJtpdQzpQxg/6nhabvsD+bitfrAq/d2lV14D/1i0bE5wktmHq6cGN3gWab4Rui7h06rKGgrK+ooexh0Xz+HLGMmO0uxumN83txejCsSBJaQ/4xmctcIIPgllRZapi+NNecMLmgFLbDNt6p5A64UOI2QiW4EG4E64vWXlZMhJHxedbqNTmU14K5TqBH4sl9UHvfdEc8ZKBEy/c5G0fpKJPOcWmGG10u1I/44rfmgFHbXfaUx21XL9saJHRKblMUkjY7EbRDxXqd7UrKRt7kB9ByOKFsQmhXFLBhKKSyS86C7MWZWGOdE9taqNn6/ZjLYY4fyTuQVMDOM54V4Ml5ED3oJAfygnfYcysKCj+UmyaaeU08YaZmyCmrEPl6QCMK/tVxShfIo+b6rPXL24R6vP0YExlfy2ANR9Hy7vjGXcpZUl+3GCMv452BMuabLPHIFUSTag7TTX/WzXJPx+6QD63QGO2aKWLfn6Sw9LUVFMyJAzQOmrep+s6yZyDTueE1+vW6sdLSt9TH1uSB/bmfVk7eL7nzjDshryRvDWidnNIax5qm9/vW+WsqfFgxki4ADnczp28j0lr1QWPDrX22Hgs0Gxe5g5n1OzzqiJYle4SqTv0S44l/1XzDhXsjbThfAvy+kaH0AN5ADqxQpx7XkI1dmugY3NePKhxKhYuIhCASLAcSbXFqlTvsw8h/nqDVpVTWZ/Yaii7J6Y/2+lhY7Akg+ix/UDcY8OajPCLBKS1801ks0cx2hC6Nf7iucF3Fa2q1C1hsMlq004I4dBoF5UZS/zJBVhnW9pSJz8/MGA1rfrJfYzSbST8zyYKCNER4F563oD0lAQYjhS1flz4KIJpkZVr55fMEtSI8WfYDn90et63PhXJG3JENv5rzz6jK2xcvaub+lgShYtB0ubjaRSiMia1UI7DuaNhLNGE6Kkq5J/GBRHPTyLEAfFewxoZlsVQGoa0rr4RdKF2BkxPv1rzTR6juwYeqSlvbz3h3k/hvjT0SbxjCHX92nb/Vl391EoxQ3xBv2gpTvlohy//6BFmd7K/KPULV/qhXLbNQtXFr5Ahk1y8NIg+lQjxl7jmiBmlvYFrKeaGoojfPL0rXCAmzVCz6AcWM+T+rxgVTAdclEqFcoh/w7sP1nmZA/WfVM4De2PcXSA/u1SFO2158oUb7NiMTJtYUeRiLDpwHaczEvgzwj7l7DDw/ADH4C6GrOn20EhjcbwMwewZe+W0JGtgflmbRmPCuYTHig4WRu0AO6GBjI5cHDPSf2360Q8/9q01SSNzJxxSveszTEQjy5FvFX2PsisgN2bp5V4kjI1SciKDM1sSJtfdEQerQOcmmzbRA9R4U8+Z1yWnbjqGHR7+H3T9CghXv0Wp23l6I3j+VLDQDjjr4fY4ed4TeUdNLbzkC3L7TzDX0giyQBHepFv1eSPbZGn8Fxvq4EU/FOOcLVQpb50mS5efym+CWSKfnaUZKEc1rM3DkICKvd3o9oO0papwkPzG8M0Aki3xCvzykPvDdReGVYcbm6Ym9jjwpbbo+3INDBsNrq6KGgXwH2OxJuHlCob0hDDbZCB5+/JHcCLuzlLMLFrRedjw35jSPfcU/OMlzGdybtEwsiqsYKuhMPpI7HZZdu/PCkZqvI3w1RB/8mmsaEHZEj7PCTAcY95vIqGj6Rplhhshppjs51czgTIMWP/9TsCqhAaioy2bpohPkkNd4Y1ZcISFgV6HB81pgikYQuoqrrlh2VHZYaotNs28yZXDQUcupbKBRjrIvg8W6FbZpMuE3F39cICkI3VvstcuaoE74w0ZOVxkpW2LODhSgHnaP52PovrrOLsGI3sIyAZnWRg+Jt43qdHUVsAikHwYXJCj9g3BWDu4jXny9PPvToE0q3GB+CfFlnHr/VmlCJGk8XjPj+U/8O9Ghv3+5hXWy+KjztiJRTQkHVeeMPIzh6b/8k/096nEIalhgfOMYkLvhnsRbPVJHSNBrInAKsxsAAk4PH4G1xtYybldmzFX3Ag5Mnh9TnaUgQo7ewweFDA9OW/gN9b+vO3ZQsxsBd2XlRnkTwOiAr4m+EfJqc9IhPEQMWZJsvBEia4APQYtmrVvTYYXZ9M9LngmjqpKIeOxXD+5GThaddVIU8EQoGZTscXX78xsRY5lM/nW/ZSBU9VxDEvcmjgoKDXnhCiBogiZo0P0ln6CZk+N4ToYQQWhoc9HCKdm7EgIRZvy39/mplAO9lk1nQALTrlHH6E1w0RHuE8uszuIkBoegLGrtGwTg2xOBW1xbMyY4Eft0DH4d7t1eW71FW/N5kqNwUNgyWjCh7jwD5U7tp1WkYPGggoBFHyKKe5LHjAc7b5iK4WTtRAcKccUL+Sh8+9OshnllvzoFbGT39quxqZ15rOoXL0t0wljFJUwghz3MhQpdutHD1FxIDCRdgpAXOeUe99Fq/zpSeu5Jrm/NGS8UbtlMwjHA2IzgpUm2mjpr8XNzKGOUL32p7ILa85o1o+1SibWa90q9lXBTYdGhwri0kDRJWR2IVNMueAY0mCHIMzjp17IYdn472y1DkLnRAbg3K8wjBb6X2oZ9CzaTxYYFOxQ20ARLEkyuQHnULBerHCeH4LLzbydnrPn4ioj6WrqUrhO2ghm+mhDqKoK61zcs3/MURTazF5sJh7eKsgyU4F4YJlv61Pn6gsEhXBMs0IgBrWMKistA/+alVb6cXe2xJ0OxYPKXGVx5OHKVH2CeCNjuLZwokc/E0JH3pwCoS3vDIECkzWpiby+aiZt4PAe3rzVxHHNBNciBkFIEpF5OAmT+GTANtOleMvjZxoF4JozvQuoGe2qEXkxk0+P65qR0ILcZir088uz4lfhIYtdgqvpsXIvK6XIHNvP14uCOdDKcGnt5j1yLGLnD9BFj85VeSxe44YM3d9NH+OB8Z1QcRl4MPpujjXKWOl85NdT7WzLliAGIIRNCgdyHFg/2BtnAaRaYCjXoGjqnypbi/FwmDbvyyf+OwuU/YuFpjZmJimq0xmZpB8ODyhpbY/Ds0CPExTnDff4qz3B7vPhz9nOFGq8hHPzQjONHiOf7qfG+prF8nkcMpRDO7706ttEyqNuRMlkAeIbQUwz5CwtJZCw5u4MAG58M/cpCXRhp/lAc68614ulKcsmebHr033HlFlou5RZC2KDf6wt9p11qrpoisfcehrYua1mp8hWPzEGzlZjKU0fHDEKCtLkvMJIbiWCEG0CBk5GWmQkUjzl7agSOcTi/zwhdqLZrnxAkufXZNKYQe2AnDS9B9MZ+PXWlSniUoUhPDgnSy4VkFo/SFxc70coJhe27Aj2xSUwXycju9qKOwLWEzPsAh0nfcqmhboc3ondZQsicYPJRcd/VkOV3UDNpJ7Wbq0TpK9godyqYbckFf/mEZreenqL5jAlvlSyapeztIXzb/dsPi3FIXmBrP8vXK2q1pH3xthTXbeJpyi/ITo2C8SPAR3SnFnf35eM9WXfXO8o6XuaCjMtNQ8xJPtmy+Vr0+i2nQG4sKd0HHGH76YiSmOiA/gCCVjF5B8dykr6gdxmsVOfTwxo75bFdzyxWdPEu2y35yGtbDuFr9An8sgvnDWwNk5n1ZQKb0kwphcCJM45gTVx+aU9thqqBRTmYgWv8GvrwF/oBi8uD3TqmeIpERPG10+p2LWrAr08AmXTc+sEmCKiohEmsMsogySqQISZq5X75UT1hgyft1UdpcTRXGAGlfVe9JDMEg2FVpGscJ+bqSEpYcAAalMVWvkcX4oZKLzwJZeoRRxTQYYsz/KGsH8s6bbN00iy2MXrnhBA9GNPUtB1n8UC4TW2QrNQviWIoj0YW3+66KeqM+7/hXEW01wmCh9JHpjzHCSQfm+PsMVfRCad59tPRNzi5+eHC+Gu8ubDjFJPM/k3sJA6+Bk8uHzyz88redTqVCNmMt7mY8JRcnEQd4Fwku4stpVhUcumIHJ46XYgYH6WWu7+1HSbQn5qdVAfnUiTO19mwSo4KdgzeMBA7/lC0XikXjk2txOLwFM2e1lzivH8bA2glhJ6CBzHIqV2muiYP2vAZvMRbuBPrfMDUjAHpkAHWS7j4DScxytdzb8CBKYJxXZal/M/J8UD1EgiRVBFG9UCS3rRlJ5DP7Fl2nkv8PkQhSIXfPnTHi6YmmE4st+7ZU6b2O5qCeJEGQM3q8zxXhlD4VoadmS3I84SvHWLTDUH71tc+Jx6thGyp/7f/EIVDIjy04z6bNE0mt8d+kUXlCKH4WmwDn1nMVJ+AOyUNONsBLD1Td4WUKr/eEaZ4wGzlAMFWu6wX2zY3BRIortNIYFADU+KanadMGuk80apb3EZ8pWHDp/WUs/piBJUnyNGecCiw/uU9lx90jOXWrIlC+M54DXJVpu22Bg55JHJaaq8SKFM9vrRkIKSodx3aF4GXMnFnY2burmjVoOf1cDGkcFMrezcXwo/yxeCv53B5ie34OqXgvx4fpre+RI8jNne0mLZiMysshDrmi2Izrn9Pc0R5+u0ls9/ZYAf0jKOfERDNZb5L/2GNl0mCcD7oLTDQ1Ob/gzvwi6xnzakTijf0j2ecAwQEXxvdj0e4TlSyB8BXysOg39JOeO7plHRzPegJIHab7+qL5EAg6neHZvyJgwwtHXVmKhkjRWM+drRzEBJ2bK7doP1qmRPOftb1e/3rCmM14o4U5XNNqBZ/PDGODmEPdjbL9fnRPn1xDzFwuohUNwMfoV5g1UCjZ6KBGU7t0nsh2A8uEZDx7bKhpkqtafeE0VnwPHv6Saq9xe+ptFWwH5eoyuOeyJUoSb1KNrxMEvOyvFkvgiRNHPP9IWgo5WmmYy58YFfXF2vZ+6JS+KLdZZSBb8+YLrdUCMmm7wovhUMlfLA5Ex4Rt0hYqg3D1GmXDd0JPkLknEweO2gBi7MwzrUNAQ9zqBLuT4TL/dpAOu9czqcVbYVKnZExaQxe2wVVoIN7E1HXa2Um7LQ4UCbdUUWOUCY42jMOUiYQUc50dhTqd4b4X1k2ysfRyHDveJl4RrQeClyf0vF4EnirX0ROqeSFEywMRFd7FN/67EJU0UjtqI4hTr/melw2FgKQeMi8j311U6VtOb/iMijFRWBp0dLNC84Y8rxM5SGvz3vuOA++tMKMecpDgkxOw1rBf02F3KvR5ykjoVl/KwuI5mg6N7XcFpjzAZs3REuu56F6LT5UHcXwh2eA7WECAVoDT/Esd3IpiD3wDYrRJP8Ok07+vuRssdA+FFMPLoIiH15V792rRmgROw7nMfzt3s9OBbZgz/RTt5m6G2guNe12TWByzLDRR/CUUH4+AXLVM4W6QgWYHzSIV+AxqgdXKmhffTo1cDMiApid4M7zgE0tPRzeB/VAWdR/wga4PoZ1rrV4a5dz/w/JEvrq5FA43rb465HI/AZ6XME8J4O8KcWauv4ntBEP8FcShKUQKdV8Sdw6Kx3Ee6xU+DXsBEixSJtd0pYYUKved6efNbY5cSQBRv8Kv5hdu4NtoMs1tXwrZgoicQFQxV9pqklhMSjJrOIcoIcYr9YJam8K7wlt/VFgF6kT/9m2lORZh/F64jf4evircWX5N/lGMTWUQ6s4uhDL1YudgttU3gZ7xCj2XNAFeosfK2zkuhSSf9x0kQvBRlGHSQsJMxgN7drQjC+WsREil6YfEUSDtSJE9ok1rAoinHstbSk5bf2ARgpQan3BRuA31S6VgilgR0CVLWOGk8lxWSRvFnRhwrnGKIbhAVz1YOFInJWtbrnPoYyvNJIviLX91iQPM/GF+YqQQFDdIYlpkQ5J7XwfcgMrKY/iHVenFB7e+kK7CL93F072ji+twbj/1k1KHOyzhE2ZnoL8gwrPeUtKNlskhAOHVZvsrdckhYdgb4kA8MselhYDyUWwpbqcGyManyaWaZVThFrvChWYD4LwAukJW5+KUmZ1LpXnQWTXrMFd717Y2+lFXPfzqrZPw7W4p0CEKwxJU6LSM94f5vKWXCbv+gze+AYI0BbDE7+fRzFY0NCVhukS6FHMvDUAWci1UDf5XV+7xMFQEj+r/fcWg2RtWkP4U6A2h3ojOUgPt+3T9is0m1hY4C/hoJFUppFkuSkgBMHauUraST8r694HHB0fNX23nJs6IuGrIR1gtUGVQNdSonoOsi0c5LWLWqqA3tmuWuMkPqJdNrmntt2ddS5Nx4TKDBQZImnIJXKfqdoy/+zbaOTVkZlmM8qSFN/Oyf1hqE8laXvJdVxaI6GS1p9Emei7++qOUU5qmXgdXYIg4TBATHHWOOEjLA84TWxv8PHqogf5kSmGo83qC8fyW0II2v5EKVnsP0XGqkwH1XldRxqUykDTc2e0ITRJqUm+6ksnEad1dr+yDAEjYtbdU2NyJJbIXIc5SgQKt+GHnPZ4dGLoipLn8mjKO3ls2MymFlnSMavM/1h9c19KVpBwL6rYIxEXkfyS2iUL/Yh0NbaiT1QCXIhWN2u1eQcbyhjYaAMCd2lwgQ+NN2TvljvDUT70bMaLHO1ggq/DQViEL/ihehIYJI2LQ6Gn63peTTmkqBq71aUJFqEadNc4XIY0PLVY+MxXKGM6org4We/IcRU9/IckcN/+xtyAcFaXcqLRGQRcwuxDDNAhGN2i/mhMu4Jt8ozVz0DKcsvbJLUqgg9Ggi+LORcoRi60reYLLH6CqjU8qAIRXrNrvrVuG6QWJGK9y18GzOfe716JchJ6iiMLsVagWs9HwTIWTi0o6IkPI5JRAa8QOXGBQRUktTs9Gb0YAl7lNnn377HqEqu5dOYPg1BmZ/VW9uHli0bE3xHNF3ORmX+3Y8XRgSk8BAJqM0YmRVI/si5kCturCGa+c1/Rm6lt15pZcX0Wp8DZl5lT/ezRGqA3LA0FyYVXJTf+gaIWeRO8e3yeNb8w3592nhBnIHLd0J9idYKkurijQN6wud1Waztn0uIxzrjifexlGEIHDiWXyLZv9LoAoPu5314I0+J/dd4RkZ0I9vqiRA3FG517geg1uOuXMbWYo7twBYqHxTo3x6oRIcSKEa1C+M5sExSLHg3/k7kV2Wp0h8OKIjQdKImDcaudBTFcfJqABo1a3YPlZz6ML8rCEQsZKibzviW5OKyva0axof5D5ak8AqeGXql34d/ihupMCi+7DyxBiLmfcnhPEd/ZTvq2biI6SwvCVxmLPHe0CNdIoPfcGH6fn7ol/MR9FpNAK1cs/A72t6HC9NG3imzRK0LiA2SHlDEE7miawQoZL3VMhxeXcMDUSNLgMQ/iCv9AkNHV7wBacXqXGSdim2LdYeiXmcWkF73TFJstE3ZQfMD83mZ4E5FpV2aRLXft6X0G8Tqgqh1AQSGD5tH2qh1EMepf60TuFlbZ9YFzZJ/342LvBI8EhtT7iCxKgmaZMe81oTNOQZTdYarWh4CNDlMkLSQCh6hXJYSqxdjSh1jACD5xLb56dIFXTgCzaAKHVRriCnlcQJAnAvCAylCjCuCXOfRAlT5jEHhW/ufVV/igDc+2JqUBeNHQGyIoAKVDOnd/t++pPNObSxkD+g5duAHCRMADuvvZxX72QE3BELvsTYApStA8OYKd0YVREhfSR8mwpaISkgn4We8wvrOlkuWiMuGKfNSCrExjnKdmasqk47+Ozol0jCo8EnSyEdNQjdWPmXXcoABk6T/0PjC0kLc8TeykV8WwSWJuz8Lw7Q6J/ews6yjntRAi0BalYEbLUOsxcQEW2BfTRPsCTyFZschvQM27jG8whPteYY795336Q1fiCaH0X174qw72D2SeRqtpdvaNC3yZQwEoG9deSehmxAQELtAgLAdeIKBFrBlQZUD2l5ob8e0dD7drKHWVuEQ+UqEYccZuCpO6lHMoSq/L0JCfBbwcA4Go8Bo4INO8Ea6yCqcDdsEyIlMh/tkkmNV4NZFbXyydcAGDzvwBLOgDfQYHxkKqQ2ltZKWzDQAMaIN1qUdyVaeRgm9TR+SE0j/h5eCm3ROExK3pSL1c7ZFn3G7yvxZyyKnvFNAu2UFVZjQArnW2hKJxiDmQIhtk2fz1cY+zEjrxP4boEjSMFIifvoPmplLbEHeuSY8VIP6c3Rg6lmZnmsVpfGY+sUaqkJzBcq8/1feMOuhYSNYJfqFMkwRyAs3GaTYQmPlsYO1nvXH1ZNu4VC7crbtbmCS6pFUvzev4nOfq7lnWAN+KFBo6nZCwLsG7+hqAFnqu2lupvzd3XYvNJ9oNKGL7VPUsLjLYsbFsJGh9C8P1d9NsCaE0cQks5uBucTL2XzV3zAeo+G6zO+6JhW1qfWdI9xXeq0n4P/FDUWApS+8F+WY85hoqdZyuWXuCIdBpErXnWRlOBccWOxXa3eO6wGDfe019tHUlBAfVgcV/jO3nvQWPzr/4YtUBARCVTQvT67fCVJXX9gkS8zktMoGAzOTrCPRKha4v4hutFN9ztFgM4Pm0s3Z8iAAqZup2ZBdOLwfnk/UUkZO5ZR9ocWL9i4jj4lnYQccsxRpGmJxt9kvrN9ou9Lfos59v2o0w/xHL0Fu8FHtUyfqTzohxo5qJwoHtivdl1s1EKNu/FpfhUOWj40IvHl/rf1LozRXazXUbC2h+xJMQT/56fBZHhLTH30pYNhV5RCAbqxa98qBeEk8pU95t/v/uKOH/I3lh33OdfPd7FG/5fz+nBFDOaw9r+6+lXI+AoIVfZJ9UxcWbz8nV0GkWo5EYOJ3zP6wOAeY5JvXc7Jaja62BT+A/CW8cfCYIK6V7HsTfaB+3mrOUH5LErcsW6ettzvDrm0vhIaZverhZ6AxyyBjfmNi4QIXaOPcUKNvQOBYDW2B/eW9cmJBH5gI1bp8nWG5T1eGBvxMbZGQtg/BKZ5JsHbJ8zlYKoB+Pqj5lMiT3778u3Pb+8+z0iJoUwZR5bh92yEjjXbRELU5IZSjqhY3oLurE7hH95KKiVjN7E6DDwz/rB936kD3hvZ5GDxwfmrgsyVcKnDa2CnCJg8NXxXL12GPz3tSjxHSiCnmX/T1S45Cmq0PWfkKo+iMi2ygRTX5v0nXS64oq3zxRwLr6YgcNzGQOuFQuHII5QcvHz6RD1QxXPF4IgsK64jGiCVqXpC/ABbPAL+pkJ9gGwsnjVxTWnG4UdR87kpJZETA7AN6rY5+JMDvi5Ru74fCNUgYysvXKZ5NQm1f540RhoDch3v5q2dGbxuAlQ+7Y9YWAWiTA6I2swjgmFo1V/PXCYHu7C1uxydkDlH2muTIp28RofhEQZWQL41vJEzSphM4+qnMt9yDPW+b4hcy+AgL+VKnMv/n94w5bepjbUkdfbGupw8XTZfiVmrp8orZSMZXTMfBWPkS/dO2aVxnX8dCDI2BWI3bjlSenlCidoEG5EWmjji0tIwi4fyRRwKIU4WqEQKO4r8HJv/YusFqt4MBYeG05K0PX+3a55i4P7Y8fLmhjc+6gInof68JhMZG3nb0L/XJ2fQ9NJ7Gg6VitAawwlnioZvAF5CRisQ/9RQWvCtOaDrHTfxwt0uzpBqr2sgAj0MuzssNOmU5YtZ3xcKJX0m1CmqggeCYb3s8JcECXWvb/kKaAlzlwyVKytani8pSI4taI2njvLwCHgyVFOjvv05gmUZQIwZrx+RznfvwhVrKhSTCi5APgA56wn8uJFOMZ6z196L/dPdpS3TnVKxeEblutWi7mINhh4+mD2lOG0y9eizBWbOHzdyPAu56cEwYfqPUxMp2RgYsXgGQwQJuDjPEVaFw/zQO5wq1QXpPE/ieMfJ5dJZkpGKHFi88+VuFgaEVjTDkWlYAjkc62TYoI/EJN3K76/AfEIHPzU9ree47TZIIrN8w72AVcDN2LElssdUu9FMNhxEVwKgm0Er7RjyXeJv5fRG2se4m6b3nt9FjurdwZdji0EQEDr2n+DmTIiGvaau4v0Qvf7OY+wBIDXRmBWQnlQMNf0DrqVa77UOaaiTO8BTxibJHmhI0ZLvzexST+Tp9J+UVTIOkvMBZ3sQPL8/POMxdkE+12SjaH4M/gtUvgyqpBzRt7BbpZzNmQt1FdiScNkt6YDbE8WaqX8IAVxMy79WECtY7FiYp+LJGE6RC5SmkUs8sm1KwioyhdIwAQOrPuJ8iTgk2A+szC/Gmy3QIbd8sqz3bwIeQ592KgU+RwMn3BBkfQSDzG1t+09iSEjKJNYLIQI7b9h+pTXJGwEf8MBwZz0TSQT+5wZtnCLwp3qqnPzYcRYfEs6otTOGjgHg5PXtDbBqOhyDSv2kxcuvG679aeKGA6FzudmeUBb9X9tydso47rFopWd1lO6nrh44+X0OCR6uq7a5ZLrTei4sqK0cJDmkHXjzsLpQAUIGxJQHinKYe8s3zVzNWXf27Yt5BAE7qx8SbUWzyRB7CJmkndBuazYkfD2EBPciIdqfOG6yPihybYJ+gyZh5Vg+JU4dXp22H5ptYbtHqDvI97pIaYeSE/t9MSLZ/1bl6urVw3ldHmbh4XxzIZRKOINKw5zTdvibDBRyTfKiYqDM/g0r80XgH5lZfnnFuI1/jOIu3f3ea2DHM2N8j/c5w1/WPc49oDNV8OybCDtD9SLUM+iwMYbTxncZERXucUWcYpatbYh+0Maj0BbVIAi8aEo0d5vOPA205AIqOYshT/zGLFwZC7IXtQkMTOr9SbtnMskHMkmJQbNC7earjejYlWUVfRmhdvYvkzMMxJJ98+Tt85VipFftP+kh6BXVOciDKuU1VjMiyt6g1KrlpqT0d0ertBwj1AZbll+WyRAB9kxSV3ipy0Ubj8g3cdNcU+6sLPDM0EO+yXTjuzDQnIZjVsngXCYdFgLBaI3Ft7b7GLIjkzrQ1Y/FyJXzWBLBeWojjySKvBVYHOCntMxSbB+1yo9zNeEDNOj4Yw0YK0EqvAyX0QK3nwoqhI65RBf0eRfi5bqqx7ED28oM/GmlRzwTu6B4ncg7a/UO7P6Y3kDjCkv6WTlbcl6gPpI2YUy74Jh1YbnS/EIQoWrzCbvbP+zwEQosmLxoIgodkZeSehSKk/WGDSkRleIN+F8CWRl8o5zUoF/AmE3l+/0ptxAjxk1c9fA8aNbwwC5TRg2Sv4buuccFxnK7X470Jt5EQgZChfoQVkVS9LLyH0fBYdjRzbswCbixGVJt6qMUrLazCIlFeql546p6KXQV5yiGC0e6sFfS/xHpHDt/P1YB/9WzyQxWbSo6QnugUKytMwp9Z5nmiaHwKKTb6teW1zsir052kbcUwcjuOIPXC4/akuChuEEq91HtJ1CaZKvWnE0Ah8AdA9NXnuLwiQua7GCuA7mrIAwuEcVe3LieU1jqOH1/iAVg6IxjUXFmBCkLBwGmilWyRREt1nVDMHkAaJaKSw1hJgyFGglVTxwJPckhwuLMG3NBF2+xZaDRvnmPMTl21070CGBfUTSb2oQLl9iyq5hB2at0Qc8Ga4zyBmAVkKMPXkbcM/WCXhnA5MB5/BoGgMYtwMlAyu2D3Z/mQ/DBrqRc2cSzfyvm6YUL1XSihPxcd6lRBU6eiMpntLqA8S9pjKn+oHMwVFuWkAB77exqhYNsS9DlLabmy0zRf6PdjFvs9JdyJo9SHwc6fNyl2V3DP3xI9//5rZkf9Vdowava4DVCBCXxRI0k51M/6zEknY5+H/7pULB8oxsq/QKF4BVjng8AieW+l5i967olcriNGyMGPSGi8wv3ULJNnfiQAHlm+3IX9mddxIAb2RH7dVn2vqr2Jn4Y6phWspaIblQ4wUjfMNP6dNh6XlPRKeTD5BEzu36d+TyqZGocWDUQXeUZgGD/vm2sLBQ3Hp8uMKoKgslSOVDLPmmVEZrysCnD0lhgdSudAzbTxTrI1CmkmZ3ylXobBe/NYyavfSBJgvJBPWRqAwvMlxKnE27dWi1iU8wCrkCPPFz3TH7zvoFs4nt7992TYqOPJq3S0F7Z9wB6s5OysCMXNAEWWLQZ4m45pVd6TgjrGYHfKLpdyEQweAJeFWvrxHReHRSymArWNRKQaTaF/aA+d/kLcSEpDmKNpL9nbm4bMIGAi1Y53tzkX8KcMnRnjbzD3x7rNytOC7WRSm7++DlpK7/FvZ6K8aLyaFSl8IVQGnhR8BKkQMRjKPbOc5RL19BVdVprLBCzNnm3hdhekV0YholAAgoBQPmbO2U/5bhWqNG5gD9f/hcCEfS2LdXn/4SeUmvyjZLgzeEpRxXAuYK5uBbVRgEXtza3ZGh5rUT1So/l64CykFGQlNbDtfoeEMKNfp6wh0b/uuSU5EgVC/nA+I/m0jDaB4nTrdZfuIEJP5eyaz+FdI50zhgwxBW8QNbbJOeja+Q01elfDD70+k1NAr4yS0ULmP86pc/ihmMGUVPd6j1LHAwy5HjyNmNFQw3KOd5YUiDyhZNA/vaqNdYTZBG6DFNFLxbokTlqCWw07O3Sob1mSREniA4JnpeLm9wVJDjO1DGQx7S4XqS7EkT4pRozEVGBIn6WWj/AxZKme3reGthf2n+MuwoyF71goEKLFXDJ6tkzlHTPDitAx1V8fEV+Yw6Vm/JBPSrXYOM96Ry1anQf1vjocByBrsq5Ny9rCrVkvoZvmeTdabCkjTh3IgB3/AX7pDDntVjp4nQ0JqRvpLuZcZyAcA536vrelX1kyFvu24tYUgZAkxSmtgRYjJ9INSDoVUgejSQLv5qgoSG7DHNLP0D7bgfZunASf+gFIfey7KZKGIToBC/2z5HO2Ui+rm11NdUclxNorq06liPPjkrm3qnuYIuZFVdcNMCKQg7fx3/Hn52uvTqUsh0Pk+OXsvSKW+tL1j+sPqkjGGPz6UHIGmD0jPs9TtZy1i4Yay2yRU2WgG/RZ9rM4kO4AfS2ohg+0jpyRJv+giAN8lFiJtgPIm1jnH27Bx4Mb8qsOhx8LJ9gfOV2ATHXJFAgqS54kz8FFzFskHGUbOyNU5AtS1ChYxOzhuwnJMKCRXT/jFFqPkuJy9HOZ2R4NXgcHxIzOER97EUdTiSNa6P/n5w6sjglIM/UUkDCXmqRJrb45yzZQFDi61O77/Ah7hAoq92TpDXXupAPWS+lqzgfbTx0qpxXGzZroREteqkQSV8FhnJdoQJEoEEt3XdSHZSe29dVV3LMEW/t1gVW6qmea+YAJjjodAtkZbj3WiwS6QlD6TSuGSEU51UWBeOynLeLiRx8WJMFGmDpr3tiSfOpOwJ46xbP2/S80r57U9aTDFvhh344cxgLdXg0nBhdCzVK80lhB/eOmopBIBxlxP8flGQvBRpGPbBDOx/VDd+BApF/KP0IAI5JRaGoUvL9oLkchMHv7lpHwaxr3Jh2w/pqlVe6uhG9FfIVaFTedbyI9lLo2t79vS2/IIhTMAZYKF+/22oth+j2p6cDglO+FpFFQES4enqWyosV3hoyhKaJWxtdN/UbcM3GXtYLih/pCgInOaCjcwB3fijPzMMVX+GtiNvimMzhOsvbCGH0N5qVMVmFDhXSEJxL01sxO3AzCs4jxtYPbBBpNkTcdBBI1YU4v/IOylJaiEmycTtGsxyVKieOCbITfL2dPV4x1RV0msRl7s7cT4eKqqHKFjSfki8QHhgVaeb3N3MHD3Mgw5K0fDIHuBVzCtVQapp/L7ubUW/lI8zDI1XktA3FbPP7n0N3ovUsvAwm0kj9BbJsA3L3UeTn70pX2RQQZtqezq6PUAeRWc0L0p7DYh2tnYT8f9KkliORM/6Wl6tIdkDJZz868zJfmyU6mxr4B9NljWZrU1pKfIIZwUdSOIETqOr/+SJBJmH+nqHjj8k72IGzDph+AzAWw+X3V0EXkYUTYov7zigtKuDQ6hyBGZ++/4r69qS/xETKsmixq5e47Dr08I9p64fschBEkSEWF3R+SgFhjxdUPK7x3GPVo77KveFqxelXrQGzISn9uG5xI8Y56clu1Iw6eVbIiOGrAywr7umkdI0bDoC3kSWhAMyX61uf8td6zFHHU3h30eauzhoYRqVcVCgC+wtjo1RI72c+Qzll1oHc2rzSkbKB3YDNVGv1RtgbNZXRrPvDcu4pt+AnLRA/LVaX+Am8bMK1mCB+I/d21a8SEC7VXhtDhh8W1ferAenIHr9Aiv+iLJNjf4RkM8EAv8wegR9Kv9WrYKSRSQSvOOwL53QjqcfkhKbwLO1Co6cwKe57bK7pxiofqIsAv1y6irxsf4pvJdTH0nGA7kPmM8vr6uvlFv/vHTnqPNUPhjtRi9mjMePY4siOBxLAmUEz6ukDMyJI7fRaOMOupO9AULQmz1OBYIMoq66kLNHkQnbkWoe+O4zpgJIduXP1EY2HEQm7/iXovsJsrW/XbCc4jlOiIORD874XCfn13fx7Rttiivrj2k8bX1+wa8u1Jz0swPCb4t4z7r2dTaXBkBIEbjNLJGGkaEX9oOMC5NFmbfwDHvF05SMjEYxlB8mbTv4LGHGkHtBUbX3cMMr/qoKVhfwz0g5M7wr03XVvKi1L9zK2+bRHGdtI6UG5xvhnDLjsMFacXQ//FBMFqRIzhWWaHdXtt3qKTgejLQA12E4HBG+iIszC9l8/+gm+sM+MfTo1ZvUdX6VJB57NBPOvZdxRVi1RwFpCr2hw5iscqNWZ/M1qvf2rqLWHxnkilt8Ppi+pnxI5yJHGDMKPz68PTJlaxMBpf1Xyl5OrWHXBSwn127IYXJfsKFenl2IzrUn7pb5AByJpQud4SuE54dLaLX5LD3L/FJlQYEmWG4nUOHBl/bOyi4hEEBfDkFcfbU8Uo+vs/tE6VUyKb6sSKDN9XsGKjxbxEyOTCTXMGLyd+7Ie11kpirQ+3f3dN+rAi0775L9/1IV1ylQS4DJsi9mKSjdcJM8ugpN7as0FqmgdcSCRO0zX0qFO5RYqQNgD504459O+0Fmi2xDgnNQROmrSwuYrzga6A4kq/iz8qnN+4ReusKRawJFAkQnb/tNTYIgggrlHY4A+oBZI+E21uBvXHZmromHZJitRp+SbzoakhxnyLAftsRQoA3JL1IMMn3Fj34NRHGW/V6PsFQI3+dekMhwhk2gDLkfttEUczdhwSYxDJlw09uQvBcM+QBpAlD1y0oFaUy1Bj7Qc3GXnOYlhMHQNE6QOtZNMWIF39SVg9/IgvyomgDplFLTY9qSJIs2NqGAS8N0bSkMk+/PAoYXRB4znUb+1f8vTlzmwDLno9sh7d57pwsJ2HSwstjPn9xZYOsx0ra6BIgHmKaZpoS1bqpjoAlrT7bNM6RQzlukJt6EOCGyRdv5vqHWw4mimazddNnp/blTk5lJDBCbDa9tQjeuaTbYcVoWT4mjpktqCQEB3gKtsFzqW69+WCfC3H5tbaSQG39rtsRtwj75lX//2/gF4CI5BbGnfX3ffB557EPEkOsFfuXD6x52HKeZ3UZzoTl1XDnHurA4kVxjACHxJaQ1G2/7mZ170KDihLRlQtoQeq6onLCxhW3L4nN73YhOArPQPtZdjKz/BLfzPcLGity/vb7lDxlr18qxYzHkBHXxArtpYAxCx6azCEPAfgRRtA8pl4yv4+NF7rukjg9GgoGDlgBOrk3qDkMaB084OKOvUxtCbxLwIRTKfQfFv5acxvETlu9WiA6drQoEG0rcWrKqQOvT31wzvFp4T79TCNEh2cD7elJNElGbkgG3T5YZMcPzc8XW2YfS0CXsLoWC5+LifNllPvwXx+2IQijsUzZ/Jelos6ev3/QkUQcq1GUOliWHZ0NOnEdhEazl/fCJ1JmqnmH8LNnZCTN+8rJEXVQ9wkeRocAl9yMI5Uy6XIx3aocJf6FYv8Lroolc63MAQKQbw8LqLp245IRwuFOGn0us0jarJFJbrdjzI1e7Dpbxlj0rk5Qj9u1gXG9J9wmOPM2WNDmZ/2BfcfCJJN9TQdjjBSktvnghDt3zCGtnIWSUC6vYSfGJkHxtFnkiBjgkl1Grcnlvl2L+UBaetywMN80uEqoByeLv9MKEbZl+gtMOlSsOXwTI6RIa1o2HRF/CmAxr/sQra2xPXGEejFQPo+9u0W7Dkuk3GHQHYe6yYhuFyfqeqzIsz11ZG2ddz5XYx2wJ817LwtntK9LQWhZjZ9sx0Cl1iqpRXWod+aZzgleBw5O5XlWrYBhsXkX51Xb6yylihpdnq2vHPjoC1RyG0ziZZHOw2Ec5yWaUdelDCvOQSJduKpY2DudE3lJhChTdBuGde+jdvc+nvq0PJpJYTQGweR6HvVOIUUzgCci1NFcZzKM6FitclyYeJ8quhCxxhCrJ0C/1zqBuUVYjZZJICuKIp612pPKAaR3OdOkFtv7dasKJscQsU1yB6ACECF20Bzgnx/+MC4AObiXwpwDYRU75tTCZnIse4SwBS/xAQn0tILtr/QWoch/uVhY4rORADIWiHCl85tbZv3bJnxmgxQcew6ifz7I4DjPExk2Gs2NwcvDYdsWasEZQpJSyvrCUbkn5Ot/A2N1QrwBQtKo+62MHcz84GJA48RI5VPWdUo1qPxiEPCb2huYB6KMMQMQ5dMFzmcs6yW4i4zUOnmbrQnGf5DOaWkr43++k6ClxQv07vPhWJV0FrRIq2tvZ027SsiHb1W4PQQKVPQlt/pwSIZ92ERmoN0iC3J7PseiG60mYqL7DRPKi6hNlrua7ur5Lfh/ZaY5zvYMWgGWXchpoNICz8uNSWF2Veu5P8w2C0VlS03qmsAHl2ofNfZE3nn5msuTJrlyuQpEMJ5BCukTHFGViMeCNnLQOjQy2PAl5DeLuvO5TLBK0Nj3zSJ2X8QjotxXYFybvMNCliH4b+xLQdJKT7s6v7vGF8qeQP0Y5hVTa1GfbDDxb/jMJaUZU4lL5Y5+PPQssY0WE5pnseYv2AQ8fMT+WHVFM//g6yLrjr/JHcOyjT/oIVDY8qX5GzhIAtLgW3JbClVuwiNv+ml/H3ki3iFMibAKG2gM34EBFb7QGvWfm0+d2CztoXD2GDP2ZLItQwo5x0FSmAOlLr0o6Pln9dpiC67fpfg2HO5/IyW3rBYRQyHYD8olGWQgJ+fw5hdTrHHOou4HROQR49ZwM0KW5MPFBpa9niP47X3yupwFlxwWXZcf5DElRWWbV/VjdEWp2T5R6m16PSF3xKFbF+pYMOUJmu0AEuqCmSylpJO4ZJLNI3YeRxysetV7J9QVMXhWo81b4vCwbXz1HobQee3AR17PK0OdxFaO0XLufaKtRjJyVuf67l2IqLMehqq8nXnKzVm97xiFBm2DZIftcmILB6UQF4MDRF8cV3GJ2npvv+ZDO3nInjRs+YF+g89zzl3jJqdBcstT0Zd2V+H654dhnMVmcnDOsxVjzwwWkM7qp7aI0ZiABaNMkxOJOc5BNMCjNdQVTv32Pcm8WQH50pvyQIoJG3Ck1UBxb6bltdst2D+0rEHSkFqFbvtMhlkCiTSQ/5Hz4GVsxciic7au0L2hdhI//mT+s9uzNrZULgYRfRXHXj5agSbLuuTWW7CFqU766cYLVSW3kZ7UwWofglzizbYn7tP9m3Crapaqcn2oYJthWAHmqwvfUV2z0B1yGQQeFphPElQPKNPzMGw/2ZcpWALZF7301+OayDsTj00gb9Ke5D2aE8Wc1o7yCvMCf1UmuMxCFqlm4Vc19uaIkXTlCQKswfg4QVc72AC3pCIHZ1dkbHhsb3vNX9xIIofAAAAeOKr8kdLBpvf5+WlaS6nwQQelhxh0SalTV7XYaC+hU0K7C7dGYOPdkWWl36h5RYHkOoXW+cd2SYbrGGt8llYRq/ps9u9Hbe05qd4VqGta76RntYnDNfU2lnLM0KqNkAEoWAgE1Zx/6N1/2UCfTxVFyRuiGfosEmUb3d649uhHrtG5rj5bTj4n04gApMg6eJ8ThzM4RvLhCAnxChRPMMp/sxgCj7OUi3Rq+3jGsohAMQrO2CzJwOT5g62TL4o7taFP/nJIgxKOw7RCKPYazmgdMxsOwU2wyOBzFWWjJoLAjdhvUhEbDJgz1Zpecz94Cj+BszwIRhFwX8jMARaVawgoCkSoImVrvgvM5UdPlAJdYv5oVjfBrgjb1nat06LLM2XedOnP10bqsJutTRcy7qX0sUOa+9l73diGLj3yNYhSPCiTLoxCM5UtUbJ4RCmiT2ZUtPEVH13s3HXI9wMNhc+3YJfiGpY5q3dBwiBs8dnLUUe5BrH71dN7l+aKuwGM/luXIiQxObVcryEAF2NLAZ4SGYLR4DUGaGsgdPHmySnIPEscYOeQuaaHV+xKAL1RD5o6aFTMS6eO8GxEvow4Jj/vferi21ivwbQXK259X9zs7A/rNnaa5B5z5QwAAAAAAA==",
  "2013": "data:image/webp;base64,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",
  "2015": "data:image/webp;base64,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",
  "2018": "data:image/webp;base64,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",
  "2001/02": "data:image/webp;base64,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",
  "2022.1": "data:image/webp;base64,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",
  "2022.2": "data:image/webp;base64,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",
  "2019": "data:image/webp;base64,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",
  "2012": "data:image/webp;base64,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",
  "2014": "data:image/webp;base64,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",
  "2020": "data:image/webp;base64,UklGRn4iAABXRUJQVlA4WAoAAAAQAAAAnwAAnwAAQUxQSLUPAAAB90c2aZPk/9NL54hIXMrDCYdtGzmSPHN3H+b6b3jC7ocCIvo/AZR3y1Ax7WJeWVh/TKKLDvbYlNoWK+4Rre2wxYrXlhjRHnZIfklu7h3ZBQxA0uGSWBSIvwhv2Harlhrt3zXG3LsECocOHoO4Y00g7u7abnGBh7gLcXd3d3d3x90dGteiqvZeY3xYqyp0r9n+fIiICeC/rEXWkcvfhWdJ3Na9/10AgoNErVDAcSQlGQ6YIyA/yzMEBzzLibrQ+c3vvxWnqeKkk1IRF0C8CQKOAIgD7ubujnz45fUar477E8XDKurEowReV+Gybhxx+Rt5Y6arhWhrQdfV37WperwKQhRVIqPSiJpGQkIQb8Q8Ak1elRSjYKuJ6zHblapKZTRU1W5RdMmfsMHNSaFeRCyx4gs/Ss4EvulHU4UY1AyiiVdcFnKG+OIkCY2IEseksSSsJYJVITQWzdBYiIMRcaE2f+JRg1IESOJWjkHkQww8SRJAdHmhJirmiFltDCRUkFldIKoKFEjyB5fsGKy6xfyJVISIOLVXNSRLm5e+wPLmDLuT9CiMqNon35LpeWtc2hPXRHpTWTJxci8+ZKeGZlizfoSoeBg8u9hQX3nFJ2o5g/13I92MyMqGpLdCyH19kgRi7CaehIQIhhDiJAFCqIhBQtQlBpHX/DmFuEVQPHH3RiQenuXu+QOXArF1JEvFYjB7TUlFRBCpioQL9YgIpr40f865v8BFUVHf5XaJgcucs8cW0EBSwVgsb7B8Eo1/WKrw/LksOnAUTfX8iTSiVmFE0Fk4PuCNuBNRMyeOWrlaGoutexzMiHYshH/dReLgMSOSHhmR6Ig0JngMmi5xaKoTxZadkcYiK3Rtg+RLIHDCKymJigMCcO8fUJAcIQivljZAhei6qG+wz94YQo6rUDrPt8EEqisi4uCVbVzYK2zb1ZW2uVGuPx5+Y/Yu0uKRjkg8HFre38XYmfX2hF8/iuTmxYUd5B6zcS24YvEy4unA0j4XevWWsBsdF32Sm8D1dgrfma3o0nHVqLURwZFkxh86t+gG23OGvZijIcnHvVZaYlufby+XxXGPg4MyqfLETm2hR6/3k4fQnMA86fdYDXDR7302SkyEWfzlanGq7ugtE5DczEmqtwDhqJ4yFsCJpAPDveN+CPyytf1AXo2J80kAzH1CKqLOpDWeACSsmInnBJbMRVLIwslYZObNEkkJ8/6aG9dkOJ5yhi8QB5F46Jqv8ZTzVa3mBeFTNAVfugJCHB0QPkVSwvcIeXVGrxEH1H4gts6otergWjcKz9HkYRiYTP8Oi4h7atJ4UowckSMCFxng8i7qgEci7aHhy6wbCORX6b22mRHKLyKkPR7AG66gyc65Egmf9nXCF0VJUk4cRQCTL76WxBhWheSIwCnHgN9DyJCYuDbcjiD3Eciz0K7XJny/QBJiag5g8uonquNeEskVgYfPLl2NWpbEQUi7lq5p4MYVgXyLPLkjk8XIFOKoksL4ZObkZ0RyBmtXVYJkxbIRSFYurndyLQjV3VYjjqZE4kBKcVizfjWC5AhRenRuW+WCpWIpAIZQbN6xJyrkt9iJQH/ZcnskbCWASBxUQLZSYYMeui+Bbs1yIrT6bDuhL8UB2Gk3O0IsRcDvPN0Y0IodYZsfuqM5Kc5+i7YDYEvpePlq1KPhjrJgaFcZCNu0lw9WtEZyAbxnG/XeNGED/0vLYQjgkQBhbPP/804k62/Y08Y2y4vytA0dhNOy7VE+CcCJozkwkaM37oDJ7hfa5yEvgXtszRoCGzyzpSzO8EgYzoT6Tq9sToELV9qrCHmdTWU1Qpu9ZNVcnGi648xfJFs1R6hpxgw0N2PAAcrMmhkbWTyBMoDD1+TVGbdMSQsj69TBPQ4GqH+HpNBVI/DczJmLp+BHhHiaAfyEppyZc/KjdcMzPJR/xFMSBwecMSvFM76r1bwgvImmmDw8K5LuqemjMED4DCGvzndLxFMfrdEMj0PaQ/I5gOvqYXhuTGZ/h+FafgEBSCwewIeuYP7TBLHcEPiDIaabzyfTPQ4igMm3P2CIvGVKfoWOcwW6J4lmIJEAcK17QDBZ8jyeI5T7JZGNppDtHgkBMHllqpo8PUstT4F+JuutbNCsWGqGy9JLCSvuJufKfdJqPCAxkZTg8vzH8vREtbwd17mqrGQnFgkAx7X8bHKfkHPhuj36uUKVAO5xcAeKAAVb6nlTnjzwpmaC3tgRwSwS4G2va4YXjw815FtUqaofcP5FbHrCpghJLFzY9OQtsFMHrnFUJUcQWNPggwd+tWXV9ghOHNcmyg6VO8iWF3t9LYH8ChseAA1lqb50r0rfCmPtWjx/zgIXNnP1oW1k7VphYHckJ0rPVVeydAnJHgMrpHdNIstmxQCfgRW3l6pdDk5Iyn5l/Q5oTlAetmvPm4Zzdy2bbk7Bxjv5FxmBdd6Mkx8XZ97yC+wVFfKzzUo7uQ5lK7yiDcL3IrlzXfIldGhNz24IC/48tLQrITcoT9ktjmLidMd5e55Y3oy3ZhborG5OYL+7eKcg5KnXqmYCKM7mmM67UzxnLqUHULbGVIDqQsNANEcoNzc30gmtcdfbvyDfYsU7v9KErmRbxXHkW2W9A5CsNrhTe8JGeJ6gx8XqRrss8YO6uOaKwIAeJlniYjqxYwHxvJjQqqoWh5oMta57upBz5TBxAaNZETBl6VSCJSbI35VjCYEFoIZTkQEHSASsy05kmAGYMPOTJYQA7uAZIrJO3D1DQISgTP1gKRiApITtOpoQwV5dTEhYXQYEnJWPXP3h1PataLK5/xxzFZrqy8c9fcXr4AgIawBJNu6LEEFh22CSsBB1PAiuTLvlqF90bVlVqKxp2by6usVmmzQDs6YYAgunzFq6um51XX1Dae2iOSc8sYiAqKcWgbgMII7iujkkzEIoFJJExQn8zKoe2+25QDHPckTGv/b5uLlGkzUYmiABYTFAl4JLFMCbV2N2EgVavjKoNQRBREPjqgCdThhplpiBC19ffs1qQAVCtgoSoPXgV1pR4HdWT4sqI5biOOU9tBg4ziYO6QRBaLpoUGg1tM7KhrPkwVdXE3B3mioB2gyaZCcQCrpDg3lAogHUL7RBgHK02Yxz24E2Iqm0BDhgoSXC8nElgjmZ0ohCmzPGW/J7BPizPdpAZBsesFM6tQL6jzGbcGKRIBlICJICCey6uEyyioI5gIiYZ0iA344xm7wThDZdTrKnArGV4sO2cNz7Dw7aYpuRJbNP+oCmqgFCENIFjrRO1eCAKAlQkVLY/nWzhvLFW5z55FcT/2qPVxFdRy5IzMxKU1dbuWzLL64hINz7zpkDqwENAgQe2xkHVAwqN+9/0GyEQOHsZVYum61qsPR1gkQHEXb53Mp1llky+2gTQuB0s/KIew7rCCggRQzUjQ59995psyquIgS6v25WssyGBpt0CCJEWALNL6k1K6csKdm8gyhI9WdWNrO5T+2jKIADzoAr9+8K8P2eUqD/JCsllk4Sswe7EIRob3D7n6oQ0kmo/9PTxVLft9sYKhw3ZGMEBISNBv2pK25I7f5fFksHPdI2CWQ643Yh3pWHDh5y/O8v7e6agWndH56DE+41xc3ZuCXZlVsFEhWScPZNcMhTzZJAtslXgy8897guSISE1u+ZmYFbSiAJq48Yts9fdnMBQoLUgwiJUlYBXD5+9M2+z9ckATwlCmY2ZTc0QkBxh5Pu/bBHxwqavLw1iaZAaKglYU0tIqTdAovb02RfOPXJc3ZuTtQ7dO/cpft6bWuaVyQr5kxh923b0bjA9c9dWInQxJXTRjV0blmp9XUrly6at2j2jAUAEivRoDQeClYC2LDXbgd2c0nhbHL4ZjiZLpM+GPb1lASkIGWjUQ1BiLkgAu4OoIIbPH9kEjDHePvs8879CMPNxfT53zYggjuAiIDj/KMUwEFNjx3cy90VNZ6vOOSmfauewlVIRGTqHffXqSGA849Z2OKag0gC8O14+6olxVCk+jMb84UB5QKfXorwD1w5qq4CYNr7L/YYvWYHAhDYYtnYngP+uPPGpA9C15FqdDSEoPIz4Pznl4TamT+NWcqrdguBdOA8ex9aDejTqujV60oUJDZ/6/NtWifRDJHW4+z2M1jXKoBC/4FIZM6764QBXQv6c0RB0HK/j+xKAtmBM62870cFS2nTNAgIQufrSxNaiERE6VlnZrUT+qJZEpTGQ3L+hVM2FW1EpdOotbdcoBlNVCW9cTsCB82wZXYlGpHAGfbYwTd9+3krVDN+bsv2HWl6h80XLCNTVAAJAlLRa8gH9R9XKbfZpT2mr90GjYZI8cvy/kARAQVhg123blK2CCIpIVtxGu+/G5s0WMMkuyNwUbkH19tQQkQ6jbeF7158RJUS1kdE5DW7gtAEUQEBJVtUUkDNRkURWh79po2urLh60MZtnrL+nJP0DnsnD0YEaH/8C3U2oSUVD6/8HbD+0lJ/gqpkNdqOytYZmcIO9340vW4oqs+bzSvtSfoM25cz7SC2tifQWAhbHd0a3k/+QpuXa4eXrmvDkfZjpQgQANEQgkirl9c8PPkwAqKaCvzZbOyS2t7UTF+yzY72AoGWf16+Ykvp+dfhoVX5yXgE7rBlT52zcl77th/byJtX2F+43y4ncN3QakBIKweMf3Dqs22kIGQLnQ/bqriHvUq75Z/QbHpdT34zKnlmB+Awu/9Gey0eQp87JpjZUDrNaxj9xXtPdq+aVu4NQ82+3S0ozTcecOBeCi2L3VoCVPfcCKHRbg0vsX7yRKgem2zFk7YfbNVBuN1s1mnxSFduf/FbGwqXJoOPOrgVA5LvKmWIPfB7s15sMaZk9gqdX5m8bMHnFXr+h/Pq3syS4ma/+8IupUvdx1RNWNmZ35RO/MPndhTa/OyD2xNTDaSVjRfbwrk7c13pRna28qxh099p0+JLO32/Q7pTcdMDl66Ypus12LMLl3dDIXDeytI3F3VX7rCdmTq9hv5mZt9thwJITEA0iAC9+rVvHQrDbGyrdhPmH7r5hi25wO4j3WnI6xPWjmfn5B6esMMJqfusPxDoOH/cDeVvhE5fPXxcDwEkBCHKQrr5NR/eU+AgGz1m4p6y6+qv1luvT03Vd/b4lckYzrTjeMYOyLqo4c9/emTYNnCy2YpbUK0CEGKuKkKmcM2zg/dpplxh89cs66yTx+91S8Mwfll+ZveF81oiqRPNzJZuilYctFu3agANKvwDVKHxIL8sfXjhIQUesUVT7HvC92Z116CAsv3Ll/x+145KE4V/mAKoFgLKrXZuNcqGR3SuOXlP6Hfqbj0q+dkSggr/mIWz59ieIbBuRUMIyj92YZ83HikgSFApKGghqDTyz6LwT67w/1oDAFZQOCCiEgAAcEQAnQEqoACgAD5tLJJGJCKhoSw3nGCADYlsDLKxE5cB1OWMvBf1H9vPaLsD+F/GHG1li7WP7Prh/2XqO+9L3AP2A9RH/W9TP7keoP+g/3f9efd4/237Z+47+8/6X2AP7F/lvWo/6PsHf3f/hewB/Ev8B6a/7cf/T5NP7P/vv3I+Ar9mf//7AHoAf+LiSf7j2n/5/8mfQXx4fHpfPe5g940d8/AI9oeau+S5H/ZegF60fXO/Q1CPAnsAfzH+q+lP+M8MP6v/s/2R+AT+W/2X1XP6j/3/6Pzofn3+Z/9/uDfzP+s+mz7Ev2y9lH9gm+oRl9rF1XXF1mjwlS8o6gdoOKuGwD+8pF7FeinA8H+I8PZ2wD0ONAWyd3U3EB7Nqm3ubH8eQ2p126dYDAl0mRXamNWC5IVFMNvj/CLWhVia2QGbUBNGDRIBGK7Ik+BvusblnPgkWnXUmwmYScbWd1BSCkgWWKDwvwRiJHSfZv8Lj1VaCpNQfv6fd02FB2vCr0ncN8A8THkMuEofLyV4NpsgiG2L1HRMDGbhxTawXhok7VIUJv4Wn91QoyUl/1MC1j6DP/4Dgg8UvFtN0rssHtP8S1rM9SVsomtZGNAYIDea4r1oCJwY9/xI1SVkx+1NB32fgUfouhYNlALB9ETNgXN2/5X7TMfIZemrafMW109HkgRuSJs67fhasyOtFSllJQGmnggAjSoiOqYj4Wul0ZoH/BOSG+xb9BF6l5m9AAD+/nyZZ5sX4GhUuqd85g7vW/aZM2b/AOefyGLFqMc2ldsYTjNcseuY0q5OLPF/AGAtSB30m1JiIik/39KRwM/PMeH7wMXJYYv7jj38Tnx7fCcxErZ/+/t6cnX43fkfjpzcaaC2V08ASfD/4WM8A50cNbjwFXkNmDInl/AHub8/5bcE5JNi/45XI1y6mPXLo0enbfZGSxZY0ZCsjSrLvlbZnaD+mvp4WWiQqsUTm21HrRKOo7dKb8UQ8nWkYYnouzWmxAo/GIPdxXqgPVFc5p3JFMUzNYDgxMkLWlx7ps+QtEMDyIGngF6yPGTqqik24q330HgVi8+6vx/ewnY6ffo4eyPWcbSzNvKrvYpWoWZYe7ZKjSmf8LABbIsntrAWNGaO4mN6LyGNHsscxqgq8L8ABOwVMkCxAgGiTWqku60WlXRmIXeFuOQ8CuaMy6C8bTJdffIs5UkN4PGh2J7djhrmqdh8qEU/CvJh9NzBkmtUVfu0SKS07bfmTI502USKyeYdeD5w7EnnYjE6K0h+U/PxCmVAUes0E8t+ipyUWqJQdv+inQVi2o/OOzXBt6c+8P6HOHBvjg8QeJ7kZULGMzFHIcxO9sDKANXcqKoZz6tnudpe/WikB8MySM7LAkfgn/p6g63tzeJxs8D5YIgFFzAzFA1d0h0evngQUwRYIAtq9OJ10V3d15L4NM9wmX3JRGYtVsHgFcdkSQUDsSJ4KEQhSInT7SOIsfdpU90sVcsW0pevWQZe0G8/1OqFC04rH+DNWtJTcdd9+RGQ1+QtyX3hBaTppWffb0cZ4wFlGOxwyWBT7ECjYKtXCAxnCvvjR3WZgtb9OLQuiy2ea/aSJVU4jI89ajpA+dXNBbceWd3ZEL9GR6ccUUxP+lJYxcXgV+37TPaqv3VSw+7Z/+WdKzNBh/C/c3KbRvLc2Yv+ZeETjeVZWs8fcEuz+F0fFP5YaTgfTXw4NsY9513eS1XL2J47yzpXq3PgHsD9KLnF+C75xv7EVM5I4SLaviTZFwhJW13U8x+1JIRrrGyrpRGyw7vkRJB8Z0athUY3ZmIOVed7rQL139vD2PUXwMs+pWdSk6ylVQT2f/PAGjXxb5wMwlcIpkWdJvLvw2qcO9q8JGV4gMry5xRcaRBZu5UVpPd88riAfgVqdiiDC6zYMc2FR3UgnaUBokOA//geTUl8yYzyb4ODm8tYuyB99MFi06SSHMKxJJtuo9S9VuxCuiT+Unm7mP/DQorIXvJ3NnJHwjXIUWaHquwI/0i3IftnY2NDVN0cYAEu7tL4hkEvM7+ALwakjGK8EVEFXbBOnbt71ZoIXJV0GURBa/gzSbslmSg/9HfXgN9sdqCYcWs/Pym3G032bzg5l0AfsA03EGSZO3irEmiyC1QrUDQXe0+1Qw2wrSUIzZQvLHtXaiND2bWFvTki9dYpgitspOL34hpBjNHRhNsjuw1E7nK6zpqwA4pp0ucZeKCbnnboXg1qIS7Jolhe7vj6eptvbDiFv6WK2vPgV7p4BwWAHUDI7DIIVFZ8LvIPLTUyNUi2Q7R0j0lp3Ll3bqs9XQf9DjO9xsjXB+jRnb8SQpYXK/5A11I6BBobmHTWkEAzlIbtLFQfdAaKUuWGPbb3KNHKxqQ7UAuEAanGk5yfNM6jXCokSbp7pa/n1126iEkXfINBRHpT+Ie5jpTHJjy3A/zKxBSIOKUoLVFnI1sx81fv2rsOQwpKaT0mJV35M8yEgIYmZ4WFOXtWjaMaSjw/ZiAqINt+kFHOcQyqBPLWddCQ9RCJxdLJtSN204CiY1hOBDOKHTXk6cy4cQ020gB6zFTN9Dg6zccmrfxlf3bSxoyKFSz7RGBNAlpI7BvVPYXw+cjCP0Xw+f+Hbch6iPcx3BbM/hpqnDrPN7mvi/hx05HaaNy8V5BHYM0pADxi94OgO52/EWO/yo+yOw7Pz86dv11tReQlAZ3gOTQLfzh6wDcDh/UIoqFq4bs4P1jV2SNPRLz0PKPu1UHWPCjd2G/Sb3imb5Fo672/7ehLQA5UVIjsh0S8WWmGgn0L1bFV+PMU4QFY8R98piP3pCJRcqDG8osCBTlB7PXvjkz+lwZ3wiy9iJCra/AErRGp7XYrxPtM0YLA3S8DacssUJHLAh3R6+4dgF8++dVMftbNhb9nMILWjIRW1jK2X5ickLBCIxZOtxLmSRW5+VhgunxXhs8+wogFCr5N62tEg31a36C6xO9vJdHAAOSwIm9FAOKRA3MCcLQEcRCNpTO9Ge8tRT5eGHkGbIket4yx0AlBoL/oKtmd6P8LXvbrrAlFj9E1qYGRWqnRvw89V/bVCvkpB4ghBLGZBiAlS7+FY3+lkwMVIuncVivpDisHLZ/kR6OQBI5GlDzEyyWYCRKvzl/v7/aYzwcZ6P6dE+vYEb/nBin/lpPxyVuiasMxX1evKTqt8FT0vJCgbVd1irspnkYSHCXWPFSHfb57w/EFCUz0HqALjT7/W8XHWRXghKzNCTq/1xSWWPFJKLJuNUYD1o7+62fwtFeGUVif3nLWDjqTwraaWP8tXFC6ImKrFbz0Wpumwji8Iqb68CeKSuR4A5xidzkArxW49l8q7PYun4vYpkYvYYByv4iIIlBMgLXjTJP7P4/ZaPVpDPjSAKCwSKPLo/W4AZDG8gnyaUw1U0jSouyQiZT+zJgacKjuDIHXK3vJMHPyOR5pCSmvNs2AYceQ/bciMjgr4cKoPv4yPRMV1UwkQt6kQyhfqN8xFWv5q8MkeUZM35YmyBZcfD3wI12CGJYuq7lj9SuUZEWj7c1CdIw9g4LPt5DOVw5lvdIUNrsGOtXX7k9DuMo86wMQ8G9llK9ZdGdJMu6eFlkyOtnq3wGMNZCaQGR3d7yUgWSbiq3a7EFD8yrDzNt6dmxuTUMqS0KQqTcdxidFsCEfrog/4OVn2L7ZRFpqknnzE1GoaLXyxMMjdwCWIy3fD27vJDJ7QGwhyyxUQQUnKKCuiPR1SDnYcUHcmvQq4SYmEK1dC4+Dl8OpX1PQQv1ewBL70r/utUKGUetPSAne8tblLLVXFivr/YEWb3gQqtIFhEToe8WI63Jix9dxfgN+vE06b3MzEco8AAc1uYr7y6un8i1sXYcpiZwRDn6z+ZD6Dm1dFE2szDd6uo57vO1TP9loDw6iMziPYX82AYdn62NovZMr7sB+Dd+oVm3At8NenscC09m+yzc+L/GXDXdXPPjerv55KlCQGIlQ/NwwJbgBbraD9/b9VP1CkuI9z/3kkfH/WizbaVnllzNn0R1lA2aHe+vU6pdxQuRbbkL+3fu46xKnLNT9wbiqEm+oJH4SOE3BP0a0iIwoHLVSO7zjvNT6SwA/rz8P/7gwLv93pHymL8Uty0J7s88E1K69scoe9XSU4oRTNREUJWa38N1s9T/AKJccQjJ3ycpkET+9/71p0eI7fBYaoTOquB2HvNVfC2g4oRSenDgnxcmD4PV6I3oAB5ftkpUQvj/DvT9AvaSLJ7IF5vOnu6ZpFqdoBCDFZy6Cohe+rUwTDk4FPmicUbkRdDewHUWWi72Cx3LS/GvN5A1IJNJlnlBH3g+FYkfu/U/Rec5hUeMBN/MGvFEsucfOl+HY8W8QoE7mtXrOBm/A0BgdFVgaQOuEww0bbpXdhyXNC37RFMqHt3pfoWB6+aB7ev9GFOgRkpBe7HkzVgauMhrW+5HyBqNT2KKYUqrojuFOsVgvN6vuggMhqG3snsuWMFeCf3eMxUQsZoYkxNQEewro2WQsv9pcOb0WWgHQz/3aWPcO6OyGIjyJTzogR3CZABJ9iVZtahAFoQRSnqGvTLQF5k5H794goiPb1bdJ48RFDwVeT83zLbKHcjFmQh1yxi3pfdL4OCXX7YPqyVyKRohVMzft8PBfyt+keI7FJbLnfUKtV+NtHQxLcixikDvYEHKrLBivf4V7seBYst0UWPKrlNwXEPuPPmksjlX9Jd3PO8NMPGwuDe+iYXWot9vGo3ALTerhBnXH0Lv7xihZzYSFnhPQlZ1FnUPRZabrJqa2vkSOTHiZ56bXl3YTtplJ96hxxP5DkHXz1Fq3n2fMONbwhTWj/8H1umFX/pq+LmYevDSDSTRPc/g9yFH39DxV5FTXOr7Nm9INLMmmcAPW5HNTCMYWzBVRo8vECTqdodf8sIa/FiJXRBQiqPDkYEV+idadHPHsr6YlmBKCy/M1K2Wtopj03PP3syLDHoHcVIl5CTDlcCyc7czw6kkG7dNTX/jYAPZ7H+vlesxldfPS8sDYkcGSBMTl18SBeI4PNjQVBt4sSKaIhfip1/kDp/9rr023qBgA1G9TU9KgSU4ihDEA0B1zoFi954nPip+7ZaxLP0/1gR7ubhY2pcd6qqRoJLgE30ps1mtNVxKpwWkNOuZ2efMssNgQouYKUnN6rAc/1JhgwjR4sMJ4Ku3L2mEUspMvtrsoqFvB5xdd6PjhTlFDR3zY9KhfhIDt7LfMdUytAK186mlzmtvD4ZbmfLOdAQToBNWRPKN863xtqx16DMgLM2/ADb4+qNLvG+FOgZPnQzblM5rvKj6I404KANiZCvRjSmID/NxS+gjWmzUWN81aEWQWmCgYkHmBjsAbNH+oP++cs7l+uTzuGHprs/qopKUuaPOiHadVkb2riO72Mc7tn5iEApxHfWaWxisiDyktrbT8g1pWuyBfbbaFOZ5nhScv4z2aFNMOdqRLEp9w8w5tjQin3RQQYrdibMCTwzAeUDdigiEn1RmSESbNtXzfwrWZve/ySoHpBvf7AWQZUKb5DlBFqEInqMIbQNWQ3npKtGfNv05x1a5NSkMlzbrK3HHrVV13ntGOBDBJId1ZJf8itjq54ZiMDxRsqCyocKws8rD5bHoRKDxfhRLkOKKVcQ/hhn1AALSmX3lz9fmFz1KHqUPMGr0zJ56+Hu+3YPTNkcnemLt5ZukTJ/UW7+eO9sbfp7NTaSVw25BDDH1ZEUtgvHDu5HCtSjBhfL5yLw9qNvZsuosJAf81wof4s+GJE8W+2zupZKho0hAAmkyVnzCvlktHAMVKsCXSWz0xWY5pMqGjd3YQUmLWa4krwyQbUP91saBCfUEutJ57pJKKNnxlQoe4poMJ/+ypwbQWH5s55tuskHyBHBr49/cpDnICqXstZ70Qrn4RHH/ekjjh1J4LOz2TVPdISN9O7JUnwbkclVUsFO7ZpUijE2Wm7oT2eVEDbL+pBAdyzIDVTgXIwokmh1hU1wC5F8RFfwYyv/caEgA9ej+iFDN0ACGBjJK61nnRCnsa6Lgd3c/XbuJH8XRPVRSkwnjDZgDcAUAvmgXcxeC6YoOMaGuE8AG6k6mV2eYFGqy/WiYcO4Ww0JKEtz0JxYcFwzLZMqo+kYq1ZtyVXeJFgrjpZs8jOi1lltqxn7BWvA/wLk0NhR7xP2C7qqjiRzQWD1DjmSLv6LHGll93DILD2wHEcvOCZWBK8bE4S97QyrvDar5ep7T1TDHp3qae5Ww4k6ppLSo5zIpI2ypRlNahq1Z5X7DdX6kVD/5NGTLTCM5w5b8rREhn3dv8b8WmQBFZo5IzgSYrTNV2UXF0OIHNMl+B3LhVQB9CdmV3SFTmVj1fVfWgIxIWD5wWKq2W3UQAAAAA",
  "2003/04": "data:image/webp;base64,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",
  "2010": "data:image/webp;base64,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",
  "2021": "data:image/webp;base64,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",
  "2007/06": "data:image/webp;base64,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",
  "2009": "data:image/webp;base64,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",
};

const ELENCOS_2025 = {
  "2016": [
    { numero: 99, apelido: "Vitor", nome: "Vitor Martins Luz Mariano", periodo: "2015-2016", anoConclusao: "2016" },
    { numero: 14, apelido: "César", nome: "Bruno César Macedo de Almeida", periodo: "2011-2015", anoConclusao: "2017" },
    { numero: 11, apelido: "Caio", nome: "Caio Petterson Araújo Pessoa Rangel", periodo: "2008-2010", anoConclusao: "2016" },
    { numero: 9, apelido: "Gordinho", nome: "Fellipe Matheus Acioli Nunes", periodo: "2015-2016", anoConclusao: "2016" },
    { numero: 7, apelido: "Clemente", nome: "Mateus Clemente Tenorio Padilha", periodo: "2004-2017", anoConclusao: "2017" },
    { numero: 10, apelido: "P.A", nome: "Paulo Augusto Nascimento de Alencar", periodo: "2010-2016", anoConclusao: "2016" },
    { numero: 1, apelido: "Ponnes", nome: "João Victor Vieira Melo", periodo: "2012-2016", anoConclusao: "2016" },
    { numero: 12, apelido: "Lucas Laykos", nome: "Lucas Rodrigues Pacífico Chagas", periodo: "2010-2016", anoConclusao: "2016" },
    { numero: 5, apelido: "Yurgan", nome: "Yurgan Montini Corneta Sarmento", periodo: "2005-2016", anoConclusao: "2016" },
    { numero: 4, apelido: "Dedé", nome: "Marcos André de Holanda Prudente Pessoa", periodo: "2007-2016", anoConclusao: "2016" },
    { numero: null, apelido: "Nego", nome: "Gabriel Leite Sarmento", periodo: "", anoConclusao: "2016" },
  ],
  "2022.1": [
    { numero: 1, apelido: "Pedro Miguel", nome: "Pedro Miguel Silva Couto", periodo: "2015-2022", anoConclusao: "2022" },
    { numero: 2, apelido: "Caik", nome: "Caik agra toledo", periodo: "2012-2022", anoConclusao: "2022" },
    { numero: 4, apelido: "Elias", nome: "Gabriel Elias calheiros", periodo: "2012-2022", anoConclusao: "2022" },
    { numero: 5, apelido: "Huguinho", nome: "Hugo Santos ferro Cavalcante", periodo: "2012-2022", anoConclusao: "2022" },
    { numero: 7, apelido: "Assis", nome: "Pedro Assis leite nobre", periodo: "2016-2022", anoConclusao: "2022" },
    { numero: 7, apelido: "Bel", nome: "BELTRANO ALVES GUSMÃO BARBOSA", periodo: "1995-2005", anoConclusao: "2005" },
    { numero: 8, apelido: "Marlon", nome: "Marlon vergetti Araújo", periodo: "2012-2022", anoConclusao: "2022" },
    { numero: 10, apelido: "Lucca", nome: "Luciano lucca farias", periodo: "2019-2022", anoConclusao: "2022" },
    { numero: 11, apelido: "Borela", nome: "Lucca borela toledo correia", periodo: "2012-2022", anoConclusao: "2022" },
    { numero: 14, apelido: "Teixeira", nome: "Pedro Teixeira dos Santos soares", periodo: "2016-2022", anoConclusao: "2022" },
    { numero: 25, apelido: "Eugênio", nome: "Luiz Eugênio Duarte Santos", periodo: "2018-2022", anoConclusao: "2022" },
    { numero: 77, apelido: "Bruno", nome: "Bruno Fernandes calheiros", periodo: "2018-2022", anoConclusao: "2022" },
  ],
  "2007/06": [
    { numero: 1, apelido: "Ze", nome: "JOSE LUCAS PACHECO RODRIGUES LIMA", periodo: "2006-2007", anoConclusao: "2007" },
    { numero: 2, apelido: "Baratinha", nome: "SIDNEY DUARTE ARRUDA PIMENTEL", periodo: "1995-2005", anoConclusao: "2007" },
    { numero: 3, apelido: "Caio", nome: "CAIO MAGALHÃES BATISTA", periodo: "1994-2004", anoConclusao: "2007" },
    { numero: 4, apelido: "Del", nome: "HILDEBRANDO T. DE A. NETO", periodo: "1997-2007", anoConclusao: "2007" },
    { numero: 6, apelido: "Rodolfo", nome: "RODOLFO SANTOS BEZERRA", periodo: "1994-2004", anoConclusao: "2006" },
    { numero: 7, apelido: "Engels", nome: "ENGELS BARROS DE CASTRO", periodo: "1997-1998", anoConclusao: "2006" },
    { numero: 8, apelido: "Gabriel (cachorrão)", nome: "GABRIEL DE FRANÇA RIBEIRO", periodo: "1996-2006", anoConclusao: "2006" },
    { numero: 9, apelido: "Luan", nome: "LUAN FARACO GUIMARÃES", periodo: "2005.0", anoConclusao: "2007" },
    { numero: 10, apelido: "Leite", nome: "BRUNO LEITE SETTON", periodo: "1997-2007", anoConclusao: "2007" },
    { numero: 11, apelido: "Breno", nome: "BRENO DA SILVEIRA PACHECO", periodo: "1997-2004", anoConclusao: "2007" },
    { numero: 14, apelido: "Pedro", nome: "PEDRO GUILHERME FERREIRA TENÓRIO", periodo: "2000-2001", anoConclusao: "2007" },
    { numero: 21, apelido: "Abilio", nome: "ABILIO JORGE TENORIO ANTUNES DE MELLO", periodo: "1997-2004", anoConclusao: "2007" },
    { numero: 69, apelido: "Dudu", nome: "EDUARDO SANTOS C DE ALBUQUERQUE", periodo: "2001-2004", anoConclusao: "2006" },
  ],
  "2009": [
    { numero: 1, apelido: "Vovô", nome: "Diego José Uchôa Quintela", periodo: "2000-2006", anoConclusao: "2009" },
    { numero: 5, apelido: "Libas", nome: "Elias Carlos de Oliveira Filho", periodo: "2000-2009", anoConclusao: "2009" },
    { numero: 7, apelido: "Bruninho", nome: "Bruno Ramires Baracho", periodo: "2003-2007", anoConclusao: "2009" },
    { numero: 8, apelido: "Maradona", nome: "Lucas Costa Russo", periodo: "2001-2006", anoConclusao: "2009" },
    { numero: 9, apelido: "Cabral", nome: "José Paulo Cabral da Silva Filho", periodo: "2003-2009", anoConclusao: "2009" },
    { numero: 11, apelido: "Dyler", nome: "Dylermando Sávio Aguiar Cunha", periodo: "2003-2007", anoConclusao: "2009" },
    { numero: 13, apelido: "Ronaldo", nome: "Ronaldo Victor Lemos Fontes Silva", periodo: "2005-2008", anoConclusao: "2009" },
    { numero: 14, apelido: "Jonny", nome: "João Victor de Mesquita Mendonça", periodo: "2003-2009", anoConclusao: "2009" },
    { numero: 23, apelido: "Davizinho", nome: "Davi Falcão Bastos Beleza", periodo: "2003-2009", anoConclusao: "2009" },
    { numero: 69, apelido: "Yaggo", nome: "Yaggo de Melo Freitas", periodo: "2003-2009", anoConclusao: "2009" },
  ],
  "2020": [
    { numero: 4, apelido: "Bernardo", nome: "Bernardo Torres de Souza", periodo: "2010-2020", anoConclusao: "2020" },
    { numero: 5, apelido: "Teixeira", nome: "Matheus Monteiro Pires Teixeira", periodo: "2019-2020", anoConclusao: "2020" },
    { numero: 8, apelido: "Rodrigo", nome: "RODRIGO COELHO BRINGEL B. DE BRITO", periodo: "2011-2020", anoConclusao: "2020" },
    { numero: 9, apelido: "Luan", nome: "LUAN HENRIQUE OLIVEIRA DO NASCIMENTO LOPES NETTER", periodo: "2016-2020", anoConclusao: "2020" },
    { numero: 10, apelido: "Aragão", nome: "GABRIEL VERÇOSA ARAGÃO", periodo: "2014-2018", anoConclusao: "2020" },
    { numero: 11, apelido: "Dudu", nome: "EDUARDO LARANJEIRA LEAHY", periodo: "2014-2020", anoConclusao: "2020" },
    { numero: 17, apelido: "Arthur", nome: "ARTHUR COELHO BRINGEL BEZERRA DE BRITO", periodo: "2011-2024", anoConclusao: "2024" },
    { numero: 21, apelido: "Kevin", nome: "KEVIN MEDEIROS DE SOUZA", periodo: "2014-2017", anoConclusao: "2020" },
    { numero: 38, apelido: "José", nome: "José Victor Gadelha Xavier Martins", periodo: "2006-2020", anoConclusao: "2020" },
  ],
  "2010": [
    { numero: 7, apelido: "Bel", nome: "BELTRANO ALVES GUSMÃO BARBOSA", periodo: "1995-2005", anoConclusao: "2005" },
    { numero: null, apelido: "Houly", nome: "Rodrigo Houly de Carvalho", periodo: "1999 a 2009", anoConclusao: "2011 (não tem time)" },
    { numero: null, apelido: "Fernando", nome: "Fernando da Aldeia Brêda", periodo: "2000 a 2003 e 2007 a 2009", anoConclusao: "2010" },
    { numero: null, apelido: "Mago", nome: "João Pedro Guedes Araújo", periodo: "1997 a 2010", anoConclusao: "2010" },
    { numero: null, apelido: "Arthur", nome: "Arthur Magalhães de Lima Pereira", periodo: "2004 a 2010", anoConclusao: "2010" },
    { numero: null, apelido: "Feiden", nome: "Henry José Feiden Júnior", periodo: "2004 a 2010", anoConclusao: "2010" },
    { numero: null, apelido: "Lukete", nome: "Lucas de Vasconcelos Carvalho", periodo: "2008 a 2010", anoConclusao: "2010" },
    { numero: null, apelido: "Leo", nome: "Leonardo Tenório Monteiro", periodo: "2004 a 2010", anoConclusao: "2010" },
    { numero: null, apelido: "Lula", nome: "Luiz André Muniz Oliveira", periodo: "2003 a 2006", anoConclusao: "2010" },
    { numero: null, apelido: "Waldir", nome: "Waldir Normande Guido", periodo: "2001 a 2010", anoConclusao: "2010" },
    { numero: null, apelido: "Paulinho", nome: "Paulo Ernesto Firmiano e Silva", periodo: "2003 e 2005 a 2006", anoConclusao: "2010" },
    { numero: null, apelido: "Fraga", nome: "Paulo Fernando Fraga de Castro Filho", periodo: "1999-2009", anoConclusao: "2010" },
  ],
  "2014": [
    { numero: 1, apelido: "Bicuddo", nome: "LUCAS ALVES VIEIRA DE SOUZA", periodo: "2004 - 2014", anoConclusao: "2014" },
    { numero: 4, apelido: "Negão", nome: "MATEUS HENRIQUE DO NASCIMENTO ROCHA", periodo: "2008 - 2014", anoConclusao: "2014" },
    { numero: 6, apelido: "Brunno", nome: "BRUNNO CORADIN ZIERO", periodo: "2008 - 2014", anoConclusao: "2014" },
    { numero: 7, apelido: "Davi", nome: "DAVI FERNANDES BRANDÃO DE ALMEIDA", periodo: "2004 - 2014", anoConclusao: "2014" },
    { numero: 7, apelido: "Bel", nome: "BELTRANO ALVES GUSMÃO BARBOSA", periodo: "1995-2005", anoConclusao: "2005" },
    { numero: 8, apelido: "Joca", nome: "JOÃO AUGUSTO DE CASTRO SILVA FILHO", periodo: "2007 - 2011", anoConclusao: "2014" },
    { numero: 9, apelido: "Cuiabá", nome: "VINICIUS MORAES CARDOSO", periodo: "2013 - 2014", anoConclusao: "2014" },
    { numero: 10, apelido: "Iury", nome: "IURY SIMÕES DE FRANÇA ALMEIDA", periodo: "2008 - 2014", anoConclusao: "2014" },
    { numero: 11, apelido: "Lebrão", nome: "RAPHAEL PEREIRA LEBRE", periodo: "2013 - 2014", anoConclusao: "2014" },
    { numero: 12, apelido: "Lira", nome: "ARTHUR DE SOUSA LIRA", periodo: "2013 - 2014", anoConclusao: "2014" },
    { numero: 97, apelido: "Léo", nome: "LEONARDO RAMOS PIMENTEL SANTANA", periodo: "2008 - 2012", anoConclusao: "2014" },
  ],
  "2013": [
    { numero: 1, apelido: "Douglas", nome: "Douglas de Carvalho Matos Barros", periodo: "2006 - 2009", anoConclusao: "2013" },
    { numero: 4, apelido: "Lukinhas", nome: "Lucas Martins da Costa Pereira", periodo: "2006 a 2010", anoConclusao: "2013" },
    { numero: 5, apelido: "João Bigode", nome: "João Carlos de Lima Sousa", periodo: "2006 a 2009", anoConclusao: "2013" },
    { numero: 7, apelido: "Italo", nome: "Italo Matheus vieira cabral", periodo: "2008 - 2013", anoConclusao: "2013" },
    { numero: 8, apelido: "Ph", nome: "Pedro Henrique Vieira Rosa de Omena", periodo: "2007 - 2013", anoConclusao: "2013" },
    { numero: 10, apelido: "Gustavo", nome: "Carlos Gustavo Ferreira Lima", periodo: "2007 - 2013", anoConclusao: "2013" },
    { numero: 11, apelido: "Matteus", nome: "Matteus Lucas de Andrade Xavier", periodo: "2006 a 2010", anoConclusao: "2013" },
    { numero: 12, apelido: "Victor Jatoba", nome: "Victor César Lucena jatobá", periodo: "2006 a 2010", anoConclusao: "2013" },
    { numero: 13, apelido: "Vitao", nome: "Victor Barbosa Martiniano Lins", periodo: "2007-2013", anoConclusao: "2013" },
    { numero: 22, apelido: "Theo", nome: "Théo Costa Fortes SilveiraCavalcanti", periodo: "2007 - 2009", anoConclusao: "2013" },
    { numero: 23, apelido: "Galo", nome: "João Victor Magalhães Nunes Santos", periodo: "2007 a 2012", anoConclusao: "2013" },
    { numero: 28, apelido: "Dede", nome: "André Vaz Ferreira acioli", periodo: "2007 - 2013", anoConclusao: "2013" },
  ],
  "2001/02": [
    { numero: 1, apelido: "Paredão", nome: "Gabriel José Pereira Costa", periodo: "98/99/2000/2001", anoConclusao: "2001" },
    { numero: 2, apelido: "Mamãe", nome: "Cesário Da Silva Souza", periodo: "90 A 2001", anoConclusao: "2001" },
    { numero: 3, apelido: "Balão", nome: "Emerson Melo Mota Ataíde", periodo: "97 a 2002", anoConclusao: "2002" },
    { numero: 4, apelido: "Paulista", nome: "Luiz Paulo Taboada", periodo: "98/99/2000", anoConclusao: "2001" },
    { numero: 5, apelido: "Ricardinho", nome: "Ricardo Soares Cota", periodo: "2000/2001", anoConclusao: "2002" },
    { numero: 6, apelido: "Mano", nome: "Leonardo Edmundo Costa Esequiel", periodo: "98/99/2000/2001", anoConclusao: "2001" },
    { numero: 7, apelido: "Diogo", nome: "Diogo Phillip Silva Gueiros", periodo: "87 A 99", anoConclusao: "2002" },
    { numero: 8, apelido: "Gago", nome: "Lucas Pontes Duarte", periodo: "90 A 2001", anoConclusao: "2001" },
    { numero: 9, apelido: "Pauli Nho", nome: "Paulo Henrique de Oliveira Frimino", periodo: "98/99", anoConclusao: "2002" },
    { numero: 10, apelido: "Bokal", nome: "Rafael Vilela Toledo", periodo: "87 A 99", anoConclusao: "2001" },
    { numero: 11, apelido: "Bial", nome: "Pedro Thiago dos Santos Agra", periodo: "98/99/2000/2001", anoConclusao: "2001" },
    { numero: 12, apelido: "Bel", nome: "Bernard Bomfim Correia", periodo: "97 a 2002", anoConclusao: "2002" },
    { numero: 20, apelido: "Da Us Toque", nome: "Hugo Lyra Soriano", periodo: "95 A 2002", anoConclusao: "2002" },
    { numero: 50, apelido: "Castanha", nome: "Ycaro Farias Valença", periodo: "94 A 2002", anoConclusao: "2002" },
  ],
  "2022.2": [
    { numero: 4, apelido: "Besouro", nome: "Sérgio Rodrigues da Rocha neto", periodo: "2016-2022", anoConclusao: "2022" },
    { numero: 6, apelido: "Uchôa", nome: "Rodrigo Nolasco Candido Uchoa", periodo: "2018 - 2022", anoConclusao: "2022" },
    { numero: 7, apelido: "Bel", nome: "BELTRANO ALVES GUSMÃO BARBOSA", periodo: "1995-2005", anoConclusao: "2005" },
    { numero: 8, apelido: "Nougaro", nome: "Gabriel Bittencourt Nougaro", periodo: "2016-2021", anoConclusao: "2022" },
    { numero: 9, apelido: "Danielzinho", nome: "Daniel Lucena Dos Anjos", periodo: "2020-2022", anoConclusao: "2022" },
    { numero: 10, apelido: "Griz", nome: "Vinicius Almeida Griz", periodo: "2016-2022", anoConclusao: "2022" },
    { numero: 11, apelido: "Heitor", nome: "Heitor Cesar Neves Sampaio", periodo: "2014-2018", anoConclusao: "2022" },
    { numero: 14, apelido: "Ildo", nome: "Ildo Raphael Caldeira Vasconcelos", periodo: "2012-2022", anoConclusao: "2022" },
    { numero: 19, apelido: "Juninho", nome: "Paulo Daniel Juazeiro arruda de Carvalho Júnior", periodo: "2016-18/ 2020", anoConclusao: "2022" },
    { numero: 24, apelido: "Da Mota", nome: "Mateus da Mota Lins Queiroga", periodo: "2019-2022", anoConclusao: "2022" },
  ],
  "2015": [
    { numero: 1, apelido: "Daniel", nome: "Daniel Monteiro de Carvalho Filho", periodo: "2009-2015", anoConclusao: "2015" },
    { numero: 3, apelido: "Boi", nome: "Bruno Lins Soares Palmeira", periodo: "2009 - 2015", anoConclusao: "2015" },
    { numero: 4, apelido: "Renan", nome: "Renan Kayan Couto Silva", periodo: "2005 - 2013", anoConclusao: "2015" },
    { numero: 7, apelido: "Rogerinho", nome: "Lucas Rogério Sampaio Lima", periodo: "2009-2015", anoConclusao: "2015" },
    { numero: 7, apelido: "Bel", nome: "BELTRANO ALVES GUSMÃO BARBOSA", periodo: "1995-2005", anoConclusao: "2005" },
    { numero: 9, apelido: "Sego", nome: "Diogo Pitombeira Braga", periodo: "2011-2015", anoConclusao: "2015" },
    { numero: 10, apelido: "Schausse", nome: "Gustavo Schausse Salgado", periodo: "2005 a 2015", anoConclusao: "2015" },
    { numero: 11, apelido: "Marquinhos", nome: "Marcos Antônio Hermes Leandro Junior", periodo: "2005 a 2012", anoConclusao: "2015" },
    { numero: 13, apelido: "Mineiro", nome: "Lucas Mendes Rosa Peres", periodo: "2012 a 2015", anoConclusao: "2015" },
  ],
  "2003/04": [
    { numero: 5, apelido: "Cadu", nome: "Carlos Eduardo Neto Muniz Farias", periodo: "2000 – 2003", anoConclusao: "2003" },
    { numero: 7, apelido: "Dennis", nome: "Danny Charles Oliveira de Almeida Ventura", periodo: "1997 – 2001", anoConclusao: "2003" },
    { numero: 10, apelido: "Thales", nome: "Thales Anderson Bastos Soares", periodo: "2001 – 2003", anoConclusao: "2003" },
    { numero: 12, apelido: "Gabriel", nome: "Gabriel Toledo Torres", periodo: "1988 - 2003", anoConclusao: "2003" },
    { numero: 18, apelido: "D2", nome: "Diego Marcel Cavalcante de Vasconcelos", periodo: "1995 – 2000", anoConclusao: "2003" },
    { numero: 51, apelido: "Brulu", nome: "Bruno Lucio de Oliveira", periodo: "2003 – 2004", anoConclusao: "2004" },
    { numero: 69, apelido: "Sukebe", nome: "Fernando Nebson Falcão Tavares Junior", periodo: "2004.0", anoConclusao: "2004" },
    { numero: 420, apelido: "Tulio", nome: "Tulio José Bastos Soares", periodo: "2001 – 2003", anoConclusao: "2003" },
    { numero: null, apelido: null, nome: "Henrique Emanoel Rocha Santos", periodo: "2002 - 2004", anoConclusao: "2004" },
    { numero: null, apelido: null, nome: "Leopoldo Marcílio Gonçalves Souza", periodo: "1992 - 2001", anoConclusao: "2003" },
    { numero: null, apelido: null, nome: "Henrique Barreto Monteiro", periodo: "1992-2001", anoConclusao: "2003" },
  ],
  "2019": [
    { numero: 2, apelido: "Raimundinho", nome: "RAIMUNDO LUKAS NOGUEIRA MELLO ALEXANDRE", periodo: "2013-2019", anoConclusao: "2019" },
    { numero: 5, apelido: "Be", nome: "Bernardo Tenório Valente", periodo: "2004-2019", anoConclusao: "2019" },
    { numero: 7, apelido: "Bale", nome: "JOÃO PHILLIP LIMA LINS", periodo: "2016-2019", anoConclusao: "2019" },
    { numero: 7, apelido: "Bel", nome: "BELTRANO ALVES GUSMÃO BARBOSA", periodo: "1995-2005", anoConclusao: "2005" },
    { numero: 8, apelido: "Choquito", nome: "Christian Guedes Souto do Nascimento", periodo: "2014-2018", anoConclusao: "2019" },
    { numero: 10, apelido: "Gui Casado", nome: "Guilherme Do Amaral A Casado", periodo: "2013-2017", anoConclusao: "2019" },
    { numero: 11, apelido: "Lucganso", nome: "LUCCA BEZERRA MOURA TORRES", periodo: "2013-2019", anoConclusao: "2019" },
    { numero: 77, apelido: "Fumacinha", nome: "ARTUR LUCAS SOUSA GUEDES", periodo: "2013-2019", anoConclusao: "2019" },
    { numero: 87, apelido: "Chumbo-", nome: "DIEGO ESTEVÃO DA COSTA", periodo: "2011-2019", anoConclusao: "2019" },
  ],
  "2021": [
    { numero: 1, apelido: "Pipi", nome: "felipe oliveira soares de lima", periodo: "2015 a 2017", anoConclusao: "2021" },
    { numero: 5, apelido: "Leão", nome: "Pedro Vitor Rolemberg leão", periodo: "2015 a 2018", anoConclusao: "2021" },
    { numero: 7, apelido: "Bel", nome: "BELTRANO ALVES GUSMÃO BARBOSA", periodo: "1995-2005", anoConclusao: "2005" },
    { numero: 8, apelido: "Bassoa", nome: "juan henrique almeida bassoa", periodo: "2015 a 2018", anoConclusao: "2021" },
    { numero: 9, apelido: "Coxinha", nome: "caio tenorio bentes", periodo: "2014 a 2017", anoConclusao: "2020" },
    { numero: 19, apelido: "Gerônimo", nome: "marcos geronimo barbosa", periodo: "2010 a 2015", anoConclusao: "2020" },
    { numero: 22, apelido: "Marcellus", nome: "pedro marcellus portella", periodo: "Maternal, 2015-2017", anoConclusao: "2022" },
    { numero: 99, apelido: "Serginho", nome: "Sergio ricardo maciel filho", periodo: "2011 a 2014", anoConclusao: "2021" },
  ],
  "2018": [
    { numero: 1, apelido: "Pão", nome: "João Victor Vieira Melo", periodo: "2004-2016", anoConclusao: "2016" },
    { numero: 5, apelido: "Valtinho", nome: "Valter Souza Cassella", periodo: "2006-2018", anoConclusao: "2018" },
    { numero: 6, apelido: "Villar", nome: "Cleydson Villar Barbosa", periodo: "2006-2018", anoConclusao: "2018" },
    { numero: 9, apelido: "Maia", nome: "Pedro Henrique dos Santos Maia", periodo: "2017-2018", anoConclusao: "2018" },
    { numero: 10, apelido: "Bernardo", nome: "Bernardo Terto de lima", periodo: "2006-2018", anoConclusao: "2018" },
    { numero: 11, apelido: "Fernando", nome: "Fernando Lessa Pereira de Melo", periodo: "2006-2018", anoConclusao: "2018" },
    { numero: 12, apelido: "Gustavo", nome: "Gustavo P. de Miranda O. filho", periodo: "2006-2018", anoConclusao: "2018" },
    { numero: 17, apelido: "Victor", nome: "João Victor Porciuncula", periodo: "2006-2018", anoConclusao: "2018" },
  ],
  "2012": [
    { numero: 1, apelido: "Thiago", nome: "Thiago Lins Ramires", periodo: "2006-2012", anoConclusao: "2012" },
    { numero: 5, apelido: "Netinho", nome: "Jose Agnaldo de Souza Araujo Neto", periodo: "2005-2012", anoConclusao: "2012" },
    { numero: 6, apelido: "Henrique", nome: "Henrique Vaz Ferreira Acioli", periodo: "2005-2011", anoConclusao: "2011" },
    { numero: 7, apelido: "Fumaça", nome: "Vinicius Nunes Felino", periodo: "2011-2012", anoConclusao: "2012" },
    { numero: 8, apelido: "Murilo", nome: "Murilo Correia Tenorio de Albuquerque", periodo: "2004-2007", anoConclusao: "2012" },
    { numero: 9, apelido: "Iago", nome: "Iago Gomes Vacchiano", periodo: "2006-2009", anoConclusao: "2012" },
    { numero: 10, apelido: "Ib", nome: "Ib da Aldeia Breda", periodo: "2006-2010", anoConclusao: "2012" },
    { numero: 11, apelido: "Chico", nome: "Francisco Hélio Cavalcante Jatobá Neto", periodo: "2006-2010", anoConclusao: "2011" },
    { numero: 58, apelido: "Neto", nome: "José Jairo Melo neto", periodo: "1996-2006", anoConclusao: "2012" },
    { numero: 69, apelido: "Lelaeta", nome: "Rodrigo Vilela Cortes", periodo: "2005-2008", anoConclusao: "2012" },
    { numero: 94, apelido: "Fabinho", nome: "Fabio Manoel Fragoso Bittencourt Araujo", periodo: "2005-2010", anoConclusao: "2011" },
    { numero: 99, apelido: "Emano", nome: "Emmanoel Victor Esteves da Rocha", periodo: "2006-2010", anoConclusao: "2012" },
    { numero: 157, apelido: "Sipa", nome: "João Carlos Nunes", periodo: "2000-2007", anoConclusao: "2012" },
  ],
};

// Recordes das edições anteriores.
const HALL_DA_FAMA = {
  campeoes: [
    { edicao: "1ª edição (2017)", turma: "2014" },
    { edicao: "2018", turma: "2010" },
    { edicao: "2019", turma: "2009" },
    { edicao: "2022", turma: "2022.1" },
    { edicao: "2023", turma: "2009" },
    { edicao: "2024", turma: "2022.1" },
    { edicao: "2025 (mais recente)", turma: "2010" },
  ],
  melhorJogador: [
    { ano: 2017, nome: "Bruninho", turma: "2009" },
    { ano: 2018, nome: "João Augusto (Joca)", turma: "2014" },
    { ano: 2019, nome: "Maradona", turma: "2009" },
    { ano: 2022, nome: "Lukete", turma: "2010" },
    { ano: 2023, nome: "Bruninho", turma: "2009" },
    { ano: 2024, nome: "Gabriel Elias", turma: "2022.1" },
    { ano: 2025, nome: "Lukete", turma: "2010" },
  ],
  artilheiro: [
    { ano: 2017, nome: "Dennys", turma: "2003/04" },
    { ano: 2018, nome: "Dennys", turma: "2003/04" },
    { ano: 2019, nome: "Renan", turma: "2015" },
    { ano: 2022, nome: "Maradona", turma: "2009" },
    { ano: 2023, nome: "Maradona", turma: "2009" },
    { ano: 2024, nome: "Luan", turma: "2020" },
  ],
  melhorGoleiro: [
    { ano: 2017, nome: "Zé", turma: "2007/06" },
    { ano: 2018, nome: "Arthur", turma: "2010" },
    { ano: 2019, nome: "Vovô", turma: "2009" },
    { ano: 2022, nome: "Uchôa", turma: "2022.1" },
    { ano: 2023, nome: "Gabriel Costa", turma: "2001/02" },
    { ano: 2024, nome: "Arthur", turma: "2010" },
    { ano: 2025, nome: "Bicudo", turma: "2014" },
  ],
  golMaisBonito: [
    { ano: 2002, nome: "Bel", turma: "2001/02" },
    { ano: 2018, nome: "Thales", turma: "2003/04" },
    { ano: 2019, nome: "Victor Pugliese", turma: "2007/06" },
    { ano: 2022, nome: "Murilo", turma: "2013" },
  ],
};

// Data e prazo desta edição — atualizar quando a organização confirmar.
const DATA_EVENTO = "6, 7 e 8 de novembro";
const PRAZO_INSCRICAO = "aberta agora até 30 de setembro";
const VALOR_INSCRICAO_ATLETA = "R$ 110,00 a R$ 130,00 por atleta, conforme o lote";
// Lotes de inscrição — o valor por atleta aumenta conforme a data em que
// o time se inscreve (Art. 8º, Parágrafo 1º do regulamento).
const LOTES_INSCRICAO = [
  { nome: "Lote 1", inicio: new Date(2026, 8, 1, 0, 0, 0), fim: new Date(2026, 8, 10, 23, 59, 59), valor: 110 },
  { nome: "Lote 2", inicio: new Date(2026, 8, 11, 0, 0, 0), fim: new Date(2026, 8, 20, 23, 59, 59), valor: 120 },
  { nome: "Lote 3", inicio: new Date(2026, 8, 21, 0, 0, 0), fim: new Date(2026, 8, 30, 23, 59, 59), valor: 130 },
];
// Acha o lote certo pra uma data — se for antes do Lote 1 começar (ex:
// inscrição de teste feita antes de 1º/09), cai no Lote 1; se for depois
// do Lote 3 terminar, cai no Lote 3. Só usa o lote errado se a data
// realmente cair fora de qualquer janela por engano.
function encontrarLote(data) {
  const d = data ? new Date(data) : new Date();
  const lote = LOTES_INSCRICAO.find((l) => d >= l.inicio && d <= l.fim);
  if (lote) return lote;
  if (d < LOTES_INSCRICAO[0].inicio) return LOTES_INSCRICAO[0];
  return LOTES_INSCRICAO[LOTES_INSCRICAO.length - 1];
}
function valorPorAtletaNaData(data) {
  return encontrarLote(data).valor;
}
function loteNaData(data) {
  return encontrarLote(data).nome;
}
function formatarReais(n) {
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
const LOCAL_NOME = "Ginásio Poliesportivo do Colégio Santa Úrsula";
const LOCAL_MAPS_LINK = "https://www.google.com/maps/place/Gin%C3%A1sio+Col%C3%A9gio+Santa+Ursula/@-9.6519727,-35.7061545,17z/data=!4m7!3m6!1s0x70145b3c77ca373:0xe3558847d1b3d687!8m2!3d-9.6519727!4d-35.7013909!15sCjVDb2zDqWdpbyBTYW50YSDDmnJzdWxhIEdpbsOhc2lvIFBvbGllc3BvcnRpdm8gTWFjZWnDs5IBGGdlbmVyYWxfZWR1Y2F0aW9uX3NjaG9vbOABAA!16s%2Fg%2F11btwrds9d?entry=tts";
const WHATSAPP_ORGANIZACAO = "5582996210019";
const WHATSAPP_MSG_REPRESENTANTE = "Sou o representante do meu time e quero fazer a inscrição.";
const WHATSAPP_LINK_REPRESENTANTE =
  `https://wa.me/${WHATSAPP_ORGANIZACAO}?text=` + encodeURIComponent(WHATSAPP_MSG_REPRESENTANTE);

// Monta um link wa.me a partir de um número digitado de qualquer jeito
// (com espaço, parênteses, traço...) — assume Brasil (55) se não vier
// com código de país.
function linkWhatsapp(numero) {
  if (!numero) return null;
  let digitos = String(numero).replace(/\D/g, "");
  if (!digitos) return null;
  if (!digitos.startsWith("55")) digitos = "55" + digitos;
  return `https://wa.me/${digitos}`;
}

// Regras de horário dos jogos — 2 tempos de 10min (20min de jogo) + 5min
// de intervalo entre um confronto e outro = 25min entre um início e outro.
const DURACAO_SLOT_MIN = 25;
const INICIO_SEXTA = new Date(2026, 10, 6, 19, 0, 0); // sexta 6/nov às 19h
const JOGOS_SEXTA = 8;
const INICIO_SABADO = new Date(2026, 10, 7, 8, 0, 0); // sábado 7/nov às 8h
const INICIO_DOMINGO = new Date(2026, 10, 8, 8, 0, 0); // domingo 8/nov às 8h
// Datas de verdade — usadas pra travar a aba de Inscrição fora do período.
const INSCRICAO_INICIO = new Date(2026, 0, 1, 0, 0, 0); // liberada desde já
const INSCRICAO_FIM = new Date(2026, 8, 30, 23, 59, 59); // 30 de setembro (último dia do mês)
function inscricaoAberta() {
  const agora = new Date();
  return agora >= INSCRICAO_INICIO && agora <= INSCRICAO_FIM;
}

// Times mais bem colocados da última edição (7ª, VII Copa) — usados pra
// montar o Pote 1 do sorteio, conforme Art. 13 do regulamento.
// Classificação final da última edição (1º ao 15º), do jeito que a
// organização confirmou — usada pra montar os 5 potes do sorteio (Art. 13).
const RANKING_ULTIMA_EDICAO = [
  "2010", "2014", "2022.1", "2009", // pote 1 — 1º a 4º
  "2015", "2021", "2007/06", "2022.2", // pote 2 — 5º a 8º
  "2019", "2003/04", "2020", "2001/02", // pote 3 — 9º a 12º
  "2012", "2018", "2013", // pote 4 — 13º a 15º
];

// Regras de inscrição vindas do regulamento oficial (Capítulo III), usadas
// pelo diagnosticador de irregularidades.
const MIN_JOGADORES_TIME = 6;
const MAX_JOGADORES_TIME = 15;

// Extrai o(s) ano(s) numéricos de uma turma/nome de time — ex: "2007/06"
// -> [2007, 2006], "2022.1" -> [2022], "2010" -> [2010].
function anosDaTurma(turma) {
  if (!turma) return [];
  const nums = String(turma).match(/\d{4}|\d{2}(?!\d)/g) || [];
  return nums.map((n) => (n.length === 2 ? Number("20" + n) : Number(n))).filter((n) => n > 1990 && n < 2030);
}

// Mesma lista de turmas, só que em ordem crescente de ano — usada em
// todo lugar que lista turmas pra escolher (cadastro, inscrição, etc.).
const TURMAS_HISTORICAS_ORDENADAS = [...TURMAS_HISTORICAS].sort((a, b) => {
  const anoA = Math.min(...anosDaTurma(a.turma));
  const anoB = Math.min(...anosDaTurma(b.turma));
  return anoA - anoB;
});

// Confere se o ano de conclusão do jogador é compatível com a turma do
// time — Art. 9º do regulamento (não pode misturar anos de conclusão
// diferentes na mesma equipe, salvo exceção aprovada pela organização).
function anoConclusaoRegular(anoConclusao, turmaTime) {
  if (!anoConclusao || !turmaTime) return null; // sem dado suficiente pra checar
  const anoJogador = parseInt(String(anoConclusao).match(/\d{4}/)?.[0] || "", 10);
  if (!anoJogador) return null;
  const anosTime = anosDaTurma(turmaTime);
  if (anosTime.length === 0) return null;
  return anosTime.includes(anoJogador);
}

// Edições disponíveis para marcar uma foto/vídeo — a atual mais as
// edições anteriores já registradas no Hall da Fama.
const EDICOES_DISPONIVEIS = [
  `${EDITION_ROMAN} — atual (8ª edição)`,
  ...HALL_DA_FAMA.campeoes.map((c) => c.edicao).reverse(),
];

// Comprime uma foto tirada pela câmera antes de guardar (o armazenamento
// só aceita texto, então a imagem vai como base64 — precisa ser pequena).
function compressImageFile(file, maxSize = 1080, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Falha ao carregar imagem"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Mesma compressão, mas devolve um Blob de verdade em vez de base64 — pra
// subir pro Supabase Storage (fotos/vídeos da Comunidade), em vez de
// guardar a imagem inteira como texto dentro do banco.
function compressImageToBlob(file, maxSize = 1280, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Falha ao carregar imagem"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar imagem"))), "image/jpeg", quality);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Duas funções isoladas pra ler/escrever no armazenamento — trocadas
// pelas equivalentes do Supabase (readKey/writeKey) na hora de publicar
// o site de verdade. Manter isso separado evita duplicar a lógica de
// conversão em vários lugares do hook abaixo.
async function storageGet(key) {
  return await readKey(key);
}
async function storageSet(key, value) {
  await writeKey(key, value);
}

function useSharedStorage(key, initialValue, pollMs) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  const fetchNow = useCallback(async () => {
    try {
      const v = await storageGet(key);
      if (v != null) setValue(v);
    } catch (e) {
      // chave ainda não existe — mantém valor atual
    }
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchNow();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [key, fetchNow]);

  // Poll para simular atualização "em tempo real": não existe push de
  // verdade nesse armazenamento, então buscamos de novo a cada poucos
  // segundos e assim pegamos o que outras pessoas publicaram.
  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(fetchNow, pollMs);
    return () => clearInterval(id);
  }, [pollMs, fetchNow]);

  // Aceita um valor direto OU uma função (igual o setState do React). Com
  // função, busca o valor mais atual do banco ANTES de aplicar a mudança
  // — evita que uma tela desatualizada salve por cima e apague o que
  // outra pessoa acabou de gravar (ex: dois representantes salvando o
  // time deles quase ao mesmo tempo).
  const persist = useCallback(
    async (novoValorOuFuncao) => {
      if (typeof novoValorOuFuncao === "function") {
        let base = value;
        try {
          const v = await storageGet(key);
          if (v != null) base = v;
        } catch (e) {
          // chave ainda não existe — usa o que já tinha na tela mesmo
        }
        const novoValor = novoValorOuFuncao(base);
        setValue(novoValor);
        try {
          await storageSet(key, novoValor);
        } catch (e) {
          console.error("Falha ao salvar", key, e);
        }
        return novoValor;
      }
      setValue(novoValorOuFuncao);
      try {
        await storageSet(key, novoValorOuFuncao);
      } catch (e) {
        console.error("Falha ao salvar", key, e);
      }
      return novoValorOuFuncao;
    },
    [key, value]
  );

  return [value, persist, loading];
}

function PasswordInput({ value, onChange, placeholder, style, className }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="relative">
      <input
        type={visivel ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className || "w-full px-4 py-2.5 pr-11 rounded-xl outline-none text-sm"}
        style={{ ...style, paddingRight: "2.75rem" }}
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        tabIndex={-1}
      >
        {visivel ? <EyeOff size={16} color={COLORS.slate} /> : <Eye size={16} color={COLORS.slate} />}
      </button>
    </div>
  );
}

function SectionLabel({ eyebrow, title }) {
  return (
    <div className="mb-7">
      <div
        className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-1.5"
        style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
      >
        {eyebrow}
      </div>
      <h2
        className="text-2xl sm:text-3xl font-bold"
        style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink, letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ backgroundColor: COLORS.card, border: `1px dashed ${COLORS.border}` }}
    >
      <p style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: Início
// ---------------------------------------------------------------------------
function Home({ teams, matches, setTab, config, totalPessoas }) {
  const menuItems = [
    { id: "inscricao", label: "Inscrição", desc: "Inscreva seu time para a 8ª edição", icon: Users },
    { id: "sorteio", label: "Sorteio", desc: "Potes e grupos da edição", icon: Dices },
    { id: "chaveamento", label: "Jogos ao Vivo", desc: "Todos os confrontos, horários e placares em tempo real", icon: Swords },
    { id: "classificacao", label: "Classificação", desc: "Tabela, resultados e saldo de gols", icon: ListOrdered },
    { id: "comunidade", label: "Fotos e Vídeos", desc: "Compartilhado por quem se inscreveu", icon: Camera },
    { id: "galeria", label: "Galeria", desc: "Hall da fama e histórico das edições", icon: Award },
    { id: "organizacao", label: "Organização", desc: "Lançar jogos, placares e fotos", icon: ShieldCheck },
  ];

  const stats = [
    { label: "Pessoas inscritas no app", value: totalPessoas },
    { label: "Times inscritos", value: teams.length },
    { label: "Jogos registrados", value: matches.length },
    { label: "Edições disputadas", value: EDITION - 1 },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <img
          src={CSU_BADGE_IMG}
          alt="Santa Úrsula Jogos Ex-Alunos"
          className="w-16 h-16 object-contain shrink-0"
        />
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink, letterSpacing: "-0.01em" }}
          >
            Copa de Ex-Alunos de Futsal
          </h1>
          <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Colégio Santa Úrsula · 8ª edição
          </p>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed mb-4 max-w-xl"
        style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
      >
        Oito edições de reencontro entre quem passou pelo Santa Úrsula. Inscreva o seu
        time, acompanhe o chaveamento e siga a classificação em tempo real.
      </p>

      <div
        className="flex flex-wrap gap-x-6 gap-y-1 mb-6 rounded-xl px-4 py-3"
        style={{ backgroundColor: COLORS.accentSoft }}
      >
        <div className="text-sm" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          <strong>Inscrições:</strong> {PRAZO_INSCRICAO}
        </div>
        <div className="text-sm" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          <strong>Competição:</strong> {DATA_EVENTO}
        </div>
        <div className="text-sm" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          <strong>Valor:</strong> {VALOR_INSCRICAO_ATLETA}
        </div>
      </div>

      <a
        href="regulamento.pdf"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs mb-6"
        style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
      >
        <Download size={13} /> Baixar regulamento oficial (PDF)
      </a>

      {config && config.linkTransmissao && (
        <a
          href={config.linkTransmissao}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 mb-3 rounded-xl px-4 py-3.5"
          style={{ backgroundColor: COLORS.navy }}
        >
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Radio size={18} color={COLORS.gold} />
          </span>
          <span className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}>
              Assista aos jogos ao vivo
            </div>
            <div className="text-xs truncate" style={{ color: COLORS.ice, fontFamily: "'Inter', sans-serif" }}>
              {config.linkTransmissao}
            </div>
          </span>
          <ArrowRight size={16} color={COLORS.gold} className="shrink-0" />
        </a>
      )}

      <a
        href={LOCAL_MAPS_LINK}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 mb-6 rounded-xl px-4 py-3.5"
        style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
      >
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: COLORS.accentSoft }}
        >
          <MapPin size={18} color={COLORS.accent} />
        </span>
        <span className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
            {LOCAL_NOME}
          </div>
          <div className="text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Toque para abrir no mapa
          </div>
        </span>
        <ArrowRight size={16} color={COLORS.accent} className="shrink-0" />
      </a>

      <div className="flex flex-wrap gap-x-6 gap-y-1 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <span
              className="text-base font-bold"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.ink }}
            >
              {s.value}
            </span>
            <span className="text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {menuItems.map(({ id, label, desc, icon: Icon }) => {
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="group flex items-center gap-4 text-left rounded-2xl p-4 sm:p-5 transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: COLORS.accentSoft }}
              >
                <Icon size={20} color={COLORS.accent} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px]" style={{ color: COLORS.ink, fontFamily: "'Sora', sans-serif" }}>
                  {label}
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                  {desc}
                </div>
              </div>
              <ArrowRight
                size={16}
                color={COLORS.slate}
                className="shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: Inscrição
// ---------------------------------------------------------------------------
// Monta a lista inicial de jogadores a partir dos dados que já temos —
// elenco detalhado (número/apelido/posição) quando existir, senão só os
// nomes da lista de inscrição de 2025.
function jogadoresDaTurma(turma) {
  const detalhado = ELENCOS_2025[turma];
  if (detalhado) {
    return detalhado.map((j, i) => ({
      id: `j_${Date.now()}_${i}`,
      numero: j.numero != null ? String(j.numero) : "",
      apelido: j.apelido || "",
      nome: j.nome || "",
      posicao: "",
      periodo: j.periodo || "",
      anoConclusao: j.anoConclusao || "",
    }));
  }
  const simples = ROSTERS_2025[turma];
  if (simples) {
    return simples.map((nome, i) => ({
      id: `j_${Date.now()}_${i}`,
      numero: "",
      nome,
      posicao: "",
      periodo: "",
      anoConclusao: "",
    }));
  }
  return [];
}

function PlayerRow({ player, onChange, onRemove, turmaTime, onSolicitarAvaliacao }) {
  const [expanded, setExpanded] = useState(false);
  const titulo = player.apelido || player.nome || "Jogador sem nome";
  const regular = anoConclusaoRegular(player.anoConclusao, turmaTime);
  const irregular = regular === false && !player.excecaoAprovada;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: COLORS.zebra, border: irregular ? `1.5px solid ${COLORS.accent}` : "1.5px solid transparent" }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      >
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {player.numero || "–"}
        </span>
        <span className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate flex items-center gap-1.5" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
            {titulo}
            {irregular && <AlertTriangle size={13} color={COLORS.accent} />}
          </div>
          {irregular ? (
            <div className="text-xs truncate font-medium" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
              Ano de conclusão ({player.anoConclusao}) não bate com a turma {turmaTime} — Art. 9º
            </div>
          ) : player.excecaoAprovada ? (
            <div className="text-xs truncate" style={{ color: "#16A34A", fontFamily: "'Inter', sans-serif" }}>
              Exceção aprovada pela organização
            </div>
          ) : (
            (player.periodo || (player.apelido && player.nome)) && (
              <div className="text-xs truncate" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                {[player.apelido && player.nome ? player.nome : null, player.periodo].filter(Boolean).join(" · ")}
              </div>
            )
          )}
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 p-1"
        >
          <X size={14} color={COLORS.slate} />
        </span>
      </button>

      {irregular && onSolicitarAvaliacao && (
        <div className="px-3 pb-2.5">
          {player.avaliacaoPendente ? (
            <span className="text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              Avaliação solicitada — aguardando a comissão.
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSolicitarAvaliacao(player);
              }}
              className="text-xs font-semibold underline"
              style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
            >
              Solicitar avaliação da comissão
            </button>
          )}
        </div>
      )}

      {expanded && (
        <div className="px-3 pb-3 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Número"
            value={player.numero}
            onChange={(e) => onChange({ ...player, numero: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-1"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="text"
            placeholder="Posição"
            value={player.posicao}
            onChange={(e) => onChange({ ...player, posicao: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-1"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="text"
            placeholder="Apelido"
            value={player.apelido || ""}
            onChange={(e) => onChange({ ...player, apelido: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-2"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="text"
            placeholder="Nome completo"
            value={player.nome}
            onChange={(e) => onChange({ ...player, nome: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-2"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="text"
            placeholder="Período de estudo (ex: 2003-2009)"
            value={player.periodo || ""}
            onChange={(e) => onChange({ ...player, periodo: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-2"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="text"
            placeholder="Ano de conclusão"
            value={player.anoConclusao || ""}
            onChange={(e) => onChange({ ...player, anoConclusao: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-2"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="text"
            placeholder="CPF"
            value={player.cpf || ""}
            onChange={(e) => onChange({ ...player, cpf: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-1"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <input
            type="date"
            placeholder="Data de nascimento"
            value={player.nascimento || ""}
            onChange={(e) => onChange({ ...player, nascimento: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg text-sm col-span-1"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nota: o login/senha de pessoas agora é 100% Supabase Auth (ver
// src/lib/supabase.js) — não guardamos mais hash de senha aqui no app.
// O código de time (abaixo) é só um código curto de conveniência, não uma
// senha de conta.
// ---------------------------------------------------------------------------

function gerarCodigoTime() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function readFileAsDataURL(file, maxBytes) {
  return new Promise((resolve, reject) => {
    if (maxBytes && file.size > maxBytes) {
      reject(new Error(`Arquivo muito grande (máximo ${(maxBytes / 1024 / 1024).toFixed(1)}MB). Grave um trecho mais curto.`));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function EscudoPicker({ value, onChange }) {
  const inputRef = React.useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await compressImageFile(file, 400, 0.8);
      onChange(dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current && inputRef.current.click()}
        disabled={busy}
        className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden disabled:opacity-60"
        style={{ backgroundColor: COLORS.surfaceAlt, border: `1.5px dashed ${COLORS.border}` }}
      >
        {busy ? (
          <Loader2 size={18} color={COLORS.slate} className="animate-spin" />
        ) : value ? (
          <img src={value} alt="Escudo" className="w-full h-full object-cover" />
        ) : (
          <Camera size={18} color={COLORS.slate} />
        )}
      </button>
      <div className="text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        Escudo do time (opcional) — tire uma foto ou escolha da galeria
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edição de elenco reutilizável — usada tanto por quem já se inscreveu
// (com o código do time) quanto pela organização (com a senha de admin)
// ---------------------------------------------------------------------------
function RosterEditor({ team, onSave }) {
  const [jogadores, setJogadores] = useState(team.jogadores || []);
  const [saved, setSaved] = useState(false);

  const addJogador = (novo) => setJogadores([...jogadores, novo]);
  const updateJogador = (updated) => setJogadores(jogadores.map((j) => (j.id === updated.id ? updated : j)));
  const removeJogador = (id) => setJogadores(jogadores.filter((j) => j.id !== id));

  const salvar = async () => {
    await onSave({ ...team, jogadores });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div
        className="text-xs font-semibold uppercase tracking-wide mb-2"
        style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
      >
        Adicionar jogador — todos os campos são obrigatórios
      </div>
      <AddPlayerForm onAdd={addJogador} />

      <div className="space-y-1.5 max-h-96 overflow-y-auto mb-3">
        {jogadores.map((j) => (
          <PlayerRow key={j.id} player={j} onChange={updateJogador} onRemove={() => removeJogador(j.id)} turmaTime={team.nome} />
        ))}
      </div>

      {jogadores.length > 0 && (jogadores.length < MIN_JOGADORES_TIME || jogadores.length > MAX_JOGADORES_TIME) && (
        <div
          className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg mb-3"
          style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
        >
          <AlertTriangle size={14} />
          Time precisa ter entre {MIN_JOGADORES_TIME} e {MAX_JOGADORES_TIME} jogadores (Art. 9º) — está com {jogadores.length}.
        </div>
      )}

      <button
        type="button"
        onClick={salvar}
        className="px-5 py-2.5 rounded-xl font-semibold text-sm"
        style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
      >
        Salvar alterações
      </button>
      {saved && (
        <span className="ml-3 text-sm" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          Salvo!
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time já inscrito volta aqui pra editar o próprio elenco — protegido pelo
// código de 4 dígitos gerado na hora da inscrição, pra ninguém mexer no
// time dos outros. Não é uma senha forte, mas evita alteração por acaso
// ou por qualquer visitante.
// ---------------------------------------------------------------------------
function EditarMeuTime({ teams, saveTeams }) {
  const [open, setOpen] = useState(false);
  const [timeId, setTimeId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [liberado, setLiberado] = useState(false);

  const time = teams.find((t) => t.id === timeId);

  const tentar = (e) => {
    e.preventDefault();
    if (!time) {
      setErro("Escolha o seu time.");
      return;
    }
    if (String(time.codigo || "") !== codigo.trim()) {
      setErro("Código incorreto.");
      return;
    }
    setErro("");
    setLiberado(true);
  };

  const salvarTime = async (atualizado) => {
    await saveTeams(teams.map((t) => (t.id === atualizado.id ? atualizado : t)));
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold underline"
        style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
      >
        Já inscreveu seu time? Editar jogadores
      </button>
    );
  }

  if (liberado && time) {
    return (
      <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
        <div className="text-sm font-semibold mb-3" style={{ color: COLORS.ink, fontFamily: "'Sora', sans-serif" }}>
          Editando: {time.nome}
        </div>
        <RosterEditor team={time} onSave={salvarTime} />
      </div>
    );
  }

  return (
    <form
      onSubmit={tentar}
      className="rounded-2xl p-5 space-y-3"
      style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
    >
      <select
        value={timeId}
        onChange={(e) => setTimeId(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm"
        style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
      >
        <option value="">Selecione seu time</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nome}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Código de 4 dígitos (recebido na inscrição)"
        className="w-full px-3 py-2 rounded-xl text-sm"
        style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
      />
      {erro && (
        <div className="text-sm" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          {erro}
        </div>
      )}
      <button
        type="submit"
        className="px-4 py-2 rounded-xl text-sm font-semibold"
        style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
      >
        Acessar
      </button>
    </form>
  );
}

// Formulário completo pra adicionar um jogador novo — nada de "só o nome":
// exige apelido, número, nome completo, período, ano de conclusão, CPF e
// data de nascimento, igual pede o regulamento.
function AddPlayerForm({ onAdd }) {
  const vazio = { apelido: "", numero: "", nome: "", periodo: "", anoConclusao: "", cpf: "", nascimento: "" };
  const [novo, setNovo] = useState(vazio);
  const [erro, setErro] = useState("");

  const campo = (key, value) => setNovo({ ...novo, [key]: value });

  const adicionar = () => {
    const faltando = Object.entries(novo).some(([, v]) => !String(v).trim());
    if (faltando) {
      setErro("Preenche todos os campos pra poder adicionar o jogador — nenhum é opcional.");
      return;
    }
    setErro("");
    onAdd({ id: `j_${Date.now()}`, posicao: "", ...novo });
    setNovo(vazio);
  };

  const campos = [
    { key: "apelido", label: "Apelido *", placeholder: "Ex: Bruninho" },
    { key: "numero", label: "Número da camisa *", placeholder: "Ex: 10" },
    { key: "nome", label: "Nome completo *", placeholder: "Nome e sobrenome", span: true },
    { key: "periodo", label: "Período de estudo *", placeholder: "Ex: 2003-2009" },
    { key: "anoConclusao", label: "Ano de conclusão *", placeholder: "Ex: 2009" },
    { key: "cpf", label: "CPF *", placeholder: "000.000.000-00" },
    { key: "nascimento", label: "Data de nascimento *", placeholder: "", type: "date" },
  ];

  return (
    <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}` }}>
      <div className="grid grid-cols-2 gap-2">
        {campos.map((f) => (
          <input
            key={f.key}
            type={f.type || "text"}
            placeholder={f.placeholder}
            value={novo[f.key]}
            onChange={(e) => campo(f.key, e.target.value)}
            className={`px-2.5 py-1.5 rounded-lg text-sm ${f.span ? "col-span-2" : ""}`}
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
        ))}
      </div>
      {erro && (
        <div className="text-xs font-medium mt-2" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          {erro}
        </div>
      )}
      <button
        type="button"
        onClick={adicionar}
        className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold"
        style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
      >
        Adicionar jogador
      </button>
    </div>
  );
}

function Inscricao({ teams, saveTeams, sessao, avaliacoes, saveAvaliacoes }) {
  const isAdmin = sessao && sessao.tipo === "admin";
  const podeAcessar = sessao && (isAdmin || sessao.representanteAprovado);
  const turmaFixa = !isAdmin && sessao ? sessao.turma || "" : "";

  const montarEstadoInicial = () => {
    const turmaAlvo = isAdmin ? "" : turmaFixa;
    const timeAlvo = turmaAlvo ? teams.find((t) => t.nome === turmaAlvo) : null;
    if (timeAlvo) {
      return {
        turmaSelecionada: timeAlvo.nome,
        nomeCustom: "",
        capitao: timeAlvo.capitao || "",
        contato: timeAlvo.contato || "",
        jogadores: timeAlvo.jogadores || [],
        escudoUrl: timeAlvo.escudoUrl || "",
      };
    }
    if (turmaAlvo) {
      return {
        turmaSelecionada: turmaAlvo,
        nomeCustom: "",
        capitao: "",
        contato: "",
        jogadores: jogadoresDaTurma(turmaAlvo),
        escudoUrl: ESCUDOS_TIMES[turmaAlvo] || "",
      };
    }
    return { turmaSelecionada: "", nomeCustom: "", capitao: "", contato: "", jogadores: [], escudoUrl: "" };
  };

  const [form, setForm] = useState(montarEstadoInicial);
  const [dirty, setDirty] = useState(false);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [codigoGerado, setCodigoGerado] = useState("");

  const nomeTime = form.turmaSelecionada === "outro" ? form.nomeCustom.trim() : form.turmaSelecionada;
  const timeExistente = teams.find((t) => t.nome === nomeTime) || null;

  const atualizarCampo = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const escolherTurma = (valor) => {
    if (valor === "outro") {
      atualizarCampo({ turmaSelecionada: valor, jogadores: [], escudoUrl: "" });
      return;
    }
    const existente = teams.find((t) => t.nome === valor);
    if (existente) {
      atualizarCampo({
        turmaSelecionada: valor,
        capitao: existente.capitao || "",
        contato: existente.contato || "",
        jogadores: existente.jogadores || [],
        escudoUrl: existente.escudoUrl || "",
      });
      return;
    }
    atualizarCampo({
      turmaSelecionada: valor,
      jogadores: jogadoresDaTurma(valor),
      escudoUrl: ESCUDOS_TIMES[valor] || "",
    });
    // CPF vem de uma tabela protegida (só quem tem login lê) — busca à
    // parte e completa o formulário quando chegar, sem guardar CPF no
    // código público do site.
    buscarCpfsDaTurma(valor)
      .then((mapaCpf) => {
        if (Object.keys(mapaCpf).length === 0) return;
        setForm((atual) => {
          if (atual.turmaSelecionada !== valor) return atual;
          return {
            ...atual,
            jogadores: atual.jogadores.map((j) => {
              if (j.cpf) return j;
              const cpf = mapaCpf[j.apelido] || mapaCpf[j.nome];
              return cpf ? { ...j, cpf } : j;
            }),
          };
        });
      })
      .catch((e) => console.error("Falha ao buscar CPFs do elenco histórico", e));
  };

  const addJogador = (novo) => atualizarCampo({ jogadores: [...form.jogadores, novo] });
  const updateJogador = (updated) =>
    atualizarCampo({ jogadores: form.jogadores.map((j) => (j.id === updated.id ? updated : j)) });
  const removeJogador = (id) => atualizarCampo({ jogadores: form.jogadores.filter((j) => j.id !== id) });

  const solicitarAvaliacao = async (jogador) => {
    const jaTemPendente = avaliacoes.some((a) => a.jogadorId === jogador.id && a.status === "pendente");
    if (jaTemPendente) {
      updateJogador({ ...jogador, avaliacaoPendente: true });
      return;
    }
    const caso = {
      id: `aval_${Date.now()}`,
      timeNome: nomeTime,
      jogadorId: jogador.id,
      jogadorApelido: jogador.apelido,
      jogadorNome: jogador.nome,
      anoConclusao: jogador.anoConclusao,
      status: "pendente",
      criadoEm: new Date().toISOString(),
    };
    await saveAvaliacoes([...avaliacoes, caso]);
    updateJogador({ ...jogador, avaliacaoPendente: true });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");
    if (!nomeTime || !form.capitao.trim() || !form.contato.trim()) {
      setError("Preencha seus dados, escolha a turma e o contato.");
      return;
    }
    if (form.jogadores.length === 0) {
      setError("Cadastre pelo menos um jogador — não é opcional.");
      return;
    }
    setSaving(true);
    let codigo = null;
    await saveTeams((atuais) => {
      const lista = atuais || [];
      if (timeExistente) {
        const existenteReal = lista.find((t) => t.nome === nomeTime) || timeExistente;
        const atualizado = {
          ...existenteReal,
          capitao: form.capitao.trim(),
          contato: form.contato.trim(),
          jogadores: form.jogadores,
          escudoUrl: form.escudoUrl,
        };
        return lista.map((t) => (t.id === atualizado.id ? atualizado : t));
      }
      codigo = gerarCodigoTime();
      const novoTime = {
        id: `time_${Date.now()}`,
        nome: nomeTime,
        capitao: form.capitao.trim(),
        contato: form.contato.trim(),
        jogadores: form.jogadores,
        escudoUrl: form.escudoUrl,
        codigo,
        inscritoEm: new Date().toISOString(),
      };
      return [...lista, novoTime];
    });
    if (codigo) setCodigoGerado(codigo);
    setSaving(false);
    setSent(true);
    setDirty(false);
    setTimeout(() => setSent(false), 3000);
  };

  if (!podeAcessar) {
    return (
      <div>
        <SectionLabel eyebrow="Participe" title="Inscrição de time" />
        <div
          className="rounded-2xl p-6 max-w-md"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock size={18} color={COLORS.ink} />
            <span style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }} className="text-sm font-medium">
              Só representantes de time acessam
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Essa aba é reservada pra quem vai representar um time na Copa. Se você já se
            cadastrou no app, seu pedido já está na fila — é só esperar um organizador aprovar.
            Se ainda não se cadastrou, faz isso primeiro pela tela de login.
          </p>
          <a
            href={WHATSAPP_LINK_REPRESENTANTE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#25D366", color: "#052E16", fontFamily: "'Inter', sans-serif" }}
          >
            <MessageCircle size={16} /> Falar com a organização no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  if (!isAdmin && !turmaFixa) {
    return (
      <div>
        <SectionLabel eyebrow="Participe" title="Inscrição de time" />
        <div
          className="rounded-2xl p-6 max-w-md"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Você já foi aprovado como representante, mas ainda falta um organizador definir qual
            é a sua turma. Assim que isso acontecer, o time dela aparece aqui automaticamente.
          </p>
        </div>
      </div>
    );
  }

  if (!inscricaoAberta()) {
    return (
      <div>
        <SectionLabel eyebrow="Participe" title="Inscrição de time" />
        <EmptyState>
          O período de inscrição ({PRAZO_INSCRICAO}) está encerrado por enquanto. Se você já
          inscreveu seu time, fale com a organização pra qualquer ajuste — o cadastro de novos
          times volta a abrir na próxima edição.
        </EmptyState>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel eyebrow="Participe" title="Inscrição de time" />
      <div
        className="text-sm px-4 py-2.5 rounded-xl mb-3 inline-block"
        style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
      >
        Valor da inscrição: <strong>{VALOR_INSCRICAO_ATLETA}</strong>
      </div>
      <div>
        <a
          href="regulamento.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs mb-6"
          style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
        >
          <Download size={13} /> Baixar regulamento oficial (PDF)
        </a>
      </div>

      <div className="grid sm:grid-cols-5 gap-8">
        <form onSubmit={handleSalvar} className="sm:col-span-3 space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
            >
              Capitão
            </label>
            <input
              type="text"
              value={form.capitao}
              onChange={(e) => atualizarCampo({ capitao: e.target.value })}
              placeholder="Seu nome completo"
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
            >
              Contato (WhatsApp)
            </label>
            <input
              type="text"
              value={form.contato}
              onChange={(e) => atualizarCampo({ contato: e.target.value })}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {isAdmin ? (
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
              >
                Turma / ano
              </label>
              <select
                value={form.turmaSelecionada}
                onChange={(e) => escolherTurma(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
              >
                <option value="">Selecione</option>
                {TURMAS_HISTORICAS_ORDENADAS.map((t) => (
                  <option key={t.turma} value={t.turma}>
                    {t.turma}
                  </option>
                ))}
                <option value="outro">Outra turma / time novo</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: COLORS.accentSoft }}>
              {form.escudoUrl && <img src={form.escudoUrl} alt="" className="w-10 h-10 object-contain shrink-0" />}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
                  Sua turma
                </div>
                <div className="text-sm font-semibold" style={{ color: COLORS.accent, fontFamily: "'Sora', sans-serif" }}>
                  {turmaFixa}
                </div>
              </div>
            </div>
          )}

          {isAdmin && form.turmaSelecionada === "outro" && (
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
              >
                Nome do time
              </label>
              <input
                type="text"
                value={form.nomeCustom}
                onChange={(e) => atualizarCampo({ nomeCustom: e.target.value })}
                placeholder="Ex: Turma de 2011"
                className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          )}

          {form.turmaSelecionada && (
            <>
              {isAdmin && (
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                    style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
                  >
                    Escudo
                  </label>
                  <EscudoPicker value={form.escudoUrl} onChange={(v) => atualizarCampo({ escudoUrl: v })} />
                </div>
              )}

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                  style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
                >
                  Jogadores — {form.jogadores.length} cadastrado(s), entre {MIN_JOGADORES_TIME} e{" "}
                  {MAX_JOGADORES_TIME} exigido pelo regulamento
                </label>

                {form.jogadores.length > 0 && (
                  <div className="space-y-1.5 max-h-96 overflow-y-auto mb-3">
                    {form.jogadores.map((j) => (
                      <PlayerRow
                        key={j.id}
                        player={j}
                        onChange={updateJogador}
                        onRemove={() => removeJogador(j.id)}
                        turmaTime={nomeTime}
                        onSolicitarAvaliacao={solicitarAvaliacao}
                      />
                    ))}
                  </div>
                )}

                <div
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
                >
                  Adicionar jogador — todos os campos são obrigatórios
                </div>
                <AddPlayerForm onAdd={addJogador} />
              </div>
            </>
          )}

          {error && (
            <div className="text-sm font-medium" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !dirty}
            className="px-5 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {dirty ? "Salvar" : "Sem alterações pra salvar"}
          </button>

          {form.jogadores.length > 0 && (
            <button
              type="button"
              onClick={() =>
                baixarFichaTime({
                  nome: nomeTime,
                  capitao: form.capitao,
                  contato: form.contato,
                  jogadores: form.jogadores,
                })
              }
              className="ml-3 px-4 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
              style={{ color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            >
              <Download size={15} /> Baixar ficha do meu time
            </button>
          )}

          {sent && (
            <div
              className="text-sm font-medium px-4 py-3 rounded-xl mt-2"
              style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Check size={16} /> Salvo! Boa sorte na {EDITION_ROMAN} Copa!
              </div>
              {codigoGerado && (
                <div>
                  Guarde este código de segurança:{" "}
                  <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{codigoGerado}</strong>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="sm:col-span-2">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <div
              className="text-xs font-semibold uppercase tracking-wide mb-3"
              style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
            >
              Times já inscritos ({teams.length})
            </div>
            {teams.length === 0 ? (
              <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                Nenhum time inscrito ainda. Seja o primeiro time da {EDITION_ROMAN} edição.
              </p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {teams.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
                    style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                  >
                    {(ESCUDOS_TIMES[t.nome] || t.escudoUrl) && (
                      <img src={ESCUDOS_TIMES[t.nome] || t.escudoUrl} alt="" className="w-6 h-6 object-contain shrink-0" />
                    )}
                    <span className="truncate">{t.nome}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ---------------------------------------------------------------------------
// TAB: Chaveamento
// ---------------------------------------------------------------------------
function MatchCard({ match, teamsById }) {
  const timeA = teamsById[match.timeA];
  const timeB = teamsById[match.timeB];
  const a = timeA?.nome || match.timeA || "A definir";
  const b = timeB?.nome || match.timeB || "A definir";
  const escudoA = ESCUDOS_TIMES[a] || (timeA && timeA.escudoUrl);
  const escudoB = ESCUDOS_TIMES[b] || (timeB && timeB.escudoUrl);
  const played = match.golsA !== "" && match.golsB !== "" && match.golsA != null && match.golsB != null;
  return (
    <div
      className="rounded-xl px-4 py-3 w-64 shrink-0"
      style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
    >
      <div
        className="text-[10px] uppercase tracking-widest mb-2 font-semibold flex items-center justify-between"
        style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
      >
        <span>{match.fase || "Fase"}</span>
        {match.status && match.status !== "agendado" ? (
          <MatchClock match={match} />
        ) : (
          match.horario && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.slate }}>
              {formatarHorarioJogo(match.horario)}
            </span>
          )
        )}
      </div>
      {[
        ["A", a, match.golsA, escudoA],
        ["B", b, match.golsB, escudoB],
      ].map(([k, nome, gols, escudo]) => (
        <div key={k} className="flex items-center justify-between py-0.5 gap-2">
          <span className="flex items-center gap-1.5 min-w-0">
            {escudo && <img src={escudo} alt="" className="w-5 h-5 object-contain shrink-0" />}
            <span className="text-sm truncate" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
              {nome}
            </span>
          </span>
          <span
            className="text-sm font-bold w-6 text-right shrink-0"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: played ? COLORS.ink : COLORS.border }}
          >
            {played ? gols : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

// Card de jogo que qualquer um pode clicar pra ver elenco de cada time e
// os eventos (gols/assistências/cartões) já registrados. Só quem está
// logado como admin vê os controles pra editar — pros demais é só
// leitura, mas já mostra tudo em tempo real.
function MatchCardExpansivel({ match, teams, sessao, saveMatches, matches }) {
  const [expanded, setExpanded] = useState(false);
  const isAdmin = sessao && sessao.tipo === "admin";
  const timeA = teams.find((t) => t.id === match.timeA);
  const timeB = teams.find((t) => t.id === match.timeB);
  const nomeA = timeA?.nome || match.timeA || "A definir";
  const nomeB = timeB?.nome || match.timeB || "A definir";
  const escudoA = ESCUDOS_TIMES[nomeA] || (timeA && timeA.escudoUrl);
  const escudoB = ESCUDOS_TIMES[nomeB] || (timeB && timeB.escudoUrl);
  const played = match.golsA !== "" && match.golsB !== "" && match.golsA != null && match.golsB != null;

  if (isAdmin && saveMatches) {
    const onUpdate = async (updated) => {
      const atualizado = matches.map((m) => (m.id === updated.id ? updated : m));
      await saveMatches(gerarMataMataAutomatico(atualizado, teams));
    };
    return (
      <div className="w-72 shrink-0">
        <MatchAdminRow match={match} teams={teams} onUpdate={onUpdate} />
      </div>
    );
  }

  const rotuloEvento = (tipo) =>
    ({ gol: "⚽ Gol", assistencia: "🅰️ Assistência", cartao_amarelo: "🟨 Amarelo", cartao_vermelho: "🟥 Vermelho" }[tipo] || tipo);

  return (
    <div
      className="rounded-xl overflow-hidden w-72 shrink-0"
      style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
    >
      <button type="button" onClick={() => setExpanded((v) => !v)} className="w-full text-left px-4 py-3">
        <div
          className="text-[10px] uppercase tracking-widest mb-2 font-semibold flex items-center justify-between"
          style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
        >
          <span>{match.fase || "Fase"}</span>
          {match.status && match.status !== "agendado" ? (
            <MatchClock match={match} />
          ) : (
            match.horario && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.slate }}>
                {formatarHorarioJogo(match.horario)}
              </span>
            )
          )}
        </div>
        {[
          ["A", nomeA, match.golsA, escudoA],
          ["B", nomeB, match.golsB, escudoB],
        ].map(([k, nome, gols, escudo]) => (
          <div key={k} className="flex items-center justify-between py-0.5 gap-2">
            <span className="flex items-center gap-1.5 min-w-0">
              {escudo && <img src={escudo} alt="" className="w-5 h-5 object-contain shrink-0" />}
              <span className="text-sm truncate" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                {nome}
              </span>
            </span>
            <span
              className="text-sm font-bold w-6 text-right shrink-0"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: played ? COLORS.ink : COLORS.border }}
            >
              {played ? gols : "—"}
            </span>
          </div>
        ))}
      </button>

      {expanded && (
        <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: COLORS.border }}>
          {(match.eventos || []).length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                Eventos
              </div>
              <ul className="space-y-0.5">
                {match.eventos.map((ev) => (
                  <li key={ev.id} className="text-xs" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                    {rotuloEvento(ev.tipo)} — {ev.jogador}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {[
              [nomeA, timeA],
              [nomeB, timeB],
            ].map(([nome, time]) => (
              <div key={nome}>
                <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                  {nome}
                </div>
                <ul className="space-y-0.5">
                  {(time?.jogadores || []).map((j) => (
                    <li key={j.id} className="text-xs truncate" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                      {j.numero ? `${j.numero} · ` : ""}
                      {j.apelido || j.nome}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Chaveamento({ matches, teams, sessao, saveMatches }) {
  const faseRank = (f) => {
    if (f.startsWith("Grupo")) return 0;
    const ordem = ["Oitavas", "Quartas", "Semifinal", "3º Lugar", "Final"];
    const i = ordem.indexOf(f);
    return i === -1 ? 99 : i + 1;
  };

  const gruposDeGrupo = useMemo(() => {
    const nomes = new Set();
    matches.forEach((m) => {
      if ((m.fase || "").startsWith("Grupo")) nomes.add(m.fase);
    });
    return Array.from(nomes).sort();
  }, [matches]);

  const fasesEliminatorias = useMemo(() => {
    const nomes = new Set();
    matches.forEach((m) => {
      if (!(m.fase || "").startsWith("Grupo")) nomes.add(m.fase);
    });
    return Array.from(nomes).sort((a, b) => faseRank(a) - faseRank(b));
  }, [matches]);

  return (
    <div>
      <SectionLabel eyebrow="Todos os confrontos" title="Jogos ao Vivo" />
      <a
        href={LOCAL_MAPS_LINK}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs mb-6"
        style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
      >
        <MapPin size={13} /> {LOCAL_NOME} — ver no mapa
      </a>
      {matches.length === 0 ? (
        <EmptyState>
          Nenhum jogo cadastrado ainda. A organização pode gerar a tabela na aba Sorteio.
        </EmptyState>
      ) : (
        <>
          {gruposDeGrupo.length > 0 && (
            <div className="mb-10">
              <div className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
                Fase de grupos
              </div>
              {gruposDeGrupo.map((fase) => {
                const jogosDoGrupo = matches.filter((m) => m.fase === fase);
                const rodadas = Array.from(new Set(jogosDoGrupo.map((m) => m.rodada || 1))).sort((a, b) => a - b);
                return (
                  <div key={fase} className="mb-8">
                    <div className="text-sm font-semibold mb-3" style={{ color: COLORS.ink, fontFamily: "'Sora', sans-serif" }}>
                      {fase}
                    </div>
                    {rodadas.map((r) => (
                      <div key={r} className="mb-4">
                        <div className="text-xs font-medium mb-2" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                          Rodada {r}
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {jogosDoGrupo
                            .filter((m) => (m.rodada || 1) === r)
                            .map((m) => (
                              <MatchCardExpansivel key={m.id} match={m} teams={teams} sessao={sessao} saveMatches={saveMatches} matches={matches} />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {fasesEliminatorias.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
                Fase eliminatória
              </div>
              {fasesEliminatorias.map((fase) => (
                <div key={fase} className="mb-8">
                  <div className="text-sm font-semibold mb-3" style={{ color: COLORS.ink, fontFamily: "'Sora', sans-serif" }}>
                    {fase}
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {matches
                      .filter((m) => m.fase === fase)
                      .map((m) => (
                        <MatchCardExpansivel key={m.id} match={m} teams={teams} sessao={sessao} saveMatches={saveMatches} matches={matches} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: Classificação
// ---------------------------------------------------------------------------
function TabelaClassificacao({ titulo, linhas, destaqueTop }) {
  const cols = ["Time", "J", "V", "E", "D", "GP", "GC", "SG", "Pts"];
  return (
    <div className="mb-8">
      {titulo && (
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
          {titulo}
        </h3>
      )}
      <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${COLORS.border}` }}>
        <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          <thead>
            <tr style={{ backgroundColor: COLORS.card, borderBottom: `2px solid ${COLORS.ink}` }}>
              {cols.map((c, i) => (
                <th
                  key={c}
                  className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-center"}`}
                  style={{ color: COLORS.ink }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((t, idx) => {
              const classificado = destaqueTop && idx < destaqueTop;
              return (
                <tr
                  key={t.id || t.nome}
                  style={{
                    backgroundColor: classificado ? "rgba(22,163,74,0.18)" : idx % 2 === 0 ? COLORS.card : COLORS.zebra,
                    borderLeft: classificado ? "3px solid #16A34A" : "3px solid transparent",
                  }}
                >
                  <td className="px-3 py-2.5 font-medium" style={{ color: COLORS.ink }}>
                    <span className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: COLORS.slate, fontFamily: "'JetBrains Mono', monospace" }}>
                        {idx + 1}
                      </span>
                      {ESCUDOS_TIMES[t.nome] && (
                        <img src={ESCUDOS_TIMES[t.nome]} alt="" className="w-5 h-5 object-contain shrink-0" />
                      )}
                      {t.nome}
                    </span>
                  </td>
                  {[t.j, t.v, t.e, t.d, t.gp, t.gc, t.gp - t.gc, t.pts].map((v, i) => (
                    <td
                      key={i}
                      className="px-3 py-2.5 text-center"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: i === 7 ? COLORS.accent : COLORS.ink,
                        fontWeight: i === 7 ? 700 : 500,
                      }}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Classificacao({ matches, teams }) {
  const geral = useMemo(() => calcularClassificacaoGeral(matches, teams), [matches, teams]);

  const gruposNomes = useMemo(() => {
    const nomes = new Set();
    matches.forEach((m) => {
      if ((m.fase || "").startsWith("Grupo")) nomes.add(m.fase);
    });
    return Array.from(nomes).sort();
  }, [matches]);

  const fasesEliminatorias = useMemo(() => {
    const nomes = new Set();
    matches.forEach((m) => {
      if (!(m.fase || "").startsWith("Grupo")) nomes.add(m.fase);
    });
    const ordem = ["Oitavas", "Quartas", "Semifinal", "3º Lugar", "Final"];
    return Array.from(nomes).sort((a, b) => {
      const ia = ordem.indexOf(a);
      const ib = ordem.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [matches]);

  const temGrupos = gruposNomes.length > 0;
  const [modo, setModo] = useState("grupos"); // "grupos" | "geral"

  const teamName = (id) => teams.find((t) => t.id === id)?.nome || "?";

  return (
    <div>
      <SectionLabel eyebrow="Tabela" title="Classificação" />
      {teams.length === 0 ? (
        <EmptyState>Ainda não há times inscritos.</EmptyState>
      ) : !temGrupos ? (
        <TabelaClassificacao linhas={geral} />
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <p className="text-sm max-w-xl" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              Atualiza sozinha conforme os jogos acontecem. Os classificados (em verde) avançam
              pro mata-mata automaticamente.
            </p>
            <button
              type="button"
              onClick={() => setModo(modo === "grupos" ? "geral" : "grupos")}
              className="px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
              style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
            >
              {modo === "grupos" ? "Ver classificação geral" : "Ver por grupos"}
            </button>
          </div>

          {modo === "geral" ? (
            <TabelaClassificacao titulo="Classificação geral" linhas={geral} destaqueTop={8} />
          ) : (
            gruposNomes.map((fase) => (
              <TabelaClassificacao
                key={fase}
                titulo={fase}
                destaqueTop={2}
                linhas={pontosPartida(matches.filter((m) => m.fase === fase), teams).filter((t) =>
                  matches.some((m) => m.fase === fase && (m.timeA === t.id || m.timeB === t.id))
                )}
              />
            ))
          )}
        </>
      )}

      {fasesEliminatorias.length > 0 && (
        <div className="mt-4">
          <SectionLabel eyebrow="Segunda fase" title="Eliminatórias" />
          {fasesEliminatorias.map((fase) => (
            <div key={fase} className="mb-6">
              <h3 className="text-sm font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
                {fase}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {matches
                  .filter((m) => m.fase === fase)
                  .map((m) => {
                    const decidido = jogoDecidido(m);
                    const vencedorId = decidido ? vencedorJogo(m) : null;
                    return (
                      <div
                        key={m.id}
                        className="rounded-xl px-4 py-2.5 flex items-center justify-between gap-2 text-sm"
                        style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
                      >
                        <span style={{ color: vencedorId === m.timeA ? "#16A34A" : COLORS.ink, fontWeight: vencedorId === m.timeA ? 700 : 500 }}>
                          {teamName(m.timeA)}
                        </span>
                        <span style={{ color: COLORS.slate, fontFamily: "'JetBrains Mono', monospace" }}>
                          {m.golsA ?? "–"} x {m.golsB ?? "–"}
                        </span>
                        <span style={{ color: vencedorId === m.timeB ? "#16A34A" : COLORS.ink, fontWeight: vencedorId === m.timeB ? 700 : 500 }}>
                          {teamName(m.timeB)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ---------------------------------------------------------------------------
// TAB: Galeria
// ---------------------------------------------------------------------------
function RecordRow({ label, entries, highlight }) {
  return (
    <div className="mb-5 last:mb-0">
      <div
        className="text-xs font-semibold uppercase tracking-wide mb-2"
        style={{ color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </div>
      <div className="space-y-1.5">
        {entries.map((e, i) => {
          const turmaKey = highlight ? String(e.nome).replace(" ★", "") : null;
          const escudo = turmaKey ? ESCUDOS_TIMES[turmaKey] : null;
          return (
            <div key={i} className="flex items-baseline justify-between text-sm gap-3">
              <span className="flex items-center gap-1.5" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                {escudo && <img src={escudo} alt="" className="w-4 h-4 object-contain shrink-0" />}
                {highlight ? `Seleção ${e.nome}` : e.nome}
                {e.turma && <span style={{ color: COLORS.slate }}> · {e.turma}</span>}
              </span>
              <span
                style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.slate }}
                className="text-xs shrink-0 text-right"
              >
                {e.ano}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HallDaFama() {
  const contagem = {};
  HALL_DA_FAMA.campeoes.forEach((c) => {
    contagem[c.turma] = (contagem[c.turma] || 0) + 1;
  });
  const campeoesComMarca = HALL_DA_FAMA.campeoes.map((c) => ({
    nome: c.turma + (contagem[c.turma] > 1 ? " ★" : ""),
    ano: c.edicao,
  }));

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 mb-8"
      style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: COLORS.goldSoft }}
        >
          <Trophy size={16} color={COLORS.gold} />
        </div>
        <h3 className="font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
          Hall da Fama — 7 edições
        </h3>
      </div>

      <RecordRow label="Campeões por edição" entries={campeoesComMarca} highlight />
      <p className="text-xs mt-1.5 mb-2" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        ★ = bicampeão
      </p>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5 mt-2 pt-5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <RecordRow label="Melhor jogador" entries={HALL_DA_FAMA.melhorJogador} />
        <RecordRow label="Artilheiro" entries={HALL_DA_FAMA.artilheiro} />
        <RecordRow label="Melhor goleiro" entries={HALL_DA_FAMA.melhorGoleiro} />
        <RecordRow label="Gol mais bonito" entries={HALL_DA_FAMA.golMaisBonito} />
      </div>
    </div>
  );
}

function Galeria() {
  return (
    <div>
      <SectionLabel eyebrow="Memória" title="Galeria das edições" />
      <HallDaFama />
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: Comunidade — fotos e vídeos de quem já se inscreveu
// ---------------------------------------------------------------------------
// Mostra uma foto ou vídeo guardado no bucket privado — como não existe
// mais link fixo, pede um link temporário (assinado) na hora de exibir,
// só funciona pra quem está logado.
function MidiaProtegida({ caminho, tipo, className, legenda }) {
  const [url, setUrl] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setUrl(null);
    setErro(false);
    urlAssinada(caminho)
      .then((u) => {
        if (!cancelado) setUrl(u);
      })
      .catch(() => {
        if (!cancelado) setErro(true);
      });
    return () => {
      cancelado = true;
    };
  }, [caminho]);

  if (erro) return null;
  if (!url) {
    return (
      <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.zebra }}>
        <Loader2 size={18} className="animate-spin" color={COLORS.slate} />
      </div>
    );
  }
  return tipo === "video" ? (
    <video src={url} controls className={className} />
  ) : (
    <img src={url} alt={legenda || ""} className={className} />
  );
}

function Comunidade({ posts, savePosts }) {
  const [ano, setAno] = useState(EDICOES_DISPONIVEIS[0]);
  const [legenda, setLegenda] = useState("");
  const [videoStaged, setVideoStaged] = useState(null);
  const [videoErro, setVideoErro] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [filtroAno, setFiltroAno] = useState("Todos");
  const fotoInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [subindoVideo, setSubindoVideo] = useState(false);

  const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // limite generoso do plano gratuito do Storage

  const publicar = async (extra) => {
    setSaving(true);
    const novo = {
      id: `post_${Date.now()}`,
      ano,
      fotoUrl: "",
      videoUrl: "",
      legenda: legenda.trim(),
      criadoEm: new Date().toISOString(),
      ...extra,
    };
    await savePosts([...posts, novo]);
    setSaving(false);
    setSent(true);
    setLegenda("");
    setVideoStaged(null);
    setTimeout(() => setSent(false), 3000);
  };

  const handleFotoFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setCapturing(true);
    try {
      const blob = await compressImageToBlob(file);
      const caminho = await subirArquivo(blob, file.name || "foto.jpg", "image/jpeg");
      await publicar({ fotoUrl: caminho });
    } catch (err) {
      console.error(err);
    } finally {
      setCapturing(false);
    }
  };

  const handleVideoFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setVideoErro("");
    if (file.size > MAX_VIDEO_BYTES) {
      setVideoErro(`Vídeo muito grande (máximo ${(MAX_VIDEO_BYTES / 1024 / 1024).toFixed(0)}MB). Grava um trecho mais curto.`);
      return;
    }
    setSubindoVideo(true);
    try {
      const caminho = await subirArquivo(file, file.name || "video.mp4", file.type);
      const url = await urlAssinada(caminho);
      setVideoStaged({ caminho, url });
    } catch (err) {
      setVideoErro("Falha ao subir o vídeo: " + err.message);
    } finally {
      setSubindoVideo(false);
    }
  };

  const publicarVideo = async () => {
    if (!videoStaged) return;
    await publicar({ videoUrl: videoStaged.caminho });
  };

  const anos = ["Todos", ...Array.from(new Set(posts.map((p) => p.ano).filter(Boolean)))];
  const postsFiltrados = filtroAno === "Todos" ? posts : posts.filter((p) => p.ano === filtroAno);

  return (
    <div>
      <SectionLabel eyebrow="Comunidade" title="Fotos e vídeos" />
      <p className="text-sm mb-6 max-w-xl" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        Espaço aberto pra quem estiver no app compartilhar fotos e vídeos da Copa — direto
        da câmera ou da galeria do celular, sem link.
      </p>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <input
          ref={fotoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFotoFile}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoFile}
        />
        <button
          type="button"
          onClick={() => fotoInputRef.current && fotoInputRef.current.click()}
          disabled={capturing}
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 disabled:opacity-60"
          style={{ backgroundColor: COLORS.accent }}
          aria-label="Adicionar foto"
        >
          {capturing ? (
            <Loader2 size={22} color="#FFFFFF" className="animate-spin" />
          ) : (
            <Camera size={22} color="#FFFFFF" />
          )}
        </button>
        <button
          type="button"
          onClick={() => videoInputRef.current && videoInputRef.current.click()}
          disabled={subindoVideo}
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 disabled:opacity-60"
          style={{ backgroundColor: COLORS.navy }}
          aria-label="Adicionar vídeo"
        >
          {subindoVideo ? <Loader2 size={20} color={COLORS.gold} className="animate-spin" /> : <Video size={20} color={COLORS.gold} />}
        </button>
        <div className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
          Foto (câmera ou galeria) publica na hora. Vídeo (câmera ou galeria) — edição:{" "}
          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="px-2 py-1 rounded-lg text-xs inline-block align-middle"
            style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
          >
            {EDICOES_DISPONIVEIS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {videoErro && (
        <div className="text-sm mb-3" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          {videoErro}
        </div>
      )}

      {videoStaged && (
        <div
          className="rounded-2xl p-4 mb-8 space-y-3"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <video src={videoStaged.url} controls className="w-full rounded-xl max-h-64" />
          <input
            type="text"
            placeholder="Legenda (opcional)"
            value={legenda}
            onChange={(e) => setLegenda(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm"
            style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={publicarVideo}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Publicar vídeo
            </button>
            <button
              type="button"
              onClick={() => setVideoStaged(null)}
              className="px-4 py-2.5 rounded-xl text-sm"
              style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {sent && (
        <div
          className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl mb-6"
          style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
        >
          <Check size={16} /> Publicado!
        </div>
      )}

      {anos.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {anos.map((a) => (
            <button
              key={a}
              onClick={() => setFiltroAno(a)}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: filtroAno === a ? COLORS.accent : COLORS.card,
                color: filtroAno === a ? "#FFFFFF" : COLORS.slate,
                border: `1px solid ${filtroAno === a ? COLORS.accent : COLORS.border}`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      {postsFiltrados.length === 0 ? (
        <EmptyState>Nenhuma foto ou vídeo publicado ainda nessa edição. Seja o primeiro a compartilhar.</EmptyState>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {postsFiltrados
            .slice()
            .reverse()
            .map((p) => (
              <div
                key={p.id}
                className="rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.card }}
              >
                {p.videoUrl ? (
                  <MidiaProtegida caminho={p.videoUrl} tipo="video" className="w-full max-h-64 bg-black" />
                ) : (
                  p.fotoUrl && (
                    <MidiaProtegida caminho={p.fotoUrl} tipo="foto" className="w-full h-48 object-cover" legenda={p.legenda} />
                  )
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
                      {p.ano || "Comunidade"}
                    </span>
                  </div>
                  {p.legenda && (
                    <p className="text-sm mt-1" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                      {p.legenda}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
// ---------------------------------------------------------------------------
// TAB: Organização (admin)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Cronômetro de partida (2 tempos corridos, sem escrita a cada segundo —
// cada cliente calcula localmente a partir do horário salvo no jogo)
// ---------------------------------------------------------------------------
function computeElapsedMs(match) {
  const acumulado = match.tempoAcumuladoMs || 0;
  if (match.status === "ao_vivo" && match.tempoIniciadoEm) {
    return acumulado + (Date.now() - match.tempoIniciadoEm);
  }
  return acumulado;
}

function formatElapsed(ms) {
  const totalSeg = Math.floor(ms / 1000);
  const min = Math.floor(totalSeg / 60);
  const seg = totalSeg % 60;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

function MatchClock({ match }) {
  const [, forceTick] = useState(0);
  useEffect(() => {
    if (match.status !== "ao_vivo") return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [match.status, match.tempoIniciadoEm]);

  const rotulo =
    match.status === "agendado"
      ? "Não iniciado"
      : match.status === "intervalo"
      ? "Intervalo"
      : match.status === "encerrado"
      ? "Encerrado"
      : `${match.tempoAtual === 2 ? "2º tempo" : "1º tempo"} · ${formatElapsed(computeElapsedMs(match))}`;

  return (
    <span
      className="text-xs font-semibold"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: match.status === "ao_vivo" ? "#22C55E" : COLORS.slate,
      }}
    >
      {rotulo}
    </span>
  );
}

const TIPOS_EVENTO = [
  { value: "gol", label: "⚽ Gol" },
  { value: "assistencia", label: "🅰️ Assistência" },
  { value: "cartao_amarelo", label: "🟨 Cartão amarelo" },
  { value: "cartao_vermelho", label: "🟥 Cartão vermelho" },
];

// Regra padrão de suspensão — ajustável quando as regras oficiais chegarem:
// 3 cartões amarelos = suspenso; 1 cartão vermelho = suspenso no próximo jogo (Art. 27).
function calcularSuspensos(matches) {
  const tally = {};
  matches.forEach((m) => {
    (m.eventos || []).forEach((ev) => {
      if (ev.tipo !== "cartao_amarelo" && ev.tipo !== "cartao_vermelho") return;
      const key = `${ev.jogador}|${ev.timeNome || ""}`;
      if (!tally[key]) tally[key] = { jogador: ev.jogador, timeNome: ev.timeNome, amarelos: 0, vermelhos: 0 };
      if (ev.tipo === "cartao_amarelo") tally[key].amarelos += 1;
      else tally[key].vermelhos += 1;
    });
  });
  return Object.values(tally)
    .map((t) => {
      const motivos = [];
      if (t.amarelos >= 3) motivos.push(`${t.amarelos} cartões amarelos`);
      if (t.vermelhos >= 1) motivos.push(`cartão vermelho`);
      return { ...t, motivos };
    })
    .filter((t) => t.motivos.length > 0);
}

function MatchAdminRow({ match, teams, onUpdate, onRemove, onMover, podeSubir, podeDescer }) {
  const [expanded, setExpanded] = useState(false);
  const [eventForm, setEventForm] = useState({ tipo: "gol", jogador: "", timeId: "" });

  const teamName = (id) => teams.find((t) => t.id === id)?.nome || "?";

  const patch = (fields) => onUpdate({ ...match, ...fields });

  const iniciarPrimeiroTempo = () =>
    patch({ status: "ao_vivo", tempoAtual: 1, tempoIniciadoEm: Date.now(), tempoAcumuladoMs: 0 });
  const irParaIntervalo = () =>
    patch({
      status: "intervalo",
      tempoAcumuladoMs: computeElapsedMs(match),
      tempoIniciadoEm: null,
    });
  const iniciarSegundoTempo = () =>
    patch({ status: "ao_vivo", tempoAtual: 2, tempoIniciadoEm: Date.now() });
  const encerrarJogo = () =>
    patch({
      status: "encerrado",
      tempoAcumuladoMs: computeElapsedMs(match),
      tempoIniciadoEm: null,
    });

  const addEvento = async (e) => {
    e.preventDefault();
    if (!eventForm.jogador.trim() || !eventForm.timeId) return;
    const evento = {
      id: `ev_${Date.now()}`,
      tipo: eventForm.tipo,
      jogador: eventForm.jogador.trim(),
      timeNome: teamName(eventForm.timeId),
      minuto: Math.floor(computeElapsedMs(match) / 60000),
    };
    const eventos = [...(match.eventos || []), evento];
    let extra = {};
    if (eventForm.tipo === "gol") {
      extra = eventForm.timeId === match.timeA ? { golsA: (match.golsA || 0) + 1 } : { golsB: (match.golsB || 0) + 1 };
    }
    await onUpdate({ ...match, eventos, ...extra });
    setEventForm({ tipo: "gol", jogador: "", timeId: "" });
  };

  const removeEvento = async (id) => {
    await onUpdate({ ...match, eventos: (match.eventos || []).filter((ev) => ev.id !== id) });
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.zebra }}>
      <div className="flex items-center gap-2 text-sm px-3 py-2">
        {onMover && (
          <div className="flex flex-col shrink-0 -my-1">
            <button
              type="button"
              onClick={() => onMover(-1)}
              disabled={!podeSubir}
              aria-label="Mover pra cima"
              className="disabled:opacity-20"
            >
              <ChevronUp size={14} color={COLORS.slate} />
            </button>
            <button
              type="button"
              onClick={() => onMover(1)}
              disabled={!podeDescer}
              aria-label="Mover pra baixo"
              className="disabled:opacity-20"
            >
              <ChevronDown size={14} color={COLORS.slate} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 min-w-0 text-left truncate"
          style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
        >
          <div className="truncate">{teamName(match.timeA)} x {teamName(match.timeB)}</div>
          {match.horario && (
            <div className="text-xs truncate" style={{ color: COLORS.slate, fontFamily: "'JetBrains Mono', monospace" }}>
              {formatarHorarioJogo(match.horario)}
            </div>
          )}
        </button>
        <MatchClock match={match} />
        <input
          type="number"
          value={match.golsA ?? ""}
          onChange={(e) => patch({ golsA: e.target.value === "" ? null : Number(e.target.value) })}
          className="w-11 px-1 py-1 rounded text-center text-sm"
          style={{ border: `1px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'JetBrains Mono', monospace" }}
        />
        <input
          type="number"
          value={match.golsB ?? ""}
          onChange={(e) => patch({ golsB: e.target.value === "" ? null : Number(e.target.value) })}
          className="w-11 px-1 py-1 rounded text-center text-sm"
          style={{ border: `1px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'JetBrains Mono', monospace" }}
        />
        {onRemove && (
          <button onClick={onRemove} aria-label="Remover jogo">
            <X size={15} color={COLORS.accent} />
          </button>
        )}
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {match.status === "agendado" && (
              <button
                type="button"
                onClick={iniciarPrimeiroTempo}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
              >
                Iniciar 1º tempo
              </button>
            )}
            {match.status === "ao_vivo" && match.tempoAtual === 1 && (
              <button
                type="button"
                onClick={irParaIntervalo}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
              >
                Intervalo
              </button>
            )}
            {match.status === "intervalo" && (
              <button
                type="button"
                onClick={iniciarSegundoTempo}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
              >
                Iniciar 2º tempo
              </button>
            )}
            {(match.status === "ao_vivo" || match.status === "intervalo") && (
              <button
                type="button"
                onClick={encerrarJogo}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
              >
                Encerrar jogo
              </button>
            )}
          </div>

          <form onSubmit={addEvento} className="flex flex-wrap gap-2 items-center">
            <select
              value={eventForm.tipo}
              onChange={(e) => setEventForm({ ...eventForm, tipo: e.target.value })}
              className="px-2 py-1.5 rounded-lg text-xs"
              style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            >
              {TIPOS_EVENTO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={eventForm.timeId}
              onChange={(e) => setEventForm({ ...eventForm, timeId: e.target.value })}
              className="px-2 py-1.5 rounded-lg text-xs"
              style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            >
              <option value="">Time</option>
              {[match.timeA, match.timeB].map((id) => (
                <option key={id} value={id}>
                  {teamName(id)}
                </option>
              ))}
            </select>
            <input
              type="text"
              list={`elenco_${eventForm.timeId}`}
              placeholder="Jogador"
              value={eventForm.jogador}
              onChange={(e) => setEventForm({ ...eventForm, jogador: e.target.value })}
              className="px-2 py-1.5 rounded-lg text-xs flex-1 min-w-[7rem]"
              style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            />
            {(() => {
              const time = teams.find((t) => t.id === eventForm.timeId);
              const proprio = time && Array.isArray(time.jogadores) && time.jogadores.length > 0 ? time.jogadores : null;
              const elenco = proprio || (time && ELENCOS_2025[time.nome]);
              if (!elenco) return null;
              return (
                <datalist id={`elenco_${eventForm.timeId}`}>
                  {elenco.map((j, i) => {
                    const rotulo = j.apelido || j.nome;
                    return <option key={j.id || j.numero || i} value={j.numero ? `${rotulo} (${j.numero})` : rotulo} />;
                  })}
                </datalist>
              );
            })()}
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
            >
              + Registrar
            </button>
          </form>

          {(match.eventos || []).length > 0 && (
            <ul className="space-y-1">
              {match.eventos.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-center justify-between text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: COLORS.card, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                >
                  <span>
                    {TIPOS_EVENTO.find((t) => t.value === ev.tipo)?.label} — {ev.jogador} ({ev.timeNome}){" "}
                    {ev.minuto != null && <span style={{ color: COLORS.slate }}>{ev.minuto}'</span>}
                  </span>
                  <button onClick={() => removeEvento(ev.id)} aria-label="Remover evento">
                    <X size={12} color={COLORS.slate} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Organização gerencia (adiciona/remove) jogadores de qualquer time já
// inscrito — protegido pela senha de admin, não pelo código do time.
// Diagnóstico de irregularidades por time, conforme regulamento oficial
// (Capítulo III — mínimo/máximo de atletas e ano de conclusão da turma).
// ---------------------------------------------------------------------------
// Documentos pra imprimir/baixar em PDF — ficha de time e súmula de jogo.
// Usa a caixa de impressão do navegador (sem depender de nenhuma
// biblioteca externa): abre um documento pronto e já chama "Imprimir",
// onde a pessoa escolhe "Salvar como PDF".
// ---------------------------------------------------------------------------
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function abrirImpressao(titulo, corpoHtml) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Seu navegador bloqueou a janela. Permite pop-ups pra baixar o PDF.");
    return;
  }
  win.document.write(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(titulo)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #12203D; padding: 28px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 15px; margin: 20px 0 6px; border-bottom: 2px solid #12203D; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { border: 1px solid #ccc; padding: 5px 8px; font-size: 12px; text-align: left; }
  th { background: #f0f0f0; }
  .secao { page-break-after: always; }
  .secao:last-child { page-break-after: auto; }
  .meta { font-size: 12px; color: #555; margin-bottom: 10px; }
  .imprimir-btn { margin-bottom: 18px; padding: 8px 16px; font-size: 14px; cursor: pointer; }
  @media print { .no-print { display: none; } }
</style>
</head>
<body>
  <button class="imprimir-btn no-print" onclick="window.print()">Imprimir / Salvar como PDF</button>
  ${corpoHtml}
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    try {
      win.print();
    } catch (e) {
      // usuário usa o botão manualmente se o navegador bloquear o print automático
    }
  }, 400);
}

function fichaTimeHtml(team) {
  const jogadores = Array.isArray(team.jogadores) ? team.jogadores : [];
  const valorUnitario = valorPorAtletaNaData(team.inscritoEm);
  const lote = loteNaData(team.inscritoEm);
  const total = jogadores.length * valorUnitario;
  return `
    <div class="secao">
      <h1>Seleção de ${escapeHtml(team.nome)}</h1>
      <div class="meta">Capitão: ${escapeHtml(team.capitao || "—")} · Contato: ${escapeHtml(team.contato || "—")} · ${jogadores.length} jogador(es)</div>
      <table>
        <thead><tr><th>Nº</th><th>Nome completo</th><th>CPF</th><th>Período de estudo</th><th>Ano de conclusão</th></tr></thead>
        <tbody>
          ${jogadores
            .map(
              (j) =>
                `<tr><td>${escapeHtml(j.numero || "—")}</td><td>${escapeHtml(j.nome || "—")}</td><td>${escapeHtml(j.cpf || "—")}</td><td>${escapeHtml(j.periodo || "—")}</td><td>${escapeHtml(j.anoConclusao || "—")}</td></tr>`
            )
            .join("")}
        </tbody>
      </table>
      <div class="meta" style="margin-top:16px; font-size:14px;">
        <strong>Valor da inscrição (${escapeHtml(lote)}):</strong> ${jogadores.length} atleta(s) × ${escapeHtml(formatarReais(valorUnitario))} = <strong>${escapeHtml(formatarReais(total))}</strong>
      </div>
    </div>`;
}

function baixarFichaTime(team) {
  abrirImpressao(`Ficha — ${team.nome}`, fichaTimeHtml(team));
}

function baixarFichaTodosTimes(teams) {
  const corpo = teams.map(fichaTimeHtml).join("");
  abrirImpressao("Fichas de todos os times", corpo);
}

function sumulaHtml(match, teams) {
  const timeA = teams.find((t) => t.id === match.timeA);
  const timeB = teams.find((t) => t.id === match.timeB);
  const linhasTime = (time) =>
    (time && Array.isArray(time.jogadores) ? time.jogadores : [])
      .map(
        (j) =>
          `<tr><td>${escapeHtml(j.numero || "—")}</td><td>${escapeHtml(j.nome || "—")}</td><td></td><td></td><td></td></tr>`
      )
      .join("");
  return `
    <div class="secao">
      <h1>Súmula de Partida</h1>
      <div class="meta">Fase: ${escapeHtml(match.fase || "—")} · Data: ____/____/______ · Horário: ____:____ · Local: Ginásio CSU</div>
      <h2>${escapeHtml(timeA ? timeA.nome : "Time A")}</h2>
      <table>
        <thead><tr><th>Nº</th><th>Nome</th><th>Gol</th><th>Cartão amarelo</th><th>Cartão vermelho</th></tr></thead>
        <tbody>${linhasTime(timeA)}</tbody>
      </table>
      <h2>${escapeHtml(timeB ? timeB.nome : "Time B")}</h2>
      <table>
        <thead><tr><th>Nº</th><th>Nome</th><th>Gol</th><th>Cartão amarelo</th><th>Cartão vermelho</th></tr></thead>
        <tbody>${linhasTime(timeB)}</tbody>
      </table>
      <div class="meta" style="margin-top:24px; font-size:13px;">
        Placar final: _______ &nbsp;x&nbsp; _______<br/><br/>
        Árbitro: _____________________________________ &nbsp;&nbsp; Mesário: _____________________________________
      </div>
    </div>`;
}

function baixarSumula(match, teams) {
  const timeA = teams.find((t) => t.id === match.timeA);
  const timeB = teams.find((t) => t.id === match.timeB);
  const nomeArquivo = `${timeA ? timeA.nome : "TimeA"} x ${timeB ? timeB.nome : "TimeB"}`;
  abrirImpressao(`Súmula — ${nomeArquivo}`, sumulaHtml(match, teams));
}

// Planilha financeira — times ordenados por data de inscrição, com
// quantidade de jogadores, valor a pagar e soma total.
function PlanilhaInscricoes({ teams }) {
  const linhas = [...teams]
    .sort((a, b) => new Date(a.inscritoEm || 0) - new Date(b.inscritoEm || 0))
    .map((t) => {
      const n = Array.isArray(t.jogadores) ? t.jogadores.length : 0;
      const valorUnitario = valorPorAtletaNaData(t.inscritoEm);
      return { ...t, nJogadores: n, lote: loteNaData(t.inscritoEm), valorUnitario, valor: n * valorUnitario };
    });
  const totalGeral = linhas.reduce((acc, t) => acc + t.valor, 0);

  const baixarPlanilha = () => {
    const linhasHtml = linhas
      .map(
        (t, i) => `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(t.nome)}</td>
          <td>${t.inscritoEm ? escapeHtml(new Date(t.inscritoEm).toLocaleString("pt-BR")) : "—"}</td>
          <td>${escapeHtml(t.lote)}</td>
          <td>${t.nJogadores}</td>
          <td>${escapeHtml(formatarReais(t.valorUnitario))}</td>
          <td>${escapeHtml(formatarReais(t.valor))}</td>
        </tr>`
      )
      .join("");
    const corpo = `
      <div class="secao">
        <h1>Planilha de inscrições</h1>
        <div class="meta">${linhas.length} time(s) · valor por atleta conforme o lote (Art. 8º)</div>
        <table>
          <thead><tr><th>#</th><th>Time</th><th>Data de inscrição</th><th>Lote</th><th>Jogadores</th><th>Valor/atleta</th><th>Total</th></tr></thead>
          <tbody>${linhasHtml}</tbody>
        </table>
        <div class="meta" style="margin-top:16px; font-size:15px;">
          <strong>Total geral: ${escapeHtml(formatarReais(totalGeral))}</strong>
        </div>
      </div>`;
    abrirImpressao("Planilha de inscrições", corpo);
  };

  return (
    <div className="rounded-2xl p-5 mt-8" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <h3 className="font-semibold flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
          Planilha de inscrições
        </h3>
        {linhas.length > 0 && (
          <button
            type="button"
            onClick={baixarPlanilha}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
            style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
          >
            <Download size={12} /> Baixar planilha
          </button>
        )}
      </div>
      <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        Por ordem de inscrição · valor por atleta conforme o lote (Art. 8º):{" "}
        {LOTES_INSCRICAO.map((l) => `${l.nome} ${formatarReais(l.valor)}`).join(" · ")}
      </p>
      {linhas.length === 0 ? (
        <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
          Nenhum time inscrito ainda.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
                <th className="text-left py-1.5 pr-3 text-xs uppercase tracking-wide" style={{ color: COLORS.slate }}>
                  Time
                </th>
                <th className="text-left py-1.5 pr-3 text-xs uppercase tracking-wide" style={{ color: COLORS.slate }}>
                  Inscrito em
                </th>
                <th className="text-left py-1.5 pr-3 text-xs uppercase tracking-wide" style={{ color: COLORS.slate }}>
                  Lote
                </th>
                <th className="text-center py-1.5 pr-3 text-xs uppercase tracking-wide" style={{ color: COLORS.slate }}>
                  Jogadores
                </th>
                <th className="text-right py-1.5 text-xs uppercase tracking-wide" style={{ color: COLORS.slate }}>
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((t, i) => (
                <tr key={t.id} style={{ backgroundColor: i % 2 === 0 ? "transparent" : COLORS.zebra }}>
                  <td className="py-2 pr-3" style={{ color: COLORS.ink }}>
                    <span className="flex items-center gap-1.5">
                      {ESCUDOS_TIMES[t.nome] && <img src={ESCUDOS_TIMES[t.nome]} alt="" className="w-4 h-4 object-contain shrink-0" />}
                      {t.nome}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-xs" style={{ color: COLORS.slate, fontFamily: "'JetBrains Mono', monospace" }}>
                    {t.inscritoEm ? new Date(t.inscritoEm).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="py-2 pr-3 text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                    {t.lote}
                  </td>
                  <td className="py-2 pr-3 text-center" style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.ink }}>
                    {t.nJogadores}
                  </td>
                  <td className="py-2 text-right font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.accent }}>
                    {formatarReais(t.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `2px solid ${COLORS.ink}` }}>
                <td className="py-2 pr-3 font-semibold" style={{ color: COLORS.ink }} colSpan={4}>
                  Total geral
                </td>
                <td className="py-2 text-right font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.ink }}>
                  {formatarReais(totalGeral)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function DocumentosOrganizacao({ teams, matches }) {
  return (
    <div className="rounded-2xl p-5 mt-8" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
      <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
        <Download size={18} color={COLORS.ink} /> Documentos pra imprimir
      </h3>
      <p className="text-xs mb-4" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        Abre uma janela pronta pra imprimir — escolhe "Salvar como PDF" na caixa de impressão do
        navegador.
      </p>

      <button
        type="button"
        onClick={() => baixarFichaTodosTimes(teams)}
        disabled={teams.length === 0}
        className="px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 mb-5 disabled:opacity-50"
        style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
      >
        <Download size={14} /> Ficha de todos os times
      </button>

      {teams.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Ficha individual por time
          </div>
          <div className="flex flex-wrap gap-2">
            {teams.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => baixarFichaTime(t)}
                className="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1"
                style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
              >
                <Download size={12} /> {t.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Súmula por confronto
          </div>
          <div className="flex flex-wrap gap-2">
            {matches.map((m) => {
              const timeA = teams.find((t) => t.id === m.timeA);
              const timeB = teams.find((t) => t.id === m.timeB);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => baixarSumula(m, teams)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1"
                  style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                >
                  <Download size={12} /> {timeA ? timeA.nome : "?"} x {timeB ? timeB.nome : "?"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function diagnosticarTime(team) {
  const problemas = [];
  const jogadores = Array.isArray(team.jogadores) ? team.jogadores : [];
  if (jogadores.length > 0 && jogadores.length < MIN_JOGADORES_TIME) {
    problemas.push(`Só ${jogadores.length} jogador(es) — mínimo é ${MIN_JOGADORES_TIME} (Art. 9º).`);
  }
  if (jogadores.length > MAX_JOGADORES_TIME) {
    problemas.push(`${jogadores.length} jogadores — máximo é ${MAX_JOGADORES_TIME} (Art. 9º).`);
  }
  jogadores.forEach((j) => {
    if (!j.excecaoAprovada && anoConclusaoRegular(j.anoConclusao, team.nome) === false) {
      problemas.push(`${j.nome || "Jogador"}: ano de conclusão (${j.anoConclusao}) não bate com a turma ${team.nome} (Art. 9º).`);
    }
  });
  return problemas;
}

function DiagnosticoIrregularidades({ teams }) {
  const times = teams.map((t) => ({ time: t, problemas: diagnosticarTime(t) })).filter((x) => x.problemas.length > 0);

  if (times.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-5 mt-8"
      style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.accent}` }}
    >
      <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
        <AlertTriangle size={18} color={COLORS.accent} /> Diagnóstico de irregularidades ({times.length})
      </h3>
      <p className="text-xs mb-4" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        Checagem automática com base no Regulamento Oficial dos Jogos Ex-Alunos. Confirma com o
        time antes de qualquer punição — Art. 9º dá direito de esclarecimento.
      </p>
      <div className="space-y-3">
        {times.map(({ time, problemas }) => (
          <div key={time.id} className="rounded-lg p-3" style={{ backgroundColor: COLORS.zebra }}>
            <div className="text-sm font-semibold mb-1" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
              {time.nome}
            </div>
            <ul className="space-y-0.5">
              {problemas.map((p, i) => (
                <li key={i} className="text-xs" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
                  • {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function GerenciarElencos({ teams, saveTeams }) {
  const [timeId, setTimeId] = useState("");
  const time = teams.find((t) => t.id === timeId);

  const salvarTime = async (atualizado) => {
    await saveTeams((atuais) => (atuais || []).map((t) => (t.id === atualizado.id ? atualizado : t)));
  };

  return (
    <div
      className="rounded-2xl p-5 mt-8"
      style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
    >
      <h3 className="font-semibold mb-4" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
        Gerenciar jogadores de um time
      </h3>
      <select
        value={timeId}
        onChange={(e) => setTimeId(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm mb-4"
        style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
      >
        <option value="">Selecione um time</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nome}
          </option>
        ))}
      </select>
      {time && <RosterEditor key={time.id} team={time} onSave={salvarTime} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: Cadastro — primeira página, cadastro de pessoa (jogador ou torcedor),
// fica pendente até um organizador aprovar.
// ---------------------------------------------------------------------------
// Pra quem ficou "preso" no meio do cadastro — a conta de login existe
// (por isso conseguiu entrar), mas os dados (nome, turma, WhatsApp etc.)
// nunca chegaram a ser salvos, geralmente porque a confirmação por
// e-mail interrompeu o processo no meio. Termina o cadastro agora que a
// pessoa já está autenticada.
function CompletarPerfil({ sessao, onCompleted }) {
  const [form, setForm] = useState({ nome: "", tipo: "jogador", turma: "", whatsapp: "", nascimento: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nome.trim() || !form.whatsapp.trim() || !form.nascimento || (form.tipo === "jogador" && !form.turma)) {
      setError("Preencha todos os campos" + (form.tipo === "jogador" ? " (inclusive a turma)." : "."));
      return;
    }
    setSaving(true);
    try {
      await criarPerfil(sessao.id, {
        email: sessao.email,
        nome: form.nome.trim(),
        tipo: form.tipo,
        turma: form.tipo === "jogador" ? form.turma : "",
        whatsapp: form.whatsapp.trim(),
        nascimento: form.nascimento,
        status: "pendente",
      });
      onCompleted();
    } catch (err) {
      setSaving(false);
      setError("Erro ao salvar: " + err.message);
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: "100vh" }}>
      <div className="max-w-md mx-auto px-6 py-14 sm:py-20">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={CSU_BADGE_IMG} alt="" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
            Falta pouco pra terminar seu cadastro
          </h1>
          <p className="text-sm mt-2" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Sua conta ({sessao.email}) já existe, mas seus dados ainda não foram salvos —
            provavelmente a confirmação por e-mail interrompeu no meio. Preenche de novo, é
            rapidinho.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              Nome completo
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              Você é
            </label>
            <div className="flex gap-2">
              {[
                { value: "jogador", label: "Jogador" },
                { value: "torcedor", label: "Torcedor" },
              ].map((op) => (
                <button
                  key={op.value}
                  type="button"
                  onClick={() => setForm({ ...form, tipo: op.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: form.tipo === op.value ? COLORS.accent : COLORS.card,
                    color: form.tipo === op.value ? "#FFFFFF" : COLORS.ink,
                    border: `1.5px solid ${form.tipo === op.value ? COLORS.accent : COLORS.border}`,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {form.tipo === "jogador" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                Turma
              </label>
              <select
                value={form.turma}
                onChange={(e) => setForm({ ...form, turma: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
              >
                <option value="">Selecione</option>
                {TURMAS_HISTORICAS_ORDENADAS.map((t) => (
                  <option key={t.turma} value={t.turma}>
                    {t.turma}
                  </option>
                ))}
                <option value="outra">Outra / novo time</option>
              </select>
            </div>
          )}

          {[
            { key: "whatsapp", label: "WhatsApp", type: "text", placeholder: "(00) 00000-0000" },
            { key: "nascimento", label: "Data de nascimento", type: "date", placeholder: "" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}

          {error && (
            <div className="text-sm font-medium" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full px-5 py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Concluir cadastro
          </button>
        </form>
      </div>
    </div>
  );
}

function Cadastro({ onVoltar }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "jogador",
    turma: "",
    whatsapp: "",
    email: "",
    nascimento: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.nome.trim() ||
      !form.whatsapp.trim() ||
      !form.email.trim() ||
      !form.nascimento ||
      !form.senha.trim() ||
      (form.tipo === "jogador" && !form.turma)
    ) {
      setError("Preencha todos os campos" + (form.tipo === "jogador" ? " (inclusive a turma)." : "."));
      return;
    }
    if (form.senha.trim().length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setSaving(true);
    try {
      const user = await cadastrarConta(form.email.trim(), form.senha.trim());
      if (user) {
        await criarPerfil(user.id, {
          email: form.email.trim(),
          nome: form.nome.trim(),
          tipo: form.tipo,
          turma: form.tipo === "jogador" ? form.turma : "",
          whatsapp: form.whatsapp.trim(),
          nascimento: form.nascimento,
          status: "pendente",
        });
      }
      setSaving(false);
      setSent(true);
      setForm({ nome: "", tipo: "jogador", turma: "", whatsapp: "", email: "", nascimento: "", senha: "" });
    } catch (err) {
      setSaving(false);
      setError(err.message === "User already registered" ? "Esse e-mail já tem cadastro — tenta entrar." : "Erro ao cadastrar: " + err.message);
    }
  };

  return (
    <div>
      {onVoltar && (
        <button
          type="button"
          onClick={onVoltar}
          className="text-xs font-semibold mb-4 inline-flex items-center gap-1"
          style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
        >
          ← Voltar para o login
        </button>
      )}
      <SectionLabel eyebrow="Bem-vindo" title="Cadastro" />
      <p className="text-sm mb-6 max-w-xl" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        Preencha seus dados pra participar da Copa. Seu cadastro fica pendente até um
        organizador aprovar.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Nome completo
          </label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Você é
          </label>
          <div className="flex gap-2">
            {[
              { value: "jogador", label: "Jogador" },
              { value: "torcedor", label: "Torcedor" },
            ].map((op) => (
              <button
                key={op.value}
                type="button"
                onClick={() => setForm({ ...form, tipo: op.value })}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: form.tipo === op.value ? COLORS.accent : COLORS.card,
                  color: form.tipo === op.value ? "#FFFFFF" : COLORS.ink,
                  border: `1.5px solid ${form.tipo === op.value ? COLORS.accent : COLORS.border}`,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {form.tipo === "jogador" && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              Turma
            </label>
            <select
              value={form.turma}
              onChange={(e) => setForm({ ...form, turma: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            >
              <option value="">Selecione</option>
              {TURMAS_HISTORICAS_ORDENADAS.map((t) => (
                <option key={t.turma} value={t.turma}>
                  {t.turma}
                </option>
              ))}
              <option value="outra">Outra / novo time</option>
            </select>
          </div>
        )}

        {[
          { key: "whatsapp", label: "WhatsApp", type: "text", placeholder: "(00) 00000-0000" },
          { key: "email", label: "E-mail", type: "email", placeholder: "voce@email.com" },
          { key: "nascimento", label: "Data de nascimento", type: "date", placeholder: "" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              {f.label}
            </label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Senha
          </label>
          <PasswordInput
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {error && (
          <div className="text-sm font-medium" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-60"
          style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Enviar cadastro
        </button>

        {sent && (
          <div
            className="text-sm font-medium px-4 py-3 rounded-xl mt-2"
            style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Check size={16} /> Conta criada. Se o Supabase pedir confirmação por e-mail, confirma
              antes de entrar. Você já pode fazer login normalmente — se for representar um
              time, seu acesso à Inscrição fica pendente até um organizador aprovar.
            </div>
            {onVoltar && (
              <button type="button" onClick={onVoltar} className="text-sm font-semibold underline">
                Voltar para o login
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: Sorteio — monta os potes conforme Art. 13 do regulamento (pote 1 =
// melhores colocados da última edição, pote 5 = times novos) e sorteia os
// grupos. Só admin sorteia; todo mundo vê o resultado.
// ---------------------------------------------------------------------------
// Monta os potes só com quem já está inscrito, na ordem do ranking da
// última edição — times novos (fora do ranking) sempre por último. Os
// potes vão se preenchendo em blocos do tamanho do número de grupos, à
// medida que times forem se inscrevendo (não deixa "buraco" esperando
// alguém que ainda não se inscreveu).
function montarPotes(teams, numGrupos) {
  const comPosicao = teams.map((t) => {
    const pos = RANKING_ULTIMA_EDICAO.indexOf(t.nome);
    return { time: t, pos: pos === -1 ? Infinity : pos };
  });
  const ordenados = comPosicao.sort((a, b) => a.pos - b.pos).map((x) => x.time);

  const potes = [];
  for (let i = 0; i < ordenados.length; i += numGrupos) {
    potes.push(ordenados.slice(i, i + numGrupos));
  }
  return potes.length > 0 ? potes : [[]];
}

function sugerirNumGrupos(totalTimes) {
  if (totalTimes <= 4) return 1;
  return Math.max(1, Math.round(totalTimes / 4));
}

function sortearGrupos(potes, numGrupos) {
  const nomesGrupo = Array.from({ length: numGrupos }, (_, i) => String.fromCharCode(65 + i)); // A, B, C...
  const grupos = {};
  nomesGrupo.forEach((g) => (grupos[g] = []));
  const nomeCampeao = HALL_DA_FAMA.campeoes[HALL_DA_FAMA.campeoes.length - 1]?.turma;

  potes.forEach((pote, potIdx) => {
    let restante = [...pote];

    // Regra do sorteio: o campeão da última edição é sempre o cabeça de
    // chave do Grupo A (só vale pro pote 1, onde ele está).
    if (potIdx === 0 && nomesGrupo.includes("A")) {
      const campeao = restante.find((t) => t.nome === nomeCampeao);
      if (campeao) {
        grupos.A.push(campeao);
        restante = restante.filter((t) => t.id !== campeao.id);
      }
    }

    const embaralhado = restante.sort(() => Math.random() - 0.5);
    const gruposComVaga = nomesGrupo.filter((g) => grupos[g].length <= potIdx);
    embaralhado.forEach((time, i) => {
      const alvo = gruposComVaga[i % gruposComVaga.length] || nomesGrupo[i % nomesGrupo.length];
      grupos[alvo].push(time);
    });
  });
  return grupos;
}

// Gera a tabela de jogos (todos-contra-todos dentro de cada grupo) a
// partir do resultado do sorteio.
// Método do círculo — divide os confrontos de um grupo em rodadas de
// verdade: rodada 1 é todo mundo jogando uma vez, e assim por diante até
// todos terem se enfrentado. Se o grupo tiver número ímpar de times, um
// fica de folga (bye) em cada rodada.
function gerarRodadasGrupo(times) {
  const lista = [...times];
  if (lista.length % 2 !== 0) lista.push(null); // bye
  const n = lista.length;
  if (n < 2) return [];
  const rodadas = [];
  const copia = [...lista];
  for (let r = 0; r < n - 1; r++) {
    const confrontos = [];
    for (let i = 0; i < n / 2; i++) {
      const a = copia[i];
      const b = copia[n - 1 - i];
      if (a && b) confrontos.push([a, b]);
    }
    rodadas.push(confrontos);
    copia.splice(1, 0, copia.pop());
  }
  return rodadas;
}

function gerarJogosDosGrupos(grupos) {
  const jogos = [];
  Object.entries(grupos).forEach(([nomeGrupo, times]) => {
    const rodadas = gerarRodadasGrupo(times);
    rodadas.forEach((confrontos, idxRodada) => {
      confrontos.forEach(([timeA, timeB], idxJogo) => {
        jogos.push({
          id: `jogo_${Date.now()}_${nomeGrupo}_${idxRodada}_${idxJogo}_${Math.random().toString(36).slice(2, 6)}`,
          fase: `Grupo ${nomeGrupo}`,
          rodada: idxRodada + 1,
          timeA: timeA.id,
          timeB: timeB.id,
          golsA: null,
          golsB: null,
          status: "agendado",
          tempoAtual: 1,
          tempoIniciadoEm: null,
          tempoAcumuladoMs: 0,
          eventos: [],
          horario: null,
        });
      });
    });
  });
  return jogos;
}

// Agenda os horários de todos os jogos, na ordem em que já estão: jogos
// da fase de grupos entram sexta às 19h (8 jogos) e continuam sábado às
// 8h; jogos de mata-mata entram domingo às 8h. 25min entre um início e
// outro (20min de jogo + 5min de intervalo).
function agendarHorarios(listaJogos) {
  const grupos = listaJogos.filter((m) => (m.fase || "").startsWith("Grupo"));
  const mataMata = listaJogos.filter((m) => !(m.fase || "").startsWith("Grupo"));

  const comHorarioGrupos = grupos.map((m, i) => {
    const slot = i < JOGOS_SEXTA ? i : JOGOS_SEXTA + (i - JOGOS_SEXTA);
    const base = i < JOGOS_SEXTA ? INICIO_SEXTA : INICIO_SABADO;
    const offsetSlots = i < JOGOS_SEXTA ? i : i - JOGOS_SEXTA;
    const horario = new Date(base.getTime() + offsetSlots * DURACAO_SLOT_MIN * 60000);
    return { ...m, horario: horario.toISOString() };
  });

  const comHorarioMataMata = mataMata.map((m, i) => {
    const horario = new Date(INICIO_DOMINGO.getTime() + i * DURACAO_SLOT_MIN * 60000);
    return { ...m, horario: horario.toISOString() };
  });

  return [...comHorarioGrupos, ...comHorarioMataMata];
}

function formatarHorarioJogo(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dias[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1} · ${hh}:${mm}`;
}

// ---------------------------------------------------------------------------
// Mata-mata automático — classificação geral (todos os grupos juntos),
// avanço de fase sozinho a partir dos resultados. Nada disso é lançado à
// mão: assim que os jogos de grupo terminam, gera quartas com o
// cruzamento 1º x 8º, 2º x 7º, 3º x 6º, 4º x 5º; e vai gerando semifinal,
// final e disputa de 3º lugar conforme os jogos anteriores terminam.
// ---------------------------------------------------------------------------
function pontosPartida(jogos, teams) {
  const tabela = {};
  teams.forEach((t) => {
    tabela[t.id] = { id: t.id, nome: t.nome, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 };
  });
  jogos.forEach((m) => {
    if (m.golsA == null || m.golsB == null || m.golsA === "" || m.golsB === "") return;
    const a = tabela[m.timeA];
    const b = tabela[m.timeB];
    if (!a || !b) return;
    const ga = Number(m.golsA);
    const gb = Number(m.golsB);
    a.j += 1;
    b.j += 1;
    a.gp += ga;
    a.gc += gb;
    b.gp += gb;
    b.gc += ga;
    if (ga > gb) {
      a.v += 1;
      a.pts += 3;
      b.d += 1;
    } else if (gb > ga) {
      b.v += 1;
      b.pts += 3;
      a.d += 1;
    } else {
      a.e += 1;
      b.e += 1;
      a.pts += 1;
      b.pts += 1;
    }
  });
  return Object.values(tabela).sort((x, y) => y.pts - x.pts || y.gp - y.gc - (x.gp - x.gc) || y.gp - x.gp);
}

// Classificação geral — todos os times, contando só os jogos da fase de
// grupos (não mistura com mata-mata).
function calcularClassificacaoGeral(matches, teams) {
  return pontosPartida(matches.filter((m) => (m.fase || "").startsWith("Grupo")), teams);
}

function jogoDecidido(m) {
  return m.golsA != null && m.golsB != null && m.golsA !== "" && m.golsB !== "" && Number(m.golsA) !== Number(m.golsB);
}

function vencedorJogo(m) {
  if (!jogoDecidido(m)) return null;
  return Number(m.golsA) > Number(m.golsB) ? m.timeA : m.timeB;
}

function perdedorJogo(m) {
  if (!jogoDecidido(m)) return null;
  return Number(m.golsA) > Number(m.golsB) ? m.timeB : m.timeA;
}

function novoJogoVazio(id, fase, timeA, timeB) {
  return {
    id,
    fase,
    timeA,
    timeB,
    golsA: null,
    golsB: null,
    status: "agendado",
    tempoAtual: 1,
    tempoIniciadoEm: null,
    tempoAcumuladoMs: 0,
    eventos: [],
    horario: null,
  };
}

// Roda a cada atualização de placar — gera a próxima fase sozinho quando
// a fase anterior estiver 100% decidida, sem precisar de ação manual.
function gerarMataMataAutomatico(matches, teams) {
  let novos = [...matches];
  const temFase = (prefixo) => novos.some((m) => (m.fase || "").startsWith(prefixo));

  const jogosGrupo = novos.filter((m) => (m.fase || "").startsWith("Grupo"));
  const gruposCompletos = jogosGrupo.length > 0 && jogosGrupo.every((m) => jogoDecidido(m));

  if (gruposCompletos && !temFase("Quartas")) {
    const geral = calcularClassificacaoGeral(novos, teams).slice(0, 8);
    if (geral.length === 8) {
      const pares = [
        [0, 7],
        [3, 4],
        [1, 6],
        [2, 5],
      ];
      const quartas = pares.map(([i, j], idx) => novoJogoVazio(`jogo_qf${idx}_${Date.now()}`, "Quartas", geral[i].id, geral[j].id));
      novos = agendarHorarios([...novos, ...quartas]);
    }
  }

  const quartas = novos.filter((m) => (m.fase || "") === "Quartas");
  if (quartas.length === 4 && quartas.every(jogoDecidido) && !temFase("Semifinal")) {
    const v = quartas.map(vencedorJogo);
    const semis = [
      novoJogoVazio(`jogo_sf0_${Date.now()}`, "Semifinal", v[0], v[1]),
      novoJogoVazio(`jogo_sf1_${Date.now()}`, "Semifinal", v[2], v[3]),
    ];
    novos = agendarHorarios([...novos, ...semis]);
  }

  const semis = novos.filter((m) => (m.fase || "") === "Semifinal");
  if (semis.length === 2 && semis.every(jogoDecidido) && !temFase("Final")) {
    const vencedores = semis.map(vencedorJogo);
    const perdedores = semis.map(perdedorJogo);
    const final = novoJogoVazio(`jogo_final_${Date.now()}`, "Final", vencedores[0], vencedores[1]);
    const terceiro = novoJogoVazio(`jogo_3lugar_${Date.now()}`, "3º Lugar", perdedores[0], perdedores[1]);
    novos = agendarHorarios([...novos, final, terceiro]);
  }

  return novos;
}

function Sorteio({ teams, sorteio, saveSorteio, matches, saveMatches, sessao }) {
  const souSuperAdmin = sessao && sessao.tipo === "admin" && sessao.superAdmin;
  const [numGrupos, setNumGrupos] = useState(4);
  const potesSugeridos = useMemo(() => montarPotes(teams, numGrupos), [teams, numGrupos]);
  const [atribuicoes, setAtribuicoes] = useState({}); // teamId -> índice do pote (0-based)

  // Toda vez que o número de grupos mudar (ou times mudarem), recomeça a
  // sugestão automática — o super admin pode ajustar time por time depois.
  // O número de potes nunca é editado à parte — ele é sempre recalculado
  // a partir de quantos times realmente têm atribuição, pra nunca sobrar
  // um pote "vazio demais" que esconda time sem querer.
  useEffect(() => {
    const mapa = {};
    potesSugeridos.forEach((pote, i) => pote.forEach((t) => (mapa[t.id] = i)));
    setAtribuicoes(mapa);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numGrupos, teams.length]);

  const numPotes = useMemo(() => {
    const maiorIndice = Object.values(atribuicoes).reduce((max, i) => Math.max(max, i), -1);
    return Math.max(potesSugeridos.length, maiorIndice + 1, 1);
  }, [atribuicoes, potesSugeridos.length]);

  const potes = useMemo(() => {
    const lista = Array.from({ length: numPotes }, () => []);
    teams.forEach((t) => {
      const idx = atribuicoes[t.id] ?? 0;
      lista[idx].push(t);
    });
    return lista;
  }, [teams, atribuicoes, numPotes]);

  const moverTimeDePote = (teamId, novoPote) => {
    setAtribuicoes((atual) => ({ ...atual, [teamId]: novoPote }));
  };

  const realizarSorteio = async () => {
    const grupos = sortearGrupos(potes, numGrupos);
    await saveSorteio({ grupos, numGrupos, sorteadoEm: new Date().toISOString() });
  };

  const [gerandoTabela, setGerandoTabela] = useState(false);
  const jaTemJogosDeGrupo = matches.some((m) => (m.fase || "").startsWith("Grupo"));

  const gerarTabela = async () => {
    if (!sorteio || !sorteio.grupos) return;
    if (jaTemJogosDeGrupo && !confirm("Já existem jogos de fase de grupos lançados. Gerar de novo vai ADICIONAR outra rodada completa (não apaga a antiga). Quer continuar?")) {
      return;
    }
    setGerandoTabela(true);
    const novosJogos = gerarJogosDosGrupos(sorteio.grupos);
    const todosComHorario = agendarHorarios([...matches, ...novosJogos]);
    await saveMatches(todosComHorario);
    setGerandoTabela(false);
  };

  return (
    <div>
      <SectionLabel eyebrow="Rumo à VIII Copa" title="Sorteio dos grupos" />
      <p className="text-sm mb-4 max-w-xl" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
        Os potes seguem o ranking formado a partir da última edição. Times novos entram sempre
        no último pote.
      </p>

      {souSuperAdmin && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              Grupos
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={numGrupos}
              onChange={(e) => setNumGrupos(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 px-2 py-1.5 rounded-lg text-sm text-center"
              style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <span className="text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            {teams.length} times inscritos · {numPotes} pote(s)
          </span>
        </div>
      )}

      <div className="grid sm:grid-cols-5 gap-3 mb-8">
        {potes.map((pote, i) => (
          <div key={i} className="rounded-xl p-3" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
              Pote {i + 1}
            </div>
            {pote.length === 0 ? (
              <div className="text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                Vazio
              </div>
            ) : (
              <ul className="space-y-1.5">
                {pote.map((t) => (
                  <li key={t.id} className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                    {ESCUDOS_TIMES[t.nome] && <img src={ESCUDOS_TIMES[t.nome]} alt="" className="w-4 h-4 object-contain shrink-0" />}
                    <span className="truncate flex-1">{t.nome}</span>
                    {souSuperAdmin && (
                      <select
                        value={i}
                        onChange={(e) => moverTimeDePote(t.id, Number(e.target.value))}
                        className="text-[10px] px-1 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, border: `1px solid ${COLORS.border}` }}
                      >
                        {Array.from({ length: numPotes + 1 }, (_, p) => (
                          <option key={p} value={p}>
                            {p + 1}
                          </option>
                        ))}
                      </select>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div
        className="rounded-xl px-4 py-3.5 mb-8"
        style={{ backgroundColor: COLORS.accentSoft }}
      >
        <div className="text-sm font-semibold mb-1" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          O sorteio dos grupos será feito presencialmente
        </div>
        <p className="text-xs" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
          Data e local ainda serão definidos, com direito de presença do público e dos
          representantes de cada time. Essa aba serve só pra deixar os potes organizados até
          lá — assim que o sorteio acontecer, os grupos são atualizados aqui.
        </p>
      </div>

      {sorteio && sorteio.grupos && (
        <div>
          <SectionLabel eyebrow="Resultado" title="Grupos sorteados" />
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(sorteio.grupos).map(([nome, times]) => (
              <div key={nome} className="rounded-xl p-4" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <div className="text-sm font-bold mb-2" style={{ color: COLORS.ink, fontFamily: "'Sora', sans-serif" }}>
                  Grupo {nome}
                </div>
                <ul className="space-y-1.5">
                  {times.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
                      {ESCUDOS_TIMES[t.nome] && <img src={ESCUDOS_TIMES[t.nome]} alt="" className="w-5 h-5 object-contain shrink-0" />}
                      {t.nome}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {souSuperAdmin && (
            <button
              type="button"
              onClick={gerarTabela}
              disabled={gerandoTabela}
              className="px-5 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 mt-6 disabled:opacity-50"
              style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
            >
              {gerandoTabela && <Loader2 size={16} className="animate-spin" />}
              Gerar tabela de jogos (todos-contra-todos + horários)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const SUPER_ADMIN_EMAIL = "csuexalunos@gmail.com";

// ---------------------------------------------------------------------------
// Portão de entrada — ninguém acessa o resto do app sem login. Quem ainda
// não tem conta cai no Cadastro (que fica pendente até um organizador
// aprovar); admins também entram por aqui com o e-mail/senha deles.
// ---------------------------------------------------------------------------
function LoginGate({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setErro("");
    setEntrando(true);
    try {
      const user = await entrarConta(email.trim(), senha.trim());
      if (!user) {
        setErro("E-mail ou senha incorretos.");
        setEntrando(false);
        return;
      }

      const statusAdmin = await souAdmin(user.id);
      if (statusAdmin.admin) {
        onLogin({ id: user.id, email: user.email, nome: user.email, tipo: "admin", superAdmin: statusAdmin.superAdmin });
        return;
      }

      // Login não exige aprovação — só a aba de Inscrição (representante)
      // e a de Organização (admin) são restritas.
      const perfil = await buscarPerfil(user.id);
      onLogin({
        id: user.id,
        email: user.email,
        nome: (perfil && perfil.nome) || user.email,
        tipo: "usuario",
        representanteAprovado: !!(perfil && perfil.status === "aprovado"),
        turma: (perfil && perfil.turma) || "",
        temPerfil: !!perfil,
      });
    } catch (err) {
      console.error("Erro ao entrar:", err);
      setErro(
        err.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : err.message === "Email not confirmed"
          ? "Confirma seu e-mail antes de entrar (verifica a caixa de entrada)."
          : "Erro ao entrar: " + err.message
      );
      setEntrando(false);
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
      `}</style>
      <div className="max-w-md mx-auto px-6 py-14 sm:py-20">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={CSU_BADGE_IMG} alt="Santa Úrsula Jogos Ex-Alunos" className="w-20 h-20 object-contain mb-3" />
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink, letterSpacing: "-0.01em" }}
          >
            Copa de Ex-Alunos de Futsal
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Colégio Santa Úrsula · 8ª edição
          </p>
        </div>

        {modo === "cadastro" ? (
          <Cadastro onVoltar={() => setModo("login")} />
        ) : (
          <>
            <form
              onSubmit={entrar}
              className="rounded-2xl p-6 space-y-3"
              style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                  style={{ backgroundColor: COLORS.surface, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
                  Senha
                </label>
                <PasswordInput
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  style={{ backgroundColor: COLORS.surface, border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {erro && (
                <div className="text-sm" style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}>
                  {erro}
                </div>
              )}

              <button
                type="button"
                onClick={entrar}
                disabled={entrando}
                className="w-full px-4 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
              >
                {entrando ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setErro("");
                setModo("cadastro");
              }}
              className="w-full text-center mt-4 text-sm font-semibold"
              style={{ color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
            >
              Ainda não tem conta? Quero entrar — cadastre-se
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Organizacao({ teams, matches, saveMatches, saveTeams, adminRequests, saveAdminRequests, sessao, config, saveConfig, avaliacoes, saveAvaliacoes }) {
  const souAdminLogado = sessao && sessao.tipo === "admin";
  const souSuperAdmin = souAdminLogado && sessao.superAdmin;

  const [perfis, setPerfis] = useState([]);
  const [listaAdmins, setListaAdmins] = useState([]);
  const [carregandoPainel, setCarregandoPainel] = useState(true);
  const [acessos, setAcessos] = useState(null);

  useEffect(() => {
    if (!souAdminLogado) return;
    let cancelado = false;
    contarAcessos()
      .then((n) => {
        if (!cancelado) setAcessos(n);
      })
      .catch((e) => console.error("Falha ao contar acessos", e));
    return () => {
      cancelado = true;
    };
  }, [souAdminLogado]);
  const jaMarcouVistoRef = React.useRef(false);

  useEffect(() => {
    if (!souAdminLogado) return;
    let cancelado = false;
    const carregar = async () => {
      try {
        const [p, a] = await Promise.all([listarPerfis(), listarAdmins()]);
        if (!cancelado) {
          setPerfis(p);
          setListaAdmins(a);
          setCarregandoPainel(false);

          // Marca como "visto" alguns segundos depois de abrir a página —
          // dá tempo da pessoa reparar no selinho "Novo" antes dele sumir.
          // Só faz isso uma vez por sessão aberta, pra quem chegar depois
          // (durante a mesma sessão) continuar aparecendo como novo.
          if (!jaMarcouVistoRef.current) {
            jaMarcouVistoRef.current = true;
            const naoVistos = p.filter((x) => x.status !== "aprovado" && !x.visualizado);
            if (naoVistos.length > 0) {
              setTimeout(async () => {
                try {
                  await Promise.all(naoVistos.map((x) => atualizarPerfil(x.id, { visualizado: true })));
                  setPerfis((atual) => atual.map((x) => (naoVistos.some((n) => n.id === x.id) ? { ...x, visualizado: true } : x)));
                } catch (e) {
                  console.error("Falha ao marcar inscritos como vistos", e);
                }
              }, 4000);
            }
          }
        }
      } catch (e) {
        console.error("Falha ao carregar painel de organização", e);
        if (!cancelado) setCarregandoPainel(false);
      }
    };
    carregar();
    const id = setInterval(carregar, 8000);
    return () => {
      cancelado = true;
      clearInterval(id);
    };
  }, [souAdminLogado]);

  const [reqNome, setReqNome] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqMotivo, setReqMotivo] = useState("");
  const [reqEnviado, setReqEnviado] = useState(false);
  const [ultimaSenhaGerada, setUltimaSenhaGerada] = useState(null);

  const [matchForm, setMatchForm] = useState({ fase: "Oitavas", timeA: "", timeB: "", golsA: "", golsB: "" });
  const [linkTransmissao, setLinkTransmissao] = useState((config && config.linkTransmissao) || "");

  const salvarLinkTransmissao = async (e) => {
    e.preventDefault();
    await saveConfig({ ...config, linkTransmissao: linkTransmissao.trim() });
  };

  const enviarSolicitacao = async (e) => {
    e.preventDefault();
    if (!reqNome.trim() || !reqEmail.trim()) return;
    const nova = {
      id: `req_${Date.now()}`,
      nome: reqNome.trim(),
      email: reqEmail.trim(),
      motivo: reqMotivo.trim(),
      status: "pendente",
      criadoEm: new Date().toISOString(),
    };
    await saveAdminRequests([...adminRequests, nova]);
    setReqNome("");
    setReqEmail("");
    setReqMotivo("");
    setReqEnviado(true);
  };

  const aprovarSolicitacao = async (req) => {
    const alvo = perfis.find((p) => (p.email || "").trim().toLowerCase() === req.email.trim().toLowerCase());
    if (!alvo) {
      alert("Essa pessoa ainda não criou conta pelo Cadastro do site — peça pra ela se cadastrar primeiro.");
      return;
    }
    await promoverParaAdmin(alvo.id, alvo.email);
    await saveAdminRequests(adminRequests.map((r) => (r.id === req.id ? { ...r, status: "aprovado" } : r)));
    setListaAdmins(await listarAdmins());
    setUltimaSenhaGerada(null);
  };

  const [emailNovoAdmin, setEmailNovoAdmin] = useState("");
  const [promovendo, setPromovendo] = useState(false);

  const [criandoTeste, setCriandoTeste] = useState(false);
  const temDadosTeste = teams.some((t) => t.teste) || matches.some((m) => m.teste);

  const criarAmbienteTeste = async () => {
    if (
      !confirm(
        'Isso cria 8 times fictícios (marcados como TESTE) — o resto do fluxo (Sorteio, gerar tabela, lançar placar) você faz igual seria numa competição de verdade. Continuar?'
      )
    )
      return;
    setCriandoTeste(true);
    try {
      const agora = Date.now();
      const timesTeste = Array.from({ length: 8 }, (_, i) => {
        const n = i + 1;
        const jogadores = Array.from({ length: 8 }, (_, j) => ({
          id: `jteste_${agora}_${n}_${j}`,
          numero: String(j + 1),
          apelido: `Jog. ${j + 1}`,
          nome: `Jogador Teste ${n}-${j + 1}`,
          periodo: "",
          anoConclusao: "",
          cpf: "",
          nascimento: "",
          posicao: "",
        }));
        return {
          id: `time_teste_${agora}_${n}`,
          nome: `Teste ${n}`,
          capitao: `Capitão Teste ${n}`,
          contato: "(00) 00000-0000",
          jogadores,
          escudoUrl: "",
          codigo: gerarCodigoTime(),
          inscritoEm: new Date().toISOString(),
          teste: true,
        };
      });

      // Busca a lista de times DIRETO do banco (não confia no que já está
      // carregado na tela) — evita salvar por cima uma lista desatualizada
      // e apagar time de verdade sem querer.
      await saveTeams((atuais) => [...(atuais || []), ...timesTeste]);
      alert('8 times de teste criados. Agora segue o fluxo normal: vai em Sorteio, sorteia os grupos, gera a tabela, e depois lança os jogos na Organização.');
    } catch (e) {
      console.error("Falha ao criar ambiente de teste", e);
      alert("Deu erro ao criar o ambiente de teste: " + e.message);
    } finally {
      setCriandoTeste(false);
    }
  };

  const revogarTeste = async () => {
    if (!confirm("Isso remove TODOS os times e jogos marcados como teste (não mexe em nada real). Continuar?")) return;
    await saveTeams((atuais) => (atuais || []).filter((t) => !t.teste));
    await saveMatches((atuais) => (atuais || []).filter((m) => !m.teste));
  };

  const promoverDireto = async (e) => {
    e.preventDefault();
    const alvo = perfis.find((p) => (p.email || "").trim().toLowerCase() === emailNovoAdmin.trim().toLowerCase());
    if (!alvo) {
      alert("Não achei essa pessoa cadastrada no app com esse e-mail. Ela precisa ter feito o Cadastro primeiro.");
      return;
    }
    if (listaAdmins.some((a) => (a.email || "").trim().toLowerCase() === alvo.email.trim().toLowerCase())) {
      alert("Essa pessoa já é admin.");
      return;
    }
    setPromovendo(true);
    try {
      await promoverParaAdmin(alvo.id, alvo.email);
      setListaAdmins(await listarAdmins());
      setEmailNovoAdmin("");
      alert(`${alvo.nome || alvo.email} agora é admin.`);
    } catch (err) {
      console.error("Falha ao promover admin:", err);
      alert("Não consegui tornar essa pessoa admin: " + err.message);
    } finally {
      setPromovendo(false);
    }
  };

  const recusarSolicitacao = async (req) => {
    await saveAdminRequests(adminRequests.map((r) => (r.id === req.id ? { ...r, status: "recusado" } : r)));
  };

  const [turmaEdicao, setTurmaEdicao] = useState({});
  const [novoTimeModo, setNovoTimeModo] = useState({});

  const aprovarUsuario = async (p) => {
    const turmaEscolhida = (turmaEdicao[p.id] ?? p.turma ?? "").trim();
    const agora = new Date().toISOString();
    try {
      await atualizarPerfil(p.id, { status: "aprovado", turma: turmaEscolhida, aprovado_em: agora });
      setPerfis(perfis.map((x) => (x.id === p.id ? { ...x, status: "aprovado", turma: turmaEscolhida, aprovado_em: agora } : x)));
    } catch (err) {
      console.error("Falha ao tornar representante:", err);
      alert("Não consegui tornar essa pessoa representante: " + err.message);
    }
  };

  const recusarUsuario = async (p) => {
    try {
      await atualizarPerfil(p.id, { status: "recusado" });
      setPerfis(perfis.map((x) => (x.id === p.id ? { ...x, status: "recusado" } : x)));
    } catch (err) {
      console.error("Falha ao recusar:", err);
      alert("Não consegui recusar: " + err.message);
    }
  };

  const revogarAcesso = async (p) => {
    if (!confirm(`Revogar o acesso de representante de "${p.nome || p.email}"? Ela precisa ser aprovada de novo pra voltar a editar o time.`)) return;
    try {
      await atualizarPerfil(p.id, { status: "pendente" });
      setPerfis(perfis.map((x) => (x.id === p.id ? { ...x, status: "pendente" } : x)));
    } catch (err) {
      console.error("Falha ao revogar acesso:", err);
      alert("Não consegui revogar o acesso: " + err.message);
    }
  };

  const aprovarExcecao = async (caso) => {
    await saveTeams((atuais) =>
      (atuais || []).map((t) => {
        if (t.nome !== caso.timeNome) return t;
        const jogadoresAtualizados = (t.jogadores || []).map((j) =>
          j.id === caso.jogadorId ? { ...j, excecaoAprovada: true, avaliacaoPendente: false } : j
        );
        return { ...t, jogadores: jogadoresAtualizados };
      })
    );
    await saveAvaliacoes(avaliacoes.map((a) => (a.id === caso.id ? { ...a, status: "aprovada" } : a)));
  };

  const manterIrregularidade = async (caso) => {
    // Mantida a irregularidade = jogador sai do time. A quantidade de
    // jogadores (e o valor da inscrição, calculado a partir dela) já
    // atualiza sozinha em todo lugar, porque é sempre recalculada a
    // partir do time.jogadores — não precisa mexer em mais nada.
    await saveTeams((atuais) =>
      (atuais || []).map((t) => {
        if (t.nome !== caso.timeNome) return t;
        return { ...t, jogadores: (t.jogadores || []).filter((j) => j.id !== caso.jogadorId) };
      })
    );
    await saveAvaliacoes(avaliacoes.map((a) => (a.id === caso.id ? { ...a, status: "mantida" } : a)));
  };

  const addMatch = async (e) => {
    e.preventDefault();
    if (!matchForm.timeA || !matchForm.timeB) return;
    const novo = {
      id: `jogo_${Date.now()}`,
      fase: matchForm.fase,
      timeA: matchForm.timeA,
      timeB: matchForm.timeB,
      golsA: matchForm.golsA === "" ? null : Number(matchForm.golsA),
      golsB: matchForm.golsB === "" ? null : Number(matchForm.golsB),
      status: "agendado",
      tempoAtual: 1,
      tempoIniciadoEm: null,
      tempoAcumuladoMs: 0,
      eventos: [],
    };
    await saveMatches([...matches, novo]);
    setMatchForm({ fase: matchForm.fase, timeA: "", timeB: "", golsA: "", golsB: "" });
  };

  const updateMatch = async (updated) => {
    const atualizado = matches.map((m) => (m.id === updated.id ? updated : m));
    const comMataMata = gerarMataMataAutomatico(atualizado, teams);
    await saveMatches(comMataMata);
  };

  const removeMatch = async (id) => {
    await saveMatches(matches.filter((m) => m.id !== id));
  };

  const moverJogo = async (id, direcao) => {
    const idx = matches.findIndex((m) => m.id === id);
    const novoIdx = idx + direcao;
    if (idx === -1 || novoIdx < 0 || novoIdx >= matches.length) return;
    const copia = [...matches];
    [copia[idx], copia[novoIdx]] = [copia[novoIdx], copia[idx]];
    await saveMatches(copia);
  };

  const [reagendando, setReagendando] = useState(false);
  const reagendarHorarios = async () => {
    setReagendando(true);
    await saveMatches(agendarHorarios(matches));
    setReagendando(false);
  };

  if (!souAdminLogado) {
    return (
      <div>
        <SectionLabel eyebrow="Restrito" title="Área da organização" />
        <div
          className="max-w-sm rounded-2xl p-6 mb-6"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock size={18} color={COLORS.ink} />
            <span style={{ color: COLORS.ink, fontFamily: "'Inter', sans-serif" }} className="text-sm font-medium">
              Só organizadores têm acesso
            </span>
          </div>
          <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Sua conta está logada, mas não como organizador. Se você deveria ter acesso, peça pra
            um admin já existente te aprovar abaixo.
          </p>
        </div>

        <div className="max-w-sm">
          {reqEnviado ? (
            <div
              className="text-sm px-4 py-3 rounded-xl"
              style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accent, fontFamily: "'Inter', sans-serif" }}
            >
              Solicitação enviada. Aguarde aprovação.
            </div>
          ) : (
            <details>
              <summary
                className="text-xs font-semibold uppercase tracking-wide cursor-pointer"
                style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
              >
                Quer ajudar a organizar? Solicite acesso
              </summary>
              <form onSubmit={enviarSolicitacao} className="mt-3 space-y-2">
                <input
                  type="text"
                  value={reqNome}
                  onChange={(e) => setReqNome(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
                />
                <input
                  type="email"
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  placeholder="Seu e-mail (o mesmo do cadastro)"
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
                />
                <input
                  type="text"
                  value={reqMotivo}
                  onChange={(e) => setReqMotivo(e.target.value)}
                  placeholder="Por que quer ajudar (opcional)"
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
                >
                  Enviar solicitação
                </button>
              </form>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionLabel eyebrow="Painel" title="Organização" />
        <div className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
          <Unlock size={14} /> liberado
        </div>
      </div>

      <div
        className="rounded-2xl p-5 mb-8"
        style={{ backgroundColor: "#3A1E00", border: `1.5px dashed ${COLORS.gold}` }}
      >
        <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.gold }}>
          <AlertTriangle size={16} color={COLORS.gold} /> Ambiente de teste
        </h3>
        <p className="text-xs mb-3" style={{ color: COLORS.ice, fontFamily: "'Inter', sans-serif" }}>
          Cria 8 times fictícios com jogadores, marcados como TESTE. Daí é só seguir o fluxo
          normal, do começo: Sorteio → gerar tabela → lançar os jogos — igual seria de verdade.
          Aparece pra quem estiver no app na hora (é o banco de verdade), então revoga quando
          terminar.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={criarAmbienteTeste}
            disabled={criandoTeste}
            className="px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
            style={{ backgroundColor: COLORS.gold, color: "#3A1E00", fontFamily: "'Inter', sans-serif" }}
          >
            {criandoTeste && <Loader2 size={14} className="animate-spin" />}
            Criar ambiente de teste completo
          </button>
          {temDadosTeste && (
            <button
              type="button"
              onClick={revogarTeste}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
            >
              Revogar teste
            </button>
          )}
        </div>
      </div>

      <div
        className="rounded-2xl p-5 mb-8"
        style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
      >
        <h3 className="font-semibold mb-1" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
          Representantes ({perfis.filter((p) => p.status === "aprovado").length})
        </h3>
        <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
          Quem já tem acesso à aba de Inscrição, travado na turma de cada um. Revogar tira o
          acesso na hora.
        </p>
        {carregandoPainel ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            <Loader2 size={14} className="animate-spin" /> Carregando...
          </div>
        ) : perfis.filter((p) => p.status === "aprovado").length === 0 ? (
          <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Ninguém é representante ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {perfis
              .filter((p) => p.status === "aprovado")
              .sort((a, b) => {
                const anoA = Math.min(...(anosDaTurma(a.turma).length ? anosDaTurma(a.turma) : [9999]));
                const anoB = Math.min(...(anosDaTurma(b.turma).length ? anosDaTurma(b.turma) : [9999]));
                return anoA - anoB;
              })
              .map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium break-words">{p.nome}</div>
                    <div className="text-xs break-words" style={{ color: COLORS.slate }}>
                      turma <strong>{p.turma || "não definida"}</strong> · {p.email}
                      {p.whatsapp && ` · ${p.whatsapp}`}
                      {p.aprovado_em && ` · aprovado em ${new Date(p.aprovado_em).toLocaleDateString("pt-BR")}`}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {linkWhatsapp(p.whatsapp) && (
                      <a
                        href={linkWhatsapp(p.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 inline-flex items-center gap-1.5"
                        style={{ backgroundColor: "#25D366", color: "#052E16", fontFamily: "'Inter', sans-serif" }}
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => revogarAcesso(p)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
                      style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
                    >
                      Revogar acesso
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div
        className="rounded-2xl p-5 mb-8"
        style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
      >
        <h3 className="font-semibold mb-1" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
          Inscritos no app ({perfis.filter((p) => p.status !== "aprovado").length})
        </h3>
        <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
          Quem se cadastrou mas ainda não é representante. Tornar representante libera a aba de
          Inscrição, travada na turma escolhida.
        </p>
        {carregandoPainel ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            <Loader2 size={14} className="animate-spin" /> Carregando...
          </div>
        ) : perfis.filter((p) => p.status !== "aprovado").length === 0 ? (
          <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Ninguém nessa situação no momento.
          </p>
        ) : (
          <ul className="space-y-2">
            {perfis
              .filter((p) => p.status !== "aprovado")
              .sort((a, b) => new Date(b.criado_em || 0) - new Date(a.criado_em || 0))
              .map((p) => {
                const ehNovo = !p.visualizado;
                return (
                  <li
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm px-3 py-2.5 rounded-lg"
                    style={{
                      backgroundColor: COLORS.zebra,
                      color: COLORS.ink,
                      fontFamily: "'Inter', sans-serif",
                      border: ehNovo ? `1.5px solid ${COLORS.accent}` : "1.5px solid transparent",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium break-words flex items-center gap-1.5">
                        {p.nome}
                        {ehNovo && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                            style={{ backgroundColor: COLORS.accent, color: "#FFFFFF" }}
                          >
                            Novo
                          </span>
                        )}
                      </div>
                      <div className="text-xs break-words" style={{ color: COLORS.slate }}>
                        {p.tipo === "jogador" ? "jogador" : "torcedor"} · turma{" "}
                        <strong>{p.turma || turmaEdicao[p.id] || "não definida"}</strong> · {p.email} ·{" "}
                        {p.status === "recusado" ? "recusado" : "pendente"}
                        {p.criado_em && ` · cadastrado em ${new Date(p.criado_em).toLocaleDateString("pt-BR")}`}
                      </div>
                    </div>
                  <div className="flex flex-wrap gap-2">
                    {novoTimeModo[p.id] ? (
                      <input
                        type="text"
                        autoFocus
                        value={turmaEdicao[p.id] ?? ""}
                        onChange={(e) => setTurmaEdicao({ ...turmaEdicao, [p.id]: e.target.value })}
                        placeholder="Nome do novo time"
                        className="px-2 py-1.5 rounded-lg text-xs flex-1 min-w-[8rem]"
                        style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
                      />
                    ) : (
                      <select
                        value={turmaEdicao[p.id] ?? p.turma ?? ""}
                        onChange={(e) => {
                          if (e.target.value === "__novo__") {
                            setNovoTimeModo({ ...novoTimeModo, [p.id]: true });
                            setTurmaEdicao({ ...turmaEdicao, [p.id]: "" });
                          } else {
                            setTurmaEdicao({ ...turmaEdicao, [p.id]: e.target.value });
                          }
                        }}
                        className="px-2 py-1.5 rounded-lg text-xs flex-1 min-w-[8rem]"
                        style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
                      >
                        <option value="">Turma não definida</option>
                        {TURMAS_HISTORICAS_ORDENADAS.map((t) => (
                          <option key={t.turma} value={t.turma}>
                            {t.turma}
                          </option>
                        ))}
                        <option value="__novo__">Outra / novo time</option>
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={() => aprovarUsuario(p)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
                      style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
                    >
                      Tornar representante
                    </button>
                  </div>
                </li>
                );
              })}
          </ul>
        )}
      </div>

      {avaliacoes.filter((a) => a.status === "pendente").length > 0 && (
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.accent}` }}
        >
          <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
            <AlertTriangle size={16} color={COLORS.accent} /> Casos pra avaliação da comissão ({avaliacoes.filter((a) => a.status === "pendente").length})
          </h3>
          <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            O representante pediu revisão de um jogador marcado como irregular — Art. 9º dá
            direito a esse esclarecimento antes de qualquer punição. "Aprovar exceção" libera o
            jogador; "Manter irregularidade" <strong>remove ele do time</strong> (o representante
            pode corrigir e adicionar de novo depois).
          </p>
          <ul className="space-y-2">
            {avaliacoes
              .filter((a) => a.status === "pendente")
              .map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-2 text-sm px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                >
                  <div className="break-words">
                    <div className="font-medium">{a.jogadorApelido || a.jogadorNome || "Jogador"}</div>
                    <div className="text-xs" style={{ color: COLORS.slate }}>
                      Time {a.timeNome} · ano de conclusão {a.anoConclusao || "—"} não bate com a turma
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => aprovarExcecao(a)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "#16A34A", color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
                    >
                      Aprovar exceção
                    </button>
                    <button
                      type="button"
                      onClick={() => manterIrregularidade(a)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
                    >
                      Manter irregularidade
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {souSuperAdmin && (
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <h3 className="font-semibold mb-1" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
            Tornar alguém admin
          </h3>
          <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Digite o e-mail de alguém que já se cadastrou no app pra dar acesso total de
            organizador direto, sem precisar passar por solicitação. Só você vê isto.
          </p>
          <form onSubmit={promoverDireto} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={emailNovoAdmin}
              onChange={(e) => setEmailNovoAdmin(e.target.value)}
              placeholder="email@exemplo.com"
              className="flex-1 px-3 py-2 rounded-xl text-sm min-w-0"
              style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            />
            <button
              type="button"
              onClick={promoverDireto}
              disabled={promovendo}
              className="px-4 py-2 rounded-xl text-sm font-semibold shrink-0 w-full sm:w-auto disabled:opacity-60"
              style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
            >
              {promovendo ? "Tornando admin..." : "Tornar admin"}
            </button>
          </form>
        </div>
      )}

      {souSuperAdmin && adminRequests.filter((r) => r.status === "pendente").length > 0 && (
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <h3 className="font-semibold mb-3" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
            Solicitações para virar organizador ({adminRequests.filter((r) => r.status === "pendente").length})
          </h3>
          <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Só você vê e aprova isto.
          </p>
          <ul className="space-y-2">
            {adminRequests
              .filter((r) => r.status === "pendente")
              .map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg"
                  style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                >
                  <span className="flex-1 min-w-0 truncate">
                    {r.nome} — {r.email} {r.motivo && `— ${r.motivo}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => aprovarSolicitacao(r)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold shrink-0"
                    style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => recusarSolicitacao(r)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold shrink-0"
                    style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
                  >
                    Recusar
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {ultimaSenhaGerada && (
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ backgroundColor: COLORS.card, border: `1.5px solid ${COLORS.accent}` }}
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
            <ShieldCheck size={16} color={COLORS.accent} /> Senha temporária gerada
          </h3>
          <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Repassa pra pessoa por fora do app agora — ela não fica guardada em texto puro em
            lugar nenhum, então só aparece aqui uma vez.
          </p>
          <div
            className="text-sm px-3 py-2 rounded-lg flex items-center justify-between gap-3"
            style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span>
              {ultimaSenhaGerada.email}: <strong>{ultimaSenhaGerada.senha}</strong>
            </span>
            <button type="button" onClick={() => setUltimaSenhaGerada(null)} aria-label="Fechar">
              <X size={14} color={COLORS.slate} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-xl">
        <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
            <Radio size={16} color={COLORS.accent} /> Link de transmissão ao vivo
          </h3>
          <form onSubmit={salvarLinkTransmissao} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={linkTransmissao}
              onChange={(e) => setLinkTransmissao(e.target.value)}
              placeholder="https://youtube.com/... ou instagram.com/..."
              className="flex-1 px-3 py-2 rounded-xl text-sm min-w-0"
              style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold shrink-0 w-full sm:w-auto"
              style={{ backgroundColor: COLORS.navy, color: COLORS.gold, fontFamily: "'Inter', sans-serif" }}
            >
              Salvar
            </button>
          </form>
          <p className="text-xs mt-2" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Aparece em destaque na página inicial pra todo mundo assistir fácil.
          </p>
        </div>

        {/* Jogo avulso — só pra mata-mata; a fase de grupos vem do Sorteio */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <h3 className="font-semibold mb-1" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
            Adicionar jogo do mata-mata
          </h3>
          <p className="text-xs mb-4" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Grupos, quartas, semifinal, 3º lugar e final são gerados sozinhos conforme os
            resultados vão saindo (a classificação geral define quem cruza com quem: 1º x 8º, 2º x
            7º, 3º x 6º, 4º x 5º). Use este formulário só como exceção — por exemplo, se precisar
            de uma fase extra de "Oitavas" antes das quartas.
          </p>
          <form onSubmit={addMatch} className="space-y-3">
            <select
              value={matchForm.fase}
              onChange={(e) => setMatchForm({ ...matchForm, fase: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-sm"
              style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            >
              {["Oitavas", "Quartas", "Semifinal", "3º Lugar", "Final"].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={matchForm.timeA}
                onChange={(e) => setMatchForm({ ...matchForm, timeA: e.target.value })}
                className="px-3 py-2 rounded-xl text-sm"
                style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
              >
                <option value="">Time A</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
              <select
                value={matchForm.timeB}
                onChange={(e) => setMatchForm({ ...matchForm, timeB: e.target.value })}
                className="px-3 py-2 rounded-xl text-sm"
                style={{ backgroundColor: COLORS.card, color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
              >
                <option value="">Time B</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5"
              style={{ backgroundColor: COLORS.accent, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
            >
              <Plus size={15} /> Adicionar jogo
            </button>
            <button
              type="button"
              onClick={reagendarHorarios}
              disabled={matches.length === 0 || reagendando}
              className="px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
              style={{ color: COLORS.ink, border: `1.5px solid ${COLORS.border}`, fontFamily: "'Inter', sans-serif" }}
            >
              {reagendando && <Loader2 size={14} className="animate-spin" />}
              Reagendar horários (sexta/sábado/domingo)
            </button>
          </form>

          <div className="mt-5 space-y-2 max-h-96 overflow-y-auto">
            {matches.map((m, i) => (
              <MatchAdminRow
                key={m.id}
                match={m}
                teams={teams}
                onUpdate={updateMatch}
                onRemove={() => removeMatch(m.id)}
                onMover={(dir) => moverJogo(m.id, dir)}
                podeSubir={i > 0}
                podeDescer={i < matches.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {(() => {
        const suspensos = calcularSuspensos(matches);
        return suspensos.length > 0 ? (
          <div
            className="rounded-2xl p-5 mt-8"
            style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
              <Lock size={16} color={COLORS.accent} /> Suspensos
            </h3>
            <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
              3 cartões amarelos ou 1 vermelho = suspenso no próximo jogo (Art. 27).
              Ajusto isso quando você mandar as regras oficiais do campeonato.
            </p>
            <ul className="space-y-1.5">
              {suspensos.map((s) => (
                <li
                  key={`${s.jogador}|${s.timeNome}`}
                  className="text-sm px-3 py-2 rounded-lg"
                  style={{ backgroundColor: COLORS.zebra, color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}
                >
                  <strong>{s.jogador}</strong> ({s.timeNome}) — {s.motivos.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        ) : null;
      })()}

      <GerenciarElencos teams={teams} saveTeams={saveTeams} />
      <DiagnosticoIrregularidades teams={teams} />
      <PlanilhaInscricoes teams={teams} />
      <DocumentosOrganizacao teams={teams} matches={matches} />

      <div
        className="rounded-2xl p-5 mt-8"
        style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
          <ShieldCheck size={18} color={COLORS.ink} /> Times inscritos e contatos
        </h3>
        {teams.length === 0 ? (
          <p className="text-sm" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
            Nenhum time inscrito ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              <thead>
                <tr style={{ color: COLORS.slate }}>
                  <th className="text-left py-1.5 pr-4 text-xs uppercase tracking-wide">Time</th>
                  <th className="text-left py-1.5 pr-4 text-xs uppercase tracking-wide">Capitão</th>
                  <th className="text-left py-1.5 text-xs uppercase tracking-wide">Contato</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.id} style={{ color: COLORS.ink }}>
                    <td className="py-1.5 pr-4">{t.nome}</td>
                    <td className="py-1.5 pr-4">{t.capitao}</td>
                    <td className="py-1.5">{t.contato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        className="rounded-2xl p-5 mt-8"
        style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
      >
        <h3 className="font-semibold mb-1" style={{ fontFamily: "'Sora', sans-serif", color: COLORS.ink }}>
          Métricas do app
        </h3>
        <p className="text-xs mb-3" style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}>
          Total de vezes que o app foi aberto (não é visitante único, é toda vez que alguém entra).
        </p>
        <div className="text-3xl font-bold" style={{ color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace" }}>
          {acessos === null ? "—" : acessos.toLocaleString("pt-BR")}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// APP
// ---------------------------------------------------------------------------
const TABS = [
  { id: "inicio", label: "Início", icon: Trophy },
  { id: "inscricao", label: "Inscrição", icon: Users },
  { id: "sorteio", label: "Sorteio", icon: Dices },
  { id: "chaveamento", label: "Jogos ao Vivo", icon: Swords },
  { id: "classificacao", label: "Classificação", icon: ListOrdered },
  { id: "comunidade", label: "Fotos e Vídeos", icon: Camera },
  { id: "galeria", label: "Galeria", icon: Award },
  { id: "organizacao", label: "Organização", icon: ShieldCheck },
];

export default function App() {
  const [tab, setTab] = useState("inicio");
  const [sessao, setSessao] = useState(null);
  const [checandoSessao, setCheckandoSessao] = useState(true);
  const [teams, saveTeams, loadingTeams] = useSharedStorage("copasu:teams", [], 7000);
  const [matches, saveMatches, loadingMatches] = useSharedStorage("copasu:matches", [], 5000);
  const [posts, savePosts, loadingPosts] = useSharedStorage("copasu:community", [], 6000);
  const [adminRequests, saveAdminRequests, loadingAdminRequests] = useSharedStorage("copasu:admin_requests", [], 8000);
  const [sorteio, saveSorteio, loadingSorteio] = useSharedStorage("copasu:sorteio", {}, 6000);
  const [config, saveConfig, loadingConfig] = useSharedStorage("copasu:config", {}, 10000);
  const [avaliacoes, saveAvaliacoes, loadingAvaliacoes] = useSharedStorage("copasu:avaliacoes", [], 8000);
  const [totalPessoas, setTotalPessoas] = useState(0);
  const acessoRegistradoRef = React.useRef(false);
  const [fabBusy, setFabBusy] = useState(false);
  const [fabDone, setFabDone] = useState(false);
  const fabInputRef = React.useRef(null);

  const loading =
    loadingTeams || loadingMatches || loadingPosts || loadingAdminRequests || loadingSorteio || loadingConfig || loadingAvaliacoes || checandoSessao;

  // Registra 1 acesso por abertura do app — só uma vez por sessão aberta.
  useEffect(() => {
    if (acessoRegistradoRef.current) return;
    acessoRegistradoRef.current = true;
    registrarAcesso().catch((e) => console.error("Falha ao registrar acesso", e));
  }, []);

  // Contagem pública de pessoas cadastradas — atualiza sozinha de tempos
  // em tempos, igual o resto dos dados compartilhados.
  useEffect(() => {
    let cancelado = false;
    const buscar = () => {
      contarPessoasInscritas()
        .then((n) => {
          if (!cancelado) setTotalPessoas(n);
        })
        .catch((e) => console.error("Falha ao contar pessoas inscritas", e));
    };
    buscar();
    const id = setInterval(buscar, 15000);
    return () => {
      cancelado = true;
      clearInterval(id);
    };
  }, []);

  // Monta a sessão a partir do usuário autenticado (Supabase Auth) — cobre
  // tanto o login recém-feito quanto a sessão que já estava guardada no
  // navegador (por isso agora o login sobrevive a recarregar a página).
  const montarSessao = useCallback(async (user) => {
    if (!user) {
      setSessao(null);
      return;
    }
    try {
      const statusAdmin = await souAdmin(user.id);
      if (statusAdmin.admin) {
        setSessao({ id: user.id, email: user.email, nome: user.email, tipo: "admin", superAdmin: statusAdmin.superAdmin });
        return;
      }
      const perfil = await buscarPerfil(user.id);
      setSessao({
        id: user.id,
        email: user.email,
        nome: (perfil && perfil.nome) || user.email,
        tipo: "usuario",
        representanteAprovado: !!(perfil && perfil.status === "aprovado"),
        turma: (perfil && perfil.turma) || "",
        temPerfil: !!perfil,
      });
    } catch (e) {
      console.error("Falha ao montar sessão", e);
      setSessao(null);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const user = await sessaoAtual();
      if (!cancelado) {
        await montarSessao(user);
        setCheckandoSessao(false);
      }
    })();
    const cancelarInscricao = aoMudarSessao((user) => {
      montarSessao(user);
    });
    return () => {
      cancelado = true;
      cancelarInscricao();
    };
  }, [montarSessao]);

  const handleFabCapture = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setFabBusy(true);
    try {
      const blob = await compressImageToBlob(file);
      const url = await subirArquivo(blob, file.name || "foto.jpg", "image/jpeg");
      const novo = {
        id: `post_${Date.now()}`,
        ano: EDICOES_DISPONIVEIS[0],
        fotoUrl: url,
        videoUrl: "",
        legenda: "",
        criadoEm: new Date().toISOString(),
      };
      await savePosts([...posts, novo]);
      setFabDone(true);
      setTimeout(() => setFabDone(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setFabBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: COLORS.bg, minHeight: "100vh" }} className="flex items-center justify-center">
        <Loader2 size={22} className="animate-spin" color={COLORS.ink} />
      </div>
    );
  }

  if (!sessao) {
    return <LoginGate onLogin={setSessao} />;
  }

  if (sessao.tipo === "usuario" && !sessao.temPerfil) {
    return (
      <CompletarPerfil
        sessao={sessao}
        onCompleted={() => setSessao({ ...sessao, temPerfil: true })}
      />
    );
  }

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
      `}</style>

      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5"
        style={{ backgroundColor: "rgba(11,15,28,0.85)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px]"
            style={{ backgroundColor: COLORS.surfaceAlt, color: COLORS.gold, fontFamily: "'Sora', sans-serif", border: `1px solid ${COLORS.border}` }}
          >
            {EDITION_ROMAN}
          </div>
          <span
            className="text-sm font-bold hidden sm:block"
            style={{ color: COLORS.ink, fontFamily: "'Sora', sans-serif", letterSpacing: "-0.01em" }}
          >
            Copa Santa Úrsula
          </span>
        </div>
        <nav className="flex gap-1 overflow-x-auto items-center">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: active ? COLORS.accent : "transparent",
                  color: active ? "#FFFFFF" : COLORS.slate,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Icon size={13} color={active ? "#FFFFFF" : COLORS.accent} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
          <button
            onClick={async () => {
              await sairConta();
              setSessao(null);
            }}
            title="Sair"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium ml-1 shrink-0"
            style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
          >
            <Lock size={13} />
          </button>
        </nav>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={22} className="animate-spin" color={COLORS.ink} />
          </div>
        ) : (
          <>
            {tab === "inicio" && <Home teams={teams} matches={matches} setTab={setTab} config={config} totalPessoas={totalPessoas} />}
            {tab === "inscricao" && (
              <Inscricao teams={teams} saveTeams={saveTeams} sessao={sessao} avaliacoes={avaliacoes} saveAvaliacoes={saveAvaliacoes} />
            )}
            {tab === "sorteio" && (
              <Sorteio teams={teams} sorteio={sorteio} saveSorteio={saveSorteio} matches={matches} saveMatches={saveMatches} sessao={sessao} />
            )}
            {tab === "chaveamento" && (
              <Chaveamento matches={matches} teams={teams} sessao={sessao} saveMatches={saveMatches} />
            )}
            {tab === "classificacao" && <Classificacao matches={matches} teams={teams} />}
            {tab === "comunidade" && <Comunidade posts={posts} savePosts={savePosts} />}
            {tab === "galeria" && <Galeria />}
            {tab === "organizacao" && (
              <Organizacao
                teams={teams}
                matches={matches}
                saveMatches={saveMatches}
                saveTeams={saveTeams}
                adminRequests={adminRequests}
                saveAdminRequests={saveAdminRequests}
                sessao={sessao}
                config={config}
                saveConfig={saveConfig}
                avaliacoes={avaliacoes}
                saveAvaliacoes={saveAvaliacoes}
              />
            )}
          </>
        )}
      </main>

      <footer
        className="text-center text-xs py-6"
        style={{ color: COLORS.slate, fontFamily: "'Inter', sans-serif" }}
      >
        Copa de Ex-Alunos de Futsal · Colégio Santa Úrsula
      </footer>

      {/* Botão de câmera fixo — acessível na maioria das abas, um toque tira
          a foto e já publica na Comunidade. Escondido na Organização, onde
          ele ficava sobrepondo os controles administrativos. */}
      <input
        ref={fabInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFabCapture}
      />
      {tab !== "organizacao" && (
        <button
          type="button"
          onClick={() => fabInputRef.current && fabInputRef.current.click()}
          disabled={fabBusy}
          className="fixed bottom-5 right-5 z-30 w-16 h-16 rounded-full flex items-center justify-center disabled:opacity-70"
          style={{
            backgroundColor: fabDone ? "#16A34A" : COLORS.accent,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
          aria-label="Tirar foto rápida"
        >
          {fabBusy ? (
            <Loader2 size={26} color="#FFFFFF" className="animate-spin" />
          ) : fabDone ? (
            <Check size={26} color="#FFFFFF" />
          ) : (
            <Camera size={26} color="#FFFFFF" />
          )}
        </button>
      )}
    </div>
  );
}
