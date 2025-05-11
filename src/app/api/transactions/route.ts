import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

// This schema should ideally match or be derived from the one in data-entry/page.tsx
// For consistency, ensure fields used in data-entry form are present here.
const transactionInputSchema = z.object({
  type: z.enum(['revenue', 'expense']),
  amount: z.coerce.number().positive(),
  currency: z.string().min(3).max(3),
  description: z.string().min(1).max(200),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format." }),
  category: z.string().min(1),
  tags: z.string().optional(),
  // Add any other fields that might be part of the transaction data from the form
  // For example, if 'user' or specific details are captured:
  // user: z.string().email().optional(), 
  // paymentMethod: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // TODO: Implement robust authentication and authorization.
  // This is a placeholder for checking an API key or session token.
  // For example:
  // const session = await getServerSession(authOptions); // if using NextAuth.js
  // if (!session) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
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

    const transactionData = parsedData.data;

    // Simulate database interaction or further processing
    // In a real application, you would save transactionData to your database here.
    // For example: const savedTx = await db.transactions.create({ data: transactionData });
    const newTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      data: transactionData, // Echoing back the validated data
      timestamp: Date.now(),
      status: "logged", // Example of adding extra info from backend
    };

    console.log('Transaction received and processed by API:', newTransaction);

    // Return the created transaction object
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error processing transaction via API:', error);
    // Ensure a generic error message for production to avoid leaking sensitive details
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
