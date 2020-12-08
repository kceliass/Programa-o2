from config import *

class Cadeira(db.Model):
    # atributos da cadeira
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(254))
    cor = db.Column(db.String(254))
    fabricante = db.Column(db.String(254))
    descricao= db.Column(db.String(254))
    material = db.Column(db.String(254))

    # método para expressar a cadeira em forma de texto
    def __str__(self):
        return f'''
                - Cadeira({self.id}) 
                - nome: {self.nome} 
                - cor: {self.cor} 
                - fabricante: {self.fabricante}
                - descrição: {self.descricao}
                - material: {self.material}
                '''
    # expressao da classe no formato json
    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cor": self.cor,
            "fabricante": self.fabricante,
            "descricao": self.descricao,
            "material": self.material
        }

class InspecaoRealizada(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(254)) # data da inspecao
    nome = db.Column(db.String(254)) # nome da inspecao
    resultado = db.Column(db.String(254)) # resultado da inspecao
    
    # atributo de chave estrangeira
    cadeira_id = db.Column(db.Integer, db.ForeignKey(Cadeira.id), nullable=False)
    # atributo de relacionamento, para acesso aos dados via objeto
    cadeira = db.relationship("Cadeira")

    def __str__(self): # expressão da classe em forma de texto
        return self.data + ", " + self.nome + ", " + self.resultado + \
            ", " + str(self.cadeira) # o str aciona o __str__ da classe Cadeira

    def json(self):
        return {
            "id":self.id,
            "data":self.data,
            "nome":self.nome,
            "resultado":self.resultado,
            "cadeira_id":self.cadeira_id,
            "cadeira":self.cadeira.json() 
        }

class EmprestimoCadeiras(db.Model):
    id = db.Column(db.Integer, primary_key=True) # id interno
    codigo = db.Column(db.String(254)) # código da cadeira
    data_aquisicao = db.Column(db.String(254))
    data_emprestimo = db.Column(db.String(254)) # emprestado? se sim, desde quando?

    # atributo de chave estrangeira
    cadeira_id = db.Column(db.Integer, db.ForeignKey(Cadeira.id))
    # atributo de relacionamento, para acesso aos dados via objeto
    cadeira = db.relationship("Cadeira")

    def __str__(self): # expressão da classe em forma de texto
        s = f"EmprestimoCadeira {self.codigo} adquirido em {self.data_aquisicao}"
        if self.cadeira != None:
            s += f", cadeira {self.cadeira} emprestada desde {self.data_aquisicao}"
        return s

    def json(self):
        if self.cadeira is None: # o equipamento está livre?
            cadeira_id = ""
            cadeira = ""
            data_emprestimo = ""
        else: # a cadeira está emprestada
            cadeira_id = self.cadeira_id
            cadeira = self.cadeira.json()
            data_emprestimo = self.data_emprestimo
            
        return {
            "id": self.id,
            "codigo": self.codigo,
            "data_aquisicao": self.data_aquisicao,
            "cadeira_id": cadeira_id,
            "cadeira": cadeira,
            "data_emprestimo": data_emprestimo
        } 

# teste    
if __name__ == "__main__":
    # apagar o arquivo, se houver
    if os.path.exists(arquivobd):
        os.remove(arquivobd)

    # criar tabelas
    db.create_all()

    # teste da classe Cadeira
    c1 = Cadeira(nome = "Thonet", cor = "Vermelho", fabricante = "Cavaletti", descricao = "Cadeira confortável", material = "Couro")
    c2 = Cadeira(nome = "Womb Chair", cor = "Preto", fabricante = "Jonas Cadeiras", descricao = "Cadeira durável", material = "Tecido")
    
    # persistir
    db.session.add(c1)
    db.session.add(c2)
    db.session.commit()
    
    # exibir a cadeira
    print(c2)

    # exibir a cadeira no format json
    print(c2.json())

    # novo resultado de exame
    e1 = InspecaoRealizada(data="02/02/2020", nome="Inspecao rodas", 
        resultado="Rodas em perfeito estado", cadeira=c1)
    db.session.add(e1)
    db.session.commit()
    print(f"Inspecao realizada: {e1}")
    print(f"Inspecao realizada em json: {e1.json()}")
    # resultado:
    # Inspecao realizada: 02/02/2020, Inspecao rodas, Rodas em perfeito estado, 
    #           - Cadeira(1)
    #            - nome: Thonet
    #            - cor: Vermelho
    #            - fabricante: Cavaletti
    #            - descrição: Cadeira confortável
    #            - material: Couro
    # Inspecao realizada em json: {'id': 1, 'data': '02/02/2020', 'nome': 'Inspecao rodas', 'resultado': 'Rodas em perfeito estado', 'cadeira_id': 1, 'cadeira': {'id': 1, 'nome': 'Thonet', 'cor': 'Vermelho', 'fabricante': 'Cavaletti', 'descricao': 'Cadeira confortável', 'material': 'Couro'}}

    r1 = EmprestimoCadeiras(codigo="001A", data_aquisicao="24/03/2020")
    db.session.add(r1)
    db.session.commit()
    print(f"Emprestimo de Cadeira 1: {r1}")
    print(f"Emprestimo de Cadeira 1 (em json): {r1.json()}")
    # resultado:
    # Emprestimo de Cadeira 1: EmprestimoCadeira 001A adquirido em 24/03/2020
    # Emprestimo de Cadeira 1 (em json): {'id': 1, 'codigo': '001A', 'data_aquisicao': '24/03/2020', 'cadeira_id': '', 'cadeira': '', 'data_emprestimo': ''}

    r2 = EmprestimoCadeiras(codigo="002B", data_aquisicao="01/02/2020", cadeira = c1, data_emprestimo="04/02/2020")
    db.session.add(r2)
    db.session.commit()
    print(f"Emprestimo de Cadeira 2: {r2}")
    print(f"Emprestimo de Cadeira 2 (em json): {r2.json()}")
    # resultado:
    # Emprestimo de Cadeira 2: EmprestimoCadeira 002B adquirido em 01/02/2020, cadeira
    #            - Cadeira(1)
    #            - nome: Thonet
    #            - cor: Vermelho
    #            - fabricante: Cavaletti
    #            - descrição: Cadeira confortável
    #            - material: Couro
    #             emprestada desde 01/02/2020
    # Emprestimo de Cadeira 2 (em json): {'id': 2, 'codigo': '002B', 'data_aquisicao': '01/02/2020', 'cadeira_id': 1, 'cadeira': {'id': 1, 'nome': 'Thonet', 'cor': 'Vermelho', 'fabricante': 'Cavaletti', 'descricao': 'Cadeira confortável', 'material': 'Couro'}, 'data_emprestimo': '04/02/2020'}