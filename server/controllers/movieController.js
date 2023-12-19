const uuid = require('uuid')
const path = require('path')
const {Movie, Genres, Countries} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');

class MovieController {
    async create(req, res, next) {
        try {
            const {Title, Genre_id, Country_id, Description, Release_date} = req.body
            const {Cover} = req.files
            let fileName = uuid.v4() + ".jpg"
            Cover.mv(path.resolve(__dirname, '..', 'static', fileName))
    
            const movie = await Movie.create({Title, Cover: fileName, Genre_id, Country_id, Description, Release_date})
            return res.json(movie)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }

    async change(req, res, next) {
        try {
            const { Movie_id, Title, Genre_id, Country_id, Description, Release_date } = req.body
            let movie
            let fileName = uuid.v4() + ".jpg"
    
            if (req.files) {
                const { Cover } = req.files
                Cover.mv(path.resolve(__dirname, '..', 'static', fileName))
                movie = await Movie.update(
                    { Title, Cover: fileName, Genre_id, Country_id, Description, Release_date },
                    { where: { Movie_id } }
                )
                return res.json(movie)
            } else {
                movie = await Movie.update(
                    { Title, Genre_id, Country_id, Description, Release_date },
                    { where: { Movie_id } }
                )
                return res.json(movie)
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const {Title, Genre_id, Country_id} = req.query
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 20
        let offset = page * limit - limit
        let movies;

        if (!Title && !Genre_id && !Country_id) {
            movies = await Movie.findAndCountAll({limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        if(Title && Genre_id && Country_id) {
            movies = await Movie.findAndCountAll({where:{Title: {[Op.iLike]: `%${Title}%`}, Genre_id, Country_id}, limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        if(!Title && Genre_id && Country_id) {
            movies = await Movie.findAndCountAll({where:{Genre_id, Country_id}, limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        if(Title && !Genre_id && Country_id) {
            movies = await Movie.findAndCountAll({where:{Title: {[Op.iLike]: `%${Title}%`}, Country_id}, limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        if(Title && Genre_id && !Country_id) {
            movies = await Movie.findAndCountAll({where:{Title: {[Op.iLike]: `%${Title}%`}, Genre_id}, limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        if(!Title && !Genre_id && Country_id) {
            movies = await Movie.findAndCountAll({where:{Country_id}, limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        if(!Title && Genre_id && !Country_id) {
            movies = await Movie.findAndCountAll({where:{Genre_id}, limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        if(Title && !Genre_id && !Country_id) {
            movies = await Movie.findAndCountAll({where:{Title: {[Op.iLike]: `%${Title}%`}}, limit, offset, include: [Genres, Countries], order: [['Title', 'ASC']]})
        }
        
        return res.json(movies)
    }

    async getOne(req, res) {
        const {Movie_id} = req.params
        const movie = await Movie.findOne({
            where: {Movie_id}, 
            include: [Genres, Countries]
        })
        return res.json(movie)
    }

    async delete(req, res) {
        const {Movie_id} = req.params
        const movie = await Movie.destroy({
            where: {Movie_id}
        })
        return res.json(movie)
    }

}

module.exports = new MovieController()