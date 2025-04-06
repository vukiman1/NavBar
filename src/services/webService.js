import { markAsRead } from "../Admin/Body/ui/notificationApi";
import httpRequest from "../utils/httpRequest";

const webService = {
    getAllBanner: async () => {
        const url = "myjob/admin/banner";
        return httpRequest.get(url);
    },

    getAllNotification() {
        const url = "myjob/web/notification";
        return httpRequest.get(url);
    },
    markAsReadNotification(id) {
        const url = `myjob/web/notification/read/${id}`;
        return httpRequest.patch(url);
    },

    getDashBoardData() {
        const url = "admin-web/dashboard";
        return httpRequest.get(url);
    }

   
};

export default webService;
