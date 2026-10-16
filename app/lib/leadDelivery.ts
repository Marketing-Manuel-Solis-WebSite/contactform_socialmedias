/**
 * Entrega de los leads del formulario de la linktree (RRSS) a BOS y/o BoSpot.
 *
 * Mismo contrato v1.0 que el formulario de manuelsolis.com (app/lib/bospot.ts
 * del repo del sitio), con channel 'rrss' y source_platform 'linktree': así
 * BoSpot distingue estos leads de los del sitio. La red social concreta
 * (TikTok, Instagram…) llega en utm_source, que es lo que trae el enlace de
 * cada bio.
 *
 * Qué destinos reciben el lead lo decide LEAD_DESTINATION:
 *   - `bos`    → solo BOS (comportamiento histórico y el default).
 *   - `both`   → BOS y BoSpot en paralelo.
 *   - `bospot` → solo BoSpot. Si BoSpot no lo acepta (caída, token inválido,
 *                422), el lead se manda a BOS para no perderlo: esta app no
 *                tiene correo de respaldo como el sitio.
 * Sin BOSPOT_LEADS_TOKEN cualquier modo se degrada a `bos`.
 */

export const BOS_ENDPOINT = 'https://bos.manuelsolis.com/lead/manuelsolis';
export const BOSPOT_DEFAULT_ENDPOINT = 'https://solisjobrunner.com/api/external-app/marketing/leads';

export type LeadDestinationMode = 'bos' | 'both' | 'bospot';

export function resolveMode(rawMode: string | undefined, hasToken: boolean): LeadDestinationMode {
  const mode = (rawMode ?? '').trim().toLowerCase();
  if (hasToken && (mode === 'bospot' || mode === 'both')) return mode;
  return 'bos';
}

/** Lo que manda el navegador. Todo es opcional: no se confía en nada. */
export interface LinktreeFormBody {
  first_name?: unknown;
  last_name?: unknown;
  email?: unknown;
  phone?: unknown;
  enquiry_detail?: unknown;
  acceptedTerms?: unknown;
  marketingConsent?: unknown;
  uri?: unknown;
  language?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  gclid?: unknown;
  fbclid?: unknown;
  event_id?: unknown;
  referrer?: unknown;
}

/** Datos que solo conoce el servidor (cabeceras y cookies de la petición). */
export interface RequestContext {
  ip: string | null;
  userAgent: string | null;
  country: string | null;
  fbp: string | null;
  fbc: string | null;
  now: Date;
  newId: () => string;
}

function text(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  const v = value.trim();
  if (v === 'null' || v === 'undefined') return '';
  return v.slice(0, max);
}

function orNull(value: unknown, max: number): string | null {
  return text(value, max) || null;
}

const EVENT_ID_RE = /^[A-Za-z0-9._-]{8,64}$/;

export function normalizeEventId(raw: unknown, fallback: () => string): string {
  return typeof raw === 'string' && EVENT_ID_RE.test(raw.trim()) ? raw.trim() : fallback();
}

/** Solo referrers externos http(s): uno de la propia linktree no dice nada. */
export function normalizeReferrer(raw: unknown): string | null {
  const value = orNull(raw, 500);
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.hostname === 'contactform-socialmedias.vercel.app') return null;
    return value;
  } catch {
    return null;
  }
}

export function deviceType(userAgent: string | null): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!userAgent) return 'unknown';
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(userAgent)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

/**
 * fbc según el formato de Meta (fb.1.<ms>.<fbclid>). La cookie _fbc manda; si
 * no existe —esta página no carga el Pixel— se arma desde el fbclid del enlace.
 */
export function buildFbc(cookie: string | null, fbclid: string | null, now: Date): string | null {
  if (cookie) return cookie;
  return fbclid ? `fb.1.${now.getTime()}.${fbclid}` : null;
}

