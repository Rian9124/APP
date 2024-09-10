// inicio a função
function start(){
    // crio a estrutura de repetição (enquanto)
    while(true){
        // crio uma variavel para sair do lupin
        let opcao = "sair"
        // crio as opções apartir do switch que me permite criar casos
        switch(opcao){
            // caso
            case "cadastrar":
                console.log("Vamos cadastrar")
                break
            // caso
            case "listar":
                console.log("Vamos listar")
                break
            // caso para sair com a variavel sair e o return para parar a estrutura de repetição
            case "sair":
                return
        }
    }
}
start()