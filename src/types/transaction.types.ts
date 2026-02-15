import { Category } from './budget.types';

export interface Transaction {
    id: string;
    amount: number;
    category: Category;
    date: string;
    description?: string;
    type: 'income' | 'expense';
    budgetId: string;
    categoryId: string;
}

export interface CreateTransactionDto {
    amount: number;
    budgetId: string;
    categoryId: string;
    date: string;
    description?: string;
    type: 'income' | 'expense';
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> { }

export interface TransactionFilters {
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface TransactionListResponse {
    transactions: Transaction[];
    total: number;
    totalPages: number;
    currentPage: number;
}
