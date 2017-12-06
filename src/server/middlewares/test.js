/* ./middleware/logger-async.js */

function log( ctx ) {
    console.log( ctx.method, ctx.header.host + ctx.url+'5677fgd' )
}

module.exports = function () {
  
  return async ( ctx, next ) => {
    log(ctx);
    await next()
  }
}