import React from 'react';
import { 
  Briefcase, 
  Users, 
  Clock, 
  MapPin, 
  Heart, 
  ChevronRight,
  Search,
  ArrowRight,
  Star,
  CheckCircle,
  Calendar,
  Building,
  Zap,
  Send
} from 'lucide-react';

const CareerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative py-24 md:py-32 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute inset-0 transform rotate-12 scale-150">
            <div className="grid grid-cols-10 grid-rows-10 gap-1 h-full w-full">
              {Array.from({ length: 100 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-[#d4ff00]"
                  style={{ opacity: Math.random() * 0.5 + 0.2 }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-[#d4ff00]/20 px-3 py-1 text-sm text-[#d4ff00] mb-6">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>Kariyer Fırsatları</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-[#d4ff00]">Eventify'da</span> Kariyerinizi Keşfedin
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Etkinlik endüstrisini dönüştüren ekibimizin bir parçası olun. 
                İnovasyon, tutku ve çeşitlilikle dolu bir kültürde birlikte büyüyelim.
              </p>
              <a 
                href="#open-positions" 
                className="inline-flex items-center px-8 py-4 rounded-full bg-[#d4ff00] text-gray-900 font-bold text-lg hover:bg-white transition-colors group"
              >
                Açık Pozisyonlar
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="relative hidden md:block">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Eventify Ekibi" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#d4ff00] flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Harika Bir Kültür</h3>
                    <p className="text-sm text-gray-500">100+ mutlu çalışan</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${(i + 1) * 20}.jpg`} 
                        alt="Takım üyesi" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#d4ff00] flex items-center justify-center text-xs font-bold">
                    +95
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-gray-900">Neden </span>
              <span className="text-[#d4ff00]">Eventify</span>
              <span className="text-gray-900">?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eventify'da çalışanlarımız en değerli varlığımızdır. İnovasyonu teşvik eden, 
              kişisel gelişimi destekleyen ve eğlenceli bir çalışma ortamı sunuyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8 text-[#d4ff00]" />,
                title: "Çalışan Odaklı Kültür",
                description: "Çalışanlarımızın mutluluğu ve iş-yaşam dengesi bizim için önceliklidir. Esnek çalışma saatleri ve uzaktan çalışma imkanı sunuyoruz."
              },
              {
                icon: <Zap className="w-8 h-8 text-[#d4ff00]" />,
                title: "Sürekli Gelişim",
                description: "Sürekli öğrenme ve gelişim için eğitim programları, konferanslar ve sertifikalar için destek sağlıyoruz."
              },
              {
                icon: <Building className="w-8 h-8 text-[#d4ff00]" />,
                title: "Etki Yaratın",
                description: "Milyonlarca kullanıcıyı etkileyen projelerde çalışarak gerçek bir fark yaratma şansına sahip olun."
              },
              {
                icon: <Star className="w-8 h-8 text-[#d4ff00]" />,
                title: "Rekabetçi Ücretler",
                description: "Piyasa standartlarının üzerinde ücret ve kapsamlı yan haklar paketi sunuyoruz."
              },
              {
                icon: <Calendar className="w-8 h-8 text-[#d4ff00]" />,
                title: "Etkinlik Avantajları",
                description: "Ücretsiz ve indirimli etkinlik biletleri ile kültürel etkinliklere erişim sağlıyoruz."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-[#d4ff00]" />,
                title: "Sağlık ve Mutluluk",
                description: "Kapsamlı sağlık sigortası, spor salonu üyeliği ve wellness programları ile sağlıklı bir yaşam destekliyoruz."
              }
            ].map((item, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-[#d4ff00]/10 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="py-24 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span>Çalışanlarımız </span>
              <span className="text-[#d4ff00]">Diyor ki</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Eventify ailesinin bir parçası olmak nasıl bir deneyim? 
              Ekip arkadaşlarımızdan birinci ağızdan dinleyin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "Eventify'da çalışmak, her gün yeni bir şeyler öğrenme fırsatı sunuyor. Hızlı büyüyen bir ekibin parçası olmak ve kullanıcılarımızın hayatına dokunmak inanılmaz tatmin edici.",
                name: "Merve Yıldız",
                role: "Frontend Geliştirici",
                years: "2 yıldır Eventify'da",
                image: "https://randomuser.me/api/portraits/women/33.jpg"
              },
              {
                quote: "4 yıl önce stajyer olarak başladığım Eventify'da bugün ekip lideri olarak çalışıyorum. Burada yenilikçi fikirlerinizi hayata geçirmeniz için tüm desteği alıyorsunuz.",
                name: "Kerem Aydın",
                role: "Ürün Yöneticisi",
                years: "4 yıldır Eventify'da",
                image: "https://randomuser.me/api/portraits/men/52.jpg"
              },
              {
                quote: "Eventify'da en sevdiğim şey çeşitlilik. Farklı kültürlerden ve alanlardan insanlarla çalışmanın getirdiği perspektif zenginliğine bayılıyorum.",
                name: "Zeynep Kaya",
                role: "Müşteri Deneyimi Uzmanı",
                years: "1.5 yıldır Eventify'da",
                image: "https://randomuser.me/api/portraits/women/65.jpg"
              },
              {
                quote: "Teknoloji ekibinde çalışarak Türkiye'nin en büyük etkinlik platformunu milyonlarca kullanıcı için geliştirmek hem heyecan verici hem de çok öğretici.",
                name: "Burak Demir",
                role: "Yazılım Mimarı",
                years: "3 yıldır Eventify'da",
                image: "https://randomuser.me/api/portraits/men/36.jpg"
              }
            ].map((item, index) => (
              <div key={index} className="p-8 bg-gray-800 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <p className="text-gray-300 mb-6 relative">
                  <span className="absolute -top-4 -left-2 text-5xl text-[#d4ff00]">"</span>
                  {item.quote}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-[#d4ff00] text-sm">{item.role}</p>
                    <p className="text-gray-400 text-xs">{item.years}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Open Positions */}
      <div id="open-positions" className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-gray-900">Açık </span>
              <span className="text-[#d4ff00]">Pozisyonlar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Yetenek ve tutkularınızla ekibimize katılın. Aşağıdaki pozisyonlardan size uygun olanı bulun.
            </p>
            
            <div className="max-w-xl mx-auto relative mb-12">
              <div className="flex items-center p-2 bg-gray-100 rounded-full">
                <div className="flex-grow flex items-center bg-white rounded-full p-3 shadow-sm">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Pozisyon ara..." 
                    className="bg-transparent border-none outline-none flex-grow text-gray-800"
                  />
                </div>
                <button className="ml-2 bg-[#d4ff00] text-gray-900 font-medium px-6 py-3 rounded-full hover:bg-[#c2ee00] transition-colors">
                  Ara
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {[
              {
                title: "Senior Frontend Geliştirici",
                department: "Mühendislik",
                location: "İstanbul (Hibrit)",
                type: "Tam Zamanlı",
                responsibilities: [
                  "Modern web teknolojileri ile kullanıcı arayüzleri geliştirmek",
                  "Frontend mimarisini tasarlamak ve kodlamak",
                  "Performans optimizasyonu ve kod kalitesini artırmak"
                ]
              },
              {
                title: "UX/UI Tasarımcı",
                department: "Tasarım",
                location: "İstanbul (Hibrit)",
                type: "Tam Zamanlı",
                responsibilities: [
                  "Kullanıcı merkezli arayüz tasarımları oluşturmak",
                  "Kullanıcı deneyimi araştırmaları yapmak",
                  "Tasarım sistemini geliştirmek ve belgelemek"
                ]
              },
              {
                title: "Ürün Yöneticisi",
                department: "Ürün",
                location: "İstanbul veya Uzaktan",
                type: "Tam Zamanlı",
                responsibilities: [
                  "Ürün yol haritasını planlamak ve yönetmek",
                  "Kullanıcı geri bildirimlerini analiz etmek",
                  "Farklı ekiplerle koordinasyon sağlamak"
                ]
              },
              {
                title: "Veri Analisti",
                department: "Veri",
                location: "İstanbul veya Ankara",
                type: "Tam Zamanlı",
                responsibilities: [
                  "Kullanıcı davranışlarını analiz etmek",
                  "Veri odaklı iç görüler sunmak",
                  "Analiz araçları ve raporlama sistemleri geliştirmek"
                ]
              },
              {
                title: "Müşteri Destek Uzmanı",
                department: "Müşteri İlişkileri",
                location: "İstanbul / Ankara / İzmir",
                type: "Tam Zamanlı / Yarı Zamanlı",
                responsibilities: [
                  "Müşteri sorularını ve sorunlarını çözmek",
                  "Kullanıcı deneyimini iyileştirmek için öneriler sunmak",
                  "Müşteri memnuniyetini en üst düzeyde tutmak"
                ]
              }
            ].map((job, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {job.department}
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-[#d4ff00] hover:border-[#d4ff00] hover:text-gray-900 transition-colors flex items-center self-start">
                    Başvur
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
                
                <div className="mt-6 space-y-2">
                  <p className="font-medium text-gray-700">Sorumluluklar:</p>
                  <ul className="space-y-1">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-[#d4ff00] mt-1">•</span>
                        <span className="text-gray-600">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Aramızda görmek istediğiniz pozisyon listede yok mu? 
              CV'nizi bize gönderin, sizin için uygun bir pozisyon olduğunda iletişime geçelim.
            </p>
            <button className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-[#d4ff00] hover:text-gray-900 transition-colors font-medium inline-flex items-center">
              CV Gönder
              <Send className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Application Steps */}
      <div className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-gray-900">Başvuru </span>
              <span className="text-[#d4ff00]">Süreci</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eventify'a başvuru sürecinde sizi neler bekliyor? 
              İşte kariyer yolculuğunuzdaki adımlar.
            </p>
          </div>
          
          <div className="relative">
            {/* Connected Line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-200 hidden md:block"></div>
            
            <div className="space-y-12 relative">
              {[
                {
                  step: 1,
                  title: "Başvuru",
                  description: "İlgilendiğiniz pozisyona başvurun ve CV'nizi gönderin. Başvurunuz alındığında bir onay e-postası alacaksınız."
                },
                {
                  step: 2,
                  title: "İlk Değerlendirme",
                  description: "İnsan Kaynakları ekibimiz başvurunuzu değerlendirecek ve uygun adaylar için bir ön görüşme planlanacak."
                },
                {
                  step: 3,
                  title: "Teknik Değerlendirme",
                  description: "Pozisyona bağlı olarak, teknik bilgi ve becerilerinizi değerlendirmek için bir test veya örnek çalışma istenebilir."
                },
                {
                  step: 4,
                  title: "Mülakatlar",
                  description: "İlgili departman yöneticileri ve ekip üyeleri ile bir veya birkaç görüşme yapacaksınız."
                },
                {
                  step: 5,
                  title: "Teklif",
                  description: "Tüm aşamaları başarıyla geçen adaylara iş teklifi sunulur. Teklif, maaş ve yan haklar hakkında detayları içerir."
                }
              ].map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row md:items-center gap-8 relative z-10`}>
                  <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d4ff00] text-gray-900 font-bold mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Middle Circle for Desktop */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#d4ff00] rounded-full z-20">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff00] opacity-50"></span>
                  </div>
                  
                  <div className="md:w-1/2 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 px-4 bg-[#d4ff00]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Eventify Ailesine Katılın
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-8">
              Türkiye'nin en heyecan verici etkinlik platformunda kariyer fırsatlarını keşfedin. 
              Yenilikçi, dinamik ve eğlenceli bir ekipte yerinizi alın.
            </p>
            <a 
              href="#open-positions" 
              className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-white hover:text-gray-900 transition-colors font-bold text-lg inline-block"
            >
              Açık Pozisyonları Keşfet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPage; 