export * from './supabase';
export * from './types_db';
// Note: middleware.ts has Next.js dependencies and should be imported directly where needed
// export * from './middleware';

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(amount);
};

export * from "./task-store";
