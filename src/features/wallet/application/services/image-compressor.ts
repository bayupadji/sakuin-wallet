/**
 * Image Compressor Service for Promo Banners
 * Wajib melakukan kompresi foto banner sebelum diunggah/disimpan ke CMS.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

export interface CompressionResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  originalSizeFormatted: string;
  compressedSize: number;
  compressedSizeFormatted: string;
  savingsPercent: number;
  width: number;
  height: number;
  format: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Kompres foto banner secara wajib menggunakan HTML Canvas.
 * Mengubah ukuran gambar sesuai rasio banner panorama (maks lebar 1440px)
 * serta mengompresi kualitas gambar (default 82%) ke format WebP atau JPEG.
 */
export async function compressBannerImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1440,
    maxHeight = 320,
    quality = 0.82,
    format = 'image/webp',
  } = options;

  if (!file.type.startsWith('image/')) {
    throw new Error('Berkas yang diunggah harus berupa gambar (JPG, PNG, atau WebP).');
  }

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Gagal membaca berkas gambar. Silakan coba kembali.'));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Gambar tidak valid atau format tidak didukung browser.'));
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Hitung skala kompresi proporsional
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }

        if (height > maxHeight && width / height < 4) {
          const ratio = maxHeight / height;
          height = maxHeight;
          width = Math.round(width * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Konteks Canvas 2D tidak tersedia di browser Anda.'));
          return;
        }

        // Pengaturan penghalusan gambar berkualitas tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Bersihkan canvas dan gambar ulang
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke blob terkompresi
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal melakukan kompresi gambar pada canvas.'));
              return;
            }

            const compressedSize = blob.size;
            const savingsPercent = Math.max(
              0,
              Math.round(((originalSize - compressedSize) / originalSize) * 100)
            );

            const fileExtension = format === 'image/webp' ? 'webp' : 'jpg';
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const compressedFileName = `${baseName}-compressed.${fileExtension}`;

            const compressedFile = new File([blob], compressedFileName, {
              type: format,
              lastModified: Date.now(),
            });

            const dataUrlReader = new FileReader();
            dataUrlReader.onloadend = () => {
              const dataUrl = dataUrlReader.result as string;

              resolve({
                file: compressedFile,
                dataUrl,
                originalSize,
                originalSizeFormatted: formatBytes(originalSize),
                compressedSize,
                compressedSizeFormatted: formatBytes(compressedSize),
                savingsPercent,
                width,
                height,
                format: format === 'image/webp' ? 'WebP (Optimal)' : 'JPEG (Optimal)',
              });
            };

            dataUrlReader.readAsDataURL(blob);
          },
          format,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
