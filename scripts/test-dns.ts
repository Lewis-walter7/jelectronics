import dns from 'node:dns';
import { promisify } from 'node:util';

const resolveSrv = promisify(dns.resolveSrv);
const lookup = promisify(dns.lookup);

const HOSTNAME = '_mongodb._tcp.cluster0.jewigil.mongodb.net';
// Extract the actual hostname from the SRV record for lookup test
const BASE_HOSTNAME = 'cluster0.jewigil.mongodb.net';

async function testDns() {
    console.log(`Testing DNS resolution for ${HOSTNAME}`);

    // 1. Test SRV Resolution (used by mongodb+srv)
    try {
        console.log('1. Testing dns.resolveSrv...');
        const addresses = await resolveSrv(HOSTNAME);
        console.log('✅ dns.resolveSrv success:', JSON.stringify(addresses, null, 2));
    } catch (err: any) {
        console.error('❌ dns.resolveSrv failed:', err.code, err.message);
    }

    // 2. Test Standard Lookup
    try {
        console.log(`2. Testing dns.lookup for ${BASE_HOSTNAME}...`);
        const result = await lookup(BASE_HOSTNAME);
        console.log('✅ dns.lookup success:', result);
    } catch (err: any) {
        console.error('❌ dns.lookup failed:', err.code, err.message);
    }

    // 3. Print DNS servers currently used
    try {
        console.log('3. Current DNS servers:', dns.getServers());
    } catch (err) {
        console.error('Could not get DNS servers');
    }
}

testDns();
