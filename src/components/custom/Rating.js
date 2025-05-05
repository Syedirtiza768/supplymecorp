import { AiOutlineStar, AiFillStar } from 'react-icons/ai';


const Rating = ({rating}) => {
    const stars = [1,2,3,4,5];  

return (
    <div className='flex'>
        { stars.map((item) => (
            item <= rating ? <AiFillStar key={item} className='text-golden' /> : <AiOutlineStar key={item} className='text-golden' />
        )) }
    </div>
  )
}

export default Rating
