module.exports = {
    devServer: {
        proxy: {
            "^/api": {
                target: "http://invoices.test/api/v1/",
                ws: true,
                changeOrigin: true
            },
        },
    }
}
