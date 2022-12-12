const { SignJWT } = require('jose');

module.exports = {
    tokenSign: async (user) => {
        const jwtConstructor = new SignJWT({
            id: user._id,
            email: user.email
        });

        const encoder = new TextEncoder();
        const token = await jwtConstructor
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(encoder.encode(process.env.JWT_KEY))

        return token;
    }
};