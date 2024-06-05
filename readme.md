# Pokemap

## Sobre o projeto
Nosso projeto consiste em uma aplicação de cadastro de Pokémons baseada
em sua localização. O usuário pode cadastrar um Pokémon e inserir a
localização onde ele foi visto. Utilizamos a API do CEP para obter informações
detalhadas do endereço e a API do Pokémon para buscar todas as
informações relevantes sobre os Pokémons.

### Uso do cache
Implementamos uma estratégia de cache no projeto. Quando o usuário digita
um CEP, primeiro verificamos no cache. Se a informação estiver disponível, ela
é obtida diretamente do armazenamento local. Caso contrário, consultamos a
API e armazenamos o resultado no cache. Dessa forma, as consultas se
tornam mais rápidas, otimizadas e com menor custo de processamento.

### Uso de APISs
O uso de APIs foi essencial para o desenvolvimento do projeto, especialmente
pela facilidade em obter informações. Por exemplo, com apenas os números do
código postal e cerca de 10 linhas de código, é possível obter o endereço
completo de forma rápida e eficiente, sem armazenar informações
desnecessárias na aplicação.

### Funcionamento do banco de dados
O sistema salva tudo no MongoDB em 2 collections sendo ela users e
pokemon_location, uma para armazenar o usuário e a outra para salvar os
Reports de pokémons

### JWT
Sobre o JWT, após o usuário realizar o login, é gerado um token, que por sua
vez é salvo utilizando IndexedDB

## Server setup
- cd server
- python -m venv env
- env/Scripts/activate
- pip install -r requirements.txt
- fastapi dev main.py


Documentação do projeto: https://drive.google.com/drive/folders/14GlAwnfzy7rDepW6nL8cHJV2EId8pOXg