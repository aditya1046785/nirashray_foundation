import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
    title: "Login | Nirashray Foundation",
    description: "Login to your Nirashray Foundation member account.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#fdfcfa] flex items-center justify-center p-4 relative overflow-hidden font-light pt-20">
            {/* Subtle paper noise */}
            <div 
                className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-multiply fixed z-0"
                style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
            />

            {/* Glowing artistic background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-100/40 rounded-full mix-blend-multiply filter blur-[150px] pointer-events-none z-0" />

            <div className="w-full max-w-md relative z-10 my-10">
                {/* Logo & Header */}
                <div className="text-center mb-8 relative">
                    <Link href="/" className="inline-flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-full bg-amber-50 mx-auto flex items-center justify-center mb-6 shadow-sm border border-amber-100 group-hover:scale-105 transition-transform duration-500">
                            <Heart className="w-7 h-7 text-amber-500 fill-amber-500/20" strokeWidth={1.5} />
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Nirashray Foundation</h1>
                        <p className="text-slate-500 text-sm mt-3 font-medium tracking-widest uppercase">Member Portal</p>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-md border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
                    <h2 className="font-serif text-2xl font-bold text-slate-800 text-center mb-2">Welcome Back</h2>
                    <p className="text-slate-500 text-center text-sm mb-8 font-light">Securely sign in to your elegant dashboard</p>
                    
                    <LoginForm />
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-4 relative z-10">
                    <p className="text-slate-500 text-sm font-light">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-amber-600 font-semibold hover:text-amber-700 hover:underline decoration-amber-300 underline-offset-4 transition-colors">
                            Apply for Membership
                        </Link>
                    </p>
                    <Link href="/" className="inline-block text-slate-400 text-xs font-medium tracking-wide hover:text-slate-600 transition-colors uppercase">
                        ← Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
