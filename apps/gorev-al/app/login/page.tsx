import Link from "next/link";
import { signIn } from "../../actions/auth";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-orange-600">Giriş Yap</CardTitle>
                    <CardDescription className="text-center">
                        Görev almak ve para kazanmak için giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={signIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="ornek@site.com" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Şifre</Label>
                                <Link href="#" className="text-xs text-orange-600 hover:underline">
                                    Şifremi unuttum?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                            Giriş Yap
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-slate-500">
                        Hesabın yok mu?{" "}
                        <Link href="/register" className="text-orange-600 hover:underline font-semibold">
                            Kayıt Ol
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
