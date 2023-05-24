import Marquee from 'react-fast-marquee';
import '../styles.scss'
import { StudioAnnouncementParam } from './types';

const Component = ({
    text,
    speed,
    color,
    bgColor,
    theme,
    isPreview
}: StudioAnnouncementParam) => {
    
    const Cyberpunk = () => {
        return (     
            <div className="theme-component cyberpunk announcement mt-3">
                <section className="container">
                    <div className="card-container">
                        <div className="card-content">
                            <div className="card-title">
                                <Marquee
                                    speed={speed}
                                >
                                    <div className="marquee-text title">
                                        {text}
                                    </div>
                                </Marquee>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    const Regal = () => {
        return (
            <div className="theme-component regal announcement mt-3">
                <div className="card">
                    <div className="content">
                        <div className="back">
                            <div className="back-content">
                                <Marquee
                                    speed={speed}
                                >
                                    <strong className="marquee-text">
                                        {text}
                                    </strong>
                                </Marquee>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const Rainbow = () => {
        return (
            <div className="theme-component rainbow announcement mt-3 m-auto">
                <div className="card">
                    <div className="bg uwu"></div>
                    <div className="bg"></div>
                    <div className="content">
                        <Marquee
                            speed={speed}
                        >
                            <strong className="marquee-text">
                                {text}
                            </strong>
                        </Marquee>
                    </div>
                </div>
            </div>
        )
    }

    const None = () => {
        if(isPreview) {
            return (
                <div className="video-frame">
                    <Marquee
                        style={{
                            color,
                            backgroundColor: bgColor,
                        }}
                        speed={speed}
                    >
                        <div className="marquee-text">
                            {text}
                        </div>
                    </Marquee>
                </div>
            )
        }
        
        return (
            <Marquee
                style={{
                    color,
                    backgroundColor: bgColor,
                }}
                speed={speed}
            >
                <div className="marquee-text">
                    {text}
                </div>
            </Marquee>
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