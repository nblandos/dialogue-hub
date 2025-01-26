import MenuItem from './MenuItem';

const MenuDiv = ({ filteredMenu }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredMenu.map((item, index) => (
        <MenuItem
          key={index}
          name={item.name}
          price={item.price}
          video={item.video}
        />
      ))}
    </div>
  );
};

export default MenuDiv;
