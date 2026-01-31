
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('@/lib/dns-patch');
        console.log('🎸 [Instrumentation] DNS Patch Registered at startup');
    }
}
