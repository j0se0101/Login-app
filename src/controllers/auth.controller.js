const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, complete todos los campos'
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user._id);

    // Opciones unificadas de cookie
    const cookieMaxAgeHours = Number(process.env.COOKIE_EXPIRE || 24);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: cookieMaxAgeHours * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: '❌ Email o contraseña incorrectos' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: '❌ Email o contraseña incorrectos' 
      });
    }

    const token = generateToken(user._id);

    // Opciones unificadas de cookie
    const cookieMaxAgeHours = Number(process.env.COOKIE_EXPIRE || 24);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: cookieMaxAgeHours * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: '✅ Login exitoso',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: '✅ Perfil de usuario',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: '❌ Error al obtener perfil',
      error: error.message 
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Verificar si el email ya existe
    const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (emailExists) {
      return res.status(400).json({ 
        success: false,
        message: '❌ El email ya está en uso' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: '✅ Usuario actualizado correctamente',
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Buscar el usuario antes de eliminarlo para obtener sus datos
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ Usuario no encontrado'
      });
    }

    // Guardar los datos del usuario antes de eliminarlo
    const deletedUserInfo = {
      username: user.username,
      email: user.email
    };

    // Eliminar el usuario
    await User.findByIdAndDelete(req.user.id);
    
    // Limpiar la cookie
    res.clearCookie('token');
    
    res.json({
      success: true,
      message: '✅ Usuario eliminado correctamente',
      usuarioEliminado: {
        username: deletedUserInfo.username,
        email: deletedUserInfo.email,
        eliminadoEn: new Date().toLocaleString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: '❌ Error al eliminar usuario',
      error: error.message 
    });
  }
};
