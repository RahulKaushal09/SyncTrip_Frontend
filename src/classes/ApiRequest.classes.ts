export interface wishlistRequestSchema {
    type: string;
    refId: string;
    parentType?: string;
    parentId?: string;
    name?: string;
}

export interface getUserWishlistRequestSchema {
    wishlistType: string;
}