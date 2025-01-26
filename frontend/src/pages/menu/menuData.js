const initialMenu = [
  {
    name: 'Single Espresso',
    price: '£2.20',
    video: 'https://www.youtube.com/embed/Ftuf9oKRtJo?enablejsapi=1',
  },
  {
    name: 'Double Espresso',
    price: '£2.60',
    video: 'https://www.youtube.com/embed/47K5FbZT13A?enablejsapi=1',
  },
  {
    name: 'Long Black-Americano',
    price: '£3.00',
    video: 'https://www.youtube.com/embed/OgsGeFRLzVY?enablejsapi=1',
  },
  {
    name: 'Decaf Coffee',
    price: '£3.00',
    video: 'https://www.youtube.com/embed/placeholder4?enablejsapi=1',
  },
  {
    name: 'Flat White',
    price: '£3.85',
    video: 'https://www.youtube.com/embed/--gN7MNAkd8?enablejsapi=1',
  },
  {
    name: 'Cappuccino',
    price: '£3.70',
    video: 'https://www.youtube.com/embed/om_rAraXRqM?enablejsapi=1',
  },
  {
    name: 'Coffee Latte',
    price: '£3.70',
    video: 'https://www.youtube.com/embed/IAZR4fN9y4A?enablejsapi=1',
  },
  {
    name: 'Macchiato',
    price: '£3.70',
    video: 'https://www.youtube.com/embed/aMq5OY2wYRg?enablejsapi=1',
  },
  {
    name: 'Tea, Earl Grey, Pepper Mint',
    price: '£2.60',
    video: 'https://www.youtube.com/embed/mXmDkh-MSdE?enablejsapi=1',
  },
  {
    name: 'Hot Chocolate',
    price: '£3.80',
    video: 'https://www.youtube.com/embed/Ief4HjAx5FA?enablejsapi=1',
  },
  {
    name: 'Chai Latte',
    price: '£3.80',
    video: 'https://www.youtube.com/embed/placeholder11?enablejsapi=1',
  },
  {
    name: 'Milk, Decaf, Soy Milk',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/MIPP2Szu_rc?enablejsapi=1',
  },
  {
    name: 'Oat Milk',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/CKkkHU33pn8?enablejsapi=1',
  },
  {
    name: 'Reduced Fat Milk',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/PbsXlH1_ZUA?enablejsapi=1',
  },
  {
    name: 'Almond Milk',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/_ZjdztRBJgM?enablejsapi=1',
  },
  {
    name: 'Coconut Milk',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/5Lii_cmMEgQ?enablejsapi=1',
  },
  {
    name: 'Low Fat',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/cQk5Z2wxrg0?enablejsapi=1',
  },
  {
    name: 'Fat Free',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/BVn3kF1YWb4?enablejsapi=1',
  },
  {
    name: 'White Sugar',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/mjd9tsmeb18?enablejsapi=1',
  },
  {
    name: 'Brown Sugar',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/2YhxUA3SePo?enablejsapi=1',
  },
  {
    name: 'Sweetener',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/bhY3Dd1Gcas?enablejsapi=1',
  },
  {
    name: 'Chocolate Powder',
    price: '£0.00',
    video: 'https://www.youtube.com/embed/rPrxoMrxq0c?enablejsapi=1',
  },
  {
    name: 'Still Water',
    price: '£1.90',
    video: 'https://www.youtube.com/embed/PKUD_dB-GWE?enablejsapi=1',
  },
  {
    name: 'Sparkling Water',
    price: '£1.90',
    video: 'https://www.youtube.com/embed/TGRV34qRIXk?enablejsapi=1',
  },
  {
    name: 'Lemonade Lime',
    price: '£3.00',
    video: 'https://www.youtube.com/embed/9782LAOKxzM?enablejsapi=1',
  },
  {
    name: 'Lemonade Blood Orange',
    price: '£3.00',
    video: 'https://www.youtube.com/embed/Mh_x76t2F8E?enablejsapi=1',
  },
  {
    name: 'Lemonade Ginger',
    price: '£3.00',
    video: 'https://www.youtube.com/embed/MDhUoUglAu8?enablejsapi=1',
  },
  {
    name: 'Lemonade Passion Fruit',
    price: '£3.00',
    video: 'https://www.youtube.com/embed/placeholder28?enablejsapi=1',
  },
  {
    name: 'Croissant',
    price: '£2.70',
    video: 'https://www.youtube.com/embed/y5fKVS0ngEg?enablejsapi=1',
  },
  {
    name: 'Almond Croissant',
    price: '£2.90',
    video: 'https://www.youtube.com/embed/y5fKVS0ngEg?enablejsapi=1',
  },
  {
    name: 'Peanut Butter Blondie Vegan',
    price: '£2.80',
    video: 'https://www.youtube.com/embed/placeholder31?enablejsapi=1',
  },
  {
    name: 'Tiramisu Sandwich Cookie',
    price: '£2.80',
    video: 'https://www.youtube.com/embed/placeholder32?enablejsapi=1',
  },
  {
    name: 'Plain Nata',
    price: '£2.40',
    video: 'https://www.youtube.com/embed/placeholder33?enablejsapi=1',
  },
  {
    name: 'Chocolate Chip Cookie Vegan',
    price: '£2.80',
    video: 'https://www.youtube.com/embed/placeholder34?enablejsapi=1',
  },
  {
    name: 'Muffin',
    price: '£2.90',
    video: 'https://www.youtube.com/embed/tQauT1Ch7-Y?enablejsapi=1',
  },
];

export default initialMenu;
