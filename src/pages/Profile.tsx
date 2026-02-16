import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from 'lucide-react';
import { authApi } from '@/api/auth.api';

export const Profile = () => {
    const { user, logout, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!user) return null;

    const handleUpdate = async () => {
        setIsLoading(true);
        setError('');
        try {
            const updatedUser = await authApi.updateProfile({ name });
            updateUser(updatedUser);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                        {!isEditing && (
                            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
                        )}
                    </div>

                    <div className="grid gap-4">
                        <Input
                            label="Name"
                            value={isEditing ? name : user.name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                        />
                        <Input label="Email" defaultValue={user.email} disabled />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-between mt-6">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => { setIsEditing(false); setName(user.name); }}>Cancel</Button>
                                <Button loading={isLoading} onClick={handleUpdate}>Save Changes</Button>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        <Button variant="danger" onClick={logout}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
