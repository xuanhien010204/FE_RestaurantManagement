import React from "react";
import logo from "../../public/images/logo.png"; // đường dẫn tới logo của bạn

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    const location = {
        title: "Thuyền Quán",
        address: "194 Xuân Diệu, Phường Quy Nhơn, tỉnh Gia Lai",
        hours: "09:00 AM - 12:00 PM",
        phone: "+039 2818 8285",
        mapEmbed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.370670663887!2d109.22822491537805!3d13.768166290256333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6c895f264d8f%3A0x9abe74855d59ce2e!2s194%20Xu%C3%A2n%20Di%E1%BB%87u%2C%20Tr%E1%BA%A7n%20Ph%C3%BA%2C%20Quy%20Nh%C6%A1n%2C%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1sen!2s!4v1699648141234!5m2!1sen!2s",
    };

    return (
        <footer className="mt-10 font-sans">
            {/* Top Footer Section */}
            <div className="bg-red-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-6 items-center md:items-start">

                    {/* Left: Info Card with Logo */}
                    <div className="w-full md:w-1/2 flex flex-col md:flex-row items-center md:items-start gap-4 bg-red-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold mb-2">{location.title}</h3>
                            <p className="text-xl mb-1">{location.address}</p>
                            <p className="text-xl mb-1">Hours: {location.hours}</p>
                            <p className="text-xl">
                                Phone:{" "}
                                <a
                                    href={`tel:${location.phone}`}
                                    className="underline hover:text-yellow-300 transition-colors duration-200"
                                >
                                    {location.phone}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Right: Google Map */}
                    <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                        <iframe
                            src={location.mapEmbed}
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe>
                    </div>

                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-slate-800 text-white text-center py-4 text-sm">
                <span>Copyright © {year} | Shaheen Uddin Ahmad</span>
            </div>
        </footer>
    );
};

export default Footer;
