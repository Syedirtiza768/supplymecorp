import { Fragment } from 'react'
import { Tab } from '@headlessui/react'
import TabComponentItem from './TabComponentItem'

const TabComponent = () => {
  return (
    <Tab.Group>
    <Tab.List className="">
      <Tab as={Fragment} className="outline-none py-3 px-8 mr-3 min-w-full lg:min-w-fit">
        {({ selected }) => (
          <button
            className={`
              border border-second ${selected ? 'text-white bg-second  ' : 'bg-white text-second border-gray'}
            `}
          >
            DESCRIPTION
          </button>
        )}
      </Tab> 
      <Tab as={Fragment} className="outline-none py-3 px-8 mr-3 min-w-full lg:min-w-fit">
        {({ selected }) => (
          <button
            className={`
              border border-second ${selected ? 'text-white bg-second  ' : 'bg-white text-second border-gray'}
            `}
          >
            SPECIFICATION
          </button>
        )}
      </Tab> 

      <Tab as={Fragment} className="outline-none py-3 px-8 mr-3 min-w-full lg:min-w-fit">
        {({ selected }) => (
          <button
            className={`
              border border-second ${selected ? 'text-white bg-second  ' : 'bg-white text-second border-gray'}
            `}
          >
            REVIEWS (1)
          </button>
        )}
      </Tab> 
            
    </Tab.List>
    
    <Tab.Panels>
      <Tab.Panel>
        <TabComponentItem content={"Dummy Data 1"} />
      </Tab.Panel>
      <Tab.Panel>
        <TabComponentItem content={"Dummy Data 2"} />
      </Tab.Panel>
      <Tab.Panel>
        <TabComponentItem content={"Dummy Data 3"} />
      </Tab.Panel>      
    </Tab.Panels>

  </Tab.Group>
  )
}

export default TabComponent