/**
 * US63 (RF4812, RN15, RNF05, RNF16) — Texto dos Termos de Uso e da Política de Privacidade.
 *
 * Fonte única do texto exibido em /termos-de-uso e /politica-de-privacidade. O espelho para
 * revisão fica em docs/legal/; altere os dois juntos.
 *
 * Marcações inline:
 *   **texto**   → destaque
 *   [[texto]]   → pendência institucional/jurídica, exibida em destaque e contada na página.
 *                 Publicar oficialmente exige zero pendências (ver contarPendencias).
 *
 * A versão abaixo deve ser igual a TERMOS_VERSAO_ATUAL no backend: a página avisa se divergir.
 */

export const VERSAO_DOCUMENTOS_LEGAIS = '1.0'

export type BlocoDocumento =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: 'tabela'; legenda: string; cabecalho: string[]; linhas: string[][] }

export interface SecaoDocumento {
  id: string
  titulo: string
  blocos: BlocoDocumento[]
}

export interface DocumentoLegal {
  titulo: string
  caminho: string
  vigencia: string
  resumo: string[]
  secoes: SecaoDocumento[]
  historico: string
}

const p = (texto: string): BlocoDocumento => ({ tipo: 'paragrafo', texto })
const lista = (...itens: string[]): BlocoDocumento => ({ tipo: 'lista', itens })

const CANAL = '[[Preencher: e-mail oficial de atendimento]]'
const VIGENCIA = '[[Preencher: data de publicação]]'

