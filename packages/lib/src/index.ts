export * from './supabase';
export * from './types_db';
export * from './middleware';
// Note: server.ts and client.ts should be imported specifically where needed due to environment constraints (node vs browser)
// but we can export types if needed.

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(amount);
};
