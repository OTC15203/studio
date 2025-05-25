
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

// Define all possible transaction types, similar to those used in the chain log page
const ALL_TRANSACTION_TYPES = [
  'revenue', 'expense', 'system_update', 'data_access', 'config_change', 
  'user_auth', 'api_call', 'security_event', 'audit_log', 'nft_mint', 
  'token_transfer', 'contract_deploy', 'oracle_update'
] as const; // Use 'as const' for Zod enum

// Updated schema to be more generic for various blockchain/system events
const transactionInputSchema = z.object({
  type: z.enum(ALL_TRANSACTION_TYPES, { 
    required_error: "Event type is required." 
  }),
  amount: z.coerce.number().positive({ message: "Amount, if provided, must be a positive number." }).optional(),
  currency: z.string().min(2, {message: "Currency, if provided, must be 2-10 characters."}).max(10).optional(),
  description: z.string().min(1, { message: "Description is required."}).max(500), // Increased max length
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format." }),
  category: z.string().min(1, {message: "Category is required."}), // General purpose category
  tags: z.string().optional(),
  
  // New optional fields for broader event types
  network: z.string().optional().describe("The blockchain network (e.g., Ethereum, zkSync, Linea)"),
  userAddress: z.string().optional().describe("Address of the user initiating or involved in the event."),
  contractAddress: z.string().optional().describe("Address of the smart contract involved."),
  referenceId: z.string().optional().describe("An ID to reference another entity or event (e.g., Tx Hash, NFT ID)."),
  // Consider adding more specific fields if needed in future, like functionCalled, parameters for contract interactions etc.
});

export async function POST(request: NextRequest) {
  // TODO: Implement robust authentication and authorization.
  // For example:
  // const apiKey = request.headers.get('X-Internal-API-Key');
  // if (apiKey !== process.env.INTERNAL_API_KEY) {
  //    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const parsedData = transactionInputSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsedData.error.format() }, { status: 400 });
    }

    const eventData = parsedData.data;

    // Simulate database interaction or further processing
    const newEventLog = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      data: eventData, // Echoing back the validated data
      timestamp: Date.now(),
      status: "logged", 
    };

    console.log('Event received and processed by API:', newEventLog);

    // Return the created event log object
    return NextResponse.json(newEventLog, { status: 201 });
  } catch (error) {
    console.error('Error processing event via API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

