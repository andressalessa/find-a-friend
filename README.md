# find-a-friend
REST API in nodejs


## Funcionalidades da Aplicação
[x] O cadastro de um pet
[ ] A listagem de todos os pets disponíveis para adoção em uma determinada cidade
[x] A filtragem de pets com base em suas características (como idade, porte, etc.)
[x] A visualização dos detalhes de um pet específico
[x] O cadastro de uma ORG (organização)
[ ] O login de uma ORG no sistema

## Regras de Negócio
### As seguintes condições devem ser implementadas:

[x] A informação da cidade é obrigatória para listar os pets
[ ] Uma ORG deve, obrigatoriamente, ter um endereço e um número de WhatsApp
[x] Todo pet cadastrado precisa estar vinculado a uma ORG
[ ] O contato do usuário interessado em adotar um pet será feito diretamente com a ORG via WhatsApp
[x] Todos os filtros de características do pet, com exceção da cidade, são opcionais
[ ] Para que uma ORG tenha acesso administrativo à aplicação, ela deve estar logada

## Tarefas

[x] Rota para cadastrar uma ORG, garantindo que inclua endereço e número de WhatsApp
[ ] Rota de login para uma ORG
[x] Rota para cadastrar um pet, garantindo que ele seja associado a uma ORG
[x] Rota para listar pets, exigindo a cidade como parâmetro obrigatório
[x] Implementar a funcionalidade de filtros opcionais por características dos pets na listagem
[x] Rota para visualizar os detalhes de um pet específico
[ ] Garantir que o acesso de administrador da ORG seja restrito a usuários logados
[x] Aplicar os princípios SOLID durante o desenvolvimento da estrutura da API
[ ] Criar testes para validar as funcionalidades e regras de negócio
