#!/bin/bash

echo "🔐 Setup de Autenticação JWT - Personal Finance API"
echo "=================================================="
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto!"
    exit 1
fi

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi
echo "✅ Dependências instaladas"
echo ""

# 2. Verificar se o .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando .env de exemplo..."
    cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/personal_finance?schema=public"
PORT=3333
JWT_SECRET="change-me-to-a-secure-secret-key-with-at-least-32-characters"
JWT_EXPIRES_IN="7d"
EOF
    echo "✅ Arquivo .env criado!"
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais antes de continuar!"
    echo ""
    read -p "Pressione ENTER quando tiver configurado o .env..."
fi

# 3. Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Erro ao gerar Prisma Client"
    exit 1
fi
echo "✅ Prisma Client gerado"
echo ""

# 4. Aplicar migrações
echo "🗄️  Aplicando migrações ao banco de dados..."
echo "Escolha uma opção:"
echo "1) migrate dev (desenvolvimento - cria banco se não existir)"
echo "2) migrate deploy (produção - apenas aplica migrações)"
echo "3) db push (força atualização do schema)"
read -p "Opção [1]: " migration_option
migration_option=${migration_option:-1}

case $migration_option in
    1)
        npx prisma migrate dev
        ;;
    2)
        npx prisma migrate deploy
        ;;
    3)
        npx prisma db push
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

if [ $? -ne 0 ]; then
    echo "❌ Erro ao aplicar migrações"
    echo "💡 Dica: Verifique se o PostgreSQL está rodando e se a DATABASE_URL está correta"
    exit 1
fi
echo "✅ Migrações aplicadas"
echo ""

# 5. Build do projeto
echo "🔨 Compilando o projeto..."
npm run build
if [ $? -ne 0 ]; then
    echo "⚠️  Aviso: Houve erros na compilação"
    echo "Você ainda pode tentar iniciar o servidor em modo dev"
else
    echo "✅ Projeto compilado com sucesso"
fi
echo ""

# Resumo final
echo "=================================================="
echo "✅ Setup concluído!"
echo ""
echo "🚀 Para iniciar o servidor, execute:"
echo "   npm run start:dev"
echo ""
echo "📚 Documentação disponível em:"
echo "   - AUTH_GUIDE.md"
echo "   - JWT_IMPLEMENTATION_SUMMARY.md"
echo "   - NEXT_STEPS.md"
echo ""
echo "🧪 Teste os endpoints usando o arquivo client.http"
echo "=================================================="

