export type UserRole = 'user' | 'admin';
export type TaskPlatform = 'instagram' | 'tiktok' | 'facebook';
export type TaskType = 'follow' | 'like' | 'comment' | 'dm';
export type TaskStatus = 'active' | 'completed' | 'cancelled' | 'paused';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'deposit' | 'withdrawal' | 'task_reward' | 'task_creation_hold' | 'refund';
export type TransactionStatus = 'completed' | 'pending' | 'rejected';

export interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: string;
    created_by: string;
    title: string;
    description: string | null;
    platform: TaskPlatform;
    task_type: TaskType;
    price_per_action: number;
    total_quantity: number;
    remaining_quantity: number;
    total_budget: number;
    status: TaskStatus;
    created_at: string;
}

export interface TaskSubmission {
    id: string;
    task_id: string;
    worker_id: string;
    proof_url: string | null;
    proof_text: string | null;
    status: SubmissionStatus;
    created_at: string;
    reviewed_at: string | null;
}

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    transaction_type: TransactionType;
    status: TransactionStatus;
    description: string | null;
    reference_id: string | null;
    created_at: string;
}

export interface WithdrawalRequest {
    id: string;
    user_id: string;
    amount: number;
    bank_details: string;
    status: TransactionStatus;
    processed_at: string | null;
    created_at: string;
}
