// nessa variavel eu estou inportando do pacote inquirer uma pasta e dentro da pasta eu peguei um arquivo especifico que e um objeto chamado {select}
const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require ("fs").promises

let mensagem= "   Bem vindo ao app de metas";
let mensagem1;
let metas = []

async function carregarMetas(){
    try{
        const dados = await fs.readFile("metas.json","utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

async function salvarMetas() {
    await fs.writeFile("metas.json", JSON.stringify(metas, null,2))
}

async function cadastrarMeta() {
    const meta = await input({message:"Digite a meta: "})
    if(meta.length == 0){
        console.log(' A meta não pode ser vazia.')
        return cadastrarMeta()
    }else if(meta.length <= 3){
        console.log(' A meta não pode conter menos de 3 caracteres.')
        return cadastrarMeta()
    }
    metas.push(
        { value: meta, checked:false}

    )
    mensagem = " Meta cadastrada com sucesso! :)"
}

async function listarMetas(){
    if(metas.length == 0){
        console.log("Não existe nenhuma meta no momento")
        return
    }
    const respostas = await checkbox({
        message:"use as (setas) para mudar de meta, o (espaço) para marcar ou desmarcar e o (Enter) para finalizar essa etapa ",
        choices:[...metas],
        instructions:false,
    })
    metas.forEach((m)=>{
        m.checked=false
    })
    if(respostas.length == 0){
        console.log("nenhuma meta selecionada")
        return
    }
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })
    console.log('Meta(s) concluídas')
}

async function metasAbertas(){
    const Abertas = metas.filter((meta)=>{
        return meta.checked != true
    })
    if(Abertas.length == 0){
       mensagem = "  Nenhuma meta está aberta! :)"
       return  
    }
    await select ({
        message:"Metas Abertas",
        choices:[...Abertas]
    })
}

async function metasRealizadas() {
    const realizadas= metas.filter((meta)=>{
        return meta.checked
    })
    if (realizadas.length == 0){
        mensagem = "  Não existe metas realizadas :("
        return
    }
    await select({
        message:"Metas Realizadas: "+ realizadas.length,
        choices:[...realizadas]
    })
}
async function deletarMeta(){
    if(metas.length == 0){
        mensagem = "Não existe nenhuma meta no momento"
        return
    }

    const metasDesmarcadas= metas.map((meta)=>{
        return {value: meta.value, checked: false}
    })
    const itensDeletar = await checkbox({
        message:"Selecione uma meta para deletar",
        choices:[...metasDesmarcadas],
        instructions:false,
    }) 
    if(itensDeletar.length == 0){
        console.log("Nenhum item a deletar! ")
        return
    }
    itensDeletar.forEach((item)=>{
        metas = metas.filter((meta)=>{
            return meta.value != item
        })
    })
    mensagem = "Metas(s) deleta(s) com sucesso!"
}

function mostrarMensagem(){
    console.clear();
    if(mensagem != ""){
        console.log("")
        console.log(mensagem1)
        console.log(mensagem)
        console.log(mensagem1)
        console.log("")
        mensagem = ""
    }
}

// inicio a função / o async me permite utilizar o (await / esperar) na função
async function start () {
    console.log("")
    mensagem1 = "|-----------------------------|"
    await carregarMetas()
    // crio a estrutura de repetição (enquanto)
    while (true) {
        mostrarMensagem()
        // crio uma variavel opção que espera o usuario escolher qual item da lista quer e guarda a opção escolhida
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrarMeta"
                    },
                {
                    name: "Listar Metas",
                    value:"listarMetas"
                },
                {
                    name: "Metas Abertas",
                    value:"Abertas"
                },
                {
                    name: "Metas Realizadas",
                    value:"Realizadas"
                },
                {
                    name: "Deletar Meta",
                    value:"deletar"
                },
                {
                    name:"Sair",
                    value:"sair"
                    }
            ]
    })
    // crio as opções apartir do switch que me permite criar casos
    switch (opcao) {
        // caso
        case "cadastrarMeta":
            await cadastrarMeta()
            console.log(metas)
            await salvarMetas()
            break
        // caso
        case "listarMetas":
            await listarMetas()
            await salvarMetas()
            break
        // caso
        case "Abertas":
            await metasAbertas()
            break
        // caso
        case "Realizadas":
            await metasRealizadas()
            break
        // caso
        case "deletar":
            await deletarMeta()
            await salvarMetas()
            break
        // caso para sair com a variavel sair e o return para parar a estrutura de repetição
        case "sair":
            console.log("Nós vemos na próxima")
            return
        }
        console.log("")
    mensagem1 = "|-----------------------------|"
}
}
start()