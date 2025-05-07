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
    })
    .optional()
    .describe('Details of the detected threat, if any.'),
});
export type DetectManipulationAttemptsOutput = z.infer<typeof DetectManipulationAttemptsOutputSchema>;

export async function detectManipulationAttempts(input: DetectManipulationAttemptsInput): Promise<DetectManipulationAttemptsOutput> {
  return detectManipulationAttemptsFlow(input);
}

const detectManipulationAttemptsFlow = ai.defineFlow(
  {
    name: 'detectManipulationAttemptsFlow',
    inputSchema: DetectManipulationAttemptsInputSchema,
    outputSchema: DetectManipulationAttemptsOutputSchema,
  },
  async input => {
    const threat = await detectThreat(input.transactionData);

    const threatDetected = threat !== null;

    return {
      threatDetected: threatDetected,
      threatDetails: threatDetected ? threat : undefined,
    };
  }
);
