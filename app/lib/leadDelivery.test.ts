// Pruebas de la entrega de leads. Correr con: npm test (node --test, sin dependencias).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BOS_ENDPOINT,
  BOSPOT_DEFAULT_ENDPOINT,
  buildBosPayload,
  buildBospotPayload,
  deliverLead,
  deviceType,
  normalizeLead,
  resolveMode,
  type RequestContext,
} from './leadDelivery.ts';

const ctx: RequestContext = {
  ip: '203.0.113.25',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148',
  country: 'US',
  fbp: null,
  fbc: null,
  now: new Date('2026-10-16T18:00:00.000Z'),
  newId: () => 'server-generated-id',
};

const body = {
  first_name: ' Maria ',
  last_name: 'Lopez',
  email: 'maria@example.com',
  phone: '(713) 555-0142',
  enquiry_detail: 'Quiero arreglar mi estatus',
  acceptedTerms: true,
  marketingConsent: false,
  uri: 'https://contactform-socialmedias.vercel.app/?utm_source=TIKTOK&utm_medium=organic_social&utm_campaign=link_bio',
  language: 'es',
  utm_source: 'TIKTOK',
  utm_medium: 'organic_social',
  utm_campaign: 'link_bio',
  utm_content: '',
  utm_term: '',
  gclid: '',
  fbclid: '',
  event_id: '7c1e2b9a-4f3d-4c11-9a0e-2f1b6d8e5a10',
  referrer: 'https://www.tiktok.com/',
};

test('resolveMode: sin token siempre BOS', () => {
  assert.equal(resolveMode('bospot', false), 'bos');
  assert.equal(resolveMode(' BoSpot ', true), 'bospot');
  assert.equal(resolveMode('both', true), 'both');
  assert.equal(resolveMode(undefined, true), 'bos');
});

test('payload BoSpot: contrato v1.0 con canal rrss y plataforma linktree', () => {
  const p = buildBospotPayload(normalizeLead(body, ctx), ctx);
  assert.equal(p.schema_version, '1.0');
  assert.equal(p.channel, 'rrss');
  assert.equal(p.source_platform, 'linktree');
  assert.equal(p.contact_method, 'form');
  assert.equal(p.first_name, 'Maria');
  assert.equal(p.event_id, body.event_id);
  assert.equal(p.submitted_at, '2026-10-16T18:00:00.000Z');
  assert.equal(p.utm_source, 'TIKTOK');
  assert.equal(p.utm_medium, 'organic_social');
  assert.equal(p.utm_campaign, 'link_bio');
  assert.equal(p.utm_content, null);
  assert.equal(p.acceptedTerms, true);
  assert.equal(p.marketingConsent, false);
  assert.equal(p.enquiry_detail, 'Quiero arreglar mi estatus');
  assert.equal(p.referrer, 'https://www.tiktok.com/');
  assert.equal(p.device_type, 'mobile');
  assert.equal(p.client_ip_address, '203.0.113.25');
  assert.equal(p.country, 'US');
});

test('payload BOS: igual que antes, con las etiquetas por defecto si no hay UTMs', () => {
  const lead = normalizeLead({ ...body, utm_source: '', utm_medium: '', utm_campaign: '' }, ctx);
  const p = buildBosPayload(lead);
  assert.equal(p.utm_source, 'LINKTREE');
  assert.equal(p.medium, 'Social');
  assert.equal(p.campaign, 'Linktree');
  assert.equal(p.enquiry_detail, 'Quiero arreglar mi estatus | Fuente: LINKTREE');
  assert.equal(p.acceptedTerms, 1);
  // A BoSpot las UTMs vacías le llegan como null, no con las etiquetas de BOS.
  assert.equal(buildBospotPayload(lead, ctx).utm_source, null);
});

test('event_id inválido se reemplaza; fbc se arma desde fbclid', () => {
  const lead = normalizeLead({ ...body, event_id: '<script>', fbclid: 'IwAR0abc' }, ctx);
  assert.equal(lead.event_id, 'server-generated-id');
  assert.equal(buildBospotPayload(lead, ctx).fbc, `fb.1.${ctx.now.getTime()}.IwAR0abc`);
});

test('deviceType', () => {
  assert.equal(deviceType(null), 'unknown');
  assert.equal(deviceType('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'), 'desktop');
  assert.equal(deviceType('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)'), 'tablet');
});

function fakeFetch(statusFor: (url: string) => number) {
  const calls: { url: string; init: RequestInit }[] = [];
  const impl = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response('{}', { status: statusFor(url) });
  };
  return { calls, impl };
}

const lead = normalizeLead(body, ctx);

