import { getToken } from "./config/db.js";
import { middlewares } from "./config/middlewares.js";

export const loadDependencies = async (isPrivateRoute = false) => {
    if(isPrivateRoute) {
        try {
            await getToken()
        } catch (e) {
            location.href = "../login.html"
        }
    }
}