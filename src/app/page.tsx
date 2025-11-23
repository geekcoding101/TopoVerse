import LazyScene from '@/components/canvas/LazyScene';
import HUD from '@/components/ui/HUD';

export default function Home() {
    return (
        <main className="relative w-full h-full bg-black">
            <LazyScene />
            <HUD />

            {/* Footer */}
            <div className="absolute bottom-2 right-6 text-[10px] text-cyan-900/50 font-mono pointer-events-none z-50">
                Produced by www.geekcoding101.com with Gemini3 Pro + Antigravity
            </div>
        </main>
    );
}
