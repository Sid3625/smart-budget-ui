import { useState } from 'react';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/hooks/useTransactions';
import { TransactionTable } from '@/features/transactions/TransactionTable';
import { TransactionForm } from '@/features/transactions/TransactionForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Plus } from 'lucide-react';
import { CreateTransactionDto, Transaction } from '@/types/transaction.types';
import { Input } from '@/components/ui/Input';

export const Transactions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
    const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' });

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>

                <Button onClick={openCreateModal} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Transaction
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                    placeholder="Filter by Category"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                />
                {/* Date filters could go here */}
            </div>

            <TransactionTable
                transactions={transactionsData?.transactions || []}
                isLoading={isLoading}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

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
