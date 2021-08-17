module.exports = {
    purge: {
        content: [
            './public/*.html',
            './public/**/*.html',
            './src/*.vue',
            './src/**/*.vue'
        ]
    },
    darkMode: 'class', // or 'media' or 'class'
    mode: 'jit'
}
