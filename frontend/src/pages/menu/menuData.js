const initialMenu = [
  {
    name: 'Single Espresso',
    video: 'https://www.youtube.com/embed/Ftuf9oKRtJo?enablejsapi=1',
  },
  {
    name: 'Double Espresso',
    video: 'https://www.youtube.com/embed/47K5FbZT13A?enablejsapi=1',
  },
  {
    name: 'Turkish Coffee',
    video: 'https://www.youtube.com/embed/TYMBygTxUgY?enablejsapi=1',
  },
  {
    name: 'Americano',
    video: 'https://www.youtube.com/embed/EUzf2eZyySA?enablejsapi=1',
  },
  {
    name: 'Decaf Coffee',
    video: 'https://www.youtube.com/embed/yVe38ZJ4Fb0?enablejsapi=1',
  },
  {
    name: 'Filter Coffee',
    video: 'https://www.youtube.com/embed/hGGagide30M?enablejsapi=1',
  },
  {
    name: 'Flat White',
    video: 'https://www.youtube.com/embed/cLClvpC7Wlw?enablejsapi=1',
  },
  {
    name: 'Cappuccino',
    video: 'https://www.youtube.com/embed/om_rAraXRqM?enablejsapi=1',
  },
  {
    name: 'Coffee Latte',
    video: 'https://www.youtube.com/embed/f27JOKn4G0M?enablejsapi=1',
  },
  {
    name: 'Macchiato',
    video: 'https://www.youtube.com/embed/J0QlU1TioAg?enablejsapi=1',
  },
  {
    name: 'Breakfast Tea',
    video: 'https://www.youtube.com/embed/cJraaj-G23U?enablejsapi=1',
  },
  {
    name: 'Earl Grey',
    video: 'https://www.youtube.com/embed/VmIoqq3qNfE?enablejsapi=1',
  },
  {
    name: 'Pepper Mint Tea',
    video: 'https://www.youtube.com/embed/cjCoADGVv8Q?enablejsapi=1',
  },
  {
    name: 'Hot Chocolate',
    video: 'https://www.youtube.com/embed/Ief4HjAx5FA?enablejsapi=1',
  },
  {
    name: 'Chai Latte',
    video: 'https://www.youtube.com/embed/zq9Y1PWsZtE?enablejsapi=1',
  },
  {
    name: 'Normal Milk',
    video: 'https://www.youtube.com/embed/tRLiTM4St90?enablejsapi=1',
  },
  {
    name: 'Skimmed Milk',
    video: 'https://www.youtube.com/embed/Bfh8wmI_4YQ?enablejsapi=1',
  },
  {
    name: 'Oat Milk',
    video: 'https://www.youtube.com/embed/CKkkHU33pn8?enablejsapi=1',
  },
  {
    name: 'Soy Milk',
    video: 'https://www.youtube.com/embed/malXpS5nntg?enablejsapi=1',
  },
  {
    name: 'Almond Milk',
    video: 'https://www.youtube.com/embed/_ZjdztRBJgM?enablejsapi=1',
  },
  {
    name: 'Coconut Milk',
    video: 'https://www.youtube.com/embed/5Lii_cmMEgQ?enablejsapi=1',
  },
  {
    name: 'White Sugar',
    video: 'https://www.youtube.com/embed/mjd9tsmeb18?enablejsapi=1',
  },
  {
    name: 'Brown Sugar',
    video: 'https://www.youtube.com/embed/2YhxUA3SePo?enablejsapi=1',
  },
  {
    name: 'Sweetener',
    video: 'https://www.youtube.com/embed/bhY3Dd1Gcas?enablejsapi=1',
  },
  {
    name: 'Chocolate Powder',
    video: 'https://www.youtube.com/embed/rPrxoMrxq0c?enablejsapi=1',
  },
  {
    name: 'Still Water',
    video: 'https://www.youtube.com/embed/PKUD_dB-GWE?enablejsapi=1',
  },
  {
    name: 'Sparkling Water',
    video: 'https://www.youtube.com/embed/TGRV34qRIXk?enablejsapi=1',
  },
  {
    name: 'Lemonade Lime',
    video: 'https://www.youtube.com/embed/9782LAOKxzM?enablejsapi=1',
  },
  {
    name: 'Lemonade Blood Orange',
    video: 'https://www.youtube.com/embed/Mh_x76t2F8E?enablejsapi=1',
  },
  {
    name: 'Lemonade Ginger',
    video: 'https://www.youtube.com/embed/MDhUoUglAu8?enablejsapi=1',
  },
  {
    name: 'Lemonade Passion Fruit',
    video: 'https://www.youtube.com/embed/j78KP8YF_b8?enablejsapi=1',
  },
  {
    name: 'Kombucha Citro Hops',
    video: 'https://www.youtube.com/embed/Q1N6Fx3sXn0?enablejsapi=1',
  },
  {
    name: 'Kombucha Ginger&Hibiscus',
    video: 'https://www.youtube.com/embed/Q1N6Fx3sXn0?enablejsapi=1',
  },
  {
    name: 'Croissant',
    video: 'https://www.youtube.com/embed/y5fKVS0ngEg?enablejsapi=1',
  },
  {
    name: 'Pain Au Chocolat',
    video: 'https://www.youtube.com/embed/lHgwZco2fW8?enablejsapi=1',
  },
  {
    name: 'Apricot Danish',
    video: 'https://www.youtube.com/embed/Urk63YQwS3M?enablejsapi=1',
  },
  {
    name: 'Pain Aux Raisins',
    video: 'https://www.youtube.com/embed/eZZwXQauPy4?enablejsapi=1',
  },
  {
    name: 'Cinnamon Bun',
    video: 'https://www.youtube.com/embed/qzDOcJTg2xE?enablejsapi=1',
  },
  {
    name: 'Chocolate&Custard Muffin',
    video: 'https://www.youtube.com/embed/lHd20tLqWls?enablejsapi=1',
  },
  {
    name: 'Matcha&Raspberry Coconut Cookie',
    video: 'https://www.youtube.com/embed/yvtS0IyVtrY?enablejsapi=1',
  },
  {
    name: 'Salted Caramel Brownie',
    video: 'https://www.youtube.com/embed/emM0j2lk0dE?enablejsapi=1',
  },
];

export default initialMenu;
