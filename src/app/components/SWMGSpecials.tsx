interface SpecialItem {
    name: string;
    description?: string;
    price: number;
  }
  
  interface SpecialsProps {
    title: string;
    items: SpecialItem[];
  }
  
  const SWMGSpecials: React.FC<SpecialsProps> = ({ title, items }) => {
    return (
      <div className="flex-1 specials-box bg-primary rounded-lg p-3 swmg-glow">
        <h1 className="text-headers mb-2">{title}</h1>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-2 justify-between items-start"
            >
              <div className="flex flex-col">
                <p className="para">{item.name}</p>
                {item.description && (
                  <p className="parasmall text-p">{item.description}</p>
                )}
              </div>
              <div className="flex justify-end">
                <p className="para">kr {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  
  export default SWMGSpecials;
  