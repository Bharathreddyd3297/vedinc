export type AdminWebsite = {
    id: string;
    url: string;
    enabled: boolean;
};

export const ADMIN_WEBSITES: AdminWebsite[] = [
    {
        id: "site-1",
        url: "https://jeton.com",
        enabled: true,
    },
    {
        id: "site-2",
        url: "https://vitejs.dev",
        enabled: true,
    },
    {
        id: "site-3",
        url: "https://react.dev",
        enabled: true,
    },
];
