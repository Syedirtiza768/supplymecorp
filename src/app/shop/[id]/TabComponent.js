import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import TabComponentItem from "./TabComponentItem";

const TabComponent = ({ product }) => {
  // Generate product specification content as HTML string
  const generateSpecifications = () => {
    if (!product) return "No specifications available";

    const specs = [];

    // Loop through all available attributes in the product
    for (let i = 1; i <= 50; i++) {
      const attrName = product[`attribute_name_${i}`];
      const attrValue = product[`attribute_value_${i}`];
      const attrUom = product[`attribute_value_uom_${i}`];

      if (attrName && attrValue) {
        specs.push({
          name: attrName,
          value: attrValue + (attrUom ? ` ${attrUom}` : ""),
        });
      }
    }

    if (specs.length === 0) return "No specifications available";

    // Create HTML table string for the specifications
    let tableHtml =
      '<div class="w-full"><table class="w-full border-collapse">';
    tableHtml += "<tbody>";

    specs.forEach((spec, index) => {
      const bgClass = index % 2 === 0 ? "bg-gray-100" : "bg-white";
      tableHtml += `<tr class="${bgClass}">`;
      tableHtml += `<td class="py-2 px-4 border border-gray-200 font-medium">${spec.name}</td>`;
      tableHtml += `<td class="py-2 px-4 border border-gray-200">${spec.value}</td>`;
      tableHtml += "</tr>";
    });

    tableHtml += "</tbody></table></div>";
    return tableHtml;
  };

  return (
    <Tab.Group>
      <Tab.List className="">
        <Tab
          as={Fragment}
          className="outline-none py-3 px-8 mr-3 min-w-full lg:min-w-fit"
        >
          {({ selected }) => (
            <button
              className={`
                border border-second ${
                  selected ? "text-primary" : "bg-white text-second border-gray"
                }
              `}
            >
              DESCRIPTION
            </button>
          )}
        </Tab>
        <Tab
          as={Fragment}
          className="outline-none py-3 px-8 mr-3 min-w-full lg:min-w-fit"
        >
          {({ selected }) => (
            <button
              className={`
                border border-second ${
                  selected
                    ? "text-primary bg-second"
                    : "bg-white text-second border-gray"
                }
              `}
            >
              SPECIFICATION
            </button>
          )}
        </Tab>

        <Tab
          as={Fragment}
          className="outline-none py-3 px-8 mr-3 min-w-full lg:min-w-fit"
        >
          {({ selected }) => (
            <button
              className={`
                border border-second ${
                  selected
                    ? "text-primary bg-second"
                    : "bg-white text-second border-gray"
                }
              `}
            >
              REVIEWS
            </button>
          )}
        </Tab>
      </Tab.List>

      <Tab.Panels>
        <Tab.Panel>
          <TabComponentItem
            content={
              product?.onlineLongDescription || "No description available."
            }
          />
        </Tab.Panel>
        <Tab.Panel>
          <TabComponentItem content={generateSpecifications()} isHTML={true} />
        </Tab.Panel>
        <Tab.Panel>
          <TabComponentItem
            content={"No reviews yet. Be the first to review this product!"}
          />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default TabComponent;
