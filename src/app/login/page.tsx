'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Chrome } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading || user) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex justify-center">
            <Logo />
        </div>
        <h1 className="text-2xl font-bold">Welcome to Stuffin</h1>
        <p className="mb-8 mt-2 text-muted-foreground">Sign in to manage your finances.</p>
        <Button onClick={signInWithGoogle} className="w-full">
            <Chrome className="mr-2" />
            Sign in with Google
        </Button>
      </div>
    </div>
  );
}