export interface NormalizedLead {
  event_id: string;
  submitted_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  enquiry_detail: string;
  acceptedTerms: boolean;
  marketingConsent: boolean;
  page_url: string;
  language: 'es' | 'en';
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer: string | null;
}

export function normalizeLead(body: LinktreeFormBody, ctx: RequestContext): NormalizedLead {
  return {
    event_id: normalizeEventId(body.event_id, ctx.newId),
    submitted_at: ctx.now.toISOString(),
    first_name: text(body.first_name, 100),
    last_name: text(body.last_name, 100),
    email: text(body.email, 200),
    phone: text(body.phone, 40),
    enquiry_detail: text(body.enquiry_detail, 5000),
    acceptedTerms: body.acceptedTerms === true,
    marketingConsent: body.marketingConsent === true,
    page_url: text(body.uri, 2000),
    language: body.language === 'en' ? 'en' : 'es',
    utm_source: orNull(body.utm_source, 200),
    utm_medium: orNull(body.utm_medium, 200),
    utm_campaign: orNull(body.utm_campaign, 200),
    utm_content: orNull(body.utm_content, 200),
    utm_term: orNull(body.utm_term, 200),
    gclid: orNull(body.gclid, 500),
    fbclid: orNull(body.fbclid, 500),
    referrer: normalizeReferrer(body.referrer),
  };
}

/** Payload histórico de BOS, igual que el que se mandaba antes de BoSpot. */
export function buildBosPayload(lead: NormalizedLead, bospotRef?: string) {
  // Sin UTMs, BOS siempre recibió estas etiquetas para saber que vino de la linktree.
  const source = lead.utm_source ?? 'LINKTREE';
  const medium = lead.utm_medium ?? 'Social';
  const campaign = lead.utm_campaign ?? 'Linktree';
  let detail =
    source !== 'SITIO WEB' ? `${lead.enquiry_detail} | Fuente: ${source}` : lead.enquiry_detail;
  if (bospotRef) detail = `${detail} | Ref BoSpot: ${bospotRef}`;
  return {
    name: lead.first_name,
    first_name: lead.first_name,
    last_name: lead.last_name,
    phone: lead.phone,
    email: lead.email,
    enquiry_detail: detail,
    acceptedTerms: lead.acceptedTerms ? 1 : 0,
    marketingConsent: lead.marketingConsent ? 1 : 0,
    uri: lead.page_url,
    language_preference: lead.language,
    source,
    utm_source: source,
    medium,
    utm_medium: medium,
    campaign,
  };
}

export function buildBospotPayload(lead: NormalizedLead, ctx: RequestContext) {
  return {
    schema_version: '1.0',
    event_id: lead.event_id,
    submitted_at: lead.submitted_at,
    channel: 'rrss',
    source_platform: 'linktree',
    contact_method: 'form',
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    language_preference: lead.language,
    enquiry_detail: lead.enquiry_detail,
    practice_area_inferred: null,
    office_inferred: null,
    acceptedTerms: lead.acceptedTerms,
    marketingConsent: lead.marketingConsent,
    page_url: lead.page_url,
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    utm_content: lead.utm_content,
    utm_term: lead.utm_term,
    first_touch_source: null,
    first_touch_medium: null,
    first_touch_campaign: null,
    referrer: lead.referrer,
    gclid: lead.gclid,
    fbclid: lead.fbclid,
    fbp: ctx.fbp,
    fbc: buildFbc(ctx.fbc, lead.fbclid, ctx.now),
    client_ip_address: ctx.ip,
    client_user_agent: ctx.userAgent,
    meta_leadgen_id: null,
    form_name: null,
    campaign_name: null,
    adset_name: null,
    ad_name: null,
    session_id: null,
    device_type: deviceType(ctx.userAgent),
    country: ctx.country,
  };
}

