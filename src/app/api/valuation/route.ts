import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, queryType, propertyDetails } = await req.json();

    const systemInstruction = `You are the chief property analyst, valuation specialist, and legal documentation advisor for "Nigeria Property Centre" (the leading real estate marketplace in Nigeria).
You have encyclopedic knowledge of:
1. Real estate market values, current prices, and rental yields across Nigeria:
   - Lagos (Lekki Phase 1, Ikoyi, Victoria Island, Banana Island, Ikeja GRA, Ajah, Surulere, Epe, Magodo).
   - Abuja FCT (Maitama, Asokoro, Wuse 2, Jabi, Guzape, Gwarinpa, Katampe, Apo).
   - Port Harcourt, Ibadan, Asaba, Ogun (Arepo, Mowe).
2. Nigerian Land Documentation & Title laws (Land Use Act 1978):
   - Certificate of Occupancy (C of O) vs Federal C of O.
   - Governor's Consent (when and why it is mandatory for secondary transactions in Lagos/states).
   - Government Gazette, Excision, Right of Occupancy (R of O in Abuja via AGIS).
   - Registered Deed of Assignment & Charted Survey Plan (Beacon numbers, Lagos State Lands Bureau Alausa verification).
   - How to avoid "Omo-onile" issues, government acquisition / committed land traps.
3. Realistic pricing in Nigerian Naira (₦) and current 2026 real-world market ranges.

Respond in well-structured, clear markdown with bullet points, realistic price brackets in Naira (₦), title safety checklist, and actionable advice. Keep tone professional, authoritative, and direct.`;

    let userMessage = prompt;
    if (queryType === 'valuation' && propertyDetails) {
      userMessage = `Please provide a market valuation and rental analysis for this property:
- Type: ${propertyDetails.propertyType || 'Residential'}
- Location: ${propertyDetails.area || ''}, ${propertyDetails.state || ''}
- Bedrooms: ${propertyDetails.bedrooms || 'N/A'}
- Title: ${propertyDetails.titleDocument || 'N/A'}
- Asking Price: ${propertyDetails.price ? '₦' + propertyDetails.price : 'N/A'}
- Additional features: ${propertyDetails.features || 'Standard finishing'}

Please detail:
1. Realistic Fair Market Value Range (Sales & Annual Rent in ₦ Naira)
2. Expected Annual Rental Yield (%) in this neighborhood
3. Title Safety Rating & verification steps with State Lands Bureau
4. Key investment takeaways`;
    } else if (queryType === 'title-check') {
      userMessage = `Please explain the legal safety and verification process for: "${prompt}". Explain what documents the buyer must demand, where to verify (e.g. Alausa Lands Bureau or AGIS), and risks to mitigate.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({
      text: response.text || 'Unable to generate property analysis. Please retry.',
    });
  } catch (error) {
    console.error('Valuation API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process valuation or property advisory request.',
      },
      { status: 500 }
    );
  }
}
