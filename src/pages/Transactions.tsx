import { useState, useMemo } from 'react';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { TransactionTable } from '@/features/transactions/TransactionTable';
import { TransactionForm } from '@/features/transactions/TransactionForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';
import { CreateTransactionDto, Transaction } from '@/types/transaction.types';

export const Transactions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
    const [filters, setFilters] = useState({
        category: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 10
    });

    const { data: budgets } = useBudgets();
    const allCategories = useMemo(() => {
        if (!budgets) return [];
        const categories = budgets.flatMap(b => b.categories);
        const uniqueNames = Array.from(new Set(categories.map(c => c.name)));
        return uniqueNames.sort();
    }, [budgets]);

    const { data: transactionsData, isLoading } = useTransactions(filters);
    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();
    const deleteMutation = useDeleteTransaction();

    const handleCreate = async (data: CreateTransactionDto) => {
        await createMutation.mutateAsync(data);
        setIsModalOpen(false);
    };

    const handleUpdate = async (data: CreateTransactionDto) => {
        if (editingTransaction) {
            await updateMutation.mutateAsync({ id: editingTransaction.id, ...data });
            setIsModalOpen(false);
            setEditingTransaction(undefined);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const openCreateModal = () => {
        setEditingTransaction(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>

                <Button onClick={openCreateModal} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Transaction
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 transition-colors">
                <select
                    className="block w-full sm:w-auto rounded-md shadow-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border h-10 min-w-[200px]"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                >
                    <option value="">All Categories</option>
                    {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    className="block w-full sm:w-auto rounded-md shadow-sm border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border h-10"
                    value={filters.limit}
                    onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                >
                    <option value={2}>2 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
            </div>

            <TransactionTable
                transactions={transactionsData?.transactions || []}
                isLoading={isLoading}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            {transactionsData && transactionsData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <Button
                        variant="secondary"
                        disabled={filters.page === 1}
                        onClick={() => handlePageChange(filters.page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {transactionsData.currentPage} of {transactionsData.totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={filters.page === transactionsData.totalPages}
                        onClick={() => handlePageChange(filters.page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <TransactionForm
                    initialData={editingTransaction}
                    onSubmit={editingTransaction ? handleUpdate : handleCreate}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </div>
    );
};
