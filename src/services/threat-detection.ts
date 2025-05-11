/**
 * Represents a security threat.
 * Ensure this interface matches the structure returned by your /api/threats endpoint
 * and expected by consuming components/flows (e.g., DetectManipulationAttemptsOutputSchema).
 */
export interface Threat {
  /**
   * The ID of the threat.
   */
  id: string;
  /**
   * The type of threat.
   */
  type: string;
  /**
   * The severity of the threat.
   */
  severity: string; // e.g., 'Low', 'Medium', 'High', 'Critical'
  /**
   * The timestamp of the threat.
   */
  timestamp: number;
  /**
   * Optional details about the threat.
   */
  details?: string;
}

/**
 * Asynchronously detects threats by calling the internal /api/threats endpoint.
 *
 * @param data The data to be analyzed for threats.
 * @returns A promise that resolves to a Threat object if a threat is found, or null otherwise.
 * @throws Will throw an error if the API call fails unexpectedly (e.g., network error, 500 server error).
 */
export async function detectThreat(data: any): Promise<Threat | null> {
  const response = await fetch('/api/threats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add authorization headers if required by your API
      // 'Authorization': `Bearer ${your_auth_token}`,
      // 'X-Internal-API-Key': process.env.INTERNAL_API_KEY,
    },
    body: JSON.stringify(data), // Send the data to be analyzed
  });

  if (!response.ok) {
    // The API for /api/threats is designed to return 200 OK even if no threat is found (with null body).
    // Therefore, any non-OK status here is an unexpected error.
    let errorBody;
    try {
      errorBody = await response.json();
    } catch (e) {
      errorBody = { error: `API request failed with status ${response.status}`, details: response.statusText };
    }
    console.error('API Error during detectThreat:', response.status, errorBody);
    throw new Error(errorBody.error || `Failed to detect threat via API: ${response.statusText}`);
  }

  // The API /api/threats should return a JSON body containing the Threat object or null.
  const threatResult: Threat | null = await response.json();
  return threatResult;
}
