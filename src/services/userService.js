import httpRequest from "../utils/httpRequest";

const userService = {

getUserList: async () => {
    const url = "auth/admin/user-list";

    return httpRequest.get(url);
  },

  blockUser(userId) {
    const url = `admin-user/block-user/${userId}`;
    return httpRequest.patch(url);
  },

  getUserDetails(id) {
    const url = `admin-user/user-details/${id}`;
    return httpRequest.get(url);
  },

  updateUserProfile(id, data) {
    const url = `admin-user/info/${id}`
    return httpRequest.put(url, data);
  },

  login(email, password) {
    const url = `admin-user/login`
    return httpRequest.post(url, {email, password})
  }
}
export default userService;
