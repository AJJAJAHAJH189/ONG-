import React from 'react';

export const SkipLinks: React.FC = () => {
  return (
    <nav aria-label="Atalhos de Acessibilidade e Salto de Conteúdo">
      <a href="#main-content" className="skip-link">
        Pular para o Conteúdo Principal (Alt + 1)
      </a>
      <a href="#accessibility-toolbar" className="skip-link" style={{ left: '16rem' }}>
        Pular para a Barra de Acessibilidade (Alt + 2)
      </a>
      <a href="#solicitar-ajuda-section" className="skip-link" style={{ left: '32rem' }}>
        Pular para o Formulário de Ajuda (Alt + 3)
      </a>
      <a href="#central-chamados-section" className="skip-link" style={{ left: '48rem' }}>
        Pular para a Central de Chamados (Alt + 4)
      </a>
    </nav>
  );
};
