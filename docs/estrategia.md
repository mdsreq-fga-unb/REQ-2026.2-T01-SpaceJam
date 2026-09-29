## 4.1 Abordagem, Ciclo de Vida e Processo

| Elemento | Escolha |
|---|---|
| **Abordagem** | Híbrida |
| **Ciclo de Vida** | Iterativo e Incremental |
| **Processo** | Rapid Application Development (RAD) |

---

## 4.2 Comparação entre Processos

Para definir o processo de desenvolvimento mais adequado ao projeto Space Jam, foram analisados os processos **Rapid Application Development (RAD)** e **Extreme Programming (XP)**. A comparação considera as principais características dos dois processos e sua adequação ao contexto do projeto.

| Características | RAD | XP |
|---|---|---|
| **Abordagem Geral** | Desenvolvimento orientado à rapidez, prototipação, colaboração com usuários e refinamento progressivo da solução. | Desenvolvimento baseado em ciclos curtos, feedback frequente, simplicidade, adaptação e práticas técnicas de desenvolvimento. |
| **Foco em Arquitetura** | Prioriza a construção e evolução da solução por meio de protótipos e modelos necessários ao desenvolvimento. | Prioriza design simples e evolução contínua da estrutura do sistema, evitando planejamento excessivo antecipadamente. |
| **Estrutura de Processos** | Organiza-se em planejamento de requisitos, design do usuário, construção e implementação final, utilizando prototipação e refinamento. | Organiza o desenvolvimento em ciclos curtos, envolvendo planejamento, implementação, testes, integração e pequenas entregas. |
| **Flexibilidade de Requisitos** | Permite que os requisitos sejam refinados durante a prototipação e a partir do feedback dos usuários. | Permite mudanças frequentes nos requisitos ao longo dos ciclos de desenvolvimento. |
| **Colaboração com Cliente** | Possui forte participação do usuário em workshops, prototipação e validação das soluções. | Valoriza a participação do cliente na definição, priorização e validação das funcionalidades. |
| **Complexidade do Processo** | Enfatiza rapidez e prototipação, mas sua aplicação tradicional depende de participação frequente dos usuários. | Possui práticas bem definidas, mas exige disciplina e coordenação para manter sua aplicação contínua. |
| **Qualidade Técnica** | A prototipação e a validação frequente permitem identificar problemas de usabilidade e lacunas funcionais antecipadamente. | Possui forte ênfase em qualidade técnica por meio de testes, refatoração, integração contínua e programação em pares. |
| **Práticas de Desenvolvimento** | Prototipagem rápida, modelagem, colaboração com usuários, construção e refinamento progressivo. | Programação em pares, testes, integração contínua, refatoração, design simples e pequenas entregas. |
| **Adaptação ao Projeto do Space Jam** | Adequado à necessidade de validar interfaces e fluxos da aplicação, desde que a participação do cliente seja planejada de acordo com sua disponibilidade. | Possui práticas relevantes para a qualidade técnica, porém algumas exigem maior coordenação e disponibilidade dos integrantes. |
| **Documentação** | Prioriza os artefatos necessários para apoiar a comunicação, o desenvolvimento, a validação e a rastreabilidade do projeto. | Valoriza comunicação e código funcionando, mantendo a documentação formal reduzida. |
| **Controle de Qualidade** | Utiliza prototipação, revisão, validação e testes para identificar problemas e verificar se a solução atende aos requisitos. | Utiliza testes automatizados, testes de aceitação, integração contínua e refatoração como práticas centrais. |
| **Escalabilidade** | Pode apresentar limitações quando há grande complexidade ou quando a participação dos usuários não pode ser mantida com frequência. | É orientado a equipes colaborativas e possui práticas que podem ser difíceis de manter quando a coordenação entre os integrantes é limitada. |
| **Suporte às Equipes de Desenvolvimento** | Favorece equipes que conseguem trabalhar de forma colaborativa e realizar ciclos de prototipação e validação. | Favorece equipes pequenas e altamente colaborativas, com disponibilidade para aplicar continuamente suas práticas técnicas. |

Embora o RAD e o XP apresentem práticas diferentes, a escolha do RAD não impede que práticas técnicas do XP sejam incorporadas ao projeto quando forem consideradas adequadas. Práticas como **testes automatizados, integração contínua, revisão de código e refatoração** podem ser utilizadas de forma complementar, sem que a equipe adote o XP como processo principal.

---

## 4.3 Justificativa da Escolha

Após a comparação entre os processos **RAD** e **XP**, optou-se pelo **Rapid Application Development (RAD)**, integrado a uma **abordagem híbrida** e a um ciclo de vida **iterativo e incremental**, considerando as características do projeto, do cliente e da equipe.

- **Adequação ao projeto:** o Space Jam envolve informações de atletas, treinamentos, exercícios e orientações. A prototipação do RAD permite representar as funcionalidades e identificar problemas de entendimento ou usabilidade durante o desenvolvimento.

- **Prototipação e refinamento dos requisitos:** alguns requisitos podem ser melhor compreendidos por meio de representações visuais. Os protótipos permitem que o cliente avalie interfaces e fluxos e contribua para o refinamento da solução.

- **Participação do cliente:** o RAD valoriza a participação frequente do usuário. Como a disponibilidade do cliente Lucas é limitada, essa participação será planejada para momentos relevantes de validação e refinamento, em vez de depender de reuniões constantes.

- **Testes:** os testes serão considerados parte do desenvolvimento e planejados de acordo com os requisitos e riscos do sistema. A equipe poderá utilizar práticas como testes automatizados e integração contínua quando forem relevantes para a qualidade do produto.

- **Documentação:** será produzida a documentação necessária para comunicação, desenvolvimento, validação e rastreabilidade dos requisitos. O nível de documentação será definido conforme sua utilidade para o projeto.

- **Práticas do XP não adotadas como obrigatórias:** embora algumas práticas do XP possam complementar o RAD, a equipe não adotará todas elas como parte obrigatória do processo. A **programação em pares**, por exemplo, exige a disponibilidade simultânea de dois integrantes, o que é pouco compatível com a disponibilidade do grupo. A **propriedade coletiva do código** também não será estabelecida como prática formal, pois a equipe organizará as responsabilidades de desenvolvimento conforme as atividades do projeto. Já práticas como **testes automatizados, integração contínua e refatoração** poderão ser utilizadas quando forem relevantes.

- **Compatibilidade com o ciclo iterativo e incremental:** o RAD permite desenvolver uma parte da solução, validá-la, realizar ajustes e posteriormente acrescentar novas funcionalidades, mantendo o desenvolvimento progressivo do produto.

- **Abordagem híbrida:** a abordagem híbrida permite combinar a flexibilidade e a adaptação do RAD com práticas mais estruturadas de documentação, testes, revisão e acompanhamento quando necessárias, adequando o processo às restrições do projeto.