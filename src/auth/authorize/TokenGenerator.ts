import jwt from "jsonwebtoken";

class TokenGenerator {
  generateToken(user: User): string {
    try {
      const u = {
        name: user.name,
        email: user.email,
        password: user.password,
        _id: user._id.toString(),
      };
      const token = jwt.sign(u, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24, // expires in 24 hours
      });

      return token;
    } catch (error) {
      // Handle any errors that occur during token generation
      console.error("Error generating token:", error);
      throw new Error("Failed to generate token");
    }
  }
}

interface User {
  name: string;
  email: string;
  password: string;
  _id: string;
}

export default TokenGenerator;
