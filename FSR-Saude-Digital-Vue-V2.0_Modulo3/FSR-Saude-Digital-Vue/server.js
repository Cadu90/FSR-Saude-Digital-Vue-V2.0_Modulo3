const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const ROOT = __dirname;
const DB_DIR = path.join(ROOT, 'database');
const DB_FILE = path.join(DB_DIR, 'fsr_saude.db');
fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(DB_FILE);
db.exec(fs.readFileSync(path.join(DB_DIR, 'schema.sql'), 'utf8'));
const userCount = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total;
if (Number(userCount) === 0) {
  db.exec(fs.readFileSync(path.join(DB_DIR, 'seed.sql'), 'utf8'));
}

db.exec('PRAGMA foreign_keys = ON;');

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function body(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1_000_000) req.destroy();
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('JSON inválido.')); }
    });
    req.on('error', reject);
  });
}

function mapAppointment(a) {
  return {
    id: a.id,
    date: a.data,
    time: a.horario,
    type: a.servico,
    unit: a.unidade,
    status: a.status,
    patient: a.paciente
  };
}

function getAppointments(userId) {
  return db.prepare(`
    SELECT a.id, a.data, a.horario, a.status,
           s.nome AS servico, un.nome AS unidade,
           COALESCE(d.nome, u.nome) AS paciente
    FROM agendamentos a
    JOIN usuarios u ON u.id = a.usuario_id
    LEFT JOIN dependentes d ON d.id = a.dependente_id
    JOIN servicos s ON s.id = a.servico_id
    JOIN unidades un ON un.id = a.unidade_id
    WHERE a.usuario_id = ?
    ORDER BY substr(a.data, 7, 4), substr(a.data, 4, 2), substr(a.data, 1, 2), a.horario
  `).all(Number(userId)).map(mapAppointment);
}

function findId(table, field, value) {
  const allowed = new Set(['servicos', 'unidades']);
  if (!allowed.has(table)) throw new Error('Tabela inválida.');
  const row = db.prepare(`SELECT id FROM ${table} WHERE nome = ?`).get(value);
  return row?.id ?? null;
}

async function api(req, res, url) {
  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return json(res, 200, { ok: true, database: 'SQLite', module: 'Módulo 3' });
    }

    if (req.method === 'GET' && url.pathname === '/api/agendamentos') {
      return json(res, 200, getAppointments(url.searchParams.get('usuario_id') || 1));
    }

    if (req.method === 'GET' && url.pathname === '/api/dependentes') {
      const rows = db.prepare('SELECT id, nome, parentesco AS relation, status FROM dependentes WHERE usuario_id = ? ORDER BY nome').all(Number(url.searchParams.get('usuario_id') || 1));
      return json(res, 200, rows);
    }

    if (req.method === 'GET' && url.pathname === '/api/historico') {
      const rows = db.prepare(`
        SELECT h.id, h.data AS date, s.nome AS type, un.nome AS unit, h.resultado AS result
        FROM historico_atendimentos h
        JOIN servicos s ON s.id = h.servico_id
        JOIN unidades un ON un.id = h.unidade_id
        WHERE h.usuario_id = ? ORDER BY substr(h.data, 7, 4) DESC, substr(h.data, 4, 2) DESC, substr(h.data, 1, 2) DESC
      `).all(Number(url.searchParams.get('usuario_id') || 1));
      return json(res, 200, rows);
    }

    if (req.method === 'GET' && url.pathname === '/api/notificacoes') {
      const rows = db.prepare(`SELECT id, titulo AS title, texto AS text, momento AS time, lida AS read FROM notificacoes WHERE usuario_id = ? ORDER BY id DESC`).all(Number(url.searchParams.get('usuario_id') || 1));
      return json(res, 200, rows.map(n => ({ ...n, read: Boolean(n.read) })));
    }

    if (req.method === 'POST' && url.pathname === '/api/agendamentos') {
      const b = await body(req);
      const usuarioId = Number(b.usuario_id || 1);
      const servicoId = findId('servicos', 'nome', b.type);
      const unidadeId = findId('unidades', 'nome', b.unit);
      if (!servicoId || !unidadeId || !b.date || !b.time) return json(res, 400, { error: 'Dados do agendamento incompletos.' });

      let dependenteId = null;
      if (b.patient && b.patient !== 'Carlos Eduardo') {
        const d = db.prepare('SELECT id FROM dependentes WHERE usuario_id = ? AND nome = ?').get(usuarioId, b.patient);
        dependenteId = d?.id ?? null;
      }
      const convenioId = b.unit === 'Rede credenciada FUSEX' ? db.prepare('SELECT id FROM convenios WHERE nome = ?').get('FUSEX')?.id ?? null : null;
      const result = db.prepare(`INSERT INTO agendamentos (usuario_id, dependente_id, servico_id, unidade_id, convenio_id, data, horario, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmado')`).run(usuarioId, dependenteId, servicoId, unidadeId, convenioId, b.date.split('-').reverse().join('/'), b.time);
      const created = getAppointments(usuarioId).find(a => a.id === Number(result.lastInsertRowid));
      db.prepare(`INSERT INTO notificacoes (usuario_id, titulo, texto, momento, lida) VALUES (?, ?, ?, ?, 0)`).run(usuarioId, 'Agendamento confirmado', `${created.type} em ${created.date} às ${created.time}.`, 'Agora');
      return json(res, 201, created);
    }

    const cancelMatch = url.pathname.match(/^\/api\/agendamentos\/(\d+)\/cancelar$/);
    if (req.method === 'PATCH' && cancelMatch) {
      const id = Number(cancelMatch[1]);
      const result = db.prepare(`UPDATE agendamentos SET status = 'Cancelado' WHERE id = ?`).run(id);
      if (result.changes === 0) return json(res, 404, { error: 'Agendamento não encontrado.' });
      return json(res, 200, { ok: true, id });
    }

    if (req.method === 'PATCH' && url.pathname === '/api/notificacoes/marcar-lidas') {
      const userId = Number((await body(req)).usuario_id || 1);
      const result = db.prepare('UPDATE notificacoes SET lida = 1 WHERE usuario_id = ?').run(userId);
      return json(res, 200, { ok: true, alteradas: result.changes });
    }

    if (req.method === 'POST' && url.pathname === '/api/suporte') {
      const b = await body(req);
      if (!b.assunto || !b.mensagem) return json(res, 400, { error: 'Assunto e mensagem são obrigatórios.' });
      db.prepare(`INSERT INTO suporte_solicitacoes (usuario_id, assunto, mensagem) VALUES (?, ?, ?)`).run(Number(b.usuario_id || 1), b.assunto, b.mensagem);
      return json(res, 201, { ok: true, message: 'Solicitação registrada.' });
    }

    return false;
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: error.message || 'Erro interno.' });
  }
}

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'
};

function staticFile(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) return json(res, 403, { error: 'Acesso negado.' });
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) return json(res, 404, { error: 'Arquivo não encontrado.' });
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  if (url.pathname.startsWith('/api/')) {
    const handled = await api(req, res, url);
    if (handled === false) json(res, 404, { error: 'Endpoint não encontrado.' });
    return;
  }
  staticFile(req, res, url);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`FSR Saúde Digital disponível em http://localhost:${PORT}`));

process.on('SIGINT', () => { db.close(); server.close(() => process.exit(0)); });
