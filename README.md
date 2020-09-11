BlogWeb 


Sobre:
O BlogWeb é um site de a onde as pessoas vão poder postar conteudo sobre qualquer coisa, tipo, coisa sobre programação, estudo de escola, 
notisias sobre o mundo e etc. 






Inicio do projeto:

esse projeto teve início quando eu me aprofundei no estudo sobre NodeJs e comecei a estudar MongoDB com mongoose.


Meus desafios: 

[1] o meu primeiro desafio, foi na hora de escolher SQL ou MongoDB.

[2] segundo desafio, eu não sabia como lidar com a estrutudo de pasta do projeto.

[3] faser um estilo pro site.

[4] escolher o nunjuck ou handlebars.

[5] criar model de Categorias e formulário de nova categoria.

[6] foi listar as Categorias.

[7] fazer a edição de categoria.

[8] fazer botão de deletar categoria e postagens.

[9] listar as postagens na rota principal. 

[10] fazer a parte do conteudo da postagens.

[11] fazer uma busca de postagens pelo slug da categoria.

[12] listar só as postagens da aquela categoria.

[13] fazer o formulário de registro.

[14] salvar os dados do formulário de registro no banco de dados.

[15] faser hash da senha com bcryptjs.

[16] congigurar o passport 

[17] fazer a autenticação do usuario.



Como resulvi:

[1] eu estava com muita duvita em qual user, o SQL ou MongoDB, por fim acabei usando o MongoDB e comecei o meu estudo de mongoose.

[2] não sabia muito como organizar os meus arquivo e pasta do meus projeto, mas acabei ficando com uma estrutura bem simples boa. 

[3] não sabia muito como eu ai fazer o estilo do meu site e dando uma pesquisada no google acabei achado o bootstrap que me ajudou muito.

[4] estava com duvias em qual escolher, o nunjuck que eu já sabia como usar, ou o handlebars que um amigo me falou sobre, acabei usando o handlebars e iníciem o meu estudo de handlabars.

[5] para criar o model de categoria, foi  dificel porque eu nunca dinha mexedo com o mongoose, mas dando uma olhada na documentação do mongoose acabei conseguindo.

[6] isso me deu muitos problemas, porque o handlebars não estava conseguindo pegar os dados do banco de dados que estava como Arry, ai eu tive que usar a função map() para percorre em todo o Arry e tranformar em um JSON com a função toJSON()

[7] nessa parte não foi tão dificel, mas custo um tempo da minha vida, eu só tinha que atualizar os dados que já estavão salvos no bando de dados.

[8] na parte do butão para de deletar categoria e postagens eu tinha que usar o remove() e passar os parametros:
Categoria.remove({_id: req.params.id})

[9] foi um desafil bem simples para listar as postagens com as categorias, so tive que usar o populate() e passar a collection que ia usar,
no caso eu coloquei assim : Postagens.find().populate("categotia")

[10] na hora de fazer a busca do conteudo pelo slug da postagens eu só tive que usar: Postagens.findOne({_id: req.params.slug}).... 