# Revisão da home — 30/09/2026

Esta branch substitui apenas a rota inicial por `home-v2.html`, preservando `index.html` como referência e mantendo as páginas internas existentes.

Principais mudanças:
- home mais curta e orientada a contato;
- CTA de WhatsApp com mensagens pré-preenchidas;
- melhor hierarquia mobile;
- linguagem de saúde mais cuidadosa, sem promessas de resultado;
- consentimento antes de carregar métricas da Kubo Web na nova home;
- Schema.org ajustado para `ProfessionalService` em vez de `MedicalBusiness` na nova home;
- sitemap com URLs limpas e data de atualização;
- cabeçalhos básicos de segurança e cache de assets.

Publicação: a rota `/` é reescrita para `/home-v2.html` via `vercel.json`.
