PRAGMA foreign_keys = ON;

-- 1) INSERT: novo dependente demonstrativo
INSERT INTO dependentes (usuario_id, nome, parentesco, status)
VALUES (1, 'Dependente teste', 'Filho(a)', 'Ativo');

-- 2) SELECT: listar próximos agendamentos com dados relacionados
SELECT
  a.id,
  a.data,
  a.horario,
  u.nome AS usuario,
  COALESCE(d.nome, u.nome) AS paciente,
  s.nome AS servico,
  un.nome AS unidade,
  a.status
FROM agendamentos a
JOIN usuarios u ON u.id = a.usuario_id
LEFT JOIN dependentes d ON d.id = a.dependente_id
JOIN servicos s ON s.id = a.servico_id
JOIN unidades un ON un.id = a.unidade_id
WHERE a.usuario_id = 1
ORDER BY a.data, a.horario;

-- 3) UPDATE: alterar status de um agendamento
UPDATE agendamentos
SET status = 'Cancelado'
WHERE id = 2;

-- 4) DELETE: remover o dependente de teste inserido no passo 1
DELETE FROM dependentes
WHERE nome = 'Dependente teste' AND usuario_id = 1;

-- Consulta final de conferência
SELECT id, nome, parentesco, status
FROM dependentes
WHERE usuario_id = 1;
