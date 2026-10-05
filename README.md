# 📚 Super Admin — School Management System  
### Plataforma de Administração Global para Ecossistemas de Gestão Escolar

Este repositório contém o **Super Admin** do sistema de gestão escolar, uma plataforma responsável por administrar, monitorar e configurar todas as operações que envolvem:

- Plataforma dos **professores**
- Plataforma dos **estudantes**
- Plataforma dos **encarregados de educação**
- Módulos internos (turmas, cursos, avaliações, matrículas, estatísticas, permissões, relatórios, etc.)

O Super Admin é a camada **máxima de controle**, responsável por gestão avançada, estatísticas globais, dashboards administrativos, criação e sincronização de usuários, permissões e configurações do ecossistema completo.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **Vite** — Ferramenta de build ultrarrápida
- **React.js** — Biblioteca para interfaces modernas
- **TypeScript** — Segurança tipada e melhor escalabilidade
- **TailwindCSS** — Estilização rápida e otimizada
- **HTML5**
- **CSS3**

---

## 🏆 Principais Funcionalidades

### 🔐 Gestão de Acessos
- Criação de contas de administradores
- Gestão de permissões e níveis de acesso
- Autenticação segura
- Reset de senha e recuperações

### 🏫 Gestão Escolar Avançada
- Criar e administrar escolas, centros e departamentos
- Gestão de anos letivos, turmas e cursos
- Sincronização com plataformas externas do ecossistema

### 👩‍🏫 Professores
- Criar contas
- Atribuir disciplinas
- Ver estatísticas de desempenho
- Ativar/desativar perfis

### 👨‍🎓 Estudantes
- Matrículas e renovação
- Consulta de progresso
- Gestão de dados pessoais e acadêmicos

### 👨‍👩‍👧 Encarregados de Educação
- Associação de estudantes
- Monitoramento de atividades escolares
- Gestão de perfis e permissões

### 📊 Dashboard e Estatísticas
- Visualizações dinâmicas
- Gráficos de desempenho institucional
- Relatórios automáticos

### ⚙️ Ferramentas Avançadas
- Logs de atividade
- Automação de processos
- Configurações globais da plataforma

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
| :--- | :--- | :--- |
| `VITE_SCHOOL_API_URL` | URL base da API backend (Yhanko School API) | `https://school-api-production-a1c6.up.railway.app` |
| `PORT` | Porta local mapeada no Docker Compose | `3005` |

---

## 📦 Uso e Instalação Local

```bash
# 1. Clonar o repositório
git clone https://github.com/yhankotech/school-super-admin.git
cd school-super-admin

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Compilar para produção
npm run build
```

---

## 🐳 Execução com Docker & Docker Compose

A imagem Docker foi projetada para alta performance, segurança não-root (UID 101) e leitura dinâmica de variáveis de ambiente em runtime via Nginx.

### 1. Iniciar com Docker Compose (Recomendado)

```bash
# Subir container em background
docker compose up -d --build

# Visualizar logs em tempo real
docker compose logs -f

# Parar serviços
docker compose down
```

O painel estará disponível em: `http://localhost:3005`

### 2. Build e Execução Manual com Docker

```bash
# Build da imagem
docker build -t school-super-admin:latest .

# Executar com URL de API customizada em runtime
docker run -d \
  -p 3005:8080 \
  -e VITE_SCHOOL_API_URL=https://school-api-production-a1c6.up.railway.app \
  --name school-super-admin-frontend \
  school-super-admin:latest
```

### 3. Verificação de Saúde (Healthcheck)

```bash
# Endpoint nativo sem ruído de logs
curl http://localhost:3005/healthz
# Retorno esperado: healthy
```
