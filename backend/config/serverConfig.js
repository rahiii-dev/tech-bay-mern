const serverConfig = {
    port : process.env.PORT || 5000,
    host : process.env.HOST || 'localhost',
    hostname : function() {
        return this.host + ':' + this.port;
    }
}

export default serverConfig