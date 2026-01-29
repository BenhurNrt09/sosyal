// Supabase-based task storage with real-time synchronization
import { createClient } from './supabase';

export interface Task {
    id: string;
    platform: string;
    platformName: string;
    taskType: string;
    taskTypeName: string;
    link: string;
    accountName: string;
    quantity: number;
    price: number;
    description: string;
    status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
    createdAt: string;
    createdBy?: string;
    assignedTo?: string;
}

export interface Submission {
    id: string;
    taskId: string;
    userId: string;
    proofData: string;
    status: 'pending' | 'approved' | 'submitted' | 'creator_approved' | 'completed' | 'rejected';
    createdAt: string;
    updatedAt: string;
    task?: Task;
    user?: any; // Profile info
}

// Initialize Supabase client
function getSupabaseClient() {
    if (typeof window === 'undefined') {
        throw new Error('Supabase client can only be used in browser');
    }
    return createClient();
}

// Get all tasks from Supabase
export async function getTasks(): Promise<Task[]> {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }

        // Map snake_case to camelCase
        return (data || []).map(task => ({
            id: task.id,
            platform: task.platform,
            platformName: task.platform_name,
            taskType: task.task_type,
            taskTypeName: task.task_type_name,
            link: task.link,
            accountName: task.account_name,
            quantity: Number(task.quantity),
            price: Number(task.price),
            description: task.description || '',
            status: task.status as Task['status'],
            createdAt: task.created_at,
            createdBy: task.created_by,
            assignedTo: task.assigned_to,
        }));
    } catch (error) {
        console.error('Error in getTasks:', error);
        return [];
    }
}

// Add a new task to Supabase
export async function addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task | null> {
    try {
        console.log('Adding task to Supabase:', task);
        const supabase = getSupabaseClient();

        // Map camelCase to snake_case for database
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                platform: task.platform,
                platform_name: task.platformName,
                task_type: task.taskType,
                task_type_name: task.taskTypeName,
                link: task.link,
                account_name: task.accountName,
                quantity: task.quantity,
                price: task.price,
                description: task.description,
                status: task.status,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase Error (addTask):', error);
            alert('Supabase Hatası: ' + error.message);
            return null;
        }

        console.log('Task added successfully:', data);

        // Map back to camelCase
        return {
            id: data.id,
            platform: data.platform,
            platformName: data.platform_name,
            taskType: data.task_type,
            taskTypeName: data.task_type_name,
            link: data.link,
            accountName: data.account_name,
            quantity: data.quantity,
            price: data.price,
            description: data.description || '',
            status: data.status as Task['status'],
            createdAt: data.created_at,
        };
    } catch (error: any) {
        console.error('Unexpected Error (addTask):', error);
        alert('Beklenmedik bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
        return null;
    }
}

// Update a task in Supabase
export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
    try {
        const supabase = getSupabaseClient();

        // Map camelCase to snake_case
        const dbUpdates: Record<string, any> = {};
        if (updates.platformName) dbUpdates.platform_name = updates.platformName;
        if (updates.taskType) dbUpdates.task_type = updates.taskType;
        if (updates.taskTypeName) dbUpdates.task_type_name = updates.taskTypeName;
        if (updates.accountName) dbUpdates.account_name = updates.accountName;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.platform) dbUpdates.platform = updates.platform;
        if (updates.link) dbUpdates.link = updates.link;
        if (updates.quantity) dbUpdates.quantity = updates.quantity;
        if (updates.price) dbUpdates.price = updates.price;

        const { error } = await supabase
            .from('tasks')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating task:', error);
        }
    } catch (error) {
        console.error('Error in updateTask:', error);
    }
}

// Delete a task from Supabase
export async function deleteTask(id: string): Promise<void> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
        }
    } catch (error) {
        console.error('Error in deleteTask:', error);
    }
}

