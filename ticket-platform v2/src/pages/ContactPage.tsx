import React, { useState } from 'react';
import {
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  Users, 
  HeadphonesIcon,
  Briefcase,
  Check,
  AlertCircle,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  ChevronRight
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [formStatus, setFormStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderimi simülasyonu
    setTimeout(() => {
      setFormStatus({
        success: true,
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
      });
      // Form verilerini sıfırla
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
      // 5 saniye sonra bildirim mesajını kaldır
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-24 px-4">
        <div className="absolute inset-0 overflow-hidden mix-blend-overlay opacity-10">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#d4ff00" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-[#d4ff00]/20 px-3 py-1 text-sm text-[#d4ff00] mb-6">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Bizimle İletişime Geçin</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Size <span className="text-[#d4ff00]">Yardımcı</span> Olmak İçin Buradayız
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Sorularınız, önerileriniz veya işbirliği fırsatları için 
              Eventify ekibi olarak her zaman size yardımcı olmaya hazırız.
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Info Section */}
      <div className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-[#d4ff00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-[#d4ff00]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Telefon</h3>
              <p className="text-gray-600 mb-2">Müşteri Hizmetleri</p>
              <p className="text-lg font-medium text-gray-900 mb-4">0850 123 45 67</p>
              <p className="text-gray-600 mb-2">Kurumsal İletişim</p>
              <p className="text-lg font-medium text-gray-900">0212 456 78 90</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-[#d4ff00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-[#d4ff00]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">E-Posta</h3>
              <p className="text-gray-600 mb-2">Genel Bilgi</p>
              <p className="text-lg font-medium text-[#d4ff00] mb-4">info@eventify.com</p>
              <p className="text-gray-600 mb-2">Destek</p>
              <p className="text-lg font-medium text-[#d4ff00]">destek@eventify.com</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center">
              <div className="w-16 h-16 bg-[#d4ff00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-[#d4ff00]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Adres</h3>
              <p className="text-gray-600 mb-2">İstanbul (Merkez)</p>
              <p className="text-lg font-medium text-gray-900 mb-4">Levent Mah. Büyükdere Cad. No:123 Şişli/İstanbul</p>
              <p className="text-gray-600 mb-2">Çalışma Saatleri</p>
              <p className="text-md font-medium text-gray-900">Hafta içi: 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Departments Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gray-900">Hangi Konuda </span>
              <span className="text-[#d4ff00]">Yardım</span>
              <span className="text-gray-900"> İstiyorsunuz?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Size en iyi hizmeti sunabilmemiz için, talebinizin türüne göre 
              farklı departmanlarımız ile iletişime geçebilirsiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <HeadphonesIcon className="w-6 h-6 text-white" />,
                title: "Müşteri Hizmetleri",
                description: "Bilet, ödeme veya hesabınızla ilgili sorularınız için",
                contact: "destek@eventify.com"
              },
              {
                icon: <Briefcase className="w-6 h-6 text-white" />,
                title: "İş Birlikleri",
                description: "Etkinliklerinizi platformumuzda yayınlamak için",
                contact: "partner@eventify.com"
              },
              {
                icon: <Users className="w-6 h-6 text-white" />,
                title: "İnsan Kaynakları",
                description: "Açık pozisyonlar ve kariyer fırsatları için",
                contact: "kariyer@eventify.com"
              }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl bg-white shadow hover:shadow-md transition-all group">
                <div className="flex">
                  <div className="w-12 h-12 rounded-lg bg-[#d4ff00] flex items-center justify-center mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <a 
                      href={`mailto:${item.contact}`} 
                      className="text-[#d4ff00] font-medium flex items-center"
                    >
                      {item.contact}
                      <Send className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Map & Form Section */}
      <div className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Bizi Ziyaret Edin</h2>
                <p className="text-gray-600">
                  Merkez ofisimiz İstanbul'un merkezinde, kolay ulaşılabilir bir konumda bulunmaktadır. 
                  Randevu alarak bizi ziyaret edebilirsiniz.
                </p>
              </div>
              
              <div className="rounded-xl overflow-hidden h-96 shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48173.53783212994!2d28.969349605468747!3d41.06307769999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a2a2c3b963%3A0x7671d1b9024a7271!2zTGV2ZW50LCDFnmnFn2xp!5e0!3m2!1str!2str!4v1645461418644!5m2!1str!2str" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy"
                  title="Eventify Ofis Lokasyonu"
                ></iframe>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Sosyal Medya</h3>
                <p className="text-gray-600 mb-4">
                  Bizi sosyal medyada takip ederek en güncel etkinlik haberleri ve kampanyalardan haberdar olabilirsiniz.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/eventify" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#d4ff00]/20 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-gray-700" />
                  </a>
                  <a 
                    href="https://twitter.com/eventify" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#d4ff00]/20 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-gray-700" />
                  </a>
                  <a 
                    href="https://facebook.com/eventify" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#d4ff00]/20 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-gray-700" />
                  </a>
                  <a 
                    href="https://youtube.com/eventify" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#d4ff00]/20 transition-colors"
                    aria-label="Youtube"
                  >
                    <Youtube className="w-5 h-5 text-gray-700" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/eventify" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#d4ff00]/20 transition-colors"
                    aria-label="Linkedin"
                  >
                    <Linkedin className="w-5 h-5 text-gray-700" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <div className="order-1 lg:order-2">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">İletişim Formu</h2>
                <p className="text-gray-600 mb-8">
                  Aşağıdaki formu doldurarak bize mesaj gönderebilirsiniz. En kısa sürede size dönüş yapacağız.
                </p>
                
                {formStatus && (
                  <div className={`p-4 rounded-lg mb-6 flex items-start ${formStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {formStatus.success ? 
                      <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /> : 
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    }
                    <p>{formStatus.message}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Adınız Soyadınız
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-[#d4ff00]"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta Adresiniz
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-[#d4ff00]"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      İletişim Konusu
                    </label>
                    <select 
                      id="type" 
                      name="type" 
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-[#d4ff00]"
                    >
                      <option value="general">Genel Bilgi</option>
                      <option value="support">Teknik Destek</option>
                      <option value="billing">Ödeme ve Fatura</option>
                      <option value="partnership">İş Birliği</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Konu Başlığı
                    </label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-[#d4ff00]"
                      placeholder="Mesajınızın konusu"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mesajınız
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-[#d4ff00]"
                      placeholder="Mesajınızı buraya yazabilirsiniz..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#d4ff00] text-gray-900 font-bold rounded-lg hover:bg-[#c4ef00] transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Mesaj Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Sıkça Sorulan <span className="text-[#d4ff00]">Sorular</span>
            </h2>
            <p className="text-lg text-gray-600">
              Bize sıkça sorulan bazı soruların yanıtlarını aşağıda bulabilirsiniz.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "İletişim formu gönderdikten sonra ne kadar sürede dönüş alırım?",
                answer: "İletişim formunuz bize ulaştıktan sonra genellikle 24 saat içinde size dönüş yapmaya çalışıyoruz. Yoğun dönemlerde bu süre en fazla 48 saate uzayabilir."
              },
              {
                question: "Ödeme sorunlarıyla ilgili en hızlı nasıl yardım alabilirim?",
                answer: "Ödeme sorunları için destek@eventify.com adresine e-posta gönderebilir veya müşteri hizmetleri hattımızı arayabilirsiniz. Acil durumlarda telefon ile iletişim en hızlı çözüm yoludur."
              },
              {
                question: "Etkinlik organizatörü olarak nasıl iş birliği yapabilirim?",
                answer: "Etkinliklerinizi platformumuzda yayınlamak için partner@eventify.com adresine etkinlik detaylarını içeren bir e-posta gönderebilirsiniz. Ekibimiz en kısa sürede sizinle iletişime geçecektir."
              },
              {
                question: "Teknik bir sorun yaşıyorum, ne yapmalıyım?",
                answer: "Teknik sorunlar için uygulamamızın sağ alt köşesindeki canlı destek butonunu kullanabilir veya destek@eventify.com adresine e-posta gönderebilirsiniz. E-postanızda sorunu detaylı bir şekilde anlatmanız ve mümkünse ekran görüntüsü eklemeniz çözüm sürecini hızlandıracaktır."
              },
              {
                question: "Bilet iade ve değişim taleplerim için kiminle iletişime geçmeliyim?",
                answer: "Bilet iade ve değişim talepleri için öncelikle ilgili etkinliğin koşullarını kontrol etmenizi öneririz. Ardından destek@eventify.com adresine bilet numaranız ve talebinizin detaylarını içeren bir e-posta gönderebilirsiniz."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 group-open:bg-[#d4ff00] group-open:rotate-180 transition-all">
                      <ChevronRight className="w-4 h-4 group-open:text-white transition-all" />
                    </span>
                  </summary>
                  <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                    <p>{item.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 px-4 bg-[#d4ff00] text-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl font-bold mb-4">
                Etkinliklerle Dolu Bir Dünya <span className="text-gray-900">Sizi Bekliyor</span>
              </h2>
              <p className="text-gray-700">
                Hemen uygulamayı indirerek binlerce etkinliği keşfedin ve 
                biletinizi birkaç tıkla satın alın. İhtiyacınız olduğunda size yardımcı olmak için buradayız.
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors">
                App Store
              </button>
              <button className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors">
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 