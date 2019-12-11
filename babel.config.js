const presets = [
    ['@babel/env', {
        'targets': {
            'node': '8.0.0'
        },
        'useBuiltIns': 'usage',
        'corejs': 2,
    }]
];

const plugins = [
    ['@babel/plugin-proposal-class-properties']
];

module.exports = { presets, plugins };
