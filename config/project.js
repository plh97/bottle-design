module.exports = {
    // release config.
    // you can use domain name, ip address or localhost.
    server: 'chat.penlh.com',
    port: 443,

    // qiniu CDN config.
    // this is not necessary. if you not modify this config. image will save to local disk.
    accessKey: 'qiniu_access_key',
    secretKey: 'qiniu_secret_key',
    bucket: 'bucket_name',
    bucketUrl: 'bucket_outside_url',

    // max message lenght. for both backend and frontend
    maxMessageLength: 1024,

    //github OAuth
    // dev: {
        // Client ID
        githubClientID: process.env.NODE_ENV =='dev'? "b794478ea18f28f30509":"beb866b2260c1881c515",
        // Client Secret
        githubClientSecret: process.env.NODE_ENV =='dev'? "e845cb85dae60b38dcab468d9d434b6e068ad083":"1a0a83d40a110f3db587e134d585fe04bdf07736",
    // },
    // pro: {
    //     // Client ID
    //     githubClientID: "beb866b2260c1881c515",
    //     // Client Secret
    //     githubClientSecret: "1a0a83d40a110f3db587e134d585fe04bdf07736"
    // }
};
