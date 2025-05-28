import React from 'react';
import Carousel from '../components/Carousel';
import ProductCard from '../components/Prod_card.jsx';

function Home() {
  return (
    <div className='bg-slate-100 w-full flex flex-col items-center'>
      <div className="flex flex-col p-4 max-w-7xl w-2/3">
        <Carousel />
        <h2 className='my-10 font-semibold text-center'>Checkout Our New Products</h2>
        <div className='flex-row justify-center gap-4'>
          <ProductCard />
        </div>
      </div>
    </div>
  );
}

export default Home;