const { createApp } = Vue;
const fsrApp = createApp({
  data() {
    return {
      currentPage: 'dashboard',
      toast: '',
      user: { name: 'Carlos Eduardo Bondimam Carvallo', firstName: 'Carlos', profile: 'Militar da ativa' },
      appointments: [
        {id:1,date:'28/08/2026',time:'09:00',type:'Clínica médica',unit:'Formação Sanitária Regimental',status:'Confirmado',patient:'Carlos Eduardo'},
        {id:2,date:'04/09/2026',time:'14:30',type:'Odontologia',unit:'Formação Sanitária Regimental',status:'Pendente',patient:'Carlos Eduardo'},
        {id:3,date:'12/09/2026',time:'10:00',type:'Consulta por convênio',unit:'Rede credenciada FUSEX',status:'Agendado',patient:'Dependente'}
      ],
      history: [
        {date:'18/07/2026',type:'Clínica médica',unit:'FSR 11º RC Mec',result:'Atendimento concluído'},
        {date:'21/06/2026',type:'Odontologia',unit:'FSR 11º RC Mec',result:'Atendimento concluído'},
        {date:'05/05/2026',type:'Consulta por convênio',unit:'Rede credenciada FUSEX',result:'Atendimento concluído'}
      ],
      dependents: [{name:'Dependente demonstrativo',relation:'Dependente',status:'Ativo'}],
      notifications: [
        {title:'Lembrete de consulta',text:'Você possui consulta de Clínica médica em 28/08/2026 às 09:00.',time:'Hoje',read:false},
        {title:'Agendamento pendente',text:'Há um atendimento de Odontologia aguardando confirmação.',time:'Ontem',read:false},
        {title:'Saúde preventiva',text:'Consulte as informações sobre campanhas e ações de saúde militar.',time:'15/08/2026',read:false},
        {title:'Bem-vindo',text:'A plataforma FSR Saúde Digital é um MVP acadêmico para o Projeto Integrador.',time:'15/08/2026',read:true}
      ],
      booking: {patient:'Carlos Eduardo',type:'Clínica médica',unit:'Formação Sanitária Regimental',date:'2026-09-10',time:'09:00'},
      support: {subject:'',message:''},
      modal: {visible:false,title:'',body:'',confirm:null},
      nav: [
        {id:'dashboard',icon:'🏠',label:'Início'}, {id:'agendamento',icon:'📅',label:'Agendamento'},
        {id:'atendimentos',icon:'🩺',label:'Meus atendimentos'}, {id:'historico',icon:'📄',label:'Histórico'},
        {id:'dependentes',icon:'👨‍👩‍👧',label:'Dependentes'}, {id:'servicos',icon:'🏥',label:'Serviços'},
        {id:'unidades',icon:'📍',label:'Unidades'}, {id:'notificacoes',icon:'🔔',label:'Notificações'},
        {id:'suporte',icon:'💬',label:'Suporte'}
      ],
      quickLinks: [
        {page:'agendamento',icon:'📅',title:'Agendar',text:'Consultar horários disponíveis.'},
        {page:'suporte',icon:'💬',title:'Dúvidas',text:'FAQ e canal de suporte.'},
        {page:'unidades',icon:'📍',title:'Unidades',text:'Localizar serviços de saúde.'},
        {page:'sobre',icon:'🛡️',title:'Privacidade',text:'Segurança e LGPD.'}
      ],
      services: [
        {icon:'🩺',title:'Clínica médica',text:'Atendimentos clínicos demonstrativos da Formação Sanitária Regimental.'},
        {icon:'🦷',title:'Odontologia',text:'Atendimento odontológico e organização de horários.'},
        {icon:'📋',title:'Convênios',text:'Espaço preparado para futura integração com a rede credenciada/FUSEX.'},
        {icon:'💬',title:'Suporte',text:'Canal de dúvidas, orientações e comunicação.'},
        {icon:'🔔',title:'Notificações',text:'Lembretes e comunicados para apoiar o acompanhamento.'},
        {icon:'👨‍👩‍👧',title:'Dependentes',text:'Agendamento demonstrativo de atendimento para dependentes.'}
      ],
      units: [
        {name:'Formação Sanitária Regimental',address:'11º RC Mec • Ponta Porã-MS',type:'Unidade principal'},
        {name:'Rede credenciada FUSEX',address:'Endereços demonstrativos da rede conveniada',type:'Convênio'}
      ],
      faq: [
        ['Como agendar uma consulta?','Acesse Agendamento, escolha paciente, atendimento, unidade, data e horário e confirme.'],
        ['Posso agendar para dependente?','Sim, desde que o dependente esteja cadastrado e autorizado.'],
        ['Como cancelar ou remarcar?','Acesse Meus atendimentos e selecione o atendimento correspondente.'],
        ['A plataforma acessa meus dados médicos?','No MVP, não. Uma versão real dependeria de integração autorizada e controles de segurança.'],
        ['O FUSEX está integrado?','Não nesta versão. A integração é uma funcionalidade planejada para etapa futura.']
      ],
      steps: [
        {title:'Imersão / Ouvir',text:'Questionários, entrevistas informais e observação das dificuldades relatadas.'},
        {title:'Ideação / Criar',text:'Brainstorming, análise dos dados e comparação de soluções.'},
        {title:'Prototipação / Testar',text:'Modelo da plataforma e validação progressiva da proposta.'}
      ],
      requirements: [
        {id:'RF01',text:'Cadastro de usuário',priority:'Must'}, {id:'RF02',text:'Autenticação',priority:'Must'},
        {id:'RF03',text:'Agendamento de consultas',priority:'Must'}, {id:'RF04',text:'Cancelamento',priority:'Must'},
        {id:'RF05',text:'Remarcação',priority:'Should'}, {id:'RF06',text:'Acompanhamento do status',priority:'Must'},
        {id:'RF07',text:'Histórico médico',priority:'Should'}, {id:'RF08',text:'Notificações e lembretes',priority:'Must'},
        {id:'RF09',text:'Suporte digital',priority:'Should'}, {id:'RF10',text:'Busca por unidades',priority:'Should'},
        {id:'RF11',text:'Gestão de dependentes',priority:'Must'}, {id:'RF12',text:'Integração com convênios/FUSEX',priority:'Could'}
      ],
      nfr: ['Usabilidade e interface intuitiva','Responsividade','Segurança da informação','Privacidade e LGPD','Desempenho adequado','Disponibilidade','Manutenibilidade','Compatibilidade com navegadores atuais'],
      technologies: ['HTML5 semântico','CSS3 responsivo','Vue.js 3','JavaScript ES2022','Node.js','SQLite','Git/GitHub'],
      apiOnline: false,
      apiMessage: 'Dados demonstrativos locais'
    };
  },
  computed: {
    unreadCount() { return this.notifications.filter(n => !n.read).length; }
  },
  methods: {
    async api(path, options = {}) {
      const response = await fetch(path, {headers: {'Content-Type': 'application/json', ...(options.headers || {})}, ...options});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    async loadData() {
      try {
        const [appointments, dependents, history, notifications] = await Promise.all([
          this.api('/api/agendamentos?usuario_id=1'),
          this.api('/api/dependentes?usuario_id=1'),
          this.api('/api/historico?usuario_id=1'),
          this.api('/api/notificacoes?usuario_id=1')
        ]);
        this.appointments = appointments;
        this.dependents = dependents;
        this.history = history;
        this.notifications = notifications;
        this.apiOnline = true;
        this.apiMessage = 'Banco SQLite conectado';
      } catch (error) {
        this.apiOnline = false;
        this.apiMessage = 'Modo demonstrativo local';
      }
    },
    go(page) { this.currentPage = page; this.$nextTick(() => document.getElementById('conteudo')?.focus()); window.scrollTo({top:0,behavior:'smooth'}); },
    statusClass(status) {
      if (status === 'Cancelado') return 'pill-red';
      if (status === 'Pendente') return 'pill-yellow';
      return 'pill-green';
    },
    priorityClass(p) { return p==='Must' ? 'pill-green' : p==='Should' ? 'pill-blue' : 'pill-yellow'; },
    flash(message) { this.toast = message; clearTimeout(this._toastTimer); this._toastTimer = setTimeout(() => this.toast = '', 2600); },
    async submitAppointment() {
      try {
        const appointment = await this.api('/api/agendamentos', {method:'POST', body:JSON.stringify({...this.booking, usuario_id:1})});
        this.appointments.push(appointment);
        this.notifications.unshift({title:'Agendamento confirmado',text:`${appointment.type} em ${appointment.date} às ${appointment.time}.`,time:'Agora',read:false});
        this.apiOnline = true;
        this.apiMessage = 'Banco SQLite conectado';
      } catch (error) {
        const d = this.booking.date.split('-').reverse().join('/');
        const appointment = {...this.booking, id: Date.now(), date:d, status:'Confirmado', patient:this.booking.patient};
        this.appointments.unshift(appointment);
        this.notifications.unshift({title:'Agendamento confirmado',text:`${appointment.type} em ${appointment.date} às ${appointment.time}.`,time:'Agora',read:false});
      }
      this.flash('Agendamento registrado com sucesso.');
      this.go('atendimentos');
    },
    requestCancel(a) {
      this.modal = {visible:true,title:'Cancelar atendimento?',body:`Você está solicitando o cancelamento de <strong>${a.type}</strong> em <strong>${a.date}</strong> às <strong>${a.time}</strong>.`,confirm:async()=>{
        try { await this.api(`/api/agendamentos/${a.id}/cancelar`, {method:'PATCH'}); } catch (error) {}
        a.status='Cancelado'; this.closeModal(); this.flash('Atendimento cancelado.');
      }};
    },
    openNotification(n) { n.read = true; this.modal = {visible:true,title:n.title,body:`${n.text}<br><small>${n.time}</small>`,confirm:null}; },
    async markAllRead() {
      try { await this.api('/api/notificacoes/marcar-lidas', {method:'PATCH', body:JSON.stringify({usuario_id:1})}); } catch (error) {}
      this.notifications.forEach(n=>n.read=true); this.flash('Notificações marcadas como lidas.');
    },
    async submitSupport() {
      try { await this.api('/api/suporte', {method:'POST', body:JSON.stringify({usuario_id:1, ...this.support})}); } catch (error) {}
      this.support={subject:'',message:''}; this.flash('Mensagem registrada com sucesso.');
    }
    ,closeModal() { this.modal={visible:false,title:'',body:'',confirm:null}; }
  }
}).mount('#app');
fsrApp.loadData();
