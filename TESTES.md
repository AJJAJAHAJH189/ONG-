ROTEIRO DE TESTES E DEMONSTRACAO AO VIVO - APRESENTACAO ORAL
PROJETO: ACESS-WEB (PLATAFORMA ACESSIVEL DE APOIO COMUNITARIO)
REFERENCIA TECNICA: WCAG 2.2 NIVEL AA / LIGHTHOUSE 100 / AXE DEVTOOLS 0 ERROS

===============================================================================
INSTRUCOES GERAIS PARA A APRESENTACAO
===============================================================================
1. Durante a demonstracao acessivel, mantenha as maos longe do mouse.
2. Execute todos os comandos exclusivamente via teclado.
3. Se utilizar leitor de tela (NVDA no Windows ou VoiceOver no Mac), mantenha o volume do computador audivel para a banca.
4. Siga a ordem sequencial dos testes abaixo para cobrir 100% dos criterios de avaliacao.

===============================================================================
TESTE 1: INICIALIZACAO E SKIP LINKS (CRITERIO WCAG 2.4.1)
===============================================================================
Objetivo: Demonstrar que o usuario pode pular blocos repetitivos de navegacao.

Grupos de Pessoas Beneficiados e Impacto:
- Pessoas cegas ou com baixa visao que usam leitor de tela: Evita que precisem ouvir a leitura repetitiva de todos os links do cabecalho toda vez que trocam de tela ou recarregam a pagina.
- Pessoas com deficiencia motora, tremores ou paralisia (navegacao apenas por teclado ou acionadores): Economiza dezenas de cliques na tecla Tab, prevenindo fadiga fisica extrema.
- Idosos com navegacao assistida: Facilita o acesso imediato ao servico sem se perder no menu superior.

Procedimento:
1. Recarregue a pagina no navegador (F5 ou Ctrl+R).
2. Pressione a tecla TAB exatamente uma vez.
3. Verifique que o banner "Pular para o conteudo principal (Alt + 1)" surge no canto superior.
4. Pressione ENTER.

Resultado Esperado:
- O foco visual e do leitor de tela salta imediatamente para a tag <main>, ignorando todo o cabecalho e a barra de acessibilidade.

===============================================================================
TESTE 2: INDICADOR VISUAL DE FOCO (CRITERIOS WCAG 2.4.7 E 2.4.13)
===============================================================================
Objetivo: Demonstrar que o foco do teclado nunca e invisivel.

Grupos de Pessoas Beneficiados e Impacto:
- Pessoas com baixa visao: Uma borda azul de alto contraste (3px) com deslocamento permite localizar instantaneamente o campo ou botao selecionado.
- Pessoas com deficiencia motora que utilizam teclado, switches ou eye-tracking: Sem o foco visivel, o usuario fica completamente cego sobre onde esta na tela ao pressionar teclas.
- Pessoas com TDAH e dificuldades de atencao: O contorno bem definido impede que o usuario se distraia ou perca a posicao da leitura.

Procedimento:
1. Pressione a tecla TAB repetidamente para percorrer os botoes e links da barra superior.

Resultado Esperado:
- Todo elemento focado recebe uma borda solida azul de 3px com recuo (offset) de 3px.
- O foco nunca desaparece e nao ha remocao indevida de outline.

===============================================================================
TESTE 3: BARRA DE FERRAMENTAS DE ACESSIBILIDADE (CRITERIOS WCAG 1.4.3 E 1.4.4)
===============================================================================
Objetivo: Validar ampliacao de texto, modos de contraste e suporte a dislexia.

Grupos de Pessoas Beneficiados e Impacto:
- Idosos e pessoas com presbiopia, catarata ou glaucoma: Os botoes de fonte (125% e 150%) ampliam as letras proporcionalmente sem quebrar o layout, garantindo legibilidade sem precisar de lupa externa.
- Pessoas com fotofobia, daltonismo ou perda de sensibilidade ao contraste: O modo "Alto Contraste" (preto e amarelo, contraste superior a 7:1) elimina ofuscamento e destaca o conteudo.
- Pessoas com dislexia e neurodivergentes: O modo "Leitura Facil" aplica a fonte OpenDyslexic com maior espacamento entre letras e palavras, reduzindo a confusao visual de caracteres similares (como b/d e p/q).
- Pessoas analfabetas funcionais ou com dificuldades de leitura: O botao "Ouvir Pagina" utiliza a API Web Speech para narrar o conteudo sonoro em voz sintetizada.

