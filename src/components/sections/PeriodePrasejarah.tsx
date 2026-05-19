import LayoutArticle from "../ui/LayoutArticle";
import map from "../../../public/assets/image/map.png";

export default function PeriodePrasejarah() {
  return (
    <>
      <div className="px-2 pt-3">
        <section id="periode-prasejarah" className="w-full">
          <h1 className="pb-7 text-lg md:text-xl text-gray-800 italic font-medium font-sans">Periode prasejarah</h1>

          <LayoutArticle
            imageUrl={map}
            imageAlt="Map"
            imageLabel={
              <>
                <span className="mt-3 text-sm text-gray-600">
                  Peta wilayah{" "}
                  <span className="text-blue-600">
                    Paparan Sunda
                  </span>
                  , Sahul, dan Wallacea pada kala Pleistosen.
                </span>
              </>
            }
          >
            <p className="text-gray-700 font-sans leading-relaxed text-md md:text-lg text-justify">
              Daratan Indonesia terbentuk melalui berbagai aktivitas tektonis yang sangat rumit sejak awal masa Kenozoikum (± 66 juta tahun lalu). Permukaan laut global yang turun sekitar 130 meter dibandingkan kini pada periode glasial terakhir (±115.000 – ± 11.700 tahun lalu) kemudian memunculkan tiga kawasan geografis: Daratan Sunda yang terhubung dengan benua Asia, Daratan Sahul yang terhubung dengan benua Australia, serta Kepulauan Wallacea yang diperantarai oleh lautan dalam. Sekitar 74.000 tahun yang lalu, letusan dahsyat berskala VEI-8 terjadi pada Gunung Toba (sekarang menjadi Danau Toba). Letusan tersebut konon menjadi letusan gunung berapi terbesar yang berhasil diteliti. Perubahan iklim yang ditimbulkannya diperkirakan menjadi penyebab populasi manusia modern dunia hampir seluruhnya musnah dan pergerakan migrasi manusia sempat terhenti pada subkala Pleistosen Akhir. Lalu pada akhir periode glasial terakhir (sekitar 12.000 tahun lalu), permukaan laut naik setinggi 60 meter hanya dalam kurun waktu lima milenium. Akibatnya, daratan yang lebih rendah terendam dan membentuk perairan dangkal, sementara daratan yang lebih tinggi terpisah-pisah menjadi pulau-pulau yang lebih kecil. Pulau-pulau tersebut membentuk kepulauan Indonesia seperti sekarang ini.
            </p>
          </LayoutArticle>

          <br />
          <p className="text-gray-700 font-sans leading-relaxed text-md md:text-lg text-justify">
            Dari kumpulan fosil manusia purba Homo erectus (atau manusia Jawa) dan Homo floresiensis (`manusia Flores`) yang pernah menetap di Indonesia, kuat dugaan bahwa kepulauan Indonesia telah dihuni oleh manusia purba tersebut sekurang-kurangnya antara dua juta sampai 500.000 tahun yang lalu. Manusia purba tersebut kemudian berangsur-angsur punah seiring dengan kedatangan manusia modern (Homo sapiens) di kepulauan Indonesia.
          </p>
          <br />
          <p className="text-gray-700 font-sans leading-relaxed text-md md:text-lg text-justify">
            Teori Gelombang migrasi manusia modern pertama kali sampai di kepulauan Indonesia melalui jalur darat sekitar 60.000 tahun yang lalu. Gelombang pertama ini menjadi nenek moyang dari bangsa Melanesia. Kemudian sekitar 3.500–1.500 SM, bangsa Austronesia yang berasal dari Taiwan tiba melalui jalur laut dan menetap di kepulauan Indonesia. Sebagian bangsa Melanesia yang telah ada lebih dahulu terdesak ke wilayah-wilayah timur jauh, sementara sebagian lagi berasimilasi dengan pendatang tersebut. Manusia yang menetap tersebut kemudian mengembangkan budaya bercocok tanam dan melaut.
          </p>
        </section>
      </div>
    </>
  )
}
