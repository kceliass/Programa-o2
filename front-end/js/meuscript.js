$(function () {
  // quando o documento estiver pronto/carregado

  // função para exibir pessoas na tabela
  function exibir_pessoas() {
    $.ajax({
      url: "http://localhost:5000/listar_cadeiras",
      method: "GET",
      dataType: "json", // os dados são recebidos no formato json
      success: listar, // chama a função listar para processar o resultado
      error: function () {
        alert("erro ao ler dados, verifique o backend");
      },
    });
    function listar(cadeiras) {
      // esvaziar o corpo da tabela
      var linhas = "";
      // $('#corpoTabelaCadeiras').empty();
      // tornar a tabela visível
      mostrar_conteudo("tabelaCadeiras");
      // percorrer a lista de pessoas retornadas;
      for (var cadeira of cadeiras) {
        //i vale a posição no vetor
        lin = `<tr>
                        <td>${cadeira.nome}</td>
                        <td>${cadeira.cor}</td>
                        <td>${cadeira.fabricante}</td>
                        <td>${cadeira.descricao}</td>
                        <td>${cadeira.material}</td>
                    </tr>`;
        linhas += lin;
      }
      $("#tabelaCadeiras").html(linhas);
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
  $(document).on("click", "#linkListarCadeiras", function () {
    exibir_pessoas();
  });

  // código para mapear click do link Inicio
  $(document).on("click", "#linkInicio", function () {
    mostrar_conteudo("conteudoInicial");
  });

  // código para mapear click do botão incluir pessoa
  $(document).on("click", "#btIncluirCadeira", function () {
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
  $("#modalIncluirCadeira").on("hide.bs.modal", function (e) {
    // se a página de listagem não estiver invisível
    if (!$("#tabelaCadeiras").hasClass("invisible")) {
      // atualizar a página de listagem
      exibir_pessoas();
    }
  });

  // a função abaixo é executada quando a página abre
  mostrar_conteudo("conteudoInicial");
});
