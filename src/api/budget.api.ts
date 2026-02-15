import api from './axios';
import { Budget, CreateBudgetDto } from '@/types/budget.types';

export const budgetApi = {
    getAll: async (): Promise<Budget[]> => {
        const { data } = await api.get<Budget[]>('/budgets');
        return data;
    },

    create: async (payload: CreateBudgetDto): Promise<Budget> => {
        const { data } = await api.post<Budget>('/budgets', payload);
        return data;
    },

    getMonthlySummary: async () => { // Optional aggregation
        const { data } = await api.get('/budgets/summary');
        return data;
    }
};
