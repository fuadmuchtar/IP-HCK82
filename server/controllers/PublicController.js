const { Op } = require('sequelize')
const { User } = require('../models')
const { comparePassword } = require('../helpers/bcryptjs')
const { signToken } = require('../helpers/jwt')
const { genai } = require('../helpers/genai')

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
      const prompt = `Aplikasi saya adalah, aplikasi yang membantu pengguna untuk menemukan informasi tentang budaya Indonesia.
      Pengguna dapat memasukkan pertanyaan atau topik yang ingin mereka ketahui lebih lanjut tentang budaya Indonesia.
      Misalnya, mereka dapat bertanya tentang tradisi, sejarah, seni, adat istiadat, bahasa, atau praktik budaya lainnya.
      Saya ingin Anda memberikan informasi tentang budaya Indonesia yang terkait dengan pertanyaan ini: "${query}".
      Fokuskan secara khusus pada tradisi, sejarah, seni, adat istiadat, bahasa, atau praktik budaya Indonesia.
      Jika pertanyaan tersebut tidak terkait dengan budaya Indonesia, maka berikan jawaban 'Maaf saya hanya bisa menjawab pertanyaan seputar budaya indonesia.'
      buatlah jawaban dalam format JSON dengan kunci "answer" dan nilai yang sesuai dengan informasi yang diberikan.`
      
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
}

module.exports = PublicController