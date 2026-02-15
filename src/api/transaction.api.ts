import api from './axios';
import {
    Transaction,
    CreateTransactionDto,
    UpdateTransactionDto,
    TransactionFilters,
    TransactionListResponse
} from '@/types/transaction.types';

export const transactionApi = {
    getAll: async (params?: TransactionFilters): Promise<TransactionListResponse> => {
        const { data } = await api.get<TransactionListResponse>('/transactions', { params });
        return data;
    },

    create: async (payload: CreateTransactionDto): Promise<Transaction> => {
        const { data } = await api.post<Transaction>('/transactions', payload);
        return data;
    },

    update: async (id: string, payload: UpdateTransactionDto): Promise<Transaction> => {
        const { data } = await api.patch<Transaction>(`/transactions/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/transactions/${id}`);
    }
};
