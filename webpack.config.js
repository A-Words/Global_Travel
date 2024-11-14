module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                babylon: {
                    test: /[\\/]node_modules[\\/]@babylonjs[\\/]/,
                    name: 'babylon',
                    priority: 10
                },
                three: {
                    test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
                    name: 'three',
                    priority: 10
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -10
                }
            }
        }
    }
}; 