import type { Filme } from "./types";

export class CatalogoFilmes {
    private filmes: Filme[] = [];

    adicionar(filme: Filme): void {
        if (filme.avaliacao !== undefined && (filme.avaliacao < 0 || filme.avaliacao > 10)) {
            console.log("\n❌ Erro: A avaliação deve ser entre 0 e 10.");
            return;
        }
        this.filmes.push(filme);
        console.log(`\n✅ Filme "${filme.titulo}" adicionado com sucesso!`);
    }

    listarTodos(): Filme[] {
        return this.filmes;
    }

    buscarPorTitulo(titulo: string): Filme[] {
        return this.filmes.filter(f => f.titulo.toLowerCase().includes(titulo.toLowerCase()));
    }

    buscarPorGenero(genero: string): Filme[] {
        return this.filmes.filter(f => f.genero.toLowerCase() === genero.toLowerCase());
    }

    removerPorTitulo(titulo: string): boolean {
        const tamanhoInicial = this.filmes.length;
        this.filmes = this.filmes.filter(f => f.titulo.toLowerCase() !== titulo.toLowerCase());
        return this.filmes.length < tamanhoInicial;
    }
}