import Link from 'next/link'

const TabComponentItem = ({content}) => {
  return (
    <div className=' border border-second min-h-[150px] px-10 py-5'>
        <p>{content}</p>        
        
    </div>
  )
}

export default TabComponentItem