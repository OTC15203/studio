/**
 * Represents a blockchain transaction.
 */
export interface Transaction {
  /**
   * The transaction ID.
   */
  id: string;
  /**
   * The data associated with the transaction.
   * This should ideally match the input schema for consistency e.g. from data-entry.
   */
  data: any; 
  /**
   * The timestamp of the transaction.
   */
  timestamp: number;
  /**
   * Optional status or other metadata returned by the API.
   */
  status?: string;
  /**
   * The block number where this transaction was included.
   */
  blockNumber?: number;
  /**
   * The number of confirmations for this transaction.
   */
  confirmations?: number;
}

/**
 * Asynchronously adds a transaction to the blockchain by calling the internal API.
 *
 * @param data The data to be added to the blockchain. This should conform to the expected input schema of the API.
 * @returns A promise that resolves to a Transaction object.
 * @throws Will throw an error if the API call fails or returns an error status.
 */
export async function addTransaction(data: any): Promise<Transaction> {
  // Ensure the API endpoint matches your route handler's path
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add authorization headers if required by your API (e.g., API key, JWT token)
      // 'Authorization': `Bearer ${your_auth_token}`,
      // 'X-Internal-API-Key': process.env.INTERNAL_API_KEY, // Example if using an API key
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch (e) {
      // If parsing JSON fails, use the status text
      errorBody = { error: `API request failed with status ${response.status}`, details: response.statusText };
    }
    console.error('API Error during addTransaction:', response.status, errorBody);
    // Throw an error that includes details if available
    throw new Error(errorBody.error || `Failed to add transaction: ${response.statusText}`);
  }

  // Assuming the API returns the created transaction object in the shape of the Transaction interface
  const transactionResult: Transaction = await response.json();
  return transactionResult;
}
