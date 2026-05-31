# Como atualizar a Vitrine Yellow Duck

## Adicionar um produto lacrado

Abra o arquivo `produtos.json` e adicione um novo bloco seguindo o modelo:

```json
{
  "id": 4,
  "nome": "Nome do produto",
  "edicao": "Nome da Edição",
  "tipo": "Caixa de Booster",
  "preco": 350.00,
  "unidades": 2,
  "imagem": "imagens/nome-da-foto.jpg",
  "destaque": false
}
```

> ⚠️ Lembre de colocar uma vírgula após o `}` do item anterior, antes do novo!

### Tipos disponíveis
- `Caixa de Booster`
- `Blister`
- `Kit`
- `Coleção Treinador`
- (qualquer outro nome que quiser)

---

## Adicionar uma carta em destaque

Abra o arquivo `cartas.json` e adicione:

```json
{
  "id": 3,
  "nome": "Nome da Carta",
  "edicao": "151",
  "numero": "006/165",
  "preco": 450.00,
  "imagem": "imagens/carta3.jpg",
  "descricao": "Descrição breve da carta"
}
```

---

## Adicionar fotos

1. Coloque a imagem na pasta `imagens/`
2. No JSON, coloque o caminho: `"imagem": "imagens/nome-do-arquivo.jpg"`
3. Se não tiver foto, deixe `"imagem": ""` — aparecerá um ícone padrão

---

## Remover um produto

Apague o bloco inteiro do item no JSON (do `{` até o `}` correspondente).

---

## Alterar preço ou unidades

Basta editar o número no campo `"preco"` ou `"unidades"` diretamente no JSON.
