$(function() {
    // quando o documento estiver pronto/carregado

    function exibir_cadeiras() {
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
            mostrar_conteudo("cadastroCadeiras");
            for (var cadeira of cadeiras) {
                //i vale a posição no vetor
                lin = `<tr id="linha_cadeira_${cadeira.id}">
                  <td>${cadeira.nome}</td>
                  <td>${cadeira.cor}</td>
                  <td>${cadeira.fabricante}</td>
                  <td>${cadeira.descricao}</td>
                  <td>${cadeira.material}</td>
                  <td>
                    <a href="#" id="excluir_cadeira_${cadeira.id}" class="excluir_cadeira" >
                      <span class="material-icons">
                        clear
                      </span>
                    </a>
                  </td>
              </tr>`;
                $("#corpoTabelaCadeiras").append(lin);
            }
        }
    }

    function exibir_inspecao() {
        $.ajax({
            url: "http://localhost:5000/listar_inspecao",
            method: "GET",
            dataType: "json", // os dados são recebidos no formato json
            success: listar, // chama a função listar para processar o resultado
            error: function() {
                alert("erro ao ler dados, verifique o backend");
            },
        });

        function listar(inspecoes) {
            $('#corpoTabelaInspecao').empty();
            // tornar a tabela visível
            mostrar_conteudo("cadastroInspecao");
            for (var inspecao of inspecoes) {
                //i vale a posição no vetor
                lin = `<tr id="linha_inspecao_${inspecao.id}">
                  <td>${inspecao.cadeira.nome}</td>
                  <td>${inspecao.cadeira.fabricante}</td>
                  <td>${inspecao.nome}</td>
                  <td>${inspecao.data}</td>
                  <td>${inspecao.resultado}</td>
                  <td>
                    <a href="#" id="excluir_inspecao_${inspecao.id}" class="excluir_inspecao" >
                      <span class="material-icons">
                        clear
                      </span>
                    </a>
                  </td>
              </tr>`;
                $("#corpoTabelaInspecao").append(lin);
            }
        }
    }

    function exibir_emprestimo() {
        $.ajax({
            url: "http://localhost:5000/listar_emprestimo",
            method: "GET",
            dataType: "json", // os dados são recebidos no formato json
            success: listar, // chama a função listar para processar o resultado
            error: function() {
                alert("erro ao ler dados, verifique o backend");
            },
        });

        function listar(emprestimos) {
            $('#corpoTabelaEmprestimo').empty();
            // tornar a tabela visível
            mostrar_conteudo("cadastroEmprestimo");
            for (var emprestimo of emprestimos) {
                //i vale a posição no vetor
                lin = `<tr id="linha_emprestimo_${emprestimo.id}">
                  <td>${emprestimo.cadeira.nome}</td>
                  <td>${emprestimo.cadeira.fabricante}</td>
                  <td>${emprestimo.codigo}</td>
                  <td>${emprestimo.data_aquisicao}</td>
                  <td>${emprestimo.data_emprestimo}</td>
                  <td>
                    <a href="#" id="excluir_emprestimo_${emprestimo.id}" class="excluir_emprestimo" >
                      <span class="material-icons">
                        clear
                      </span>
                    </a>
                  </td>
              </tr>`;
                $("#corpoTabelaEmprestimo").append(lin);
            }
        }
    }

    // função que mostra um conteúdo e esconde os outros
    function mostrar_conteudo(identificador) {
        // esconde todos os conteúdos
        $("#cadastroCadeiras").addClass("d-none");
        $("#cadastroInspecao").addClass("d-none");
        $("#cadastroEmprestimo").addClass("d-none");
        $("#conteudoInicial").addClass("d-none");
        // torna o conteúdo escolhido visível
        $(`#${identificador}`).removeClass("d-none");
    }

    // código para mapear o click do link Listar
    $(document).on("click", "#linkListarCadeiras", function() {
        exibir_cadeiras();
    });

    $(document).on("click", "#linkListarInspecao", function() {
        exibir_inspecao();
    });

    $(document).on("click", "#linkListarEmprestimo", function() {
        exibir_emprestimo();
    });

    // código para mapear click do link Inicio
    $(document).on("click", "#linkInicio", function() {
        mostrar_conteudo("conteudoInicial");
    });

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
                $("#campoNome").val('');
                $("#campoCor").val('');
                $("#campoFabricante").val('');
                $("#campoDescricao").val('');
                $("#campoMaterial").val('');
                $(".close").click();
                exibir_cadeiras();
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

    $("#modalIncluirCadeira").on("hidden.bs.modal", function(e) {
        // se a página de listagem não estiver invisível
        if (!$("#cadastroCadeiras").hasClass("invisible")) {
            // atualizar a página de listagem
            exibir_cadeiras();
        }
    });

    // Inspecao
    $(document).on("click", "#btIncluirInspecao", function() {
        //pegar dados da tela
        nome = $("#campoNomeInspecao").val();
        data = $("#campoData").val();
        resultado = $("#campoResultado").val();
        cadeiraId = $("#campoCadeira").val();
        // preparar dados no formato json
        var dados = JSON.stringify({
            nome: nome,
            data: data,
            resultado: resultado,
            cadeira_id: cadeiraId
            
        });
        // fazer requisição para o back-end
        $.ajax({
            url: "http://localhost:5000/incluir_inspecao",
            type: "POST",
            dataType: "json", // os dados são recebidos no formato json
            contentType: "application/json", // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: inspecaoIncluida, // chama a função listar para processar o resultado
            error: erroAoIncluir,
        });

        function inspecaoIncluida(retorno) {
            if (retorno.resultado == "ok") {
                // a operação deu certo?
                // informar resultado de sucesso
                alert("Inspeção incluída com sucesso!");
                // limpar os campos
                $("#campoNome").val('');
                $("#campoData").val('');
                $("#campoResultado").val('');
                $("#campoCadeira").val('');
                $(".close").click();
                exibir_inspecao();
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

    $("#modalIncluirInspecao").on("hidden.bs.modal", function(e) {
        // se a página de listagem não estiver invisível
        if (!$("#cadastroInspecao").hasClass("invisible")) {
            // atualizar a página de listagem
            exibir_inspecao();
        }
    });

    // Emprestimo
    $(document).on("click", "#btIncluirEmprestimo", function() {
        //pegar dados da tela
        codigo = $("#campoCodigo").val();
        data_aquisicao = $("#campoDataAquisicao").val();
        data_emprestimo = $("#campoDataEmprestimo").val();
        cadeiraId = $("#campoCadeiraEmprestimo").val();
        // preparar dados no formato json
        var dados = JSON.stringify({
            codigo: codigo,
            data_aquisicao: data_aquisicao,
            data_emprestimo: data_emprestimo,
            cadeira_id: cadeiraId
            
        });
        // fazer requisição para o back-end
        $.ajax({
            url: "http://localhost:5000/incluir_emprestimo",
            type: "POST",
            dataType: "json", // os dados são recebidos no formato json
            contentType: "application/json", // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: emprestimoIncluida, // chama a função listar para processar o resultado
            error: erroAoIncluir,
        });

        function emprestimoIncluida(retorno) {
            if (retorno.resultado == "ok") {
                // a operação deu certo?
                // informar resultado de sucesso
                alert("Inspeção incluída com sucesso!");
                // limpar os campos
                $("#campoCodigo").val('');
                $("#campoDataAquisicao").val('');
                $("#campoDataEmprestimo").val('');
                $("#campoCadeiraEmprestimo").val('');
                $(".close").click();
                exibir_emprestimo();
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

    $("#modalIncluirEmprestimo").on("hidden.bs.modal", function(e) {
        // se a página de listagem não estiver invisível
        if (!$("#cadastroEmprestimo").hasClass("invisible")) {
            // atualizar a página de listagem
            exibir_emprestimo();
        }
    });

    // a função abaixo é executada quando a página abre
    mostrar_conteudo("conteudoInicial");

    // código para os ícones de excluir cadeiras (classe css)
    $(document).on("click", ".excluir_cadeira", function() {
        // obter o ID do ícone que foi clicado
        var componente_clicado = $(this).attr('id');
        // no id do ícone, obter o ID da cadeira
        var nome_icone = "excluir_cadeira_";
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
                // remover da tela a linha cuja cadeira foi excluída
                $("#linha_cadeira_" + id_cadeira).fadeOut(1000, function() {
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

    //Inspecao
    $(document).on("click", ".excluir_inspecao", function() {
        // obter o ID do ícone que foi clicado
        var componente_clicado = $(this).attr('id');
        // no id do ícone, obter o ID da cadeira
        var nome_icone = "excluir_inspecao_";
        var id_inspecao = componente_clicado.substring(nome_icone.length);
        // solicitar a exclusão da cadeira
        $.ajax({
            url: 'http://localhost:5000/excluir_inspecao/' + id_inspecao,
            type: 'DELETE', // método da requisição
            dataType: 'json', // os dados são recebidos no formato json
            success: inspecaoExcluida, // chama a função listar para processar o resultado
            error: erroAoExcluir
        });

        function inspecaoExcluida(retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                // remover da tela a linha cuja cadeira foi excluída
                $("#linha_inspecao_" + id_inspecao).fadeOut(1000, function() {
                    // informar resultado de sucesso
                    alert("Inspeção removida com sucesso!");
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

    //Emprestimo
    $(document).on("click", ".excluir_emprestimo", function() {
        // obter o ID do ícone que foi clicado
        var componente_clicado = $(this).attr('id');
        // no id do ícone, obter o ID da cadeira
        var nome_icone = "excluir_emprestimo_";
        var id_emprestimo = componente_clicado.substring(nome_icone.length);
        // solicitar a exclusão da cadeira
        $.ajax({
            url: 'http://localhost:5000/excluir_emprestimo/' + id_emprestimo,
            type: 'DELETE', // método da requisição
            dataType: 'json', // os dados são recebidos no formato json
            success: emprestimoExcluido, // chama a função listar para processar o resultado
            error: erroAoExcluir
        });

        function emprestimoExcluido(retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                // remover da tela a linha cuja cadeira foi excluída
                $("#linha_emprestimo_" + id_emprestimo).fadeOut(1000, function() {
                    // informar resultado de sucesso
                    alert("Empréstimo removido com sucesso!");
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

    function carregarCombo(combo_id) {
        $.ajax({
            url: 'http://localhost:5000/listar_cadeiras',
            method: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            success: carregar, // chama a função listar para processar o resultado
            error: function(problema) {
                alert("erro ao ler dados, verifique o backend: ");
            }
        });
        function carregar (dados) {
            // esvaziar o combo
            $('#'+combo_id).empty();
            // mostra ícone carregando...
            $('#loading_'+combo_id).removeClass('d-none');
            // percorrer a lista de dados
            for (var i in dados) { //i vale a posição no vetor
                $('#'+combo_id).append(
                    $('<option></option>').attr("value", 
                        dados[i].id).text(dados[i].nome));
            }
            // espera um pouco, para ver o ícone "carregando"
            setTimeout(() => { 
                $('#loading_'+combo_id).addClass('d-none');
             }, 1000);
        }
    }

    $('#modalIncluirInspecao').on('shown.bs.modal', function (e) {
        // carregar as listas de pessoas e exames
        carregarCombo("campoCadeira");
    })

    $('#modalIncluirEmprestimo').on('shown.bs.modal', function (e) {
        // carregar as listas de pessoas e exames
        carregarCombo("campoCadeiraEmprestimo");
    })

});