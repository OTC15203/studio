import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

// Define a schema for the expected input if specific structure is known
// For now, 'any' is used, but a more specific schema is recommended for robustness.
const threatAnalysisInputSchema = z.any(); // Replace with specific schema as needed e.g. z.object({ transactionData: z.object({...}) })

// Define the structure of a Threat, consistent with the service and AI flow output
const ThreatSchema = z.object({
  id: z.string(),
  type: z.string(),
  severity: z.string(), // Consider z.enum(['Low', 'Medium', 'High', 'Critical'])
  timestamp: z.number(),
  details: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // TODO: Implement robust authentication and authorization
  // Example:
  // const apiKey = request.headers.get('X-Internal-API-Key');
  // if (apiKey !== process.env.INTERNAL_API_KEY) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    // Optionally, validate the input body if a schema is defined
    // const parsedInput = threatAnalysisInputSchema.safeParse(body);
    // if (!parsedInput.success) {
    //   return NextResponse.json({ error: 'Invalid input for threat analysis', details: parsedInput.error.format() }, { status: 400 });
    // }
    // const dataToAnalyze = parsedInput.data;

    const dataToAnalyze = body; // Using raw body for now

    // Simulate threat detection logic.
    // In a real system, this would involve more complex rules, ML models, or external services.
    let detectedThreat: z.infer<typeof ThreatSchema> | null = null;

    // Example heuristic: flag large expenses as high severity
    if (dataToAnalyze && typeof dataToAnalyze.amount === 'number' && dataToAnalyze.amount > 10000 && dataToAnalyze.type === 'expense') {
      detectedThreat = {
        id: `threat_le_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'Unusually Large Expense',
        severity: 'High',
        timestamp: Date.now(),
        details: `An expense of ${dataToAnalyze.currency || ''} ${dataToAnalyze.amount} was recorded, exceeding the typical threshold. Category: ${dataToAnalyze.category || 'N/A'}.`,
      };
    } 
    // Example heuristic: flag transactions with suspicious keywords
    else if (dataToAnalyze && typeof dataToAnalyze.description === 'string' && (dataToAnalyze.description.toLowerCase().includes('urgent payment') || dataToAnalyze.description.toLowerCase().includes('immediate transfer'))) {
      detectedThreat = {
        id: `threat_kw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'Suspicious Wording in Description',
        severity: 'Medium',
        timestamp: Date.now(),
        details: `Transaction description "${dataToAnalyze.description}" contains potentially suspicious keywords.`,
      };
    }
    // Example: If data contains transactionData field (as per original flow input)
    else if (dataToAnalyze && dataToAnalyze.transactionData && typeof dataToAnalyze.transactionData.amount === 'number' && dataToAnalyze.transactionData.amount < 0) {
         detectedThreat = {
            id: `threat_neg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'Negative Amount Anomaly',
            severity: 'Medium',
            timestamp: Date.now(),
            details: `Transaction amount ${dataToAnalyze.transactionData.amount} is negative, which might be unusual.`,
      };
    }


    if (detectedThreat) {
      console.log('Threat detected by API:', detectedThreat);
      return NextResponse.json(detectedThreat, { status: 200 });
    } else {
      console.log('No specific threat detected by API for data:', dataToAnalyze);
      // Return null as per the service layer's expectation for no threat found
      return NextResponse.json(null, { status: 200 });
    }

  } catch (error) {
    console.error('Error processing threat detection via API:', error);
    return NextResponse.json({ error: 'Internal Server Error while detecting threat' }, { status: 500 });
  }
}
