import dns from 'node:dns';

// Force IP family 4 for all DNS lookups to avoid IPv6 timeouts
const originalLookup = dns.lookup;
const originalResolveSrv = dns.resolveSrv;

// Force Google Public DNS to resolve SRV record issues (ECONNREFUSED on localhost)
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('✅ [DNS Patch] Forced Google DNS (8.8.8.8, 8.8.4.4)');
} catch (e) {
    console.warn('⚠️ [DNS Patch] Failed to set custom DNS servers', e);
}

// @ts-ignore
dns.lookup = (hostname, options, callback) => {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    } else if (typeof options === 'number') {
        options = { family: 4 };
    } else if (!options) {
        options = {};
    }

    if (typeof options === 'object' && options !== null) {
        // @ts-ignore
        options.family = 4;
    }

    // @ts-ignore
    return originalLookup(hostname, options, callback);
};

// Retry logic for SRV records
// @ts-ignore
dns.resolveSrv = (hostname, callback) => {
    // @ts-ignore
    originalResolveSrv(hostname, (err, addresses) => {
        if (err && (err.code === 'ECONNREFUSED' || err.code === 'SERVFAIL')) {
            console.warn(`⚠️ [DNS Patch] Retrying SRV lookup for ${hostname}...`);
            setTimeout(() => {
                // @ts-ignore
                originalResolveSrv(hostname, callback);
            }, 500); // Short delay retry
        } else {
            callback(err, addresses);
        }
    });
};

console.log('✅ [DNS Patch] IPv4 Only Mode & SRV Retry Enabled (Global)');
