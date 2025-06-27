
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast({ title: '登录失败', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '登录成功' });
            navigate('/create');
        }
        setLoading(false);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/create`,
            }
        });
        if (error) {
            toast({ title: '注册失败', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '注册成功', description: '请检查您的邮箱并点击确认链接完成注册' });
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">登录</TabsTrigger>
                    <TabsTrigger value="signup">注册</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>登录账户</CardTitle>
                            <CardDescription>输入您的邮箱和密码登录账户</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">邮箱</Label>
                                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <Label htmlFor="password">密码</Label>
                                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">{loading ? '登录中...' : '登录'}</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                     <Card>
                        <CardHeader>
                            <CardTitle>创建账户</CardTitle>
                            <CardDescription>创建新账户以保存您的创作内容</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div>
                                    <Label htmlFor="signup-email">邮箱</Label>
                                    <Input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <Label htmlFor="signup-password">密码</Label>
                                    <Input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">{loading ? '注册中...' : '注册'}</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AuthPage;
