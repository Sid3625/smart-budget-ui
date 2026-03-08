import { useState, useEffect } from 'react';
import { CalendarClock, Check, Clock, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { Input } from '@/components/ui/Input';

export const Bills = () => {
    const [bills, setBills] = useState<{ id: string, name: string, amount: number, dueDate: string, isPaid: boolean }[]>([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('recurring_bills');
        if (stored) {
            setBills(JSON.parse(stored));
        } else {
            // some dummy data initially
            const initial = [
                { id: '1', name: 'Netflix Subscription', amount: 499, dueDate: '2026-03-15', isPaid: false },
                { id: '2', name: 'Electricity Bill', amount: 1540, dueDate: '2026-03-10', isPaid: true }
            ];
            setBills(initial);
            localStorage.setItem('recurring_bills', JSON.stringify(initial));
        }
    }, []);

    const handleSave = () => {
        const _amount = Number(amount);
        if (!name || isNaN(_amount) || _amount <= 0 || !dueDate) return;

        const newBill = { id: Date.now().toString(), name, amount: _amount, dueDate, isPaid: false };
        const updated = [...bills, newBill];
        setBills(updated);
        localStorage.setItem('recurring_bills', JSON.stringify(updated));
        setName('');
        setAmount('');
        setDueDate('');
    };

    const togglePaid = (id: string) => {
        const updated = bills.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b);
        setBills(updated);
        localStorage.setItem('recurring_bills', JSON.stringify(updated));
    };

    const removeBill = (id: string) => {
        const updated = bills.filter(b => b.id !== id);
        setBills(updated);
        localStorage.setItem('recurring_bills', JSON.stringify(updated));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CalendarClock className="w-6 h-6 text-rose-500 dark:text-rose-400" />
                    Recurring Bills Tracker
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Upcoming Bill</h3>
                    <div className="space-y-4">
                        <Input
                            label="Bill Name (e.g., Rent Base)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Amount"
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <Input
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <button
                            onClick={handleSave}
                            className="w-full bg-rose-600 text-white rounded-lg py-2 hover:bg-rose-700 transition"
                        >
                            <span className="flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Bill</span>
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                    {bills.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 transition-colors">
                            No recurring bills tracked.
                        </div>
                    ) : (
                        bills.map(bill => {
                            const isOverdue = !bill.isPaid && new Date(bill.dueDate) < new Date();

                            return (
                                <div key={bill.id} className={`p-5 rounded-xl shadow-sm border transition-colors flex items-center justify-between ${isOverdue ? 'border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-900/20' : bill.isPaid ? 'border-green-200 dark:border-green-800/50 bg-white dark:bg-gray-800' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            {bill.isPaid ? (
                                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                                                    <Check className="w-6 h-6" />
                                                </div>
                                            ) : isOverdue ? (
                                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
                                                    <Clock className="w-6 h-6 animate-pulse" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center">
                                                    <CalendarClock className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{bill.name}</h3>
                                            <p className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                                Due: {new Date(bill.dueDate).toLocaleDateString()} {isOverdue && '(OVERDUE)'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(bill.amount)}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => togglePaid(bill.id)}
                                                className={`text-xs px-3 py-1 rounded-md font-medium transition ${bill.isPaid ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/60'}`}
                                            >
                                                {bill.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                                            </button>
                                            <button onClick={() => removeBill(bill.id)} className="text-gray-400 hover:text-red-500 transition">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
