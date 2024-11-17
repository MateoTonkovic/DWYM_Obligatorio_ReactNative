import axios from "./axios";
import { headersHelper } from "../helpers/headers.helper";

const searchFriends = async () => {
    const authorizationHeader = await headersHelper.getAuthorizationHeaders();

    const response = await axios.get("/user/all", {
        headers: { ...authorizationHeader },
    });

    return response.data;
};

export const friendService = {
    searchFriends,
};
