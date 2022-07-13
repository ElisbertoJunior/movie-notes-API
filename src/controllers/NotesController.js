const knex = require("../database/knex");
const notesRouter = require("../routes/notes.routes");

class NotesController {
  async create(req, res) {
    const { title, description, rating, movie_tags } = req.body;
    const { user_id } = req.params; 

    const note_id = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = movie_tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }

    })

    await knex("movie_tags").insert(tagsInsert)

    
    res.json();

  }

  async show(req, res) {
    const { id } = req.params;

    const notes = await knex("movie_notes").where({ id }).first();

    const tags = await knex("movie_tags").where({ note_id: id }).orderBy("name");

    return res.json({
      ...notes,
      tags
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("movie_notes").where({ id }).delete();

    return res.json()
  }

  async index(req, res) {
    const { title, user_id, movie_tags } = req.query

    let notes;

    if(movie_tags) {
      const filterTags = movie_tags.split(',').map(tag => tag.trim());

      notes = await knex("movie_tags")
      .select([
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.user_id",
      ])
      .where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.title", `%${title}%`)
      .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
      .whereIn("name", filterTags)
      .orderBy("movie_notes.title")

    } else {
      notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%` )
        .orderBy("title")
    }

    const userTags = await knex("movie_tags").where({ user_id })
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...notes,
        tags: noteTags
      }
      
    })

    return res.json(notesWithTags)

  }

}

module.exports = NotesController;