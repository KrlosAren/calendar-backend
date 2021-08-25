// {
//   ok: true,
//     msg: 'get events'
// }

const { response, request } = require('express');
const Event = require('../models/Event');

const eventGetAll = async (req = request, resp = response) => {
  const events = await Event.find().populate('user', 'name');

  resp.status(200).json({
    ok: true,
    msg: 'get all events',
    events,
  });
};

const eventGet = async (req = request, resp = response) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return resp.status(404).json({
        ok: false,
        msg: 'objects doesnt exists',
      });
    }

    resp.status(201).json({
      ok: true,
      msg: 'retrieve event',
      event: event,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: 'an error has occured',
    });
  }
};

const eventPost = async (req = request, resp = response) => {
  const event = new Event(req.body);
  try {
    event.user = req.uid;
    const newEvent = await event.save();
    resp.status(201).json({
      ok: true,
      msg: 'post a event',
      event: newEvent,
    });
  } catch (error) {
    return resp.status(500).json({
      ok: false,
      msg: 'an error has ocurred',
    });
  }
};

const eventPut = async (req = request, resp = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return resp.status(404).json({
        ok: false,
        msg: 'objects doesnt exists',
      });
    }

    if (event.user.toString() !== uid) {
      return resp.status(401).json({
        ok: false,
        msg: 'you can not do that',
      });
    }

    const updateEvent = {
      ...req.body,
      user: uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateEvent, {
      new: true,
    });

    resp.status(201).json({
      ok: true,
      msg: 'update event',
      event: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      ok: false,
      msg: 'an error has occured',
    });
  }
};

const eventDelete = async (req = request, resp = response) => {
  const uid = req.uid;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return resp.status(404).json({
        ok: false,
        msg: 'objects doesnt exists',
      });
    }

    if (event.user.toString() !== uid) {
      return resp.status(401).json({
        ok: false,
        msg: 'you can not do that',
      });
    }

    await event.findByIdAndDelete(eventId);

    resp.status(200).json({
      ok: true,
      msg: 'delete event',
    });
  } catch (error) {
    resp.status(500).json({
      ok: false,
      msg: 'an error was happend',
    });
  }
};

module.exports = {
  eventGetAll,
  eventGet,
  eventPost,
  eventPut,
  eventDelete,
};
