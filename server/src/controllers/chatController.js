const {
  User,
  Catalog,
  CatalogChat,
  Conversation,
  Message,
} = require('../models');
const { Op } = require('sequelize');

const getUserData = async (userId) => {
  return await User.findOne({
    where: { id: userId },
    attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
  });
};

const getInterlocutorData = async (participants, userId) => {
  const interlocutorId = participants.find(
    (participant) => participant !== userId
  );
  return await getUserData(interlocutorId);
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;

    const conversations = await Conversation.findAll({
      attributes: ['id', 'participants', 'blackList', 'favoriteList'],
      include: [
        {
          model: Message,
          as: 'messages',
          attributes: ['id', 'sender', 'body', 'createdAt'],
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    });

    const conversationsWithInterlocutors = [];

    for (const conversation of conversations) {
      const isUserParticipant = conversation.participants.includes(userId);

      if (
        isUserParticipant &&
        conversation.messages &&
        conversation.messages.length > 0
      ) {
        const interlocutor = await getInterlocutorData(
          conversation.participants,
          userId
        );

        conversationsWithInterlocutors.push({
          id: conversation.id,
          sender: conversation.messages[0].sender,
          text: conversation.messages[0].body,
          createdAt: conversation.messages[0].createdAt,
          participants: conversation.participants,
          blackList: conversation.blackList,
          favoriteList: conversation.favoriteList,
          interlocutor,
        });
      }
    }

    res.send(conversationsWithInterlocutors);
  } catch (err) {
    console.log('getPreview: ', err.message);
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const interlocutorId = req.body.interlocutorId;
  const participants = [userId, interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

  try {
    let conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
      include: [
        {
          model: Message,
          as: 'messages',
          attributes: ['id', 'sender', 'body', 'createdAt', 'updatedAt'],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        blackList: [false, false],
        favoriteList: [false, false],
      });
    }

    const interlocutor = await getInterlocutorData(participants, userId);

    const formattedMessages = (conversation.messages || []).map((message) => ({
      id: message.id,
      sender: message.sender,
      body: message.body,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));

    res.send({
      messages: formattedMessages,
      interlocutor,
    });
  } catch (err) {
    console.log('getChat: ', err.message);
    next(err);
  }
};

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

  try {
    const conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
    });

    const interlocutor = await getInterlocutorData(
      participants,
      req.tokenData.userId
    );

    const message = await Message.create({
      sender: req.tokenData.userId,
      body: req.body.messageBody,
      conversationId: conversation.id,
    });

    const preview = {
      id: conversation.id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createdAt: message.createdAt,
      participants: conversation.participants,
      blackList: conversation.blackList,
      favoriteList: conversation.favoriteList,
      interlocutor,
    };

    res.send({
      message: {
        id: message.id,
        sender: message.sender,
        body: message.body,
        conversation: message.conversationId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        participants,
      },
      preview,
    });
  } catch (err) {
    console.log('addMessage: ', err.message);
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const participants = req.body.participants;

  try {
    let conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
    });

    if (conversation) {
      const predicate = participants.indexOf(userId);
      const blackList = [...conversation.blackList];
      blackList[predicate] = req.body.blackListFlag;

      await conversation.update({
        blackList,
      });

      res.send(conversation);
    } else {
      res.status(404).send({ error: 'Chat not found' });
    }
  } catch (err) {
    console.log('blackList: ', err.message);
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const participants = req.body.participants;

  try {
    let conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
    });

    if (conversation) {
      const predicate = participants.indexOf(userId);
      const favoriteList = [...conversation.favoriteList];
      favoriteList[predicate] = req.body.favoriteFlag;

      await conversation.update({
        favoriteList,
      });

      res.send(conversation);
    } else {
      res.status(404).send({ error: 'Chat not found' });
    }
  } catch (err) {
    console.log('favoriteList: ', err.message);
    next(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;
    const catalogName = req.body.catalogName;
    const chatId = req.body.chatId;

    const catalog = await Catalog.create({
      userId,
      catalogName,
    });

    await CatalogChat.create({
      catalogId: catalog.id,
      conversationId: chatId,
    });

    res.send(catalog);
  } catch (err) {
    console.log('createCatalog: ', err.message);
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOne({
      where: {
        id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      include: [
        {
          model: CatalogChat,
          as: 'catalogChats',
          include: [
            {
              model: Conversation,
              as: 'conversation',
            },
          ],
        },
      ],
    });

    await catalog.update({ catalogName: req.body.catalogName });
    const response = {
      chats: catalog.catalogChats.map((chat) => chat.conversation.id),
      id: catalog.id,
      userId: catalog.userId,
      catalogName: catalog.catalogName,
    };
    res.send(response);
  } catch (err) {
    console.log('updateNameCatalog: ', err.message);
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const { catalogId, chatId } = req.body;
    const userId = req.tokenData.userId;

    const catalog = await Catalog.findOne({
      where: {
        id: catalogId,
        userId: userId,
      },
    });

    const catalogChat = await CatalogChat.findOne({
      where: {
        catalogId: catalogId,
        conversationId: chatId,
      },
    });

    if (!catalogChat) {
      await CatalogChat.create({
        catalogId: catalogId,
        conversationId: chatId,
      });
    }

    res.send(catalog);
  } catch (err) {
    console.log('addNewChatToCatalog: ', err.message);
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOne({
      where: {
        id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
    });

    await CatalogChat.destroy({
      where: {
        catalogId: catalog.id,
        conversationId: req.body.chatId,
      },
    });

    res.send(catalog);
  } catch (err) {
    console.log('removeChatFromCatalog: ', err.message);
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const catalogId = req.body.catalogId;
    const userId = req.tokenData.userId;

    await CatalogChat.destroy({
      where: {
        catalogId,
      },
    });

    await Catalog.destroy({
      where: {
        id: catalogId,
        userId,
      },
    });

    res.end();
  } catch (err) {
    console.log('deleteCatalog: ', err.message);
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.findAll({
      where: { userId: req.tokenData.userId },
      include: [
        {
          model: CatalogChat,
          as: 'catalogChats',
          include: [
            {
              model: Conversation,
              as: 'conversation',
            },
          ],
        },
      ],
    });

    const response = catalogs.map((catalog) => ({
      id: catalog.id,
      catalogName: catalog.catalogName,
      chats: catalog.catalogChats.map((chat) => chat.conversation.id),
    }));

    res.send(response);
  } catch (err) {
    console.log('getCatalogs: ', err.message);
    next(err);
  }
};