Procedimento:
1. Pressione TAB ate a barra de acessibilidade.
2. Pressione ENTER no botao "A+ (125%)" ou "A++ (150%)".
   - Resultado: O texto do sistema amplia proporcionalmente sem quebra de linhas ou sobreposicao.
3. Pressione ENTER no botao "Alto Contraste".
   - Resultado: O fundo torna-se preto profundo (#000000) e o texto/botoes tornam-se amarelo (#FFE600), com relacao de contraste superior a 7:1 (AAA).
4. Pressione ENTER no botao "Leitura Facil (Dislexia)".
   - Resultado: A tipografia altera para fonte com espacamento estendido entre letras e palavras.
5. Pressione ENTER no botao "Ouvir Pagina".
   - Resultado: A API Web Speech inicia a leitura em audio sintetizado do resumo da tela.

===============================================================================
TESTE 4: FORMULARIO DE AJUDA E VALIDACAO COM ARIA (CRITERIOS WCAG 3.3.1 E 3.3.2)
===============================================================================
Objetivo: Provar que erros de validacao sao comunicados visualmente e por voz.

Grupos de Pessoas Beneficiados e Impacto:
- Pessoas cegas que dependem de leitor de tela: Se um erro for indicado apenas mudando a cor da borda para vermelho, a pessoa cega nunca sabera. O uso de aria-invalid="true" e aria-describedby faz o leitor ler a mensagem de erro exata e o foco automatico leva a pessoa direto ao campo incorreto.
- Pessoas com daltonismo (ex.: protanopia ou deuteranopia): O erro nao depende apenas da cor vermelha, apresentando icone de alerta e texto explicativo.
- Pessoas com ansiedade ou idosos: Mensagens de erro claras e amigaveis reduzem a frustracao e evitam o abandono do pedido de ajuda.

Procedimento:
1. Navegue com TAB ate a aba "Solicitar Ajuda".
2. Deixe os campos "Nome Completo" e "Telefone" vazios de proposito.
3. Navegue com TAB ate o botao "Enviar Solicitacao" e pressione ENTER ou ESPACO.

Resultado Esperado:
- O sistema intercepta o envio sem recarregar a tela.
- O foco do teclado e transferido automaticamente para o primeiro campo com erro ("Nome Completo").
- O campo recebe a propriedade aria-invalid="true".
- O leitor de tela anuncia o erro vinculado atraves do atributo aria-describedby="name-error".
- Um alerta visual com icone e texto explicativo e exibido.

===============================================================================
TESTE 5: PREENCHIMENTO E PERSISTENCIA DE CHAMADO
===============================================================================
Objetivo: Demonstrar o envio com sucesso de um chamado comunitario.

Grupos de Pessoas Beneficiados e Impacto:
- Pessoas vulneraveis e com mobilidade reduzida: Facilidade e rapidez para registrar pedidos de remedios, alimentos ou transporte sem burocracia excessiva.
- Pessoas com deficiencia visual: O anuncio sonoro da regiao aria-live="polite" confirma que o pedido foi gravado com sucesso sem necessidade de inspecionar visualmente a tela.

Procedimento:
1. Preencha os campos obrigatorios:
   - Nome: "Carlos Eduardo"
   - Telefone: "(11) 98888-4444"
   - Cidade: "Sao Paulo"
   - Endereco: "Rua Direita, 250"
   - Categoria: Selecione "Saude & Medicamentos"
   - Descricao: "Preciso de auxilio para entrega de remedios controlados."
2. Pressione ENTER em "Enviar Solicitacao".

Resultado Esperado:
- Mensagem de sucesso anunciada via regiao aria-live="polite".
- O chamado e enviado via requisicao POST para /api/help-requests.
- Os campos do formulario sao limpos e o usuario recebe confirmacao de protocolo.

===============================================================================
TESTE 6: CENTRAL DE CHAMADOS E REGIOES VIVAS ARIA-LIVE (CRITERIO WCAG 4.1.3)
===============================================================================
Objetivo: Demonstrar que filtros dinamicos informam o leitor de tela.

Grupos de Pessoas Beneficiados e Impacto:
- Voluntarios ou coordenadores da ONG cegos ou com baixa visao: Ao aplicar um filtro (ex.: "Saude"), a regiao aria-live="polite" informa quantos chamados foram encontrados sem que o usuario precise navegar por toda a pagina para descobrir.
- Usuarios em conexoes lentas: Evita o recarregamento pesado da pagina inteira.

Procedimento:
1. Navegue com TAB ate a aba "Central de Chamados".
2. Alterne o filtro de categoria para "Saude & Medicamentos".

Resultado Esperado:
- A lista e filtrada instantaneamente sem refresh de pagina.
- A regiao aria-live="polite" anuncia: "Filtro aplicado: Saude & Medicamentos. X chamados encontrados."

===============================================================================
TESTE 7: MODAL DE DETALHES E FOCUS TRAP (ARIA APG DIALOG PATTERN)
===============================================================================
Objetivo: Demonstrar confinamento de foco, fechamento via ESC e restauracao de foco.

Grupos de Pessoas Beneficiados e Impacto:
- Pessoas cegas e usuarios de teclado: Sem o Focus Trap, o usuario ao apertar Tab continuaria navegando por elementos que estao escondidos atras do modal, causando total desorientacao espacial.
- Pessoas com deficiencia motora: O atalho da tecla Escape permite fechar a janela instantaneamente com um unico toque, e a restauracao do foco devolve o cursor ao botao exato onde o usuario estava, sem obrigar a refazer toda a navegacao.

Procedimento:
1. Na Central de Chamados, navegue ate o botao "Ver Detalhes" de qualquer card e pressione ENTER.
2. O modal abre ocupando o centro da tela.
3. Pressione a tecla TAB repetidamente (4 a 6 vezes).
   - Resultado: O foco circula apenas entre os elementos dentro do modal (nao vaza para o fundo da pagina).
4. Pressione a tecla ESCAPE (Esc).

Resultado Esperado:
- O modal fecha instantaneamente.
- O foco do teclado retorna com exatidao para o botao "Ver Detalhes" que o disparou.

===============================================================================
TESTE 8: SIMULADOR DE LATENCIA E FILA OFFLINE STARLINK
===============================================================================
Objetivo: Comprovar a resiliencia em conexoes rurais e via satelite.

Grupos de Pessoas Beneficiados e Impacto:
- Comunidades ribeirinhas, assentamentos rurais, quilombolas e aldeias indigenas: Locais que dependem exclusivamente de conexoes via satelite (como Starlink), onde chuvas fortes ou tempestades causam quedas frequentes ou alta latencia (40 a 250ms).
- Familias em situacao de emergencia rural: Garante que um pedido urgente de socorro ou remedio nao seja perdido caso a internet caia no momento do envio; o pedido fica salvo no navegador e e transmitido automaticamente assim que o sinal volta.

Procedimento:
1. Navegue ate a aba "Simulador Starlink".
2. Ative o botao "Modo Offline Ativado (Sem Sinal)".
3. Volte para a aba "Solicitar Ajuda", preencha um chamado rapido e clique em Enviar.
   - Resultado: O sistema nao quebra e exibe: "Chamado salvo com seguranca na fila local (Modo Offline)".
4. Retorne a aba "Simulador Starlink".
   - Resultado: O item aparece listado na "Fila de Armazenamento Local Resiliente".
5. Desative o Modo Offline e clique em "Sincronizar Fila Agora".

Resultado Esperado:
- Os chamados pendentes sao transmitidos em lote para o servidor e inseridos na base de dados com integridade.

===============================================================================
TESTE 9: AUDITORIA AUTOMATIZADA LIGHTHOUSE E AXE DEVTOOLS
===============================================================================
Objetivo: Apresentar a comprovacao das metas de auditoria.

Grupos de Pessoas Beneficiados e Impacto:
- Todos os usuarios da plataforma e a equipe da ONG: Garante que a aplicacao cumpre 100% das normas legais da Lei Brasileira de Inclusao (LBI - Lei 13.146/2015), do eMAG e do consorcio internacional W3C, evitando barreiras invisiveis de programacao.

Procedimento:
1. Pressione F12 no navegador e abra a aba "Lighthouse".
2. Selecione a categoria "Acessibilidade" e clique em "Analyze page load".
Resultado Esperado:
- Pontuacao 100/100 em Acessibilidade.
3. Abra a extensao "axe DevTools" e execute a varredura ("Scan ALL of my page").
Resultado Esperado:
- 0 erros e 0 violacoes automaticas encontradas.

===============================================================================
FIM DO ROTEIRO DE TESTES
===============================================================================
