import Image, { StaticImageData } from "next/image";

type LayoutArticlePropsType = {
  children: React.ReactNode;
  imageAlt: string;
  imageUrl: string | StaticImageData;
  imageLabel?: React.ReactNode;
}

export default function LayoutArticle({imageUrl, imageAlt, imageLabel, children}: LayoutArticlePropsType) {
  return (
    <>
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-3 items-start">
          {/* image */}
          <div className="w-full md:w-600 border border-gray-500 rounded-lg shadow-md p-2">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={800}
              height={500}
              className="w-full h-auto border border-gray-500 rounded-lg"
            />

            <p className="mt-3 text-sm text-gray-600">
              {imageLabel}
            </p>
          </div>

          {/* text */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
