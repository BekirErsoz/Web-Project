import supabase from '../utils/supabase';
import { UserProfile } from '../types/supabase';

const PROFILES_TABLE = 'profiles';

/**
 * Kullanıcı profilini getirir
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Kullanıcı profili getirme hatası:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Kullanıcı profili getirirken beklenmeyen hata:', err);
    return null;
  }
};

/**
 * Kullanıcı profilini günceller
 */
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    // Mevcut profil var mı kontrol et
    const { data: existingProfile } = await supabase
      .from(PROFILES_TABLE)
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    let operation;
    if (existingProfile) {
      // Profil varsa güncelle
      operation = supabase
        .from(PROFILES_TABLE)
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      // Profil yoksa yeni oluştur
      operation = supabase
        .from(PROFILES_TABLE)
        .insert({
          user_id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    const { data, error } = await operation.select().single();

    if (error) {
      console.error('Profil güncelleme hatası:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Profil güncellenirken beklenmeyen hata:', err);
    return null;
  }
};

/**
 * Profil fotoğrafı yükle
 */
export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `profiles/${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Profil resmi yükleme hatası:', uploadError);
      return null;
    }

    // Public URL oluştur
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Profil güncelle
    await updateUserProfile(userId, { avatar_url: data.publicUrl });

    return data.publicUrl;
  } catch (err) {
    console.error('Profil resmi yüklenirken beklenmeyen hata:', err);
    return null;
  }
}; 