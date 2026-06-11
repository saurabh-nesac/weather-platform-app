export interface SurfaceBased {
    cape_jkg: number;
    cin_jkg: number;
}

export interface SkewTResponse {
    pressure: number[];
    temperature: number[];
    dewpoint: number[];
    height: number[];

    u: number[];
    v: number[];

    theta: number[];
    thetae: number[];

    parcel_profile_k: number[];

    surface_based: SurfaceBased;
}