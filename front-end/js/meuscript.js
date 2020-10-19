$(function() {
    // quando o documento estiver pronto/carregado

    // função para exibir pessoas na tabela
    function exibir_pessoas() {
        $.ajax({
            url: "http://localhost:5000/listar_cadeiras",
            method: "GET",
            dataType: "json", // os dados são recebidos no formato json
            success: listar, // chama a função listar para processar o resultado
            error: function() {
                alert("erro ao ler dados, verifique o backend");
            },
        });

        function listar(cadeiras) {
            $('#corpoTabelaCadeiras').empty();
            // tornar a tabela visível
            mostrar_conteudo("tabelaCadeiras");
            // percorrer a lista de pessoas retornadas;
            for (var cadeira of cadeiras) {
                //i vale a posição no vetor
                lin = `<tr id="linha_${cadeira.id}">
                  <td>${cadeira.nome}</td>
                  <td>${cadeira.cor}</td>
                  <td>${cadeira.fabricante}</td>
                  <td>${cadeira.descricao}</td>
                  <td>${cadeira.material}</td>
                  <td>
                    <a href="#" id="excluir_${cadeira.id}" class="excluir_cadeira" >
                      <span class="material-icons">
                        clear
                      </span>
                    </a>
                  </td>
              </tr>`;
                $("#tabelaCadeiras").append(lin);
            }
        }
    }

    // função que mostra um conteúdo e esconde os outros
    function mostrar_conteudo(identificador) {
        // esconde todos os conteúdos
        $("#tabelaCadeiras").addClass("invisible");
        $("#conteudoInicial").addClass("invisible");
        // torna o conteúdo escolhido visível
        $(`#${identificador}`).removeClass("invisible");
    }

    // código para mapear o click do link Listar
    $(document).on("click", "#linkListarCadeiras", function() {
        exibir_pessoas();
    });

    // código para mapear click do link Inicio
    $(document).on("click", "#linkInicio", function() {
        mostrar_conteudo("conteudoInicial");
    });

    // código para mapear click do botão incluir pessoa
    $(document).on("click", "#btIncluirCadeira", function() {
        //pegar dados da tela
        nome = $("#campoNome").val();
        cor = $("#campoCor").val();
        fabricante = $("#campoFabricante").val();
        descricao = $("#campoDescricao").val();
        material = $("#campoMaterial").val();
        // preparar dados no formato json
        var dados = JSON.stringify({
            nome: nome,
            cor: cor,
            fabricante: fabricante,
            descricao: descricao,
            material: material
        });
        // fazer requisição para o back-end
        $.ajax({
            url: "http://localhost:5000/incluir_cadeira",
            type: "POST",
            dataType: "json", // os dados são recebidos no formato json
            contentType: "application/json", // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: cadeiraIncluida, // chama a função listar para processar o resultado
            error: erroAoIncluir,
        });

        function cadeiraIncluida(retorno) {
            if (retorno.resultado == "ok") {
                // a operação deu certo?
                // informar resultado de sucesso
                alert("Cadeira incluída com sucesso!");
                // limpar os campos
                $("#campoNome").val();
                $("#campoCor").val();
                $("#campoFabricante").val();
                $("#campoDescricao").val();
                $("#campoMaterial").val();
                $(".close").click();
                exibir_pessoas();
            } else {
                // informar mensagem de erro
                alert(`${retorno.resultado}: ${retorno.detalhes}`);
            }
        }

        function erroAoIncluir(retorno) {
            // informar mensagem de erro
            alert(`ERRO:  ${retorno.resultado}  : ${retorno.detalhes}`);
        }
    });

    // código a ser executado quando a janela de inclusão de pessoas for fechada
    $("#modalIncluirCadeira").on("hidden.bs.modal", function(e) {
        // se a página de listagem não estiver invisível
        if (!$("#tabelaCadeiras").hasClass("invisible")) {
            // atualizar a página de listagem
            exibir_pessoas();
        }
    });

    // a função abaixo é executada quando a página abre
    mostrar_conteudo("conteudoInicial");

    // código para os ícones de excluir cadeiras (classe css)
    $(document).on("click", ".excluir_cadeira", function() {
        // obter o ID do ícone que foi clicado
        var componente_clicado = $(this).attr('id');
        // no id do ícone, obter o ID da cadeira
        var nome_icone = "excluir_";
        var id_cadeira = componente_clicado.substring(nome_icone.length);
        // solicitar a exclusão da cadeira
        $.ajax({
            url: 'http://localhost:5000/excluir_cadeira/' + id_cadeira,
            type: 'DELETE', // método da requisição
            dataType: 'json', // os dados são recebidos no formato json
            success: cadeiraExcluida, // chama a função listar para processar o resultado
            error: erroAoExcluir
        });

        function cadeiraExcluida(retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                // remover da tela a linha cuja pessoa foi excluída
                $("#linha_" + id_cadeira).fadeOut(1000, function() {
                    // informar resultado de sucesso
                    alert("Cadeira removida com sucesso!");
                });
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }
        }

        function erroAoExcluir(retorno) {
            // informar mensagem de erro
            alert("erro ao excluir dados, verifique o backend: ");
        }
    });
});