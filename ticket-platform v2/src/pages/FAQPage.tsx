import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Search, 
  HelpCircle, 
  Ticket, 
  CreditCard, 
  Calendar, 
  Users, 
  ArrowRight, 
  MessageSquare, 
  Phone,
  RefreshCw,
  Lock,
  Map,
  Mail
} from 'lucide-react';

const FAQPage: React.FC = () => {
  // Aktif kategori state'i
  const [activeCategory, setActiveCategory] = useState('all');
  // Arama terimi state'i
  const [searchTerm, setSearchTerm] = useState('');
  // Sayfaya scroll edildiğinde sticky header için state
  const [isScrolled, setIsScrolled] = useState(false);

  // Tüm kategoriler ve içerikler
  const categories = [
    { id: 'all', name: 'Tümü', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'tickets', name: 'Biletler', icon: <Ticket className="w-5 h-5" /> },
    { id: 'payment', name: 'Ödeme', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'events', name: 'Etkinlikler', icon: <Calendar className="w-5 h-5" /> },
    { id: 'account', name: 'Hesap', icon: <Users className="w-5 h-5" /> },
    { id: 'refund', name: 'İade ve Değişim', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'security', name: 'Güvenlik', icon: <Lock className="w-5 h-5" /> },
    { id: 'location', name: 'Konum', icon: <Map className="w-5 h-5" /> },
  ];

  // SSS içeriği
  const faqItems = [
    {
      id: 1,
      question: 'Bilet satın aldıktan sonra ne yapmalıyım?',
      answer: 'Bilet satın aldığınızda, bilet bilgileriniz kayıtlı e-posta adresinize otomatik olarak gönderilecektir. Ayrıca "Biletlerim" sayfasında tüm biletlerinizi görüntüleyebilir ve indirebilirsiniz. Etkinlik günü için dijital biletin telefonda gösterilmesi veya çıktısının alınması yeterlidir.',
      category: 'tickets',
      popular: true
    },
    {
      id: 2,
      question: 'Etkinlik ertelenirse ne olur?',
      answer: 'Bir etkinlik ertelendiğinde, otomatik olarak bilgilendirilirsiniz. Biletiniz yeni tarih için geçerli olacaktır. Yeni tarihe katılamayacaksanız, etkinliğin iptali için belirtilen süre içerisinde iade talebinde bulunabilirsiniz.',
      category: 'events',
      popular: true
    },
    {
      id: 3,
      question: 'Kredi kartı ödemesinde sorun yaşıyorum, ne yapmalıyım?',
      answer: 'Ödeme sırasında sorun yaşıyorsanız: 1) İnternet bağlantınızı kontrol edin, 2) Farklı bir tarayıcı deneyin, 3) Kredi kartı bilgilerinizin doğruluğunu kontrol edin, 4) Kartınızın online ödemelere açık olduğundan emin olun. Sorun devam ederse müşteri hizmetleriyle iletişime geçebilirsiniz.',
      category: 'payment',
      popular: false
    },
    {
      id: 4,
      question: 'Biletimi başkasına devredebilir miyim?',
      answer: 'Evet, çoğu etkinlik için bilet devri mümkündür. "Biletlerim" sayfasından ilgili bileti seçip "Bilet Devret" seçeneğini kullanarak, biletin devredileceği kişinin e-posta adresini girmeniz yeterlidir. Bazı özel etkinliklerde bilet devri kısıtlanabilir.',
      category: 'tickets',
      popular: true
    },
    {
      id: 5,
      question: 'Etkinlik iptal edilirse bilet ücretim iade edilir mi?',
      answer: 'Evet, etkinlik organizatörü tarafından iptal edilen etkinlikler için bilet ücretiniz, satın alım yönteminize bağlı olarak otomatik olarak iade edilir. Kredi kartı ödemelerinde iade işlemi genellikle 7-14 iş günü içinde gerçekleşmektedir.',
      category: 'refund',
      popular: true
    },
    {
      id: 6,
      question: 'Şifremi unuttum, ne yapmalıyım?',
      answer: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısını tıklayarak, kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz. E-postayı alamadıysanız, spam klasörünü kontrol edin veya müşteri hizmetleriyle iletişime geçin.',
      category: 'account',
      popular: false
    },
    {
      id: 7,
      question: 'Eventify uygulamasını nasıl indirebilirim?',
      answer: 'Eventify uygulamasını iOS cihazlar için App Store\'dan, Android cihazlar için Google Play Store\'dan ücretsiz olarak indirebilirsiniz. Uygulama üzerinden hesap oluşturabilir veya mevcut hesabınızla giriş yapabilirsiniz.',
      category: 'account',
      popular: false
    },
    {
      id: 8,
      question: 'Hangi ödeme yöntemleri kabul ediliyor?',
      answer: 'Eventify\'da kredi kartı, banka kartı, havale/EFT, Apple Pay, Google Pay ve kapıda ödeme (seçili etkinlikler için) yöntemlerini kullanabilirsiniz. Tüm ödemeler güvenli ödeme altyapımız üzerinden gerçekleştirilmektedir.',
      category: 'payment',
      popular: true
    },
    {
      id: 9,
      question: 'Etkinlik yerine nasıl ulaşabilirim?',
      answer: 'Etkinlik detay sayfasında, etkinliğin gerçekleşeceği mekânın tam adresi ve konum bilgisi yer almaktadır. "Yol Tarifi Al" butonunu kullanarak Google Maps veya Apple Maps üzerinden etkinlik yerine yol tarifi alabilirsiniz.',
      category: 'location',
      popular: false
    },
    {
      id: 10,
      question: 'Bilet iadesini nasıl talep edebilirim?',
      answer: 'Bilet iadesi için "Biletlerim" sayfasından ilgili bileti seçip "İade Talep Et" butonuna tıklayabilirsiniz. Etkinlik koşullarına göre iade politikası değişiklik gösterebilir. Genel olarak etkinlik tarihinden 48 saat öncesine kadar iade talepleri kabul edilmektedir.',
      category: 'refund',
      popular: true
    },
    {
      id: 11,
      question: 'Çevrimiçi etkinliklere nasıl katılabilirim?',
      answer: 'Çevrimiçi etkinlikler için satın aldığınız bilet sonrası, etkinliğe katılım bağlantısı e-posta adresinize gönderilecektir. Ayrıca "Biletlerim" sayfasından da etkinlik başlamadan önce bağlantıya ulaşabilirsiniz. Etkinlik başlamadan 30 dakika önce sisteme giriş yapmanızı öneririz.',
      category: 'events',
      popular: false
    },
    {
      id: 12,
      question: 'Kişisel bilgilerim güvende mi?',
      answer: 'Evet, Eventify olarak kişisel verilerinizin güvenliği bizim için önceliklidir. Tüm veriler SSL şifreleme ile korunmakta ve KVKK (Kişisel Verilerin Korunması Kanunu) düzenlemelerine uygun olarak işlenmektedir. Gizlilik Politikamızı web sitemizde inceleyebilirsiniz.',
      category: 'security',
      popular: false
    },
    {
      id: 13,
      question: 'Bilet fiyatları neden değişiyor?',
      answer: 'Bilet fiyatları, etkinlik organizatörleri tarafından belirlenir ve talebe göre değişiklik gösterebilir. Erken dönem biletleri genellikle daha uygun fiyatlıdır. Ayrıca öğrenci, çocuk, 65 yaş üstü gibi özel gruplar için indirimli biletler sunulabilir.',
      category: 'tickets',
      popular: false
    },
    {
      id: 14,
      question: 'İndirim kodunu nasıl kullanabilirim?',
      answer: 'İndirim kodunuzu ödeme sayfasında "İndirim Kodu" alanına girebilirsiniz. Kod geçerliyse, indirim tutarı otomatik olarak toplam tutardan düşülecektir. İndirim kodları genellikle belirli bir süre için geçerlidir ve bazı etkinlikler için kullanılamayabilir.',
      category: 'payment',
      popular: false
    },
    {
      id: 15,
      question: 'Profil bilgilerimi nasıl güncelleyebilirim?',
      answer: 'Profil bilgilerinizi güncellemek için hesabınıza giriş yaptıktan sonra "Profil" sayfasına gidin. "Düzenle" butonuna tıklayarak ad, soyad, e-posta, telefon numarası gibi bilgilerinizi güncelleyebilirsiniz. Güvenlik nedeniyle e-posta adresinizi değiştirdiğinizde doğrulama gerekebilir.',
      category: 'account',
      popular: false
    },
    {
      id: 16,
      question: 'Etkinlik bildirimlerini nasıl açıp kapatabilirim?',
      answer: 'Bildirim tercihlerinizi "Profil > Ayarlar > Bildirimler" sayfasından yönetebilirsiniz. Bu sayfada e-posta bildirimleri, SMS bildirimleri, uygulama bildirimleri ve özel etkinlik kategorileri için bildirim tercihlerinizi ayarlayabilirsiniz.',
      category: 'account',
      popular: false
    },
    {
      id: 17,
      question: 'Grup biletleri için indirim var mı?',
      answer: 'Birçok etkinlik için 10 veya daha fazla kişilik grup biletlerinde indirim uygulanmaktadır. Grup indirimleri için etkinlik sayfasındaki "Grup Rezervasyonu" seçeneğini kullanabilir veya müşteri hizmetleriyle iletişime geçebilirsiniz.',
      category: 'tickets',
      popular: false
    },
    {
      id: 18,
      question: 'Etkinlik için yaş sınırı var mı?',
      answer: 'Etkinliklerin yaş sınırları farklılık gösterebilir. Her etkinliğin detay sayfasında yaş sınırı bilgisi yer almaktadır. Bazı etkinlikler için 18 yaş sınırı, kimlik kontrolü veya ebeveyn refakati gerekebilir. Lütfen bilet satın almadan önce bu bilgiyi kontrol edin.',
      category: 'events',
      popular: false
    },
    {
      id: 19,
      question: 'Fatura bilgilerimi nasıl güncelleyebilirim?',
      answer: 'Fatura bilgilerinizi güncellemek için "Profil > Fatura Bilgileri" sayfasını ziyaret edebilirsiniz. Buradan bireysel veya kurumsal fatura bilgilerinizi düzenleyebilir, yeni adresler ekleyebilirsiniz. Bilet satın alırken de farklı fatura bilgileri girebilirsiniz.',
      category: 'payment',
      popular: false
    },
    {
      id: 20,
      question: 'Uygulamada takip ettiğim etkinlikler ne işe yarıyor?',
      answer: 'Takip ettiğiniz etkinlikler, ilgilendiğiniz ancak henüz bilet satın almadığınız etkinliklerdir. Bu etkinlikler için fiyat değişiklikleri, yeni bilet satışları veya etkinlik bilgileri güncellendiğinde bildirim alabilirsiniz. "Takip Ettiklerim" sayfasından tüm bu etkinlikleri görüntüleyebilirsiniz.',
      category: 'events',
      popular: false
    }
  ];

  // Scroll olayını dinle
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Aranan veya filtrelenen SSS öğelerini getir
  const getFilteredFAQs = () => {
    let filtered = faqItems;
    
    // Kategori filtresi
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Arama filtresi
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.question.toLowerCase().includes(term) || 
          item.answer.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  // Popüler SSS öğelerini getir
  const getPopularFAQs = () => {
    return faqItems.filter(item => item.popular);
  };

  // Filtrelenmiş SSS'ler
  const filteredFAQs = getFilteredFAQs();
  // Popüler SSS'ler
  const popularFAQs = getPopularFAQs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-24 px-4">
        <div className="absolute inset-0 mix-blend-multiply opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="text-[#d4ff00]">Sıkça Sorulan</span> Sorular
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Eventify hakkında merak ettiğiniz tüm soruların cevaplarını burada bulabilirsiniz. 
              Hala yanıtını bulamadığınız bir soru mu var? Bizimle iletişime geçin.
            </p>
            
            {/* Arama Kutusu */}
            <div className="relative max-w-xl mx-auto mt-10">
              <div className="flex items-center p-2 bg-gray-800/50 backdrop-blur-sm rounded-full">
                <div className="flex-grow flex items-center bg-white rounded-full p-2">
                  <Search className="w-5 h-5 text-gray-400 ml-2 mr-1" />
                  <input 
                    type="text" 
                    placeholder="Sorunuzu arayın..." 
                    className="bg-transparent border-none outline-none flex-grow text-gray-800 py-2 px-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button className="ml-2 bg-[#d4ff00] text-gray-900 font-medium px-6 py-3 rounded-full hover:bg-white transition-colors">
                  Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Kategori Bar - Mobil için tab, desktop için sticky header */}
      <div className={`sticky top-0 z-30 bg-white shadow-md transform transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 py-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full flex items-center ${
                    activeCategory === category.id 
                      ? 'bg-[#d4ff00] text-gray-900 font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Sonuç Bildirimi */}
        {searchTerm && (
          <div className="mb-8">
            <p className="text-lg text-gray-700">
              "{searchTerm}" için <span className="font-medium">{filteredFAQs.length}</span> sonuç bulundu
            </p>
          </div>
        )}
        
        {/* Popüler Sorular Bölümü - Sadece arama yapılmadığında göster */}
        {!searchTerm && activeCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-[#d4ff00] flex items-center justify-center rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Popüler Sorular
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularFAQs.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{item.answer}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {categories.find(c => c.id === item.category)?.name}
                    </span>
                    <button className="flex items-center text-[#d4ff00] font-medium text-sm">
                      Detay
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Ana SSS Listesi */}
        <div className={`mb-12 ${!searchTerm && activeCategory === 'all' ? 'mt-12' : ''}`}>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            {activeCategory !== 'all' ? (
              <>
                <span className="w-8 h-8 bg-[#d4ff00] flex items-center justify-center rounded-full mr-3">
                  {categories.find(c => c.id === activeCategory)?.icon}
                </span>
                {categories.find(c => c.id === activeCategory)?.name} ile İlgili Sorular
              </>
            ) : (
              <>
                <span className="w-8 h-8 bg-[#d4ff00] flex items-center justify-center rounded-full mr-3">
                  <HelpCircle className="h-5 w-5 text-gray-900" />
                </span>
                Tüm Sorular
              </>
            )}
          </h2>
          
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-600 mb-6">
                Aramanız veya seçtiğiniz kategori için sonuç bulunamadı. Lütfen farklı anahtar kelimeler deneyin veya tüm kategorilere göz atın.
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                className="px-6 py-2 bg-[#d4ff00] text-gray-900 font-medium rounded-full hover:bg-[#c4ef00] transition-colors"
              >
                Tüm Soruları Göster
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <div className="flex items-start">
                        <span className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center mr-4 mt-0.5 group-open:bg-[#d4ff00]/10 transition-colors">
                          <HelpCircle className="w-4 h-4 text-gray-500 group-open:text-[#d4ff00] transition-colors" />
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 group-open:text-[#d4ff00] transition-colors">{item.question}</h3>
                      </div>
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 group-open:bg-[#d4ff00] group-open:rotate-90 transition-all">
                        <ChevronRight className="w-5 h-5 group-open:text-white transition-colors" />
                      </span>
                    </summary>
                    <div className="p-6 pt-0 border-t border-gray-100 pl-20">
                      <p className="text-gray-600 mb-4">{item.answer}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {categories.find(c => c.id === item.category)?.name}
                        </span>
                        <button className="text-[#d4ff00] text-sm font-medium flex items-center">
                          Bu yanıt yardımcı oldu mu?
                        </button>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Hala Sorularınız Var Mı? Bölümü */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Hala <span className="text-[#d4ff00]">Sorularınız</span> Mı Var?
              </h2>
              <p className="text-gray-300 mb-6">
                Yanıtını bulamadığınız sorular için müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyacaktır. 
                Bize e-posta gönderin, formu doldurun veya doğrudan arayın.
              </p>
              <div className="flex flex-col space-y-4">
                <a href="mailto:destek@eventify.com" className="flex items-center text-white hover:text-[#d4ff00] transition-colors">
                  <Mail className="w-5 h-5 mr-3" />
                  <span className="underline">destek@eventify.com</span>
                </a>
                <a href="tel:+908501234567" className="flex items-center text-white hover:text-[#d4ff00] transition-colors">
                  <Phone className="w-5 h-5 mr-3" />
                  <span className="underline">0850 123 45 67</span>
                </a>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <button className="px-8 py-4 bg-[#d4ff00] text-gray-900 font-bold rounded-full hover:bg-white transition-colors flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                İletişim Formu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 