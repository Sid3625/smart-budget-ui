import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetApi } from '@/api/budget.api';
import { CreateBudgetDto } from '@/types/budget.types';

export const useBudgets = () => {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: budgetApi.getAll,
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBudgetDto) => budgetApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};
