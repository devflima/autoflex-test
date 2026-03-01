# AutoFlex Test

Desafio técnico para vaga de **Desenvolvimento Full Stack**, com implementação de uma aplicação completa para gestão de produtos, matérias-primas e apoio à tomada de decisão de produção com base no estoque disponível.

O projeto foi desenvolvido como uma solução full stack, separada em frontend e backend, cobrindo desde modelagem de dados e API REST até interface web e testes automatizados.

## Contexto do desafio

A proposta deste projeto é simular um cenário comum de operação industrial/comercial: determinar o que pode ser produzido a partir do estoque atual de insumos.

A aplicação permite:

- cadastrar produtos;
- cadastrar matérias-primas;
- definir a composição de cada produto;
- consultar a capacidade atual de produção com base no estoque;
- visualizar o valor potencial de produção.

Além do CRUD básico, a solução implementa uma regra de negócio prática: priorizar a produção de itens com maior valor, respeitando as restrições dos insumos disponíveis.

## Principais entregas

- Aplicação **full stack** com separação clara entre frontend e backend
- API REST estruturada em camadas
- Persistência relacional com migração automática de banco
- Interface web para operação do sistema
- Regra de negócio para sugestão de produção
- Testes unitários, de integração e end-to-end
- Estrutura pronta para execução local e via Docker

## Arquitetura da solução

O repositório está organizado como um monorepo com dois módulos principais:

```text
autoflex-test/
  backend/    # API e regras de negócio
  frontend/   # Interface web
```

### Backend

Responsável por:

- expor endpoints REST;
- persistir produtos, matérias-primas e composições;
- executar a lógica de sugestão de produção;
- aplicar migrações e carga inicial de dados.

### Frontend

Responsável por:

- exibir os dados consumidos da API;
- permitir operações de cadastro, edição e exclusão;
- apresentar a sugestão de produção em uma interface amigável;
- centralizar o estado da aplicação com Redux Toolkit.

## Stack utilizada

### Backend

- Java 21
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Flyway
- Oracle Database
- H2 para testes
- Maven

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Cypress

## Funcionalidades implementadas

### Gestão de produtos

- listagem de produtos
- criação de novos produtos
- edição de produtos existentes
- exclusão de produtos

### Gestão de matérias-primas

- listagem de matérias-primas
- criação de novos insumos
- edição de estoque e dados
- exclusão de insumos

### Composição de produtos

- associação entre produto e matéria-prima
- definição da quantidade necessária de cada insumo
- edição e remoção dessas associações

### Sugestão de produção

- cálculo da quantidade máxima produzível de cada item
- consideração do estoque atual como fator limitante
- ordenação por prioridade econômica
- cálculo do valor total potencial de produção

## Regra de negócio em destaque

A funcionalidade mais relevante do desafio é a **sugestão de produção**.

A lógica implementada:

- lê todos os produtos cadastrados;
- ordena os produtos por maior valor;
- calcula quantas unidades podem ser produzidas com base no insumo mais restritivo;
- consome virtualmente o estoque já considerado;
- retorna uma lista de produtos produzíveis e o valor financeiro total potencial.

Esse fluxo demonstra modelagem de domínio, raciocínio algorítmico e aplicação de regra de negócio real sobre dados persistidos.

## Endpoints principais

### Produtos

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Sugestão de produção

- `GET /products/suggestions`

### Produto com composição

- `GET /products/materials/{id}`

### Matérias-primas

- `GET /raw-materials`
- `GET /raw-materials/{id}`
- `POST /raw-materials`
- `PUT /raw-materials/{id}`
- `DELETE /raw-materials/{id}`

### Relação produto x matéria-prima

- `GET /product-materials`
- `GET /product-materials/{id}`
- `POST /product-materials`
- `PUT /product-materials/{id}`
- `DELETE /product-materials/{id}`

## Diferenciais técnicos

- Separação de responsabilidades entre camadas de aplicação
- Organização do backend em domínio, aplicação, infraestrutura e interfaces
- Migrações versionadas com Flyway
- Base inicial com dados de exemplo
- Testes cobrindo lógica de negócio e integração da API
- Frontend com estado centralizado e navegação estruturada
- Preparação para execução containerizada

## Como executar o projeto

### Backend com Docker

No diretório `backend`:

```bash
docker compose up --build
```

Isso sobe:

- banco Oracle
- API backend na porta `8080`

### Backend local

No diretório `backend`:

```bash
./mvnw spring-boot:run
```

### Frontend local

No diretório `frontend`:

```bash
npm install
npm run dev
```

### Frontend com Docker

No diretório `frontend`:

```bash
docker compose up --build
```

## Testes

### Backend

```bash
./mvnw test
```

Inclui:

- testes unitários
- testes de integração
- execução com H2 em memória no perfil de testes

### Frontend

```bash
npx cypress run
```

## Pontos de atenção / evolução

Como desafio técnico, o projeto foi construído para demonstrar capacidade de entrega e organização. Algumas evoluções naturais para um ambiente de produção seriam:

- autenticação e autorização mais robustas;
- documentação formal da API com Swagger/OpenAPI;
- configuração por variáveis de ambiente no frontend;
- melhoria no tratamento global de erros;
- pipeline de CI/CD;
- paginação, filtros e observabilidade.

## Objetivo profissional deste projeto

Este repositório foi desenvolvido como resposta a um **desafio para vaga de Desenvolvedor Full Stack**, com foco em demonstrar:

- capacidade de estruturar uma aplicação ponta a ponta;
- domínio de backend e frontend;
- modelagem de dados e regras de negócio;
- preocupação com testes;
- organização de código e clareza arquitetural;
- entrega de uma solução funcional, executável e extensível.

## Autor

Desenvolvido por Felipe Lima como parte de um processo seletivo para vaga de desenvolvimento full stack.

Repositório:
[https://github.com/devflima/autoflex-test](https://github.com/devflima/autoflex-test)
