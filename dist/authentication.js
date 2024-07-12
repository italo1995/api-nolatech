"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// authentication.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
exports.getTokenAndUser = getTokenAndUser;
exports.getHeaderAndCharacter = getHeaderAndCharacter;
async function expressAuthentication(request, securityName, _scopes) {
    if (securityName === "bearerAuth") {
        const { token, user } = await getTokenAndUser(request);
        return { token, user };
    }
    else if (securityName === "characterHeader") {
        const { token, character } = await getHeaderAndCharacter(request);
        return { token, character };
    }
    else {
        throw '';
    }
}
async function getTokenAndUser(_req) {
    // Mock implementation
    return {
        token: "user-token",
        user: { key: '', name: "username", email: "username@exapmple.com", user: '' },
    };
}
async function getHeaderAndCharacter(_req) {
    // Mock implementation
    return { token: "character-token", character: { name: "character-name" } };
}
//# sourceMappingURL=authentication.js.map