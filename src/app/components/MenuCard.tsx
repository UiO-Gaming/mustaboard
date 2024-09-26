import React from "react";
import menuItems from "../../public/menuItems.json";
import MenuSection from "./MenuSection";

function MenuCard() {
  return (
    <div className="flex flex-1 flex-col bg-foreground rounded-lg p-3 gap-3 h-full">
      {/*top container*/}
      <div className="flex flex-row flex-1 rounded-lg gap-3">
        {/*left-side box, alcohol*/}
        <MenuSection title="Alcohol" items={menuItems.Alcohol}></MenuSection>

        {/*right-side container containing 2 boxes*/}
        <div className="flex flex-1 flex-col rounded-lg gap-3">
          {/*top box*/}
          <MenuSection title="Soda and Energy Drinks" items={menuItems.Soda}></MenuSection>

          {/*bottom box*/}
          <div className="flex-1 bg-primary rounded-lg p-3">
            <h1 className="text-headers">Info</h1>
          </div>
        </div>
      </div>

      {/*bottom container and box*/}
      <MenuSection title="Snacks and Sweets" items={menuItems.Food}></MenuSection>
    </div>
  );
}

export default MenuCard;
