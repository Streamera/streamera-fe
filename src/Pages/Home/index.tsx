import './styles.scss'
import { Link } from 'react-router-dom';

const Page = () => {
    return (
        <div className='home-page'>
            <div className="link-button-container">
                <Link to="/overlay" className='link-button'>Overlay</Link>
                <Link to="/history" className='link-button'>History</Link>
                <Link to="/integration" className='link-button'>Integration</Link>
                <Link to="/profile" className='link-button'>Profile</Link>
            </div>
        </div>
    );
}

export default Page;