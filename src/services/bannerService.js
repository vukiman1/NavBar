import httpRequest from "../utils/httpRequest";

export const bannerService = {
    getAllBanner: async () => {
        const url = "myjob/admin/banner";
        return httpRequest.get(url);
    },

    updateBanner: (id, data) => {
        return httpRequest.put(`/banners/${id}`, data);
    },
    updateBannerStatus: (id, isActive) => {
        const url = `myjob/web/banner/status/${id}`;
        return httpRequest.post(url, { isActive });
    },
    deleteBanner: (id) => {
        return httpRequest.delete(`/banners/${id}`);
    }
};