export const TERMOS_DE_USO: DocumentoLegal = {
  titulo: 'Termos de Uso',
  caminho: '/termos-de-uso',
  vigencia: VIGENCIA,
  resumo: [
    'O Space Jam organiza o **acompanhamento esportivo de basquete** entre **um treinador** e os **atletas (alunos)** que ele acompanha.',
    'Para usar, você precisa **criar uma conta** e **aceitar estes Termos e a Política de Privacidade**. Sem esse aceite, as funções ficam bloqueadas.',
    'Nesta versão, **apenas maiores de 18 anos** podem criar conta de aluno.',
    '**Sua conta é pessoal**: não compartilhe sua senha.',
    '**O Space Jam não é serviço médico** e não substitui a avaliação de um profissional de saúde.',
    'Quando estes Termos mudarem, você precisará **aceitar a nova versão** para continuar.',
    'Você pode **pedir a exclusão da sua conta** a qualquer momento.',
  ],
  secoes: [
    {
      id: 'quem-somos',
      titulo: '1. Quem somos e o que estes Termos regulam',
      blocos: [
        p('1.1. O **Space Jam** é uma plataforma on-line que reúne as informações usadas no acompanhamento esportivo de atletas de basquete por um treinador.'),
        p('1.2. A plataforma é disponibilizada por:'),
        lista(
          '**Responsável:** [[Preencher: nome completo ou razão social]]',
          '**CPF/CNPJ:** [[Preencher: CPF ou CNPJ]]',
          '**Endereço:** [[Preencher: endereço]]',
          `**Canal de atendimento:** ${CANAL}`,
        ),
        p('1.3. Estes Termos regulam o uso da plataforma por **Alunos** e pelo **Treinador** (em conjunto, "Usuários"). O tratamento de dados pessoais é descrito na **Política de Privacidade**, que faz parte destes Termos.'),
      ],
    },
    {
      id: 'aceite',
      titulo: '2. Aceite',
      blocos: [
        p('2.1. O aceite é feito marcando a opção **"Li e aceito os Termos de Uso e a Política de Privacidade"** no cadastro ou, para contas já existentes, na tela de atualização exibida no acesso.'),
        p('2.2. **Sem o aceite da versão vigente:**'),
        lista(
          'no cadastro, a conta **não é criada**;',
          'em contas existentes, as funções da plataforma ficam **bloqueadas**. Você continua podendo ler os documentos, aceitar ou sair da conta.',
        ),
        p('2.3. Se os documentos vigentes estiverem **indisponíveis para leitura**, o aceite não é oferecido e o acesso permanece bloqueado até que voltem a ser publicados. Você pode voltar à tela de login.'),
        p('2.4. Registramos **a versão aceita, a data e a hora** de cada aceite e se ele ocorreu no cadastro ou depois. Os detalhes estão na Política de Privacidade.'),
        p('2.5. Os Termos de Uso e a Política de Privacidade têm **um único número de versão**. Aceitar uma versão significa aceitar os dois documentos nessa versão.'),
      ],
    },
    {
      id: 'cadastro',
      titulo: '3. Quem pode usar e como criar a conta',
      blocos: [
        p('3.1. **Treinador.**'),
        lista(
          'A plataforma tem **um único Treinador**.',
          'A conta de Treinador só é criada com o **código de ativação** entregue na implantação do sistema. Depois do primeiro cadastro, não é possível criar outra conta de Treinador.',
          'Ao concluir o cadastro, o sistema gera o **código de convite** do Treinador, exibido no perfil dele, que os Alunos usam para se cadastrar.',
          'Dados exigidos: nome, sobrenome, apelido, e-mail, telefone e senha.',
        ),
        p('3.2. **Aluno.**'),
        lista(
          'O Aluno cria a conta informando o **código de convite do Treinador** e passa a integrar automaticamente a lista de alunos acompanhados por ele.',
          'Dados exigidos: nome, sobrenome, apelido, e-mail, data de nascimento, altura, peso, envergadura, frequência semanal de atividade física (de 1 a 7 dias), objetivos e senha. O telefone é opcional.',
        ),
        p('3.3. **Idade mínima.** Nesta versão, **apenas pessoas com 18 anos ou mais** podem criar conta. O cadastro de menores depende de um processo de autorização do responsável legal que **ainda não está disponível**. Se for identificada uma conta criada por menor de 18 anos, ela poderá ser suspensa e os dados eliminados, conforme a Política de Privacidade.'),
        p('3.4. **Dados verdadeiros.** Você se compromete a informar dados **verdadeiros, próprios e atualizados**. Medidas incorretas prejudicam o planejamento feito pelo Treinador.'),
      ],
    },
    {
      id: 'conta',
      titulo: '4. Conta, acesso e segurança',
      blocos: [
        p('4.1. O **Aluno** entra com **apelido e senha**; o **Treinador**, com **e-mail e senha**. Apelido e e-mail são **únicos** na plataforma.'),
        p('4.2. A senha deve ter **pelo menos 6 caracteres**. Recomendamos uma senha que você não use em outros serviços.'),
        p('4.3. **A conta é pessoal e intransferível.** O que for feito com o seu login é considerado feito por você. Avise imediatamente pelo canal de atendimento se suspeitar de uso indevido.'),
        p('4.4. Por segurança, a sessão **expira automaticamente** e **"Sair da conta"** encerra o acesso também no servidor.'),
        p('4.5. A recuperação e a troca de senha pela própria plataforma **ainda não estão disponíveis**. Até lá, peça ajuda pelo canal de atendimento.'),
      ],
    },
    {
      id: 'permissoes',
      titulo: '5. O que cada perfil pode fazer nesta versão',
      blocos: [
        {
          tipo: 'tabela',
          legenda: 'Ações disponíveis para Aluno e Treinador nesta versão',
          cabecalho: ['Ação', 'Aluno', 'Treinador'],
          linhas: [
            ['Consultar os próprios dados de cadastro', 'Sim', 'Sim'],
            ['Consultar dados de outros Alunos', '**Não**', 'Somente dos Alunos vinculados a ele'],
            ['Editar os próprios dados pela plataforma', 'Ainda não disponível (pedir pelo canal de atendimento)', 'Ainda não disponível (pedir pelo canal de atendimento)'],
            ['Registrar histórico de lesões e testes físicos', 'Não', 'Ainda não disponível'],
            ['Excluir a própria conta', 'Por solicitação (seção 9)', 'Por solicitação (seção 9)'],
          ],
        },
        p('5.1. Um Aluno **nunca** acessa dados de outro Aluno, mesmo que ambos tenham o mesmo Treinador.'),
      ],
    },
    {
      id: 'regras',
      titulo: '6. Regras de uso',
      blocos: [
        p('Ao usar o Space Jam, você se compromete a:'),
        lista(
          'usar a plataforma **apenas para o acompanhamento esportivo**;',
          '**não tentar acessar** contas, dados ou áreas que não sejam seus;',
          '**não prejudicar o funcionamento** da plataforma (por exemplo, com tentativas de invasão, exploração de falhas ou envio automatizado de requisições);',
          '**não inserir** conteúdo ilícito, ofensivo ou que viole direitos de terceiros;',
          '**tratar com respeito** o Treinador e os demais Alunos.',
        ),
      ],
    },
    {
      id: 'limites',
      titulo: '7. Limites do acompanhamento esportivo',
      blocos: [
        p('7.1. **O Treinador planeja e decide os treinos.** O Space Jam organiza as informações e **não faz recomendações automáticas**, diagnósticos nem decisões sobre o seu treinamento.'),
        p('7.2. **O Space Jam não presta serviço médico ou de saúde** e não substitui avaliação médica, fisioterapêutica ou nutricional. Antes de iniciar ou intensificar atividades físicas, e sempre que sentir dor, desconforto ou suspeitar de lesão, **procure um profissional de saúde**.'),
        p('7.3. O Treinador é responsável pela orientação técnica que presta e pela sua habilitação profissional, quando exigida em lei. [[Validação jurídica]]'),
        p('7.4. A plataforma **complementa** o acompanhamento presencial e não o substitui.'),
      ],
    },
    {
      id: 'disponibilidade',
      titulo: '8. Disponibilidade e recursos futuros',
      blocos: [
        p('8.1. Empregamos esforços razoáveis para manter a plataforma disponível, mas ela pode ficar **temporariamente fora do ar** por manutenção, atualização ou falhas técnicas, sem garantia de funcionamento ininterrupto. [[Decidir: compromisso de disponibilidade, se houver]]'),
        p('8.2. Recursos como planejamento de treinos, biblioteca de exercícios, vídeos de execução, feedbacks, testes físicos e histórico de lesões **ainda não estão disponíveis**. Quando forem liberados, estes Termos e a Política de Privacidade **serão atualizados** e uma **nova versão precisará ser aceita**.'),
      ],
    },
    {
      id: 'encerramento',
      titulo: '9. Suspensão e encerramento',
      blocos: [
        p('9.1. **Por você:** você pode pedir a **exclusão da sua conta** a qualquer momento pelo canal de atendimento. Enquanto a exclusão pela própria plataforma não estiver disponível, ela é feita pelo responsável em até [[Preencher: prazo, sugestão de 15 dias]]. A exclusão é **irreversível**.'),
        p('9.2. **Pelo Treinador:** o Treinador pode pedir a remoção do perfil de um Aluno que **não acompanha mais**.'),
        p('9.3. **Pelo responsável pela plataforma:** a conta pode ser **suspensa ou encerrada** em caso de descumprimento destes Termos, uso fraudulento, risco à segurança, cadastro de menor de 18 anos ou determinação legal. Sempre que possível e sem risco, você será informado do motivo e poderá apresentar esclarecimentos pelo canal de atendimento. [[Decidir: quem decide a suspensão e o prazo para esclarecimentos]]'),
        p('9.4. Após a exclusão, os dados são tratados como descrito na Política de Privacidade.'),
        p('9.5. [[Decidir: o que acontece com as contas e os dados dos Alunos se a conta do Treinador for encerrada]]'),
      ],
    },
    {
      id: 'propriedade-intelectual',
      titulo: '10. Propriedade intelectual',
      blocos: [
        p('10.1. O software, a marca "Space Jam", a identidade visual e os textos da plataforma pertencem a [[Preencher: titular do software e da marca]] e são protegidos pela legislação de propriedade intelectual. O uso da plataforma não transfere esses direitos a você.'),
        p('10.2. **Os dados que você registra continuam sendo seus.** Você autoriza o seu armazenamento e a sua exibição **apenas** para o funcionamento da plataforma, como descrito na Política de Privacidade.'),
      ],
    },
    {
      id: 'responsabilidades',
      titulo: '11. Responsabilidades',
      blocos: [
        p('11.1. Cada Usuário é responsável pela veracidade dos dados que informa, pela guarda da sua senha e pelo uso da sua conta.'),
        p('11.2. O responsável pela plataforma responde pela proteção dos dados nos termos da LGPD e adota as medidas de segurança descritas na Política de Privacidade.'),
        p('11.3. O responsável pela plataforma não responde por decisões de treino tomadas pelo Treinador ou pelo Aluno, nem por danos decorrentes de dados falsos informados pelo Usuário ou do uso em desacordo com estes Termos. [[Validação jurídica]]'),
        p('11.4. Nada nestes Termos afasta direitos garantidos pelo **Código de Defesa do Consumidor**, quando aplicável. [[Preencher: informar se o serviço é gratuito ou pago]]'),
      ],
    },
    {
      id: 'alteracoes',
      titulo: '12. Alterações destes Termos',
      blocos: [
        p('12.1. Quando estes Termos ou a Política de Privacidade mudarem, **o número da versão será atualizado** e a data de vigência informada no topo.'),
        p('12.2. No acesso seguinte, você verá a nova versão e **precisará aceitá-la para continuar** usando a plataforma. Se não concordar, pode sair da conta e pedir a exclusão.'),
        p('12.3. Se você estiver lendo uma versão anterior quando uma nova for publicada, o aceite da versão antiga **não será registrado** e a versão vigente será exibida para um novo aceite.'),
      ],
    },
    {
      id: 'disposicoes-gerais',
      titulo: '13. Disposições gerais',
      blocos: [
        p('13.1. Se alguma cláusula for considerada inválida, as demais continuam válidas.'),
        p('13.2. A tolerância com o descumprimento de alguma regra não significa renúncia ao direito de exigi-la.'),
        p('13.3. Estes Termos são regidos pelas **leis brasileiras**, em especial o Marco Civil da Internet (Lei nº 12.965/2014), a LGPD (Lei nº 13.709/2018) e, quando aplicável, o Código de Defesa do Consumidor (Lei nº 8.078/1990).'),
        p('13.4. **Foro:** fica eleito o foro da comarca de [[Preencher: cidade/UF]], ressalvado o direito do consumidor de propor ação no foro do seu domicílio.'),
        p(`13.5. **Contato:** ${CANAL}`),
      ],
    },
  ],
  historico: `Versão ${VERSAO_DOCUMENTOS_LEGAIS}: primeira versão publicada.`,
}

