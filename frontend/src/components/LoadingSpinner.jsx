import { Loader } from 'lucide-react'

const LoadingSpinner = ({ size }) => {
  return (
    <Loader size={size} className='animate-spin flex justify-center'/>
  )
}

export default LoadingSpinner