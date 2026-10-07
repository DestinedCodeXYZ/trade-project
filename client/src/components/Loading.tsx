import './Loading.css';
import loadingGif from '../assets/work-in-progress.png'

export default function Loading() {
    return (
      <div className="loading-container">
         <img className='loading-spinner' src={loadingGif} alt="Loading..." />
      </div>  
    )
}