// Subscribe to real-time task changes
export function subscribeToTasks(callback: (tasks: Task[]) => void): () => void {
    if (typeof window === 'undefined') return () => { };

    try {
        const supabase = getSupabaseClient();

        // Create a channel for real-time updates
        const channel = supabase
            .channel('tasks-channel')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'tasks',
                },
                async (payload) => {
                    console.log('Real-time update:', payload);
                    // Fetch all tasks again when any change occurs
                    const tasks = await getTasks();
                    callback(tasks);
                }
            )
            .subscribe();

        // Return cleanup function
        return () => {
            supabase.removeChannel(channel);
        };
    } catch (error) {
        console.error('Error in subscribeToTasks:', error);
        return () => { };
    }
}

// --- SUBMISSION FUNCTIONS ---

export async function applyForTask(taskId: string, userId: string): Promise<boolean> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('task_submissions')
            .insert({
                task_id: taskId,
                user_id: userId,
                status: 'pending'
            });

        if (error) {
            console.error('Apply for task error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Apply for task internal error:', error);
        return false;
    }
}

export async function submitProof(submissionId: string, proofData: string): Promise<boolean> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('task_submissions')
            .update({
                proof_data: proofData,
                status: 'submitted',
                updated_at: new Date().toISOString()
            })
            .eq('id', submissionId);

        if (error) {
            console.error('Submit proof error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Submit proof internal error:', error);
        return false;
    }
}

export async function updateSubmissionStatus(submissionId: string, status: Submission['status']): Promise<boolean> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('task_submissions')
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', submissionId);

        if (error) {
            console.error('Update submission status error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Update submission status internal error:', error);
        return false;
    }
}

export async function completeTaskAndPay(submissionId: string): Promise<boolean> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.rpc('complete_task_and_pay', {
            p_submission_id: submissionId
        });

        if (error) {
            console.error('Payout error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Payout internal error:', error);
        return false;
    }
}

export async function getMySubmissions(userId: string): Promise<Submission[]> {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('task_submissions')
            .select('*, tasks(*)')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Get my submissions error:', error);
            return [];
        }

        return (data || []).map(s => ({
            id: s.id,
            taskId: s.task_id,
            userId: s.user_id,
            proofData: s.proof_data,
            status: s.status,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
            task: s.tasks ? {
                id: s.tasks.id,
                platform: s.tasks.platform,
                platformName: s.tasks.platform_name,
                taskType: s.tasks.task_type,
                taskTypeName: s.tasks.task_type_name,
                link: s.tasks.link,
                accountName: s.tasks.account_name,
                quantity: s.tasks.quantity,
                price: s.tasks.price,
                description: s.tasks.description,
                status: s.tasks.status,
                createdAt: s.tasks.created_at
            } : undefined
        }));
    } catch (error) {
        console.error('Get my submissions internal error:', error);
        return [];
    }
}

export async function getSubmissionsForCreator(creatorId: string): Promise<Submission[]> {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('task_submissions')
            .select('*, tasks(*), profiles:user_id(username, full_name)')
            .eq('tasks.created_by', creatorId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get creator submissions error:', error);
            return [];
        }

        return (data || []).map(s => ({
            id: s.id,
            taskId: s.task_id,
            userId: s.user_id,
            proofData: s.proof_data,
            status: s.status,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
            user: s.profiles,
            task: s.tasks ? {
                id: s.tasks.id,
                platform: s.tasks.platform,
                platformName: s.tasks.platform_name,
                taskType: s.tasks.task_type,
                taskTypeName: s.tasks.task_type_name,
                link: s.tasks.link,
                accountName: s.tasks.account_name,
                quantity: s.tasks.quantity,
                price: s.tasks.price,
                description: s.tasks.description,
                status: s.tasks.status,
                createdAt: s.tasks.created_at
            } : undefined
        }));
    } catch (error) {
        console.error('Get creator submissions internal error:', error);
        return [];
    }
}
