import dns from 'node:dns';
import { promisify } from 'node:util';

const resolveSrv = promisify(dns.resolveSrv);
const lookup = promisify(dns.lookup);

const HOSTNAME = '_mongodb._tcp.cluster0.jewigil.mongodb.net';
const BASE_HOSTNAME = 'cluster0.jewigil.mongodb.net';

async function testDns() {
    // FORCE GOOGLE DNS
    try {
        console.log('Setting DNS servers to 8.8.8.8...');
        dns.setServers(['8.8.8.8']);
        console.log('New DNS servers:', dns.getServers());
    } catch (err) {
        console.error('Failed to set DNS servers:', err);
    }

    console.log(`Testing DNS resolution for ${HOSTNAME}`);

    // 1. Test SRV Resolution
    try {
        console.log('1. Testing dns.resolveSrv...');
        const addresses = await resolveSrv(HOSTNAME);
        console.log('✅ dns.resolveSrv success:', JSON.stringify(addresses, null, 2));
    } catch (err: any) {
        console.error('❌ dns.resolveSrv failed:', err.code, err.message);
    }
}

testDns();
