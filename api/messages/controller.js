const Message = require('./model');
const User = require('../users/model'); // Asegúrate de que tienes el modelo de usuarios importado

// Obtener mensajes
exports.getMessages = async (req, res) => {
  try {
    const { flatId } = req.query; // Obtenemos el flatId de la consulta
    if (!flatId) {
      return res.status(400).json({ message: "Flat ID is required" });
    }

    // Buscamos los mensajes por flatId
    const messages = await Message.find({ flatID: flatId }).populate('userID', 'firstName');

    res.status(200).json({
      status: 'success',
      data: messages
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      status: 'fail',
      message: 'Error fetching messages'
    });
  }
};

// Publicar mensaje
exports.publishMessage = async (req, res) => {
  try {
    const { message, flatId,isResponse } = req.body;
    const userId = req.user._id; // El ID del usuario autenticado

    if (!message || !flatId) {
      return res.status(400).json({ message: "Message and Flat ID are required" });
    }

    // Crear un nuevo mensaje
    const newMessage = await Message.create({
      userID: userId,
      flatID: flatId,
      message: message,
      isResponse: isResponse || false,
      createdAt: new Date()
    });

    res.status(201).json({
      status: 'success',
      data: newMessage
    });
  } catch (error) {
    console.error("Error publishing message:", error);
    res.status(500).json({
      status: 'fail',
      message: 'Error publishing message'
    });
  }
};
