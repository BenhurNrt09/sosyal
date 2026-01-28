// Error translation helper for Turkish localization
export function translateAuthError(errorMessage: string): string {
    // Common Supabase/Auth error translations
    const translations: Record<string, string> = {
        "Invalid login credentials": "Geçersiz giriş bilgileri",
        "Email not confirmed": "E-posta onaylanmamış",
        "User already registered": "Kullanıcı zaten kayıtlı",
        "Invalid email": "Geçersiz e-posta adresi",
        "Password should be at least 6 characters": "Şifre en az 6 karakter olmalıdır",
        "User not found": "Kullanıcı bulunamadı",
        "Email already registered": "E-posta zaten kayıtlı",
        "Signup requires a valid password": "Kayıt için geçerli bir şifre gereklidir",
        "Unable to validate email address: invalid format": "E-posta adresi doğrulanamadı: geçersiz format",
        "Database error saving new user": "Yeni kullanıcı kaydedilirken veritabanı hatası",
        "Email link is invalid or has expired": "E-posta bağlantısı geçersiz veya süresi dolmuş",
        "Token has expired or is invalid": "Token süresi dolmuş veya geçersiz",
        "New password should be different from the old password": "Yeni şifre eskisinden farklı olmalıdır",
    };

    // Check for exact matches first
    if (translations[errorMessage]) {
        return translations[errorMessage];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(translations)) {
        if (errorMessage.includes(key)) {
            return value;
        }
    }

    // Return generic error message if no match found
    return "Bir hata oluştu. Lütfen tekrar deneyin.";
}
