import { useState, useEffect } from 'react';
import { Download, Sparkles, X, BrainCircuit, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface AIReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: any;
    pieChartData: any[];
}

export const AIReportModal = ({ isOpen, onClose, summary, pieChartData }: AIReportModalProps) => {
    const [isGenerating, setIsGenerating] = useState(true);
    const [progress, setProgress] = useState(0);
    const [reportContent, setReportContent] = useState<any>(null);

    useEffect(() => {
        if (isOpen) {
            setIsGenerating(true);
            setProgress(0);

            // Simulate AI generation process
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        generateInsights();
                        setIsGenerating(false);
                        return 100;
                    }
                    return p + 5;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const generateInsights = () => {
        const topSpending = pieChartData[0];
        const savingsRate = summary.totalIncome > 0
            ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
            : 0;

        const overBudget = summary.budgetUsage.filter((b: any) => b.percentage >= 90);

        const insights = [];

        // Insight 1: Savings
        if (Number(savingsRate) > 20) {
            insights.push({ type: 'positive', text: `Excellent savings rate! You are saving ${savingsRate}% of your income. Financial experts recommend aiming for at least 20%.` });
        } else if (Number(savingsRate) > 0) {
            insights.push({ type: 'warning', text: `Your savings rate is ${savingsRate}%. Consider finding ways to cut back on expenses to hit the 20% recommended threshold.` });
        } else {
            insights.push({ type: 'negative', text: `You are spending more than you earn. This is unsustainable in the long run. We highly recommend reviewing your major expenses.` });
        }

        // Insight 2: Top category
        if (topSpending) {
            insights.push({ type: 'info', text: `Your highest expense category is **${topSpending.name}**, accounting for ${formatCurrency(topSpending.value)}. Pay close attention to this category next month.` });
        }

        // Insight 3: Budgets
        if (overBudget.length > 0) {
            insights.push({ type: 'negative', text: `You are dangerously close to or exceeding your budget limit in the following categories: ${overBudget.map((b: any) => b.name).join(', ')}.` });
        } else if (summary.budgetUsage.length > 0) {
            insights.push({ type: 'positive', text: `Great job! You are well within your limits for all your active budgets this month.` });
        }

        setReportContent({
            savingsRate,
            topSpending,
            insights,
            overBudget
        });
    };

    const handleDownload = () => {
        // dynamic import or require is not strictly needed if we map properly, but standard ESM import is cleaner
        import('jspdf').then(({ default: jsPDF }) => {
            import('jspdf-autotable').then(({ default: autoTable }) => {
                const doc = new jsPDF() as any;

                // Helper to fix symbol rendering for ₹ in standard pdf fonts
                const sanitizeText = (text: string) => text.replace(/₹/g, 'Rs. ');

                // Title
                doc.setFontSize(22);
                doc.setTextColor(79, 70, 229);
                doc.text("Smart Budget - AI Financial Report", 14, 20);

                doc.setFontSize(11);
                doc.setTextColor(100, 100, 100);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

                doc.setTextColor(0, 0, 0);

                // Financial Overview
                doc.setFontSize(14);
                doc.text("Financial Overview", 14, 40);

                const overviewData = [
                    ["Total Income", sanitizeText(formatCurrency(summary.totalIncome))],
                    ["Total Expenses", sanitizeText(formatCurrency(summary.totalExpense))],
                    ["Net Balance", sanitizeText(formatCurrency(summary.balance))],
                    ["Savings Rate", `${reportContent?.savingsRate}%`]
                ];

                autoTable(doc, {
                    startY: 45,
                    head: [["Metric", "Value"]],
                    body: overviewData,
                    theme: 'striped',
                    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
                    styles: { fontSize: 11, cellPadding: 5 },
                });

                // Top Spending Categories
                doc.setFontSize(14);
                doc.text("Top Expense Categories", 14, doc.lastAutoTable.finalY + 15);

                const categoryData = pieChartData.map(d => [d.name, sanitizeText(formatCurrency(d.value))]);

                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [["Category", "Amount Spent"]],
                    body: categoryData.length > 0 ? categoryData : [["No expenses recorded", ""]],
                    theme: 'striped',
                    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
                    styles: { fontSize: 11, cellPadding: 5 },
                });

                // Budget Utilization
                if (doc.lastAutoTable.finalY > 250) { doc.addPage(); doc.lastAutoTable.finalY = 20; }

                doc.setFontSize(14);
                doc.text("Budget Utilization", 14, doc.lastAutoTable.finalY + 15);

                const budgetData = summary.budgetUsage.map((b: any) => [
                    b.name,
                    sanitizeText(`${formatCurrency(b.spent)} / ${formatCurrency(Number(b.totalAllocation))}`),
                    `${b.percentage.toFixed(1)}%`
                ]);

                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [["Budget", "Spent / Allocated", "Utilization"]],
                    body: budgetData.length > 0 ? budgetData : [["No active budgets", "", ""]],
                    theme: 'striped',
                    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
                    styles: { fontSize: 11, cellPadding: 5 },
                });

                // Insights
                if (doc.lastAutoTable.finalY > 250) { doc.addPage(); doc.lastAutoTable.finalY = 20; }

                doc.setFontSize(14);
                doc.text("AI Insights & Recommendations", 14, doc.lastAutoTable.finalY + 15);

                const insightData = reportContent?.insights.map((i: any) => [sanitizeText(i.text.replace(/\*\*/g, ''))]);

                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [["Recommendation"]],
                    body: insightData.length > 0 ? insightData : [["No insights generated."]],
                    theme: 'striped',
                    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
                    styles: { fontSize: 11, cellPadding: 5 },
                });

                // Save
                doc.save(`Smart_Budget_AI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            });
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-indigo-200" />
                        <h2 className="text-xl font-bold">Monthly AI Financial Report</h2>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 md:p-8 min-h-[400px]">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
                            <BrainCircuit className="w-20 h-20 text-indigo-500 animate-pulse" />
                            <div className="text-center space-y-2 w-full max-w-md">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Analyzing your financial data...
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Our AI is scanning your transactions, budgets, and spending habits to generate personalized insights.
                                </p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-100 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Net Savings</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(summary.balance)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Savings Rate</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{reportContent.savingsRate}%</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 col-span-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Highest Expense</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 max-w-full truncate">
                                        {reportContent.topSpending ? reportContent.topSpending.name : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* AI Insights */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-indigo-500" />
                                    Personalized Insights
                                </h3>
                                <div className="space-y-4">
                                    {reportContent.insights.map((insight: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-xl border text-sm leading-relaxed" style={{
                                            backgroundColor: insight.type === 'positive' ? 'var(--tw-colors-green-50, #f0fdf4)' : insight.type === 'negative' ? 'var(--tw-colors-red-50, #fef2f2)' : insight.type === 'warning' ? 'var(--tw-colors-yellow-50, #fefce8)' : 'var(--tw-colors-blue-50, #eff6ff)',
                                            borderColor: insight.type === 'positive' ? 'var(--tw-colors-green-200, #bbf7d0)' : insight.type === 'negative' ? 'var(--tw-colors-red-200, #fecaca)' : insight.type === 'warning' ? 'var(--tw-colors-yellow-200, #fef08a)' : 'var(--tw-colors-blue-200, #bfdbfe)',
                                            color: 'var(--tw-colors-gray-900, #111827)'
                                        }}>
                                            <div className="mt-0.5 min-w-[20px]">
                                                {insight.type === 'positive' && <TrendingUp className="w-5 h-5 text-green-600" />}
                                                {insight.type === 'negative' && <TrendingDown className="w-5 h-5 text-red-600" />}
                                                {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                                                {insight.type === 'info' && <Sparkles className="w-5 h-5 text-blue-600" />}
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: insight.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Full Report
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
