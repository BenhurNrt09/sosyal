import { Button } from "@repo/ui/components/ui/button";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold text-primary mb-4">Görev Yap Platformu</h1>
                <p className="mb-8">Sosyal medya etkileşiminizi artırmak için hemen görev oluşturun.</p>
                <div className="flex gap-4">
                    <Button>Giriş Yap</Button>
                    <Button variant="outline">Kayıt Ol</Button>
                </div>
            </div>
        </div>
    );
}
