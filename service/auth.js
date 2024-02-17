const jwt = require('jsonwebtoken')

const secretKey = "vjashzgcbkzasdfafXchbKHjsbd"

const createTokenForUser = (user)=>{
    const payload = {
            _id: user._id,
            fullName:user.fullName,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            role:user.role
    }
    const token =jwt.sign(payload, secretKey);
    return token;
}

const validateToken = (token)=>{
    const payload = jwt.verify(token, secretKey)
    return payload;
}
module.exports={createTokenForUser,
    validateToken}