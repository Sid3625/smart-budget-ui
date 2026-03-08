import { useState, useEffect } from 'react';
import { Target, CheckCircle, Plus, Wallet } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Input } from '@/components/ui/Input';

export const Goals = () => {
    const [goals, setGoals] = useState<{ id: string, name: string, targetMoney: number, currentMoney: number }[]>([]);
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('savings_goals');
        if (stored) setGoals(JSON.parse(stored));
    }, []);

    const handleSave = () => {
        const _target = Number(target);
        if (!name || isNaN(_target) || _target <= 0) return;

        const newGoal = { id: Date.now().toString(), name, targetMoney: _target, currentMoney: 0 };
        const updated = [...goals, newGoal];
        setGoals(updated);
        localStorage.setItem('savings_goals', JSON.stringify(updated));
        setName('');
        setTarget('');
    };

    const addFunds = (id: string, amount: number) => {
        const updated = goals.map(g => {
            if (g.id === id) {
                return { ...g, currentMoney: Math.min(g.targetMoney, g.currentMoney + amount) };
            }
            return g;
        });
        setGoals(updated);
        localStorage.setItem('savings_goals', JSON.stringify(updated));
    };

    const removeGoal = (id: string) => {
        const updated = goals.filter(g => g.id !== id);
        setGoals(updated);
        localStorage.setItem('savings_goals', JSON.stringify(updated));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    Savings Goals (Piggy Banks)
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Goal</h3>
                    <div className="space-y-4">
                        <Input
                            label="Goal Name (e.g., Vacation)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Target Amount"
                            type="number"
                            min="0"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                        />
                        <button
                            onClick={handleSave}
                            className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition"
                        >
                            <span className="flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Create Goal</span>
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    {goals.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 transition-colors">
                            No active savings goals found. Create one to start saving!
                        </div>
                    ) : (
                        goals.map(goal => {
                            const percent = Math.min((goal.currentMoney / goal.targetMoney) * 100, 100);
                            const isComplete = percent >= 100;

                            return (
                                <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{goal.name}</h3>
                                        {isComplete ? (
                                            <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" /> Goal Reached!
                                            </span>
                                        ) : (
                                            <button onClick={() => removeGoal(goal.id)} className="text-red-500 dark:text-red-400 text-sm hover:underline">Delete</button>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            <span>{formatCurrency(goal.currentMoney)} saved</span>
                                            <span>Goal: {formatCurrency(goal.targetMoney)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {!isComplete && (
                                        <div className="flex gap-2 justify-end mt-2">
                                            <button
                                                onClick={() => addFunds(goal.id, 500)}
                                                className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-1 text-gray-700 dark:text-gray-300 transition-colors"
                                            >
                                                <Wallet className="w-4 h-4" /> Add +₹500
                                            </button>
                                            <button
                                                onClick={() => addFunds(goal.id, 1000)}
                                                className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-1 text-gray-700 dark:text-gray-300 transition-colors"
                                            >
                                                <Wallet className="w-4 h-4" /> Add +₹1000
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
