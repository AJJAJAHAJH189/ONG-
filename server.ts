import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface HelpRequestData {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  category: string;
  specificNeeds: string[];
  urgency: string;
  description: string;
  status: 'pendente' | 'em_atendimento' | 'concluido';
  createdAt: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  statusNotes?: string;
}

interface VolunteerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  skills: string[];
  accessibilityExperience: string[];
  availability: string;
  bio: string;
  createdAt: string;
  activeRequestsCount: number;
}

// Initial accessible demo data with diverse inclusive scenarios
let helpRequests: HelpRequestData[] = [
  {
    id: 'req-001',
    name: 'Dona Helena Silveira',
    phone: '(11) 98765-4321',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua das Flores, 142 - Zona Leste',
    category: 'saude_medicamentos',
    specificNeeds: ['idoso_apoio_digital', 'mobilidade_reduzida'],
    urgency: 'alta',
    description: 'Tenho 79 anos e dificuldade de locomoção. Preciso de voluntário para retirar meus remédios de hipertensão e diabetes no posto de saúde e me explicar a posologia em voz clara.',
    status: 'pendente',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'req-002',
    name: 'Carlos Eduardo Mendes',
    phone: '(19) 97123-8899',
    city: 'Campinas (Zona Rural)',
    state: 'SP',
    address: 'Sítio Recanto dos Ipês, Km 14',
    category: 'tecnologia_reparos',
    specificNeeds: ['deficiencia_visual'],
    urgency: 'media',
    description: 'Sou pessoa cega e utilizo leitor de tela NVDA. Preciso de suporte para configurar atalhos de teclado e acesso aos portais do INSS no meu computador com conexão rural Starlink.',
    status: 'em_atendimento',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    assignedVolunteerId: 'vol-001',
    assignedVolunteerName: 'Mariana Costa (Especialista em Acessibilidade)',
    statusNotes: 'Voluntária Mariana já agendou atendimento remoto e presencial para o próximo sábado.',
  },
  {
    id: 'req-003',
    name: 'Família Santos (Renata e Lucas)',
    phone: '(21) 99887-1122',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Comunidade Esperança, Lote 18',
    category: 'alimentacao',
    specificNeeds: ['neurodivergente_leitura_facil'],
    urgency: 'urgente',
    description: 'Mãe solo com filho autista nível 2 de suporte. Precisamos de apoio com cesta básica e alimentos de textura tolerada para a seletividade alimentar infantil.',
    status: 'pendente',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'req-004',
    name: 'Sr. João Batista de Oliveira',
    phone: '(31) 98456-7890',
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Av. dos Andradas, 890 - Apto 302',
    category: 'transporte_acessivel',
    specificNeeds: ['mobilidade_reduzida'],
    urgency: 'alta',
    description: 'Cadeirante, preciso de acompanhamento acessível para consulta médica ortopédica no hospital central.',
    status: 'concluido',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    assignedVolunteerId: 'vol-002',
    assignedVolunteerName: 'Pedro Alencar',
    statusNotes: 'Transporte e acompanhamento realizados com sucesso em veículo adaptado.',
  },
];

