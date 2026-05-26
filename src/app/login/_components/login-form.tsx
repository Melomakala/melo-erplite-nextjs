"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/server/validations/auth.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, } = useForm<LoginInput>(
    {
      resolver: zodResolver(loginSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    }
  );

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            className={`pl-10 rounded-md bg-transparent ${errors.username ? "border-destructive" : ""
              }`}
            {...register("username")}
            disabled={isLoading}
          />
        </div>
        {errors.username && (
          <p className="text-[11px] font-medium text-destructive">{errors.username.message}</p>
        )}
      </div>


      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className={`pl-10 rounded-md bg-transparent ${errors.password ? "border-destructive" : ""
              }`}
            {...register("password")}
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="text-[11px] font-medium text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-2 rounded-md font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
