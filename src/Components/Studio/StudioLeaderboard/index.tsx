import { ellipsizeThis } from '../../../common/utils';
import '../styles.scss'
import { StudioLeaderboardParam } from './types';

const Component = ({
    text,
    color,
    bgColor,
    theme,
    topDonators,
    isPreview
}: StudioLeaderboardParam) => {
    
    const Cyberpunk = () => {
        return (     
            <div className="theme-component cyberpunk leaderboard">
                <section className="container">
                    <div className="card-container">
                        <div className="card-content">
                            <div className="card-title">
                                <span className="title">{text}</span>
                            </div>
                            <div className="card-footer">
                                <span className="title">
                                    <div className="row text-center">
                                        {
                                            topDonators &&
                                            topDonators.length > 0 &&
                                            topDonators.map((x, index) => (
                                                <div className='d-flex' key={`top-donator-${index}`}>
                                                    <div className="col-6 text-left">{ellipsizeThis(x.name, 10, 0)}</div>
                                                    <div className="col-6 text-right">${x.amount_usd}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    const Regal = () => {
        return (
            <div className="theme-component regal leaderboard">
                <div className="card">
                    <div className="content">
                        <div className="back">
                            <div className="back-content">
                                <strong>{text}</strong>
                                <div className="row text-center">
                                    {
                                        topDonators &&
                                        topDonators.length > 0 &&
                                        topDonators.map((x, index) => (
                                            <div className='d-flex' key={`top-donator-${index}`}>
                                                <div className="col-6 text-left">{ellipsizeThis(x.name, 10, 0)}</div>
                                                <div className="col-6 text-right">${x.amount_usd}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const Rainbow = () => {
        return (

            <div className="theme-component rainbow leaderboard mt-3 m-auto">
                <div className="card">
                    <div className="bg uwu"></div>
                    <div className="bg"></div>
                    <div className="content">
                        <strong>{text}</strong>
                        <div className="row mt-5 text-center">
                            {
                                topDonators &&
                                topDonators.length > 0 &&
                                topDonators.map((x, index) => (
                                    <div className='d-flex' key={`top-donator-${index}`}>
                                        <div className="col-6 text-left">{ellipsizeThis(x.name, 10, 0)}</div>
                                        <div className="col-6 text-right">${x.amount_usd}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const None = () => {
        if(isPreview) {
            return (
                <div className="video-frame center">
                    <div 
                        className="leaderboard-container" 
                        style={{ 
                            color, 
                            backgroundColor: bgColor, 
                        }}>
                        <span style={{marginBottom: 30}}>{text}</span>
                        <div className="row" style={{ width: 250 }}>
                            {
                                topDonators &&
                                topDonators.length > 0 &&
                                topDonators.map((x, index) => (
                                    <div className='d-flex' key={`top-donator-${index}`}>
                                        <div className="col-6 text-left">{ellipsizeThis(x.name, 10, 0)}</div>
                                        <div className="col-6 text-right">${x.amount_usd}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <>
                <strong>{text ?? "Leaderboard"}</strong>
                <div className="row mt-4">
                    {
                        topDonators &&
                        topDonators.length > 0 &&
                        topDonators.map((x, index) => (
                            <div className='d-flex' key={`top-donator-${index}`}>
                                <div className="col-6 text-left">{ellipsizeThis(x.name, 10, 0)}</div>
                                <div className="col-6 text-right">${x.amount_usd}</div>
                            </div>
                        ))
                    }
                </div>
            </>
        )
    }

    const Main = () => {
        switch(theme) {
            case "none":
                return <None />;
            case "cyberpunk":
                return <Cyberpunk />;
            case "regal":
                return <Regal />;
            case "rainbow":
                return <Rainbow />;
            default:
                return null;
        }
    }

    return <Main />;
}

export default Component;