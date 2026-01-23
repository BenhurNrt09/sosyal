import { signIn } from "../../actions/auth";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui";
import { ShieldAlert } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
            <Card className="w-full max-w-md border-slate-800 bg-slate-950 text-slate-50">
                <CardHeader className="space-y-1 items-center">
                    <div className="h-12 w-12 rounded-full bg-red-900/20 flex items-center justify-center text-red-500 mb-2">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Yönetici Girişi</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Sadece yetkili personel içindir.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={signIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="admin@site.com" className="bg-slate-900 border-slate-800 text-white" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-200">Şifre</Label>
                            <Input id="password" name="password" type="password" className="bg-slate-900 border-slate-800 text-white" required />
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Giriş Yap
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
