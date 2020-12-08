from config import *
from modelo import Cadeira, InspecaoRealizada, EmprestimoCadeiras

@app.route("/")
def inicio():
    return 'Sistema de cadastro de cadeiras. '+\
        '<a href="/listar_cadeiras">Operação listar</a>'

@app.route("/listar_cadeiras")
def listar_cadeiras():
    cadeiras = db.session.query(Cadeira).all()
    cadeiras_em_json = [ x.json() for x in cadeiras ]
    # converter a lista do python para json
    resposta = jsonify(cadeiras_em_json)
    # PERMITIR resposta para outras pedidos oriundos de outras tecnologias
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # retornar...

# teste da rota: curl -d '{"nome":"James Kirk", "telefone":"92212-1212", "email":"jakirk@gmail.com"}' -X POST -H "Content-Type:application/json" localhost:5000/incluir_cadeira
@app.route("/incluir_cadeira", methods=['post'])
def incluir_cadeira():
    # preparar uma resposta otimista
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    # receber as informações da nova cadeira
    dados = request.get_json() #(force=True) dispensa Content-Type na requisição
    try: # tentar executar a operação
      nova = Cadeira(**dados) # criar a nova cadeira
      db.session.add(nova) # adicionar no BD
      db.session.commit() # efetivar a operação de gravação
    except Exception as e: # em caso de erro...
      # informar mensagem de erro
      resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # responder!

# teste: curl -X DELETE http://localhost:5000/excluir_cadeira/1
@app.route("/excluir_cadeira/<int:cadeira_id>", methods=['DELETE'])
def excluir_cadeira(cadeira_id):
    # preparar uma resposta otimista
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    try:
        # excluir a cadeira do ID informado
        Cadeira.query.filter(Cadeira.id == cadeira_id).delete()
        # confirmar a exclusão
        db.session.commit()
    except Exception as e:
        # informar mensagem de erro
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # responder!

@app.route("/listar_inspecao")
def listar_inspecao():
    inspecao_cadeiras = db.session.query(InspecaoRealizada).all()
    inspecao_em_json = [ x.json() for x in inspecao_cadeiras ]
    # converter a lista do python para json
    resposta = jsonify(inspecao_em_json)
    # PERMITIR resposta para outras pedidos oriundos de outras tecnologias
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # retornar...

@app.route("/incluir_inspecao", methods=['post'])
def incluir_inspecao():

    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json() #(force=True) dispensa Content-Type na requisição
    try: 
      nova = InspecaoRealizada(**dados) # criar a nova cadeira
      db.session.add(nova) # adicionar no BD
      db.session.commit() # efetivar a operação de gravação
    except Exception as e: # em caso de erro...
      # informar mensagem de erro
      resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # responder!

# teste: curl -X DELETE http://localhost:5000/excluir_cadeira/1
@app.route("/excluir_inspecao/<int:inspecao_id>", methods=['DELETE'])
def excluir_inspecao(inspecao_id):
    # preparar uma resposta otimista
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    try:
        # excluir a cadeira do ID informado
        InspecaoRealizada.query.filter(InspecaoRealizada.id == inspecao_id).delete()
        # confirmar a exclusão
        db.session.commit()
    except Exception as e:
        # informar mensagem de erro
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # responder!

@app.route("/listar_emprestimo")
def listar_emprestimo():
    emprestimo_cadeiras = db.session.query(EmprestimoCadeiras).all()
    emprestimo_em_json = [ x.json() for x in emprestimo_cadeiras ]
    # converter a lista do python para json
    resposta = jsonify(emprestimo_em_json)
    # PERMITIR resposta para outras pedidos oriundos de outras tecnologias
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # retornar...

@app.route("/incluir_emprestimo", methods=['post'])
def incluir_emprestimo():

    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json() #(force=True) dispensa Content-Type na requisição
    try: 
      nova = EmprestimoCadeiras(**dados) # criar a nova cadeira
      db.session.add(nova) # adicionar no BD
      db.session.commit() # efetivar a operação de gravação
    except Exception as e: # em caso de erro...
      # informar mensagem de erro
      resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # responder!

@app.route("/excluir_emprestimo/<int:emprestimo_id>", methods=['DELETE'])
def excluir_emprestimo(emprestimo_id):
    # preparar uma resposta otimista
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    try:
        # excluir a cadeira do ID informado
        EmprestimoCadeiras.query.filter(EmprestimoCadeiras.id == emprestimo_id).delete()
        # confirmar a exclusão
        db.session.commit()
    except Exception as e:
        # informar mensagem de erro
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    # adicionar cabeçalho de liberação de origem
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # responder!

''' teste da exclusão:
$ curl -X DELETE http://localhost:5000/excluir_cadeira/1
{
  "detalhes": "ok", 
  "resultado": "ok"
}
'''
app.run(debug=True)