const uuid = require('uuid');
const path = require('path');
const ApiError = require('../../errors/ApiErrors');
const {
    usersImage
} = require('../../models/models');

class UsersImageControllers {
    putUserImage = async (req, res, next) => {
        const {id} = req.user;
        if (!req.files) {
            return next(ApiError.badRequest('Изображение не прикреплено'));
        }
        const {avatar} = req.files || null;
        const fileName = uuid.v4() + '.jpg';
        avatar.mv(path.resolve(__dirname, '../../static/avatars', fileName));

        const userImage = await usersImage.findOne({where: {userId: id}})
            .then(res => {
                if (!res) {
                    return ApiError.badRequest('Данные об изображении не найдены');
                }

                return res.update({avatar: fileName})
            })

        return res.json(userImage);
    };

    getUserImage = async (req, res, next) => {
        const {id} = req.user;
        const userImage = await usersImage.findOne({where: {userId: id}});

        return res.json(userImage);
    };
}

module.exports = new UsersImageControllers();