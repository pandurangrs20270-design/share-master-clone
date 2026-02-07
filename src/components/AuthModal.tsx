import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validateName, validatePassword } from "@/lib/validation";

type AuthTab = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: AuthTab;
}

export const AuthModal = ({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [signupErrors, setSignupErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(loginEmail);
    const passwordErr = validatePassword(loginPassword);
    if (emailErr || passwordErr) {
      setLoginErrors({ email: emailErr || undefined, password: passwordErr || undefined });
      return;
    }
    setLoginErrors({});
    setIsLoading(true);
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Welcome Back!", description: "You have successfully logged in." });
        onOpenChange(false);
        navigate("/");
      }
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(signupName, "Full name");
    const emailErr = validateEmail(signupEmail);
    const passwordErr = validatePassword(signupPassword);
    const confirmErr = signupPassword !== signupConfirmPassword ? "Passwords do not match." : null;
    if (nameErr || emailErr || passwordErr || confirmErr) {
      setSignupErrors({
        name: nameErr || undefined,
        email: emailErr || undefined,
        password: passwordErr || undefined,
        confirm: confirmErr || undefined,
      });
      return;
    }
    setSignupErrors({});
    setIsLoading(true);
    try {
      const { error } = await signUp(signupEmail, signupPassword, signupName);
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message || "Failed to create account.",
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We've sent a verification link to <strong>{signupEmail}</strong>. Please check your inbox.
            </p>
            <Button onClick={() => { setIsSuccess(false); setActiveTab("login"); onOpenChange(false); }} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>Sign in or create an account to continue</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AuthTab)} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="you@example.com"
                    className={`pl-10 ${loginErrors.email ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {loginErrors.email && <p className="text-destructive text-sm">{loginErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginErrors((p) => ({ ...p, password: undefined })); }}
                    placeholder="••••••••"
                    className={`pl-10 ${loginErrors.password ? "border-destructive" : ""}`}
                    required
                    minLength={6}
                  />
                </div>
                {loginErrors.password && <p className="text-destructive text-sm">{loginErrors.password}</p>}
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing In...</> : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => { setSignupName(e.target.value); setSignupErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="John Doe"
                    className={`pl-10 ${signupErrors.name ? "border-destructive" : ""}`}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                {signupErrors.name && <p className="text-destructive text-sm">{signupErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => { setSignupEmail(e.target.value); setSignupErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="you@example.com"
                    className={`pl-10 ${signupErrors.email ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {signupErrors.email && <p className="text-destructive text-sm">{signupErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => { setSignupPassword(e.target.value); setSignupErrors((p) => ({ ...p, password: undefined, confirm: signupConfirmPassword !== e.target.value ? "Passwords do not match." : undefined })); }}
                    placeholder="At least 6 characters"
                    className={`pl-10 ${signupErrors.password ? "border-destructive" : ""}`}
                    required
                    minLength={6}
                  />
                </div>
                {signupErrors.password && <p className="text-destructive text-sm">{signupErrors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => { setSignupConfirmPassword(e.target.value); setSignupErrors((p) => ({ ...p, confirm: signupPassword !== e.target.value ? "Passwords do not match." : undefined })); }}
                    placeholder="••••••••"
                    className={`pl-10 ${signupErrors.confirm ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {signupErrors.confirm && <p className="text-destructive text-sm">{signupErrors.confirm}</p>}
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing In...</> : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => { setSignupName(e.target.value); setSignupErrors((p) => ({ ...p, name: undefined })); }}
                    placeholder="John Doe"
                    className={`pl-10 ${signupErrors.name ? "border-destructive" : ""}`}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                {signupErrors.name && <p className="text-destructive text-sm">{signupErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => { setSignupEmail(e.target.value); setSignupErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="you@example.com"
                    className={`pl-10 ${signupErrors.email ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {signupErrors.email && <p className="text-destructive text-sm">{signupErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => { setSignupPassword(e.target.value); setSignupErrors((p) => ({ ...p, password: undefined, confirm: signupConfirmPassword !== e.target.value ? "Passwords do not match." : undefined })); }}
                    placeholder="At least 6 characters"
                    className={`pl-10 ${signupErrors.password ? "border-destructive" : ""}`}
                    required
                    minLength={6}
                  />
                </div>
                {signupErrors.password && <p className="text-destructive text-sm">{signupErrors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => { setSignupConfirmPassword(e.target.value); setSignupErrors((p) => ({ ...p, confirm: signupPassword !== e.target.value ? "Passwords do not match." : undefined })); }}
                    placeholder="••••••••"
                    className={`pl-10 ${signupErrors.confirm ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {signupErrors.confirm && <p className="text-destructive text-sm">{signupErrors.confirm}</p>}
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating Account...</> : <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
