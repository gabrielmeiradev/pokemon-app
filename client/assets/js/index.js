import { getToken } from "./config/db.js";
import { middlewares } from "./config/middlewares.js";

export const loadDependencies = async (isPrivateRoute = false) => {
    if(isPrivateRoute) {
        try {
            await getToken()
            middlewares.private();
        } catch (e) {
            location.href = "../login.html"
            console.log(e)
        }
    }
}