import { useState, useEffect } from 'react';
import { CreateTransactionDto, Transaction } from '@/types/transaction.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBudgets } from '@/hooks/useBudgets';
import { Link } from 'react-router-dom';

interface TransactionFormProps {
    initialData?: Transaction;
    onSubmit: (data: CreateTransactionDto) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const TransactionForm = ({ initialData, onSubmit, onCancel, isLoading }: TransactionFormProps) => {
    const { data: budgets, isLoading: isBudgetsLoading } = useBudgets();

    const [formData, setFormData] = useState<CreateTransactionDto>({
        description: '',
        amount: 0,
        budgetId: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                description: initialData.description || '',
                amount: initialData.amount,
                budgetId: initialData.budgetId,
                categoryId: initialData.categoryId,
                date: initialData.date.split('T')[0],
                type: initialData.type,
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const selectedBudget = budgets?.find(b => b.id === formData.budgetId);
    const availableCategories = selectedBudget?.categories || [];

    if (isBudgetsLoading) {
        return <div className="p-4 text-center">Loading budgets...</div>;
    }

    if (!budgets || budgets.length === 0) {
        return (
            <div className="p-4 text-center space-y-4">
                <p className="text-gray-600">You need to create a budget first before adding transactions.</p>
                <div className="flex justify-center gap-2">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Link to="/budgets" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Go to Budgets
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required
                />

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white border"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <select
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white border"
                        value={formData.budgetId}
                        onChange={(e) => {
                            const newBudgetId = e.target.value;
                            // Reset category when budget changes
                            setFormData({
                                ...formData,
                                budgetId: newBudgetId,
                                categoryId: ''
                            });
                        }}
                        required
                    >
                        <option value="">Select Budget</option>
                        {budgets.map(budget => (
                            <option key={budget.id} value={budget.id}>
                                {budget.name} ({new Date(budget.createdAt).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white border"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                        disabled={!formData.budgetId}
                    >
                        <option value="">Select Category</option>
                        {availableCategories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {formData.budgetId && availableCategories.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">No categories in this budget.</p>
                    )}
                </div>
            </div>

            <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" loading={isLoading}>
                    {initialData ? 'Update Transaction' : 'Add Transaction'}
                </Button>
            </div>
        </form>
    );
};
