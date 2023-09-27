/* eslint-disable @typescript-eslint/ban-types */
import { useState, useEffect } from 'react';

import { useViewport } from '../../helpers/useViewport';

import { ArrowLeft } from '../../img/ArrowLeft';
import { ArrowRight } from '../../img/ArrowRight';
import { Phone } from '../../types/phone';

import './productsslider.scss';
import { ProductCard } from '../ProductCard';
import {
  getBrandNewProducts,
  getHotPriceProducts,
  getPhones,
} from '../../api/products';
import { Loader } from '../Loader';

type Props = {
  title: string;
};

export const ProductSlider: React.FC<Props> = ({ title }) => {
  const {
    width, isTabletLaptopSize, isMobileSize, isDesktopSize,
  }
    = useViewport();

  const [products, setProducts] = useState<Phone[]>([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  const isRightDisabled = (itemIndex + 1) * itemsVisible >= products.length;
  const isLeftDisabled = (itemIndex - 1) * itemsVisible <= 0;

  useEffect(() => {
    let fetchFunction;

    switch (title) {
      case 'Hot prices':
        fetchFunction = getHotPriceProducts;
        break;
      case 'Brand new models':
        fetchFunction = getBrandNewProducts;
        break;
      default:
        fetchFunction = getPhones;
    }

    fetchFunction()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setItemIndex(0);

    if (isMobileSize) {
      setItemsVisible(1);
    } else if (isTabletLaptopSize) {
      setItemsVisible(2);
    } else if (isDesktopSize) {
      setItemsVisible(4);
    } else {
      setItemsVisible(3);
    }
  }, [width]);

  const handleLeftButton = () => {
    setItemIndex((ind) => ind - 1);
  };

  const handleRightButton = () => {
    setItemIndex((ind) => ind + 1);
  };

  return (
    <div
      className="product-slider"
      style={
        {
          '--itemIndex': itemIndex,
          '--itemsVisible': itemsVisible,
        } as React.CSSProperties
      }
    >
      <div className="product-slider__top-actions">
        <h1 className="product-slider__title">{title}</h1>

        <div className="product-slider__button-container">
          <button
            type="button"
            className="product-slider__button"
            onClick={handleLeftButton}
            disabled={isLeftDisabled}
          >
            <ArrowLeft />
          </button>

          <button
            type="button"
            className="product-slider__button"
            onClick={handleRightButton}
            disabled={isRightDisabled}
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="product-slider__slider-container">
          <div className="product-slider__slider" data-cy="cardsContainer">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onlyFullPrice={title === 'Brand new models'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
