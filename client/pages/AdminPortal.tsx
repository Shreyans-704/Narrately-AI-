import { Header } from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Image, Edit2, Save, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  credit_balance: number;
  role: 'user' | 'admin';
  created_at: string;
}

export default function AdminPortal() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCredit, setEditingCredit] = useState<number>(0);
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      full_name: 'John Doe',
      email: 'john@example.com',
      credit_balance: 100,
      role: 'user',
      created_at: '2024-01-15',
    },
    {
      id: '2',
      full_name: 'Jane Smith',
      email: 'jane@example.com',
      credit_balance: 50,
      role: 'user',
      created_at: '2024-01-20',
    },
  ]);

  // Redirect if not admin authenticated
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Don't render dashboard if not authenticated
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditCredit = (userId: string, currentBalance: number) => {
    setEditingId(userId);
    setEditingCredit(currentBalance);
  };

  const handleSaveCredit = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, credit_balance: editingCredit } : u
      )
    );
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      <div className="pt-20 min-h-screen">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Page Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Admin Portal
              </h1>
              <p className="text-lg text-foreground/60">
                Manage users and monitor platform activity
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-foreground/60">Admin User</p>
                <p className="text-lg font-semibold text-foreground">{user.full_name}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground/60 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">
                    {users.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground/60 text-sm mb-1">
                    Total Credits Distributed
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {users.reduce((sum, u) => sum + u.credit_balance, 0)}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  ⚡
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground/60 text-sm mb-1">Videos Generated</p>
                  <p className="text-3xl font-bold text-foreground">24</p>
                </div>
                <Image className="w-8 h-8 text-secondary opacity-50" />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Registered Users
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border/50 hover:bg-background/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {u.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {editingId === u.id ? (
                          <input
                            type="number"
                            value={editingCredit}
                            onChange={(e) =>
                              setEditingCredit(Number(e.target.value))
                            }
                            className="w-20 px-2 py-1 rounded bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        ) : (
                          <span className="flex items-center gap-2">
                            <span className="font-semibold text-accent">
                              {u.credit_balance}
                            </span>
                            ⚡
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-foreground/10 text-foreground/70'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {u.created_at}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {editingId === u.id ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveCredit(u.id)}
                            className="gap-1"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCredit(u.id, u.credit_balance)}
                            className="gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Storage Section */}
          <div className="mt-8 p-6 rounded-xl bg-card border border-border">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Video Storage
                </h2>
                <p className="text-foreground/60 text-sm">
                  View and manage videos in narrately-videos bucket
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Image className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-background border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎬</div>
                    <p className="text-xs text-foreground/60">Video {i}.mp4</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
