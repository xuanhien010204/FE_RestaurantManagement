import React from "react";

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    const locations = [
        {
            title: "Thuyền Quán",
            address: "194 Xuân Diệu, Phường Quy Nhơn, tỉnh Gia Lai",
            hours: "09:00 AM - 12:00 PM",
            phone: "+039 2818 8285",
            map: "https://www.google.com/maps/place/194+Xu%C3%A2n+Di%E1%BB%87u,+Tr%E1%BA%A7n+Ph%C3%BA,+Quy+Nh%C6%A1n,+B%C3%ACnh+%C4%90%E1%BB%8Bnh,+Vi%E1%BB%87t+Nam/@13.7681663,109.2282249,855m/data=!3m2!1e3!4b1!4m6!3m5!1s0x316f6c895f264d8f:0x9abe74855d59ce2e!8m2!3d13.7681663!4d109.2307998!16s%2Fg%2F11kq4zmy91?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D",
        },
        {
            title: "Thuyền Quán",
            address: "194 Xuân Diệu, Phường Quy Nhơn, tỉnh Gia Lai",
            hours: "09:00 AM - 12:00 PM",
            phone: "+039 2818 8285",
            map: "https://www.google.com/maps/place/194+Xu%C3%A2n+Di%E1%BB%87u,+Tr%E1%BA%A7n+Ph%C3%BA,+Quy+Nh%C6%A1n,+B%C3%ACnh+%C4%90%E1%BB%8Bnh,+Vi%E1%BB%87t+Nam/@13.7681663,109.2282249,855m/data=!3m2!1e3!4b1!4m6!3m5!1s0x316f6c895f264d8f:0x9abe74855d59ce2e!8m2!3d13.7681663!4d109.2307998!16s%2Fg%2F11kq4zmy91?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D",
        },
        {
            title: "Thuyền Quán",
            address: "194 Xuân Diệu, Phường Quy Nhơn, tỉnh Gia Lai",
            hours: "09:00 AM - 12:00 PM",
            phone: "+039 2818 8285",
            map: "https://www.google.com/maps/place/194+Xu%C3%A2n+Di%E1%BB%87u,+Tr%E1%BA%A7n+Ph%C3%BA,+Quy+Nh%C6%A1n,+B%C3%ACnh+%C4%90%E1%BB%8Bnh,+Vi%E1%BB%87t+Nam/@13.7681663,109.2282249,855m/data=!3m2!1e3!4b1!4m6!3m5!1s0x316f6c895f264d8f:0x9abe74855d59ce2e!8m2!3d13.7681663!4d109.2307998!16s%2Fg%2F11kq4zmy91?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D",
    
        },
    ];

    return (
        <footer>
            <div className="bg-red-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                        {locations.map((loc) => (
                            <div key={loc.title} className="p-4 bg-red-500 rounded shadow-inner">
                                <h3 className="text-xl font-semibold mb-2">{loc.title}</h3>
                                <p className="text-sm opacity-90">{loc.address}</p>
                                <p className="text-sm opacity-80 mt-1">Hours: {loc.hours}</p>
                                <p className="text-sm opacity-90 mt-2">Phone: <a className="underline" href={`tel:${loc.phone}`}>{loc.phone}</a></p>
                                <p className="mt-3">
                                    <a
                                        className="inline-block bg-white text-red-600 px-3 py-1 rounded hover:underline"
                                        href={loc.map}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Click to View Google Map
                                    </a>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm">
                    <span>Copyright © {year} | Shaheen Uddin Ahmad</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
