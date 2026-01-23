import Link from "next/link";
import { signUp } from "../../actions/auth";
import { Button, Input, Label, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-green-600">Kayıt Ol</CardTitle>
                    <CardDescription className="text-center">
                        Hemen üye ol ve kazanmaya başla
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={signUp} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Ad Soyad</Label>
                                <Input id="fullName" name="fullName" placeholder="Ad Soyad" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Kullanıcı Adı</Label>
                                <Input id="username" name="username" placeholder="kullaniciadi" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="ornek@site.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            Kayıt Ol
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-slate-500">
                        Zaten hesabın var mı?{" "}
                        <Link href="/login" className="text-green-600 hover:underline font-semibold">
                            Giriş Yap
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
