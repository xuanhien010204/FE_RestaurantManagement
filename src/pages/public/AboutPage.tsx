import React from "react";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter, FiCheckCircle } from "react-icons/fi";
import { branchLocations } from "../../constants/branchLocations";

const heroImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80";
const storyImage = "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80";
const chefImage = "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80";
const celebrationImage = "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1000&q=80";

const services = [
    {
        title: "Birthday Party",
        description: "Thưởng thức bữa tiệc sinh nhật ấm cúng với menu thiết kế riêng cùng đội ngũ phục vụ tận tâm.",
    },
    {
        title: "Wedding Party",
        description: "Không gian sang trọng, món ăn đa dạng giúp ngày trọng đại của bạn trở nên đáng nhớ hơn.",
    }
];

const teamMembers = [
    {
        name: "Brian Adams",
        role: "Head Chef",
        description: "20+ năm kinh nghiệm trong ẩm thực fusion, luôn đổi mới món ăn mỗi mùa.",
        avatar: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "Jara Sloan",
        role: "Sous Chef",
        description: "Tinh tế trong từng chi tiết, đảm bảo chất lượng món ăn ở mọi chi nhánh.",
        avatar: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "Jessica Bell",
        role: "Pastry Chef",
        description: "Chuyên gia bánh ngọt với phong cách hiện đại pha lẫn truyền thống.",
        avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80"
    }
];

const AboutPage: React.FC = () => {
    return (
        <div className="bg-[#FFF8F3] text-slate-900">


            {/* Intro */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                    <p className="uppercase text-sm tracking-[0.3em] text-red-600">Since 2012</p>
                    <h2 className="text-3xl font-semibold leading-tight">Hương vị đa sắc màu cùng dịch vụ tận tâm</h2>
                    <p className="text-slate-600">
                        Nhà hàng của chúng tôi kết hợp tinh hoa ẩm thực Á - Âu với nguồn nguyên liệu địa phương theo mùa.
                        Mỗi món ăn được tạo ra với quy trình chuẩn xác, đảm bảo hương vị đồng nhất ở mọi chi nhánh.
                    </p>
                    <div className="space-y-3">
                        {["Nguyên liệu hữu cơ tuyển chọn", "Bếp trưởng quốc tế giám sát", "Menu thay đổi hàng tháng"].map(item => (
                            <div key={item} className="flex items-start gap-3">
                                <FiCheckCircle className="text-red-600 mt-1" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    <img src={storyImage} alt="Guests enjoying dinner" className="w-full h-full object-cover" />
                </div>
            </section>

            {/* Story */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <p className="uppercase text-sm tracking-[0.3em] text-red-600">Our Story</p>
                        <h3 className="text-3xl font-semibold mt-3">Hành trình kể câu chuyện bằng hương vị</h3>
                        <p className="text-slate-600 mt-4">
                            Từ những bữa ăn gia đình, chúng tôi học được rằng cảm xúc quan trọng hơn mâm cỗ. Vì vậy, đội ngũ phục vụ
                            không chỉ ghi nhớ khẩu vị khách quen mà còn gợi ý món phù hợp với từng dịp đặc biệt.
                        </p>
                        <p className="text-slate-600 mt-4">
                            Không gian của chúng tôi luôn thay đổi linh hoạt cho các buổi gặp gỡ thân mật, tiệc sinh nhật hay sự kiện doanh nghiệp.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img src={celebrationImage} alt="Story" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Chef */}
            <section className="bg-[#FFE4E3]">
                <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
                    <div>
                        <p className="uppercase text-sm tracking-[0.3em] text-red-600">Tasty and Crunchy</p>
                        <h3 className="text-3xl font-semibold">Our Chef</h3>
                        <p className="text-slate-700 mt-4">
                            Chef Brian dẫn dắt đội ngũ sáng tạo hơn 120 món ăn đặc trưng. Mỗi mùa, anh cùng cộng sự lại thử nghiệm
                            những gia vị mới, kết hợp kỹ thuật hiện đại với phương pháp nấu truyền thống.
                        </p>
                        <button className="mt-6 inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-red-700 transition">
                            View Our Full Menu
                        </button>
                    </div>
                    <div className="relative">
                        <img src={chefImage} alt="Chef" className="w-full rounded-3xl border-4 border-white shadow-2xl object-cover" />
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="max-w-5xl mx-auto px-4 py-16 text-center">
                <p className="uppercase text-sm tracking-[0.3em] text-red-600">Special Service</p>
                <h3 className="text-3xl font-semibold mt-3">Khoảnh khắc đáng nhớ tại nhà hàng</h3>
                <div className="mt-10 grid md:grid-cols-2 gap-8">
                    {services.map(service => (
                        <div key={service.title} className="rounded-2xl border border-red-100 bg-white p-8 shadow hover:shadow-lg transition">
                            <h4 className="text-xl font-semibold text-red-600">{service.title}</h4>
                            <p className="text-slate-600 mt-4">{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="bg-white">
                <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                    <p className="uppercase text-sm tracking-[0.3em] text-red-600">Our Team</p>
                    <h3 className="text-3xl font-semibold mt-3">Những nghệ nhân đứng sau căn bếp</h3>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {teamMembers.map(member => (
                            <div key={member.name} className="rounded-3xl border border-slate-100 p-8 shadow-lg hover:-translate-y-2 transition bg-[#FFF8F3]">
                                <img src={member.avatar} alt={member.name} className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" />
                                <h4 className="mt-6 text-xl font-semibold">{member.name}</h4>
                                <p className="text-red-600 font-medium">{member.role}</p>
                                <p className="text-sm text-slate-600 mt-3">{member.description}</p>
                                <div className="mt-4 flex justify-center gap-4 text-slate-500">
                                    {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, index) => (
                                        <a key={`${member.name}-social-${index}`} href="#" aria-label="Social link" className="hover:text-red-600 transition">
                                            <Icon />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Hero */}
            <section className="relative min-h-[360px] flex items-center justify-center overflow-hidden">
                <img src={heroImage} alt="Restaurant table" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/70" />
                <div className="relative max-w-4xl text-center text-white px-4 py-16">
                    <p className="uppercase tracking-[0.3em] text-sm">About Us</p>
                    <h1 className="text-4xl md:text-5xl font-semibold mt-4">Kết nối vị giác, nâng tầm trải nghiệm</h1>
                    <p className="mt-6 text-base md:text-lg text-slate-200">
                        Chúng tôi bắt đầu từ một căn bếp nhỏ với đam mê phục vụ những món ăn chân thành, nay trở thành điểm hẹn của
                        những tín đồ ẩm thực muốn tận hưởng khoảnh khắc trọn vẹn bên người thân.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
