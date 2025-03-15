import { webService } from "./webService";

export const bannerService = {
    getAllBanner: () => {
        return webService.get("/banners");
    },
    createBanner: (data) => {
        return webService.post("/banners", data);
    },
    updateBanner: (id, data) => {
        return webService.put(`/banners/${id}`, data);
    },
    deleteBanner: (id) => {
        return webService.delete(`/banners/${id}`);
    }
};
