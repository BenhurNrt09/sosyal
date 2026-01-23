import { Button } from "@repo/ui";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold text-primary mb-4">Admin Paneli</h1>
                <p className="mb-8">Platform yönetimi ve istatistikler.</p>
                <div className="flex gap-4">
                    <Button>Admin Girişi</Button>
                </div>
            </div>
        </div>
    );
}
