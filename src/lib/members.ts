export const FLAT_MEMBERS = [
    {
        id: "raju@bachelorpoint.com",
        email: "raju@bachelorpoint.com",
        name: "Raju",
        image: "/Raju.jpg",
    },
    {
        id: "radin@bachelorpoint.com",
        email: "radin@bachelorpoint.com",
        name: "Radin",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
        id: "real@bachelorpoint.com",
        email: "real@bachelorpoint.com",
        name: "Real",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    },
    {
        id: "arefin@bachelorpoint.com",
        email: "arefin@bachelorpoint.com",
        name: "Arefin",
        image: "/Arefin.jpg",
    },
    {
        id: "rubel@bachelorpoint.com",
        email: "rubel@bachelorpoint.com",
        name: "Rubel",
        image: "/Rubel.jpg",
    },
] as const;

export type FlatMember = (typeof FLAT_MEMBERS)[number];

export function getMemberByEmail(email: string | null | undefined) {
    const normalizedEmail = email?.trim().toLowerCase();
    return FLAT_MEMBERS.find((member) => member.email === normalizedEmail) ?? null;
}
