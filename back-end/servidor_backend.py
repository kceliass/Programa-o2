from config import *
from modelo import Cadeira

@app.route("/")
def inicio():
    return 'Sistema de cadastro de cadeiras. '+\
        '<a href="/listar_cadeiras">Operação listar</a>'

@app.route("/listar_cadeiras")
def listar_cadeiras():
    # obter as pessoas do cadastro
    cadeiras = db.session.query(Cadeira).all()
    # aplicar o método json que a classe Pessoa possui a cada elemento da lista
    cadeiras_em_json = [ x.json() for x in cadeiras ]
    # converter a lista do python para json
    resposta = jsonify(cadeiras_em_json)
    # PERMITIR resposta para outras pedidos oriundos de outras tecnologias
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta # retornar...

# teste da rota: curl -d '{"nome":"James Kirk", "telefone":"92212-1212", "email":"jakirk@gmail.com"}' -X POST -H "Content-Type:application/json" localhost:5000/incluir_pessoa
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

app.run(debug=True)