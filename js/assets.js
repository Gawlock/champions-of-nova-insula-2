// assets.js

export const assetLoader = {
    images: {},
    imageUrls: {},
    loadCount: 0,
    totalCount: 0,

    addImage(id, url) {
        this.imageUrls[id] = url;
        this.totalCount++;
    },

    loadAll(callback) {
        if (this.totalCount === 0) {
            callback();
            return;
        }
        for (const id in this.imageUrls) {
            const url = this.imageUrls[id];
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            img.onload = () => {
                this.images[id] = img;
                this.loadCount++;
                if (this.loadCount === this.totalCount) {
                    callback();
                }
            };
            img.onerror = () => {
                console.error(`Falha ao carregar a imagem: ${url}`);
                this.loadCount++;
                if (this.loadCount === this.totalCount) {
                    callback();
                }
            };
        }
    },

    getImage(id) {
        return this.images[id] || null;
    }
};
