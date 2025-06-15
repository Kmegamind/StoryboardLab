
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
    const { t } = useTranslation();
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
            toast({ title: t('auth.loginErrorTitle'), description: error.message, variant: 'destructive' });
        } else {
            toast({ title: t('auth.loginSuccessTitle') });
            navigate('/');
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
                emailRedirectTo: `${window.location.origin}/`,
            }
        });
        if (error) {
            toast({ title: t('auth.signupErrorTitle'), description: error.message, variant: 'destructive' });
        } else {
            toast({ title: t('auth.signupSuccessTitle'), description: t('auth.signupSuccessDescription') });
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                    <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('auth.login')}</CardTitle>
                            <CardDescription>{t('auth.loginCTA')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">{t('auth.emailLabel')}</Label>
                                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
                                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">{loading ? t('auth.loggingIn') : t('auth.loginButton')}</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('auth.signup')}</CardTitle>
                            <CardDescription>{t('auth.signupCTA')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div>
                                    <Label htmlFor="signup-email">{t('auth.emailLabel')}</Label>
                                    <Input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <Label htmlFor="signup-password">{t('auth.passwordLabel')}</Label>
                                    <Input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">{loading ? t('auth.signingUp') : t('auth.signupButton')}</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AuthPage;
