import { useState } from 'react';
import { CreateBudgetDto } from '@/types/budget.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BudgetFormProps {
    onSubmit: (data: CreateBudgetDto) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const BudgetForm = ({ onSubmit, onCancel, isLoading }: BudgetFormProps) => {
    const [formData, setFormData] = useState<CreateBudgetDto>({
        name: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        totalAllocation: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Budget Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Monthly Expenses"
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Month"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    required
                />
                <Input
                    label="Year"
                    type="number"
                    min="2020"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                />
            </div>
            <Input
                label="Total Allocation"
                type="number"
                min="0"
                value={formData.totalAllocation}
                onChange={(e) => setFormData({ ...formData, totalAllocation: parseFloat(e.target.value) })}
                required
            />
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={isLoading}>Create Budget</Button>
            </div>
        </form>
    );
};
