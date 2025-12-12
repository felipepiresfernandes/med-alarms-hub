# Configuração do MCP do Supabase

Este guia explica como configurar o MCP (Model Context Protocol) do Supabase no Cursor.

## O que é MCP?

O MCP permite que a IA do Cursor interaja diretamente com seu projeto Supabase, possibilitando:
- Consultar dados do banco
- Gerenciar tabelas
- Executar queries
- Visualizar estrutura do banco de dados
- Criar e modificar esquemas

## Como Configurar no Cursor

O Cursor configura o MCP através de um arquivo de configuração no projeto. **Não há interface gráfica** nas configurações do Cursor para isso.

### Passo 1: Gerar Token de Acesso no Supabase

1. Acesse o [Painel do Supabase](https://supabase.com/dashboard/account/tokens)
2. Vá em **Settings** (Configurações) > **Access Tokens** (Tokens de Acesso)
3. Clique em **Generate New Token** (Gerar Novo Token)
4. Dê um nome ao token (ex: "Cursor MCP")
5. **Copie o token gerado** - você precisará dele no próximo passo

⚠️ **Importante**: Guarde este token em local seguro, pois ele não será exibido novamente!

### Passo 2: Configurar o Arquivo MCP

O arquivo de configuração já foi criado em `.cursor/mcp.json`. Agora você precisa:

1. Abra o arquivo `.cursor/mcp.json` na raiz do projeto
2. Substitua `SEU_TOKEN_DE_ACESSO_AQUI` pelo token que você copiou no Passo 1
3. Salve o arquivo

O arquivo deve ficar assim:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_seu_token_aqui_1234567890"
      ]
    }
  }
}
```

### Passo 3: Reiniciar o Cursor

1. Feche completamente o Cursor
2. Abra o Cursor novamente
3. O MCP do Supabase deve estar configurado e pronto para uso

### Verificando se Funcionou

Após reiniciar, você pode testar pedindo à IA:
- "Liste todas as tabelas do meu banco de dados Supabase"
- "Mostre a estrutura da tabela products"

Se funcionar, o MCP está configurado corretamente!

## Segurança

⚠️ **Importante**: 
- Não conecte o MCP a dados de produção
- Use um ambiente de desenvolvimento para testes
- Revise as permissões concedidas regularmente
- Monitore as atividades do MCP

## Testando a Conexão

Após configurar, você pode testar pedindo à IA:
- "Liste todas as tabelas do meu banco de dados"
- "Mostre a estrutura da tabela products"
- "Quantos produtos temos no estoque?"
- "Crie uma nova tabela para armazenar alarmes"

## Informações do Seu Projeto

Com base no seu projeto atual, você já tem:
- ✅ Cliente Supabase configurado em `src/integrations/supabase/client.ts`
- ✅ Migrações do banco de dados em `supabase/migrations/`
- ✅ Tabela `products` já criada

O MCP permitirá que a IA acesse essas informações diretamente!

## Troubleshooting

### O MCP não aparece nas configurações do Cursor

1. Certifique-se de que está usando uma versão recente do Cursor
2. Verifique se o MCP está habilitado nas configurações avançadas
3. Tente reiniciar o Cursor após adicionar a configuração

### Erro de autenticação

1. Verifique se você está logado na conta correta do Supabase
2. Certifique-se de que o projeto está na organização selecionada
3. Tente gerar um novo token de acesso pessoal

### O MCP não responde

1. Verifique sua conexão com a internet
2. Confirme que a URL `https://mcp.supabase.com/mcp` está acessível
3. Verifique os logs do Cursor para erros específicos

## Recursos

- [Documentação oficial do Supabase MCP](https://supabase.com/mcp)
- [Repositório GitHub](https://github.com/supabase-community/supabase-mcp)
- [Vídeo tutorial: Como usar o MCP do Supabase no Cursor](https://www.youtube.com/watch?v=uNlJ5NpDT5U)

