import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import Img1 from '../assets/carousel/image1.png';
import Img2 from '../assets/carousel/image2.jpg';
import Img3 from '../assets/carousel/image3.jpg';

import '../assets/carousel/styles/carousel.css'; // <- Custom CSS for buttons

export default function Carousel() {
  const handleImageError = (e) => {
    e.target.src = Img1; // fallback
  };

  return (
    <div className="w-full rounded-lg relative z-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        className="mySwiper"
      >
        {[Img1, Img2, Img3].map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full 2xs:h-40 xs:h-56 sm:h-60 md:h-64 lg:h-96 h-96 object-fill rounded-lg"
              onError={handleImageError}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
