import { NextRequest, NextResponse } from 'next/server';
import { deliverLead, normalizeLead, type LinktreeFormBody, type RequestContext } from '../../lib/leadDelivery';

/** Peor caso de entrega: BoSpot 2x10s y luego BOS 20s (ver leadDelivery.ts). */
export const maxDuration = 60;

/**
 * Recibe el formulario de la linktree y lo entrega a BoSpot y/o BOS según
 * LEAD_DESTINATION (ver app/lib/leadDelivery.ts). El nombre de la ruta es
 * histórico: ya no pasa por Zapier.
 *
 * Los logs no llevan datos personales: solo el event_id y el resultado.
 */
export async function POST(request: NextRequest) {
  let body: LinktreeFormBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const ctx: RequestContext = {
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
    userAgent: request.headers.get('user-agent')?.slice(0, 500) || null,
    country: request.headers.get('x-vercel-ip-country') || null,
    fbp: request.cookies.get('_fbp')?.value || null,
    fbc: request.cookies.get('_fbc')?.value || null,
    now: new Date(),
    newId: () => crypto.randomUUID(),
  };

  const lead = normalizeLead(body, ctx);
  // Lo mínimo para poder contactar. El navegador ya exige el resto; un campo
  // con solo espacios no debe tirar un lead que antes llegaba.
  if ((!lead.phone && !lead.email) || !lead.acceptedTerms) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await deliverLead(lead, ctx, process.env);
    const summary = {
      event_id: lead.event_id,
      mode: result.mode,
      bospot: result.bospot?.status ?? null,
      bos: result.bos?.status ?? null,
      fellBackToBos: result.fellBackToBos,
      bospotDetail: result.bospot?.detail ?? null,
      bosDetail: result.bos?.detail ?? null,
    };
    if (!result.ok) {
      console.error('❌ Lead no entregado', summary);
      return NextResponse.json({ success: false, error: 'Lead delivery failed' }, { status: 502 });
    }
    if (result.fellBackToBos || (result.bospot && !result.bospot.ok)) {
      console.error('⚠️ BoSpot no aceptó el lead', summary);
    } else {
      console.log('✅ Lead entregado', summary);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ ERROR SERVIDOR', lead.event_id, error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