test('bospot: solo BoSpot, con token e Idempotency-Key; BOS no recibe nada', async () => {
  const f = fakeFetch(() => 201);
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot', BOSPOT_LEADS_TOKEN: 'tok' }, f.impl);
  assert.equal(r.ok, true);
  assert.equal(r.fellBackToBos, false);
  assert.deepEqual(f.calls.map((c) => c.url), [BOSPOT_DEFAULT_ENDPOINT]);
  const h = f.calls[0].init.headers as Record<string, string>;
  assert.equal(h.Authorization, 'Bearer tok');
  assert.equal(h['Idempotency-Key'], body.event_id);
});

test('bospot: 200 duplicate cuenta como entregado', async () => {
  const f = fakeFetch(() => 200);
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot', BOSPOT_LEADS_TOKEN: 'tok' }, f.impl);
  assert.equal(r.ok, true);
  assert.equal(f.calls.length, 1);
});

test('bospot: si BoSpot rechaza (422) el lead se salva en BOS, sin reintentar', async () => {
  const f = fakeFetch((url) => (url === BOSPOT_DEFAULT_ENDPOINT ? 422 : 200));
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot', BOSPOT_LEADS_TOKEN: 'tok' }, f.impl);
  assert.equal(r.ok, true);
  assert.equal(r.fellBackToBos, true);
  assert.deepEqual(f.calls.map((c) => c.url), [BOSPOT_DEFAULT_ENDPOINT, BOS_ENDPOINT]);
});

test('bospot: un 500 se reintenta una vez antes de caer a BOS', async () => {
  const f = fakeFetch((url) => (url === BOSPOT_DEFAULT_ENDPOINT ? 503 : 200));
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot', BOSPOT_LEADS_TOKEN: 'tok' }, f.impl);
  assert.equal(r.ok, true);
  assert.deepEqual(f.calls.map((c) => c.url), [BOSPOT_DEFAULT_ENDPOINT, BOSPOT_DEFAULT_ENDPOINT, BOS_ENDPOINT]);
});

test('bospot: si fallan los dos, el envío falla', async () => {
  const f = fakeFetch(() => 500);
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot', BOSPOT_LEADS_TOKEN: 'tok' }, f.impl);
  assert.equal(r.ok, false);
});

test('sin token: solo BOS, como antes', async () => {
  const f = fakeFetch(() => 200);
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot' }, f.impl);
  assert.equal(r.mode, 'bos');
  assert.deepEqual(f.calls.map((c) => c.url), [BOS_ENDPOINT]);
  assert.equal((f.calls[0].init.headers as Record<string, string>).Authorization, undefined);
});

test('both: a los dos en paralelo', async () => {
  const f = fakeFetch(() => 201);
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'both', BOSPOT_LEADS_TOKEN: 'tok' }, f.impl);
  assert.equal(r.ok, true);
  assert.deepEqual(f.calls.map((c) => c.url).sort(), [BOSPOT_DEFAULT_ENDPOINT, BOS_ENDPOINT].sort());
});

test('BOS nunca se reintenta: un 500 no crea un segundo lead', async () => {
  const f = fakeFetch(() => 500);
  const r = await deliverLead(lead, ctx, {}, f.impl);
  assert.equal(r.ok, false);
  assert.deepEqual(f.calls.map((c) => c.url), [BOS_ENDPOINT]);
});

test('bospot: un timeout no se reintenta y el lead de BOS lleva el event_id para cruzarlo', async () => {
  const calls: string[] = [];
  const impl = async (url: string, init: RequestInit) => {
    calls.push(url);
    if (url === BOSPOT_DEFAULT_ENDPOINT) {
      const err = new Error('timeout');
      err.name = 'TimeoutError';
      throw err;
    }
    assert.match(JSON.parse(init.body as string).enquiry_detail, new RegExp(`Ref BoSpot: ${body.event_id}$`));
    return new Response('{}', { status: 200 });
  };
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot', BOSPOT_LEADS_TOKEN: 'tok' }, impl);
  assert.equal(r.ok, true);
  assert.equal(r.bospot?.uncertain, true);
  assert.deepEqual(calls, [BOSPOT_DEFAULT_ENDPOINT, BOS_ENDPOINT]);
});

test('el log nunca recibe el cuerpo crudo: solo estado y nombres de campos', async () => {
  const impl = async (url: string) =>
    url === BOSPOT_DEFAULT_ENDPOINT
      ? new Response(JSON.stringify({ status: 'rejected', errors: { email: ['maria@example.com no es válido'] } }), { status: 422 })
      : new Response('{}', { status: 200 });
  const r = await deliverLead(lead, ctx, { LEAD_DESTINATION: 'bospot', BOSPOT_LEADS_TOKEN: 'tok' }, impl);
  assert.equal(r.bospot?.detail, 'rejected email');
  // Un 422 claro no es incierto: el de BOS va sin referencia.
  assert.equal(r.bospot?.uncertain, undefined);
});
