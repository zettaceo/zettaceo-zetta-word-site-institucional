# ZETTA WORD - Site Institucional Premium

## Overview
Site institucional estático para ZETTA WORD - empresa de tecnologia financeira híbrida (Web3 + Fiat).

## Stack
- HTML5, CSS3, JavaScript puro
- Sem frameworks, bundlers ou dependências
- Deploy estático (Vercel compatível)

## Estrutura
```
/index.html              - Página principal (com Roadmap, Parceiros, Missão/Visão)
/zetta.html              - One-Page com auditoria Cyberscope e visão geral
/whitepaper.html         - Página do Whitepaper (11 seções) - estilo editorial dourado
/whitepaper-print.html   - Versão para impressão/PDF
/tokenomics.html         - Página de Tokenomics - estilo fintech/dashboard moderno
/tokenomics-print.html   - Tokenomics PDF premium
/technical.html          - Documentação Técnica - estilo blueprint/purple tech
/technical-print.html    - Documento técnico PDF premium
/bot/
  zion.py                - Bot ZION Super (Telegram + API chat + IA avançada)
/scripts/
  chat-widget.js         - Widget de chat flutuante
/privacy.html            - Política de Privacidade
/terms.html              - Termos de Uso
/styles/main.css         - CSS mobile-first premium
/scripts/app.js          - Menu mobile, scroll, animações, sistema solar
/assets/
  /logo-z.svg            - Logo Z animada (otimizada mobile)
  /icons/                - Ícones SVG customizados
  /og-image.png          - Imagem para compartilhamento social (1200x630)
  /ZETTA-Whitepaper-v1.pdf - Whitepaper em PDF para download
  /zion-avatar.jpg       - Avatar do robô ZION (cyan neon)
/vercel.json             - Configuração Vercel + CSP headers
/sitemap.xml             - Sitemap SEO
/robots.txt              - Robots
/server.py               - Servidor local (dev)
/backup_20251213/        - Backup dos arquivos originais
```

## Servidor Local
```bash
python server.py  # Porta 5000
```

## Token ZETTA (Z)
- Rede: BSC (Binance Smart Chain)
- Padrão: BEP-20
- Contrato: 0x8aacc38933007ec530c552007e210b4667749df1
- Supply: 1B inicial → 500M após queima
- Decimais: 18
- Auditoria: Cyberscope (Nov 2024)
  - 0 vulnerabilidades críticas
  - 0 vulnerabilidades médias
  - 14 informativas

## Correções Aplicadas (Auditoria 13/12/2025)
1. MetaMask image path corrigido + validação de rede Ethereum
2. Rate limiting no botão "Adicionar à MetaMask"
3. Focus trap no menu mobile (acessibilidade)
4. Sistema solar usando getBoundingClientRect() para posicionar planetas
5. CSS com fallbacks para navegadores antigos
6. Orbits usando clamp() para transições suaves
7. Ecosystem grid com 3 colunas em tablets (768px+)
8. Transitions melhoradas nos botões
9. Logo SVG otimizada (filtros pesados removidos)
10. sitemap.xml criado
11. OG image/Twitter image configuradas (PNG)
12. CSP headers corrigidos no vercel.json
13. Card de auditoria Cyberscope destacado na seção Segurança
14. Animação de partículas em toda a página (fixed fullscreen)
15. Estrelas cadentes com cauda longa e brilhante a cada 5 segundos

## Ecossistema (23 produtos)
1. Z-BANCK
2. ZION IA
3. Blockchain ZETTA
4. Obelisk-Z Wallet
5. ZETTA Launchpad (Z-PAD)
6. ZETTA Pay
7. ZETTA Earn
8. ZETTA Bridge
9. ZETTA Swap
10. ZETTA Labs
11. ZETTA Academy
12. ZETTA ID
13. ZETTA Passport
14. ZETTA Cloud
15. ZETTA Terminal
16. ZETTA Market
17. ZETTA Verify
18. ZETTA Scan
19. ZETTA Analytics
20. ZETTA Governance
21. ZETTA Builder
22. ZETTA Enterprise
23. ZETTA Hub

## Sistema Solar Gravitacional
- Núcleo Z central com glow pulsante
- 3 órbitas girando (60s, 90s, 120s)
- 17 planetas clicáveis com labels no hover
- Responsivo: usa getBoundingClientRect() para calcular posições

## Breakpoints
- Mobile: < 480px (grid 1 coluna)
- Tablet: 480px+ (grid 2 colunas)
- Tablet+: 768px+ (grid 3 colunas)
- Desktop: 900px+ (grid 4 colunas)
- Large: 1200px+ (grid 6 colunas)

## Cores
- Primary: #00d4ff (cyan neon)
- Secondary: #0066ff (blue)
- Accent: #c9a955 (gold)
- Background: #000000

## ZION Super Bot (Atualizado 13/12/2025)

### Comandos Telegram
- /start - Boas-vindas com botões interativos
- /help - Lista de comandos
- /price - Preço atual do token (DexScreener API)
- /chart - Links para gráficos (DexScreener, GeckoTerminal, BSCScan)
- /contract - Endereço do contrato copiável
- /audit - Informações da auditoria Cyberscope
- /roadmap - Roadmap 2024-2025
- /faq - FAQ interativo com botões
- /level - Sistema de níveis/XP do usuário

### Recursos Avançados
1. **Anti-Spam com IA**: Detecção de spam usando GPT-4o-mini + padrões
2. **Rate Limiting**: 5 msgs/10s por usuário
3. **Flood Protection**: 15 msgs/60s → mute temporário
4. **Sistema XP/Níveis**: 1 XP por mensagem, títulos de Novato a Lenda
5. **Boas-vindas Avançadas**: Multilíngue (PT/EN/ES) + 10 XP bônus
6. **FAQ Inteligente**: Respostas automáticas para perguntas comuns
7. **Histórico de Conversa**: Contexto mantido para respostas mais relevantes
8. **Análise de Sentimento**: Monitoramento do humor da comunidade
9. **Relatórios de Moderação**: API /api/moderation/stats

### API Endpoints (porta 3001)
- POST /api/chat - Chat com IA (widget do site)
- GET /api/price - Preço atual do token
- GET /api/faq - Dados do FAQ
- GET /api/moderation/stats - Estatísticas de moderação + sentimento
- GET /api/health - Status do bot

## Sistema de Internacionalização (i18n) Premium
- 16 idiomas suportados para alcance global
- Seletor premium no header (estilo Binance)
- Detecção automática do idioma do navegador
- Persistência no localStorage
- Suporte a RTL para árabe

### Idiomas Suportados
| Região | Idiomas |
|--------|---------|
| Américas | Português, English, Español |
| Europa | English, Français, Deutsch, Italiano, Русский |
| Oriente Médio/África | العربية, Français, Türkçe |
| Ásia-Pacífico | 中文, 日本語, 한국어, हिन्दी, Bahasa Indonesia, Tiếng Việt, ไทย |

### Arquivos i18n
- `/scripts/i18n/translations.js` - Todas as traduções
- `/scripts/i18n.js` - Sistema de gerenciamento

## GitHub
- Repositório: https://github.com/zettaceo/zetta-official-docs
- Link adicionado na seção Segurança do site

## Nota
Para compartilhamento social funcionar corretamente, é necessário criar o arquivo `/assets/og-image.png` (1200x630px) com a logo ZETTA.
