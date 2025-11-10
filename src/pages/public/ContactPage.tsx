import React from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
const heroImage = "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1600&q=80";

const ContactPage: React.FC = () => {
    return (
        <div className="bg-[#FFF8F3] text-slate-900">


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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.370670663887!2d109.22822491537805!3d13.768166290256333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6c895f264d8f%3A0x9abe74855d59ce2e!2s194%20Xu%C3%A2n%20Di%E1%BB%87u%2C%20Tr%E1%BA%A7n%20Ph%C3%BA%2C%20Quy%20Nh%C6%A1n%2C%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1sen!2s!4v1699648141234!5m2!1sen!2s"
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
        </div>
    );
};

export default ContactPage;
