import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface ChartData {
    name: string;
    income: number;
    expense: number;
}

interface IncomeExpenseChartProps {
    data: ChartData[];
}

export const IncomeExpenseChart = ({ data }: IncomeExpenseChartProps) => {
    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Income vs Expense
                </h3>
                <p className="text-sm text-gray-500">
                    Monthly financial overview
                </p>
            </div>

            {/* Empty State */}
            {(!data || data.length === 0) ? (
                <div className="h-[320px] flex flex-col items-center justify-center text-center">
                    <div className="text-gray-400 text-5xl mb-3">📊</div>
                    <p className="text-gray-600 font-medium">
                        No financial data available
                    </p>
                    <p className="text-sm text-gray-400">
                        Add income or expenses to see analytics
                    </p>
                </div>
            ) : (
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="income"
                                fill="#10B981"
                                radius={[8, 8, 0, 0]}
                                name="Income"
                            />

                            <Bar
                                dataKey="expense"
                                fill="#EF4444"
                                radius={[8, 8, 0, 0]}
                                name="Expense"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
