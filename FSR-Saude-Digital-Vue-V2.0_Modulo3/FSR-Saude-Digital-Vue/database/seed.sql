PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO usuarios (id, nome, perfil) VALUES
  (1, 'Carlos Eduardo Bondimam Carvallo', 'Militar da ativa');

INSERT OR IGNORE INTO dependentes (id, usuario_id, nome, parentesco, status) VALUES
  (1, 1, 'Dependente demonstrativo', 'Dependente', 'Ativo');

INSERT OR IGNORE INTO servicos (id, nome, descricao) VALUES
  (1, 'Clínica médica', 'Atendimentos clínicos demonstrativos da Formação Sanitária Regimental.'),
  (2, 'Odontologia', 'Atendimento odontológico e organização de horários.'),
  (3, 'Enfermagem', 'Atendimento de enfermagem e orientações básicas.'),
  (4, 'Consulta por convênio', 'Espaço preparado para futura integração com a rede credenciada/FUSEX.');

INSERT OR IGNORE INTO unidades (id, nome, endereco, tipo) VALUES
  (1, 'Formação Sanitária Regimental', '11º RC Mec • Ponta Porã-MS', 'Unidade principal'),
  (2, 'Rede credenciada FUSEX', 'Endereços demonstrativos da rede conveniada', 'Convênio');

INSERT OR IGNORE INTO convenios (id, nome, ativo) VALUES
  (1, 'FUSEX', 1);

INSERT OR IGNORE INTO agendamentos (id, usuario_id, dependente_id, servico_id, unidade_id, convenio_id, data, horario, status) VALUES
  (1, 1, NULL, 1, 1, NULL, '28/08/2026', '09:00', 'Confirmado'),
  (2, 1, NULL, 2, 1, NULL, '04/09/2026', '14:30', 'Pendente'),
  (3, 1, 1, 4, 2, 1, '12/09/2026', '10:00', 'Agendado');

INSERT OR IGNORE INTO historico_atendimentos (id, usuario_id, dependente_id, servico_id, unidade_id, data, resultado) VALUES
  (1, 1, NULL, 1, 1, '18/07/2026', 'Atendimento concluído'),
  (2, 1, NULL, 2, 1, '21/06/2026', 'Atendimento concluído'),
  (3, 1, NULL, 4, 2, '05/05/2026', 'Atendimento concluído');

INSERT OR IGNORE INTO notificacoes (id, usuario_id, titulo, texto, momento, lida) VALUES
  (1, 1, 'Lembrete de consulta', 'Você possui consulta de Clínica médica em 28/08/2026 às 09:00.', 'Hoje', 0),
  (2, 1, 'Agendamento pendente', 'Há um atendimento de Odontologia aguardando confirmação.', 'Ontem', 0),
  (3, 1, 'Saúde preventiva', 'Consulte as informações sobre campanhas e ações de saúde militar.', '15/08/2026', 0),
  (4, 1, 'Bem-vindo', 'A plataforma FSR Saúde Digital é um MVP acadêmico para o Projeto Integrador.', '15/08/2026', 1);
