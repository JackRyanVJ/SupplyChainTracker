import { NextRequest, NextResponse } from 'next/server';
import { APPROVED_HOT_WHEELS_MODELS } from '@/types/database';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const filename = (file?.name || (formData.get('filename') as string) || '').toLowerCase();
    const simulateDamage = formData.get('simulateDamage') === 'true' || filename.includes('damage') || filename.includes('scratch');

    if (!filename) {
      return NextResponse.json({ recognized: false, message: 'Not recognized' });
    }

    let matchedModel = null;

    if (filename.includes('clk') || filename.includes('amg') || filename.includes('black series') || filename.includes('1786124239617') || filename.includes('1786121897142')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[0]; // 2008 Mercedes-Benz Clk 63 Amg Black Series (₹1659)
    } else if (filename.includes('toyota') || filename.includes('celica') || filename.includes('1977') || filename.includes('1786116993418')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[1]; // 1977 Toyota Celica Premium (₹1249)
    } else if (filename.includes('formula') || filename.includes('f1') || filename.includes('petronas') || filename.includes('1786116993435')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[2]; // Formula 1 (₹2079)
    } else if (filename.includes('jaguar') || filename.includes('etype') || filename.includes('e-type') || filename.includes('moma') || filename.includes('1786116993519')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[3]; // Jaguar E-Type Roadster (₹3499)
    } else if (filename.includes('stagea') || filename.includes('nissan') || filename.includes('elite') || filename.includes('1786118162108')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[4]; // Nissan Stagea (₹1299)
    } else if (filename.includes('300sl') || filename.includes('300 sl') || filename.includes('300') || filename.includes('gullwing') || filename.includes('1786117226108')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[5]; // Mercedes-Benz 300 SL (₹2499)
    } else if (filename.includes('audi') || filename.includes('quattro') || filename.includes('84 audi') || filename.includes('1786117226076')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[6]; // '84 Audi Sport Quattro (₹2899)
    } else if (filename.includes('bone') || filename.includes('boneshaker') || filename.includes('skull') || filename.includes('1786119562568')) {
      matchedModel = APPROVED_HOT_WHEELS_MODELS[7]; // Bone Shaker Retro Classic (₹1499)
    }

    if (!matchedModel) {
      return NextResponse.json({
        recognized: false,
        message: 'Not recognized',
      });
    }

    return NextResponse.json({
      recognized: true,
      model: matchedModel,
      isDamaged: simulateDamage,
    });
  } catch {
    return NextResponse.json({ recognized: false, message: 'Not recognized' });
  }
}
