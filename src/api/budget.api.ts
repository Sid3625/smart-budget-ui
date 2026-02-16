import api from './axios';
import { Budget, CreateBudgetDto, Category, CreateCategoryDto } from '@/types/budget.types';

export const budgetApi = {
    getAll: async (): Promise<Budget[]> => {
        const { data } = await api.get<Budget[]>('/budgets');
        return data;
    },

    create: async (payload: CreateBudgetDto): Promise<Budget> => {
        const { data } = await api.post<Budget>('/budgets', payload);
        return data;
    },

    createCategory: async (payload: CreateCategoryDto): Promise<Category> => {
        const { data } = await api.post<Category>('/categories', payload);
        return data;
    },

    getMonthlySummary: async () => {
        const { data } = await api.get('/budgets/summary');
        return data;
    }
};