let volunteers: VolunteerData[] = [
  {
    id: 'vol-001',
    name: 'Mariana Costa',
    email: 'mariana.costa@ongacesso.org',
    phone: '(11) 99123-4567',
    city: 'São Paulo',
    state: 'SP',
    skills: ['tecnologia_reparos', 'apoio_juridico_social'],
    accessibilityExperience: ['NVDA / VoiceOver', 'Libras Básico', 'Tecnologia Assistiva'],
    availability: 'finais_de_semana',
    bio: 'Desenvolvedora front-end com foco em acessibilidade web e voluntária há 4 anos apoiando idosos e PCDs no uso da internet.',
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
    activeRequestsCount: 1,
  },
  {
    id: 'vol-002',
    name: 'Pedro Alencar',
    email: 'pedro.alencar@ongacesso.org',
    phone: '(31) 98765-0011',
    city: 'Belo Horizonte',
    state: 'MG',
    skills: ['transporte_acessivel', 'cuidados_companhia'],
    accessibilityExperience: ['Treinamento em Mobilidade e Cadeira de Rodas', 'Primeiros Socorros'],
    availability: 'manha',
    bio: 'Motorista com veículo adaptado para rampa e disponibilidade para transporte solidário de idosos e PCDs para consultas.',
    createdAt: new Date(Date.now() - 3600000 * 180).toISOString(),
    activeRequestsCount: 0,
  },
  {
    id: 'vol-003',
    name: 'Clara Nogueira',
    email: 'clara.nogueira@ongacesso.org',
    phone: '(21) 98111-2233',
    city: 'Rio de Janeiro',
    state: 'RJ',
    skills: ['alimentacao', 'saude_medicamentos'],
    accessibilityExperience: ['Comunicação Aumentativa e Alternativa', 'Nutrição Inclusiva'],
    availability: 'tarde',
    bio: 'Estudante de serviço social com experiência em triagem de necessidades básicas e acolhimento comunitário humanizado.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    activeRequestsCount: 0,
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Acesso Solidario API',
      wcagVersion: '2.2 AA',
      timestamp: new Date().toISOString(),
    });
  });

  // System statistics endpoint
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalRequests = helpRequests.length;
    const pendingRequests = helpRequests.filter(r => r.status === 'pendente').length;
    const inProgressRequests = helpRequests.filter(r => r.status === 'em_atendimento').length;
    const completedRequests = helpRequests.filter(r => r.status === 'concluido').length;
    const totalVolunteers = volunteers.length;
    const ruralZoneRequests = helpRequests.filter(r => 
      r.city.toLowerCase().includes('rural') || r.address.toLowerCase().includes('sítio') || r.address.toLowerCase().includes('km')
    ).length;

    res.json({
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      totalVolunteers,
      ruralZoneRequests,
    });
  });

  // GET /api/help-requests - list help requests with optional filters
  app.get('/api/help-requests', (req: Request, res: Response) => {
    const { category, status, urgency, search } = req.query;

    let filtered = [...helpRequests];

    if (category && typeof category === 'string' && category !== 'todas') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (status && typeof status === 'string' && status !== 'todos') {
      filtered = filtered.filter(item => item.status === status);
    }

    if (urgency && typeof urgency === 'string' && urgency !== 'todas') {
      filtered = filtered.filter(item => item.urgency === urgency);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(filtered);
  });

  // POST /api/help-requests - Create a new help request with strict semantic validation
  app.post('/api/help-requests', (req: Request, res: Response): any => {
    const { name, phone, city, state, address, category, specificNeeds, urgency, description } = req.body;

    // Field-specific validations returning accessible JSON errors
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_NAME',
        message: 'Por favor, informe seu nome completo com pelo menos 3 caracteres.',
        field: 'name',
      });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_PHONE',
        message: 'Por favor, forneça um número de telefone ou WhatsApp válido com DDD para contato.',
        field: 'phone',
      });
    }

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_CITY',
        message: 'Por favor, informe o município onde a ajuda é necessária.',
        field: 'city',
      });
    }

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_ADDRESS',
        message: 'Por favor, informe o endereço completo ou ponto de referência comunitário.',
        field: 'address',
      });
    }

    if (!category || typeof category !== 'string') {
      return res.status(400).json({
        error: true,
        code: 'INVALID_CATEGORY',
        message: 'Selecione uma categoria principal de ajuda.',
        field: 'category',
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_DESCRIPTION',
        message: 'Por favor, descreva com detalhes o que você precisa (mínimo de 10 caracteres).',
        field: 'description',
      });
    }

    const newRequest: HelpRequestData = {
      id: `req-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: (state || 'SP').trim().toUpperCase(),
      address: address.trim(),
      category: category.trim(),
      specificNeeds: Array.isArray(specificNeeds) ? specificNeeds : ['nenhuma'],
      urgency: urgency || 'media',
      description: description.trim(),
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    helpRequests.unshift(newRequest);

    res.status(201).json({
      success: true,
      message: 'Solicitação de ajuda cadastrada com sucesso! Nossa rede comunitária e voluntários foram notificados.',
      request: newRequest,
    });
  });

  // PATCH /api/help-requests/:id/status - Update status and volunteer assignment
  app.patch('/api/help-requests/:id/status', (req: Request, res: Response): any => {
    const { id } = req.params;
    const { status, assignedVolunteerId, statusNotes } = req.body;

    const requestIndex = helpRequests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      return res.status(404).json({
        error: true,
        code: 'REQUEST_NOT_FOUND',
        message: `Chamado com ID ${id} não foi encontrado no sistema.`,
      });
    }

    const reqItem = helpRequests[requestIndex];

    if (status) {
      if (!['pendente', 'em_atendimento', 'concluido'].includes(status)) {
        return res.status(400).json({
          error: true,
          code: 'INVALID_STATUS',
          message: 'Status inválido. Escolha entre: pendente, em_atendimento ou concluido.',
          field: 'status',
        });
      }
      reqItem.status = status;
    }

    if (assignedVolunteerId !== undefined) {
      if (assignedVolunteerId) {
        const vol = volunteers.find(v => v.id === assignedVolunteerId);
        if (vol) {
          reqItem.assignedVolunteerId = vol.id;
          reqItem.assignedVolunteerName = vol.name;
        }
      } else {
        delete reqItem.assignedVolunteerId;
        delete reqItem.assignedVolunteerName;
      }
    }

    if (statusNotes !== undefined) {
      reqItem.statusNotes = statusNotes;
    }

    res.json({
      success: true,
      message: `Status do chamado atualizado para: ${reqItem.status.replace('_', ' ')}.`,
      request: reqItem,
    });
  });

  // GET /api/volunteers - List all volunteers
  app.get('/api/volunteers', (_req: Request, res: Response) => {
    res.json(volunteers);
  });

  // POST /api/volunteers - Register a new volunteer with semantic checks
  app.post('/api/volunteers', (req: Request, res: Response): any => {
    const { name, email, phone, city, state, skills, accessibilityExperience, availability, bio } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_NAME',
        message: 'Por favor, insira o seu nome completo (mínimo de 3 caracteres).',
        field: 'name',
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_EMAIL',
        message: 'Por favor, forneça um endereço de e-mail válido.',
        field: 'email',
      });
    }

    // Check duplicate email
    const exists = volunteers.some(v => v.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      return res.status(409).json({
        error: true,
        code: 'VOLUNTEER_ALREADY_REGISTERED',
        message: 'Este e-mail já está cadastrado como voluntário em nossa plataforma.',
        field: 'email',
      });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_PHONE',
        message: 'Por favor, forneça um telefone ou WhatsApp com DDD.',
        field: 'phone',
      });
    }

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        error: true,
        code: 'SKILLS_REQUIRED',
        message: 'Selecione pelo menos uma área em que você pode oferecer apoio voluntário.',
        field: 'skills',
      });
    }

    const newVolunteer: VolunteerData = {
      id: `vol-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: (city || 'São Paulo').trim(),
      state: (state || 'SP').trim().toUpperCase(),
      skills,
      accessibilityExperience: Array.isArray(accessibilityExperience) ? accessibilityExperience : [],
      availability: availability || 'finais_de_semana',
      bio: (bio || '').trim(),
      createdAt: new Date().toISOString(),
      activeRequestsCount: 0,
    };

    volunteers.push(newVolunteer);

    res.status(201).json({
      success: true,
      message: `Bem-vindo(a), ${newVolunteer.name}! Seu cadastro como voluntário(a) solidário(a) foi concluído com sucesso.`,
      volunteer: newVolunteer,
    });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
