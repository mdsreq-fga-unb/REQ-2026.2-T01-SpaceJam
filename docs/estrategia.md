## 4.1 Abordagem, Ciclo de Vida e Processo

| Elemento | Escolha |
|---|---|
| **Abordagem** | Ágil |
| **Ciclo de Vida** | Iterativo e Incremental |
| **Processo** | Rapid Application Development (RAD) |
| **Framework** | Scrum |

---

## 4.2 Comparação entre Processos

Para definir o processo de desenvolvimento mais adequado ao projeto Space Jam, foram analisados os processos **Rapid Application Development (RAD)** e **Extreme Programming (XP)**. A comparação considera as principais características dos dois processos e sua adequação ao contexto do projeto.

| Características | RAD | XP |
|---|---|---|
| **Abordagem Geral** | Desenvolvimento rápido baseado em prototipagem, colaboração com o usuário e feedback contínuo. | Desenvolvimento ágil baseado em ciclos curtos, feedback frequente, simplicidade e adaptação contínua. |
| **Foco em Arquitetura** | Menor ênfase no planejamento antecipado da arquitetura, priorizando a construção rápida de protótipos e funcionalidades. | Prioriza simplicidade e evolução contínua do design, evitando planejamento excessivo antecipadamente. |
| **Estrutura de Processos** | Planejamento de requisitos, workshop de design do usuário, construção e implementação final, com prototipagem e refinamento ao longo do processo. | Ciclos curtos envolvendo planejamento, desenvolvimento, testes, integração e pequenas entregas. |
| **Flexibilidade de Requisitos** | Alta, permitindo que os requisitos sejam refinados durante a prototipagem e a partir do feedback dos usuários. | Alta, considerando mudanças nos requisitos ao longo dos ciclos de desenvolvimento. |
| **Colaboração com Cliente** | Forte participação do usuário durante workshops, prototipagem e validação das soluções. | Forte participação do cliente na definição, priorização e validação das funcionalidades. |
| **Complexidade do Processo** | Relativamente simples e orientado à velocidade, mas depende da participação intensa dos usuários. | Possui documentação reduzida, mas exige disciplina para aplicação das práticas técnicas e colaboração frequente. |
| **Qualidade Técnica** | A prototipagem e a validação frequente favorecem a identificação antecipada de problemas de usabilidade e lacunas funcionais. | Forte foco na qualidade técnica por meio de testes, refatoração, integração contínua e programação em pares. |
| **Práticas de Desenvolvimento** | Prototipagem rápida, modelagem, colaboração com usuários, desenvolvimento iterativo e refinamento progressivo. | Programação em pares, testes, integração contínua, refatoração, design simples e pequenas entregas. |
| **Adaptação ao Projeto do Space Jam** | Adequado devido à necessidade de validar a interface e os fluxos da aplicação com o treinador por meio de protótipos. | Adequado para requisitos dinâmicos, porém algumas práticas apresentam dificuldades de aplicação no contexto da equipe. |
| **Documentação** | Documentação mínima, concentrada principalmente em interfaces, fluxos de dados e modelos necessários ao desenvolvimento. | Minimiza a documentação formal, priorizando comunicação, código e feedback. |
| **Controle de Qualidade** | Utiliza prototipagem, revisão e validação frequente para identificar problemas e lacunas funcionais. | Utiliza testes automatizados, testes de aceitação, integração contínua e refatoração. |
| **Escalabilidade** | Menor adequação para sistemas muito complexos ou de missão crítica. | Mais adequado para equipes pequenas e altamente colaborativas, podendo apresentar limitações em equipes maiores. |
| **Suporte a Equipes de Desenvolvimento** | Favorece equipes colaborativas que possam trabalhar próximas aos usuários e receber feedback durante o desenvolvimento. | Favorece equipes pequenas, com comunicação intensa e aplicação contínua das práticas técnicas. |

---

## 4.3 Justificativa da Escolha

Após a comparação entre os processos **RAD** e **XP**, optou-se pelo **Rapid Application Development (RAD)** para o desenvolvimento do Space Jam pelos seguintes motivos:

- **Validação com o cliente:** o projeto possui um cliente real, que possui experiência prática como treinador de basquete. A utilização de protótipos permite que ele visualize a solução e forneça feedback sobre as funcionalidades, os fluxos e as interfaces.

- **Prototipagem e refinamento dos requisitos:** algumas necessidades do sistema podem ser difíceis de especificar completamente por meio de descrições textuais. A prototipagem permite visualizar a solução e refinar os requisitos progressivamente a partir da interação com o cliente.

- **Adequação ao contexto da equipe:** o grupo possui muitos integrantes, porém apresenta disponibilidade limitada para reuniões. Dessa forma, não seria adequado depender de uma rotina intensa de reuniões ou da disponibilidade constante de todos os integrantes.

- **Limitações na aplicação do XP:** embora o XP apresente práticas importantes para a qualidade técnica, algumas delas exigem maior disponibilidade e coordenação entre os integrantes. A programação em pares, por exemplo, seria difícil de manter continuamente devido à dificuldade de conciliar os horários de muitos membros.

- **Realização de testes:** a disponibilidade limitada dos integrantes pode dificultar a manutenção de uma rotina intensa de testes e integração. Isso não significa que os testes deixarão de ser realizados, mas que serão aplicados de acordo com as necessidades do projeto e a disponibilidade da equipe.

- **Documentação mínima:** a equipe possui limitações de disponibilidade para manter uma rotina de documentação extensa e frequente. O RAD apresenta maior compatibilidade com esse contexto por trabalhar com documentação mínima, concentrada nos elementos necessários ao desenvolvimento.

- **Compatibilidade com o ciclo iterativo e incremental:** o RAD permite que a equipe desenvolva uma parte da solução, valide-a com o cliente, receba feedback, realize os ajustes necessários e, posteriormente, acrescente novas funcionalidades.

- **Desenvolvimento rápido:** a ênfase do RAD na prototipagem e no desenvolvimento rápido é compatível com a necessidade de construir e validar progressivamente as funcionalidades do Space Jam.

