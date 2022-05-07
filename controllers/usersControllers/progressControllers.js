const {
    progress,
    firstBook,
    secondBook,
    thirdBook,
    fourthBook
} = require('../../models/models');
const ApiError = require('../../errors/ApiErrors');

class ProgressControllers {
    putProgress = async (req, res, next) => {
        const {userId} = req.params;
        const {
            first_book_last_page,
            second_book_last_page,
            third_book_last_page,
            fourth_book_last_page,
        } = req.body;

        //Блок для расчета процента прогресса
        const firstBookTotalPage = await firstBook.count();
        const secondBookTotalPage = await secondBook.count();
        const thirdBookTotalPage = await thirdBook.count();
        const fourthBookTotalPage = await fourthBook.count();
        const totalPage = +firstBookTotalPage + +secondBookTotalPage + +thirdBookTotalPage + +fourthBookTotalPage;
        const onePercent = totalPage / 100;
        const pagesRead = +first_book_last_page + +second_book_last_page + +third_book_last_page + +fourth_book_last_page;
        const percentProgress = +pagesRead / +onePercent;

        const progresses = await progress.findOne({where: {userId: userId}})
            .then(res => {
                if (!res) {
                    return ApiError.badRequest('Данные о прогрессе не найдены');
                }
                const body = {
                    percent_progress: percentProgress,
                    first_book_last_page,
                    second_book_last_page,
                    third_book_last_page,
                    fourth_book_last_page,
                }
                res.update(body);
            })

        return res.json(progresses);
    };
    getProgress = async (req, res, next) => {
        const {userId} = req.params;

        const progresses = await progress.findOne({
            where: {userId},
        })

        return res.json(progresses);
    };
}

module.exports = new ProgressControllers();