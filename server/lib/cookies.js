'use strict';

function clearUserCookie(ctx) {
  ctx.cookies.set('user.name.full', '');
  ctx.cookies.set('user._id', '');
}

function setUserCookie(ctx) {
  ctx.cookies.set('user.name.full', (ctx.req.user ? ctx.req.user.name.full : null));
  ctx.cookies.set('user._id', (ctx.req.user ? ctx.req.user._id.toString() : null));
}

// Public API
exports.clearUserCookie = clearUserCookie;
exports.setUserCookie = setUserCookie;