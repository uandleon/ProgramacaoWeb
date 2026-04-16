import * as readline from 'readline-sync';
import { CatalogoFilmes } from './CatalogoFilmes';
import type { Filme } from "./types"; 

const catalogo = new CatalogoFilmes();
let executando = true;

console.log("=== SISTEMA DE FILMES FATEC ===");

while (executando) {
    console.log("\n1. Adicionar Filme");
    console.log("2. Listar Todos");
    console.log("3. Buscar por Título");
    console.log("4. Buscar por Gênero");
    console.log("5. Remover Filme");
    console.log("6. Sair");

    const opcao = readline.question("\nEscolha uma opcao: ");

    switch (opcao) {
        case '1':
            const titulo = readline.question("Titulo: ");
            const ano = parseInt(readline.question("Ano: "));
            const genero = readline.question("Genero: ");
            const duracao = parseInt(readline.question("Duracao (min): "));
            const notaInput = readline.question("Avaliacao (0-10, opcional): ");
            
            // Criamos o objeto base
            const novoFilme: Filme = {
                titulo,
                ano,
                genero,
                duracao
            };

            // Só adicionamos a avaliação se o usuário realmente digitou algo
            if (notaInput !== "") {
                novoFilme.avaliacao = parseFloat(notaInput);
            }

            catalogo.adicionar(novoFilme);
            break;

        case '2':
            console.table(catalogo.listarTodos());
            break;

        case '3':
            const termoT = readline.question("Digite o titulo: ");
            console.table(catalogo.buscarPorTitulo(termoT));
            break;

        case '4':
            const termoG = readline.question("Digite o genero: ");
            console.table(catalogo.buscarPorGenero(termoG));
            break;

        case '5':
            const removerT = readline.question("Titulo exato para remover: ");
            if (catalogo.removerPorTitulo(removerT)) {
                console.log("✅ Filme removido!");
            } else {
                console.log("❌ Filme não encontrado.");
            }
            break;

        case '6':
            executando = false;
            console.log("Até logo!");
            break;
    }
}