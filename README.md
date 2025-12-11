# 🥗 Whis Diet - Assistente de Dieta

Seu assistente pessoal para controle de dieta, calorias e hidratação. Um aplicativo PWA (Progressive Web App) completo e pronto para publicação na Play Store.

## 🚀 Funcionalidades

### 📊 Dashboard Completo
- Controle diário de calorias com meta personalizada
- Rastreamento de consumo de água
- Visualização de progresso em tempo real
- Lista de refeições do dia

### 📸 Análise de Fotos
- Upload de fotos de comida
- Sugestão automática de nome e calorias
- Interface intuitiva para adicionar refeições

### ⏰ Lembretes Automáticos
- Lembretes de refeições em horários otimizados:
  - Café da manhã: 07:00
  - Lanche da manhã: 10:00
  - Almoço: 12:30
  - Lanche da tarde: 16:00
  - Jantar: 19:30
- Lembretes de água a cada 2 horas (8h às 22h)
- Notificações do navegador

### 🎤 Comandos de Voz
- "Comi [nome da comida] com [número] calorias"
- "Tomar água"
- "Estatísticas"

### 💾 Armazenamento Local
- Dados salvos no navegador
- Reset automático diário
- Histórico de refeições

## 📱 PWA - Progressive Web App

O app é um PWA completo, o que significa:
- ✅ Funciona offline (com Service Worker)
- ✅ Pode ser instalado no celular
- ✅ Notificações push
- ✅ Interface otimizada para mobile
- ✅ Pronto para Play Store

## 🛠️ Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## 📱 Preparação para Play Store

### 1. Gerar Ícones

Você precisa criar os seguintes ícones:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

Use um gerador de ícones PWA ou crie manualmente.

### 2. Screenshots

Adicione screenshots do app em:
- `public/screenshot1.png` (540x720 pixels para mobile)

### 3. Build e Deploy

1. Execute `npm run build`
2. Faça deploy da pasta `dist/` em um servidor HTTPS
3. Teste o PWA instalando no celular
4. Use ferramentas como [PWABuilder](https://www.pwabuilder.com/) para gerar APK para Play Store

### 4. Conversão para APK

Use uma das seguintes ferramentas:
- **PWABuilder** (Microsoft) - https://www.pwabuilder.com/
- **Bubble** - https://bubble.io/
- **Capacitor** (Ionic) - Para converter em app nativo

## 🎯 Como Usar

1. **Adicionar Refeição:**
   - Clique em "+ Adicionar Refeição"
   - Faça upload de uma foto (opcional)
   - A IA sugere nome e calorias
   - Ajuste se necessário e adicione

2. **Registrar Água:**
   - Clique no botão "+ Adicionar Copo" no card de água

3. **Definir Metas:**
   - Use comandos de voz ou ajuste manualmente
   - Meta padrão: 2000 kcal e 8 copos de água

4. **Ver Progresso:**
   - Dashboard mostra estatísticas em tempo real
   - Barras de progresso visuais
   - Lista de refeições do dia

## 🔧 Tecnologias

- React 18
- Vite
- PWA (Service Worker, Manifest)
- LocalStorage para persistência
- Web Speech API (comandos de voz)
- Notifications API

## 📝 Licença

MIT

## 🚀 Próximos Passos para Play Store

1. ✅ PWA configurado
2. ✅ Manifest.json criado
3. ✅ Service Worker implementado
4. ⏳ Criar ícones (192x192 e 512x512)
5. ⏳ Criar screenshots
6. ⏳ Testar em dispositivos móveis
7. ⏳ Usar PWABuilder para gerar APK
8. ⏳ Publicar na Play Store

## 💡 Dicas

- O app funciona melhor em HTTPS (necessário para PWA)
- Teste as notificações no celular
- Certifique-se de que os ícones estão no formato correto
- Use PWABuilder para facilitar a conversão para APK
