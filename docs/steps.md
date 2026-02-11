# Criando projeto do zero

## Creating a new node project 
```
npm init -y
```

## Packages
```
npm i typescript @types/node tsx tsup -D
# aqui ainda não é quem vai manipular o banco de dados em si, por isso deve ser de desenvolvimento
# é mais pra CLI
# pra executar esses comandos basta digitar npx <comando> que irá executar comandos que estão em 
# node_modules/bin
npm i prisma -D
npm install -D @types/pg

# prod
npm i fastify
npm i dotenv
# this one is used to access the database
npm i @prisma/client
npm install pg @prisma/adapter-pg
npm i bcryptjs
npm i @fastify/jwt @fastify/cookie

```

## Create ts config file
```
npx tsc --init
```

## Iniciate prisma schema
```
npx prisma init
```


# Processo
- Rota -> Controller -> Service -> Repository
