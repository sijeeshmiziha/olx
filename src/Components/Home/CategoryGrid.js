import React from 'react';
import { getCategoriesForHome } from '../../data/categories';
import './CategoryGrid.css';

const ICON_MAP = {
  cars: 'car',
  bikes: 'motorcycle',
  motorcycles: 'motorcycle',
  'mobile-phones': 'mobile',
  mobiles: 'mobile',
  vehicles: 'car',
  properties: 'house',
  property: 'house',
  'electronics-appliances': 'electronics',
  electronics: 'electronics',
  'commercial-vehicles-spares': 'truck',
  jobs: 'jobs',
  furniture: 'house',
  'home-garden': 'house',
  fashion: 'house',
  pets: 'house',
  'books-sports-hobbies': 'house',
  services: 'truck',
  kids: 'house',
  'tools-machinery': 'truck',
  'music-instruments': 'house',
  rent: 'rent',
  commercial: 'truck',
  scooters: 'scooter',
  houses: 'house',
};

function CategoryGrid({ onSelectCategory }) {
  const categories = getCategoriesForHome();

  const handleClick = (name, id) => {
    if (onSelectCategory) {
      onSelectCategory(name, id);
    }
  };

  return (
    <div className="categoryGridWrapper">
      <div className="categoryGridStrip">
        <div className="categoryGridScroll">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className="categoryGridItem"
              onClick={() => handleClick(cat.name, cat.id)}
            >
              <div
                className={`categoryGridIcon categoryIcon_${ICON_MAP[cat.id] || 'house'}`}
              >
                {ICON_MAP[cat.id] ? (
                  <CategoryIcon iconType={ICON_MAP[cat.id]} />
                ) : (
                  <span className="categoryGridEmoji">{cat.icon}</span>
                )}
              </div>
              <span className="categoryGridName">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ iconType }) {
  switch (iconType) {
    case 'car':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M744.747 124.16l38.4 33.28 36.267 258.987h76.586c35.328 0 64 28.672 64 64v156.586l-128 98.987v117.333c0 23.552-19.072 42.667-42.667 42.667h-85.333c-23.552 0-42.667-19.115-42.667-42.667v-42.666h-298.666v42.666c0 23.552-19.115 42.667-42.667 42.667h-85.333c-23.595 0-42.667-19.115-42.667-42.667v-117.12l-128-99.2v-156.586c0-35.328 28.672-64 64-64h76.587l36.053-258.944 38.4-33.323h505.707zM320 618.667c-35.285 0-64 28.715-64 64s28.715 64 64 64 64-28.715 64-64-28.715-64-64-64zm384 0c-35.285 0-64 28.715-64 64s28.715 64 64 64 64-28.715 64-64-28.715-64-64-64zm-45.653-408.747h-292.48l-33.536 238.293h359.381l-33.365-238.293z" />
        </svg>
      );
    case 'motorcycle':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M816 810.667c-94.08 0-170.667-76.587-170.667-170.667s76.587-170.667 170.667-170.667 170.667 76.587 170.667 170.667-76.587 170.667-170.667 170.667zm0-256c-47.061 0-85.333 38.272-85.333 85.333s38.272 85.333 85.333 85.333 85.333-38.272 85.333-85.333-38.272-85.333-85.333-85.333zm-608 256c-94.08 0-170.667-76.587-170.667-170.667s76.587-170.667 170.667-170.667 170.667 76.587 170.667 170.667-76.587 170.667-170.667 170.667zm0-256c-47.061 0-85.333 38.272-85.333 85.333s38.272 85.333 85.333 85.333 85.333-38.272 85.333-85.333-38.272-85.333-85.333-85.333zm473.899-213.334h-135.232l-118.187-170.666h-172.48v85.333h124.48l69.888 101.547-113.835 155.786h-21.966c-37.248-49.92-96.512-82.133-163.234-82.133-5.931 0-11.776.341-17.536.896l122.283-159.83-59.648-86.699c-10.88-15.787-7.467-37.248 7.637-48.896l42.667-32.853c6.315-4.864 13.739-7.296 21.163-7.296 11.648 0 23.168 5.419 30.336 15.659l104.32 151.552h176.597l74.325-106.027c7.168-10.197 18.688-15.616 30.336-15.616 7.424 0 14.848 2.389 21.163 7.296l42.667 32.853c15.104 11.648 18.517 33.109 7.637 48.896l-73.381 109.696z" />
        </svg>
      );
    case 'mobile':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M704 85.333c47.128 0 85.333 38.205 85.333 85.334v682.666c0 47.129-38.205 85.334-85.333 85.334H320c-47.128 0-85.333-38.205-85.333-85.334V170.667c0-47.129 38.205-85.334 85.333-85.334h384zm0 85.334H320v682.666h384V170.667zM512 725.333c23.564 0 42.667 19.103 42.667 42.667s-19.103 42.667-42.667 42.667-42.667-19.103-42.667-42.667 19.103-42.667 42.667-42.667z" />
        </svg>
      );
    case 'house':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M512 149.333l384 256v469.334H597.333V618.667H426.667v256H128V405.333l384-256zm0 110.934L213.333 452.267v336.4h128v-256h341.334v256h128v-336.4L512 260.267z" />
        </svg>
      );
    case 'scooter':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M810.667 810.667c-94.08 0-170.667-76.587-170.667-170.667s76.587-170.667 170.667-170.667S981.333 545.92 981.333 640 904.747 810.667 810.667 810.667zm0-256c-47.104 0-85.333 38.229-85.333 85.333s38.229 85.333 85.333 85.333S896 687.104 896 640s-38.229-85.333-85.333-85.333zm-597.334 256C119.253 810.667 42.667 734.08 42.667 640S119.253 469.333 213.333 469.333 384 545.92 384 640s-76.587 170.667-170.667 170.667zm0-256C166.229 554.667 128 592.896 128 640s38.229 85.333 85.333 85.333S298.667 687.104 298.667 640s-38.229-85.333-85.334-85.333zM640 384h-85.333v85.333H469.333v-256H384v-85.333h341.333l42.667 128v128z" />
        </svg>
      );
    case 'truck':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M128 213.333h512v170.667h128l128 170.667V768h-85.333c0 70.571-57.429 128-128 128s-128-57.429-128-128H384c0 70.571-57.429 128-128 128s-128-57.429-128-128H42.667V213.333H128zm554.667 256H640v128h128l-85.333-128zM682.667 682.667c-47.104 0-85.333 38.229-85.333 85.333s38.229 85.333 85.333 85.333S768 815.104 768 768s-38.229-85.333-85.333-85.333zM256 682.667c-47.104 0-85.333 38.229-85.333 85.333S208.896 853.333 256 853.333 341.333 815.104 341.333 768s-38.229-85.333-85.333-85.333z" />
        </svg>
      );
    case 'rent':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M512 85.333l426.667 298.667v554.667H85.333V384L512 85.333zm0 116.267L170.667 430.933v422.4h682.666v-422.4L512 201.6zM554.667 512v213.333h-85.334V512h-128l170.667-170.667L682.667 512h-128z" />
        </svg>
      );
    case 'electronics':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M128 256h768v512H128V256zm0-64c-35.346 0-64 28.654-64 64v512c0 35.346 28.654 64 64 64h768c35.346 0 64-28.654 64-64V256c0-35.346-28.654-64-64-64H128zm192 576h384v64H320v-64z" />
        </svg>
      );
    case 'jobs':
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M320 298.667h384v85.333H320V298.667zm0 170.667h384v85.333H320v-85.333zm0 170.667h256v85.333H320v-85.333zM128 128v768h768V128H128zm0-64h768c35.346 0 64 28.654 64 64v768c0 35.346-28.654 64-64 64H128c-35.346 0-64-28.654-64-64V128c0-35.346 28.654-64 64-64z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 1024 1024" className="catSvg">
          <path d="M512 149.333l384 256v469.334H597.333V618.667H426.667v256H128V405.333l384-256z" />
        </svg>
      );
  }
}

export default CategoryGrid;
