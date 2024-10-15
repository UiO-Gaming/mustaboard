interface MenuItem {
  name: string;
  price: number;
}

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
    return (
      <div className="flex flex-1 flex-col rounded-lg gap-3">
        {/* top box */}
        <div className="flex-1 bg-primary rounded-lg p-3">
          <h1 className="text-headers">{title}</h1>
          <div className="flex flex-row place-content-between">
            {/* item names */}
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <div key={item.name} className="flex flex-row">
                  <p className="text-headers">{item.name}</p>
                </div>
              ))}
            </div>
  
            {/* item prices */}
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <div key={item.name} className="flex flex-row justify-end">
                  <p className="text-p text-right">kr {item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default MenuSection;  