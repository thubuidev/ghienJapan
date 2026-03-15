'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/lib/admin-context';
import { toast } from 'sonner';
import { Loader as Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { admin, login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) {
    router.push('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Japanese Shop Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@japanese.shop"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
              disabled={loading}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: admin@japanese.shop</p>
          <p>Password: Admin@123</p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-secondary hover:underline">
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