export interface PostResult {
  ok: boolean;
  status: number | null;
  /**
   * La petición salió pero no hubo respuesta (timeout): el destino pudo
   * haberla guardado. No se reintenta para no duplicar.
   */
  uncertain?: boolean;
  /** Para el log: nombres de los campos rechazados o el tipo de error, nunca el cuerpo crudo (puede traer datos personales). */
  detail?: string;
}

type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

async function errorSummary(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as { status?: unknown; errors?: unknown };
    const fields = json.errors && typeof json.errors === 'object' ? Object.keys(json.errors).join(',') : '';
    return [typeof json.status === 'string' ? json.status : '', fields].filter(Boolean).join(' ');
  } catch {
    return 'non-json';
  }
}

function isTimeout(err: unknown): boolean {
  return err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
}

/**
 * Un POST. `retries` solo se usa ante 5xx o errores de conexión, y solo para
 * BoSpot, que deduplica por event_id. BOS no deduplica: un reintento ahí
 * podría crear dos leads, así que va con un solo intento. Un timeout nunca se
 * reintenta: el destino pudo haber guardado el lead.
 */
async function post(
  fetchImpl: FetchLike,
  url: string,
  body: unknown,
  headers: Record<string, string>,
  { retries, timeoutMs }: { retries: number; timeoutMs: number },
): Promise<PostResult> {
  let last: PostResult = { ok: false, status: null };
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) return { ok: true, status: res.status };
      last = { ok: false, status: res.status, detail: await errorSummary(res) };
      if (res.status < 500) return last;
    } catch (err) {
      if (isTimeout(err)) return { ok: false, status: null, uncertain: true, detail: 'timeout' };
      last = { ok: false, status: null, detail: err instanceof Error ? err.name : 'error' };
    }
  }
  return last;
}

export interface DeliveryResult {
  mode: LeadDestinationMode;
  ok: boolean;
  bos?: PostResult;
  bospot?: PostResult;
  /** En modo bospot: BoSpot falló y el lead se salvó en BOS. */
  fellBackToBos: boolean;
}

export async function deliverLead(
  lead: NormalizedLead,
  ctx: RequestContext,
  env: Record<string, string | undefined>,
  fetchImpl: FetchLike = fetch,
): Promise<DeliveryResult> {
  const token = env.BOSPOT_LEADS_TOKEN?.trim();
  const mode = resolveMode(env.LEAD_DESTINATION, !!token);
  const bospotUrl = env.BOSPOT_LEADS_ENDPOINT?.trim() || BOSPOT_DEFAULT_ENDPOINT;
  // Con maxDuration = 60 en la ruta, el peor caso (BoSpot 2x10s + BOS 20s)
  // cabe holgado y el respaldo a BOS siempre llega a ejecutarse.
  const toBos = (bospotRef?: string) =>
    post(fetchImpl, BOS_ENDPOINT, buildBosPayload(lead, bospotRef), {}, { retries: 0, timeoutMs: 20000 });
  const toBospot = () =>
    post(
      fetchImpl,
      bospotUrl,
      buildBospotPayload(lead, ctx),
      { Authorization: `Bearer ${token}`, 'Idempotency-Key': lead.event_id },
      { retries: 1, timeoutMs: 10000 },
    );

  if (mode === 'bos') {
    const bos = await toBos();
    return { mode, ok: bos.ok, bos, fellBackToBos: false };
  }
  if (mode === 'both') {
    const [bos, bospot] = await Promise.all([toBos(), toBospot()]);
    return { mode, ok: bos.ok || bospot.ok, bos, bospot, fellBackToBos: false };
  }
  const bospot = await toBospot();
  if (bospot.ok) return { mode, ok: true, bospot, fellBackToBos: false };
  // Perder el lead es peor que tenerlo dos veces. Si BoSpot no contestó
  // (pudo guardarlo), el que va a BOS lleva el event_id para cruzarlos.
  const bos = await toBos(bospot.uncertain ? lead.event_id : undefined);
  return { mode, ok: bos.ok, bos, bospot, fellBackToBos: true };
}
