# Hamza Hoca – Özbekçe Çeviri Pratiği

Vercel üzerinde çalışan yapay zeka destekli dil öğrenme uygulaması.

## Kurulum (10 dakika)

### 1. GitHub'a yükle

```bash
git init
git add .
git commit -m "ilk yükleme"
git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADIN.git
git push -u origin main
```

### 2. Vercel'e bağla

1. [vercel.com](https://vercel.com) adresine git → **GitHub ile giriş yap**
2. **Add New Project** → GitHub reposunu seç
3. **Deploy** butonuna bas

### 3. API Key ekle (en önemli adım)

Vercel dashboard'da:

1. Projeye tıkla → **Settings** → **Environment Variables**
2. Şunu ekle:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (Anthropic'ten aldığın key)
3. **Save** → **Redeploy**

### 4. Hazır!

Vercel sana `https://proje-adin.vercel.app` adresi verir.  
Bu adresi öğrencilerinle paylaşabilirsin.

---

## Proje yapısı

```
hamza-hoca/
├── api/
│   └── check.js        ← Vercel Edge Function (API key burada gizli)
├── public/
│   └── index.html      ← Uygulama arayüzü
└── vercel.json         ← Vercel ayarları
```

## API Key nereden alınır?

[console.anthropic.com](https://console.anthropic.com) → **API Keys** → **Create Key**
