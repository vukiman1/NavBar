import httpRequest from "../utils/httpRequest";

const companyService = {
    getAllCompany: async () => {
        const url = "info/admin/getAllCompany";
        return httpRequest.get(url);
    },

    updateCompany: async (id, data) => {
        const url = `info/admin/company/${id}`;
        return httpRequest.patch(url, data);
    },

    deleteCompany: async (id) => {
        const url = `company/web/admin/company/${id}`;
        return httpRequest.delete(url);
    }
};

export default companyService;
