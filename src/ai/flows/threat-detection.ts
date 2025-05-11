// 'use server';
/**
 * @fileOverview AI-powered threat detection flow.
 *
 * - detectManipulationAttempts - A function that detects potential manipulation attempts and security threats.
 * - DetectManipulationAttemptsInput - The input type for the detectManipulationAttempts function.
 * - DetectManipulationAttemptsOutput - The return type for the detectManipulationAttempts function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {detectThreat} from '@/services/threat-detection';

const DetectManipulationAttemptsInputSchema = z.object({
  transactionData: z.any().describe('The transaction data to be analyzed for threats.'),
});
export type DetectManipulationAttemptsInput = z.infer<typeof DetectManipulationAttemptsInputSchema>;

const DetectManipulationAttemptsOutputSchema = z.object({
  threatDetected: z.boolean().describe('Whether a threat was detected in the transaction data.'),
  threatDetails: z
    .object({
      id: z.string().describe('The ID of the threat.'),
      type: z.string().describe('The type of threat.'),
      severity: z.string().describe('The severity of the threat.'),
      timestamp: z.number().describe('The timestamp of the threat.'),
      details: z.string().optional().describe('Additional details about the detected threat.'),
    })
    .optional()
    .describe('Details of the detected threat, if any.'),
});
export type DetectManipulationAttemptsOutput = z.infer<typeof DetectManipulationAttemptsOutputSchema>;

export async function detectManipulationAttempts(input: DetectManipulationAttemptsInput): Promise<DetectManipulationAttemptsOutput> {
  return detectManipulationAttemptsFlow(input);
}

// This flow now primarily orchestrates calling the threat detection service,
// which in turn calls the /api/threats endpoint.
// If this Genkit flow itself were to use an LLM to interpret the transactionData
// and decide if it's a threat (without calling the service), the prompt-based approach
// would be different. For now, it relies on the `detectThreat` service.
const detectManipulationAttemptsFlow = ai.defineFlow(
  {
    name: 'detectManipulationAttemptsFlow',
    inputSchema: DetectManipulationAttemptsInputSchema,
    outputSchema: DetectManipulationAttemptsOutputSchema,
  },
  async input => {
    // The `input.transactionData` is passed to the service.
    // The service now calls the `/api/threats` endpoint with this data.
    const threat = await detectThreat(input.transactionData);

    const threatDetected = threat !== null;

    return {
      threatDetected: threatDetected,
      threatDetails: threatDetected ? threat : undefined,
    };
  }
);
