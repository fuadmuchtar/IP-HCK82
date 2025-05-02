const { Op } = require('sequelize')
const { User } = require('../models')
const { comparePassword } = require('../helpers/bcryptjs')
const { signToken } = require('../helpers/jwt')
const { genai } = require('../helpers/genai')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_IDENTITY);

class PublicController {

  static async getHomePage(req, res, next) {
    try {
      res.json({ msg: "BumiKarya by fuad <HCK-82/P2/IP> public", app_version: 1.0 })
    } catch (error) {
      next(error)
    }
  }
  static async login(req, res, next) {
    try {
      console.log(req.body)
      const { email, password } = req.body
      if (!email || !password) {
        throw { name: 'BadRequest', message: 'Email or password is required' }
      }
      const user = await User.findOne({
        where: {
          email,
          isAdmin: false
        }
      })
      if (!user) {
        throw { name: 'Unauthorized', message: 'Invalid email/password' }
      }

      const isValidPassword = comparePassword(password, user.password)
      if (!isValidPassword) {
        throw { name: 'Unauthorized', message: 'Invalid email/password' }
      }

      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }
  static async register(req, res, next) {
    try {

      const user = await User.create(req.body);

      const newUser = user.toJSON();
      delete newUser.password;

      res.status(201).json(newUser);
    } catch (error) {
      next(error)
    }
  }
  static async getProfile(req, res, next) {
    try {
      const { id } = req.user
      const user = await User.findByPk(id)
      if (!user) {
        throw { name: 'NotFound', message: 'User not found' }
      }
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
  static async updateProfile(req, res, next) {
    try {
      const { id } = req.user
      const user = await User.findByPk(id)
      if (!user) {
        throw { name: 'NotFound', message: 'User not found' }
      }
  
      await user.update(req.body)
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  static async exploreIndonesia(req, res, next) {
    try {
      const { query } = req.body
      
      if (!query) {
        throw { name: 'BadRequest', message: 'Query is required' }
      }

      // Construct prompt about Indonesian culture with the user's query
      const prompt = 
      `aplikasi saya adalah aplikasi yang membantu pengguna untuk menemukan informasi tentang Indonesia.
      ini adalah pertanyaan yang diajukan oleh pengguna: "${query}".
      jika pertanyaan tersebut tidak terkait dengan Indonesia, maka berikan jawaban 'Maaf saya hanya bisa menjawab pertanyaan seputar indonesia.'`

      // `Aplikasi saya adalah, aplikasi yang membantu pengguna untuk menemukan informasi tentang budaya Indonesia.
      // Pengguna dapat memasukkan pertanyaan atau topik yang ingin mereka ketahui lebih lanjut tentang budaya Indonesia.
      // Misalnya, mereka dapat bertanya tentang tradisi, sejarah, seni, adat istiadat, bahasa, atau praktik budaya lainnya.
      // Saya ingin Anda memberikan informasi tentang budaya Indonesia yang terkait dengan pertanyaan ini: "${query}".
      // Fokuskan secara khusus pada tradisi, sejarah, seni, adat istiadat, bahasa, atau praktik budaya Indonesia.
      // Jika pertanyaan tersebut tidak terkait dengan budaya Indonesia, maka berikan jawaban 'Maaf saya hanya bisa menjawab pertanyaan seputar budaya indonesia.'`
      
      // Get response from Gemini AI
      const response = await genai(prompt)
      
      res.status(200).json({ 
        message: 'Successfully retrieved information',
        query,
        result: response
      })
    } catch (error) {
      next(error)
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token } = req.body;
      
      if (!token) {
        throw { name: 'BadRequest', message: 'Google token is required' };
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_IDENTITY
      });
      
      const payload = ticket.getPayload();
      
      // Check if user exists
      let user = await User.findOne({
        where: {
          email: payload.email
        }
      });
      
      if (!user) {
        // Register user if not exists
        user = await User.create({
          fullName: payload.name,
          email: payload.email,
          password: process.env.JWT_SECRET + Math.random().toString(36).substring(2, 15), // Generate random secure password
          profilePicture: payload.picture,
          isAdmin: false
        });
      }
      
      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicController