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
Procedimento:
1. Pressione a tecla TAB repetidamente para percorrer os botoes e links da barra superior.
Resultado Esperado:
- Todo elemento focado recebe uma borda solida azul de 3px com recuo (offset) de 3px.
- O foco nunca desaparece e nao ha remocao indevida de outline.

===============================================================================
TESTE 3: BARRA DE FERRAMENTAS DE ACESSIBILIDADE (CRITERIOS WCAG 1.4.3 E 1.4.4)
===============================================================================
Objetivo: Validar ampliacao de texto, modos de contraste e suporte a dislexia.
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
