import React from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
import { branchLocations } from "../../constants/branchLocations";

const heroImage = "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1600&q=80";

const ContactPage: React.FC = () => {
    return (
        <div className="bg-[#FFF8F3] text-slate-900">
            {/* Hero */}
            <section className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
                <img src={heroImage} alt="Fresh ingredients" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/70" />
                <div className="relative max-w-4xl text-center text-white px-4 py-16">
                    <p className="uppercase tracking-[0.3em] text-sm">Contact Us</p>
                    <h1 className="text-4xl md:text-5xl font-semibold mt-4">Luôn sẵn sàng lắng nghe bạn</h1>
                    <p className="mt-6 text-base md:text-lg text-slate-200">
                        Liên hệ ngay để đặt bàn, tổ chức sự kiện hoặc hợp tác. Đội ngũ hỗ trợ của chúng tôi trực 24/7 để phản hồi nhanh chóng.
                    </p>
                </div>
            </section>

            {/* Contact block */}
            <section className="max-w-6xl mx-auto px-4 -mt-14 relative z-10">
                <div className="grid gap-8 rounded-3xl bg-white p-10 shadow-2xl md:grid-cols-2">
                    <div className="space-y-8">
                        <div>
                            <p className="text-xs tracking-[0.4em] text-red-600 uppercase">Address</p>
                            <h3 className="text-2xl font-semibold mt-2">28 Seventh Avenue, New York, 10014</h3>
                            <div className="mt-6 space-y-4 text-slate-600">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"><FiPhone /></span>
                                    <span>+880 1630 225 015</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"><FiMail /></span>
                                    <span>resturents@gmail.com</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"><FiMapPin /></span>
                                    <span>New York City, gần ga 14 Street Station</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs tracking-[0.4em] text-red-600 uppercase">Working Hours</p>
                            <h3 className="text-2xl font-semibold mt-2">7:30 am to 9:30 pm on Weekdays</h3>
                            <div className="mt-4 flex items-center gap-3 text-slate-600">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"><FiClock /></span>
                                <span>Chúng tôi phục vụ xuyên suốt cuối tuần & lễ tết theo khung giờ linh hoạt.</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs tracking-[0.4em] text-red-600 uppercase">Follow Us</p>
                            <div className="mt-3 flex gap-4 text-xl text-slate-500">
                                {[FiTwitter, FiFacebook, FiInstagram, FiLinkedin].map((Icon, index) => (
                                    <a key={`social-${index}`} href="#" className="hover:text-red-600 transition" aria-label="Social link">
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-lg">
                        <iframe
                            title="Restaurant map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.887087709646!2d-74.003941!3d40.7345739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25990f8a74bb5%3A0xeb7bdb1113a793b6!2s7th%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                            width="100%"
                            height="380"
                            loading="lazy"
                            className="border-0"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>

            {/* Branch */}
            <section className="max-w-5xl mx-auto px-4 py-16 text-center space-y-8">
                <p className="uppercase text-sm tracking-[0.4em] text-red-600">Our Branch</p>
                <h3 className="text-3xl font-semibold">Gặp gỡ chúng tôi tại các thành phố</h3>
                <div className="grid gap-8 md:grid-cols-3">
                    {branchLocations.map(branch => (
                        <div key={branch.name} className="rounded-3xl border border-red-100 bg-white p-6 text-left shadow-xl">
                            <h4 className="text-xl font-semibold text-red-600">{branch.name}</h4>
                            <p className="mt-3 text-sm text-slate-600">{branch.address}</p>
                            <div className="mt-4 text-sm text-slate-600 space-y-1">
                                <div className="flex items-center gap-2"><FiClock className="text-red-500" /> {branch.hours}</div>
                                <div className="flex items-center gap-2"><FiPhone className="text-red-500" /> {branch.phone}</div>
                            </div>
                            <a href={branch.mapLink} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-red-600 hover:text-red-700">
                                Click to View Google Map
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ribbon */}
            <section className="bg-red-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12 grid gap-6 md:grid-cols-3">
                    {branchLocations.map(branch => (
                        <div key={`${branch.name}-ribbon`} className="rounded-2xl bg-red-500/30 p-6 space-y-3">
                            <h4 className="text-xl font-semibold">{branch.name}</h4>
                            <p className="text-sm">{branch.address}</p>
                            <div className="text-sm">
                                <div>{branch.hours}</div>
                                <div>{branch.phone}</div>
                            </div>
                            <a href={branch.mapLink} target="_blank" rel="noreferrer" className="inline-block text-sm font-semibold text-yellow-100 hover:text-white">
                                Click to View Google Map
                            </a>
                        </div>
                    ))}
                </div>
                <p className="text-center text-white/80 pb-6 text-sm">Copyright © 2025 | Shaheen Uddin Ahmad</p>
            </section>
        </div>
    );
};

export default ContactPage;
