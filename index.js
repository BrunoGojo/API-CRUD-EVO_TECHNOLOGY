const { error } = require("console");
const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express();
const port = 3000;
const db = new sqlite.Database("database.db");

db.serialize(() => {
	db.run(
		"CREATE TABLE IF NOT EXISTS Usuario (Cpf_usuario CHAR(11) PRIMARY KEY, curso VARCHAR(28) NOT NULL DEFAULT 'Indefinido', telefone VARCHAR(13) NOT NULL, email VARCHAR(80) UNIQUE NOT NULL, nome VARCHAR(50) NOT NULL, sexo CHAR(1) NOT NULL CHECK(sexo='M' OR sexo='F'),data_nascimento DATE NOT NULL)");
	
	db.run("CREATE TABLE IF NOT EXISTS Professor (Cpf_professor CHAR(11) PRIMARY KEY, data_nascimento_professor DATE NOT NULL, nome VARCHAR(50) NOT NULL, sexo CHAR(1) NOT NULL CHECK (sexo='M' OR sexo='F'), email VARCHAR(80) UNIQUE NOT NULL, telefone VARCHAR(13) NOT NULL, especializacao VARCHAR(28) NOT NULL)");
});

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Estou na minha API");
});

app.get("/Usuarios", (req, res) => {
	db.all("SELECT * FROM Usuario", (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});

app.get("/Professores", (req, res) => {
	db.all("SELECT * FROM Professor", (error, rows) => {
		if(error){
			res.send(error);
		}
		res.send(rows);
	})
})


// pegar por ID

app.get("/Usuarios/:Cpf_usuario", (req, res) => {
	//A const CPF sigfinifica o ID do determinado usuario e colocar a variavel no parametro do db.all
	const cpf = req.params.Cpf_usuario;
	db.all("SELECT * FROM Usuario WHERE Cpf_usuario = ?", cpf, (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	});
});

app.get("/Professores/:Cpf_professor", (req, res) => {
	const cpf_professor = req.params.Cpf_professor;
	db.all("SELECT * FROM Professor WHERE Cpf_professor = ?", cpf_professor, (error, rows) => {
		if (error) {
			res.send(error);
		}
		res.send(rows);
	})
})

// APP POST

app.post("/Usuarios", (req, res) => {
	const { Cpf_usuario, curso, telefone, email, nome, sexo, data_nascimento } = req.body;
	console.log(req.body);

	if (!Cpf_usuario || !curso || !telefone || !email || !nome || !sexo || !data_nascimento) {
		res.send("Dados incompletos");
		return;
	} else {
		db.run(
			"INSERT INTO Usuario (Cpf_usuario, curso, telefone, email, nome, sexo, data_nascimento) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[Cpf_usuario, curso, telefone, email, nome, sexo, data_nascimento],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				res.send(`Usuário: ${nome} cadastrado com sucesso`);
			},
		);
	}
});

app.post("/Professores", (req, res) => {
	const { Cpf_professor, data_nascimento_professor, nome, sexo, email, telefone, especializacao } = req.body;
	if(!Cpf_professor || !data_nascimento_professor || !nome || !sexo || !email || !telefone || !especializacao){
		res.send("Dados incompletos");
		return;
	} else {
		db.run("INSERT INTO Professor (Cpf_professor, data_nascimento_professor, nome, sexo, email, telefone, especializacao) VALUES (?, ?, ?, ?, ?, ?, ?)", [Cpf_professor, data_nascimento_professor, nome, sexo, email, telefone, especializacao], (error) => {
				if (error) {
					res.send(error);
					return;
				}
				console.log(req.body);
				res.send(`Professor: ${nome} cadastrado com sucesso`);
			},
		)
	}
})

// APP PUT



app.put("/Professores/:Cpf_professor", (req, res) => {
	const cpf_professor = req.params.Cpf_professor;
	const { data_nascimento_professor, nome, sexo, email, telefone, especializacao } = req.body;
	if(!data_nascimento_professor || !nome || !sexo || !email || !telefone || !especializacao) {
		res.send("Dados incompletos");
		return;
	} else {
		db.run("UPDATE Professor SET data_nascimento_professor = ?, nome = ?, sexo = ?, email = ?, telefone = ?, especializacao = ? WHERE Cpf_professor = ?", [data_nascimento_professor, nome, sexo, email, telefone, especializacao, cpf_professor], (error) => {
			if (error) {
				res.send(error);
				return;
			}
			res.send(`Professor: ${nome} atualizado com sucesso`);
		})
	}
})

// APP PATCH

app.patch("/Usuarios/:Cpf_usuario", (req, res) =>{
	//A const CPF sigfinifica o ID do determinado usuario e colocar a variavel no parametro do db.run WHERE
	const cpf = req.params.Cpf_usuario;
	const { curso, telefone, email, nome, sexo, data_nascimento } = req.body;
	if (!curso || !telefone || !email || !nome || !sexo || !data_nascimento){
		res.send("Dados incompletos");
		return;
	}else{
		db.run(
			"UPDATE Usuario SET curso = ?, telefone = ?, email = ?, nome = ?, sexo = ?, data_nascimento = ? WHERE Cpf_usuario = ?", 
			[curso, telefone, email, nome, sexo, data_nascimento, cpf],
			(error) => {
				if (error) {
					res.send(error);
					return;
				}
				res.send(`Usuário: ${nome} atualizado com sucesso`);
			},
		);
	}
})

app.patch("/Professores/:Cpf_professor", (req, res) => {
	const cpf_professor = req.params.Cpf_professor;
	const { data_nascimento_professor, nome, sexo, email, telefone, especializacao } = req.body;
	if(!data_nascimento_professor || !nome || !sexo || !email || !telefone || !especializacao){
		res.send("Dados incompletos");
		return;
	} else {
		db.run("UPDATE Professor SET data_nascimento_professor = ?, nome = ?, sexo = ?, email = ?, telefone = ?, especializacao = ? WHERE Cpf_professor = ?", [curso, telefone, email, nome, sexo, data_nascimento, cpf_professor], (error) => {
			if(error) {
				res.send(error);
				return;
			}
			res.send(`Professor: ${nome} atualizado com sucesso`);
		})
	}
})

// APP DELETE

app.delete("/Usuarios/:Cpf_usuario", (req, res) =>{
	//A const CPF sigfinifica o ID do determinado usuario e colocar a variavel no parametro do db.run WHERE
	const cpf = req.params.Cpf_usuario;
	db.run("DELETE FROM Usuario WHERE Cpf_usuario = ?", cpf, (error) => {
		if (error) {
			res.send(error);
			return;
		}
		res.send(`Usuário deletado com sucesso`);
	});
})

app.delete("/Professores/:Cpf_professor", (req, res) => {
	const cpf_professor = req.params.Cpf_professor;
	db.run("DELETE FROM Professor WHERE Cpf_professor = ?", cpf_professor, (error) => {
		if (error) {
			res.send(error);
			return;
		}
		res.send(`Professor deletado com sucesso`);
	})
})

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
