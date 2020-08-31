from config import *

class Cadeira(db.Model):
    # atributos da pessoa
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(254))
    cor = db.Column(db.String(254))
    fabricante = db.Column(db.String(254))
    descricao= db.Column(db.String(254))
    material = db.Column(db.String(254))

    # método para expressar a pessoa em forma de texto
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

# teste    
if __name__ == "__main__":
    # apagar o arquivo, se houver
    if os.path.exists(arquivobd):
        os.remove(arquivobd)

    # criar tabelas
    db.create_all()

    # teste da classe Pessoa
    p1 = Cadeira(nome = "Thonet", cor = "Vermelho", fabricante = "Cavaletti", descricao = "Cadeira confortável", material = "Couro")
    p2 = Cadeira(nome = "Womb Chair", cor = "Preto", fabricante = "Jonas Cadeiras", descricao = "Cadeira durável", material = "Tecido")
    
    # persistir
    db.session.add(p1)
    db.session.add(p2)
    db.session.commit()
    
    # exibir a pessoa
    print(p2)

    # exibir a pessoa no format json
    print(p2.json())