import dns from 'node:dns';

// Force IP family 4 for all DNS lookups to avoid IPv6 timeouts
const originalLookup = dns.lookup;

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

console.log('✅ [DNS Patch] IPv4 Only Mode Enabled (Global)');
