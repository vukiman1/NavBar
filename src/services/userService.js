import httpRequest from "../utils/httpRequest";

const userService = {

getUserList: async () => {
    const url = "auth/admin/user-list";

    return httpRequest.get(url);
  },
}
export default userService;
