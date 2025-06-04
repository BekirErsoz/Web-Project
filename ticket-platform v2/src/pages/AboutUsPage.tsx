import React, { useEffect, useRef, useState } from 'react';
import { 
  Music, 
  Users, 
  Calendar, 
  TrendingUp, 
  Globe, 
  Award, 
  Heart, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const AboutUsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('vision');
  const teamRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  
  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || '0.5';
        const yPos = -(scrollPosition * parseFloat(speed));
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };
    
    // Intersection Observer for section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.6 }
    );
    
    if (visionRef.current) observer.observe(visionRef.current);
    if (valuesRef.current) observer.observe(valuesRef.current);
    if (historyRef.current) observer.observe(historyRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section - Full screen with parallax */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 parallax" 
          data-speed="0.3"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-6 tracking-tight">
            <span className="block transform -rotate-2">Biz</span>
            <span className="block text-[#d4ff00] transform rotate-2">Eventify'ız</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            2020'den beri Türkiye'de etkinlik deneyimini değiştiriyoruz. 
            Her anınızı unutulmaz kılmak için buradayız.
          </p>
          <button 
            onClick={() => scrollToSection(visionRef)}
            className="px-8 py-4 bg-[#d4ff00] text-black text-lg font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center mx-auto group"
          >
            Keşfet
            <ChevronDown className="ml-2 w-6 h-6 group-hover:animate-bounce" />
          </button>
        </div>
      </div>
      
      {/* Sticky Side Navigation */}
      <div className="hidden lg:block fixed top-1/2 right-10 transform -translate-y-1/2 z-40">
        <ul className="space-y-6">
          {[
            { id: 'vision', label: 'Vizyonumuz', ref: visionRef },
            { id: 'values', label: 'Değerlerimiz', ref: valuesRef },
            { id: 'history', label: 'Tarihçemiz', ref: historyRef },
            { id: 'team', label: 'Ekibimiz', ref: teamRef },
            { id: 'stats', label: 'Rakamlarla Biz', ref: statsRef }
          ].map(item => (
            <li key={item.id} className="flex items-center">
              <button
                onClick={() => scrollToSection(item.ref)}
                className={`relative flex items-center group ${activeSection === item.id ? 'text-[#d4ff00]' : 'text-gray-400'}`}
              >
                <span 
                  className={`absolute right-full mr-4 h-[2px] transition-all duration-300 ${
                    activeSection === item.id ? 'w-16 bg-[#d4ff00]' : 'w-6 bg-gray-300 group-hover:w-12 group-hover:bg-gray-400'
                  }`}
                ></span>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Vision Section */}
      <section id="vision" ref={visionRef} className="py-24 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="block text-[#d4ff00]">Vizyonumuz</span>
                <span className="block">& Misyonumuz</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Eventify olarak vizyonumuz, etkinlik endüstrisini demokratikleştirmek ve herkes için erişilebilir hale getirmektir. 
                Türkiye'nin her köşesinde, her zevke ve bütçeye uygun etkinlikleri insanlarla buluşturuyoruz.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Misyonumuz, teknoloji ve inovasyonu kullanarak etkinlik keşfetme, planlama ve katılım süreçlerini mümkün olduğunca 
                kusursuz ve keyifli hale getirmektir. Her bir kullanıcımızın, her bir etkinlik için "iyi ki Eventify var" demesini hedefliyoruz.
              </p>
              
              <div className="mt-12">
                <div className="inline-flex items-center rounded-full bg-[#d4ff00]/10 py-2 pl-3 pr-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4ff00] text-black">
                    <Music className="h-4 w-4" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-[#d4ff00]">6+ milyon bilet satışı</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Konser"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 z-10 w-2/3 hidden md:block">
                <div className="bg-[#d4ff00] p-6 rounded-2xl shadow-2xl">
                  <p className="text-gray-900 font-bold text-xl">"Amacımız sadece bilet satmak değil, anılar oluşturmaktır."</p>
                  <p className="text-gray-800 mt-2">— Ayşe Yılmaz, Kurucu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section id="values" ref={valuesRef} className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">
            <span className="text-gray-900">Temel </span>
            <span className="text-[#d4ff00]">Değerlerimiz</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-10 h-10 text-[#d4ff00]" />,
                title: "Kullanıcı Odaklılık",
                desc: "Kullanıcılarımızın ihtiyaçları ve istekleri her zaman önceliğimizdir. Her kararımızda kullanıcı deneyimini düşünürüz."
              },
              {
                icon: <Award className="w-10 h-10 text-[#d4ff00]" />,
                title: "Kalite",
                desc: "Her etkinlik, her deneyim ve her etkileşim için en yüksek kalite standartlarını hedefliyoruz."
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-[#d4ff00]" />,
                title: "İnovasyon",
                desc: "Sürekli gelişim ve yenilik, DNA'mızın bir parçasıdır. Etkinlik dünyasını ileriye taşımak için çalışıyoruz."
              },
              {
                icon: <Globe className="w-10 h-10 text-[#d4ff00]" />,
                title: "Sürdürülebilirlik",
                desc: "Çevresel etkimizi azaltmak ve sürdürülebilir etkinlik çözümleri sunmak için çaba sarf ediyoruz."
              },
              {
                icon: <Users className="w-10 h-10 text-[#d4ff00]" />,
                title: "Topluluk",
                desc: "İnsanları bir araya getiren etkinlikler aracılığıyla güçlü topluluklar ve bağlantılar oluşturuyoruz."
              },
              {
                icon: <Calendar className="w-10 h-10 text-[#d4ff00]" />,
                title: "Güvenilirlik",
                desc: "Kullanıcılarımız ve etkinlik ortaklarımız her zaman bize güvenebilir. Söz verdiğimizi yaparız."
              }
            ].map((value, index) => (
              <div key={index} className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white group">
                <div className="p-4 bg-gray-100 rounded-xl w-fit mb-4 group-hover:bg-[#d4ff00]/10 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* History Section - Timeline */}
      <section id="history" ref={historyRef} className="py-24 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">
            <span className="text-[#d4ff00]">Tarihçe</span>
            <span>miz</span>
          </h2>
          
          <div className="relative">
            {/* Timeline Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-700"></div>
            
            {[
              {
                year: "2020",
                title: "Kuruluş",
                desc: "Eventify, 3 arkadaşın etkinliklere erişim konusundaki zorluklara çözüm üretme vizyonuyla kuruldu.",
                image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                year: "2021",
                title: "Büyüme",
                desc: "İlk yılımızda 250.000 kullanıcıya ulaştık ve Türkiye'nin önde gelen etkinlik platformlarından biri haline geldik.",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                year: "2022",
                title: "Genişleme",
                desc: "Türkiye'nin 81 ilinde hizmet vermeye başladık ve mobil uygulamamızı 1 milyon indirilme sayısına ulaştırdık.",
                image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                year: "2023",
                title: "Yenilik",
                desc: "AR teknolojisini kullanarak sanal etkinlik turu özelliğimizi tanıttık ve teknoloji ödüllerinin sahibi olduk.",
                image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              },
              {
                year: "2024",
                title: "Liderlik",
                desc: "Türkiye'nin lider etkinlik platformu olarak, global pazarlara açılmaya hazırlanıyoruz.",
                image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              }
            ].map((item, index) => (
              <div key={index} className={`relative mb-24 flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2"></div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3 flex flex-col items-center z-10">
                  <div className="rounded-full h-8 w-8 bg-[#d4ff00] flex items-center justify-center">
                    <div className="rounded-full h-3 w-3 bg-gray-900"></div>
                  </div>
                  <div className="mt-2 px-4 py-1 rounded-full bg-[#d4ff00] text-gray-900 font-bold">
                    {item.year}
                  </div>
                </div>
                
                <div className="w-1/2 px-8">
                  <div className={`bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                    <div className="h-48 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                      <p className="text-gray-300">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section id="team" ref={teamRef} className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">
            <span className="text-gray-900">Ekip</span>
            <span className="text-[#d4ff00]">imiz</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Ayşe Yılmaz",
                role: "Kurucu & CEO",
                bio: "10+ yıllık teknoloji deneyimi ile Eventify'ı kurdu.",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Mehmet Kaya",
                role: "CTO",
                bio: "Ödüllü yazılım mimarı, kullanıcı deneyimi tutkunu.",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Zeynep Demir",
                role: "Tasarım Direktörü",
                bio: "Dünyaca ünlü tasarım stüdyolarında çalıştı.",
                image: "https://randomuser.me/api/portraits/women/68.jpg"
              },
              {
                name: "Ali Öztürk",
                role: "Pazarlama Direktörü",
                bio: "Veri odaklı pazarlama stratejileri uzmanı.",
                image: "https://randomuser.me/api/portraits/men/75.jpg"
              },
              {
                name: "Selin Akgün",
                role: "Ürün Müdürü",
                bio: "Kullanıcı merkezli ürün geliştirme uzmanı.",
                image: "https://randomuser.me/api/portraits/women/90.jpg"
              },
              {
                name: "Burak Yıldız",
                role: "Stratejik Ortaklıklar",
                bio: "20+ yıllık müzik endüstrisi deneyimine sahip.",
                image: "https://randomuser.me/api/portraits/men/29.jpg"
              },
              {
                name: "Elif Şahin",
                role: "Müşteri Deneyimi",
                bio: "Ödüllü müşteri deneyimi stratejisti.",
                image: "https://randomuser.me/api/portraits/women/33.jpg"
              },
              {
                name: "Caner Aksoy",
                role: "Finans Direktörü",
                bio: "Teknoloji startuplarında finans uzmanlığı.",
                image: "https://randomuser.me/api/portraits/men/55.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm">{member.bio}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-[#d4ff00] font-medium">{member.role}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Biz bir aile gibiyiz ve ekibimizle gurur duyuyoruz. Her gün kullanıcılarımız için en iyi deneyimi yaratmak için çalışıyoruz.
            </p>
            <button className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-[#d4ff00] hover:text-gray-900 transition-all duration-300 font-medium flex items-center mx-auto group">
              Kariyer Fırsatları
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="py-24 px-4 bg-[#d4ff00] text-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">
            <span>Rakamlarla </span>
            <span className="text-white">Eventify</span>
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "6M+", label: "Satılan Bilet" },
              { number: "10K+", label: "Etkinlik Partneri" },
              { number: "3.5M+", label: "Aktif Kullanıcı" },
              { number: "81", label: "Kapsanan İl" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-7xl font-extrabold mb-2">{stat.number}</div>
                <div className="text-xl font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-24 p-8 bg-white rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Bize Katılın</h3>
                <p className="text-gray-600 mb-6">
                  Etkinlik dünyasını birlikte dönüştürelim. Eventify ailesinin bir parçası olun ve Türkiye'nin en büyük etkinlik platformunda yerinizi alın.
                </p>
                <button className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-[#d4ff00] hover:text-gray-900 transition-all duration-300 font-medium flex items-center group">
                  Bizimle İletişime Geçin
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Office"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" 
                    alt="Team working"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Team meeting"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage; 