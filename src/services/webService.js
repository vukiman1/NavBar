import httpRequest from "../utils/httpRequest";

const webService = {
    getAllBanner: async () => {
        const url = "myjob/admin/banner";
        return httpRequest.get(url);
    },

   
};

export default webService;
