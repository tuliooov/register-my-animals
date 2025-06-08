# 🚀 Instruções de Deploy

## Opções de Deploy

### 1. Vercel (Recomendado)
A forma mais simples de fazer deploy de uma aplicação Next.js:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Seguir as instruções no terminal
```

### 2. Netlify
```bash
# Build da aplicação
npm run build

# Fazer upload da pasta .next para Netlify
# Ou conectar repositório Git no painel do Netlify
```

### 3. GitHub Pages (Estático)
```bash
# Instalar next-export
npm install --save-dev next-export

# Adicionar script no package.json
"export": "next build && next export"

# Executar export
npm run export

# Fazer upload da pasta out/ para GitHub Pages
```

### 4. Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build da imagem
docker build -t animal-registry .

# Executar container
docker run -p 3000:3000 animal-registry
```

### 5. Servidor VPS/Dedicado
```bash
# No servidor
git clone <repositorio>
cd animal-registry
npm install
npm run build
npm start

# Usar PM2 para produção
npm install -g pm2
pm2 start npm --name "animal-registry" -- start
pm2 startup
pm2 save
```

## Configurações de Produção

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```
NEXT_PUBLIC_APP_URL=https://seudominio.com
```

### Otimizações
- Compressão gzip habilitada automaticamente
- Imagens otimizadas pelo Next.js
- Code splitting automático
- Service Worker para cache

### HTTPS
- Obrigatório para PWA funcionar completamente
- Vercel e Netlify fornecem HTTPS automaticamente
- Para VPS, use Let's Encrypt

## Monitoramento

### Analytics
Adicione Google Analytics ou similar:
```javascript
// pages/_app.js
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Error Tracking
Considere usar Sentry para tracking de erros:
```bash
npm install @sentry/nextjs
```

## Backup e Manutenção

### Backup dos Dados
- Os dados ficam no localStorage do usuário
- Implemente exportação regular
- Considere adicionar backup em nuvem opcional

### Atualizações
```bash
# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

## Performance

### Lighthouse Score
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 85+
- PWA: 100

### Otimizações Implementadas
- Lazy loading de componentes
- Code splitting automático
- Compressão de imagens
- Service Worker para cache
- Minificação automática

## Domínio Personalizado

### Vercel
```bash
# Adicionar domínio
vercel domains add seudominio.com

# Configurar DNS
# A record: @ -> 76.76.19.61
# CNAME: www -> cname.vercel-dns.com
```

### Netlify
```bash
# No painel do Netlify
# Domain settings > Add custom domain
# Configurar DNS conforme instruções
```

## SSL/TLS
- Certificados automáticos na Vercel e Netlify
- Para VPS, use Certbot (Let's Encrypt)

## CDN
- Vercel e Netlify incluem CDN global
- Para VPS, considere Cloudflare

## Checklist de Deploy

- [ ] Testes locais passando
- [ ] Build sem erros
- [ ] PWA funcionando
- [ ] Responsividade testada
- [ ] Performance otimizada
- [ ] HTTPS configurado
- [ ] Domínio configurado
- [ ] Analytics configurado (opcional)
- [ ] Error tracking configurado (opcional)
- [ ] Backup strategy definida

## Suporte

Para problemas de deploy:
1. Verifique os logs de build
2. Teste localmente com `npm run build && npm start`
3. Verifique compatibilidade de Node.js
4. Consulte documentação da plataforma escolhida