export const POLITICA_DE_PRIVACIDADE: DocumentoLegal = {
  titulo: 'Política de Privacidade',
  caminho: '/politica-de-privacidade',
  vigencia: VIGENCIA,
  resumo: [
    'Usamos seus dados **só para o acompanhamento esportivo** no Space Jam.',
    '**O Aluno vê apenas os próprios dados. O Treinador vê apenas os dados dos Alunos vinculados a ele.**',
    '**Não vendemos, não alugamos e não usamos seus dados para publicidade.**',
    'O aplicativo **não usa cookies** e não tem scripts de estatística ou monitoramento.',
    'Sua senha é guardada de forma **irreversível**: ninguém consegue lê-la.',
    'Guardamos a **prova do seu aceite** (versão, data e hora).',
    'Você pode **consultar, corrigir e pedir a exclusão** dos seus dados.',
  ],
  secoes: [
    {
      id: 'controlador',
      titulo: '1. Quem é o controlador e como falar conosco',
      blocos: [
        p('1.1. O **controlador** dos seus dados pessoais, isto é, quem decide como eles são tratados (art. 5º, VI, da LGPD), é:'),
        lista(
          '**Nome/Razão social:** [[Preencher: nome completo ou razão social]]',
          '**CPF/CNPJ:** [[Preencher: CPF ou CNPJ]]',
          '**Endereço:** [[Preencher: endereço]]',
        ),
        p(`1.2. **Canal de privacidade:** ${CANAL}`),
        p('1.3. **Encarregado pelo tratamento de dados (DPO):** [[Preencher: nome e e-mail do encarregado, ou declarar a dispensa de agente de pequeno porte (Resolução CD/ANPD nº 2/2022, art. 11), mantido o canal acima]]'),
        p('1.4. **Operadores:** [[Preencher: quem trata dados em nome do controlador, por exemplo provedor de hospedagem e equipe de manutenção]]'),
      ],
    },
    {
      id: 'abrangencia',
      titulo: '2. A quem esta Política se aplica',
      blocos: [
        lista(
          '**Aluno (atleta):** pessoa com 18 anos ou mais que se cadastra com o código de convite do Treinador.',
          '**Treinador:** único treinador da plataforma, cadastrado com o código de ativação.',
          '**Visitante:** quem acessa as páginas públicas (login, cadastro, Termos de Uso e esta Política).',
        ),
      ],
    },
    {
      id: 'dados',
      titulo: '3. Dados que tratamos',
      blocos: [
        {
          tipo: 'tabela',
          legenda: 'Categorias de dados pessoais tratados, titulares e finalidades',
          cabecalho: ['Categoria', 'Dados', 'De quem', 'Para quê'],
          linhas: [
            ['Identificação e contato', 'Nome, sobrenome, apelido, e-mail, telefone', 'Aluno (telefone opcional) e Treinador (telefone obrigatório)', 'Criar e identificar a conta; contato sobre o acompanhamento'],
            ['Data de nascimento', 'Data de nascimento', 'Aluno', 'Confirmar a idade mínima de 18 anos; apoiar o acompanhamento'],
            ['Condicionamento físico e objetivos', 'Altura, peso, envergadura, frequência semanal de atividade física, objetivos', 'Aluno', 'Permitir que o Treinador planeje e acompanhe o treinamento'],
            ['Vínculo', 'Treinador vinculado; código de convite do Treinador', 'Aluno e Treinador', 'Incluir o Aluno na carteira do Treinador e isolar os dados de cada carteira'],
            ['Credencial', 'Senha, guardada só como resumo criptográfico (hash)', 'Aluno e Treinador', 'Autenticar o acesso'],
            ['Registro de aceite', 'Identificador do usuário, versão aceita, data, hora e origem (cadastro, aceite posterior ou migração de dados)', 'Aluno e Treinador', 'Comprovar o aceite e bloquear o acesso sem aceite da versão vigente'],
            ['Dados técnicos de sessão', 'Identificadores dos tokens de acesso, datas de emissão e expiração, data de criação da conta', 'Aluno e Treinador', 'Manter a sessão, encerrá-la ao sair da conta e proteger a conta'],
          ],
        },
        p('3.1. **O que não coletamos nesta versão:** histórico de lesões, testes físicos, vídeos, feedbacks, treinos, localização, contatos do seu celular ou dados para publicidade. Quando algum desses recursos for liberado, esta Política será atualizada e **você precisará aceitar a nova versão** antes de qualquer coleta.'),
        p('3.2. **Dados de saúde.** O histórico de lesões, quando existir, é **dado pessoal sensível** (art. 5º, II, da LGPD) e terá proteção e base legal específicas, informadas na nova versão desta Política. [[Validação jurídica: confirmar se altura, peso e envergadura, no contexto do acompanhamento esportivo, devem ser tratados como dados sensíveis]]'),
      ],
    },
    {
      id: 'bases-legais',
      titulo: '4. Por que podemos tratar seus dados (bases legais)',
      blocos: [
        {
          tipo: 'tabela',
          legenda: 'Finalidades do tratamento e bases legais da LGPD',
          cabecalho: ['Finalidade', 'Base legal (LGPD)'],
          linhas: [
            ['Cadastro, autenticação, vínculo com o Treinador e acompanhamento esportivo', '**Execução de contrato** do qual você é parte, isto é, os Termos de Uso (art. 7º, V)'],
            ['Confirmar a idade mínima', 'Execução de contrato (art. 7º, V) e melhor interesse de crianças e adolescentes (art. 14)'],
            ['Registro do aceite dos Termos e desta Política', '**Exercício regular de direitos** e comprovação do aceite (art. 7º, VI, e art. 8º, § 2º)'],
            ['Segurança da conta, controle de sessão e prevenção de fraudes', '**Legítimo interesse** (art. 7º, IX), limitado ao necessário, e dever de segurança (art. 46)'],
            ['Cumprimento de obrigação legal ou ordem de autoridade', '**Obrigação legal** (art. 7º, II)'],
            ['Recursos opcionais de estatística ou monitoramento (inexistentes hoje)', '**Consentimento** (art. 7º, I), revogável a qualquer momento'],
          ],
        },
        p('[[Validação jurídica: revisar o enquadramento das bases legais]]'),
      ],
    },
    {
      id: 'acesso',
      titulo: '5. Quem tem acesso aos seus dados',
      blocos: [
        p('5.1. **Você:** acessa os seus próprios dados.'),
        p('5.2. **O Treinador:** acessa os dados de cadastro, condicionamento físico e objetivos **apenas dos Alunos vinculados à carteira dele**. Um Treinador sem vínculo com você não tem acesso.'),
        p('5.3. **Outros Alunos:** **nunca** acessam seus dados.'),
        p('5.4. **Administração da plataforma:** [[Preencher: quem]] pode acessar dados apenas para suporte, manutenção, segurança e atendimento a pedidos de titulares, com dever de sigilo.'),
        p('5.5. **Hospedagem:** os dados ficam armazenados em [[Preencher: provedor de hospedagem]], com servidores em [[Preencher: país; se fora do Brasil, informar o mecanismo de transferência internacional (arts. 33 a 36 da LGPD)]].'),
        p('5.6. **Autoridades:** apenas mediante obrigação legal ou ordem judicial.'),
        p('5.7. **Não vendemos, não alugamos e não compartilhamos seus dados com anunciantes.**'),
      ],
    },
    {
      id: 'cookies',
      titulo: '6. Cookies e armazenamento no seu navegador',
      blocos: [
        p('6.1. **O aplicativo Space Jam não grava cookies** no navegador de Alunos e do Treinador.'),
        p('6.2. **O que fica guardado no armazenamento local (localStorage) do seu navegador, por ser necessário:**'),
        lista(
          'os **tokens da sua sessão**, para manter você conectado. Eles são apagados quando você sai da conta;',
          'a **sua escolha sobre recursos opcionais**, para que ela seja respeitada.',
        ),
        p('6.3. **Recursos opcionais (estatística ou monitoramento):**'),
        lista(
          '**hoje a plataforma não usa nenhum**;',
          'ficam **desativados até você permitir expressamente** em **Conta → Preferências de privacidade**, onde você também pode **revogar** a permissão quando quiser;',
          'a escolha vale **para o navegador em que foi feita**. Se você limpar os dados do navegador ou trocar de aparelho, volta ao padrão "não permitir";',
          'se algum recurso opcional for adotado, esta Política será atualizada antes, informando qual é, quem o fornece e para quê.',
        ),
        p('6.4. **Fontes tipográficas do Google.** Algumas telas carregam fontes dos servidores do **Google** (Google Fonts). Ao abrir essas telas, o seu navegador informa ao Google dados técnicos como o **endereço IP**, o que pode envolver **transferência internacional de dados**. O Space Jam não envia ao Google nenhum dado da sua conta. [[Decidir: hospedar as fontes no próprio Space Jam e remover este item, ou manter o carregamento pelo Google]]'),
        p('6.5. A área administrativa, de acesso restrito à administração da plataforma, usa cookies técnicos de sessão e de segurança, estritamente necessários ao seu funcionamento.'),
      ],
    },
    {
      id: 'seguranca',
      titulo: '7. Como protegemos seus dados',
      blocos: [
        lista(
          '**Senhas** são guardadas apenas como hash criptográfico com sal (PBKDF2-SHA256): nem a administração nem o Treinador conseguem lê-las, e elas nunca são exibidas.',
          '**Acesso só com login.** A sessão expira após **30 minutos** e pode ser renovada automaticamente por até **1 dia**. **"Sair da conta"** invalida a sessão também no servidor.',
          '**Separação por perfil e por vínculo:** permissões distintas para Aluno e Treinador e isolamento entre carteiras.',
          '**Sem aceite, sem acesso:** as funções ficam bloqueadas enquanto a versão vigente destes documentos não for aceita.',
          '**Registro de aceite protegido:** a aplicação **não permite alterar nem apagar** registros de aceite. Cada aceite é gravado uma única vez por versão.',
          '**Mensagens de erro de login** não revelam se o erro está no apelido/e-mail ou na senha.',
          '**Conexão criptografada (HTTPS)** em produção. [[Preencher: confirmar HTTPS no ambiente de produção]]',
        ),
        p('**Incidentes de segurança:** se ocorrer um incidente que possa causar risco ou dano relevante, comunicaremos a **ANPD** e os titulares afetados, conforme o art. 48 da LGPD.'),
      ],
    },
    {
      id: 'retencao',
      titulo: '8. Por quanto tempo guardamos seus dados',
      blocos: [
        p('8.1. Enquanto a sua conta existir.'),
        p('8.2. **Na exclusão da conta**, eliminamos os seus dados pessoais, **inclusive o histórico de aceite**, ressalvado o que a lei exigir guardar (art. 16 da LGPD). [[Decidir: manter assim ou guardar o histórico de aceite por um prazo definido após a exclusão]]'),
        p('8.3. **Cópias de segurança (backup):** são sobrescritas em até [[Preencher: prazo de retenção dos backups]]. [[Decidir: se há guarda de registros de acesso por 6 meses (art. 15 do Marco Civil da Internet)]]'),
      ],
    },
    {
      id: 'direitos',
      titulo: '9. Seus direitos e como exercê-los',
      blocos: [
        p('A LGPD (art. 18) garante a você:'),
        {
          tipo: 'tabela',
          legenda: 'Direitos do titular e como exercê-los',
          cabecalho: ['Direito', 'Como exercer'],
          linhas: [
            ['Confirmar se tratamos seus dados e acessá-los', 'Aluno: **Minha conta**. Ou pelo canal de privacidade'],
            ['Corrigir dados incompletos, inexatos ou desatualizados', 'Pelo canal de privacidade (a edição pela plataforma ainda não está disponível)'],
            ['Anonimizar, bloquear ou eliminar dados desnecessários ou excessivos', 'Pelo canal de privacidade'],
            ['**Excluir sua conta e seus dados**', 'Pelo canal de privacidade. Exclusão **irreversível**, feita em até [[Preencher: prazo]]'],
            ['Portabilidade dos dados', 'Pelo canal de privacidade'],
            ['Saber com quem compartilhamos', 'Seção 5 ou pelo canal de privacidade'],
            ['Revogar um consentimento', '**Conta → Preferências de privacidade** (recursos opcionais) ou pelo canal de privacidade'],
            ['Opor-se a tratamento irregular', 'Pelo canal de privacidade'],
            ['Peticionar à ANPD', 'www.gov.br/anpd'],
          ],
        },
        p('9.1. **Prazos:** a confirmação e o acesso em formato simplificado são atendidos **de imediato**; a declaração completa é enviada em até **15 dias** do pedido (art. 19 da LGPD).'),
        p('9.2. Para proteger você, podemos pedir confirmação de identidade antes de atender o pedido.'),
        p('9.3. **Decisões automatizadas:** o Space Jam **não toma decisões automatizadas** sobre você.'),
      ],
    },
    {
      id: 'menores',
      titulo: '10. Crianças e adolescentes',
      blocos: [
        p('10.1. **Nesta versão, apenas maiores de 18 anos podem se cadastrar.** O cadastro de menores exigirá o consentimento específico de pelo menos um responsável legal (art. 14 da LGPD), por um processo que **ainda não está disponível**.'),
        p('10.2. Se forem identificados dados de menor de 18 anos cadastrados em desacordo com esta regra, a conta poderá ser suspensa e os dados eliminados. Responsáveis podem pedir a eliminação pelo canal de privacidade.'),
      ],
    },
    {
      id: 'alteracoes',
      titulo: '11. Alterações desta Política',
      blocos: [
        p('11.1. Quando esta Política ou os Termos de Uso mudarem, **o número da versão é atualizado**. Os dois documentos compartilham a mesma versão.'),
        p('11.2. No acesso seguinte, você verá a nova versão e **precisará aceitá-la para continuar**. Guardamos o registro de cada aceite com versão, data e hora.'),
      ],
    },
    {
      id: 'contato',
      titulo: '12. Contato',
      blocos: [
        p(`Dúvidas, pedidos ou reclamações: ${CANAL}.`),
        p('Se não ficar satisfeito com a resposta, você pode procurar a **Autoridade Nacional de Proteção de Dados (ANPD)**.'),
      ],
    },
  ],
  historico: `Versão ${VERSAO_DOCUMENTOS_LEGAIS}: primeira versão publicada.`,
}

const MARCA_PENDENCIA = /\[\[[^\]]+\]\]/g

function textosDe(documento: DocumentoLegal): string[] {
  return [
    documento.vigencia,
    ...documento.resumo,
    ...documento.secoes.flatMap(secao => [secao.titulo, ...secao.blocos.flatMap(bloco => {
      if (bloco.tipo === 'paragrafo') return [bloco.texto]
      if (bloco.tipo === 'lista') return bloco.itens
      return [...bloco.cabecalho, ...bloco.linhas.flat()]
    })]),
  ]
}

/** Quantidade de pendências [[...]] ainda abertas. A publicação oficial exige zero. */
export function contarPendencias(documento: DocumentoLegal): number {
  return textosDe(documento).reduce((total, texto) => total + (texto.match(MARCA_PENDENCIA)?.length ?? 0), 0)
}
