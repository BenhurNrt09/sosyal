export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    role: 'user' | 'admin'
                    balance: number
                    is_dijital_havuz_user: boolean
                    is_parala_user: boolean
                    name: string | null
                    phone: string | null
                    device_type: string | null
                    instagram_username: string | null
                    tiktok_username: string | null
                    twitter_username: string | null
                    youtube_username: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'admin'
                    balance?: number
                    is_dijital_havuz_user?: boolean
                    is_parala_user?: boolean
                    name?: string | null
                    phone?: string | null
                    device_type?: string | null
                    instagram_username?: string | null
                    tiktok_username?: string | null
                    twitter_username?: string | null
                    youtube_username?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'admin'
                    balance?: number
                    is_dijital_havuz_user?: boolean
                    is_parala_user?: boolean
                    name?: string | null
                    phone?: string | null
                    device_type?: string | null
                    instagram_username?: string | null
                    tiktok_username?: string | null
                    twitter_username?: string | null
                    youtube_username?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string | null
                    title: string
                    message: string
                    type: string
                    link: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    title: string
                    message: string
                    type?: string
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    title?: string
                    message?: string
                    type?: string
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    created_by: string
                    platform: string
                    platform_name: string
                    task_type: string
                    task_type_name: string
                    title: string | null
                    description: string | null
                    link: string
                    account_name: string | null
                    quantity: number
                    remaining_quantity: number
                    price_per_action: number
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    created_by: string
                    platform: string
                    platform_name: string
                    task_type: string
                    task_type_name: string
                    title?: string | null
                    description?: string | null
                    link: string
                    account_name?: string | null
                    quantity: number
                    remaining_quantity?: number
                    price_per_action: number
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    created_by?: string
                    platform?: string
                    platform_name?: string
                    task_type?: string
                    task_type_name?: string
                    title?: string | null
                    description?: string | null
                    link?: string
                    account_name?: string | null
                    quantity?: number
                    remaining_quantity?: number
                    price_per_action?: number
                    status?: string
                    created_at?: string
                }
            }
            task_submissions: {
                Row: {
                    id: string
                    task_id: string
                    worker_id: string
                    proof_text: string | null
                    proof_url: string | null
                    status: string
                    created_at: string
                    reviewed_at: string | null
                }
                Insert: {
                    id?: string
                    task_id: string
                    worker_id: string
                    proof_text?: string | null
                    proof_url?: string | null
                    status?: string
                    created_at?: string
                    reviewed_at?: string | null
                }
                Update: {
                    id?: string
                    task_id?: string
                    worker_id?: string
                    proof_text?: string | null
                    proof_url?: string | null
                    status?: string
                    created_at?: string
                    reviewed_at?: string | null
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    transaction_type: string
                    status: string
                    description: string | null
                    reference_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    transaction_type: string
                    status?: string
                    description?: string | null
                    reference_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    transaction_type?: string
                    status?: string
                    description?: string | null
                    reference_id?: string | null
                    created_at?: string
                }
            }
        }
    }
}
