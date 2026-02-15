import { useState } from 'react';
import { useBudgets, useCreateBudget } from '@/hooks/useBudgets';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { BudgetForm } from '@/features/budgets/BudgetForm';
import { formatCurrency } from '@/utils/format';

export const Budgets = () => {
    const { data: budgets, isLoading } = useBudgets();
    const createMutation = useCreateBudget();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreate = async (data: any) => {
        await createMutation.mutateAsync(data);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Budget
                </Button>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets?.map((budget) => (
                        <div key={budget.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </p>
                            <div className="mt-4">
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(Number(budget.totalAllocation))}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">Total Allocation</span>
                            </div>
                        </div>
                    ))}
                    {budgets?.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No budgets found. Create one to get started!
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Budget"
            >
                <BudgetForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={createMutation.isPending}
                />
            </Modal>
        </div>
    );
};
