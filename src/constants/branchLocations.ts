export interface BranchLocation {
    name: string;
    address: string;
    phone: string;
    hours: string;
    mapLink: string;
}

export const branchLocations: BranchLocation[] = [
    {
        name: "Robert Food",
        address: "1986 Hilltop Drive, Borger, TX 79007",
        phone: "+880 1630 225015",
        hours: "7:30 AM - 9:30 PM",
        mapLink: "https://maps.google.com/?q=1986+Hilltop+Dr,+Borger,+TX+79007",
    },
    {
        name: "Mark A. Reed Food",
        address: "4877 Rose Avenue, New Orleans, LA 70112",
        phone: "+880 1630 225015",
        hours: "7:30 AM - 9:30 PM",
        mapLink: "https://maps.google.com/?q=4877+Rose+Ave,+New+Orleans,+LA+70112",
    },
    {
        name: "Karie K. Hill Food",
        address: "1509 Peaceful Lane, Cleveland, OH 44115",
        phone: "+880 1630 225015",
        hours: "7:30 AM - 9:30 PM",
        mapLink: "https://maps.google.com/?q=1509+Peaceful+Ln,+Cleveland,+OH+44115",
    },
];
