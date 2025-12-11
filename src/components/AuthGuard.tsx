import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground font-mono">
                Code <span className="text-primary">Gatekeeper</span>
              </h1>
              <p className="text-muted-foreground max-w-md">
                If you can't explain it, you can't ship it.
              </p>
            </div>
            <SignInButton mode="modal">
              <Button size="lg" className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In to Continue
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

// Only use Clerk components when provider exists
export function UserNav({ isAuthEnabled }: { isAuthEnabled: boolean }) {
  if (!isAuthEnabled) return null;
  
  return (
    <SignedIn>
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-8 h-8"
          }
        }}
      />
    </SignedIn>
  );
}
