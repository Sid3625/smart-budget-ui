import { useMemo } from 'react';
import { useBudgets } from '@/hooks/useBudgets.ts';
import { useTransactions } from '@/hooks/useTransactions.ts';
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart';
import { formatCurrency } from '@/utils/format'; // Note: I will need to create this util
import { Loader2, TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { clsx } from 'clsx';
import { Transaction } from '@/types/transaction.types';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
            {trend && (
                <p className={clsx("text-sm mt-1", trend > 0 ? "text-green-600" : "text-red-600")}>
                    {trend > 0 ? "+" : ""}{trend}% from last month
                </p>
            )}
        </div>
        <div className={clsx("p-3 rounded-full", color)}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </div>
);

export const Dashboard = () => {
    const { data: budgets, isLoading: budgetsLoading } = useBudgets();
    const { data: transactionsData, isLoading: transactionsLoading } = useTransactions();

    const transactions: Transaction[] = transactionsData?.transactions || [];

    const summary = useMemo(() => {
        if (!budgets || !transactions) return { totalIncome: 0, totalExpense: 0, balance: 0, budgetUsage: [] };

        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            // @ts-ignore - amount might be string from API sometimes so parse it
            .reduce((acc, t) => acc + Number(t.amount), 0);

        const totalExpense = transactions
            .filter((t) => t.type === 'expense')
            // @ts-ignore
            .reduce((acc, t) => acc + Number(t.amount), 0);

        const balance = totalIncome - totalExpense;

        // Budget utilization
        const budgetUsage = budgets.map((b) => {
            const spent = transactions
                .filter((t) => t.budgetId === b.id && t.type === 'expense')
                // @ts-ignore
                .reduce((acc, t) => acc + Number(t.amount), 0);

            return {
                ...b,
                spent,
                // @ts-ignore - totalAllocation might be string/decimal
                percentage: Math.min((spent / Number(b.totalAllocation)) * 100, 100),
            };
        });

        return { totalIncome, totalExpense, balance, budgetUsage };
    }, [budgets, transactions]);

    const chartData = useMemo(() => {
        const dataMap: Record<string, { income: number; expense: number }> = {};

        transactions.forEach(t => {
            const date = new Date(t.date).toLocaleDateString();
            if (!dataMap[date]) dataMap[date] = { income: 0, expense: 0 };
            if (t.type === 'income') dataMap[date].income += Number(t.amount);
            else dataMap[date].expense += Number(t.amount);
        });

        return Object.entries(dataMap).map(([name, val]) => ({ name, ...val })).slice(-7);
    }, [transactions]);


    if (budgetsLoading || transactionsLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Balance"
                    value={formatCurrency(summary.balance)}
                    icon={DollarSign}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Income"
                    value={formatCurrency(summary.totalIncome)}
                    icon={TrendingUp}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Expenses"
                    value={formatCurrency(summary.totalExpense)}
                    icon={TrendingDown}
                    color="bg-red-500"
                />
                <StatCard
                    title="Active Budgets"
                    value={budgets?.length || 0}
                    icon={PiggyBank}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Income vs Expenses</h3>
                    <IncomeExpenseChart data={chartData} />
                </div>

                {/* Budgets Progress */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Budget Utilization</h3>
                    <div className="space-y-4">
                        {summary.budgetUsage.map((budget) => (
                            <div key={budget.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{budget.name}</span>
                                    <span className="text-gray-500">
                                        {formatCurrency(budget.spent)} / {formatCurrency(Number(budget.totalAllocation))}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={clsx(
                                            "h-2.5 rounded-full",
                                            budget.percentage > 90 ? "bg-red-500" : "bg-blue-500"
                                        )}
                                        style={{ width: `${budget.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {summary.budgetUsage.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">No active budgets.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
