'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import CustomImageUploader from '@/components/admin/CustomImageUploader';

interface FeatureObj {
    key: string;
    value: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Phones',
        description: '',
        stock: '',
        image: ''
    });

    // Features State
    const [features, setFeatures] = useState<FeatureObj[]>([
        { key: '', value: '' }
    ]);

    // Specifications State (New)
    const [specifications, setSpecifications] = useState<FeatureObj[]>([
        { key: '', value: '' }
    ]);

    // Advanced Fields State
    const [isFeatured, setIsFeatured] = useState(false);
    const [isOnSpecialOffer, setIsOnSpecialOffer] = useState(false);
    const [salePrice, setSalePrice] = useState('');
    const [colors, setColors] = useState<string[]>([]);
    const [colorInput, setColorInput] = useState('');
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<{ name: string; price: string; stock: string }[]>([]);
    const [status, setStatus] = useState<'published' | 'draft'>('published');

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products?id=${id}`);
                const data = await res.json();

                if (data.success && data.data) {
                    const p = data.data;
                    setFormData({
                        name: p.name,
                        price: p.price,
                        category: p.category,
                        description: p.description,
                        stock: p.stock,
                        image: p.imageUrl || p.image || ''
                    });

                    setIsFeatured(p.isFeatured || false);
                    setStatus(p.status || 'published');
                    setColors(p.colors || []);
                    setIsOnSpecialOffer(p.isOnSpecialOffer || false);
                    setSalePrice(p.salePrice ? p.salePrice.toString() : '');

                    if (p.variants && p.variants.length > 0) {
                        setHasVariants(true);
                        setVariants(p.variants.map((v: any) => ({
                            name: v.name,
                            price: v.price.toString(),
                            stock: v.stock.toString()
                        })));
                    }

                    if (p.features && Object.keys(p.features).length > 0) {
                        setFeatures(Object.entries(p.features).map(([key, value]) => ({
                            key,
                            value: value as string
                        })));
                    }

                    if (p.specifications && Object.keys(p.specifications).length > 0) {
                        setSpecifications(Object.entries(p.specifications).map(([key, value]) => ({
                            key,
                            value: value as string
                        })));
                    }
                } else {
                    alert('Product not found');
                    router.push('/admin/products');
                }
            } catch (error) {
                console.error('Error fetching product', error);
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, router]);

    // ------------------------------------------------------------------
    // PARSER 1: Key Features (Simple, Bullet-point focused)
    // ------------------------------------------------------------------
    const parseKeyFeatures = (text: string) => {
        if (!text.trim()) return [];

        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const newRows: FeatureObj[] = [];

        lines.forEach(line => {
            // 1. Clean bullet points
            const cleanLine = line.replace(/^[\s\-\•\*]+/, '').trim();
            if (!cleanLine) return;

            // 2. Simple Heuristic for Features
            let key = 'Feature';
            let value = cleanLine;

            // Check for explicit "Key: Value" format first (simple ones only)
            const colonIndex = cleanLine.indexOf(':');
            if (colonIndex !== -1 && colonIndex < 20) {
                key = cleanLine.substring(0, colonIndex).trim();
                value = cleanLine.substring(colonIndex + 1).trim();
            } else {
                // Infer key from content keywords
                const lower = cleanLine.toLowerCase();
                if (lower.includes('display') || lower.includes('screen') || lower.includes('inch')) key = 'Display';
                else if (lower.includes('battery') || lower.includes('mah')) key = 'Battery';
                else if (lower.includes('camera') || lower.includes('mp ') || lower.includes('lens')) key = 'Camera';
                else if (lower.includes('ram') || lower.includes('rom') || lower.includes('storage') || lower.includes('gb')) key = 'Memory';
                else if (lower.includes('processor') || lower.includes('cpu') || lower.includes('chipset') || lower.includes('hz')) key = 'Processor';
                else if (lower.includes('android') || lower.includes('ios')) key = 'OS';
                else if (lower.includes('sim') || lower.includes('dual')) key = 'SIM';
                else if (lower.includes('network') || lower.includes('5g') || lower.includes('4g')) key = 'Network';
                else if (lower.includes('sensor') || lower.includes('fingerprint')) key = 'Sensors';
            }

            newRows.push({ key, value });
        });

        return newRows;
    };

    // ------------------------------------------------------------------
    // PARSER 2: Technical Specs (Complex, GSM Arena style)
    // ------------------------------------------------------------------
    const parseTechnicalSpecs = (text: string) => {
        if (!text.trim()) return [];

        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const newRows: FeatureObj[] = [];

        // Extensive list of common tech spec keys
        const KNOWN_KEYS = [
            'Model Name', 'Model Numbers', 'Network Technology', 'Launch Announced', 'Launch Status', 'Release Date',
            'Body Dimensions', 'Body Weight', 'Body Build', 'SIM Options', 'Body Protection', 'Dimensions', 'Weight', 'Build', 'Water Resistance',
            'Display Type', 'Display Size', 'Display Resolution', 'Secondary Display', 'Display', 'Brightness',
            'Platform OS', 'Platform Chipset', 'Platform CPU', 'Platform GPU', 'Operating System', 'Processor (Chipset)', 'Cellular Modem',
            'Memory Card Slot', 'Memory Internal', 'RAM', 'Storage Options',
            'Main Camera Triple', 'Main Camera Quad', 'Main Camera Dual', 'Main Camera Single', 'Main Camera',
            'Main Camera Features', 'Main Camera Video',
            'Selfie Camera Single', 'Selfie Camera Dual', 'Selfie Camera Features', 'Selfie Camera Video', 'Front Camera',
            'Cover Camera',
            'Loudspeaker Sound', 'Sound 3.5mm Jack', 'Sound',
            'WLAN', 'Bluetooth', 'Positioning', 'GPS', 'NFC', 'Radio', 'USB', 'Connectivity', 'Satellite Features',
            'Features Sensors', 'Features Extras', 'Sensors', 'AI Features',
            'Battery Type', 'Battery Charging', 'Battery Capacity', 'Charging',
            'Available Colors', 'Models', 'SAR', 'Price', 'Price in Kenya', 'Colors'
        ];

        let pendingKey = '';
        let pendingValue = '';

        const flushPending = () => {
            if (pendingKey) {
                newRows.push({ key: pendingKey, value: pendingValue.trim() });
                pendingKey = '';
                pendingValue = '';
            }
        };

        lines.forEach(line => {
            const cleanLine = line.replace(/^[\s\-\•\*]+/, '').trim();

            const matchedKey = KNOWN_KEYS.sort((a, b) => b.length - a.length)
                .find(k => cleanLine.toLowerCase().startsWith(k.toLowerCase()));

            if (matchedKey) {
                flushPending();
                pendingKey = matchedKey;
                let remainder = cleanLine.substring(matchedKey.length).trim();
                if (remainder.startsWith(':')) remainder = remainder.substring(1).trim();
                pendingValue = remainder;
            } else {
                const colonIndex = cleanLine.indexOf(':');
                // Allow longer keys for specs, but ensure it looks like a key
                // FIXED: Removed !pendingKey check to allow new keys to break the previous block
                const isExplicitKey = colonIndex !== -1 && colonIndex < 40;

                if (isExplicitKey) {
                    flushPending();
                    pendingKey = cleanLine.substring(0, colonIndex).trim();
                    pendingValue = cleanLine.substring(colonIndex + 1).trim();
                } else {
                    if (pendingKey) {
                        // Append to previous (Technical specs often duplicate lines)
                        pendingValue = pendingValue ? pendingValue + '\n' + cleanLine : cleanLine;
                    } else {
                        // If stray text at start, verify if it's a section header or general info
                        pendingKey = 'General';
                        pendingValue = cleanLine;
                    }
                }
            }
        });

        flushPending();

        return newRows;
    };

    // Features Smart Paste
    const [pasteModeFeatures, setPasteModeFeatures] = useState(false);
    const [rawTextFeatures, setRawTextFeatures] = useState('');

    const handleParseFeatures = () => {
        const rows = parseKeyFeatures(rawTextFeatures);
        if (rows.length > 0) {
            setFeatures(rows);
            setPasteModeFeatures(false);
            setRawTextFeatures('');
        }
    };

    // Specs Smart Paste
    const [pasteModeSpecs, setPasteModeSpecs] = useState(false);
    const [rawTextSpecs, setRawTextSpecs] = useState('');

    const handleParseSpecs = () => {
        const rows = parseTechnicalSpecs(rawTextSpecs);
        if (rows.length > 0) {
            setSpecifications(rows);
            setPasteModeSpecs(false);
            setRawTextSpecs('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Generic list handler
    const handleListChange = (
        list: FeatureObj[],
        setList: (l: FeatureObj[]) => void,
        index: number,
        field: 'key' | 'value',
        value: string
    ) => {
        const newList = [...list];
        newList[index][field] = value;
        setList(newList);
    };

    const addListRow = (list: FeatureObj[], setList: (l: FeatureObj[]) => void) => {
        setList([...list, { key: '', value: '' }]);
    };

    const removeListRow = (list: FeatureObj[], setList: (l: FeatureObj[]) => void, index: number) => {
        setList(list.filter((_, i) => i !== index));
    };

    // Color Helpers
    const handleAddColor = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (colorInput.trim() && !colors.includes(colorInput.trim())) {
                setColors([...colors, colorInput.trim()]);
                setColorInput('');
            }
        }
    };

    const handleRemoveColor = (colorToRemove: string) => {
        setColors(colors.filter(c => c !== colorToRemove));
    };

    // Variant Helpers
    const handleAddVariant = () => {
        setVariants([...variants, { name: '', price: '', stock: '' }]);
    };

    const handleRemoveVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: 'name' | 'price' | 'stock', value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const featuresObject: Record<string, string> = {};
            features.forEach(f => {
                if (f.key.trim()) featuresObject[f.key.trim()] = f.value.trim();
            });

            const specsObject: Record<string, string> = {};
            specifications.forEach(s => {
                if (s.key.trim()) specsObject[s.key.trim()] = s.value.trim();
            });

            // Calculate discount percentage if on special offer
            let discountPercentage = 0;
            if (isOnSpecialOffer && salePrice && Number(salePrice) > 0) {
                const originalPrice = Number(formData.price);
                const offerPrice = Number(salePrice);
                discountPercentage = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
            }

            const payload = {
                _id: id,
                ...formData,
                imageUrl: formData.image,
                features: featuresObject,
                specifications: specsObject,
                isFeatured,
                isOnSpecialOffer,
                salePrice: isOnSpecialOffer && salePrice ? Number(salePrice) : null,
                discountPercentage,
                colors,
                variants: hasVariants ? variants.map(v => ({
                    name: v.name,
                    price: Number(v.price) || 0,
                    stock: Number(v.stock) || 0
                })) : [],
                status: status
            };

            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                alert('Failed to update product');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating product');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        background: '#111',
        border: '1px solid #333',
        borderRadius: '6px',
        color: 'white',
        marginTop: '0.5rem'
    };

    const labelStyle = {
        display: 'block',
        marginTop: '1.5rem',
        color: '#ccc',
        fontSize: '0.9rem'
    };

    const renderKeyValueSection = (
        title: string,
        list: FeatureObj[],
        setList: (l: FeatureObj[]) => void,
        pasteMode: boolean,
        setPasteMode: (b: boolean) => void,
        rawText: string,
        setRawText: (s: string) => void,
        handleParse: () => void,
        placeholder: string
    ) => (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #222', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ ...labelStyle, marginTop: 0, marginBottom: 0, color: '#ff6b00' }}>{title}</label>
                <button
                    type="button"
                    onClick={() => setPasteMode(!pasteMode)}
                    style={{ fontSize: '0.85rem', color: '#ff6b00', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {pasteMode ? 'Back to Manual' : '✨ Smart Paste'}
                </button>
            </div>

            {pasteMode ? (
                <div style={{ background: '#111', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #333' }}>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                        Paste your block here. Supported format: <b>"Key: Value"</b>
                    </p>
                    <textarea
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        rows={8}
                        placeholder={placeholder}
                        style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.9rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleParse}
                            style={{ padding: '8px 16px', background: '#ccc', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Auto-Fill
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {list.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    placeholder="Key (e.g. Speed)"
                                    value={item.key}
                                    onChange={(e) => handleListChange(list, setList, index, 'key', e.target.value)}
                                    style={{ ...inputStyle, marginTop: 0, flex: 1 }}
                                />
                                <textarea
                                    placeholder="Value"
                                    value={item.value}
                                    onChange={(e) => handleListChange(list, setList, index, 'value', e.target.value)}
                                    style={{ ...inputStyle, marginTop: 0, flex: 2, minHeight: '38px', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                                {list.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeListRow(list, setList, index)}
                                        style={{ background: '#333', border: 'none', color: 'white', borderRadius: '6px', padding: '0 15px', cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => addListRow(list, setList)}
                        style={{ marginTop: '1rem', background: 'transparent', border: '1px dashed #444', color: '#aaa', padding: '10px', width: '100%', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        + Add Row
                    </button>
                </>
            )}
        </div>
    );

    if (fetching) {
        return <div style={{ padding: '2rem', color: 'white' }}>Loading product details...</div>;
    }

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Edit Product</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: isFeatured ? '#ff6b00' : '#888' }}>
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => {
                                setIsFeatured(e.target.checked);
                                if (e.target.checked) {
                                    // If featured is checked, uncheck special offer
                                    setIsOnSpecialOffer(false);
                                    setSalePrice('');
                                }
                            }}
                            style={{ accentColor: '#ff6b00' }}
                        />
                        Featured Product
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ background: '#0a0a0a', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>

                <label style={{ ...labelStyle, marginTop: 0 }}>Product Name</label>
                <input name="name" required value={formData.name} placeholder="e.g. iPhone 15 Pro" style={inputStyle} onChange={handleChange} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Price (KES)</label>
                        <input name="price" type="number" required value={formData.price} placeholder="150000" style={inputStyle} onChange={handleChange} />
                    </div>
                    <div>
                        <label style={labelStyle}>Stock Quantity</label>
                        <input name="stock" type="number" required value={formData.stock} placeholder="10" style={inputStyle} onChange={handleChange} />
                    </div>
                </div>

                {/* Special Offer Section */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0f0f0f', borderRadius: '8px', border: '1px solid #222' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', color: isOnSpecialOffer ? '#ff6b00' : '#ccc' }}>
                        <input
                            type="checkbox"
                            checked={isOnSpecialOffer}
                            onChange={(e) => {
                                setIsOnSpecialOffer(e.target.checked);
                                if (e.target.checked) {
                                    // If special offer is checked, uncheck featured
                                    setIsFeatured(false);
                                }
                            }}
                            style={{ accentColor: '#ff6b00' }}
                        />
                        Mark as Special Offer
                    </label>
                    {isOnSpecialOffer && (
                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ ...labelStyle, marginTop: 0, color: '#ff6b00' }}>Sale Price (KES)</label>
                            <input
                                type="number"
                                value={salePrice}
                                onChange={(e) => setSalePrice(e.target.value)}
                                placeholder="120000"
                                style={inputStyle}
                            />
                            {salePrice && formData.price && Number(salePrice) < Number(formData.price) && (
                                <p style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.5rem' }}>
                                    Discount: {Math.round(((Number(formData.price) - Number(salePrice)) / Number(formData.price)) * 100)}% OFF
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <label style={labelStyle}>Category</label>
                <select name="category" value={formData.category} style={inputStyle} onChange={handleChange}>
                    <option value="Phones">Phones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Accessories">Accessories</option>
                    <option value="TVs">TVs</option>
                </select>

                <label style={labelStyle}>Description</label>
                <textarea name="description" value={formData.description} rows={4} style={inputStyle} onChange={handleChange} />

                {/* Colors Section */}
                <label style={labelStyle}>Colors</label>
                <div style={{ ...inputStyle, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                    {colors.map(c => (
                        <span key={c} style={{ background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {c}
                            <button type="button" onClick={() => handleRemoveColor(c)} style={{ border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
                        </span>
                    ))}
                    <input
                        placeholder="Type color & Enter..."
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={handleAddColor}
                        style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', minWidth: '120px' }}
                    />
                </div>

                {/* Variants Section */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid #222', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <label style={{ ...labelStyle, marginTop: 0 }}>Product Variants</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: hasVariants ? '#ff6b00' : '#888' }}>
                            <input
                                type="checkbox"
                                checked={hasVariants}
                                onChange={(e) => setHasVariants(e.target.checked)}
                            />
                            Enable Variants
                        </label>
                    </div>

                    {hasVariants && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {variants.map((v, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        placeholder="Name (e.g. 256GB)"
                                        value={v.name}
                                        onChange={(e) => handleVariantChange(i, 'name', e.target.value)}
                                        style={{ ...inputStyle, marginTop: 0 }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={v.price}
                                        onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                                        style={{ ...inputStyle, marginTop: 0 }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        value={v.stock}
                                        onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                                        style={{ ...inputStyle, marginTop: 0 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(i)}
                                        style={{ background: '#333', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                style={{ background: 'transparent', border: '1px dashed #444', color: '#aaa', padding: '10px', width: '100%', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                + Add Variant
                            </button>
                        </div>
                    )}
                </div>

                {/* Key Features Section */}
                {renderKeyValueSection(
                    'Key Features',
                    features,
                    setFeatures,
                    pasteModeFeatures,
                    setPasteModeFeatures,
                    rawTextFeatures,
                    setRawTextFeatures,
                    handleParseFeatures,
                    'Resolution: 4K\nBattery: 5000mAh'
                )}

                {/* Specifications Section */}
                {renderKeyValueSection(
                    'Technical Specifications',
                    specifications,
                    setSpecifications,
                    pasteModeSpecs,
                    setPasteModeSpecs,
                    rawTextSpecs,
                    setRawTextSpecs,
                    handleParseSpecs,
                    'Display Type: AMOLED\nDimensions: 159.2 x 75 x 12.9 mm'
                )}

                <label style={labelStyle}>Product Image</label>

                <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                    <CustomImageUploader
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                    />
                </div>

                <details style={{ marginTop: '1rem' }}>
                    <summary style={{ fontSize: '0.8rem', color: '#666', cursor: 'pointer' }}>Or use external URL</summary>
                    <input name="image" placeholder="https://..." value={formData.image} style={inputStyle} onChange={handleChange} />
                </details>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #333', color: '#ccc', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '10px 20px', background: '#ff6b00', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {loading ? 'Update...' : 'Update Product'}
                    </button>
                </div>

            </form>
        </div>
    );
}
