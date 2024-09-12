// nessa variavel eu estou inportando do pacote inquirer uma pasta e dentro da pasta eu peguei um arquivo especifico que e um objeto chamado {select}
const { select, input, checkbox } = require('@inquirer/prompts');

let metas = []

async function cadastrarMeta() {
    const meta = await input({message:"Digite a meta"})
    if(meta.length == 0){
        console.log(' A meta não pode ser vazia.')
        return cadastrarMeta()
    }else if(meta.length <= 5){
        console.log(' A meta não pode ser menor que 5 caracteres.')
        return cadastrarMeta()
    }
    metas.push(
        { value: meta, checked:false}

    )
}

async function listarMetas(){
    if(metas.length == 0){
        console.log("Não existe nenhuma meta no momento")
        return
    }
    const respostas = await checkbox({
        message:"use as setas para mudar de meta, o espaço para marcar ou desmarcar e o  Enter para finalizar essa etapa ",
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
       console.log("nenhuma meta está aberta! :)")
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
        console.log("Não existe metas realizadas :(")
        return
    }
    await select({
        message:"Metas Realizadas "+ realizadas.length,
        choices:[...realizadas]
    })
}

// inicio a função / o async me permite utilizar o (await / esperar) na função
async function start () {
    
    // crio a estrutura de repetição (enquanto)
    while (true) {
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
            break
        // caso
        case "listarMetas":
            await listarMetas()
            break
        // caso
        case "Abertas":
            await metasAbertas()
            break
        // caso
        case "Realizadas":
            await metasRealizadas()
            break
        // caso para sair com a variavel sair e o return para parar a estrutura de repetição
        case "sair":
            console.log("Nós vemos na próxima")
            return
    }
}
}
start()