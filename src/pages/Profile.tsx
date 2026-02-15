import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from 'lucide-react';

export const Profile = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>

                    <div className="grid gap-4">
                        <Input label="Name" defaultValue={user.name} disabled />
                        <Input label="Email" defaultValue={user.email} disabled />
                    </div>

                    <div className="flex justify-end">
                        <Button variant="danger" onClick={logout}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
