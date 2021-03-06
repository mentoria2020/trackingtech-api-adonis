"use strict";

const CheckInModel = use("App/Models/CheckIn");
const User = use("App/Models/User");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with checkins
 */
class CheckInController {
  async user({ auth, request, response, view }) {
    const user = await User.findOrFail(auth.user.id);
    const dateToday = new Date();

    const tech = await user
      .technologies()
      .wherePivot("date_checkIn", dateToday)
      .fetch();

    return tech;
  }

  /**
   * Show a list of all checkins.
   * GET checkins
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    // const users = await User.all();
    const dateToday = new Date();

    // OK - Todos os usuários com suas respectivas tecnologias
    // Filtrado por data
    //const techs = await User.query()
    //.with("technologies", builder => {
    //  builder.wherePivot("date_checkIn", dateToday);
    //})
    //.fetch();

    // OK - Filtra todos os usuários que fizeram check-in no dia
    // e quais foram as tecnologias foram feitas o chck-in
    const techs = await User.query()
      .whereHas("technologies", ">", 0)
      .with("technologies", builder => {
        builder.wherePivot("date_checkIn", dateToday);
      })
      .fetch();

    // OK - Todos os usuários com suas respectivas tecnologias
    // const techs = await User.query()
    //  .with("technologies")
    //  .fetch();

    return techs;
  }

  /**
   * Create/save a new checkin.
   * POST checkins
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const technology_id = request.body.technology_id;

    const data = {
      technology_id: technology_id,
      user_id: auth.user.id,
      date_checkIn: new Date()
    };

    const checkIn = await CheckInModel.create(data);
    return checkIn;
  }

  /**
   * Display a single checkin.
   * GET checkins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const checkIn = await CheckInModel.findOrFail(params.id);

    return checkIn;
  }

  /**
   * Update checkin details.
   * PUT or PATCH checkins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a checkin with id.
   * DELETE checkins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const checkIn = await checkInModel.findOrFail(params.id);

    await checkIn.delete();
  }
}

module.exports = CheckInController;
