import React, { useState } from 'react';

interface ShoeDesign extends Record<string, unknown> {
    upper: string;
    sole: string;
    laces: string;
    color: string;
    pattern: string;
    logoText?: string;
}

interface ShoeDesignerProps {
    onDesignChange?: (design: ShoeDesign) => void;
    initialDesign?: Partial<Record<string, unknown>>;
}

export function ShoeDesigner({ onDesignChange, initialDesign = {} }: ShoeDesignerProps) {
    const [design, setDesign] = useState<ShoeDesign>({
        upper: 'leather',
        sole: 'rubber',
        laces: 'standard',
        color: '#000000',
        pattern: 'solid',
        logoText: '',
        ...initialDesign,
    });

    const updateDesign = (key: keyof ShoeDesign, value: string) => {
        const newDesign = { ...design, [key]: value };
        setDesign(newDesign);
        onDesignChange?.(newDesign);
    };

    const upperOptions = [
        { value: 'leather', label: 'Leather', emoji: '🧳' },
        { value: 'canvas', label: 'Canvas', emoji: '🎨' },
        { value: 'synthetic', label: 'Synthetic', emoji: '🧪' },
        { value: 'mesh', label: 'Mesh', emoji: '🕳️' },
    ];

    const soleOptions = [
        { value: 'rubber', label: 'Rubber', emoji: '⚫' },
        { value: 'eva', label: 'EVA', emoji: '🟡' },
        { value: 'leather', label: 'Leather', emoji: '🟤' },
        { value: 'cork', label: 'Cork', emoji: '🟫' },
    ];

    const laceOptions = [
        { value: 'standard', label: 'Standard', emoji: '➖' },
        { value: 'rope', label: 'Rope', emoji: '🪢' },
        { value: 'elastic', label: 'Elastic', emoji: '🔄' },
        { value: 'no_laces', label: 'No Laces', emoji: '🚫' },
    ];

    const patternOptions = [
        { value: 'solid', label: 'Solid', emoji: '⬛' },
        { value: 'striped', label: 'Striped', emoji: '📏' },
        { value: 'dotted', label: 'Dotted', emoji: '⚪' },
        { value: 'custom', label: 'Custom', emoji: '🎭' },
    ];

    const colorOptions = [
        '#000000', '#FFFFFF', '#8B4513', '#000080', '#808080',
        '#FF0000', '#0000FF', '#008000', '#800080', '#FFA500',
        '#FFFF00', '#FFC0CB', '#A52A2A', '#00FFFF', '#FF00FF'
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shoe Preview */}
            <div className="bg-white p-8 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">👟 Shoe Preview</h3>
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Shoe Silhouette */}
                    <div 
                        className="w-80 h-48 relative transition-all duration-300"
                        style={{
                            background: `linear-gradient(135deg, ${design.color}, ${design.color}dd)`,
                            clipPath: 'polygon(15% 85%, 85% 85%, 90% 70%, 85% 50%, 80% 30%, 60% 20%, 40% 25%, 20% 35%, 10% 50%, 5% 70%)',
                            borderRadius: '10px',
                        }}
                    >
                        {/* Pattern Overlay */}
                        {design.pattern === 'striped' && (
                            <div className="absolute inset-0 opacity-30"
                                 style={{
                                     background: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 20px)`,
                                     clipPath: 'inherit'
                                 }}
                            />
                        )}
                        {design.pattern === 'dotted' && (
                            <div className="absolute inset-0 opacity-30"
                                 style={{
                                     background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 2px, transparent 2px),
                                                  radial-gradient(circle at 60% 40%, rgba(255,255,255,0.5) 2px, transparent 2px),
                                                  radial-gradient(circle at 40% 80%, rgba(255,255,255,0.5) 2px, transparent 2px)`,
                                     backgroundSize: '40px 40px',
                                     clipPath: 'inherit'
                                 }}
                            />
                        )}
                        
                        {/* Sole */}
                        <div 
                            className="absolute bottom-0 left-0 right-0 h-4 rounded-b-lg"
                            style={{
                                backgroundColor: design.sole === 'rubber' ? '#333' : 
                                               design.sole === 'eva' ? '#f4f4f4' :
                                               design.sole === 'leather' ? '#8B4513' : '#D2B48C'
                            }}
                        />
                        
                        {/* Laces */}
                        {design.laces !== 'no_laces' && (
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 space-y-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex justify-between w-20">
                                        <div className={`w-1 h-1 rounded-full ${
                                            design.laces === 'rope' ? 'bg-amber-600' :
                                            design.laces === 'elastic' ? 'bg-gray-800' : 'bg-black'
                                        }`} />
                                        <div className={`w-1 h-1 rounded-full ${
                                            design.laces === 'rope' ? 'bg-amber-600' :
                                            design.laces === 'elastic' ? 'bg-gray-800' : 'bg-black'
                                        }`} />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Logo Text */}
                        {design.logoText && (
                            <div className="absolute bottom-8 right-4 text-white font-bold text-xs opacity-80">
                                {design.logoText}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Design Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Design Summary:</h4>
                    <div className="text-sm space-y-1 text-gray-600">
                        <p><span className="font-medium">Upper:</span> {upperOptions.find(o => o.value === design.upper)?.label}</p>
                        <p><span className="font-medium">Sole:</span> {soleOptions.find(o => o.value === design.sole)?.label}</p>
                        <p><span className="font-medium">Laces:</span> {laceOptions.find(o => o.value === design.laces)?.label}</p>
                        <p><span className="font-medium">Pattern:</span> {patternOptions.find(o => o.value === design.pattern)?.label}</p>
                        {design.logoText && <p><span className="font-medium">Logo:</span> {design.logoText}</p>}
                    </div>
                </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-6">
                {/* Upper Material */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">👆 Upper Material</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {upperOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateDesign('upper', option.value)}
                                className={`p-3 rounded-lg border transition-all ${
                                    design.upper === option.value
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-lg mb-1">{option.emoji}</div>
                                <div className="text-sm font-medium">{option.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selection */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">🌈 Primary Color</h4>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                onClick={() => updateDesign('color', color)}
                                className={`w-10 h-10 rounded-lg border-2 ${
                                    design.color === color ? 'border-blue-500' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                    <input
                        type="color"
                        value={design.color}
                        onChange={(e) => updateDesign('color', e.target.value)}
                        className="w-full h-10 rounded border border-gray-300"
                    />
                </div>

                {/* Pattern */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">🎨 Pattern</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {patternOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateDesign('pattern', option.value)}
                                className={`p-3 rounded-lg border transition-all ${
                                    design.pattern === option.value
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-lg mb-1">{option.emoji}</div>
                                <div className="text-sm font-medium">{option.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sole Type */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">👟 Sole Type</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {soleOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateDesign('sole', option.value)}
                                className={`p-3 rounded-lg border transition-all ${
                                    design.sole === option.value
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-lg mb-1">{option.emoji}</div>
                                <div className="text-sm font-medium">{option.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lace Style */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">🔗 Lace Style</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {laceOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateDesign('laces', option.value)}
                                className={`p-3 rounded-lg border transition-all ${
                                    design.laces === option.value
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="text-lg mb-1">{option.emoji}</div>
                                <div className="text-sm font-medium">{option.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logo Text */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">✨ Custom Logo Text</h4>
                    <input
                        type="text"
                        value={design.logoText}
                        onChange={(e) => updateDesign('logoText', e.target.value)}
                        placeholder="Enter custom text (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={20}
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 20 characters</p>
                </div>
            </div>
        </div>
    );
}