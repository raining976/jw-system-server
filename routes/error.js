import { RESULT } from "../utils/constant.js";

/**
 * 错误页面
 * @param app
 */
export default app => {
    app.use(function (req, res, next) {
        res.json(RESULT.NOT_FOUND)
    });
}
