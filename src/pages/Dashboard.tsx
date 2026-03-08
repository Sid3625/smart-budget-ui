import { useMemo, useState } from 'react';
import { useBudgets } from '@/hooks/useBudgets.ts';
import { useTransactions } from '@/hooks/useTransactions.ts';
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart';
import { CategorySpendingChart } from '@/components/charts/CategorySpendingChart';
import { AIReportModal } from '@/components/AIReportModal';
import { formatCurrency } from '@/utils/format';
import { Loader2, TrendingUp, TrendingDown, IndianRupee, PiggyBank, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { Transaction } from '@/types/transaction.types';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-colors">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
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

    const pieChartData = useMemo(() => {
        const dataMap: Record<string, number> = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            const catName = t.category?.name || 'Uncategorized';
            if (!dataMap[catName]) dataMap[catName] = 0;
            dataMap[catName] += Number(t.amount);
        });

        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
        return Object.entries(dataMap).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value);
    }, [transactions]);

    const [isReportOpen, setIsReportOpen] = useState(false);

    const handleGenerateReport = () => {
        setIsReportOpen(true);
    };

    if (budgetsLoading || transactionsLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                <button
                    onClick={handleGenerateReport}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    AI Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Balance"
                    value={formatCurrency(summary.balance)}
                    icon={IndianRupee}
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
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-6 transition-colors">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Income vs Expenses</h3>
                        <IncomeExpenseChart data={chartData} />
                    </div>
                </div>

                {/* Spending by Category Pie Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
                    {pieChartData.length > 0 ? (
                        <CategorySpendingChart data={pieChartData} />
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No expenses recorded yet.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budgets Progress */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget Utilization</h3>
                    <div className="space-y-4">
                        {summary.budgetUsage.map((budget) => (
                            <div key={budget.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{budget.name}</span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {formatCurrency(budget.spent)} / {formatCurrency(Number(budget.totalAllocation))}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className={clsx(
                                            "h-2.5 rounded-full",
                                            budget.percentage > 90 ? "bg-red-500" : budget.percentage > 75 ? "bg-yellow-500" : "bg-blue-500"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {transactions.slice(0, 5).map((t) => (
                            <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-50 dark:border-gray-700/50">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{t.description || t.category?.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                                <span className={clsx(
                                    "font-semibold",
                                    t.type === 'income' ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                                )}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">No transactions yet.</p>
                        )}
                    </div>
                </div>

                {/* AI / Financial Insight */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm border border-indigo-400 text-white flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl">💡</span> Smart Insight
                    </h3>
                    <p className="text-indigo-100 mb-4 leading-relaxed">
                        {summary.balance > 0
                            ? `Great job! You have saved ${formatCurrency(summary.balance)} so far. Keep your expenses under control to hit your long-term financial goals.`
                            : summary.balance < 0
                                ? `Careful! Your expenses are currently exceeding your income by ${formatCurrency(Math.abs(summary.balance))}. Consider reviewing your budget utilization to cut back on non-essentials.`
                                : `You're breaking even. Let's see if you can increase your income or reduce expenses this month to start growing your savings!`}
                    </p>
                    {summary.budgetUsage.some((b: any) => b.percentage > 90) && (
                        <div className="bg-white/20 p-3 rounded-lg border border-white/30 backdrop-blur-sm">
                            <p className="text-sm font-medium">⚠️ Warning: Some of your budgets are over 90% utilized.</p>
                        </div>
                    )}
                </div>
            </div>

            <AIReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                summary={summary}
                pieChartData={pieChartData}
            />
        </div>
    );
};
