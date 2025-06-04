import React, { useEffect, useState } from 'react';
import { X, HelpCircle, Lock, AlertTriangle, Cookie, ArrowRight, Music, Calendar, Heart, Phone, Briefcase, Mail, FileText, MapPin, Clock, Star, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

// Modal içeriğini tanımlayan arayüz
interface HelpModalContent {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

// Modal bileşeni için props
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'faq' | 'terms' | 'privacy' | 'cookie' | 'career' | 'contact' | 'kvkk';
}

// Her modal türü için içerik tanımlamaları
const modalContents: Record<string, HelpModalContent> = {
  faq: {
    title: 'Sıkça Sorulan Sorular',
    icon: <HelpCircle className="w-6 h-6 text-[#d4ff00]" />,
    content: (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
            <span>Biletimi nasıl iptal edebilirim?</span>
          </h3>
          <p className="text-gray-600 leading-relaxed text-base pl-8">
            Bilet iptalleri etkinliğin başlama saatinden 24 saat öncesine kadar yapılabilir. 
            Hesabınıza giriş yaptıktan sonra "Biletlerim" sayfasından iptal etmek istediğiniz 
            bileti seçerek işlemi gerçekleştirebilirsiniz.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
            <span>Etkinlik ertelenirse ne olur?</span>
          </h3>
          <p className="text-gray-600 leading-relaxed text-base pl-8">
            Etkinlik ertelendiğinde, biletiniz otomatik olarak yeni tarihe geçerli olacaktır. 
            Erteleme durumunda size e-posta ile bilgilendirme yapılacaktır. Yeni tarihte katılamayacaksanız, 
            bilet iptal işlemini gerçekleştirebilirsiniz.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
            <span>Biletimi başkasına devredebilir miyim?</span>
          </h3>
          <p className="text-gray-600 leading-relaxed text-base pl-8">
            Evet, bazı etkinlikler için bilet devri mümkündür. "Biletlerim" sayfasından ilgili 
            bileti seçip "Bilet Devret" seçeneğini kullanarak e-posta adresi ile devir işlemini 
            gerçekleştirebilirsiniz.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
            <span>Bilet satın aldıktan sonra ne yapmalıyım?</span>
          </h3>
          <p className="text-gray-600 leading-relaxed text-base pl-8">
            Bilet satın aldığınızda e-posta adresinize bir onay maili gönderilecektir. 
            Etkinlik günü dijital biletinizi göstermek veya çıktısını almak için bu e-postayı 
            saklamanız önemlidir. Ayrıca "Biletlerim" sayfasından her zaman biletlerinize erişebilirsiniz.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
            <span>Ödeme yöntemleri nelerdir?</span>
          </h3>
          <p className="text-gray-600 leading-relaxed text-base pl-8">
            Kredi kartı, banka kartı, havale/EFT ve bazı etkinlikler için kapıda ödeme 
            seçeneklerini kullanabilirsiniz. Tüm ödemeler güvenli ödeme altyapımız üzerinden 
            gerçekleştirilmektedir.
          </p>
        </div>
      </div>
    )
  },
  terms: {
    title: 'Kullanım Koşulları',
    icon: <Lock className="w-6 h-6 text-[#d4ff00]" />,
    content: (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-base">
            Eventify platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. 
            Lütfen bu koşulları dikkatlice okuyunuz.
          </p>
        </div>
        
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="flex items-center justify-center bg-[#d4ff00] w-8 h-8 rounded-full mr-4 text-gray-900 font-bold text-sm">1</span>
              <span>Hizmet Kullanımı</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-base pl-12">
              Eventify, kullanıcılarına etkinlik keşfetme, bilet satın alma ve etkinlik oluşturma 
              hizmetleri sunmaktadır. Bu hizmetleri kullanırken Türkiye Cumhuriyeti yasalarına ve 
              genel ahlak kurallarına uygun davranmakla yükümlüsünüz.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="flex items-center justify-center bg-[#d4ff00] w-8 h-8 rounded-full mr-4 text-gray-900 font-bold text-sm">2</span>
              <span>Hesap Güvenliği</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-base pl-12">
              Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizin güvenliğini sağlamalı ve 
              hesabınızdan gerçekleştirilen tüm etkinliklerin sorumluluğunu üstlenmelisiniz.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="flex items-center justify-center bg-[#d4ff00] w-8 h-8 rounded-full mr-4 text-gray-900 font-bold text-sm">3</span>
              <span>Ödeme ve İadeler</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-base pl-12">
              Bilet satın alırken geçerli bir ödeme yöntemi kullanmanız gerekmektedir. İade politikamız 
              etkinliğe göre değişiklik gösterebilir. Genel olarak etkinliğin 24 saat öncesine kadar 
              iptaller kabul edilmektedir.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="flex items-center justify-center bg-[#d4ff00] w-8 h-8 rounded-full mr-4 text-gray-900 font-bold text-sm">4</span>
              <span>Fikri Mülkiyet</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-base pl-12">
              Eventify logosu, tasarım öğeleri ve içeriği fikri mülkiyet hakları kapsamında korunmaktadır. 
              Bu içeriklerin izinsiz kullanımı yasaktır.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="flex items-center justify-center bg-[#d4ff00] w-8 h-8 rounded-full mr-4 text-gray-900 font-bold text-sm">5</span>
              <span>Değişiklikler</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-base pl-12">
              Eventify, kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar. 
              Güncel koşullar için sitemizi düzenli olarak kontrol etmeniz önerilir.
            </p>
          </div>
        </div>
      </div>
    )
  },
  privacy: {
    title: 'Gizlilik Politikası',
    icon: <AlertTriangle className="w-6 h-6 text-[#d4ff00]" />,
    content: (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-base">
            Eventify olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu politika, 
            hangi verileri topladığımızı ve nasıl kullandığımızı açıklamaktadır.
          </p>
        </div>
        
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">1. Toplanan Veriler</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-8">
              Kayıt olurken ve platform kullanımınız sırasında adınız, e-posta adresiniz, 
              telefon numaranız, ödeme bilgileriniz ve lokasyon verileriniz gibi kişisel 
              bilgilerinizi topluyoruz.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">2. Veri Kullanımı</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-8">
              Topladığımız verileri hizmetlerimizi sunmak, geliştirmek, kişiselleştirmek ve 
              sizinle iletişim kurmak için kullanıyoruz. Ödeme bilgileriniz sadece ödeme 
              işlemlerini gerçekleştirmek için kullanılmaktadır.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">3. Veri Paylaşımı</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-8">
              Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. 
              Etkinlik organizatörleriyle, sadece etkinliğe katılımınız için gerekli bilgiler paylaşılır.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">4. Veri Güvenliği</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-8">
              Verilerinizi korumak için çeşitli güvenlik önlemleri almaktayız. SSL şifreleme, 
              güvenli veri depolama ve düzenli güvenlik denetimleri bunlardan bazılarıdır.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">5. Veri Saklama Süresi</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-8">
              Kişisel verileriniz, hizmetlerimizi sunmak için gerekli olduğu sürece veya 
              yasal yükümlülüklerimiz gerektirdiği sürece saklanır. Hesabınızı silmeniz 
              durumunda, verileriniz belirli bir süre sonra tamamen silinir.
            </p>
          </div>
        </div>
      </div>
    )
  },
  cookie: {
    title: 'Çerez Politikası',
    icon: <Cookie className="w-6 h-6 text-[#d4ff00]" />,
    content: (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-base">
            Bu politika, Eventify'ın web sitesinde çerezleri nasıl kullandığını açıklamaktadır.
          </p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">1. Çerez Nedir?</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Çerezler, web sitelerinin bilgisayarınızda veya mobil cihazınızda depoladığı küçük 
              metin dosyalarıdır. Bu dosyalar, siteyi kullanırken tercihlerinizi hatırlamak ve 
              site deneyiminizi geliştirmek için kullanılır.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">2. Çerez Türleri</h3>
            <div className="text-gray-600 leading-relaxed text-base space-y-3">
              <div className="flex items-start">
                <span className="w-3 h-3 bg-[#d4ff00] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <p><strong>Zorunlu Çerezler:</strong> Sitemizin düzgün çalışması için gereklidir.</p>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-[#d4ff00] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <p><strong>Analitik Çerezler:</strong> Sitemizin nasıl kullanıldığını anlamamıza yardımcı olur.</p>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-[#d4ff00] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <p><strong>Fonksiyonel Çerezler:</strong> Tercihlerinizi hatırlamak için kullanılır.</p>
              </div>
              <div className="flex items-start">
                <span className="w-3 h-3 bg-[#d4ff00] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <p><strong>Pazarlama Çerezleri:</strong> Size özel reklamlar göstermek için kullanılır.</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">3. Çerez Yönetimi</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya çerez gönderildiğinde 
              uyarı verecek şekilde ayarlayabilirsiniz. Ancak, bazı çerezleri devre dışı bırakmak 
              web sitemizdeki kullanıcı deneyiminizi etkileyebilir.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">4. Üçüncü Taraf Çerezleri</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Web sitemizde Google Analytics, Facebook Pixel gibi üçüncü taraf hizmetlerinin 
              çerezleri de kullanılmaktadır. Bu çerezler, söz konusu üçüncü tarafların gizlilik 
              politikalarına tabidir.
            </p>
          </div>
        </div>
      </div>
    )
  },
  career: {
    title: 'Kariyer Fırsatları',
    icon: <Briefcase className="w-6 h-6 text-[#d4ff00]" />,
    content: (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-base">
            Eventify olarak, etkinlik endüstrisine tutkulu ve yetenekli profesyonellerle birlikte değer katmaktan heyecan duyuyoruz. 
            Aşağıda mevcut açık pozisyonlarımızı ve Eventify'da çalışmanın avantajlarını bulabilirsiniz.
          </p>
        </div>
        
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
              <span>Açık Pozisyonlar</span>
            </h3>
            <div className="space-y-6 pl-8">
              <div className="border-l-4 border-[#d4ff00] pl-4 py-2">
                <h4 className="font-semibold text-lg">Yazılım Geliştirici (Full Stack)</h4>
                <p className="text-gray-600 mt-1">React, Node.js ve veritabanı deneyimine sahip, kullanıcı deneyimini ön planda tutan geliştiriciler arıyoruz.</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>İstanbul (Hibrit)</span>
                  <Clock className="w-4 h-4 ml-4 mr-1" />
                  <span>Tam Zamanlı</span>
                </div>
              </div>

              <div className="border-l-4 border-[#d4ff00] pl-4 py-2">
                <h4 className="font-semibold text-lg">Ürün Yöneticisi</h4>
                <p className="text-gray-600 mt-1">Etkinlik platformumuzun özelliklerini planlamak, kullanıcı geri bildirimlerini değerlendirmek ve ürün yol haritası oluşturmak için deneyimli ürün yöneticileri arıyoruz.</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>İstanbul (Hibrit)</span>
                  <Clock className="w-4 h-4 ml-4 mr-1" />
                  <span>Tam Zamanlı</span>
                </div>
              </div>

              <div className="border-l-4 border-[#d4ff00] pl-4 py-2">
                <h4 className="font-semibold text-lg">Müşteri Destek Uzmanı</h4>
                <p className="text-gray-600 mt-1">Çoklu kanallardan gelen kullanıcı sorularını yanıtlayacak, sorunları çözecek ve kullanıcı memnuniyetini en üst düzeyde tutacak müşteri destek uzmanları arıyoruz.</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Ankara / İstanbul / İzmir</span>
                  <Clock className="w-4 h-4 ml-4 mr-1" />
                  <span>Tam Zamanlı / Yarı Zamanlı</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
              <span>Eventify'da Çalışmak</span>
            </h3>
            <div className="space-y-4 pl-8">
              <div className="flex">
                <div className="bg-[#d4ff00] rounded-full p-2 mr-3 flex-shrink-0">
                  <Star className="w-4 h-4 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-medium">Esnek Çalışma Saatleri</h4>
                  <p className="text-gray-600">İş-yaşam dengesini önemsiyoruz. Hibrit çalışma modeli ve esnek saatler sunuyoruz.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-[#d4ff00] rounded-full p-2 mr-3 flex-shrink-0">
                  <Star className="w-4 h-4 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-medium">Kişisel Gelişim</h4>
                  <p className="text-gray-600">Şirket içi eğitimler, konferanslara katılım ve gelişim programları ile kariyer yolculuğunuzu destekliyoruz.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-[#d4ff00] rounded-full p-2 mr-3 flex-shrink-0">
                  <Star className="w-4 h-4 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-medium">Sağlık Sigortası</h4>
                  <p className="text-gray-600">Özel sağlık sigortası ve düzenli sağlık kontrolleri sağlıyoruz.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-[#d4ff00] rounded-full p-2 mr-3 flex-shrink-0">
                  <Star className="w-4 h-4 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-medium">Etkinlik Biletleri</h4>
                  <p className="text-gray-600">Çalışanlarımıza ücretsiz veya indirimli etkinlik biletleri sağlıyoruz.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-3 flex-shrink-0" />
              <span>Başvuru Süreci</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-base pl-8">
              Başvurularınızı <a href="mailto:kariyer@eventify.com" className="text-[#d4ff00] hover:underline">kariyer@eventify.com</a> adresine 
              özgeçmişiniz ve neden Eventify'da çalışmak istediğinizi anlatan bir ön yazı ile gönderebilirsiniz. 
              Başvurunuz incelendikten sonra uygun adaylara 1 hafta içinde dönüş yapılacaktır.
            </p>
          </div>
        </div>
      </div>
    )
  },
  contact: {
    title: 'İletişim',
    icon: <Mail className="w-6 h-6 text-[#d4ff00]" />,
    content: (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-base">
            Eventify ekibi olarak sorularınızı yanıtlamak, görüşlerinizi dinlemek ve işbirliği fırsatlarını değerlendirmek için buradayız. 
            Aşağıdaki kanallardan bize ulaşabilirsiniz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <Mail className="w-5 h-5 text-[#d4ff00] mr-2" />
              E-posta İletişim
            </h3>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Genel Bilgi & Destek</p>
                <a href="mailto:info@eventify.com" className="text-[#d4ff00] hover:underline block mt-1">info@eventify.com</a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Bilet Sorunları</p>
                <a href="mailto:bilet@eventify.com" className="text-[#d4ff00] hover:underline block mt-1">bilet@eventify.com</a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">İş Birlikleri</p>
                <a href="mailto:partner@eventify.com" className="text-[#d4ff00] hover:underline block mt-1">partner@eventify.com</a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Basın İlişkileri</p>
                <a href="mailto:basin@eventify.com" className="text-[#d4ff00] hover:underline block mt-1">basin@eventify.com</a>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <Phone className="w-5 h-5 text-[#d4ff00] mr-2" />
              Telefon İletişim
            </h3>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Müşteri Hizmetleri</p>
                <p className="text-[#d4ff00] block mt-1">0850 123 45 67</p>
                <p className="text-xs text-gray-500">Hafta içi: 09:00 - 18:00</p>
                <p className="text-xs text-gray-500">Hafta sonu: 10:00 - 16:00</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Kurumsal İletişim</p>
                <p className="text-[#d4ff00] block mt-1">0212 456 78 90</p>
                <p className="text-xs text-gray-500">Hafta içi: 09:00 - 18:00</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 text-[#d4ff00] mr-2" />
              Ofislerimiz
            </h3>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">İstanbul (Merkez Ofis)</p>
                <p className="text-gray-800 mt-1">Levent Mah. Büyükdere Cad. No:123 Şişli/İstanbul</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ankara</p>
                <p className="text-gray-800 mt-1">Kızılay Mah. Atatürk Bulvarı No:45 Çankaya/Ankara</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">İzmir</p>
                <p className="text-gray-800 mt-1">Alsancak Mah. Cumhuriyet Bulvarı No:67 Konak/İzmir</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <ArrowRight className="w-5 h-5 text-[#d4ff00] mr-2" />
              Sosyal Medya
            </h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <div className="bg-[#d4ff00]/20 p-2 rounded-full mr-3">
                  <Instagram className="w-5 h-5 text-gray-700" />
                </div>
                <a href="https://instagram.com/eventify" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#d4ff00] transition-colors">@eventify</a>
              </div>
              <div className="flex items-center">
                <div className="bg-[#d4ff00]/20 p-2 rounded-full mr-3">
                  <Twitter className="w-5 h-5 text-gray-700" />
                </div>
                <a href="https://twitter.com/eventify" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#d4ff00] transition-colors">@eventify</a>
              </div>
              <div className="flex items-center">
                <div className="bg-[#d4ff00]/20 p-2 rounded-full mr-3">
                  <Facebook className="w-5 h-5 text-gray-700" />
                </div>
                <a href="https://facebook.com/eventify" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#d4ff00] transition-colors">@eventifyTurkiye</a>
              </div>
              <div className="flex items-center">
                <div className="bg-[#d4ff00]/20 p-2 rounded-full mr-3">
                  <Youtube className="w-5 h-5 text-gray-700" />
                </div>
                <a href="https://youtube.com/eventify" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#d4ff00] transition-colors">Eventify Türkiye</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    icon: <FileText className="w-6 h-6 text-[#d4ff00]" />,
    content: (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-600 leading-relaxed text-base">
            Eventify olarak kişisel verilerinizin güvenliği konusunda büyük hassasiyet gösteriyoruz. 
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında hazırlanmıştır.
          </p>
        </div>
        
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">1. Veri Sorumlusu</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-4">
              Eventify A.Ş. ("Eventify"), KVKK ve ilgili mevzuat kapsamında "veri sorumlusu" sıfatına sahiptir. 
              Merkez adresi: Levent Mah. Büyükdere Cad. No:123 Şişli/İstanbul'dur.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">2. Toplanan Kişisel Veriler</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-4 mb-3">
              Hizmetlerimizden faydalanmanız kapsamında aşağıdaki kişisel verileriniz işlenmektedir:
            </p>
            <ul className="list-disc pl-10 space-y-2 text-gray-600">
              <li>Kimlik bilgileri (ad, soyad, T.C. kimlik numarası)</li>
              <li>İletişim bilgileri (e-posta adresi, telefon numarası, adres)</li>
              <li>Ödeme bilgileri (kredi kartı bilgileri, fatura bilgileri)</li>
              <li>Hesap bilgileri (kullanıcı adı, şifre)</li>
              <li>Lokasyon bilgileri (konum, yakındaki etkinlikleri göstermek için kullanılır)</li>
              <li>İşlem bilgileri (satın alınan biletler, katılınan etkinlikler)</li>
              <li>Pazarlama tercihleri (e-posta bildirimleri, SMS bildirimleri)</li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">3. Kişisel Verilerin İşlenme Amaçları</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-4 mb-3">
              Kişisel verileriniz aşağıdaki amaçlar doğrultusunda işlenmektedir:
            </p>
            <ul className="list-disc pl-10 space-y-2 text-gray-600">
              <li>Hizmetlerimizin sunulması ve iyileştirilmesi</li>
              <li>Üyelik oluşturulması ve yönetilmesi</li>
              <li>Bilet satın alma işlemlerinin gerçekleştirilmesi</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi ve faturalandırma</li>
              <li>Size özel kampanya, fırsat ve duyuruların iletilmesi (izin vermeniz halinde)</li>
              <li>Müşteri memnuniyeti ve şikayetlerin çözümlenmesi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Güvenlik ve dolandırıcılığın önlenmesi</li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">4. Kişisel Verilerin Aktarılması</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-4">
              Kişisel verileriniz, hizmetlerimizi sunmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla, 
              gerekli güvenlik önlemleri alınarak aşağıdaki taraflara aktarılabilir:
            </p>
            <ul className="list-disc pl-10 space-y-2 text-gray-600 mt-3">
              <li>Etkinlik organizatörleri (etkinlik katılımcı bilgileri)</li>
              <li>Ödeme hizmeti sağlayıcıları</li>
              <li>Hizmet aldığımız tedarikçiler ve iş ortakları</li>
              <li>Hukuken yetkili kamu kurumları ve özel kişiler</li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">5. Veri Sahibi Olarak Haklarınız</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-4 mb-3">
              KVKK'nın 11. maddesi uyarınca kişisel verilerinize ilişkin aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-10 space-y-2 text-gray-600">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
              <li>KVKK mevzuatında öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              <li>Kişisel verilerinizin düzeltilmesi, silinmesi veya yok edilmesi halinde bu işlemlerin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</li>
            </ul>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">6. Haklarınızı Nasıl Kullanabilirsiniz?</h3>
            <p className="text-gray-600 leading-relaxed text-base pl-4">
              Yukarıda belirtilen haklarınızı kullanmak için <a href="mailto:kvkk@eventify.com" className="text-[#d4ff00] hover:underline">kvkk@eventify.com</a> adresine 
              e-posta gönderebilir veya Levent Mah. Büyükdere Cad. No:123 Şişli/İstanbul adresine yazılı başvuruda bulunabilirsiniz. 
              Başvurunuzda ad, soyad ve başvurunuz yazılı ise imza, Türkiye Cumhuriyeti vatandaşları için T.C. kimlik numarası, 
              yabancılar için uyruğu, pasaport numarası veya varsa kimlik numarası, tebligata esas yerleşim yeri veya iş adresi, 
              bildirime esas elektronik posta adresi, telefon ve faks numarası, talep konusu bulunması zorunludur.
            </p>
          </div>
        </div>
      </div>
    )
  }
};

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, type }) => {
  const [showModal, setShowModal] = useState(false);
  const content = modalContents[type];
  
  // Modal açılırken animasyon için
  useEffect(() => {
    if (isOpen) {
      // Kısa bir gecikme ile modalı göster (animasyon için)
      const timer = setTimeout(() => {
        setShowModal(true);
        document.body.style.overflow = 'hidden'; // Scroll'u engelle
      }, 10);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = ''; // Scroll'u serbest bırak
      };
    } else {
      setShowModal(false);
      document.body.style.overflow = ''; // Scroll'u serbest bırak
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-xl overflow-hidden w-full max-w-4xl flex shadow-xl transition-all duration-300 ${
          showModal ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
        }`}
      >
        {/* Sol taraf - Marka ve Bilgi */}
        <div className="w-2/5 bg-gradient-to-br from-[#d4ff00] to-[#8faf00] p-8 text-gray-900 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-3">eventify</h2>
            <p className="text-xl font-medium mb-6">Yeni Nesil Etkinlik Platformu</p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Neler Sunuyoruz?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Music className="w-5 h-5" />
                </div>
                <span>Tüm etkinlikler tek platformda</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <span>Özel indirimler ve kampanyalar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Heart className="w-5 h-5" />
                </div>
                <span>Favori etkinliklerinizi kaydedin</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <span>Mobil biletiniz her an yanınızda</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="italic text-gray-800">
              "Tüm etkinlikleri takip etmek artık çok kolay!"
            </p>
            <p className="text-right mt-2">- Ayşe Y.</p>
          </div>
        </div>
        
        {/* Sağ taraf - İçerik */}
        <div className="w-3/5 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-[#d4ff00] rounded-lg">
                {content.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar pr-2" style={{ maxHeight: 'calc(85vh - 140px)' }}>
            {content.content}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#d4ff00] text-gray-900 rounded-lg hover:bg-[#c4ef00] transition-colors font-medium flex items-center shadow-sm hover:shadow"
            >
              Kapat
              <X className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 