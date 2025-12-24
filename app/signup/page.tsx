import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <SignUp routing="hash" fallbackRedirectUrl="/dashboard" />
    </div>
  );
}
