import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://bos.manuelsolis.com/lead/manuelsolis';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log("📥 [BACKEND] Body recibido del Frontend:", body);

        const { 
            first_name, 
            last_name, 
            email, 
            phone, 
            enquiry_detail, 
            acceptedTerms,
            marketingConsent,
            uri,
            language,
            utm_source,
            utm_medium,
            utm_campaign
        } = body;

        // Eliminar valores predefinidos, usar lo que llega directamente
        const finalSource = utm_source; 
        const finalMedium = utm_medium;
        const finalCampaign = utm_campaign;

        // --- LÓGICA DE DETALLE ---
        let finalDetail = enquiry_detail || '';
        // Solo agregamos la fuente si existe y no es 'SITIO WEB'
        if (finalSource && finalSource.trim() !== '' && finalSource !== 'SITIO WEB') {
             finalDetail = `${finalDetail} | Fuente: ${finalSource}`;
        }

        // --- PAYLOAD PARA BOS.MANUELSOLIS.COM ---
        const payload = {
            name: first_name,       
            first_name: first_name,
            last_name: last_name,
            phone: phone,
            email: email,
            enquiry_detail: finalDetail, 
            
            acceptedTerms: acceptedTerms ? 1 : 0,      
            marketingConsent: marketingConsent ? 1 : 0,
            
            uri: uri, 
            
            language_preference: language,
            
            source: finalSource,       
            utm_source: finalSource,   
            medium: finalMedium,
            utm_medium: finalMedium,
            campaign: finalCampaign
        };

        console.log("🚀 [BACKEND] Enviando a BOS:", payload);

        const response = await fetch(EXTERNAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return NextResponse.json({ success: true });
        } else {
            const errorText = await response.text();
            console.error("❌ ERROR API BOS:", errorText);
            return NextResponse.json({ success: false, error: 'External API error' }, { status: response.status });
        }
    } catch (error) {
        console.error('❌ ERROR SERVIDOR:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}